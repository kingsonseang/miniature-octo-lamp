import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  // freeze global app ui with loading state
  const [userToken, setUserToken] = useState(null);


  // check if the app is authenticated to a user
  const isAuthenticated = async () => {
    // Get user token
    let token = await AsyncStorage.getItem("userToken");

    if (!token || token === null) {
      return false
    }
    
    return true
  };

  useEffect(()=>{
    isAuthenticated()
  },[userToken])

  const Login = (email, password) => {
    
  }

  return (
    <AuthContext.Provider value={{ userToken, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
