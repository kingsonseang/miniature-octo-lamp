import {
  View,
  Text,
  Pressable,
  Image,
  Dimensions,
  Keyboard,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useContext } from "react";
import styles from "./styles";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import FavouriteItem from "../../components/FavouriteItem";

export default function Favourites({ navigation }: { navigation: any }) {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small" color="#000000" />
      </View>
    );
  }

  const {
    Logout,
    userData,
    getUpdatedUserDetails,
    cuisine,
    setCuisine,
    cuisineList,
    setCuisineList,
    allergens,
    setAllergens,
    allergensList,
    setAllergensList,
    diet,
    setDiet,
    dietList,
    setDietList,
    category,
    userToken,
    preferenceRunner,
    uploadProfilePicture,
  } = authContext;

  // Get the status bar height from Expo Constants
  const statusBarHeight = Constants.statusBarHeight || 0;

  const favItemOnPress = (item: any) => {
    navigation.navigate("Recipe", { ...item });
  };

  return (
    <Pressable
      style={{ flex: 1, position: "relative" }}
      onPress={() => Keyboard.dismiss()}
    >
      <StatusBar style="dark" translucent={true} />
      <ScrollView
        style={[styles.container]}
        contentContainerStyle={{
          gap: Dimensions.get("window").height * 0.01,
        }}
        stickyHeaderIndices={[0]}
      >
        {/* header */}
        <View
          style={{
            paddingTop:
              Dimensions.get("window").height * 0.005 + statusBarHeight,
            paddingHorizontal: Dimensions.get("window").width * 0.06,
            backgroundColor: "#ffffff",
          }}
        >
          <View
            style={[
              styles.header,
              { paddingVertical: Dimensions.get("window").height * 0.01 },
            ]}
          >
            {/* back button */}
            <Pressable
              onPress={() => navigation.goBack()}
              style={[
                styles.headerbtn,
                {
                  backgroundColor: "#f7f7f7",
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </Pressable>

            {/* page title */}
            <Text style={[styles.textmP, { fontSize: 16 }]}>Favourites</Text>

            <View style={styles.headerbtn} />
          </View>
        </View>

        <ScrollView
          style={{
            backgroundColor: "#ffffff",
          }}
          contentContainerStyle={{
            flex: 1,
            width: Dimensions.get("window").width,
            paddingHorizontal: Dimensions.get("window").width * 0.06,
            justifyContent: "space-between",
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {userData.liked.length > 0
            ? userData.liked.map((item: any, index: number) => {
                return (
                  <FavouriteItem
                    key={index}
                    {...item}
                    onPress={() => favItemOnPress(item)}
                  />
                );
              })
            : null}
        </ScrollView>
      </ScrollView>
    </Pressable>
  );
}
