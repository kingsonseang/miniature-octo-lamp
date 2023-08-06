import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import api from "../utils/api";
import * as Device from 'expo-device';

type AuthContextType = {
  userToken: string | null;
  isAuthenticated: () => Promise<boolean>;
  Login: (email: string, password: string) => Promise<boolean | ApiResponse | undefined>;
  Register: (
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    username: string,
    phone: string
  ) => Promise<boolean>;
  VerifyEmail: (email: string, otp: string) => Promise<boolean | ApiResponse | undefined>;
};

type ApiResponse = {
  error: boolean;
  message: string;
  emailVerified: boolean;
  token: string;
  // Add other properties if needed
};

export const AuthContext = React.createContext<AuthContextType | null>(null);

const AuthProvider: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const checkConnectivity = async () => {
    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      return setIsConnected(state.isConnected);
    });

    // Return a function that unsubscribes the event listener
    return () => unsubscribe();
  };

  useEffect(() => {
    checkConnectivity();
  }, []);

  const [userToken, setUserToken] = useState<string | null>(null);

  const isAuthenticated = async () => {
    let token = await AsyncStorage.getItem("userToken");

    setUserToken(token);

    console.log(token);

    return !!token;
  };

  useEffect(() => {
    isAuthenticated();
  }, [userToken]);

  const Login = async (email: string, password: string) => {
    await checkConnectivity()

    if (isConnected === false) {
      alert("You arent connected to the internet")
      return
    }

    await AsyncStorage.multiRemove(["userToken", "userData", "Visibility"]);

    try {
      const response = await api.post<ApiResponse>("/auth/login", {
        email: email,
        password: password,
        device: Device
      });

      console.log(response);

      if (!response.data) {
        alert("An error occurred");
        return undefined;
      }

      if (response.data?.error === true || response.data?.emailVerified === false) {
        alert(response.data?.message);
        return response.data;
      }

      await AsyncStorage.setItem("userToken", response.data.token);
      setUserToken(response.data?.token);
      return true;
    } catch (error) {
      console.error("Error logging in:", error);
      return undefined;
    }
  };

  const Register = async (
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    username: string,
    phone: string
  ) => {
    if (isConnected === false || null) {
      alert("You are not connected to the internet");
      return false;
    }

    try {
      const response = await api.post<ApiResponse>("/auth/register", {
        email: email,
        password: password,
        firstname: firstname,
        lastname: lastname,
        username: username,
        phone: phone,
      });

      if (response?.data?.error === true) {
        alert(response?.data?.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error registering:", error);
      return false;
    }
  };

  const VerifyEmail = async (email: string, otp: string) => {
    try {
      const response = await api.post<ApiResponse>("/auth/verify", {
        email: email,
        digits: otp,
      });

      console.log(response.data);

      if (!response.data) {
        alert("An error occurred");
        return undefined;
      }

      if (response.data?.error === true) {
        alert(response.data.message);
        return response.data;
      }

      await AsyncStorage.setItem("userToken", response.data.token);
      setUserToken(response.data.token);
      return true;
    } catch (error) {
      console.error("Error verifying email:", error);
      return undefined;
    }
  };

  return (
    <AuthContext.Provider
      value={{ userToken, isAuthenticated, Register, Login, VerifyEmail }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
