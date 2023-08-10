import { View, Text, Keyboard, Pressable, Dimensions, SafeAreaView, TextInput, ActivityIndicator } from 'react-native'
import React, { useContext, useRef, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import styles from './styles';
import { AntDesign, Feather } from '@expo/vector-icons';
import AuthButton from '../../components/AuthButton';
import { isValidEmail, isValidPassword } from "../../utils/validate";
import { AuthContext } from '../../context/AuthContext';

export default function Reset(props: any) {

  const authContext = useContext(AuthContext);

  if (!authContext) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small" color="#000000" />
      </View>
    );
  }

  const { SendVerifyEmail } = authContext

  const { navigation } = props

  const emailInputRef = useRef<TextInput | null>(null);
  const [emailErr, setEmailErr] = useState(false);
  const [email, setEmail] = useState("");
  const [authButtonInvalid, setAuthButtonInvalid] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleOnPress = async () => {
    if (loading == true) {
      return
    }

    setAuthButtonInvalid(true)

    if (!email || !email.trim()) {
      setAuthButtonInvalid(false)
      emailInputRef?.current?.focus()
      return
    }

    if (!isValidEmail(email)) {
      setAuthButtonInvalid(false)
      emailInputRef?.current?.focus()
      setEmailErr(true)
      return
    }

    setLoading(true)
    const resendMailSent = await SendVerifyEmail(email.toLowerCase())

    if (!resendMailSent) {
      setAuthButtonInvalid(false)
      setLoading(false)
      setAuthButtonInvalid(false)
      return 
    }
    setLoading(false)
    return navigation.navigate("PasswordReset", { email: email.toLowerCase() })
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
          <Text allowFontScaling style={[styles.textmP, styles.fs20]}>Login</Text>
          <View style={styles.headerbtn} />
        </View>

        {/* form */}

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
              onEndEditing={(e)=>{
                if (isValidEmail(e.nativeEvent.text.trim())) {
                  setEmailErr(false)
                }
              }}
            />
          </Pressable>
          { emailErr && <Text allowFontScaling style={[styles.textP, { color: "#f00000", opacity: .6, fontSize: 10 }]}>Invalid email, expected e.g someone@example.com</Text> }
        </View>


        {/* login btn */}
        <AuthButton loading={loading} disbaled={authButtonInvalid} text="Continue" onpress={handleOnPress}  />
      </SafeAreaView>
    </Pressable>
  );
}