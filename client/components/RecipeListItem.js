import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

// normal list item
export default function RecipeListItem({ name, image, cookTime, views }) {
  // Utility function to format cookTime from milliseconds to time string (hh:mm)
  const formatCookTime = (milliseconds) => {
    const date = new Date(milliseconds);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Pressable style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.overlay}
      >
        <Text style={styles.title}>{name}</Text>
        <View style={styles.pills}>
          <Text style={styles.pill}>{formatCookTime(cookTime)} mins</Text>
          <Text style={styles.pill}>{views} views</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

// othe list item disign
export function RecipeListOtherItem({ name, image, cookTime, views }) {
  // Utility function to format cookTime from milliseconds to time string (hh:mm)
  const formatCookTime = (milliseconds) => {
    const date = new Date(milliseconds);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Pressable
      style={[
        styles.container,
        { height: Dimensions.get("window").height * 0.24 },
      ]}
    >
      <Image source={{ uri: image }} style={styles.image} />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={[
          styles.overlay,
          {
            paddingHorizontal: Dimensions.get("window").width * 0.05,
            paddingVertical: Dimensions.get("window").width * 0.06,
          },
        ]}
      >
        <Text style={styles.title}>{name}</Text>
        <View style={[styles.pills]}>
          <Text style={styles.pill}>{formatCookTime(cookTime)} ms</Text>
          <Text style={styles.pill}>{views} views</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minWidth: Dimensions.get("window").width * 0.7,
    height: Dimensions.get("window").height * 0.6,
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
    paddingHorizontal: Dimensions.get("window").width * 0.06,
    paddingVertical: Dimensions.get("window").width * 0.1,
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
