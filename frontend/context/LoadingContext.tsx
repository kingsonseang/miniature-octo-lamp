import React from "react";

type LoadingContextType = {
  isGlobalLoading: boolean;
  setGlobalLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoadingContext = React.createContext<LoadingContextType | null>(null);

const LoadingProvider: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  // freeze global app ui with loading state
  const [isGlobalLoading, setGlobalLoading] = React.useState(false);

  return (
    <LoadingContext.Provider value={{ isGlobalLoading, setGlobalLoading }}>
        {children}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
