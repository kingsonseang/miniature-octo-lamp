import React, { useContext, useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import expoPushTokens from "../utils/expoPushTokens";
import { AuthContext } from "./AuthContext";
import NetInfo from "@react-native-community/netinfo";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";
import api from "../utils/api";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
  }),
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const NotificationContext = React.createContext();

const NotificationProvider = ({ children }) => {
  const [badgeCount, setBadgeCount] = useState(0);

  const navigation = useNavigation();

  const { userToken, isAuthenticated } = useContext(AuthContext);

  const notificationListener = useRef();
  const responseListener = useRef();

  const registerForPushNotificationsAsync = async () => {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync({
          projectId: Constants.expoConfig.extra.eas.projectId,
        });
        finalStatus = status;
        const currentBadgeCount = await Notifications.getBadgeCountAsync();
        setBadgeCount(currentBadgeCount);
      }
      if (finalStatus !== "granted") {
        throw new Error("Failed to get push token for push notification!");
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig.extra.eas.projectId,
        })
      ).data;
      setUpServerNotification(token);
    } else {
      alert("Must use physical device for Push Notifications");
      throw new Error("Physical device required for Push Notifications");
    }

    return token;
  };

  const getPushNotificationPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } =
        await Notifications.requestPermissionsAsync();
      if (newStatus !== "granted") {
        return;
      }
    }
  };

  const incrementBadgeCount = async () => {
    const newBadgeCount = badgeCount + 1;
    setBadgeCount(newBadgeCount);
    await Notifications.setBadgeCountAsync(newBadgeCount);
  };

  const decreaseBadgeCount = async () => {
    const newBadgeCount = (badgeCount = 1 ? 0 : badgeCount - 1);
    setBadgeCount(newBadgeCount);
    await Notifications.setBadgeCountAsync(newBadgeCount);
  };

  const setupNotificationListeners = async () => {
    // check if user is authenticated
    await NetInfo.addEventListener(async (state) => {
      if (state.isConnected !== true) {
        return alert("App needs an internet connection to fetch your data");
      }

      if (userToken !== null) {
        console.log("Get the Expo push token and store it to the server");
        // Get the Expo push token and store it to the server
        try {
          await registerForPushNotificationsAsync().then((token) =>
            expoPushTokens.register(token, userToken)
          );

          // This listener is fired whenever a notification is received while the app is foregrounded
          notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
              console.log("--- notification received ---");
              console.log(notification);
              console.log("------");
              incrementBadgeCount();
            });

          // This listener is fired whenever a user taps on or interacts with a notification
          // (works when app is foregrounded, backgrounded, or killed)
          responseListener.current =
            Notifications.addNotificationResponseReceivedListener(
              (response) => {
                decreaseBadgeCount();

                const screenToOpen =
                  response.notification.request.content.data.screenToOpen;

                if (screenToOpen) {
                  navigation.navigate(screenToOpen);
                }
              }
            );
        } catch (error) {
          console.log("Error setting up notification listeners:", error);
        }
      }
    });
  };

  const AppNotification = async (title, body, trigger) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
      },
      trigger: trigger,
    });
  };

  const setUpServerNotification = (token) => {
    api.put(
      "/user/set-notfication-token",
      { token: token },
      { headers: { Authorization: `Bearer ${userToken}` } }
    ).then((res)=>{
      console.log(res.data);
    })
  };

  useEffect(() => {
    getPushNotificationPermissions();

    setupNotificationListeners();

    // Unsubscribe from events
    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [userToken]);

  return (
    <NotificationContext.Provider value={{ AppNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
