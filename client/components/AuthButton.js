import { Dimensions, Pressable, StyleSheet, Text } from 'react-native'
import React from 'react'

export default function AuthButton({ disbaled, onpress, text }) {
  return (
    <Pressable onPress={onpress} style={[styles.container,  disbaled === true ? { opacity: .7 } : { opacity: 1 }]}>
      <Text style={styles.text}>{text}</Text>
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