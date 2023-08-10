import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from './Home'
import Profile from './Profile'
import Recipe from './Recipe'
import Search from './Search'
import Cooking from './Cooking'
import Favourites from './Favourites'

const Stack = createNativeStackNavigator()

export default function AppScreens() {
  return (
    <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false, animation: "fade_from_bottom" }}>
      <Stack.Screen name='Home' component={Home} />
      <Stack.Screen name='Profile' component={Profile} />
      <Stack.Screen name='Recipe' component={Recipe} />
      <Stack.Screen name='Search' component={Search} />
      <Stack.Screen name='Cooking' component={Cooking} />
      <Stack.Screen name='Favourite' component={Favourites} />
    </Stack.Navigator>
  )
}