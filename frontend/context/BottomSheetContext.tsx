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
  const snapPoints = useMemo(() => ["35%", "60%"], []);

  return (
    <BottomSheetContext.Provider value={{ snapPoints }}>
      {/* <BottomSheetModalProvider> */}
        {children}
        {/* </BottomSheetModalProvider> */}
    </BottomSheetContext.Provider>
  );
};

export default BottomSheetProvider;
