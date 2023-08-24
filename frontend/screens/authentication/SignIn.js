import { View, Text, Pressable } from "react-native";
import React from "react";
import NetInfo from "@react-native-community/netinfo";
import api from "../../utils/api";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import axios from "axios";

export default function SignIn() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Pressable
        onPress={async () => {
          alert("Started");

          await NetInfo.addEventListener((state) => {
            if (state.isConnected === false) {
              return alert("You aren't connected to the internet");
            }
          });

          console.log(Constants?.expoConfig?.extra?.eas.projectId);

          const projectId = await Constants?.expoConfig?.extra?.eas.projectId
      
          const tokenObject = await Notifications.getExpoPushTokenAsync({
            projectId: projectId,
          });

          console.log(tokenObject);
          
          const notificationToken = tokenObject.data;
      
          const deviceData = {
            brand: Device.brand,
            productName: Device.productName,
            modelName: Device.modelName,
          };

          alert("posting");

          await api.post("/auth/login", {
            email: 'test1@king.com.eu',
            password: 'password123',
            device: deviceData,
            publicId: notificationToken,
          }).then(async (response) => {
              console.log(response.data);
              alert("Finished");
            });
        }}
      >
        <Text>SignIn</Text>
      </Pressable>
    </View>
  );
}
