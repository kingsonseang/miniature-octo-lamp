import {
  Animated,
  Dimensions,
  Image,
  Linking,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect } from "react";
import styles from "./styles";
import AuthButton from "../../components/AuthButton";
import Carousel from "react-native-reanimated-carousel";
import { StatusBar } from "expo-status-bar";

export default function Onboarding({ navigation }) {
  const [activeSlide, setActiveSlide] = React.useState(0);
  const width = Dimensions.get("window").width;

  const carouselData = [
    {
      key: 1,
      img: "https://media.istockphoto.com/id/926292104/vector/hand-drawn-typography-cooking-and-foods.jpg?s=612x612&w=0&k=20&c=RDe6RvTGMQE28y_piKbYWUCCadceYkTi0wvg484ZXVY=",
      title: "Connect with Food Enthusiasts",
      paragrah:
        "Build friendships, exchange cooking tips, and dive into diverse cuisines with like-minded foodies.",
    },
    {
      key: 2,
      img: "https://media.istockphoto.com/id/1385127949/vector/chefs-hands-cutting-food.jpg?s=612x612&w=0&k=20&c=dR7ljd7Fmx1DHAlS5U0_Mh9vIS4lkQfuoz1JrHJeJtY=",
      title: "Find Culinary Inspiration",
      paragrah:
        "Explore a wide range of recipes and get inspired to try new dishes in your kitchen.",
    },
    {
      key: 3,
      img: "https://media.istockphoto.com/id/132073646/vector/couple-having-kitchen-disasters.jpg?s=612x612&w=0&k=20&c=n3Lbze9hmLwgtXxcReuT1scmY5J7JaZs0VZhWn0F-Ig=",
      title: "Level Up Your Cooking Skills",
      paragrah:
        "Engage with experienced cooks, learn new techniques, and elevate your culinary prowess.",
    },
    {
      key: 4,
      img: "https://media.istockphoto.com/id/182412911/vector/cooking-doodles.jpg?s=612x612&w=0&k=20&c=KsLiGXassXejwlc_BrTRRZF2PvM3cUsYe5YXGtnpJ5I=",
      title: "Create Recipe Collections",
      paragrah:
        "Organize your favorite recipes into personalized collections for easy access.",
    },
    {
      key: 5,
      img: "https://media.istockphoto.com/id/1328178216/vector/smiling-family-eating-dinner.jpg?s=612x612&w=0&k=20&c=yoDJSqliqtqlHL05RGJ54I9DHjc-BqJVmKU00WWTdqQ=",
      title: "Savor the Flavors of Life Together",
      paragrah:
        "Join our vibrant recipe community, share your love for food and create lasting kitchen memories together.",
    },
  ];

  return (
    <SafeAreaView
      style={[
        styles.container,
        styles.containerPadding,
        {
          justifyContent: "flex-end",
          alignItems: "center",
          gap: Dimensions.get("window").height * 0.03,
        },
      ]}
    >
      <StatusBar style="dark" backgroundColor="#fff" />
      {/* carousel */}
      <Carousel
        loop
        autoPlay
        autoPlayInterval={3000}
        width={width}
        // height={width*1.4}
        data={[...carouselData]}
        scrollAnimationDuration={1000}
        onProgressChange={(_, absoluteProgress) => {
          setActiveSlide(Math.round(absoluteProgress));
        }}
        snapEnabled={true}
        pagingEnabled
        renderItem={(item) => {
          return (
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              <Image
                source={{
                  uri: item.item.img,
                }}
                style={{
                  width: Dimensions.get("window").width,
                  height: Dimensions.get("window").width,
                  resizeMode: "contain"
                }}
              />

              <View
                style={{
                  alignItems: "center",
                  paddingHorizontal: Dimensions.get("window").width * 0.06,
                }}
              >
                <Text
                  style={[styles.textmP, styles.fs20, { textAlign: "center" }]}
                >
                  {item.item.title}
                </Text>
                <Text
                  style={[styles.textP, styles.fs14, { textAlign: "center" }]}
                >
                  {item.item.paragrah}
                </Text>
              </View>
            </View>
          );
        }}
      />

      {/* carousel pagination */}
      <View style={{ flexDirection: "row", gap: width * 0.04 }}>
        {carouselData.map((item, index) => {
          const dotBorderWidth = activeSlide === index ? 5 : 0;
          const dotBorderColor = activeSlide === index ? "black" : "";
          const backgroundColor = activeSlide === index ? "#fff" : "lightgrey";

          return (
            <View
              style={[
                {
                  width: 10,
                  height: 10,
                  borderRadius: 10,
                  borderWidth: dotBorderWidth,
                  borderColor: dotBorderColor,
                  backgroundColor: backgroundColor,
                },
              ]}
              key={index}
            />
          );
        })}
      </View>

      {/* get started btn */}
      <AuthButton onpress={()=>navigation.navigate("Login")} text="Continue" />

      {/* consent */}
      <View
        style={{
          alignItems: "center",
        }}
      >
        <Text style={[styles.textP, styles.fs12]}>
          By continuing, you agree to the
        </Text>
        <View style={styles.TnCContainer}>
          <Pressable onPress={()=>Linking.openURL("https://google.com")}>
            <Text style={[styles.textmP, styles.fs12]}>Terms and Services</Text>
          </Pressable>
          <Text style={[styles.textP, styles.fs12]}>&</Text>
          <Pressable onPress={()=>Linking.openURL("https://google.com")}>
            <Text style={[styles.textmP, styles.fs12]}>Privacy Policy</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
