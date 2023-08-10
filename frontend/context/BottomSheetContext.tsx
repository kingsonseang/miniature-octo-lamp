import React, { useMemo } from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

type BottomSheetContextType = {
  snapPoints: string[] | null;
};


export const BottomSheetContext = React.createContext<BottomSheetContextType | null>(null);

const BottomSheetProvider: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  // variables
  const snapPoints = useMemo(() => ["10%", "15%", "20%", "25%", "30%", "37%", "40%", "45%", "60%", "90%"], []);

  return (
    <BottomSheetContext.Provider value={{ snapPoints }}>
      {/* <BottomSheetModalProvider> */}
        {children}
        {/* </BottomSheetModalProvider> */}
    </BottomSheetContext.Provider>
  );
};

export default BottomSheetProvider;
