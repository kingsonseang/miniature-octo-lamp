import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  Keyboard,
  Dimensions,
  TextInput,
  RefreshControl,
  Animated,
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
import { ScrollView } from "react-native-gesture-handler";
import Constants from "expo-constants";
import { AntDesign, Entypo, Feather, Ionicons } from "@expo/vector-icons";
import recipeApi from "../../utils/recipeApi";
import { AuthContext } from "../../context/AuthContext";
import { colors } from "../../constants/colors";
import RecipeListItem from "../../components/RecipeListItem";
import BottomSheet from "@gorhom/bottom-sheet";
import DropDownPicker from "react-native-dropdown-picker";
import LottieView from "lottie-react-native";

type ApiResponseType = { results: any };

export default function Search(props: any) {
  const {
    navigation,
    route: {
      params: { searchTerm },
    },
  } = props;

  const authContext = useContext(AuthContext);

  if (!authContext) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small" color="#000000" />
      </View>
    );
  }

  const {
    cuisineList,
    setCuisineList,
    allergensList,
    setAllergensList,
    dietList,
    setDietList,
    userToken,
  } = authContext;

  const animation = useRef<LottieView>(null);

  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState<any>([]);

  const [diet, setDiet] = useState([]);
  const [allergens, setAllergens] = useState([]);
  const [cuisine, setCuisine] = useState([]);

  const [openCuisine, setCuisineOpen] = useState<boolean>(false);
  const [openDiet, setDietOpen] = useState<boolean>(false);
  const [openAllergens, setAllergensOpen] = useState<boolean>(false);

  // Get the status bar height from Expo Constants
  const statusBarHeight = Constants.statusBarHeight || 0;
  const searchInputRef = useRef<TextInput | null>(null);
  const [currentSearchTerm, setSearchTerm] = useState<string>(searchTerm);
  const [_selected, setSelected] = useState(0);

  function getRandomNumber() {
    const min = 49;
    const max = 100;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
  }

  const [categoryList, setCateoryList] = useState([
    { label: "All", value: '' },
    { label: "Main course", value: "main course" },
    { label: "Side dish", value: "side dish" },
    { label: "Dessert", value: "dessert" },
    { label: "Appetizer", value: "appetizer" },
    { label: "Salad", value: "salad" },
    { label: "Bread", value: "bread" },
    { label: "Breakfast", value: "breakfast" },
    { label: "Soup", value: "soup" },
    { label: "Beverage", value: "beverage" },
    { label: "Sauce", value: "sauce" },
    { label: "Marinade", value: "marinade" },
    { label: "Fingerfood", value: "fingerfood" },
    { label: "Snack", value: "snack" },
    { label: "Drink", value: "drink" },
  ]);

  const [categoryOpen, setCateoryOpen] = useState<boolean>(false);
  const [category, setCateory] = useState<string[]>([]);

  const handleSearch = async () => {
    setLoading(true);
    const randomNum = await getRandomNumber();

    // f7debcf8fd754900b4dd27598c706bc2

    await recipeApi
      .get<ApiResponseType>(
        `complexSearch?apiKey=f7debcf8fd754900b4dd27598c706bc2&includeNutrition=true&instructionsRequired=true&addRecipeInformation=true&number=${randomNum}&type=${category.join(
          ", "
        )}&cuisine=${cuisine.join(", ")}&diet=${diet.join(
          ", "
        )}&intolerances=${allergens.join(", ")}`,
        { query: currentSearchTerm.trim() }
      )
      .then((res) => {
        setPageData(res.data?.results);
      });

    setLoading(false);
  };

  const onRefresh = useCallback(() => {
    handleSearch();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [cuisine, category, allergens, diet]);

  const bottomSheetRef = useRef<BottomSheet | null>(null);
  const animatedOpacity = useState(new Animated.Value(0))[0];
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

  // bottom sheet callbacks
  const handleSnapPress = useCallback((index: number) => {
    if (index === -1) {
      setBottomSheetOpen(false);
      Animated.timing(animatedOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
      bottomSheetRef.current?.close();
    } else {
      setBottomSheetOpen(true);
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
      bottomSheetRef.current?.snapToIndex(0);
    }
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      Animated.timing(animatedOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, []);

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
          flex: 1,
        }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            colors={[colors.buttonColor]}
            style={{
              backgroundColor: colors.buttonColor,
            }}
          />
        }
        // stickyHeaderIndices={[0]}
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
            <Text style={[styles.textmP, { fontSize: 16 }]}>Search</Text>

            {/* add to favourite button */}
            <View style={styles.headerbtn} />
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
          ></View>
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
            <Pressable
              onPress={() => handleSnapPress(0)}
              style={{ height: "100%" }}
            >
              <Ionicons name="md-filter-outline" size={24} color="black" />
            </Pressable>
            <TextInput
              ref={searchInputRef}
              textAlignVertical="center"
              allowFontScaling
              style={[styles.textP, { flex: 1, color: "#000" }]}
              cursorColor="#000"
              placeholder="search recipies"
              onChangeText={(e) => setSearchTerm(e)}
              onEndEditing={() => handleSearch()}
              value={currentSearchTerm}
            />
            {searchTerm?.length > 3 ? (
              <Pressable onPress={() => handleSearch()}>
                <Feather name="search" size={24} color="black" />
              </Pressable>
            ) : null}
          </Pressable>

          <Text style={[styles.textP, styles.fs12]}>
            Showing results for{" "}
            {cuisine.length < 1 &&
            diet.length < 1 &&
            allergens.length < 1 &&
            category.length < 1
              ? "all."
              : null}
            {category.length > 0
              ? cuisine.length < 1 && diet.length < 1 && allergens.length < 1
                ? `${category.join(", ")}.`
                : `${category.join(", ")}, in`
              : null}
            {cuisine.length > 0 ? `${cuisine.join(", ")},` : null}
            {diet.length > 0 ? `${diet.join(", ")},` : null}
            {allergens.length > 0 ? `${allergens.join(", ")}.` : null}
          </Text>
        </View>

        {loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="small" color="#000000" />
          </View>
        ) : pageData && pageData?.length >= 1 ? (
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal={false}
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
                      horizontal={false}
                      {...item}
                      onpress={() => navigation.navigate("Recipe", { ...item })}
                    />
                  );
                })
              : null}
          </ScrollView>
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
                height: Dimensions.get("window").width * 0.6,
                // transform: [{ scale: 1.5 }],
              }}
              // Find more Lottie files at https://lottiefiles.com/featured
              source={require("../../assets/not_found.json")}
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
              Sorry.... We couldn't find what you were looking for, try looking
              up something else!
            </Text>
          </View>
        )}

        {/* Bottom sheet overlaY */}
        <Animated.View
          style={{
            position: "absolute",
            backgroundColor: "#00000040",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: animatedOpacity,
          }}
          pointerEvents={bottomSheetOpen === true ? "auto" : "none"}
        />

        {/* ingredients bottom sheet */}
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={["90%"]}
          enableContentPanningGesture={true}
          animateOnMount={false}
          onChange={handleSheetChanges}
          handleComponent={() => (
            <Pressable
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
                // backgroundColor: "green",
              }}
              onPress={() => handleSnapPress(-1)}
            >
              <Text style={[styles.textmP, { fontSize: 24, paddingTop: 12 }]}>
                Search Filter
              </Text>
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Entypo name="chevron-down" size={22} color="black" />
              </View>
            </Pressable>
          )}
          style={{
            paddingVertical: Dimensions.get("window").height * 0.01,
            paddingHorizontal: Dimensions.get("window").width * 0.06,
          }}
          backgroundStyle={{
            backgroundColor: colors.highlight,
            borderRadius: Dimensions.get("window").width * 0.1,
          }}
        >
          {/* Cuisines */}
          <View style={{ marginBottom: Dimensions.get("window").width * 0.04 }}>
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
          <View style={{ marginBottom: Dimensions.get("window").width * 0.04 }}>
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
          <View style={{ marginBottom: Dimensions.get("window").width * 0.04 }}>
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

          {/* Category */}
          <View style={{ marginBottom: Dimensions.get("window").width * 0.04 }}>
            <Text
              style={[
                styles.textmP,
                styles.fs16,
                { marginBottom: Dimensions.get("window").width * 0.01 },
              ]}
            >
              Category
            </Text>
            <DropDownPicker
              open={categoryOpen}
              value={category}
              items={categoryList}
              setOpen={setCateoryOpen}
              setValue={setCateory}
              setItems={setCateoryList}
              placeholder="Select a category"
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
        </BottomSheet>
      </ScrollView>
    </Pressable>
  );
}
