import React from "react";

export const LoadingContext = React.createContext();

const LoadingProvider = ({ children }) => {
  // freeze global app ui with loading state
  const [isGlobalLoading, setGlobalLoading] = React.useState(false);

  return (
    <LoadingContext.Provider value={{ isGlobalLoading, setGlobalLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
