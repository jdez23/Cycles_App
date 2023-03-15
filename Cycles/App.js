/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './src/components/RootNavigation';
import {useNavigation} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';

import BottomBar from './src/navigation/BottomBar';
import OnBoardScreen from './src/screens/OnBoard/OnBoardScreen';
import Playlist from './src/screens/PlaylistScreen/playlistScreen';
import EditProfile from './src/screens/EditProfile/EditProfile';
import ProfileSettings from './src/screens/ProfileSettings/ProfileSettings';
import SignIn from './src/screens/SignIn/SignInScreen';
import ConfirmCode from './src/screens/confirmCode/ConfirmCode';
import SpotifyPlaylist from './src/screens/SpotifyPlaylist/SpotifyPlaylist';
import ProfileScreen from './src/screens/Profile/ProfileScreen';
import CommentsScreen from './src/screens/Comments/CommentsScreen';
import FollowersList from './src/screens/FollowersList/FollowersList';
import FollowingList from './src/screens/FollowingList/FollowingList';
import ServicesScreen from './src/screens/ServicesScreen/ServicesScreen';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import envs from './Config/env';
import {
  notificationListener,
  requestUserPermission,
} from './src/firebaseMessaging/notificationHelper';
import {Provider as PlaylistProvider} from './src/context/PlaylistContext';
import {
  Provider as AuthProvider,
  Context as AuthContext,
} from './src/context/AuthContext';
import {
  Provider as NotifProvider,
  Context as NotifContext,
} from './src/context/NotifContext';

const Stack = createNativeStackNavigator();
// const WS_URL = envs.WS_URL;

const MainFlow = () => {
  useEffect(() => {
    requestUserPermission();
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={'BottomBar'}>
      <Stack.Screen name="BottomBar" component={BottomBar} />
      <Stack.Screen name="Playlist" component={Playlist} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="ProfileSettings" component={ProfileSettings} />
      <Stack.Screen name="SpotifyPlaylist" component={SpotifyPlaylist} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="CommentsScreen" component={CommentsScreen} />
      <Stack.Screen name="FollowingList" component={FollowingList} />
      <Stack.Screen name="FollowersList" component={FollowersList} />
      <Stack.Screen name="ServicesScreen" component={ServicesScreen} />
    </Stack.Navigator>
  );
};

const AuthFlow = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={'SignIn'}>
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="ConfirmCode" component={ConfirmCode} />
      <Stack.Screen name="OnBoardScreen" component={OnBoardScreen} />
    </Stack.Navigator>
  );
};

function App() {
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);
  // const notifContext = useContext(NotifContext);
  const [isLoading, setIsLoading] = React.useState(true);

  // console.log(`${WS_URL}/ws/notif-socket/?token=${authContext?.state?.token}`);

  // useEffect(() => {
  //   const ws = new WebSocket(
  //     `wss://93d5-2600-1700-9758-7420-8054-4ff6-3840-2d84.ngrok.io/ws/notif-socket/?token=${authContext?.state?.token}`,
  //   );
  //   try {
  //     ws.onopen = () => {
  //       console.log('WebSocket connected');
  //     };
  //     ws.onerror = error => {
  //       console.error('WebSocket error: ', error);
  //     };

  //     ws.onmessage = event => {
  //       console.log('WebSocket message: ', event.data);
  //       notifContext?.notifBadge();
  //     };
  //   } catch (e) {
  //     console.error('error:', e);
  //   }
  // }, [notifContext?.state?.notifCount]);

  useEffect(() => {
    SplashScreen.hide(); //hides the splash screen on app load.
  }, []);

  // Gets notif when phone/app is on
  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage) {
        navigation.navigate('NotificationsScreen');
      }
    });

    // Gets notif when phone/app is off
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('remote message', remoteMessage.notification);
        }
      });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    authContext?.tryLocalStorage();
  }, [authContext?.token]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: '#0C0C0C',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" />
      {authContext?.state?.user === 'true' ? <MainFlow /> : <AuthFlow />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#0C0C0C',
    flex: 1,
  },
});

export default () => {
  return (
    <AuthProvider>
      <NotifProvider>
        <PlaylistProvider>
          <NavigationContainer ref={navigationRef}>
            <App />
          </NavigationContainer>
        </PlaylistProvider>
      </NotifProvider>
    </AuthProvider>
  );
};
