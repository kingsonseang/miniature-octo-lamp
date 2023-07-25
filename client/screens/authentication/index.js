import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Create from "./Create";
import Login from "./Login";
import Reset from "./Reset";
import Otp from "./Otp";
import Onboarding from "./Onboarding";

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
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Create" component={Create} />
      <Stack.Screen name="Reset" component={Reset} />
      <Stack.Screen name="Otp" component={Otp} />
    </Stack.Navigator>
  );
}
