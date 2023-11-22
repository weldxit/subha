import { StatusBar } from "expo-status-bar";

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { responsiveFontSize, responsiveHeight} from "react-native-responsive-dimensions";

import Home from "../AuthenticatedScreens/Home";
import Settings from '../AuthenticatedScreens/Settings';
import Youtube from "../AuthenticatedScreens/Youtube"

import { Icon } from "react-native-paper";
import BrandHeader from "../comps/BrandHeader";


const BottomTab = createBottomTabNavigator()

export default function Entry() {
  // const data = useAuth()
  // console.log(data)

  return (
    <>
    <BrandHeader>
   <BottomTab.Navigator>
    <BottomTab.Screen name="home" component={Home}   options={{
            headerShown: false,
            tabBarColor: "red",
            tabBarIcon: ({ color }) => (
              <Icon
                source={"newspaper"}
                color={color}
                size={responsiveHeight(3.7)}
              />
            ),
            tabBarLabelStyle: { fontSize: responsiveFontSize(1.4), fontWeight:'bold' },
            // tabBarActiveBackgroundColor:'#f93734',
            tabBarActiveTintColor:'red',
            // tabBarInactiveBackgroundColor:'#ff514f',
            tabBarInactiveTintColor:'darkgray'
          }}/>
    <BottomTab.Screen name="youtube" component={Youtube}    options={{
            headerShown: false,
            tabBarColor: "red",
            tabBarIcon: ({ color }) => (
              <Icon
                source={"youtube"}
                color={color}
                size={responsiveHeight(4.6)}
              />
            ),
            tabBarLabelStyle: { fontSize: responsiveFontSize(1.4), fontWeight:'bold' },
            // tabBarActiveBackgroundColor:'#f93734',
            tabBarActiveTintColor:'red',
            // tabBarInactiveBackgroundColor:'#ff514f',
            tabBarInactiveTintColor:'darkgray'
          }}/>
    <BottomTab.Screen name="settings" component={Settings}  options={{
            headerShown: false,
            tabBarColor: "red",
            tabBarIcon: ({ color }) => (
              <Icon
                source={"account-settings"}
                color={color}
                size={responsiveHeight(4.5)}
              />
            ),
            tabBarLabelStyle: { fontSize: responsiveFontSize(1.4), fontWeight:'bold' },
            // tabBarActiveBackgroundColor:'#f93734',
            tabBarActiveTintColor:'red',
            // tabBarInactiveBackgroundColor:'#ff514f',
            tabBarInactiveTintColor:'darkgray'
          }}/>
   </BottomTab.Navigator>
   </BrandHeader>
    <StatusBar style="inverted" translucent={false} backgroundColor="red" />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});