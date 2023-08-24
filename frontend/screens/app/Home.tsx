import {
  View,
  Text,
  Dimensions,
  Pressable,
  Keyboard,
  Image,
  TextInput,
  ScrollView,
  FlatList,
  useAnimatedValue,
  Animated,
  Easing,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { StatusBar } from "expo-status-bar";
import styles from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import PillButton from "../../components/PillButton";
import RecipeListItem from "../../components/RecipeListItem";
import BottomSheet from "@gorhom/bottom-sheet";
import Constants from "expo-constants";
import { greetings } from "../../constants/greetins";
import DropDownPicker from "react-native-dropdown-picker";
import recipeApi from "../../utils/recipeApi";
import { colors } from "../../constants/colors";
import LottieView from "lottie-react-native";
import { AuthContext } from "../../context/AuthContext";

type ApiResponseType = { results: any };

export default function Home({ navigation }: any) {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small" color="#000000" />
      </View>
    );
  }

  const {
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
    userData,
  } = authContext;

  const [pageData, setPageData] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const animation = useRef<LottieView>(null);

  // Get the status bar height from Expo Constants
  const statusBarHeight = Constants.statusBarHeight || 0;

  const searchInputRef = useRef<TextInput | null>(null);

  const [_selected, setSelected] = useState(0);
  const [gridView, setgridView] = useState(true);

  const [greetingText, setGreetingText] = useState("");

  // animated value for greeting text
  const opacity = useAnimatedValue(0);

  // Function to get a random greeting from a list
  function getRandomGreeting(greetingList: string[]) {
    const randomIndex = Math.floor(Math.random() * greetingList.length);
    return greetingList[randomIndex];
  }

  const getGreetingText = () => {
    const currentHour = new Date().getHours();

    let greeting = "";

    if (currentHour >= 5 && currentHour < 8) {
      greeting = getRandomGreeting(greetings.morning);
    } else if (currentHour >= 6 && currentHour < 10) {
      greeting = getRandomGreeting(greetings.lateMorning);
    } else if (currentHour >= 10 && currentHour < 12) {
      greeting = getRandomGreeting(greetings.brunch);
    } else if (currentHour >= 12 && currentHour < 14) {
      greeting = getRandomGreeting(greetings.lunch);
    } else if (currentHour >= 14 && currentHour < 17) {
      greeting = getRandomGreeting(greetings.afternoonTea);
    } else if (currentHour >= 17 && currentHour < 19) {
      greeting = getRandomGreeting(greetings.dinner);
    } else if (currentHour >= 19 && currentHour < 22) {
      greeting = getRandomGreeting(greetings.timeToRelax);
    } else if (currentHour >= 22 && currentHour < 23) {
      greeting = getRandomGreeting(greetings.goodEvening);
    } else if (currentHour >= 23 && currentHour < 24) {
      greeting = getRandomGreeting(greetings.lateEveningFun);
    } else if (currentHour >= 0 && currentHour < 2) {
      greeting = getRandomGreeting(greetings.midnightSnack);
    } else if (currentHour >= 2 && currentHour < 6) {
      greeting = getRandomGreeting(greetings.nightSnack);
    } else {
      greeting = "Let's Get Cooking!";
    }

    // Update the animated value with the new greeting
    Animated.timing(opacity, {
      toValue: 0,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      setGreetingText(greeting);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    });

    return greeting;
  };

  useEffect(() => {
    // Update the animated value with the new greeting
    Animated.timing(opacity, {
      toValue: 0,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
    // Update the greeting text immediately when the component mounts
    setGreetingText(getGreetingText());
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    // Start an interval to update the greeting text every minute (or any desired interval)
    const interval = setInterval(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
      setGreetingText(getGreetingText());
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    }, 60000); // Update every minute

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  const setCurrentSelected = (id: any) => {
    setSelected(id);
  };

  function getRandomNumber() {
    const min = 54;
    const max = 98;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
  }

  // Function to shuffle an array using Fisher-Yates algorithm
  const shuffleArray = (array: any) => {
    if (!array) {
      return;
    }

    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  async function getData() {
    const randomNum = await getRandomNumber();

    const type = _selected === 0 ? "" : category[_selected];

    // f7debcf8fd754900b4dd27598c706bc2
    // 6d2604515554406a9bc1857bbfd62e18

    await recipeApi
      .get<ApiResponseType>(
        `complexSearch?apiKey=f7debcf8fd754900b4dd27598c706bc2&includeNutrition=true&instructionsRequired=true&addRecipeInformation=true&number=${randomNum}&type=${type}&cuisine=${cuisine.join(
          ", "
        )}&diet=${diet.join(", ")}&intolerances=${allergens.join(", ")}`
      )
      .then((res) => {
        setPageData(shuffleArray(res.data?.results));
      });
  }

  useEffect(() => {
    handleRefresh();
  }, [cuisine, allergens, diet]);

  const handleRefresh = async () => {
    setLoading(true);
    await getData();
    setLoading(false);
  };

  const handleCategoryChange = async (index: number) => {
    setLoading(true);
    const randomNum = await getRandomNumber();
    await setSelected(index);

    const type = _selected === 0 ? "" : category[index];

    await recipeApi
      .get<ApiResponseType>(
        `complexSearch?apiKey=6d2604515554406a9bc1857bbfd62e18&includeNutrition=true&instructionsRequired=true&addRecipeInformation=true&number=${randomNum}&type=${type}&cuisine=${cuisine.join(
          ", "
        )}&diet=${diet.join(", ")}&intolerances=${allergens.join(", ")}`
      )
      .then((res) => {
        setPageData(shuffleArray(res.data?.results));
      });
    setLoading(false);
  };

  // search
  const [searchTerm, setSearchTerm] = useState<string>("");
  const handleSearch = () => {
    if (searchTerm.length > 3) {
      navigation.navigate("Search", { searchTerm: searchTerm });
    }
  };

  return (
    <Pressable
      style={{ flex: 1, position: "relative" }}
      onPress={() => Keyboard.dismiss()}
    >
      <StatusBar style="dark" translucent={true} />
      <ScrollView
        style={[styles.container]}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            colors={[colors.buttonColor, colors.red, colors.tetiaryColor]}
            style={{
              backgroundColor: colors.buttonColor,
            }}
          />
        }
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
            <Pressable
              onPress={() => navigation.navigate("Profile")}
              style={[
                styles.headerbtn,
                { backgroundColor: colors.primaryColor },
              ]}
            >
              {userData?.profile_picture ? (
                <Image
                  source={{
                    uri: userData.profile_picture,
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    resizeMode: "cover",
                  }}
                />
              ) : (
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={[
                      styles.textmP,
                      {
                        fontSize: Dimensions.get("window").fontScale * 18,
                        paddingTop: Dimensions.get("window").fontScale * 4,
                      },
                    ]}
                  >
                    {userData?.name?.first?.charAt(0)?.toUpperCase()}
                  </Text>
                </View>
              )}
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate("Favourite")}
              style={[
                styles.headerbtn,
                {
                  backgroundColor: "#f7f7f7",
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <FontAwesome name="bookmark-o" size={24} color="black" />
            </Pressable>
          </View>
        </View>

        <View
          style={[
            styles.containerPadding,
            {
              gap: Dimensions.get("window").height * 0.02,
              backgroundColor: "#FFFFFF",
              paddingTop: 0,
            },
          ]}
        >
          {/* Greeting */}
          <Animated.Text
            style={[styles.textmP, { fontSize: 22, opacity: opacity }]}
          >
            {greetingText}
          </Animated.Text>

          {/* search */}
          <Pressable
            onPress={() => searchInputRef?.current?.focus()}
            style={[
              styles.header,
              {
                paddingBottom: Dimensions.get("window").height * 0.02,
                justifyContent: "flex-start",
                gap: Dimensions.get("window").height * 0.02,
                borderBottomWidth: 1,
              },
            ]}
          >
            <Feather name="search" size={24} color="black" />
            <TextInput
              ref={searchInputRef}
              textAlignVertical="center"
              allowFontScaling
              style={[styles.textP, { flex: 1, color: "#000" }]}
              cursorColor="#000"
              placeholder="search recipies"
              onChangeText={(e) => setSearchTerm(e)}
              onEndEditing={() => handleSearch()}
            />
            {searchTerm?.length >= 3 ? (
              <Pressable onPress={() => handleSearch()}>
                <AntDesign name="arrowright" size={24} color="black" />
              </Pressable>
            ) : null}
          </Pressable>
        </View>

        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          bounces
          initialScrollIndex={_selected}
          contentContainerStyle={{
            gap: Dimensions.get("window").height * 0.02,
            paddingHorizontal: Dimensions.get("window").width * 0.06,
          }}
          data={category}
          renderItem={({ item, index }) => {
            return (
              <PillButton
                key={index}
                selected={_selected === index}
                text={item}
                onpress={() => handleCategoryChange(index)}
              />
            );
          }}
        />
        {loading ? (
          <View
            style={[
              styles.containerPadding,
              {
                gap: Dimensions.get("window").height * 0.02,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: Dimensions.get("window").height * 0.04,
                flex: 1,
              },
            ]}
          >
            <ActivityIndicator size="small" color="#000000" />
          </View>
        ) : pageData ? (
          <View
            style={{
              flex: 1,
            }}
          >
            {/* view detials */}
            <View
              style={[
                styles.containerPadding,
                {
                  gap: Dimensions.get("window").height * 0.02,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: Dimensions.get("window").height * 0.04,
                },
              ]}
            >
              <Text style={[styles.fs14, styles.textmP]}>
                {pageData?.length} Recipe
              </Text>

              {/* view control */}
              <View
                style={{
                  flexDirection: "row",
                  gap: Dimensions.get("window").height * 0.014,
                }}
              >
                <Pressable onPress={() => setgridView(true)}>
                  <MaterialCommunityIcons
                    name="mirror-rectangle"
                    size={22}
                    color="black"
                    style={!gridView && { opacity: 0.4 }}
                  />
                </Pressable>
                <Pressable onPress={() => setgridView(false)}>
                  <Feather
                    name="grid"
                    size={22}
                    color="black"
                    style={gridView && { opacity: 0.4 }}
                  />
                </Pressable>
              </View>
            </View>

            {/* content */}
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal={gridView}
              bounces
              contentContainerStyle={{
                gap: Dimensions.get("window").height * 0.02,
                paddingHorizontal: Dimensions.get("window").width * 0.06,
                paddingBottom: Dimensions.get("window").height * 0.02,
              }}
            >
              {pageData
                ? pageData.map((item: any) => {
                    return (
                      <RecipeListItem
                        key={item.id}
                        horizontal={gridView}
                        {...item}
                        onpress={() =>
                          navigation.navigate("Recipe", { ...item })
                        }
                      />
                    );
                  })
                : null}
            </ScrollView>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              gap: Dimensions.get("window").width * 0.04,
              paddingHorizontal: Dimensions.get("window").height * 0.04,
            }}
          >
            <LottieView
              autoPlay
              ref={animation}
              style={{
                width: Dimensions.get("window").width * 0.6,
                // height: Dimensions.get("window").width * 0.6,
                // transform: [{ scale: 1.5 }],
              }}
              // Find more Lottie files at https://lottiefiles.com/featured
              source={require("../../assets/not_found_.json")}
            />
            <Text
              style={[
                styles.textmP,
                styles.fs14,
                {
                  textAlign: "center",
                  color: colors.buttonColor,
                  opacity: 0.7,
                },
              ]}
            >
              Something went wrong on our end, we're fixing it your meals will
              be back in a few!
            </Text>
          </View>
        )}
      </ScrollView>
    </Pressable>
  );
}
