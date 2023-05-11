import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View, Dimensions} from 'react-native';

import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import FollowingFeed from '../screens/FollowingFeed/FollowingFeed';
import CreatePlaylist from '../screens/CreatePlaylist/CreatePlaylist';
import DiscoverFeed from '../screens/DiscoverFeed/DiscoverFeed';
import NotificationsScreen from '../screens/Notifications/NotificationsScreen';
import MyProfile from '../screens/MyProfile/MyProfile';
import {Context as NotifContext} from '../context/NotifContext';

const Tab = createBottomTabNavigator();

const BottomBar = () => {
  const notifContext = useContext(NotifContext);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    setNotifCount(notifContext?.state?.notifCount);
  }, [notifContext?.state?.notifCount]);

  return (
    <View style={{flex: 1}}>
      <Tab.Navigator
        initialRouteName={'FollowingFeed'}
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'grey',
          tabBarStyle: {
            paddingTop: 10,
            height: 50,
            backgroundColor: '#0C0C0C',
            borderTopWidth: 0.3,
            borderTopColor: '#252525',
          },
          headerShadowVisible: false,
        }}>
        <Tab.Screen
          name="FollowingFeed"
          component={FollowingFeed}
          options={{
            tabBarIcon: ({focused}) => {
              return (
                <Ionicons
                  name={focused ? 'home' : 'home-outline'}
                  size={focused ? 28 : 27}
                  color={focused ? 'white' : 'lightgrey'}
                />
              );
            },
          }}
        />
        <Tab.Screen
          name="DiscoverFeed"
          component={DiscoverFeed}
          options={{
            tabBarIcon: ({focused}) => {
              return (
                <Ionicons
                  name={focused ? 'search' : 'search-outline'}
                  size={focused ? 28 : 27}
                  color={focused ? 'white' : 'lightgrey'}
                />
              );
            },
          }}
        />
        <Tab.Screen
          name="CreatePlaylist"
          component={CreatePlaylist}
          options={{
            unmountOnBlur: true,
            tabBarStyle: {
              display: 'none',
            },
            tabBarIcon: ({focused}) => {
              return <Octicons name="plus" size={27} color={'lightgrey'} />;
            },
          }}
        />
        <Tab.Screen
          name="NotificationsScreen"
          component={NotificationsScreen}
          options={{
            tabBarIcon: ({focused}) => {
              return (
                <View>
                  <Ionicons
                    name={focused ? 'heart' : 'heart-outline'}
                    size={focused ? 28 : 27}
                    color={focused ? 'white' : 'lightgrey'}
                  />
                  {notifCount > 0 ? <View style={styles.notifBadge} /> : null}
                </View>
              );
            },
          }}
        />
        <Tab.Screen
          name="MyProfile"
          component={MyProfile}
          options={{
            tabBarIcon: ({focused}) => {
              return (
                <Ionicons
                  name={focused ? 'person-circle' : 'person-circle-outline'}
                  size={focused ? 30 : 29}
                  color={focused ? 'white' : 'lightgrey'}
                />
              );
            },
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  notifBadge: {
    position: 'absolute',
    right: -2,
    top: 1,
    backgroundColor: 'red',
    borderRadius: 20,
    width: 9,
    height: 9,
  },
});

export default BottomBar;
