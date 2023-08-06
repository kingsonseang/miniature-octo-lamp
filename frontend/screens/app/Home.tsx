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
import { Entypo, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import PillButton from "../../components/PillButton";
import RecipeListItem from "../../components/RecipeListItem";
import BottomSheet from "@gorhom/bottom-sheet";
import { BottomSheetContext } from "../../context/BottomSheetContext";
import Constants from "expo-constants";
import { greetings } from "../../constants/greetins";

export default function Home({ navigation }: any) {
  // Get the status bar height from Expo Constants
  const statusBarHeight = Constants.statusBarHeight || 0;

  const searchInputRef = useRef<TextInput | null>(null);
  const bottomSheetRef = useRef<BottomSheet | null>(null);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

  const animatedOpacity = useState(new Animated.Value(0))[0];

  // Function to toggle the visibility of the view
  const toggleView = (value: boolean) => {
    setBottomSheetOpen(value);
    
    Animated.timing(animatedOpacity, {
      toValue: value === false ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const { snapPoints }: any = useContext(BottomSheetContext);

  // bottom sheet callbacks
  const handleSnapPress = useCallback((index: number) => {
    toggleView(true);
    bottomSheetRef.current?.snapToIndex(index);
  }, []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      toggleView(false);
    }
  }, []);

  const [_selected, setSelected] = useState(1);
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
    // Update the greeting text immediately when the component mounts
    setGreetingText(getGreetingText());

    // Start an interval to update the greeting text every minute (or any desired interval)
    const interval = setInterval(() => {
      setGreetingText(getGreetingText());
    }, 60000); // Update every minute

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  const dataArray = [
    {
      _id: 1,
      name: "Beetroot Quinoa Salad Dressing",
      cookTime: 30 * 60 * 1000, // 30 minutes converted to milliseconds
      views: 150,
      image:
        "https://cleananddelicious.com/wp-content/uploads/2021/03/Quinoa.Beet_.Salad_.blog-11.jpg",
    },
    {
      _id: 2,
      name: "Pasta Carbonara",
      cookTime: 25 * 60 * 1000, // 25 minutes converted to milliseconds
      views: 200,
      image:
        "https://s23209.pcdn.co/wp-content/uploads/2014/03/IMG_2622edit.jpg",
    },
    // Add more data objects below
    {
      _id: 3,
      name: "Grilled Chicken",
      cookTime: 45 * 60 * 1000, // 45 minutes converted to milliseconds
      views: 180,
      image:
        "https://www.themediterraneandish.com/wp-content/uploads/2020/07/grilled-whole-chicken-recipe-9-1024x1536.jpg",
    },
    {
      _id: 4,
      name: "Chocolate Brownies",
      cookTime: 40 * 60 * 1000, // 40 minutes converted to milliseconds
      views: 250,
      image:
        "https://neighborfoodblog.com/wp-content/uploads/2020/05/easy-homemade-brownies-5-540x720.jpg",
    },
    {
      _id: 5,
      name: "Mushroom Soup",
      cookTime: 20 * 60 * 1000, // 20 minutes converted to milliseconds
      views: 300,
      image:
        "https://www.cookingclassy.com/wp-content/uploads/2022/09/cream-of-mushroom-soup-2.jpg",
    },
    {
      _id: 6,
      name: "Spaghetti Bolognese",
      cookTime: 35 * 60 * 1000, // 35 minutes converted to milliseconds
      views: 220,
      image:
        "https://pinchofnom.com/wp-content/uploads/2022/01/Veggie-Spaghetti-Bolognese-01.jpg",
    },
    {
      _id: 7,
      name: "Fruit Smoothie",
      cookTime: 10 * 60 * 1000, // 10 minutes converted to milliseconds
      views: 280,
      image:
        "https://www.dinneratthezoo.com/wp-content/uploads/2018/05/frozen-fruit-smoothie-3.jpg",
    },
  ];

  const setCurrentSelected = (id: any) => {
    setSelected(id);
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
          gap: Dimensions.get("window").height * 0.02,
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
              style={styles.headerbtn}
            >
              <Image
                source={{
                  uri: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBYWFRgWFRYYGRgaGRkcGhoYGhgYGBocGBgZGhgaGBgcIS4lHB4rIRoYJjgmKy8xNTU1GiQ7QDszPy40NTEBDAwMEA8QHxISHjEhISE0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQxNDQ0NDE0NDQ0NDQ0NDQ0NDQ0NP/AABEIAL8BCAMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAADAQIEBQYABwj/xABBEAABAwIEAwYEBAMHAgcAAAABAAIRAyEEBRIxQVFhBiJxgZGhMrHB8BMUQtGi4fEHFVJicpKyI9IWJDNDU4LD/8QAGQEAAwEBAQAAAAAAAAAAAAAAAAECAwQF/8QAJBEBAQACAQQCAgMBAAAAAAAAAAECEQMSITFRE0EEIjJhcRT/2gAMAwEAAhEDEQA/AKzLK8OgLSYF95KzBp6ahjZXOWVrmStZWGUWmLzAgQqx+LnihY6rLlGqQGzzT2WlzgcbMALY5bVBAXn2XVmtF1pcsxsmxTHitcF0IOGdIUhSsyEkJ6SEbGjIXQnwkhGy0ZC6E+Eko2DYSEJ2oJtZ7WCXODRzcQB7o2CFJCzGcdsqVJ2lha4yQXFzQBG5AMa4kWHgJWYr/wBoRc74oA2DGuvBHxeMjw58zY09NhJCxWD/ALQqBA1uk840+x+7bLR5VntHECWPB58xO1k9ksoSQnwkhGwZC6E9dCewHC6E+FxCNloJ1kz8QJmMqQFSfnDqhAaBhlQcfiNIRaFXuqozWrKBRaeL1BK/FiIKpcBX70FHxjxKeysNxYaVyr8S82ISI2ekXM8KQNXEqPgGnmrntLThtuSocNVIE9Flb3aSdlgKQ3KhYiuALJa+L7qj0oNyls9HYJjnnotfllANhZvDtcSAwLVZfhX21KojJpcC+ynNeqlmIawRKMzEoEqyXQolOsSpFR+lsoVs5MfUA4qlx2bxYKgxedPHFBf419fGtAN1VVMyPBZc5sXWlJi8zFJjnuiYkCYmOfRLqg6a1WGxt5cYE8V552zz+tVquDHlrGPLQGu+INsPh5mSeOw4KkxGaV8VUa1x0tIjQ1xIjcmBY3i/TgrzD5EGMAdJtsfmeqzyz024+K1hdepxDtUmS2AHXg84gE/MqO+kQA4g7CSCCTqAIHiP2W3qZJTfu0eXDwWfzXKvwoBmJs6AbXsCdjfbwSx5JbpeXDlJtStcQbEnlqud/wCRU/C459J+psBzedxJgERN22UGsCCYOp2xO4kibE8I+SZeNQAiwnqIW0rGx652d7cghjKpI2Atcc2yeG8dAvQ6FVr2hzTMr5qoOJab7DrItPMdfVbLsl2qdQc0VSNPwze2qBMk3gg29OSEWaezwuhQcBmjKglruHIjpadx4cip6CJCZUFkSEjxZPY0zmY4qJBVManeUrtExwMhVLKlgUbLTSU69lCrvl0ITK1gUR8OEjdVstK6szQ+2xXYx8iybiiTukwzNRgpGFTbLbrlPdhQAuTLaBmlXWY3CrcQwaTHBWraQ0F3GFRVHkghY2tsQqWGLhN7qQcO4DwS4BpiPVW9CmCIRBTsle0bhXRzHWdLPZUzQ1k9VPy6mBJiFUqKsGUjMkqxwxlQaTxNyrGjUaEbLS1wzBCiY+rBgqRSrCFTZziBO6DUudnSJBWWfiS8wrvNg5zYBVRhMI5rgSFGVXjNRNwODPxFZTP8UKj4JBALugAbJAA4yQ0krU53jNNAsa7S51pttEnfnYefgvP8c4CS3iHWHt4Hf3U7XJ9tp2AysF+t7QJAPDuiLCPvZaTOWgGyXsxRazCsfYFzAZty/pZUmaZyzVpIe6OIY4j1XNd5ZOzDWMTMNQCNictZUYWPAIIg/wAuRQMqzOlUHcMxzBBHkVauqsaCXGAOPBZXcreXGx5TnGV6Xv0MMMfp0nUXEETJN+7wn7NKQItBM77m/Llf1XoHazF0XML6ZGuzSQyXDkb2tJ9QsJWpFjrEQRqaRAloMQfG0i9128Wds7uDmwky7BCQSBxjrYjmPHZHpukgzsBMmBxn59So+iHWmOZtIPH7lFceIIN9juQfpbgttudtey2eOY8tklp2I4Hh1Iles5VmAqNBkcec2MQfdfPmDqEaS30k2NrmL7W3Xo/ZXNnsIkAsadLxPeFu8/cjTds+Z4whNj00JKgskoVA5ocDIPL90rwUDTN5vRJBWZYyJBW8xFEcVlcfhwH2QRuHpSxR3Vi2xUjCVdNipDqTXTZUSvkOb1S4Bt059HSn5a2+yNgPNHFosd0q7N4I81yNhT4Wu4Nhygus6eso2JfLbWUZ4JaufqdXSm4aoEbDPJdYqtkxZczFOYZF05kVxaCnhSXiTsrqsGhsN3WKbnD2uk7Kbh89ky6VUyRcasC2pJNwFa4GoYglU1TO2kWCTDZsAbkI6i6Wzo1YCoM4e5xskpZs2N1HxWYsPFFomINJx43Vg2m3QTEkD35KrpYppO6diccGtsQPlsp2rTM9oahDy0ONw2YExBgyZm+rhzCymMEu0gzLoHEQ50AAcNzxurLOsxLn8B8UWkgHTcOkb6SY4QqV1bvtdeA9sO6yCUtLewZs+rSw1OnQElrAJMDYBZZr8U14AfRuQXB2qIO+4BlehVaAdRk/pCqtDAwud8LRO0nbgFyTL7dsx39s09j24lkEEHVqLY/y6TbbjY+p3Wizak4U+5cxx8lUZbmdOrUAa5jZvo/WOWpaqq8ARLDaQNQBRnNaXh32x9KrXaxxcxjmGRLXN1RHJzQ299z81ksZhZc4uY1lnCG73gg7C9/deqYWnTqXYADJDhEOBFiD1We7RYINLgGgXB1C9g0aoHlvycVeGer4Ryce55eZVSLRM3+JoHKPKx8ZTqTgTFm8yJI5+Q3XYjvNmeJgHiJMuEza8R0QaZG0dOt9j1XbHnUfDGbE+A+lv3Wp7PViHaXOMHSQ3VeDNwNn7RB3lZRr3B2nYzEenCd5VvgX94gWDWTIsLGbg/zFgmVj2vs1mMgsfZ0kgXG0AxO/Db6q9/MtXnfZzFud+FrJa7vfEAAdPeBB5nxNitfWuEJS8aZFlnsXhuKn/mSBBCBWqgi6CqC7DzDlMoNBhDwdSZG6dRMPjqjZaRc6ploEBRqILRIV/jqAexU/5dwbHIoCJjx3ZXKdimD8Ofuy5AYthMdFzHE2QGPgJ+EN7rn069nvBCC1hO6k4lhF+CC51kQUPRKeygEBjijMBOyookOpQFHcyUXWRuuaJRBS0Z5p7gnMYkcIQYXFAx9ewm/idxafDZGebElVGOquueAmLgyQ0m3E/wBUJVGavaXE7kkcCeJB0xeLe6q3XdAESf1XjdS8ZUENEyBN9osbW8fYKLg2Fz2je878AJPsCq8QvNezV81LhSY3apQL5m0hgf6G/sqXNs3fTZOh+kSCQJAIFyY2HVV+WZix4/C/XRLjT1R3qT2mG+LQ6PCFZ03F+prJLXN1RuWOFiCeI2XHMe/d3TL9ewWW5caxa/8ALOJN9Wx4yf4StXSo1Kbe9SqQBIgB0C2wF+SqMgxrqPdAI6NJj/bsFpvzr6jB3nDgbxby4qs+k8erX0y2MzRtN7cSwyx4io2CCY2e0HcjY+Xgk7Q4kPYXXA0l3IiAb/fMq2zHCsAY2BpYZgbWHdHh06LIds8za1v4cgOfb/Q2e8bdLf0WeP7ZSRWeXTjbWFdpgyDqIaRAttBBv9+qE07m8jj7x/JSG9dzpGxk2Ex6hR4g3m/Mc+N+cr0XmDEibSQOcSRv67qwwj2ahY6TIMfFc8Jtxt9lVtr2k3iNrWkx93RsPiLNB2k92J4cfUpk3/Z9+uKL9TwHsJYQIDdPdPIHVJkWtHErfDEOB0vFj8Jtfo6LA+H0XkGUZl+HpLTDiZMSRA236jcdVsxnT3tEbWPVItNe3EMm8J9YsI3WErY15MzCC/M6vF1kDpamo8MdINkw5qzUsw/MXkQSoFQ8SZQOltsT2gYARPBVGJ7RAgwFnXVARZdokFMai3rZ6SwhKs1XJASpHqJbhITMIHar81NYLbIYkHZYbbaTq3eaq/EMPBSaj4ARRpcAlOxoYp2S02aVLq2FlAFQzdPyXhJeZTmMKjsrIv5lPVG0prbKM59+iKyuIQ65AE7R5e/BBK7H4q2kTe3FtztHPlO11nsTi51GbRxI4iARPHf0RsfihGkSNMRM7/yVVVqydx4ASLe91ULKh1nlwEeQ3O26XL3Q+SQBcTIHxAtPjYlBeSTMQR9Ega7gDfdVZuaTLq7TMTiZrB1Mnu6Q0ixOkAT5wtt2Yz1gdpqd0uEHkeo/ZefUWkOEq7ZhXPgNaXeAKyzxmtem3Hbvb02i9pdaD4ex81dU8UxjJcQI63Xn2VZJioBdU0Dl8T/2V/SwDv1uLup/YLkzs9u7GWwPOs8DQ5w9eUmJ6rynE4pz6he8ySfbhHIL1jNcua6m7u3gx4ryvMsEaL9J47eVrrb8e49/bm/JmWp6BY6BxsfECRuOqe+oZtv1uLcuV4QydrSP5dE5zu7pgG4JI4HgOn8yutxCMfLdMQYItbiT9+Sc0Q6CQL3PPz4/yQPhNuV4/dPOmOvHjY/Ipha5bVaXAOkwY4WG5v5BanBv7tjYW2++awuHfp+HnMbz09CtXkuN7paT1AMAjoUrDlWb3ppCSpe4QZcjqFxFeFHqtsiB87p7mE7JylYr6D+9CsGCQVBdTLXKRRqJbPTqoGlch1jZcls1lTeE2souHJKnCkS1Zaa7RMW8aQeSdlrS+42ULEAwQVc5M9oYqkRb3SBTlRsbhDwCtW1GBFaxpEyiw5WcNMtGx9FFfVWlhmyrMZgATIKJCqo/NwUcangz3RAgmPHYgyoWcUvw2NcLOBDp6Ndt1BA90HOsxLGQ03Np5D90/Jb0Bj2U2d58veeZ7s8ZaDHkSVWYjFd1jQIlsuLQAZM2HK6Lm/dLKY/Q2Xcy51zKrXzDRFyBA8SYWkk0i27FDddmx0Ex8+KmVKjHOFJgixBdxLgNh0kboGMphha1vxAAudx1HkeAEJMqZNZgibk+gN0fWynnS07H0Q+s9rgCdEiQDGlwBj/ct5TwJBBCx/ZhmjHPH+R/uWlegNK4ue3qd/4+ukfDUyAiDDoLHlE/FK5ri6pkfWoCIK8r7dYeK5MzAaPUT9V6Y9zisX20wE98fqb/ABN2+notuD9cmPPOrFhgyx5H5/fzTGug2kW/r48UekZCV9OV6GnmbCMDYb+nCL+6RokiQR9jc+i5zDwG/JOqtAcBMiBJiYNtkGI4wSI2jx4T8lOwOKhwAPHiOE8+UFV8wSCZGw5Rfn93TqDodN7dP4T6eyA2WDrCPv26KWHhUmCJ2iIid7GLffgrFlF+6zyla42aPfYpWVipWEy5z99lZNylrN08ccr3TlljGfxT5UdjoV1m+UjTqYqFjSU8pZ5Eyl8Fr1LLkzEjurlIWOEfAUgYvgqyjiQOKmnCl7NbY29VUw7bTc/pX5rV0nxRsBVMbqkxz3FwngpmHr7AbqbjZFYZS1a1qzpsUYYx4ESqtziDdEFadgs7tvjIs24g80lLEHVcqAx55FSsAQXjkLny/nA80d1WY6R+1wkQLw2LdBCyuKqGo2kCbnunx1Bsq+z6rJcQSBckjjzWda8f9I8Af/0JWuPhy5eRMS01MQ4D9T3DwEwT5Aey6tWDa7Ts1rwByDWw1Fy3/wBao/gxrz6mPqULA4T8R0n4W3d15DzVJDxrSHuB3B/orPs9R7xeeUD1v8goeO7zWvO92O8W7HzHyKl5didLGieJHuqvfEp5WWDqNZjQ5zg0FhuTAk2AkrbUcRNxcdF5rnbgXtP+X6hRqNUt+Fxb/pJb8ljlw9ffbfDm6O2tvX6bgUrngGF5bSzvEN+Gs/zId/yRD2hxJ/8AdP8AtZ/2rP8A5cvcbf8AVj6r00vCp+07QaOqw0uBJPIyPqFiHZ/iTvWd5BrfkFAxOKe+73uef8ziY8J2VY/j2XdqM/yZZqRHox3o2kx4TZEUfDCC5vopRC6I5b5CiZ8ElIC8iSRM7AGTb3CIPv1TH04PiiwRz290G2/smgWkcgZmfMo7BLT0+lkOgEBc5dVnvAXgNO/Dp5q4ZjCG7Kiyt0v0Alu0GBE8jz4qxzOt+GB6JXHY2m0s9cwwAur9oXusQVRnGthAdiw4wEt2Q9Tfde184fpjdVwxLtURvdNpvDoT477fNRu2d16k8HYkmL9Fy7NKwgRyC5GPgXyoqeKM7rZdnsQ57C0bDbndA/8ACXgrHLcofSmOK0vNjYznHlKyma0tFZzSevqrLstl/wCNUMbDc8la4nIHVHl7jcqxybJnUHFzCL7rPPlxs1tePHlKPiez7J7xmPRQnZY1pgK4q4V73anP8hsEN2XGfiU48mEndWWOd8Ks4ZkQUF7GsYSNzbyF/vwVqcpvuqfNyGHQP02/dXeXHKaiccMsbu1m80JLHXvBWdf8A6OcPYEfVW2b1Yb98VRh1iOce39U8e0F8r3JKf8A0qjuLjp8hf5lWOBohjCB5oOWtikwc2g/xvn6KU+zSp2ekHEMBYW/4tujpkH1t5qlBIttf3CsMdV7kKC92rvcTZ3+obnz39VpizolbEF8TwEe65qE1PBVQhFwC4FcSntRQEmlcCnSjaQmjvjqCPRHKC495vj9CiuN1IdG/wB8U542KRpRIsgGsHx+E+yBS2CmNbc+A+qg00BNw74dIt9yr3HYYVQHEWIB9Vn2Fb3s6xr8O2d2ktPkZHsQpyy6Zs8ceq6ZKplM2CdTyeLwvQGYVgS/l2LC81v02nHGDZgi07KZjMvIZrG8Std+WYiuosIibKflvpXRHl7aTnu7wPukXpYy6muWnzz0z+L+1iMC9cMuctBpCUMC4+uuvpjPty5yK3L3K9awJ4aEdVHTFD/d7l393OV/AXQEdVGoz5y8i5Xn+bVZe49SvUs0cG03u5Md8l49m9WA48ltw7u2XLqM1mlaXRwCgItZ034plNskDmQuu9nO2LWaAxn+Fg9yT9V1d8snnMdVGznFaXu07lpjxLmgexQxVBf+HNqdMT1dA1fNZqUuJqyUNj4N9jv48D99UNxufEpHbLX6QlDdJqTKDuHJc7c+KNgXUnFyAE6UwLK4uQkpcUBznd5vipJKgtPeU2UFTgVIYojFIY6yDFm5UBu58SpjSoTT80BJpre9gmte2ow8C1w/+wIP/ELBMWv/ALPq0Yhw4Opu9WuYR7allzd8Krj/AJRvW5cxEGWsR2uCeCF5+8nZ0xF/utiQ5axTAQlJCP29jUQv7uYuU1oCRP8Ab2NREGNTxjlB/AThQVaCaMcjtxPVVn4CX8JGgsX4nqh/mSorWJ4YjQAzvExQeTyHu4LyXOWB3ee7SJnmT0AXpfad5GHcY4t+a8uxuAL36qj4A36Dk0Lo4fDDl8qh+jZocepge11G2U2tUZsxsD/E4kuP0CiVSZuumsIsszxQNQOBkb+8pMteSazz/wDG71c5sfVVamYerppVBxcWDy7xP0U6UiSnozKUN1HigqommsdBUip8Xp8kBw4o9O4Hp6IgKGp4anhqXSmA9KRwi6MQhYj4SlQjUPiUxx2UTDC6lfq9kQUVo2RJv5JGhI8wfJMGmpAceQUem4Jhf3TPE/K65jZ2IP3ySCYxaLsTVjFMB46x/A79gsqwuCu+zFb/AMzTix1R6ghLL+N/wY+Y9gaQlkc1WvJAmUI1uZXn93ZuLCpiADuhsryd1V18Swbn3QGZiyd1Uwys8F1yNG2oBuUqzbs4ZfvLk/iz9F8mPtpSE5gQybwiCoRssrk0LpShiCXmU1z3JbCUGpsITXFOJMQSjYV3aCHUHAf4m/8AJeW4sF73b6QT5r1DOgG0Hxvb5hecYshgvxXVwXsx5PLMvZBI5E/NNqRCWpUlzjzJKSJ39F1udHXItVvFCUmL+O6NJMjqmhMCezdOFT28uafh9kwhPpbeqYS2p0ITURALCDivhPl80cIWLHdPl8wlQi4QXPgjMF12W1g0mY71pInTsZHX90oF95vvz8kQqlBDrmx8CiIGIdYnog0OkNUDl9UhaWmxuPX0RMGJJ8FM02uiALD1A6xF1PwJ0VGPG7XNPoQoOKpfqG4+StMmp/iPpD/E8T4C59gj/Qva+dPdxKh1MwqHiVrWZRTHBFGWs5I6sJ4hdOV81iPxXniVxpvPP3W5/u9nJcMCzkq+Wei+K+2Jo4R0iQYXLc/lmjguS+X+h8X9v//Z",
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "cover",
                }}
              />
            </Pressable>

            <Pressable
              onPress={() => handleSnapPress(0)}
              style={styles.headerbtn}
            >
              <Image
                source={{
                  uri: "https://thenounproject.com/api/private/icons/637659/edit/?backgroundShape=SQUARE&backgroundShapeColor=%23000000&backgroundShapeOpacity=0&exportSize=752&flipX=false&flipY=false&foregroundColor=%23000000&foregroundOpacity=1&imageFormat=png&rotation=0",
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "cover",
                  transform: [{ scale: 1.5 }],
                  backgroundColor: "#f7f7f7",
                }}
              />
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
            />
          </Pressable>
        </View>

        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          bounces
          initialScrollIndex={0}
          contentContainerStyle={{
            gap: Dimensions.get("window").height * 0.02,
            paddingHorizontal: Dimensions.get("window").width * 0.06,
          }}
          data={[
            { _id: 1, name: "all" },
            { _id: 2, name: "Main Course" },
            { _id: 3, name: "Breakfast" },
            { _id: 4, name: "Soup" },
            { _id: 5, name: "Cakes" },
          ]}
          renderItem={({ item, index }) => {
            return (
              <PillButton
                key={index}
                selected={_selected === item._id}
                text={item.name}
                onpress={() => setCurrentSelected(item._id)}
              />
            );
          }}
        />

        {/* body */}
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
            <Text style={[styles.fs14, styles.textmP]}>15 Recipe</Text>

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
            {dataArray.map((item) => {
              return (
                <RecipeListItem
                  key={item._id}
                  horizontal={gridView}
                  {...item}
                />
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>

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
        pointerEvents={bottomSheetOpen === true ? 'auto' : 'none'}
      />

      {/* bottom sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
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
            onPress={() => bottomSheetRef?.current?.close()}
          >
            <Text style={[styles.textmP, { fontSize: 24, paddingTop: 12 }]}>
              Menu
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
          backgroundColor: "#e3e8e6",
          borderRadius: Dimensions.get("window").width * 0.1,
        }}
      >
        <View
          style={{
            flex: 1,
            // alignItems: "center",
          }}
        >
          <Text>Awesome 🎉</Text>
        </View>
      </BottomSheet>
    </Pressable>
  );
}
