import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Create from "./Create";
import LoginPage from "./Login";
import Reset from "./Reset";
import Otp from "./Otp";
import Onboarding from "./Onboarding";
import PasswordReset from "./PasswordReset";

// create a stack navigator
const Stack = createNativeStackNavigator();

export default function Authentication() {
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="Create" component={Create} />
      <Stack.Screen name="Reset" component={Reset} />
      <Stack.Screen name="Otp" component={Otp} />
      <Stack.Screen name="PasswordReset" component={PasswordReset} />
    </Stack.Navigator>
  );
}
