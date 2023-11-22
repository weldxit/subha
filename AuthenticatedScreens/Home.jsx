import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import ArticleList from './ArticleScreens/ArticleList'
import SingleArticle from './ArticleScreens/SingleArticle'
const Stack = createNativeStackNavigator()
export default function Home() {
  return (
   <Stack.Navigator>
    <Stack.Screen name='ArticleList' component={ArticleList} options={{headerShown:false}}/>
    <Stack.Screen name='SingleArticle' component={SingleArticle} options={{headerShown:false}}/>
   </Stack.Navigator>
  )
}

const styles = StyleSheet.create({})