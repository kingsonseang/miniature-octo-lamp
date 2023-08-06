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
import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./styles";
import { AntDesign, Feather } from "@expo/vector-icons";
import AuthButton from "../../components/AuthButton";
import { StatusBar } from "expo-status-bar";
import { AuthContext } from "../../context/AuthContext";

export default function Otp(props) {
  const { navigation, route: { params } } = props;

  const { VerifyEmail } = useContext(AuthContext);

  const otpInputRef = useRef();
  const [otpErr, setOtpErr] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [authButtonInvalid, setAuthButtonInvalid] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOtpChange = (text) => {
    // Filter out non-numeric characters using a regular expression
    const numericValue = text.replace(/[^0-9]/g, '');
    setOtp(numericValue);
  };

  const handleOnPress = async () => {

    if (loading == true) {
      return
    }

    setResendDisabled(true);
    setAuthButtonInvalid(true);

    if (!otp || !otp.trim()) {
      setAuthButtonInvalid(false);
      otpInputRef.current.focus();
      return;
    }

    setLoading(true)
    const loggedIn = await VerifyEmail(params.email?.toLowerCase(), otp)

    if (!loggedIn) {
      setAuthButtonInvalid(false)
      setLoading(false)
      setAuthButtonInvalid(false)
      return 
    }

    setLoading(false);
    setResendDisabled(false);
    setAuthButtonInvalid(false)
  };

  const onResendPress = async () => {

  }

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
          <Text allowFontScaling style={[styles.textmP, styles.fs20]}>Verify</Text>
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
            onPress={() => otpInputRef.current.focus()}
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
