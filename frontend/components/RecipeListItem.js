import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import React, { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from "react-native-reanimated";

// normal list item
export default function RecipeListItem({
  name,
  image,
  cookTime,
  views,
  horizontal,
}) {

  const width = Dimensions.get("window").width
  const contentheight = Dimensions.get("window").height
  
  // Shared value to represent if the component is displayed horizontally or not
  const isHorizontal = useSharedValue(horizontal ? contentheight * 0.5 : contentheight * 0.20);

  // Utility function to format cookTime from milliseconds to time string (hh:mm)
  const formatCookTime = (milliseconds) => {
    const date = new Date(milliseconds);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    isHorizontal.value = withTiming(horizontal ? contentheight * 0.5 : contentheight * 0.20, {
      duration: 500,
      easing: Easing.linear,
    });
  }, [horizontal, isHorizontal]);

  // Animated styles for the LinearGradient
  const linearGradientStyle = useAnimatedStyle(() => {
    // Define the target values for horizontal and non-horizontal states
    const paddingHorizontal = withTiming(
      horizontal ? width * 0.04 : width * 0.045,
      { duration: 2000, easing: Easing.inOut(Easing.ease) }
    );

    const paddingVertical = withTiming(
      horizontal ? width * 0.05 : width * 0.05,
      { duration: 2000, easing: Easing.inOut(Easing.ease) }
    );

    return {
      paddingHorizontal,
      paddingVertical,
    };
  });

  const containerStyle = useAnimatedStyle(() => {
    const height = horizontal ? isHorizontal.value
      : (isHorizontal.value);

    return {
      height,
    };
  });

  return (
    <Pressable>
    <Animated.View
      style={[
        styles.container,
        containerStyle
      ]}
    >
      <Image source={{ uri: image }} style={styles.image} />

      <LinearGradient style={styles.overlay} colors={["transparent", "rgba(0,0,0,0.8)"]}>
        <Animated.View
          style={linearGradientStyle}
        >
          <Text style={styles.title}>{name}</Text>
          <View style={styles.pills}>
            <Text style={styles.pill}>{formatCookTime(cookTime)} mins</Text>
            <Text style={styles.pill}>{views} views</Text>
          </View>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minWidth: Dimensions.get("window").width * 0.7,
    backgroundColor: "#f7f7f7",
    borderRadius: Dimensions.get("window").width * 0.1,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
  },
  title: {
    color: "#fff",
    fontFamily: "Poppins_500Medium",
    fontSize: 18,
    marginBottom: Dimensions.get("window").width * 0.02,
  },
  pills: {
    flexDirection: "row",
    gap: Dimensions.get("window").width * 0.02,
  },
  pill: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "#fff",
    fontFamily: "Poppins_500Medium",
    paddingVertical: Dimensions.get("window").width * 0.005,
    paddingHorizontal: Dimensions.get("window").width * 0.024,
    borderRadius: Dimensions.get("window").width * 0.04,
  },
});
