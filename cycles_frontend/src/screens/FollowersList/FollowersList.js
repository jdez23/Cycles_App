import React, {useState, useEffect, useContext} from 'react';

import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  SafeAreaView,
  Pressable,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {Context as AuthContext} from '../../context/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNSInfo from 'react-native-sensitive-info';
import Toast from 'react-native-root-toast';
import envs from '../../../Config/env';

const BACKEND_URL = envs.PROD_URL;

const window = Dimensions.get('window').width;

const FollowersList = route => {
  const navigation = useNavigation();
  const {to_user} = route.route.params;
  // const {currentUser} = route.route.params;
  const [toast, setToast] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (authContext?.state?.errorMessage) {
      setToast(
        Toast.show(playlistContext?.state?.errorMessage, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.TOP,
          onHidden: () => dispatch({type: 'clear_error_message'}),
        }),
      );
    } else if (toast) {
      Toast.hide(toast);
    }
  }, [authContext?.state?.errorMessage]);

  // Call to get list of followers
  useEffect(() => {
    getFollowers();
  }, [authContext?.state?.token]);

  const wait = timeout => {
    // Defined the timeout function for testing purpose
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setLoadingData(true);
    // getPlaylists();
    loadingData == true ? (
      <View
        style={{
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}>
        <ActivityIndicator color={'white'} size="large" />
      </View>
    ) : null;
    wait(2000).then(() => setIsRefreshing(false), setLoadingData(false));
  };

  const onBack = () => {
    navigation.goBack();
  };

  //Navigate to user profile
  const onUser = async item => {
    const currentUser = await RNSInfo.getItem('user_id', {});
    navigation.push('ProfileScreen', {me: currentUser, userID: item.user});
  };

  // Get list of followers
  const getFollowers = async () => {
    const token = await RNSInfo.getItem('token', {});
    try {
      axios
        .get(`${BACKEND_URL}/users/user-followers/?user_id=${to_user}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        })
        .then(res => {
          const followersData = res.data;
          setFollowers(followersData);
        });
    } catch (error) {
      authContext?.dispatch({
        type: 'error_1',
        payload: 'Something went wrong. Please try again.',
      });
    }
  };

  // Render followers
  _renderItem = ({item}) => (
    <Pressable
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: 55,
        width: window,
        marginTop: 10,
        paddingHorizontal: 12,
        justifyContent: 'space-between',
      }}
      onPress={() => onUser(item)}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 40,
          width: 40,
          backgroundColor: '#1f1f1f',
          borderRadius: 30,
        }}>
        <Image
          style={{height: 40, width: 40, borderRadius: 40}}
          source={{uri: item.avi_pic}}
        />
        <View
          style={{
            flexDirection: 'column',
            marginLeft: 10,
            width: 200,
            justifyContent: 'center',
          }}>
          {item.username ? (
            <Text
              numberOfLines={1}
              style={{
                textAlign: 'left',
                color: 'white',
                fontSize: 14,
                fontWeight: '600',
              }}>
              {item.username}
            </Text>
          ) : null}
          {item.name ? (
            <Text
              numberOfLines={1}
              style={{
                textAlign: 'left',
                marginTop: 1,
                color: 'lightgrey',
                fontSize: 13,
              }}>
              {item.name}
            </Text>
          ) : null}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={23} color={'white'} />
    </Pressable>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#0C0C0C'}}>
      <View style={styles.container} blurRadius={1}>
        <Pressable onPress={onBack}>
          <View style={{height: 40, width: 40, justifyContent: 'center'}}>
            <Ionicons name="chevron-back" size={25} color={'white'} />
          </View>
        </Pressable>
        <Text style={styles.textUser}>Followers</Text>
        <View style={{height: 40, width: 40}} />
      </View>
      <View style={{flex: 1}}>
        <FlatList
          data={followers}
          renderItem={_renderItem}
          refreshing={isRefreshing}
          onRefresh={onRefresh}></FlatList>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0C0C0C',
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    borderBottomColor: '#232323',
    borderBottomWidth: 0.3,
  },
  inboxtext: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  textUser: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default FollowersList;
