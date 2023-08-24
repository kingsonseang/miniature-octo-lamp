import {
  View,
  Text,
  Pressable,
  ActionSheetIOS,
  ActivityIndicator,
  Image,
  Dimensions,
  ScrollView,
  Keyboard,
  StyleSheet,
  ToastAndroid,
  Platform,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { CommonActions } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import styles from "./styles";
import { AntDesign, Feather, Ionicons, Octicons } from "@expo/vector-icons";
import { colors } from "../../constants/colors";
import DropDownPicker from "react-native-dropdown-picker";
import api from "../../utils/api";
import * as ImagePicker from "expo-image-picker";

export default function Profile() {
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

  const [openCuisine, setCuisineOpen] = useState<boolean>(false);

  const [openDiet, setDietOpen] = useState<boolean>(false);

  const [openAllergens, setAllergensOpen] = useState<boolean>(false);

  useEffect(() => {
    async function gettingAccurate() {
      Platform.OS === "android" ? ToastAndroid.show("fetching user preferences", 5000) : setLoading(true)
      await getUpdatedUserDetails();
      Platform.OS === "android" ? ToastAndroid.show("User preferences updated sucessfully", 5000) : setLoading(false)
    }
    gettingAccurate();
  }, []);

  // Get the status bar height from Expo Constants
  const statusBarHeight = Constants.statusBarHeight || 0;

  const navigation = useNavigation();

  const goBackToInitialRoute = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "SplashScreen" }], // Replace 'Home' with the name of your initial route
      })
    );
  };

  const formatDate = (inputDateString: string) => {
    const date = new Date(inputDateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    const formattedDate = date.toLocaleDateString("en-US", options);
    return formattedDate;
  };

  const LogOutFunction = async () => {
    setLoading(true);
    let resp = await Logout();

    console.log(resp);

    if (resp === true) {
      setLoading(false);
      return goBackToInitialRoute();
    }
    setLoading(false);
  };

  const [loading, setLoading] = useState(false);

  const pickFile = async () => {
    // await requestGalleryPermission();
    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        // Upload the selected file
        await uploadProfilePicture(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking file:", error);
    }
    setLoading(false);
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
            <Text style={[styles.textmP, { fontSize: 16 }]}>Profile</Text>

            {/* logout */}
            <Pressable
              onPress={() => LogOutFunction()}
              style={[
                styles.headerbtn,
                {
                  backgroundColor: "#f7f7f7",
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <Ionicons name="exit-outline" size={24} color="black" />
            </Pressable>
          </View>
        </View>

        <View
          style={[
            styles.containerPadding,
            {
              gap: Dimensions.get("window").height * 0.02,
              backgroundColor: "#FFFFFF",
              paddingTop: Dimensions.get("window").height * 0.03,
              alignItems: "center",
            },
          ]}
        >
          {/* user details */}
          <View
            style={{
              width: Dimensions.get("window").height * 0.24,
              height: Dimensions.get("window").height * 0.24,
              overflow: "hidden",
              position: "relative",
            }}
          >
            {userData?.profile_picture ? (
              <Image
                source={{
                  uri: userData?.profile_picture,
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "cover",
                  borderRadius: Dimensions.get("window").height * 0.24,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: colors.buttonColor,
                }}
              />
            ) : (
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: Dimensions.get("window").height * 0.24,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: colors.primaryColor,
                }}
              >
                <Text
                  style={[
                    styles.textmP,
                    { fontSize: Dimensions.get("window").fontScale * 58 },
                  ]}
                >
                  {userData?.name?.first?.charAt(0)?.toUpperCase()}
                </Text>
              </View>
            )}
            <Pressable
              style={[
                {
                  position: "absolute",
                  bottom: 14,
                  right: 10,
                  width: 45,
                  height: 45,
                  borderRadius: 20,
                  backgroundColor: "white",
                  alignItems: "center",
                  justifyContent: "center",
                },
                userData?.profile_picture
                  ? {
                      borderWidth: StyleSheet.hairlineWidth,
                      borderColor: colors.buttonColor,
                    }
                  : {
                      shadowColor: "rgba(0, 0, 0, 1)",
                      shadowOffset: { width: -2, height: 4 },
                      shadowOpacity: 1,
                      shadowRadius: 8,
                      elevation: 3,
                    },
              ]}
              onPress={pickFile}
            >
              {/* <Octicons name="verified" size={24} color="#7472E0" /> */}
              <Feather name="edit-2" size={22} color={colors.buttonColor} />
            </Pressable>
          </View>

          <View style={{ alignItems: "center" }}>
            <Text
              style={[
                styles.textmP,
                { fontSize: Dimensions.get("window").fontScale * 24 },
              ]}
            >
              {userData?.name?.first} {userData?.name?.last}
            </Text>

            <Text style={[styles.textP]}>
              Jioned {formatDate(userData?.createdAt)}
            </Text>
          </View>

          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              width: "100%",
            }}
          >
            {/* views */}
            <Pressable
              onPress={() => console.log("views")}
              style={[
                pageStyles.profileInfoCard,
                { backgroundColor: colors.secondaryColor },
              ]}
            >
              <Text
                style={[
                  styles.textP,
                  { fontSize: Dimensions.get("window").fontScale * 18 },
                ]}
              >
                {userData?.views?.length}
              </Text>
              <Text style={[styles.textP]}>Posts</Text>
            </Pressable>

            {/* favorites */}
            <Pressable
              onPress={() => console.log("views")}
              style={[
                pageStyles.profileInfoCard,
                { backgroundColor: colors.red },
              ]}
            >
              <Text
                style={[
                  styles.textP,
                  {
                    fontSize: Dimensions.get("window").fontScale * 18,
                    color: colors.background,
                  },
                ]}
              >
                {userData?.liked?.length}
              </Text>
              <Text style={[styles.textP, { color: colors.background }]}>
                Favourites
              </Text>
            </Pressable>

            {/* cooked */}
            <Pressable
              onPress={() => console.log("views")}
              style={[
                pageStyles.profileInfoCard,
                { backgroundColor: colors.tetiaryColor },
              ]}
            >
              <Text
                style={[
                  styles.textP,
                  { fontSize: Dimensions.get("window").fontScale * 18 },
                ]}
              >
                {userData?.cooked?.length}
              </Text>
              <Text style={[styles.textP]}>Cooked</Text>
            </Pressable>
          </View>

          {/* Cuisines */}
          <View>
            <Text
              style={[
                styles.textmP,
                styles.fs16,
                { marginBottom: Dimensions.get("window").width * 0.01 },
              ]}
            >
              Cuisines
            </Text>
            <DropDownPicker
              open={openCuisine}
              value={cuisine}
              items={cuisineList}
              setOpen={setCuisineOpen}
              setValue={setCuisine}
              setItems={setCuisineList}
              onChangeValue={(value) => {
                api.patch(
                  "/users/me/preference",
                  { cuisine: value },
                  { headers: { Authorization: `Bearer ${userToken}` } }
                );
              }}
              autoScroll
              multiple
              mode="BADGE"
              containerStyle={{ backgroundColor: "transparent" }}
              style={{ backgroundColor: "transparent" }}
              listMode="MODAL"
              textStyle={[styles.textP]}
              placeholderStyle={[styles.textP]}
              placeholder="All Cuisines"
              badgeDotColors={[
                "#d9e9e3",
                "#f0f7f3",
                "#dae8e1",
                "#e0ebe5",
                "#f1f8f4",
                "#ddece6",
                "#e5eee8",
                "#e4ede6",
                "#dcebe4",
                "#e3ece6",
              ]}
              badgeColors="#ffffff"
            />
          </View>

          {/* Diet */}
          <View>
            <Text
              style={[
                styles.textmP,
                styles.fs16,
                { marginBottom: Dimensions.get("window").width * 0.01 },
              ]}
            >
              Diets
            </Text>
            <DropDownPicker
              open={openDiet}
              value={diet}
              items={dietList}
              setOpen={setDietOpen}
              setValue={setDiet}
              setItems={setDietList}
              onChangeValue={(value) => {
                api.patch(
                  "/users/me/preference",
                  { diet: value },
                  { headers: { Authorization: `Bearer ${userToken}` } }
                );
              }}
              placeholder="All Diets"
              autoScroll
              multiple
              mode="BADGE"
              containerStyle={{ backgroundColor: "transparent" }}
              style={{ backgroundColor: "transparent" }}
              listMode="MODAL"
              textStyle={[styles.textP]}
              badgeDotColors={[
                "#d9e9e3",
                "#f0f7f3",
                "#dae8e1",
                "#e0ebe5",
                "#f1f8f4",
                "#ddece6",
                "#e5eee8",
                "#e4ede6",
                "#dcebe4",
                "#e3ece6",
              ]}
              badgeColors="#ffffff"
            />
          </View>

          {/* allergens */}
          <View>
            <Text
              style={[
                styles.textmP,
                styles.fs16,
                { marginBottom: Dimensions.get("window").width * 0.01 },
              ]}
            >
              Allergens
            </Text>
            <DropDownPicker
              open={openAllergens}
              value={allergens}
              items={allergensList}
              setOpen={setAllergensOpen}
              setValue={setAllergens}
              setItems={setAllergensList}
              onChangeValue={(value) => {
                api.patch(
                  "/users/me/preference",
                  { intolerances: value },
                  { headers: { Authorization: `Bearer ${userToken}` } }
                );
              }}
              placeholder="No Allergens"
              autoScroll
              multiple
              mode="BADGE"
              containerStyle={{ backgroundColor: "transparent" }}
              style={{ backgroundColor: "transparent" }}
              listMode="MODAL"
              textStyle={[styles.textP]}
              badgeDotColors={[
                "#d9e9e3",
                "#f0f7f3",
                "#dae8e1",
                "#e0ebe5",
                "#f1f8f4",
                "#ddece6",
                "#e5eee8",
                "#e4ede6",
                "#dcebe4",
                "#e3ece6",
              ]}
              badgeColors="#ffffff"
            />
          </View>
        </View>
      </ScrollView>
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.secondaryColor,
            opacity: 0.5,
          }}
        >
          <ActivityIndicator size="small" color="#000000" />
        </View>
      ) : null}
    </Pressable>
  );
}

const pageStyles = StyleSheet.create({
  profileInfoCard: {
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    width: Dimensions.get("window").width * 0.28,
    paddingVertical: Dimensions.get("window").width * 0.03,
    borderRadius: Dimensions.get("window").width * 0.03,
  },
});
