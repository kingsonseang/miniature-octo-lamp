import {
  View,
  Text,
  Image,
  Pressable,
  Dimensions,
  ScrollView,
  Keyboard,
  Animated,
  ActivityIndicator,
  Modal,
} from "react-native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./styles";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import { AntDesign, Entypo, Feather } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/core";
import BottomSheet from "@gorhom/bottom-sheet";
import { BottomSheetContext } from "../../context/BottomSheetContext";
import { LinearGradient } from "expo-linear-gradient";
import api from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { colors } from "../../constants/colors";

type MyScreenProps = {
  navigation: any;
  route: any; // Replace 'RootStackParamList' with your actual stack param list type.
};

type ApiResponse = any;

const Recipe: React.FC<MyScreenProps> = (props) => {
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
      },
    },
  } = props;

  // loading state
  const [loading, setLoading] = useState(true);

  // Get the status bar height from Expo Constants
  const statusBarHeight = Constants.statusBarHeight || 0;

  const bottomSheetRef = useRef<BottomSheet | null>(null);
  const bottomSheetRef1 = useRef<BottomSheet | null>(null);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [bottomSheetOpen1, setBottomSheetOpen1] = useState(false);
  const bottomSheetRef2 = useRef<BottomSheet | null>(null);
  const [bottomSheetOpen2, setBottomSheetOpen2] = useState(false);
  const [liked, setLiked] = useState(false);

  // image modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onModalOpen = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const animatedOpacity = useState(new Animated.Value(0))[0];

  const { snapPoints }: any = useContext(BottomSheetContext);

  // bottom sheet callbacks
  const handleSnapPress = useCallback((index: number) => {
    if (index < 1) {
      setBottomSheetOpen(false);
      Animated.timing(animatedOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      setBottomSheetOpen(true);
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }

    bottomSheetRef.current?.snapToIndex(index);
  }, []);

  // bottom sheet callbacks
  const handleSnapPress1 = useCallback((index: number) => {
    if (index < 1) {
      Animated.timing(animatedOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setBottomSheetOpen1(false);
    } else {
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setBottomSheetOpen1(true);
    }

    bottomSheetRef1.current?.snapToIndex(index);
  }, []);

  // bottom sheet callbacks
  const handleSnapPress2 = useCallback((index: number) => {
    if (index < 0) {
      setBottomSheetOpen2(false);
      Animated.timing(animatedOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
      bottomSheetRef2.current?.close();
    } else {
      setBottomSheetOpen2(true);
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
      bottomSheetRef2.current?.snapToIndex(index);
    }
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === 0 || index === -1) {
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

  const handleSheetChanges2 = useCallback((index: number) => {
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

  const formatRecipeText = (recipeText: string) => {
    // Replace <b> with an empty string
    const formattedText = recipeText.replace(/<b>|<\/b>/g, "");

    // Remove <a> tags while keeping the text inside
    const withoutLinks = formattedText.replace(/<a\b[^>]*>(.*?)<\/a>/g, "$1");

    // Replace "." with ".\n" for line breaks
    const finalText = withoutLinks.replace(".", ".\n");

    return <Text style={[styles.textP]}>{finalText}</Text>;
  };

  const addToLikes = async () => {
    await api
      .post<ApiResponse>(
        "/users/recipe/like",
        {
          recipe: props.route.params,
        },
        { headers: { Authorization: `Bearer ${userToken}` } }
      )
      .then((res) => setLiked(res.data.isLiked));
  };

  useEffect(() => {
    setLoading(true);

    const getLikedState = async () => {
      await api
        .post<ApiResponse>(
          "/users/recipe/check-like",
          {
            targetId: props.route.params.id,
          },
          { headers: { Authorization: `Bearer ${userToken}` } }
        )
        .then((res) => setLiked(res.data.isLiked));
    };

    getLikedState();
    setLoading(false);
  }, []);

  useEffect(()=>{
    getUpdatedUserDetails()
  }, [liked])

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small" color="#000000" />
      </View>
    );
  }

  return (
    <Pressable
      style={{ flex: 1, position: "relative" }}
      onPress={() => Keyboard.dismiss()}
    >
      <StatusBar style="dark" translucent={true} />
      {/* image expanded view */}
      <Modal animationType="fade" transparent={true} visible={isModalVisible}>
        <Pressable
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.4)",
          }}
          onPress={onModalClose}
        >
          <Image
            style={{ resizeMode: "contain", width: Dimensions.get("window").width, height: "100%", opacity: 1 }}
            source={{
              uri: image,
            }}
          />
        </Pressable>
      </Modal>

      <ScrollView
        style={[styles.container]}
        contentContainerStyle={{
          gap: Dimensions.get("window").height * 0.01,
          flex: 1,
        }}
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
            <Text style={[styles.textmP, { fontSize: 16 }]}>Recipe</Text>

            {/* add to favourite button */}
            <Pressable
              onPress={addToLikes}
              style={[
                styles.headerbtn,
                {
                  justifyContent: "center",
                  alignItems: "center",
                },
                liked !== true
                  ? { backgroundColor: "#f7f7f7" }
                  : { backgroundColor: "#ffeceb" },
              ]}
            >
              <AntDesign
                name="hearto"
                size={24}
                color={liked !== true ? "black" : colors.red}
              />
            </Pressable>
          </View>
        </View>

        {/* simple details */}
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
          {/* Title */}
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={[styles.textmP, { fontSize: 22 }]}
          >
            {title}
          </Text>

          {/* food image */}
          <Pressable onPress={onModalOpen}>
            <Image
              style={[styles.recipeImg, { resizeMode: "cover" }]}
              source={{
                uri: image,
              }}
            />
          </Pressable>

          {/* brief description */}
          <Pressable onPress={() => handleSnapPress2(0)}>
            <Text numberOfLines={2} ellipsizeMode="tail">
              {formatRecipeText(summary)}
            </Text>
          </Pressable>
        </View>

        {/* recipe details */}
        <View style={styles.recipeDetails}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingTop: 8,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Text style={[styles.textmP, { fontSize: 16 }]}>Servings</Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <Text style={styles.textP}>{servings} 🍽️</Text>
              </View>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={[styles.textmP, { fontSize: 16 }]}>Preparation</Text>
              {preparationMinutes >= 1 ? (
                <Text style={styles.textP}>{preparationMinutes} mins</Text>
              ) : (
                <Text style={styles.textP}>None</Text>
              )}
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={[styles.textmP, { fontSize: 16 }]}>Cook</Text>
              <Text style={styles.textP}>{readyInMinutes} mins</Text>
            </View>
          </View>
        </View>

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
          pointerEvents={
            bottomSheetOpen === true || bottomSheetOpen1 === true
              ? "auto"
              : "none"
          }
        />

        {/* ingredients bottom sheet */}
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={["38%", "40%", "45%", "60%", "90%"]}
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
              onPress={() => {
                if (bottomSheetOpen) {
                  handleSnapPress(0);
                } else {
                  handleSnapPress(4);
                }
              }}
            >
              <Text style={[styles.textmP, { fontSize: 24, paddingTop: 12 }]}>
                Ingredients
              </Text>
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Entypo
                  name={bottomSheetOpen ? "chevron-up" : "chevron-down"}
                  size={22}
                  color="black"
                />
              </View>
            </Pressable>
          )}
          style={{
            paddingVertical: Dimensions.get("window").height * 0.01,
            paddingHorizontal: Dimensions.get("window").width * 0.06,
          }}
          backgroundStyle={{
            backgroundColor: colors.tetiaryColor,
            borderRadius: Dimensions.get("window").width * 0.1,
          }}
        >
          <View
            style={{
              flex: 1,
              // alignItems: "center",
            }}
          >
            <Text style={[styles.textmP]}>
              Ingredienst per {servings} serving
            </Text>

            <Text style={{ marginTop: 20 }}>
              {analyzedInstructions[0]?.steps ? analyzedInstructions[0].steps.map((item: any) => {
                return item.ingredients.map(
                  (
                    newItem: { name: any },
                    index: React.Key | null | undefined
                  ) => (
                    <Text
                      style={[styles.textP]}
                      key={index}
                    >{`\u2022 ${newItem.name} `}</Text>
                  )
                );
              }) : null}
            </Text>
          </View>
        </BottomSheet>

        {/* Steps bottom sheet */}
        <BottomSheet
          ref={bottomSheetRef1}
          index={0}
          snapPoints={["30%", "37%", "40%", "45%", "60%"]}
          enableContentPanningGesture={true}
          animateOnMount={false}
          onChange={handleSheetChanges}
          handleComponent={() => (
            <Pressable
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: Dimensions.get("window").height * 0.01,
                paddingHorizontal: Dimensions.get("window").width * 0.06,
                // backgroundColor: "green",
              }}
              onPress={() => {
                if (bottomSheetOpen1) {
                  handleSnapPress1(0);
                } else {
                  handleSnapPress1(4);
                }
              }}
            >
              <Text style={[styles.textmP, { fontSize: 24, paddingTop: 12 }]}>
                Prepeparation
              </Text>
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Entypo
                  name={bottomSheetOpen1 ? "chevron-up" : "chevron-down"}
                  size={22}
                  color="black"
                />
              </View>
            </Pressable>
          )}
          backgroundStyle={{
            backgroundColor: colors.secondaryColor,
            borderRadius: Dimensions.get("window").width * 0.1,
          }}
          containerStyle={{ position: "relative" }}
        >
          <View
            style={{
              flex: 1,
              position: "relative",
              paddingBottom: Dimensions.get("window").height * 0.01,
              paddingHorizontal: Dimensions.get("window").width * 0.06,
            }}
          >
            <Text style={[styles.textmP]}>Start cooking to see all steps</Text>
            {analyzedInstructions[0]?.steps ? analyzedInstructions[0].steps.map((item: any) => (
              <Text
                style={[styles.textP]}
                key={item.number}
              >{`\u2022 ${item.step.replace(".", ".\n")}`}</Text>
            )) : null}
            <LinearGradient
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
              colors={["transparent", "rgba(0,0,0,0.8)"]}
            />
          </View>
        </BottomSheet>

        {/* get Cooking button */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "flex-end",
            alignItems: "center",
            zIndex: 10,
            padding: Dimensions.get("window").width * 0.1,
          }}
          pointerEvents="box-none"
        >
          <Pressable
            style={{
              backgroundColor: "#393b3a",
              paddingVertical: 14,
              paddingHorizontal: 20,
              borderRadius: 30,
            }}
            onPress={() =>
              navigation.navigate("Cooking", { ...props.route.params })
            }
          >
            <Text style={[styles.fs14, styles.textP, { color: "#ffffff" }]}>
              Start cooking
            </Text>
          </Pressable>
        </View>

        {/* decription bottom sheet */}
        <BottomSheet
          ref={bottomSheetRef2}
          index={-1}
          snapPoints={["90%"]}
          enableContentPanningGesture={true}
          animateOnMount={false}
          onChange={handleSheetChanges2}
          handleComponent={() => (
            <Pressable
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
                // backgroundColor: "green",
              }}
              onPress={() => handleSnapPress2(-1)}
            >
              <Text style={[styles.textmP, { fontSize: 24, paddingTop: 12 }]}>
                Description
              </Text>
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Entypo
                  name={bottomSheetOpen ? "chevron-up" : "chevron-down"}
                  size={22}
                  color="black"
                />
              </View>
            </Pressable>
          )}
          style={{
            paddingVertical: Dimensions.get("window").height * 0.01,
            paddingHorizontal: Dimensions.get("window").width * 0.06,
          }}
          backgroundStyle={{
            backgroundColor: colors.tetiaryColor,
            borderRadius: Dimensions.get("window").width * 0.1,
          }}
          containerStyle={{
            zIndex: 12,
          }}
        >
          <View
            style={{
              flex: 1,
              // alignItems: "center",
            }}
          >
            <Text style={{ marginTop: 20 }}>{formatRecipeText(summary)}</Text>
          </View>
        </BottomSheet>
      </ScrollView>
    </Pressable>
  );
};

export default Recipe;
