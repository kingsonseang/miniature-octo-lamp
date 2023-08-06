import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';

export default function PillButton({ text, onpress, selected }: { text: string, onpress: any, selected: boolean }) {
  const animatedColor = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    animatedColor.value = withTiming(selected ? 1 : 0, {
      duration: 200,
      easing: Easing.linear,
    });
  }, [selected, animatedColor]);

  const containerStyle = useAnimatedStyle(() => {
    const backgroundColor = selected
      ? 'rgba(26, 25, 25, ' + animatedColor.value + ')'
      : 'rgba(255, 255, 255, ' + (1 - animatedColor.value) + ')';

    return {
      backgroundColor,
    };
  });

  const textStyle = useAnimatedStyle(() => {
    const color = selected
      ? 'rgba(255, 255, 255, ' + animatedColor.value + ')'
      : 'rgba(0, 0, 0, ' + (1 - animatedColor.value) + ')';

    return {
      color,
    };
  });

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Pressable onPress={onpress}>
        <Animated.Text style={[styles.text, textStyle]}>{text}</Animated.Text>
      </Pressable>
    </Animated.View>
  );
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
    color: '#000000',
  },
});
