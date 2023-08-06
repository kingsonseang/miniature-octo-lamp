import {
  Dimensions,
  Keyboard,
  Linking,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useRef, useState } from "react";
import styles from "./styles";
import { AntDesign, Feather } from "@expo/vector-icons";
import AuthButton from "../../components/AuthButton";
import { StatusBar } from "expo-status-bar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Create({ navigation }) {
  const usernameInputRef = useRef();
  const [usernameErr, setUsernameErr] = useState(false);
  const firstnameInputRef = useRef();
  const [firstnameErr, setFirstnameErr] = useState(false);
  const lastnameInputRef = useRef();
  const [lastnameErr, setLastnameErr] = useState(false);
  const emailInputRef = useRef();
  const [emailErr, setEmailErr] = useState(false);
  const passwordInputRef = useRef();
  const [passwordErr, setPasswordErr] = useState(false);
  const [obscure, setObscure] = useState(true);

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
          <Text allowFontScaling style={[styles.textmP, styles.fs20]}>Create an Account</Text>
          <View style={styles.headerbtn} />
        </View>

        {/* form */}
        <KeyboardAwareScrollView
          style={{
            width: "100%",
          }}
          contentContainerStyle={{
            gap: Dimensions.get("window").height * 0.03,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* username input */}
          <View style={{ gap: Dimensions.get("window").height * 0.012 }}>
            <Text allowFontScaling style={[styles.fs14, styles.textmP]}>Username</Text>
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
                borderColor: !usernameErr ? "#000" : "red",
              }}
              onPress={() => usernameInputRef.current.focus()}
            >
              <Feather
                name="user"
                size={24}
                color={!usernameErr ? "#000" : "red"}
              />
              <TextInput
                cursorColor="#000"
                textAlignVertical="center"
                underlineColorAndroid="transparent"
                style={[
                  styles.textmP,
                  { flex: 1, backgroundColor: "transparent" },
                ]}
                ref={usernameInputRef}
                placeholder="Username"
                placeholderTextColor="rgba(0,0,0,0.4)"
                autoComplete="username-new"
              />
            </Pressable>
          </View>

          {/* name */}
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              gap: Dimensions.get("window").width * 0.04,
            }}
          >
            {/* First name input */}
            <View
              style={{ gap: Dimensions.get("window").height * 0.012, flex: 1 }}
            >
              <Text allowFontScaling style={[styles.fs14, styles.textmP]}>First name</Text>
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
                  borderColor: !firstnameErr ? "#000" : "red",
                }}
                onPress={() => firstnameInputRef.current.focus()}
              >
                <Feather
                  name="user"
                  size={24}
                  color={!firstnameErr ? "#000" : "red"}
                />
                <TextInput
                  cursorColor="#000"
                  textAlignVertical="center"
                  underlineColorAndroid="transparent"
                  style={[
                    styles.textmP,
                    { flex: 1, backgroundColor: "transparent" },
                  ]}
                  ref={firstnameInputRef}
                  placeholder="First name"
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  autoComplete="name-given"
                />
              </Pressable>
            </View>
            {/* Last name input */}
            <View
              style={{ gap: Dimensions.get("window").height * 0.012, flex: 1 }}
            >
              <Text allowFontScaling style={[styles.fs14, styles.textmP]}>Last name</Text>
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
                  borderColor: !lastnameErr ? "#000" : "red",
                }}
                onPress={() => lastnameInputRef.current.focus()}
              >
                <Feather
                  name="user"
                  size={24}
                  color={!lastnameErr ? "#000" : "red"}
                />
                <TextInput
                  cursorColor="#000"
                  textAlignVertical="center"
                  underlineColorAndroid="transparent"
                  style={[
                    styles.textmP,
                    { flex: 1, backgroundColor: "transparent" },
                  ]}
                  ref={lastnameInputRef}
                  placeholder="Last name"
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  autoComplete="name-family"
                />
              </Pressable>
            </View>
          </View>

          {/* email input */}
          <View style={{ gap: Dimensions.get("window").height * 0.012 }}>
            <Text allowFontScaling style={[styles.fs14, styles.textmP]}>Email Address</Text>
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
              onPress={() => emailInputRef.current.focus()}
            >
              <Feather
                name="mail"
                size={24}
                color={!emailErr ? "#000" : "red"}
              />
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
              />
            </Pressable>
          </View>

          {/* passwordInput */}
          <View style={{ gap: Dimensions.get("window").height * 0.012 }}>
            <Text allowFontScaling style={[styles.fs14, styles.textmP]}>Password</Text>
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
              onPress={() => passwordInputRef.current.focus()}
            >
              <Feather
                name="lock"
                size={24}
                color={!passwordErr ? "#000" : "red"}
              />
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
                autoComplete="password-new"
                onChangeText={() => console.log(passwordInputRef)}
                passwordRules="minlength:8; required: special; required: upper; required: lower; required: digit; no common;"
              />
              <Pressable onPress={() => setObscure(!obscure)}>
                <Feather
                  name={obscure ? "eye-off" : "eye"}
                  size={24}
                  color="black"
                />
              </Pressable>
            </Pressable>
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
            <Text allowFontScaling style={[styles.textmP, styles.fs12, { opacity: 0.6 }]}>
              Already have an Account?
            </Text>
            <Pressable onPress={() => navigation.navigate("Login")}>
              <Text allowFontScaling style={[styles.textmP, styles.fs12]}>Login</Text>
            </Pressable>
          </View>

          {/* login btn */}
          <AuthButton onpress={() => console.log("jjd")} text="Continue" />
        </KeyboardAwareScrollView>

        {/* consent */}
        <View
          style={{
            alignItems: "center",
          }}
        >
          <Text allowFontScaling style={[styles.textP, styles.fs12]}>
            By continuing, you agree to the
          </Text>
          <View style={styles.TnCContainer}>
            <Pressable onPress={() => Linking.openURL("https://google.com")}>
              <Text allowFontScaling style={[styles.textmP, styles.fs12]}>
                Terms and Services
              </Text>
            </Pressable>
            <Text allowFontScaling style={[styles.textP, styles.fs12]}>&</Text>
            <Pressable onPress={() => Linking.openURL("https://google.com")}>
              <Text allowFontScaling style={[styles.textmP, styles.fs12]}>Privacy Policy</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </Pressable>
  );
}
