import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, AppState } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './Allscreens/LoginScreen';
import SplashScreen from './Allscreens/SplashScreen';
import EntryPoint from './Allscreens/EntryPoint';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';


const NativeStack = createNativeStackNavigator()

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [splashComplete, setSplashComplete] = useState(false);

  // const [logactive, setLogactive] = useState(false)


  const checkToken = async () => {
    try {
      let Token = await AsyncStorage.getItem('devicetoken');

      if (!Token) {
        const deviceToken = await messaging().getToken();
        await axios.post('https://server-for-quiver.onrender.com/devicetokens', { deviceToken: deviceToken }).then(async (response) => {
          await AsyncStorage.setItem('devicetoken', response.token);
        });
      }
    } catch (error) {
      console.error('Error while checking token:', error);
    }
  };

  const isLoggedIn = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      const userInfo = user != null ? JSON.parse(user) : null;
      if (userInfo) {
        setLoggedIn(true)

      }
    } catch (error) {
      console.error('Error while checking user:', error);
    }
  };


  useEffect(() => {
    const splashTimeout = setTimeout(() => {
      setSplashComplete(true);
    }, 4000);

    async function fetchData() {
      try {
        await checkToken();
        await isLoggedIn();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();

    return () => {
      clearTimeout(splashTimeout);

    };
  }, []);

  const setLoggedInCallback = useCallback(
    (isLoggedIn) => {
      setLoggedIn(isLoggedIn);
    },
    [setLoggedIn]
  );
  const memoizedSetLoggedIn = useMemo(() => setLoggedInCallback, [setLoggedInCallback]);

  if (!splashComplete) {
    return <SplashScreen />;
  }
  return (

    <NavigationContainer>

      <NativeStack.Navigator>
        {!loggedIn ? (
          <NativeStack.Screen
            name='LoginScreen'
            options={{ headerShown: false }}
          >

            {(props) => <LoginScreen {...props} setLoggedInCallback={memoizedSetLoggedIn} />}
          </NativeStack.Screen>
        ) : (
          <NativeStack.Screen
            name='EntryPoint'
            component={EntryPoint}
            options={{ headerShown: false }}
          />
        )}

      </NativeStack.Navigator>
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
