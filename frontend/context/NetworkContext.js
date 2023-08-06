import React, { createContext, useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";

export const NetworkContext = createContext();

const NetworkProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(null);

  useEffect(() => {
    const checkConnectivity = async () => {
      // Subscribe to network state changes
      const unsubscribe = await NetInfo.addEventListener((state) => {
        setIsConnected(state.isConnected);
      });

      // Return a function that unsubscribes the event listener
      return () => unsubscribe();
    };

    checkConnectivity();
  }, []);

  return (
    <NetworkContext.Provider value={{ isConnected }}>
      {children}
    </NetworkContext.Provider>
  );
};

export default NetworkProvider;
