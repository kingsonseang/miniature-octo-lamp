import {
  ActivityIndicator,
  Dimensions,
  Keyboard,
  Linking,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./styles";
import { AntDesign, Feather } from "@expo/vector-icons";
import AuthButton from "../../components/AuthButton";
import { StatusBar } from "expo-status-bar";
import { AuthContext } from "../../context/AuthContext";
import { isValidEmail, isValidPassword } from "../../utils/validate";
import { CommonActions } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../constants/colors";

export default function LoginPage(props: any) {
  const {
    navigation,
    route: {
      params
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

  // resetPasswordEmail

  const { Login } = authContext;

  const navigation1 = useNavigation();

  const goBackToInitialRoute = () => {
    navigation1.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "SplashScreen" }], // Replace 'Home' with the name of your initial route
      })
    );
  };

  const emailInputRef = useRef<TextInput | null>(null);
  const [emailErr, setEmailErr] = useState(false);
  const [email, setEmail] = useState(params?.resetPasswordEmail ? params.resetPasswordEmail : "");
  const [obscure, setObscure] = useState(true);
  const passwordInputRef = useRef<TextInput | null>(null);
  const [password, setPassword] = useState("");
  const [passwordErr, setPasswordErr] = useState(false);
  const [authButtonInvalid, setAuthButtonInvalid] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOnPress = async () => {
    if (loading == true) {
      return;
    }

    setAuthButtonInvalid(true);

    if (!email || !email.trim()) {
      setAuthButtonInvalid(false);
      emailInputRef?.current?.focus();
      return;
    }

    if (!password || !password.trim()) {
      setAuthButtonInvalid(false);
      passwordInputRef?.current?.focus();
      return;
    }

    if (!isValidEmail(email)) {
      setAuthButtonInvalid(false);
      emailInputRef?.current?.focus();
      setEmailErr(true);
      return;
    }

    if (!isValidPassword(password)) {
      setAuthButtonInvalid(false);
      passwordInputRef?.current?.focus();
      setPasswordErr(true);
      return;
    }

    setLoading(true);
    const loggedIn = await Login(email.toLowerCase(), password);
    alert('login complete')

    if (!loggedIn) {
      setAuthButtonInvalid(false);
      setLoading(false);
      setAuthButtonInvalid(false);
      return;
    }

    if (loggedIn && typeof loggedIn !== "boolean") {
      if (loggedIn?.error === true && loggedIn?.emailVerified === false) {
        setAuthButtonInvalid(false);
        setLoading(false);
        setAuthButtonInvalid(!loggedIn?.error);
        return;
      }

      if (loggedIn?.error === false && loggedIn?.emailVerified === false) {
        setAuthButtonInvalid(false);
        setLoading(false);
        setAuthButtonInvalid(!loggedIn?.error);

        // send user to otp page
        return navigation.navigate("Otp", { email: email.toLowerCase() });
      }

      if (loggedIn?.error) {
        setAuthButtonInvalid(false);
        setLoading(false);
        setAuthButtonInvalid(!loggedIn?.error);
        return;
      }
    }

    return goBackToInitialRoute();
  };

  return (
    <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <SafeAreaView
        style={[
          styles.container,
          styles.containerPadding,
          {
            alignItems: "center",
            gap: Dimensions.get("window").height * 0.03,
          },
        ]}
      >
        {/* header */}
        <View
          style={[
            styles.header,
            { paddingVertical: Dimensions.get("window").height * 0.01 },
          ]}
        >
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.headerbtn}
          >
            <AntDesign name="arrowleft" size={24} color="black" />
          </Pressable>
          <Text allowFontScaling style={[styles.textmP, styles.fs20]}>
            Login
          </Text>
          <View style={styles.headerbtn} />
        </View>

        {/* form */}

        {/* email input */}
        <View style={{ gap: Dimensions.get("window").height * 0.012 }}>
          <Text allowFontScaling style={[styles.fs14, styles.textmP]}>
            Email Address
          </Text>
          <Pressable
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              borderWidth: 2,
              paddingVertical: Dimensions.get("window").height * 0.018,
              paddingHorizontal: Dimensions.get("window").height * 0.015,
              borderRadius: Dimensions.get("window").height * 0.018,
              borderColor: !emailErr ? "#000" : "red",
            }}
            onPress={() => emailInputRef?.current?.focus()}
          >
            <Feather name="mail" size={24} color={!emailErr ? "#000" : "red"} />
            <TextInput
              cursorColor="#000"
              textAlignVertical="center"
              underlineColorAndroid="transparent"
              style={[
                styles.textmP,
                { flex: 1, backgroundColor: "transparent" },
              ]}
              ref={emailInputRef}
              placeholder="Enter Email Address"
              placeholderTextColor="rgba(0,0,0,0.4)"
              autoComplete="email"
              onChangeText={(e) => setEmail(e.trim())}
              value={email}
              onEndEditing={(e) => {
                if (isValidEmail(e.nativeEvent.text.trim())) {
                  setEmailErr(false);
                  passwordInputRef?.current?.focus();
                }
              }}
            />
          </Pressable>
          {emailErr && (
            <Text
              allowFontScaling
              style={[
                styles.textP,
                { color: "#f00000", opacity: 0.6, fontSize: 10 },
              ]}
            >
              Invalid email, expected e.g someone@example.com
            </Text>
          )}
        </View>

        {/* passwordInput */}
        <View style={{ gap: Dimensions.get("window").height * 0.012 }}>
          <Text allowFontScaling style={[styles.fs14, styles.textmP]}>
            Password
          </Text>
          <Pressable
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              borderWidth: 2,
              paddingVertical: Dimensions.get("window").height * 0.018,
              paddingHorizontal: Dimensions.get("window").height * 0.015,
              borderRadius: Dimensions.get("window").height * 0.018,
            }}
            onPress={() => passwordInputRef?.current?.focus()}
          >
            <Feather name="lock" size={24} color="black" />
            <TextInput
              cursorColor="#000"
              textAlignVertical="center"
              underlineColorAndroid="transparent"
              style={[
                styles.textmP,
                { flex: 1, backgroundColor: "transparent" },
              ]}
              ref={passwordInputRef}
              placeholder="Enter Password"
              placeholderTextColor="rgba(0,0,0,0.4)"
              secureTextEntry={obscure}
              keyboardType={obscure ? "default" : "visible-password"}
              autoComplete="password"
              onChangeText={(e) => setPassword(e.trim())}
              value={password}
              // passwordRules="minlength:8; required: special; required: upper; required: lower; required: digit; no common;"
            />
            <Pressable onPress={() => setObscure(!obscure)}>
              <Feather
                name={obscure ? "eye-off" : "eye"}
                size={24}
                color="black"
              />
            </Pressable>
          </Pressable>
          {passwordErr && (
            <Text
              allowFontScaling
              style={[
                styles.textP,
                { color: "#f00000", opacity: 0.6, fontSize: 10 },
              ]}
            >
              Password mst contain at least one small and capital Alphabet, one
              number and at least 6 charachters in lenght
            </Text>
          )}
        </View>

        {/* accesibility */}
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            allowFontScaling
            style={[styles.textmP, styles.fs12, { opacity: 0.6 }]}
          >
            Forgot your password?
          </Text>
          <Pressable onPress={() => navigation.navigate("Reset")}>
            <Text allowFontScaling style={[styles.textmP, styles.fs12]}>
              Reset
            </Text>
          </Pressable>
        </View>

        {/* login btn */}
        <AuthButton
          loading={loading}
          disbaled={authButtonInvalid}
          onpress={handleOnPress}
          text="Continue"
        />

        {/* Register an account */}
        <View>
          <Text allowFontScaling style={[styles.textP, styles.fs12]}>
            Don't have an account yet?{" "}
            <Text
              onPress={() => navigation.navigate("Create")}
              style={[styles.textmP, styles.fs12]}
            >
              Create an Account.
            </Text>
          </Text>
        </View>

        {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.secondaryColor,
            opacity: 0.5,
          }}
        >
          <ActivityIndicator size="small" color="#000000" />
        </View>
      ) : null}
      </SafeAreaView>
    </Pressable>
  );
}
