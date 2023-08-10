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
import { CommonActions } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { isValidPassword } from "../../utils/validate";

export default function PasswordReset(props: any) {
  const {
    navigation,
    route: { params: { email } },
  } = props;

  const authContext = useContext(AuthContext);

  if (!authContext) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small" color="#000000" />
      </View>
    );
  }

  const { ResetPassword } = authContext


  const otpInputRef = useRef<TextInput | null>(null);
  const [otpErr, setOtpErr] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [authButtonInvalid, setAuthButtonInvalid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [obscure, setObscure] = useState(true);
  const passwordInputRef = useRef<TextInput | null>(null);
  const [password, setPassword] = useState("");
  const [passwordErr, setPasswordErr] = useState(false);

  const handleOtpChange = async (text: string) => {
    // Filter out non-numeric characters using a regular expression
    const numericValue = text.replace(/[^0-9]/g, "");
    setOtp(numericValue);
  };

  const handleOnPress = async () => {
    if (loading == true) {
      return;
    }

    setResendDisabled(true);
    setAuthButtonInvalid(true);

    if (!otp || !otp.trim()) {
      setAuthButtonInvalid(false);
      otpInputRef?.current?.focus();
      return;
    }

    if (!password || !password.trim()) {
      setAuthButtonInvalid(false);
      passwordInputRef?.current?.focus();
      return;
    }

    if (!isValidPassword(password)) {
      setAuthButtonInvalid(false);
      passwordInputRef?.current?.focus();
      setPasswordErr(true);
      return;
    }

    setLoading(true);

    const passwordReset = await ResetPassword(email, otp, password)

    if (!passwordReset) {
      setAuthButtonInvalid(false)
      setLoading(false)
      setAuthButtonInvalid(false)
      return 
    }

    setLoading(false);

    return navigation.navigate("Login", { resetPasswordEmail: email.toLowerCase() })
  };

  const onResendPress = async () => {};

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
            Verify
          </Text>
          <View style={styles.headerbtn} />
        </View>

        {/* form */}

        {/* otp input */}
        <View style={{ gap: Dimensions.get("window").height * 0.012 }}>
          <Text allowFontScaling style={[styles.textP, styles.fs12]}>
            An Otp has been sent to your mail, if you didn't recieve one please
            make sure to check your spam folder.
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
              borderColor: !otpErr ? "#000" : "red",
            }}
            onPress={() => otpInputRef?.current?.focus()}
          >
            <Feather name="key" size={24} color={!otpErr ? "#000" : "red"} />
            <TextInput
              cursorColor="#000"
              textAlignVertical="center"
              underlineColorAndroid="transparent"
              maxLength={6}
              style={[
                styles.textmP,
                { flex: 1, backgroundColor: "transparent" },
              ]}
              ref={otpInputRef}
              placeholder="000000"
              placeholderTextColor="rgba(0,0,0,0.4)"
              autoComplete="sms-otp"
              onChangeText={(e) => handleOtpChange(e.trim())}
              value={otp}
              keyboardType="decimal-pad"
            />
          </Pressable>
        </View>

        {/* accesibility */}
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {/* <Text allowFontScaling style={[styles.textmP, styles.fs12, { opacity: 0.6 }]}>
            </Text> */}
          <Pressable onPress={onResendPress}>
            <Text
              style={[
                styles.textmP,
                styles.fs12,
                resendDisabled && { opacity: 0.4 },
              ]}
            >
              Resend
            </Text>
          </Pressable>
        </View>

        {/* passwordInput */}
        <View style={{ gap: Dimensions.get("window").height * 0.012 }}>
          {/* <Text allowFontScaling style={[styles.fs14, styles.textmP]}>
            Password
          </Text> */}
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
              placeholder="Enter New Password"
              placeholderTextColor="rgba(0,0,0,0.4)"
              secureTextEntry={obscure}
              keyboardType={obscure ? "default" : "visible-password"}
              autoComplete="new-password"
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
              Password must contain at least one small and capital Alphabet, one
              number and at least 6 charachters in length.
            </Text>
          )}
        </View>

        {/* login btn */}
        <AuthButton
          loading={loading}
          disbaled={authButtonInvalid}
          onpress={handleOnPress}
          text="Continue"
        />
      </SafeAreaView>
    </Pressable>
  );
}
