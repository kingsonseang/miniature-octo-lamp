import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../utils/api";

export const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  // freeze global app ui with loading state
  const [userToken, setUserToken] = useState(null);

  // check if the app is authenticated to a user
  const isAuthenticated = async () => {
    // Get user token
    let token = await AsyncStorage.getItem("userToken");

    setUserToken(token)

    console.log(token);

    if (!token || token === null) {
      return false;
    }

    return true;
  };

  useEffect(() => {
    isAuthenticated();
  }, [userToken]);

  const Login = async (email, password) => {
    await AsyncStorage.multiRemove(["userToken", "userData", "Visibility"]);
    const response = await api.post("/auth/login", {
      email: email,
      password: password,
    });

    console.log(response.data);

    if (!response.data) {
      alert("An error occured");
      return;
    }

    if (response.data?.error === true || response.data?.emailVerified === false) {
      alert(response.data.message);
      return response.data;
    }

    await AsyncStorage.setItem("userToken", response.data.token);
    await setUserToken(response.data.token);
    return true;
  };

  const Register = async (
    email,
    password,
    firstname,
    lastname,
    username,
    phone
  ) => {
    if (!isConnected) {
      alert("You are not connected to the internet");
    }

    const response = await api.post("/auth/register", {
      email: email,
      password: password,
      firstname: firstname,
      lastname: lastname,
      username: username,
      phone: phone,
    });

    if (response.error === true) {
      alert(response.message);
      return false;
    }

    return true;
  };

  const VerifyEmail = async (email, otp) => {
    const response = await api.post("/auth/verify", {
      email: email,
      digits: otp,
    });

    console.log(response.data);

    if (!response.data) {
      alert("An error occured");
      return;
    }

    console.log(response.data);

    if (response.data?.error === true) {
      alert(response.data.message);
      return response.data;
    }

    await AsyncStorage.setItem("userToken", response.data.token);
    await setUserToken(response.data.token);
    return true;
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
