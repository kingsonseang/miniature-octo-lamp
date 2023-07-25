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

export default function Login({ navigation }) {
  const emailInputRef = useRef();
  const [emailErr, setEmailErr] = useState(false);
  const [obscure, setObscure] = useState(true);
  const passwordInputRef = useRef();

  return (
    <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
      <StatusBar style="dark" backgroundColor="#fff" />
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
          <Text style={[styles.textmP, styles.fs20]}>Login</Text>
          <View style={styles.headerbtn} />
        </View>

        {/* form */}

        {/* email input */}
        <View style={{ gap: Dimensions.get("window").height * 0.012 }}>
          <Text style={[styles.fs14, styles.textmP]}>Email Address</Text>
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
            <Feather name="mail" size={24} color={!emailErr ? "#000" : "red"} />
            <TextInput
              caretColor="#000"
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
          <Text style={[styles.fs14, styles.textmP]}>Password</Text>
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
            onPress={() => emailInputRef.current.focus()}
          >
            <Feather name="lock" size={24} color="black" />
            <TextInput
              caretColor="#000"
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
              onChangeText={() => console.log(passwordInputRef)}
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
          <Text style={[styles.textmP, styles.fs12, { opacity: 0.6 }]}>
            Forgot your password?
          </Text>
          <Pressable onPress={() => navigation.navigate("Create")}>
            <Text style={[styles.textmP, styles.fs12]}>Reset</Text>
          </Pressable>
        </View>

        {/* login btn */}
        <AuthButton onpress={() => console.log("jjd")} text="Continue" />

        {/* Register an account */}
        <View>
          <Text style={[styles.textP, styles.fs12]}>
            Don't have an account yet?{" "}
            <Text
              onPress={() => navigation.navigate("Create")}
              style={[styles.textmP, styles.fs12]}
            >
              Create an Account.
            </Text>
          </Text>
        </View>
      </SafeAreaView>
    </Pressable>
  );
}
