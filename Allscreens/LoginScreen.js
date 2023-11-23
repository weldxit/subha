import { StyleSheet, Text, View, Image, Button } from 'react-native'
import React,{useState, useEffect} from 'react'
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import TypewriterText from '../comps/TypeWriter';
import { GoogleSigninButton , GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function LoginScreen({setLoggedInCallback}) {
  const [isSigningIn, setIsSigningIn] = useState(false);

  
  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true); // Start sign-in process, disable the button
      const userInfo = await GoogleSignin.signIn();
      const token = userInfo.idToken;
      const googleCredential = auth.GoogleAuthProvider.credential(token);
  
      // Store user data in AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(userInfo.user));
      await auth().currentUser.linkWithCredential(googleCredential);
      setLoggedInCallback(true)
      setIsSigningIn(false);
      return
  
      // Reset the signing-in state once done
      // navigation.navigate('EntryPoint');
    } catch (error) {
      setLoggedInCallback(true)
      setIsSigningIn(false); // Reset the state in case of an error

    }
  };


  return (
    <View style={{flex:1, justifyContent:'center', backgroundColor:'white',alignItems:'center'}}>
        <View style={{ height: responsiveHeight(22), width: responsiveHeight(22.2), borderRadius: 100, overflow: 'hidden', backgroundColor: '#fc0303', justifyContent:'center', marginTop:'25%', marginBottom:'10%' }}>
        <Image
          source={{uri:'https://yt3.googleusercontent.com/6SjbKYnJSs0hWe2ws6a_o7PCuw6KcIHgZwTi1gxtKZYZAnzBQC-VTtmRoFDDMfB2k7DEbMjNUg=s176-c-k-c0x00ffffff-no-rj'}} // Replace with your logo path
          style={{ flex:1, borderRadius:100, resizeMode:'stretch' }}
        />
      </View>
      <View style={{marginBottom:'25%',alignItems:'center', textAlign:'center'}}>
      <Text style={{ fontSize: responsiveFontSize(4), fontWeight: 'bold', marginBottom:'10%',  textAlign:'center' }}>
        <Text style={{textAlign:'center', color:'red'}}>The Quiver </Text>{'\n'}Welcomes you !
      </Text>
      <TypewriterText text={`' ପରିବର୍ତ୍ତନ ଆପଣଙ୍କୁ ଅପେକ୍ଷା କରିଛି '`} speed={320} />
      <View style={{marginTop:responsiveHeight(10)}}>
      <GoogleSigninButton
        style={{ alignSelf:'center', paddingHorizontal:20 }}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={handleGoogleSignIn}
        disabled={isSigningIn} 
      />
        {/* <Button title='click' onPress={()=>{setLoggedInCallback(true)}}/> */}
      </View>
      </View>
      <Text style={{position:'absolute', bottom:5}}>© 2023 The Quiver. All rights reserved.</Text>
    </View>
  )
}

const styles = StyleSheet.create({})