import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import api from "../utils/api";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

type AuthContextType = {
  userToken: string | null;
  userData: any;
  isAuthenticated: () => Promise<boolean>;
  Login: (
    email: string,
    password: string
  ) => Promise<boolean | ApiResponse | undefined>;
  Register: (
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    username: string
  ) => Promise<boolean | ApiResponse | undefined>;
  VerifyEmail: (
    email: string,
    otp: string
  ) => Promise<boolean | ApiResponse | undefined>;
  Logout: () => Promise<boolean | undefined>;
  getUpdatedUserDetails: () => Promise<void>;
  uploadProfilePicture: (result: any) => Promise<void>;
  preferenceRunner: ({
    cuisine,
    diet,
    allergens,
  }: {
    cuisine: string;
    diet: string;
    allergens: string;
  }) => Promise<void>;
  cuisine: any;
  setCuisine: any;
  cuisineList: any;
  setCuisineList: any;
  allergens: any;
  setAllergens: any;
  allergensList: any;
  setAllergensList: any;
  diet: any;
  setDiet: any;
  dietList: any;
  setDietList: any;
  category: string[];
  SendVerifyEmail: (email: string) => Promise<boolean | ApiResponse | undefined>;
};

type ApiResponse = {
  error: boolean;
  message: string;
  emailVerified: boolean;
  token: string;
  user?: any;
  // Add other properties if needed
};

type NotificationType = {
  projectId: any;
};

export const AuthContext = React.createContext<AuthContextType | null>(null);

const AuthProvider: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const checkConnectivity = async () => {
    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      return setIsConnected(state.isConnected);
    });

    // Return a function that unsubscribes the event listener
    return () => unsubscribe();
  };

  useEffect(() => {
    checkConnectivity();
  }, []);

  const [userToken, setUserToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<string | null>(null);

  // cuisine list
  const [cuisineList, setCuisineList] = useState([
    { label: "African", value: "African" },
    { label: "Asian", value: "Asian" },
    { label: "American", value: "American" },
    { label: "British", value: "British" },
    { label: "Cajun", value: "Cajun" },
    { label: "Caribbean", value: "Caribbean" },
    { label: "Chinese", value: "Chinese" },
    { label: "Eastern", value: "Eastern" },
    { label: "European", value: "European" },
    { label: "French", value: "French" },
    { label: "German", value: "German" },
    { label: "Greek", value: "Greek" },
    { label: "Indian", value: "Indian" },
    { label: "Irish", value: "Irish" },
    { label: "Italian", value: "Italian" },
    { label: "Japanese", value: "Japanese" },
    { label: "Jewish", value: "Jewish" },
    { label: "Korean", value: "Korean" },
    { label: "Latin American", value: "Latin American" },
    { label: "Mediterranean", value: "Mediterranean" },
    { label: "Mexican", value: "Mexican" },
    { label: "Middle Eastern", value: "Middle Eastern" },
    { label: "Nordic", value: "Nordic" },
    { label: "Southern", value: "Southern" },
    { label: "Spanish", value: "Spanish" },
    { label: "Thai", value: "Thai" },
    { label: "Vietnamese", value: "Vietnamese" },
  ]);

  const [cuisine, setCuisine] = useState<string[]>([]);

  // allergen list
  const [allergensList, setAllergensList] = useState([
    { label: "Dairy", value: "Dairy" },
    { label: "Egg", value: "Egg" },
    { label: "Gluten", value: "Gluten" },
    { label: "Grain", value: "Grain" },
    { label: "Peanut", value: "Peanut" },
    { label: "Seafood", value: "Seafood" },
    { label: "Sesame", value: "Sesame" },
    { label: "Shellfish", value: "Shellfish" },
    { label: "Soy", value: "Soy" },
    { label: "Sulfite", value: "Sulfite" },
    { label: "Tree Nut", value: "Tree Nut" },
    { label: "Wheat", value: "Wheat" },
  ]);

  const [allergens, setAllergens] = useState<string[]>([]);

  // diet list
  const [dietList, setDietList] = useState([
    { label: "Gluten Free", value: "Gluten Free" },
    { label: "Ketogenic", value: "Ketogenic" },
    { label: "Vegetarian", value: "Vegetarian" },
    { label: "Lacto-Vegetarian", value: "Lacto-Vegetarian" },
    { label: "Ovo-Vegetarian", value: "Ovo-Vegetarian" },
    { label: "Vegan", value: "Vegan" },
    { label: "Pescetarian", value: "Pescetarian" },
    { label: "Paleo", value: "Paleo" },
    { label: "Primal", value: "Primal" },
    { label: "Low FODMAP", value: "Low FODMAP" },
    { label: "Whole30", value: "Whole30" },
  ]);

  const [diet, setDiet] = useState<string[]>([]);

  // Recipe categories
  const category = [
    "all",
    "main course",
    "side dish",
    "dessert",
    "appetizer",
    "salad",
    "bread",
    "breakfast",
    "soup",
    "beverage",
    "sauce",
    "marinade",
    "fingerfood",
    "snack",
    "drink",
  ];

  const isAuthenticated = async () => {
    let token = await AsyncStorage.getItem("userToken");
    let u = await AsyncStorage.getItem("userData");
    let user = u ? JSON.parse(u) : null;

    // 'cuisine', 'excludeCuisine', 'diet', 'intolerances'

    // Make sure user is an object with properties
    if (user && typeof user === "object") {
      setUserToken(token || null);
      setUserData(user);
      setDiet(user ? user?.diet : []);
      setCuisine(user ? user?.cuisine : []);
      setAllergens(user ? user?.intolerances : []);
    } else {
      setUserToken(token || null);
      setUserData(null); // Set user data to null if it's not a valid object
    }

    return !!token;
  };

  useEffect(() => {
    isAuthenticated();
  }, [userToken]);

  // loggin user
  const Login = async (email: string, password: string) => {
    await checkConnectivity();

    if (isConnected === false) {
      alert("You arent connected to the internet");
      return;
    }

    await AsyncStorage.multiRemove(["userToken", "userData", "Visibility"]);

    let notificationToken = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants?.expoConfig?.extra?.eas.projectId,
      })
    ).data;

    try {
      const response = await api.post<ApiResponse>("/auth/login", {
        email: email,
        password: password,
        device: Device,
        publicId: notificationToken,
      });

      console.log(response?.data);

      if (!response.data) {
        alert("An error occurred");
        return undefined;
      }

      if (
        response.data?.error === true ||
        response.data?.emailVerified === false
      ) {
        alert(response.data?.message);
        return response.data;
      }

      await AsyncStorage.setItem("userToken", response.data.token);
      setUserToken(response.data?.token);
      await AsyncStorage.setItem(
        "userData",
        JSON.stringify(response.data.user)
      );
      setUserData(response.data?.user);
      console.log(response.data.user);

      return true;
    } catch (error) {
      console.error("Error logging in:", error);
      return undefined;
    }
  };

  // register user
  const Register = async (
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    username: string
  ) => {
    await checkConnectivity();

    if (isConnected === false) {
      alert("You arent connected to the internet");
      return false;
    }

    try {
      const response = await api.post<ApiResponse>("/auth/register", {
        email: email,
        password: password,
        firstname: firstname,
        lastname: lastname,
        username: username,
      });

      if (response?.data?.error === true) {
        alert(response?.data?.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error registering:", error);
      return false;
    }
  };

  // verify user email with otp
  const VerifyEmail = async (email: string, otp: string) => {
    try {
      const response = await api.post<ApiResponse>("/auth/verify", {
        email: email,
        digits: otp,
      });

      console.log(response.data);

      if (!response.data) {
        alert("An error occurred");
        return undefined;
      }

      if (response.data?.error === true) {
        alert(response.data.message);
        return response.data;
      }

      await AsyncStorage.setItem("userToken", response.data.token);
      setUserToken(response.data.token);
      return true;
    } catch (error) {
      console.error("Error verifying email:", error);
      return undefined;
    }
  };

  // logout
  const Logout = async () => {
    await checkConnectivity();

    if (isConnected === false) {
      alert("You arent connected to the internet");
      return;
    }

    let resp;

    try {
      const response = await api.post<ApiResponse>(
        "/auth/logout",
        {
          device: Device,
        },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      await AsyncStorage.multiRemove(["userToken", "userData", "Visibility"]);
      setUserData(null);
      setUserToken(null);
      setDiet([]);
      setCuisine([]);
      setAllergens([]);
      console.log("Logged out sucessfully");

      resp = true;
    } catch (error) {
      resp = false;
    }

    return resp;
  };

  // get current users updated data
  const getUpdatedUserDetails = async () => {
    await checkConnectivity();

    if (isConnected === false) {
      alert("You arent connected to the internet");
      return;
    }

    try {
      const response = await api.get<ApiResponse>(
        "/users/me",
        {},
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      await AsyncStorage.setItem(
        "userData",
        JSON.stringify(response?.data?.user)
      );
      setUserData(response?.data?.user);
      setDiet(response?.data?.user?.diet);
      setCuisine(response?.data?.user?.cuisine);
      setAllergens(response?.data?.user?.intolerances);
    } catch (error) {
      console.error(error);
    }
  };

  // patch user preference
  async function preferenceRunner({
    cuisine,
    diet,
    allergens,
  }: {
    cuisine: string;
    diet: string;
    allergens: string;
  }) {
    await checkConnectivity();

    if (isConnected === false) {
      alert("You arent connected to the internet");
      return;
    }

    console.log({ cuisine, diet, allergens });

    try {
      const response = await api.patch<ApiResponse>(
        "/users/me/preference",
        { cuisine: cuisine, diet: diet, intolerances: allergens },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      await AsyncStorage.setItem(
        "userData",
        JSON.stringify(response?.data?.user)
      );
      setUserData(response?.data?.user);
      setDiet(response?.data?.user?.diet);
      setCuisine(response?.data?.user?.cuisine);
      setAllergens(response?.data?.user?.intolerances);
    } catch (error) {
      console.error(error);
    }
  }

  // upload profile picture
  const uploadProfilePicture = async (result: any) => {
    const fileUri = result.uri;
    // Get the file name from the URI
    const fileName = fileUri.split("/").pop();

    const fileUriSplit = fileName.split(".");

    const mimetype = fileName.split(".").pop();

    const type = `${result.type}/${mimetype}`;

    const encodeImageAsBase64 = async (imageUri: string) => {
      try {
        const { uri } = await FileSystem.getInfoAsync(imageUri);
        const base64EncodedImage = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        return base64EncodedImage;
      } catch (error) {
        console.error("Error encoding image as base64:", error);
        return null;
      }
    };

    const base64Image = await encodeImageAsBase64(result.uri);

    const dataURL = `data:${mimetype};base64,${base64Image}`;

    try {
      await checkConnectivity();

      if (isConnected === false) {
        alert("You arent connected to the internet");
        return;
      }

      const response = await api.patch<ApiResponse>(
        "/users/me/profle_prictue",
        { image: dataURL },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      await AsyncStorage.setItem(
        "userData",
        JSON.stringify(response?.data?.user)
      );

      setUserData(response?.data?.user);
      setDiet(response?.data?.user?.diet);
      setCuisine(response?.data?.user?.cuisine);
      setAllergens(response?.data?.user?.intolerances);
    } catch (error) {
      console.error(error);
    }
  };

  // send user email to verify with otp
  const SendVerifyEmail = async (email: string) => {
    try {
      const response = await api.post<ApiResponse>("/auth/reset/otp", {
        email: email,
        device: Device,
      });

      if (!response.data) {
        alert("An error occurred");
        return undefined;
      }

      return true;
    } catch (error) {
      console.error("Error verifying email:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userToken,
        userData,
        isAuthenticated,
        Register,
        Login,
        VerifyEmail,
        Logout,
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
        preferenceRunner,
        uploadProfilePicture,
        SendVerifyEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
