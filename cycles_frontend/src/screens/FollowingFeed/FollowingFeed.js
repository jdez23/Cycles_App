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
  TouchableOpacity,
} from 'react-native';
import envs from '../../../Config/env';
import Header from '../../components/Header/Header';
import {useNavigation} from '@react-navigation/native';
import RNSInfo from 'react-native-sensitive-info';
import Spotify_Icon_RGB_Green from '../../../assets/logos/Spotify_Icon_RGB_Green.png';
import Toast from 'react-native-root-toast';
import moment from 'moment';
import {Context as PlaylistContext} from '../../context/PlaylistContext';
import {requestUserPermission} from '../../firebaseMessaging/notificationHelper';

const window = Dimensions.get('window').width;

const FollowingFeed = () => {
  const navigation = useNavigation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [toast, setToast] = useState(null);
  const playlistContext = useContext(PlaylistContext);
  const getUserID = async () => await RNSInfo.getItem('user_id', {});

  useEffect(() => {
    requestUserPermission();
  }, []);

  useEffect(() => {
    if (playlistContext?.state?.errorMessage) {
      setToast(
        Toast.show(playlistContext?.state?.errorMessage, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.CENTER,
          onHidden: () =>
            playlistContext?.dispatch({type: 'clear_error_message'}),
        }),
      );
    } else if (toast) {
      Toast.hide(toast);
    }
  }, [playlistContext?.state?.errorMessage]);

  // Call API function to fetch following playlists
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

  const _renderItem = ({item}) => (
    <View
      style={{
        marginVertical: 12,
        justifyContent: 'center',
        width: window,
      }}>
      <View
        style={{
          paddingHorizontal: 12,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => onUserPic(item)}
          style={{
            height: 35,
            width: 35,
            borderRadius: 30,
            backgroundColor: '#1f1f1f',
          }}>
          {item.avi_pic ? (
            <Image
              style={{
                height: 35,
                width: 35,
                borderRadius: 30,
                backgroundColor: '#1f1f1f',
              }}
              source={{uri: item.avi_pic}}
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
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'column',
            marginLeft: 10,
            alignContent: 'center',
          }}>
          <TouchableOpacity onPress={() => onUserPic(item)}>
            <Text
              style={{
                textAlign: 'left',
                color: 'white',
                fontSize: 13,
                fontWeight: '600',
              }}>
              {item.username}
            </Text>
          </TouchableOpacity>
          {!item.location ? null : (
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
        {item.first_image.images ? (
          <ImageBackground
            style={{
              height: window,
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingBottom: 6,
              backgroundColor: '#121212',
            }}
            source={{
              uri: item.first_image.images,
            }}>
            <Pressable
              onPress={() => onPlaylistDetail(item)}
              style={{width: window - 24}}>
              <View
                style={{
                  height: 85,
                  backgroundColor: 'rgba(60, 60, 60, 0.7)',
                  borderRadius: 6,
                  justifyContent: 'center',
                  width: window - 24,
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
                        backgroundColor: '#1f1f1f',
                      }}
                      source={{uri: item.playlist_cover}}
                    />
                    <View
                      style={{
                        flexDirection: 'column',
                        alignSelf: 'center',
                        paddingLeft: 10,
                      }}>
                      <Text
                        numberOfLines={2}
                        style={{
                          color: 'white',
                          fontSize: 13,
                          width: window / 2,
                        }}>
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
              height: window,
              alignItems: 'center',
              justifyContent: 'flex-end',
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
        }}>
        <View
          style={{
            flexDirection: 'column',
            alignSelf: 'center',
            justifyContent: 'flex-start',
            width: window - 24,
          }}>
          {!item?.description ? null : (
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                flex: 1,
              }}>
              {!item?.username ? null : (
                <Pressable onPress={() => onUserPic(item)}>
                  <Text
                    style={{
                      textAlign: 'left',
                      marginTop: 2,
                      color: 'white',
                      fontSize: 13,
                      fontWeight: '600',
                      marginRight: 4,
                    }}>
                    {item.username}
                  </Text>
                </Pressable>
              )}
              <Text
                style={{
                  textAlign: 'left',
                  marginTop: 2,
                  color: 'white',
                  fontSize: 13,
                }}>
                {item.description}
              </Text>
            </View>
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

  return playlistContext?.state?.followingPlaylists ? (
    <SafeAreaView style={styles.screen}>
      <Header />
      {playlistContext?.state?.followingPlaylists != 'null' ? (
        <View
          style={{
            alignItems: 'center',
            flex: 1,
          }}>
          <FlatList
            initialNumToRender={10}
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
        backgroundColor: 'black',
        flex: 1,
        justifyContent: 'center',
      }}></View>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: 'black',
    alignItems: 'center',
    flex: 1,
  },
});

export default FollowingFeed;
