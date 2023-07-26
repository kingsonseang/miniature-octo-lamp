import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function PillButton({ text, onpress, selected }) {
  return (
    <Pressable style={[styles.container, selected && { backgroundColor: "#1a1919" }]} onPress={onpress}>
        <Text style={[styles.text, selected && { color: "#ffffff" }]}>{text}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: "#000",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 30,
    },
    text: {
        fontFamily: "Poppins_500Medium",
        color: '#000000'
    }
})