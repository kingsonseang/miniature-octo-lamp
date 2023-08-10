import {
  View,
  Text,
  Pressable,
  Image,
  Dimensions,
  ScrollView,
  Keyboard,
  Share,
  Platform,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AntDesign, Entypo } from "@expo/vector-icons";
import styles from "./styles";
import Constants from "expo-constants";
import { colors } from "../../constants/colors";
import { StatusBar } from "expo-status-bar";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  AccordionList,
} from "accordion-collapse-react-native";
import api from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";

type MyScreenProps = {
  navigation: any;
  route: any; // Replace 'RootStackParamList' with your actual stack param list type.
};

type ApiResponse = any;

const Cooking: React.FC<MyScreenProps> = (props) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small" color="#000000" />
      </View>
    );
  }

  const { userToken, getUpdatedUserDetails } = authContext;

  const {
    navigation,
    route: {
      params: {
        id,
        image,
        summary,
        cookingMinutes,
        title,
        readyInMinutes,
        servings,
        preparationMinutes,
        analyzedInstructions,
        sourceUrl,
        dishTypes,
        diets,
        occasions,
        cuisines,
        healthScore,
        vegetarian,
        vegan,
        glutenFree,
        dairyFree,
        veryHealthy,
        cheap,
        veryPopular,
        sustainable,
        lowFodmap,
      },
    },
  } = props;

  // Get the status bar height from Expo Constants
  const statusBarHeight = Constants.statusBarHeight || 0;

  const onShare = async () => {
    const message =
      Platform.OS === "ios"
        ? "Let's get cooking some " + title
        : "Let's get cooking some " + title + "\n" + sourceUrl;

    try {
      const result = await Share.share({
        url: sourceUrl,
        message: message,
        title: "Let's get cooking some " + title,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      alert(error?.message);
    }
  };

  const [isOpen, setIsOpen] = useState(true);
  const [cooked, setCooked] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [expandedKey, setExpandedKey] = useState(0);

  function _head(item: any) {
    return (
      <View
        style={{
          paddingHorizontal: Dimensions.get("window").width * 0.06,
          //   backgroundColor: "red",
        }}
      >
        <View
          style={{
            borderBottomWidth: StyleSheet.hairlineWidth,
            paddingVertical: Dimensions.get("window").height * 0.02,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={[styles.textsmP]}>Step {item.number}</Text>
          <Entypo
            name={
              expandedKey === item.number && isOpen === true
                ? "chevron-up"
                : "chevron-down"
            }
            size={22}
            color="black"
          />
        </View>
      </View>
    );
  }

  const onCompletePressed = async () => {
    if (cooked === true) {
      return;
    }

    await api
      .post<ApiResponse>(
        "/users/recipe/cook",
        {
          recipe: id,
        },
        { headers: { Authorization: `Bearer ${userToken}` } }
      )
      .then((res) => setCooked(res.data.cooked));
  };

  function goToNext(current: number) {
    var nextId = current + 1;

    if (nextId > analyzedInstructions[0].steps.length) {
      setExpandedKey(0);
      alert("Congatulations on completing a new meal!");
      return;
    }

    setExpandedKey(nextId);
  }

  const TimeDurationComponent = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    const formattedTime = `${
      hours > 0 ? hours + " hour" + (hours > 1 ? "s" : "") + " " : ""
    }${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}`;

    return <Text>{formattedTime}</Text>;
  };

  function _body(item: any) {
    return (
      <View
        style={{
          paddingHorizontal: Dimensions.get("window").width * 0.06,
          paddingVertical: Dimensions.get("window").height * 0.02,
        }}
      >
        <Text style={[styles.textP]}>{item.step}</Text>

        {/* step duration */}
        {item.length ? (
          <View style={{ marginTop: Dimensions.get("window").height * 0.01 }}>
            <Text style={[styles.fs14, styles.textP]}>
              This step should take around{" "}
              {TimeDurationComponent(item.length.number)}
            </Text>
          </View>
        ) : null}

        {/* render step ingredients */}
        {item.ingredients.lenght > 0 ? (
          <View style={{ marginTop: Dimensions.get("window").height * 0.01 }}>
            <Text style={[styles.fs14, styles.textmP]}>Ingredients</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {item.ingredients.map(
                (item: { image: string; name: string }, index: any) => {
                  const imageUrl =
                    "https://spoonacular.com/cdn/ingredients_100x100/" +
                    item.image;

                  return (
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                      key={index}
                    >
                      <Image
                        source={{ uri: imageUrl }}
                        width={60}
                        height={60}
                        style={{ resizeMode: "contain" }}
                      />
                      <Text style={[styles.fs12, styles.textP]}>
                        {item.name}
                      </Text>
                    </View>
                  );
                }
              )}
            </View>
          </View>
        ) : null}

        {/* render step equipment */}
        {item.equipment.lenght > 0 ? (
          <View style={{ marginTop: Dimensions.get("window").height * 0.01 }}>
            <Text style={[styles.fs14, styles.textmP]}>Equipment</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {item.equipment.map(
                (item: { image: string; name: string }, index: any) => {
                  const imageUrl =
                    "https://spoonacular.com/cdn/equipment_100x100/" +
                    item.image;

                  return (
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                      key={index}
                    >
                      <Image
                        source={{ uri: imageUrl }}
                        width={60}
                        height={60}
                        style={{ resizeMode: "contain" }}
                      />
                      <Text style={[styles.fs12, styles.textP]}>
                        {item.name}
                      </Text>
                    </View>
                  );
                }
              )}
            </View>
          </View>
        ) : null}

        {item.number + 1 > analyzedInstructions[0].steps.length ? (
          <View style={{ marginTop: 10, flexDirection: "row" }}>
            <Pressable
              style={[
                {
                  backgroundColor: colors.buttonColor,
                  borderRadius: Dimensions.get("window").height * 0.008,
                },
                cooked ? { opacity: 0.6 } : null,
              ]}
              onPress={onCompletePressed}
            >
              <Text
                style={[
                  {
                    color: colors.background,
                    paddingHorizontal: Dimensions.get("window").width * 0.06,
                    paddingVertical: Dimensions.get("window").height * 0.01,
                  },
                  styles.textP,
                ]}
              >
                Complete
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={{ marginTop: 10, flexDirection: "row" }}>
            <Pressable
              style={{
                backgroundColor: colors.buttonColor,
                borderRadius: Dimensions.get("window").height * 0.008,
              }}
              onPress={() => goToNext(item.number)}
            >
              <Text
                style={[
                  {
                    color: colors.background,
                    paddingHorizontal: Dimensions.get("window").width * 0.06,
                    paddingVertical: Dimensions.get("window").height * 0.01,
                  },
                  styles.textP,
                ]}
              >
                Next
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    );
  }

  function ChipItem({ label }: { label: any }) {
    return (
      <View
        style={{
          borderWidth: 1,
          paddingHorizontal: Dimensions.get("window").width * 0.02,
          borderRadius: Dimensions.get("window").width * 0.04,
        }}
      >
        <Text style={[styles.textP]}>{label}</Text>
      </View>
    );
  }

  const [chipItems, setChipItems] = useState<string[]>([]);

  const generateChipItems = () => {
    const chipItems = [];

    if (vegetarian) chipItems.push("Vegetarian");
    if (vegan) chipItems.push("Vegan");
    if (glutenFree) chipItems.push("Gluten Free");
    if (dairyFree) chipItems.push("Dairy Free");
    if (veryHealthy) chipItems.push("Very Healthy");
    if (cheap) chipItems.push("Cheap");
    if (veryPopular) chipItems.push("Very Popular");
    if (sustainable) chipItems.push("Sustainable");
    if (lowFodmap) chipItems.push("Low FODMAP");

    return chipItems;
  };

  useEffect(() => {
    async function fetchP() {
      let data = await generateChipItems();
      setChipItems(data);
    }
    fetchP();
  }, []);

  return (
    <Pressable
      style={{ flex: 1, position: "relative" }}
      onPress={() => Keyboard.dismiss()}
    >
      <StatusBar style="dark" translucent={true} />
      <View
        style={[
          styles.container,
          {
            gap: Dimensions.get("window").height * 0.01,
          },
        ]}
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
            <Text style={[styles.textmP, { fontSize: 16 }]}>Cook</Text>

            <Pressable
              onPress={onShare}
              style={[
                styles.headerbtn,
                {
                  backgroundColor: "#f7f7f7",
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <Entypo name="direction" size={24} color="black" />
            </Pressable>
          </View>
        </View>

        {/* short details about the recipe */}
        <View
          style={{ paddingHorizontal: Dimensions.get("window").width * 0.06 }}
        >
          <Text style={[styles.textmP, styles.fs18]}>{title}</Text>
          <Collapse onToggle={(isExpanded: boolean)=>setAboutOpen(isExpanded)}>
            <CollapseHeader>
              <View style={{ flexDirection: "row" }}>
                <Text style={[styles.textP]}>About Dish</Text>
                <Entypo name={aboutOpen ? "chevron-small-up" : "chevron-small-down"} size={24} color="black" />
              </View>
            </CollapseHeader>
            <CollapseBody>
              {readyInMinutes ? (
                <Text style={[styles.textP]}>
                  Ready in: {TimeDurationComponent(readyInMinutes)}.
                </Text>
              ) : null}
              {healthScore ? (
                <Text style={[styles.textP]}>Health score: {healthScore} of 100.</Text>
              ) : null}
              {dishTypes.lenth > 0 ? (
                <Text style={[styles.textP]}>
                  Dish types: {dishTypes.join(", ")}.
                </Text>
              ) : null}
              {diets.lenth > 0 ? (
                <Text style={[styles.textP]}>Diets: {diets.join(", ")}.</Text>
              ) : null}
              {cuisines.lenth > 0 ? (
                <Text style={[styles.textP]}>
                  Cuisines: {cuisines.join(", ")}.
                </Text>
              ) : null}
              {occasions.lenth > 0 ? (
                <Text style={[styles.textP]}>
                  Occations: Suitable for {occasions.join(", ")}.
                </Text>
              ) : (
                <Text style={[styles.textP]}>
                  Occations: Suitable for all occasions.
                </Text>
              )}
            </CollapseBody>
          </Collapse>
          {/* <FlatList
            data={generateChipItems()}
            renderItem={({ item }) => <ChipItem label={item} />}
            keyExtractor={(item) => item}
            horizontal
            contentContainerStyle={{
              gap: Dimensions.get("window").width * 0.02,
              marginTop: Dimensions.get("window").width * 0.02,
            }}
          /> */}
          <View
            style={{
              gap: Dimensions.get("window").width * 0.02,
              marginTop: Dimensions.get("window").width * 0.02,
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {chipItems.map((item, index) => {
              return <ChipItem key={index} label={item} />;
            })}
          </View>
        </View>

        {/* body */}
        {analyzedInstructions[0]?.steps ? 
        <AccordionList
          list={analyzedInstructions[0].steps}
          header={_head}
          body={_body}
          expandedKey={`${expandedKey}`}
          keyExtractor={(item: { number: any }) => `${item.number}`}
          onToggle={(index: any, index2: any, isExpanded: any) => {
            setIsOpen(isExpanded);
            setExpandedKey(index);
          }}
        /> : null}
      </View>
    </Pressable>
  );
};

export default Cooking;
