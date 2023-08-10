import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Reels from './Reels'
import Feed from './Feed'
const Stack = createNativeStackNavigator()

export default function AppScreens() {
  return (
    <Stack.Navigator initialRouteName='Feed' screenOptions={{ headerShown: false, animation: "fade_from_bottom" }}>
      <Stack.Screen name='Feed' component={Feed} />
      <Stack.Screen name='Reels' component={Reels} />
    </Stack.Navigator>
  )
}