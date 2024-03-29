import { View, Text, Dimensions, Platform } from "react-native";
import React, { useContext, useEffect, useRef } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppScreens from "./app";
import Authentication from "./authentication";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

// create a stack navigator
const Stack = createNativeStackNavigator();

export default function SplashScreenStack() {
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        headerShown: false,
        animation: "fade_from_bottom"
      }}
    >
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="AppScreens" component={AppScreens} />
      <Stack.Screen name="Authentication" component={Authentication} />
    </Stack.Navigator>
  );
}

function SplashScreen({ navigation }: { navigation: any }) {
  const { userToken, isAuthenticated }: any = useContext(AuthContext);
  const animation = useRef(null);

  useEffect(() => {
    setTimeout(async () => {
      const isAuth = await isAuthenticated();

      !isAuth
        ? navigation.replace("Authentication")
        : navigation.replace("AppScreens");
    }, 5000);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <StatusBar style="light" />
      <LottieView
        autoPlay
        ref={animation}
        style={[
          {
            width:
              Platform.OS === "android"
                ? Dimensions.get("window").width
                : Dimensions.get("window").width * 0.5,
            height:
              Platform.OS === "android"
                ? Dimensions.get("window").width
                : Dimensions.get("window").width * 0.5,
            backgroundColor: "#fff",
          },
          Platform.OS === "android" ? { transform: [{ scale: 1.5 }] } : null,
        ]}
        // Find more Lottie files at https://lottiefiles.com/featured
        source={require("../assets/splash_animation.json")}
      />
    </View>
  );
}
