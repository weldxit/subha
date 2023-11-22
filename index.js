import { registerRootComponent } from 'expo';

import App from './App';
import messaging from '@react-native-firebase/messaging';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import notifee, {AndroidStyle} from '@notifee/react-native'

GoogleSignin.configure({
    webClientId: '216007132332-gbpuip2qel3gvfti427ld74sih2915rv.apps.googleusercontent.com',
    offlineAccess: true,
    forceCodeForRefreshToken: true,
  });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    try {
      const { notification } = remoteMessage;
      if (notification) {
        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
          importance: AndroidImportance.HIGH,
          sound:'arrow',
          vibration: true,
    vibrationPattern: [300, 500],
        });
  
        await notifee.displayNotification({
          title:  'THE Quiver | New Post',
          body: 'Surf the app to get latest updated news',
          subtitle:'Another Arrow',
  
          android: {
            channelId: channelId,
            importance: AndroidImportance.HIGH,
            sound:'arrow',
            style: { type: AndroidStyle.BIGPICTURE, picture: "https://c4.wallpaperflare.com/wallpaper/569/220/905/snowfall-night-snow-winter-wallpaper-preview.jpg" },
            timestamp: Date.now(),
            showTimestamp: true,
            vibrationPattern: [300, 500],
            // Additional Android specific configurations if needed
          },
          pressAction: {
            id: 'default',
          },
        });
      }
    } catch (error) {
      console.error('Error displaying notification:', error);
    }
  });
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
