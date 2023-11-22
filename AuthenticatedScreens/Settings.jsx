import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions
} from "react-native";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { Switch } from "react-native-paper";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { GoogleSignin } from "@react-native-google-signin/google-signin";



const UserProfileScreen = ({navigation}) => {
  const [darkmode, setDarkmode] = useState(false);
  const [lang, setLang] = useState(false);
  const [quote, setQutoe] = useState('Never be the same !')
  const [date, setDate] = useState(new Date().toLocaleDateString())
  const [username, setUser] = useState('')
  const [image, setImage] = useState('')
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  const key = ['quote', 'date']
  const key2 = [quote,date]


  const SwitchTheme = () => {
    setDarkmode(!darkmode);
  };

  const SwitchLang = () => {
    setLang(!lang);
  };

  const getQuote = async () => {
    try {
      const response = await axios.get('https://api.quotable.io/quotes/random');
      const quote = response.data.content;
      setQutoe(quote);
      await AsyncStorage.setItem('quote', quote);
      await AsyncStorage.setItem('date', date);
    } catch (error) {
      console.error('Error fetching quote:', error);
    }
  };

  const checkquote = useCallback(
    async () => {
      try {
        for (let index = 0; index < key.length; index++) {
          const item = key[index];
          const aquote = await AsyncStorage.getItem(item);
          if (aquote === null || aquote === undefined) {
            await AsyncStorage.setItem(item, key2[index]);
          } else if (aquote !== key2[index]) {
            await getQuote();
          }
        }
      } catch (error) {
        console.error('Error checking quote:', error);
      }
    },
    [quote, date]
  );

  const checkProfile = useCallback(async () => {
    try {
      const User = await AsyncStorage.getItem('user');
      if(User){
        setUser(User.name);
        setImage(User.photo);
      }
       // Ensure userImage is set properly
    } catch (error) {
      console.error('Error checking profile:', error);
    }
  }, []);

  const logoutPressed = useCallback( async () =>{
      try {
        // await GoogleSignin.signOut()
        await AsyncStorage.removeItem('user')
        // handleLogout()
        navigation.navigate('LoginScreen')
        
      } catch (error) {
        console.log(error)
      }
  },[]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await checkquote();
        await checkProfile();
      } catch (error) {
        console.error('Error in useEffect:', error);
      }
    };
    fetchData();
  }, []);

  // {
  //   idToken: string,
  //   serverAuthCode: string,
  //   scopes: Array<string>
  //   user: {
  //     email: string,
  //     id: string,
  //     givenName: string,
  //     familyName: string,
  //     photo: string, // url
  //     name: string // full name
  //   }
  // }

  return (
    <View style={styles.container}>
      <View style={[styles.bannerContainer, { width: "100%" }]}>
        <Image
          source={require('../assets/logo/banner.png')}
          style={{
            height: responsiveHeight(18),
            width: "100%",
            resizeMode: "cover",
          }}
        />
      </View>
      <View
        style={{
          position: "absolute",
          width: width,
          height: height,
          marginTop: responsiveHeight(10),
          paddingHorizontal: responsiveWidth(2),
        }}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.userAvatar}>
            {image ? <Image
              source={image}
              style={{ flex: 1, borderRadius: 75, resizeMode: "center" }}
            />: <Text>{username ? username.at(0).toUpperCase() : 'Q'}</Text>}
          </View>
          <Text style={styles.userName}>{username}</Text>
        </View>
        <View style={styles.quoteContainer}>
          <Text
            style={{
              fontSize: responsiveFontSize(2),
              fontWeight: "bold",
              textAlign: "center",
              color: "blue",
            }}
          >
            {quote}
          </Text>
        </View>
        <View style={styles.optionsContainer}>
          <View style={styles.option}>
            <Text style={styles.optionText}>Dark Mode</Text>
            <Switch
              value={darkmode}
              onValueChange={SwitchTheme}
              style={{ height: responsiveHeight(2) }}
              color="red"
            />
          </View>
          <View style={styles.option}>
            <Text style={styles.optionText}>Language</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: responsiveWidth(20),
              }}
            >
              <Text
                style={{
                  fontSize: responsiveFontSize(2.3),
                  fontWeight: "bold",
                  color: "blue",
                }}
              >
                {lang ? "ଓଡ଼ି" : "EN"}
              </Text>
              <Switch
                value={lang}
                onValueChange={SwitchLang}
                style={{ height: responsiveHeight(2) }}
                color="red"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.option, { paddingRight: responsiveWidth(3) }]}
          >
            <Text style={styles.optionText}>Rate Us</Text>

            <Image
              source={require("../assets/icon/rate.png")}
              style={{
                height: responsiveHeight(4),
                width: responsiveWidth(7),
                resizeMode: "contain",
                opacity: 1,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.option, { paddingRight: responsiveWidth(3) }]}
          >
            <Text style={styles.optionText}>Feedbacks</Text>

            <Image
              source={require("../assets/icon/feedback.png")}
              style={{
                height: responsiveHeight(4),
                width: responsiveWidth(7),
                resizeMode: "contain",
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.option, { paddingRight: responsiveWidth(3) }]}
          >
            <Text style={styles.optionText}>Share Us</Text>

            <Image
              source={require("../assets/icon/share.png")}
              style={{
                height: responsiveHeight(4),
                width: responsiveWidth(7),
                resizeMode: "contain",
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.option, { paddingRight: responsiveWidth(2.7) }]}
            onPress={logoutPressed}
          >
            <Text style={styles.optionText}>Logout</Text>

            <Image
              source={require("../assets/icon/red-logout.png")}
              style={{
                height: responsiveHeight(4.1),
                width: responsiveWidth(8.4),
                resizeMode: "cover",
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: responsiveWidth(2),
    justifyContent: "space-between",
    // paddingLeft:responsiveWidth(2)
  },
  bannerContainer: {
    height: responsiveHeight(18),
    backgroundColor: "red",
    marginVertical: responsiveHeight(1.5),
  },
  avatarContainer: {
    // marginTop: responsiveHeight(2),
    // alignSelf: "center",
    // backgroundColor:'green'
    justifyContent:'center',
    alignItems:'center'
  },
  userAvatar: {
    width: responsiveWidth(35),
    height: responsiveWidth(35),
    borderWidth: 5,
    borderColor: "white",
    borderRadius: 75,
    backgroundColor: "#FF5733",
  },
  userName: {
    fontSize: 24,
    color:"black",
    marginTop: responsiveHeight(1),
    textAlign: "center",
    fontWeight: "bold",
  },
  quoteContainer: {
    // backgroundColor:'yellow',
    marginVertical: responsiveHeight(1),
    textAlign: "justify",
  },
  optionsContainer: {},
  option: {
    paddingVertical: 10,
    marginBottom: 8,
    // backgroundColor: "white",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor:'gray'
  },
  optionText: {
    fontSize: 18,
    color: "#686767",
    fontWeight: "500",
    paddingLeft: responsiveWidth(1),
  },
  feedbackContainer: {
    // flex:1,
    flexDirection: "row",
    justifyContent: "space-around",
    // marginTop: 20,
    backgroundColor: "#fc0707",
    margin: 0,
    padding: 0,
    borderRadius: 30,
    opacity: 0.8,
    // marginBottom:0
  },
  feedbackOption: {
    padding: 10,
  },
  feedbackOptionText: {
    fontSize: 18,
    color: "#FF5733",
    // textDecorationLine: 'underline',
  },
  fontSizeContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    // marginTop: 20,
  },
  fontSizeButton: {
    // backgroundColor: '#FF5733',
    borderRadius: 30,
    // padding: 10,
  },
  fontSizeButtonText: {
    fontSize: 20,
    width: 10,
    color: "black",
    padding: 0,
    margin: 0,
  },
  fontSizeText: {
    fontSize: 18,
    marginHorizontal: 20,
    color: "#FF5733",
  },
});

export default UserProfileScreen;
