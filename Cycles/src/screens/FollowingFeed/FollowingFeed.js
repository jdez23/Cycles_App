import React, {useEffect, useState, useContext} from 'react';

import {
  FlatList,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  Pressable,
  SafeAreaView,
  ImageBackground,
  RefreshControl,
  ActivityIndicator,
  Linking,
  Dimensions,
} from 'react-native';
import envs from '../../../Config/env';
import Header from '../../components/Header/Header';
import {useNavigation} from '@react-navigation/native';
import RNSInfo from 'react-native-sensitive-info';
import Spotify_Icon_RGB_Green from '../../../assets/logos/Spotify_Icon_RGB_Green.png';
import Toast from 'react-native-root-toast';
import moment from 'moment';
import {Context as AuthContext} from '../../context/AuthContext';
import {Context as PlaylistContext} from '../../context/PlaylistContext';

const window = Dimensions.get('window').width;

const FollowingFeed = () => {
  const navigation = useNavigation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [toast, setToast] = useState(null);
  const authContext = useContext(AuthContext);
  const playlistContext = useContext(PlaylistContext);
  const getUserID = async () => await RNSInfo.getItem('user_id', {});
  const BACKEND_URL = envs.DEV_URL;

  useEffect(() => {
    if (playlistContext?.state?.errorMessage) {
      setToast(
        Toast.show(authContext?.state?.errorMessage, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.CENTER,
          onHidden: () =>
            playlistContext?.dispatch({type: 'clear_error_message'}),
        }),
      );
    } else if (toast) {
      Toast.hide(toast);
    }
  }, [authContext?.state?.errorMessage]);

  //Call API function to fetch following playlists && Ask for notif permission
  useEffect(() => {
    playlistContext?.getFollowersPlaylists();
  }, []);

  const wait = timeout => {
    // Defined the timeout function for testing purpose
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setLoadingData(true);
    playlistContext?.getFollowersPlaylists();
    loadingData == true ? (
      <View>
        <ActivityIndicator color="#f0f8ff" />
      </View>
    ) : null;
    wait(2000).then(() => setIsRefreshing(false), setLoadingData(false));
  };

  //Navigate to playlist detail screen
  const onPlaylistDetail = async item => {
    const me = await getUserID();
    navigation.navigate({
      name: 'Playlist',
      params: {playlist_id: item.id, me: me},
    });
  };

  //Navigate to user profile
  const onUserPic = async item => {
    const me = await getUserID();
    navigation.navigate({
      name: 'ProfileScreen',
      params: {userID: item.user, playlist_id: item.id, me: me},
    });
  };

  // //Fetch followers playlists
  // const getFollowersPlaylists = async () => {
  //   const token = await RNSInfo.getItem('token', {});
  //   try {
  //     await axios
  //       .get(`${BACKEND_URL}/feed/following-playlists/`, {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: token,
  //         },
  //       })
  //       .then(res => {
  //         const Following_PLaylist = res.data;
  //         // console.log(Following_PLaylist);
  //         setFollwingPlaylist(Following_PLaylist);
  //       });
  //   } catch (error) {
  //     null;
  //   }
  // };

  const _renderItem = ({item}) => (
    <View
      style={{
        marginVertical: 12,
        justifyContent: 'center',
        width: window - 24,
      }}>
      <View
        style={{
          flexDirection: 'row',
          // justifyContent: 'space-between',
          alignItems: 'center',
          // backgroundColor: 'lightblue',
        }}>
        <Pressable
          onPress={() => onUserPic(item)}
          style={{
            height: 35,
            width: 35,
            borderRadius: 30,
            backgroundColor: '#1f1f1f',
          }}>
          {item.avi_pic ? (
            <Image
              style={{height: 35, width: 35, borderRadius: 30}}
              source={{
                uri: `${BACKEND_URL}${item.avi_pic}`,
              }}
            />
          ) : (
            <View
              style={{
                height: 35,
                width: 35,
                borderRadius: 30,
                backgroundColor: '#1f1f1f',
              }}
            />
          )}
        </Pressable>
        <View
          style={{
            flexDirection: 'column',
            marginLeft: 10,
            alignContent: 'center',
          }}>
          <Pressable onPress={() => onUserPic(item)}>
            <Text
              style={{
                textAlign: 'left',
                color: 'white',
                fontSize: 13,
                fontWeight: '500',
              }}>
              {item.username}
            </Text>
          </Pressable>
          {item.location == null ? null : (
            <Text
              style={{
                textAlign: 'left',
                marginTop: 1,
                color: 'lightgrey',
                fontSize: 12,
              }}>
              {item.location}
            </Text>
          )}
        </View>
      </View>
      <View style={{marginTop: 8}}>
        {item.first_image.image ? (
          <ImageBackground
            style={{
              height: 260,
              borderRadius: 3,
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingBottom: 6,
              backgroundColor: '#121212',
            }}
            source={{
              uri: `https://c287-68-91-157-115.ngrok.io${item.first_image.image}`,
            }}>
            <Pressable
              onPress={() => onPlaylistDetail(item)}
              style={{width: window - 36}}>
              <View
                style={{
                  // width: 360,
                  height: 85,
                  backgroundColor: 'rgba(60, 60, 60, 0.7)',
                  borderRadius: 3,
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 8,
                    alignItems: 'center',
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      style={{
                        width: 70,
                        height: 70,
                        resizeMode: 'cover',
                        borderRadius: 2,
                      }}
                      source={{uri: item.playlist_cover}}
                    />
                    <View
                      style={{
                        flexDirection: 'column',
                        alignSelf: 'center',
                        paddingLeft: 10,
                      }}>
                      <Text style={{color: 'white', fontSize: 13}}>
                        {item.playlist_title}
                      </Text>
                      <Text
                        style={{
                          marginTop: 2,
                          color: 'lightgrey',
                          fontSize: 13,
                        }}>
                        {item.playlist_type}
                      </Text>
                    </View>
                  </View>
                  <Pressable
                    style={{
                      height: 25,
                      width: 25,
                      borderRadius: 30,
                      backgroundColor: '#1f1f1f',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => Linking.openURL(item.playlist_url)}>
                    <Image
                      style={{width: 15, height: 15}}
                      source={Spotify_Icon_RGB_Green}
                    />
                  </Pressable>
                </View>
              </View>
            </Pressable>
          </ImageBackground>
        ) : (
          <View
            style={{
              height: 240,
              borderRadius: 3,
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingBottom: 5,
              backgroundColor: '#121212',
            }}
          />
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 5,
          justifyContent: 'space-between',
          paddingHorizontal: 12,
          // backgroundColor: 'purple',
        }}>
        <View
          style={{
            flexDirection: 'column',
            alignSelf: 'center',
          }}>
          {!item?.description ? null : (
            <Text
              style={{
                textAlign: 'left',
                marginTop: 1,
                color: 'lightgrey',
                fontSize: 13,
              }}>
              {item.description}
            </Text>
          )}
          <Text
            style={{
              textAlign: 'left',
              marginTop: 4,
              color: 'lightgrey',
              fontSize: 12,
            }}>
            {moment(item.date).fromNow()}
          </Text>
        </View>
      </View>
    </View>
  );

  // console.log('--', playlistContext?.state);

  return playlistContext?.state?.followingPlaylists ? (
    <SafeAreaView style={styles.screen}>
      <Header />
      {playlistContext?.state?.followingPlaylists.length > 0 ? (
        <View
          style={{
            alignItems: 'center',
            flex: 1,
          }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={playlistContext?.state?.followingPlaylists}
            renderItem={_renderItem}
            refreshing={isRefreshing}
            onRefresh={onRefresh}></FlatList>
        </View>
      ) : (
        <ScrollView
          style={{flex: 1, width: window}}
          contentContainerStyle={{paddingTop: 60}}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }>
          <View style={{alignItems: 'center'}}>
            <Text
              style={{
                color: 'white',
                fontSize: 14,
                textAlign: 'center',
                fontFamily: 'Futura',
                fontWeight: 'bold',
                width: 200,
              }}>
              Find playlists in the discover tab.
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  ) : (
    <View
      style={{
        backgroundColor: '#0C0C0C',
        flex: 1,
        justifyContent: 'center',
      }}></View>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#0C0C0C',
    alignItems: 'center',
    flex: 1,
  },
});

export default FollowingFeed;
