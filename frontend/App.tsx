import AuthProvider from "./context/AuthContext";
import LoadingProvider from "./context/LoadingContext";
import BottomSheetProvider from "./context/BottomSheetContext";
import NotificationProvider from "./context/NotificationContext";
import AppNavigator from "./screens/AppNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Montserrat_400Regular,
  Montserrat_500Medium,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
} from "@expo-google-fonts/dev";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Platform } from "react-native";
import SplashScreenStack from "./screens/SplashScreen";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  Platform.OS === "android" ? NavigationBar.setPositionAsync("absolute") : null;
  Platform.OS === "android"
    ? NavigationBar.setBackgroundColorAsync("#ffffff00")
    : null;

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Montserrat_400Regular,
    Montserrat_500Medium,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#000000" />
      <LoadingProvider>
        <BottomSheetProvider>
          <AuthProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <NavigationContainer>
                <NotificationProvider>
                  <SplashScreenStack />
                </NotificationProvider>
              </NavigationContainer>
            </GestureHandlerRootView>
          </AuthProvider>
        </BottomSheetProvider>
      </LoadingProvider>
    </SafeAreaProvider>
  );
}
