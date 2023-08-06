import { NavigationContainer } from "@react-navigation/native";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Authentication from "./authentication";
import AppScreens from "./app";

export default function AppNavigator() {
  const { userToken }: any = useContext(AuthContext);
  return (
    <NavigationContainer>
      {userToken === null || userToken === "" ? <Authentication /> : <AppScreens />}
    </NavigationContainer>
  );
}
