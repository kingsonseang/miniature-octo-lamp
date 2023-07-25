import AuthProvider from "./context/AuthContext";
import LoadingProvider from "./context/LoadingContext";
import NetworkProvider from "./context/NetworkContext";
import NotificationProvider from "./context/NotificationContext";
import AppNavigator from "./screens/AppNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Montserrat_400Regular,
  Montserrat_500Medium,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
} from "@expo-google-fonts/dev";

export default function App() {
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
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
      <LoadingProvider>
        <NetworkProvider>
          <AuthProvider>
            <NotificationProvider>
              <AppNavigator />
            </NotificationProvider>
          </AuthProvider>
        </NetworkProvider>
      </LoadingProvider>
    </SafeAreaProvider>
  );
}
