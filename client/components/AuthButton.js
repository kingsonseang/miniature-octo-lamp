import { ActivityIndicator, Dimensions, Pressable, StyleSheet, Text } from 'react-native'
import React from 'react'

export default function AuthButton({ disbaled, onpress, text, loading }) {
  return (
    <Pressable onPress={onpress} style={[styles.container,  disbaled === true ? { backgroundColor: "grey" } : { opacity: 1 }]}>
      {loading ? <ActivityIndicator color="#fff" size="small"  /> : <Text allowFontScalingstyle={styles.text}>{text}</Text>}
    </Pressable>
  )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems:"center",
        paddingVertical: Dimensions.get("window").height * 0.02,
        borderRadius: Dimensions.get("window").height * 0.018,
    },
    text: {
        fontFamily: "Poppins_500Medium",
        color: '#fff'
    }
})