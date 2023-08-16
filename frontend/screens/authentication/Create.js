import {
  ActivityIndicator,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
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
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import api from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { isValidEmail, isValidPassword } from "../../utils/validate";

export default function Create({ navigation }) {

  const { Register } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [authButtonInvalid, setAuthButtonInvalid] = useState(false)

  const usernameInputRef = useRef();
  const [usernameErr, setUsernameErr] = useState(false);
  const [usernameSugg, setUsernameSugg] = useState('');
  const [username, setUsername] = useState('');
  const [usernameLoading, setUsernameLoading] = useState(null);
  const [usernameValid, setUsernameValid] = useState(null);
  const firstnameInputRef = useRef();
  const [firstname, setFirstname] = useState('');
  const [firstnameErr, setFirstnameErr] = useState(false);
  const lastnameInputRef = useRef();
  const [lastname, setLastname] = useState('');
  const [lastnameErr, setLastnameErr] = useState(false);
  const emailInputRef = useRef();
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState(false);
  const passwordInputRef = useRef();
  const [password, setPassword] = useState('');
  const [passwordErr, setPasswordErr] = useState(false);
  const [obscure, setObscure] = useState(true);

  const validateUsername = async () => {

    setUsernameValid(null)
    setUsernameLoading(true)

    const getUsernameValidation = await api.post("/auth/validation/username", { username: username })

    if (getUsernameValidation.data?.valid === false) {
      setUsernameErr(true)
      setUsernameLoading(false)
      setUsernameValid(false)
      setUsernameSugg(getUsernameValidation.data?.suggestions)
      usernameInputRef.current?.focus()
      return
    }

    setUsernameErr(false)
    setUsernameLoading(false)
    setUsernameValid(true)
    firstnameInputRef.current?.focus()
  }

  const handleOnPress = async () => {

    if (loading == true) {
      return
    }

    setAuthButtonInvalid(true)

    const getUsernameValidation = await api.post("/auth/validation/username", { username: username })

    if (getUsernameValidation.data?.valid === false) {
      setUsernameErr(true)
      setUsernameLoading(false)
      setUsernameValid(false)
      setUsernameSugg(getUsernameValidation.data?.suggestions)
      usernameInputRef.current?.focus()
      return
    }

    setUsernameErr(false)
    setUsernameLoading(false)
    setUsernameValid(true)

    if (!firstname || !firstname.trim()) {
      setAuthButtonInvalid(false)
      setFirstnameErr(true)
      firstnameInputRef.current.focus()
      return
    }

    if (!lastname || !lastname.trim()) {
      setAuthButtonInvalid(false)
      setLastnameErr(true)
      lastnameInputRef.current.focus()
      return
    }

    if (!email || !email.trim()) {
      setAuthButtonInvalid(false)
      setEmailErr(true)
      emailInputRef.current.focus()
      return
    }

    if (!password || !password.trim()) {
      setAuthButtonInvalid(false)
      setPasswordErr(true)
      passwordInputRef.current.focus()
      return
    }

    if (!isValidEmail(email)) {
      setAuthButtonInvalid(false)
      emailInputRef.current.focus()
      setEmailErr(true)
      return
    }

    if (!isValidPassword(password)) {
      setAuthButtonInvalid(false)
      passwordInputRef.current.focus()
      setPasswordErr(true)
      return
    }

    setLoading(true)
    const created = await Register(email.toLowerCase(), password.trim(), firstname.trim(), lastname.trim(), username.trim())

    console.log(created);

    if (!created) {
      setAuthButtonInvalid(false)
      setLoading(false)
      setAuthButtonInvalid(false)
      return 
    }

    return navigation.replace("Otp", { email: email.toLowerCase().trim() });
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
          <Text allowFontScaling style={[styles.textmP, styles.fs20]}>
            Create an Account
          </Text>
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
          enableOnAndroid={true}
          enableAutomaticScroll={Platform.OS === "ios"}
          keyboardVerticalOffset={Platform.select({ios: 0, android: 500})}
          behavior= {(Platform.OS === 'ios')? "padding" : null}
        >
          {/* username input */}
          {/* <View style={[usernameErr ? null : { gap: Dimensions.get("window").height * 0.012 }]}>
            <Text allowFontScaling style={[styles.fs14, styles.textmP]}>
              Username <Text style={[styles.fs12, styles.textP]}>(Optional)</Text>
            </Text>
            {usernameErr ? <Text style={[styles.fs12, styles.textP]}>Username already exists, try {usernameSugg}</Text> : null}
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
                onBlur={validateUsername}
                onEndEditing={validateUsername}
                onChangeText={text => setUsername(text.trim())}
                value={username}
              />
              {usernameLoading === true && usernameValid === null ? <ActivityIndicator size="small" color="#5d5e5e" /> : null}
              {usernameValid === true && usernameLoading === false ? <AntDesign name="checkcircleo" size={18} color="black" /> : null }
              {usernameValid === false && usernameLoading === false ? <AntDesign name="exclamationcircleo" size={24} color="red" /> : null}
            </Pressable>
          </View> */}

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
              <Text allowFontScaling style={[styles.fs14, styles.textmP]}>
                First name
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
                  onEndEditing={()=>lastnameInputRef.current?.focus()}
                  onChangeText={text => setFirstname(text.trim())}
                  value={firstname}
                />
              </Pressable>
            </View>
            {/* Last name input */}
            <View
              style={{ gap: Dimensions.get("window").height * 0.012, flex: 1 }}
            >
              <Text allowFontScaling style={[styles.fs14, styles.textmP]}>
                Last name
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
                  onEndEditing={()=>emailInputRef.current?.focus()}
                  onChangeText={text => setLastname(text.trim())}
                value={lastname}
                />
              </Pressable>
            </View>
          </View>

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
                onEndEditing={()=>passwordInputRef.current?.focus()}
                onChangeText={text => setEmail(text.trim())}
                value={email}
              />
            </Pressable>
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
                passwordRules="minlength:8; required: special; required: upper; required: lower; required: digit; no common;"
                onChangeText={text => setPassword(text.trim())}
                value={password}
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
            <Text
              allowFontScaling
              style={[styles.textmP, styles.fs12, { opacity: 0.6 }]}
            >
              Already have an Account?
            </Text>
            <Pressable onPress={() => navigation.navigate("Login")}>
              <Text allowFontScaling style={[styles.textmP, styles.fs12]}>
                Login
              </Text>
            </Pressable>
          </View>

          {/* login btn */}
          <AuthButton loading={loading} disbaled={authButtonInvalid} onpress={handleOnPress} text="Continue" />
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
            <Text allowFontScaling style={[styles.textP, styles.fs12]}>
              &
            </Text>
            <Pressable onPress={() => Linking.openURL("https://google.com")}>
              <Text allowFontScaling style={[styles.textmP, styles.fs12]}>
                Privacy Policy
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </Pressable>
  );
}
