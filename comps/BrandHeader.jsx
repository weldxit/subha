import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  useColorScheme,
  TouchableOpacity,
  Image,
  Dimensions
} from "react-native";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";

export default function BrandHeader(props) {
  const color = useColorScheme();
  const [theme, setTheme] = useState(color);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={[
          styles.container,
          { backgroundColor: theme === "dark" ? "black" : "white" },
        ]}
      >
        <View style={styles.brand}>
          <View style={styles.brandViewLeft}>
            {/* <TouchableOpacity
              activeOpacity={1}
              disabled={false}
              onPress={openDraw}
            >
              <Image
                source={require("../assets/icon/arrow-light.png")}
                style={styles.brandMenu}
              />
            </TouchableOpacity> */}
            <View style={styles.brandQuote}>
              <Text
                style={[styles.brandText]}
                numberOfLines={0}
                selectable={false}
              >
                The Quiver
              </Text>
              <Text style={styles.brandQuoteText}>
                It's time for a change !
              </Text>
            </View>
          </View>
          <Image
            source={require("../assets/logo/quiver_loop_logo.gif")}
            style={styles.brandImage}
          />
        </View>
        {props.children}
        
        {/* <TabBarBottom/> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "space-between",
  },
  brand: {
    backgroundColor: "#d10e04",
    width: Dimensions.get('window').width,
    height: "7%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "baseline",
  },
  brandViewLeft: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    alignSelf:'center',
    minHeight:responsiveHeight(6)
  },
  brandMenu: {
    height: responsiveHeight(6),
    width: responsiveWidth(10),
    // marginTop:1,
    resizeMode: "stretch",
    // marginRight: 3,
    // alignSelf:'center'
    // alignSelf:'baseline'
  },
  brandQuote: {
    // backgroundColor:'black',
    justifyContent: "center",
    alignItems: "flex-end",
    height: responsiveHeight(5),
  },
  brandText: {
    fontSize: responsiveFontSize(3.3),
    fontWeight: "bold",
    textAlignVertical: "center",
    color: "white",
    padding: 0,
    alignSelf: "baseline",
    marginLeft:responsiveWidth(1.5)
  },

  brandQuoteText: {
    fontSize: responsiveFontSize(1.3),
    color: "white",
    textAlign: "right",
    margin: 0,
    padding: 0,
  },
  brandImage: {
    width: responsiveWidth(30),
    height: responsiveHeight(6.9),
    marginRight: "1%",
    alignSelf:'baseline',
    resizeMode:'cover',
    marginTop:-0.3
  },
});

