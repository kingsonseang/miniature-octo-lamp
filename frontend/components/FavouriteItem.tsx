import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { colors } from "../constants/colors";
import styles from "../screens/authentication/styles";
import { useNavigation } from "@react-navigation/native";



const FavouriteItem = (props: any) => {
  const [loading, setLoading] = useState(true);

  const [item, setItem] = useState<any>([]);

  const {
    id,
    image,
    summary,
    cookingMinutes,
    title,
    readyInMinutes,
    servings,
    preparationMinutes,
    analyzedInstructions,
  } = props

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setItem(props);
      setLoading(false);
    }, 1200);
  }, []);

  const navigation = useNavigation();
  
    if (loading) {
      return <ShimmerAnimatedView />;
    }

  return (
    <Pressable
      style={{
        width: Dimensions.get("window").width * 0.42,
        gap: Dimensions.get("window").height * 0.01,
      }}
      onPress={item.onPress}
    >
      <Image
        source={{ uri: item.image }}
        style={{
          resizeMode: "cover",
          width: "100%",
          height: Dimensions.get("window").height * 0.24,
          borderRadius: Dimensions.get("window").height * 0.03,
        }}
      />

      <Text style={[styles.textmP]}>{item.title}</Text>

      <View
        style={{
          flexDirection: "row",
          gap: Dimensions.get("window").width * 0.02,
        }}
      >
        {item.readyInMinutes > 1 ? (
          <View
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              paddingVertical: Dimensions.get("window").width * 0.005,
              paddingHorizontal: Dimensions.get("window").width * 0.024,
              borderRadius: Dimensions.get("window").width * 0.04,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={[
                {
                  color: "#000",
                },
                styles.textP,
                styles.fs12,
              ]}
            >
              {item.readyInMinutes} mins
            </Text>
          </View>
        ) : null}
        <View
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.05)",
            paddingVertical: Dimensions.get("window").width * 0.005,
            paddingHorizontal: Dimensions.get("window").width * 0.024,
            borderRadius: Dimensions.get("window").width * 0.04,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={[
              {
                color: "#000",
              },
              styles.textP,
              styles.fs12,
            ]}
          >
            {parseInt(item.aggregateLikes).toLocaleString()} views
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default FavouriteItem;

const ShimmerAnimatedView = () => {
  const shimmerValue = new Animated.Value(0);

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1 } // Loop indefinitely
    );

    shimmerAnimation.start();

    return () => {
      shimmerAnimation.stop();
    };
  }, []);

  return (
    <View
      style={[
        shimmerStyles.shimmerView,
        {
          backgroundColor: colors.secondaryColor,
          overflow: "hidden",
          flexDirection: "row",
          borderRadius: Dimensions.get("window").height * 0.03,
          opacity: 0.4,
        },
      ]}
    >
      <Animated.View
        style={[
          shimmerStyles.shimmerView,
          {
            opacity: shimmerValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.4, 1],
            }),
            transform: [
              {
                translateX: shimmerValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-200, 200],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          shimmerStyles.shimmerView,
          {
            opacity: shimmerValue.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0.1],
            }),
            transform: [
              {
                translateX: shimmerValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [120, -120],
                }),
              },
            ],
            backgroundColor: colors.tetiaryColor,
          },
        ]}
      />
    </View>
  );
};

const shimmerStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  shimmerView: {
    width: Dimensions.get("window").width * 0.42,
    minHeight: Dimensions.get("window").height * 0.3,
    backgroundColor: colors.primaryColor,
  },
});
