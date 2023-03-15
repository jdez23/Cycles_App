import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Spotify_Icon_RGB_Green from '../../../assets/logos/Spotify_Icon_RGB_Green.png';
import axios from 'axios';
import RNSInfo from 'react-native-sensitive-info';
import {Context as AuthContext} from '../../context/AuthContext';
import {Context as PlaylistContext} from '../../context/PlaylistContext';
import Toast from 'react-native-root-toast';
import {Linking} from 'react-native';
import envs from '../../../Config/env';

const BACKEND_URL = envs.DEV_URL;

const window = Dimensions.get('window').width;

const MyProfile = () => {
  const navigation = useNavigation();
  const [toast, setToast] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const authContext = useContext(AuthContext);
  const playlistContext = useContext(PlaylistContext);
  const getUserID = async () => await RNSInfo.getItem('user_id', {});

  useEffect(() => {
    if (authContext?.state?.errorMessage) {
      setToast(
        Toast.show(authContext?.state?.errorMessage, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.CENTER,
          onHidden: () => authContext?.dispatch({type: 'clear_error_message'}),
        }),
      );
    } else if (toast) {
      Toast.hide(toast);
    }
  }, [authContext?.state?.errorMessage]);

  //Call to fetch current users profile data
  useEffect(() => {
    playlistContext?.getMyProfileData();
    playlistContext?.getMyPlaylistData();
  }, [authContext?.state?.token]);

  const wait = timeout => {
    // Defined the timeout function for testing purpose
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setLoadingData(true);
    playlistContext?.getMyPlaylistData();
    playlistContext?.getMyProfileData();
    loadingData == true ? (
      <View
        style={{
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}>
        <ActivityIndicator color={'white'} size="large" />
      </View>
    ) : null;
    wait(1000).then(() => setIsRefreshing(false), setLoadingData(false));
  };

  //Navigate to playlist detail screen
  const onPlaylistDetail = async item => {
    navigation.navigate({
      name: 'Playlist',
      params: {playlist_id: item.id, userToken: authContext?.state.token},
    });
  };

  // console.log(profileData[0].name);

  const onEditProfile = () => {
    navigation.navigate({
      name: 'EditProfile',
      params: {profile_data: playlistContext?.state?.myProfileData},
      merge: true,
    });
  };

  const onProfileSettings = () => {
    navigation.navigate({
      name: 'ProfileSettings',
      params: {user_id: playlistContext?.state?.myProfileData?.id},
    });
  };

  const onFollowers = async () => {
    const user_id = await getUserID();
    navigation.navigate({name: 'FollowersList', params: {to_user: user_id}});
  };

  const onFollowing = async () => {
    const user_id = await getUserID();
    navigation.navigate({name: 'FollowingList', params: {to_user: user_id}});
  };

  // Render profile data
  const renderProfileData = () => {
    return playlistContext?.state?.myProfileData ? (
      <View
        style={{
          marginBottom: 12,
          borderBottomWidth: 0.3,
          borderBottomColor: '#1f1f1f',
        }}>
        <View
          key={playlistContext?.state?.myProfileData?.id}
          style={{marginBottom: -30}}>
          {playlistContext?.state?.myProfileData?.header_pic ? (
            <View
              style={{
                height: 200,
                backgroundColor: '#121212',
                width: window,
              }}>
              <Image
                source={`${BACKEND_URL}/media/media/header_images/27BF0950-FB61-46A4-9B97-F5D3DA3E32EC_QB3b7fH.jpg`}
                style={{height: 200, width: window}}
              />
            </View>
          ) : (
            <View
              style={{
                height: 200,
                width: window,
                backgroundColor: '#1f1f1f',
              }}
            />
          )}
          <View
            style={{
              flexDirection: 'column',
              bottom: 35,
            }}>
            <View
              style={{
                height: 64,
                width: 64,
                borderRadius: 50,
                alignSelf: 'center',
                backgroundColor: 'black',
                justifyContent: 'center',
              }}>
              {playlistContext?.state?.myProfileData?.avi_pic ? (
                <View
                  style={{
                    height: 60,
                    width: 60,
                    borderRadius: 50,
                    alignSelf: 'center',
                    backgroundColor: '#1f1f1f',
                  }}>
                  <Image
                    style={{
                      height: 60,
                      width: 60,
                      borderRadius: 50,
                      alignSelf: 'center',
                    }}
                    source={{
                      uri: `${BACKEND_URL}/media/media/avi_images/14D5EC08-FB32-4F75-8A08-835FE133E636.jpg`,
                    }}
                  />
                </View>
              ) : (
                <View
                  style={{
                    height: 60,
                    width: 60,
                    borderRadius: 30,
                    alignSelf: 'center',
                    backgroundColor: '#1f1f1f',
                  }}
                />
              )}
            </View>
            {!playlistContext?.state?.myProfileData?.name ? null : (
              <View
                style={{
                  width: 300,
                  alignSelf: 'center',
                  marginTop: 6,
                }}>
                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 14,
                    color: 'white',
                    fontWeight: '500',
                  }}>
                  {playlistContext?.state?.myProfileData?.name}
                </Text>
              </View>
            )}
            {!playlistContext?.state?.myProfileData?.bio ? null : (
              <View
                style={{
                  width: 300,
                  alignSelf: 'center',
                  marginTop: 4,
                }}>
                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 13,
                    color: 'white',
                    textAlign: 'left',
                  }}>
                  {playlistContext?.state?.myProfileData?.bio}
                </Text>
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: 300,
                alignSelf: 'center',
                marginTop: 6,
              }}>
              <TouchableOpacity
                onPress={() =>
                  onFollowing(playlistContext?.state?.myProfileData)
                }>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 13,
                      color: 'white',
                    }}>
                    {playlistContext?.state?.myProfileData?.following.length}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: 'lightgrey',
                      paddingLeft: 6,
                    }}>
                    Following
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  onFollowers(playlistContext?.state?.myProfileData)
                }>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 13,
                      color: 'white',
                      paddingLeft: 8,
                    }}>
                    {playlistContext?.state?.myProfileData?.followers.length}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: 'lightgrey',
                      paddingLeft: 6,
                    }}>
                    Followers
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 6,
              }}>
              {!playlistContext?.state?.myProfileData?.spotify_url ? null : (
                <TouchableOpacity
                  style={{paddingRight: 6}}
                  onPress={() =>
                    Linking.openURL(
                      playlistContext?.state?.myProfileData?.spotify_url,
                    )
                  }>
                  <View
                    style={{
                      height: 35,
                      width: 35,
                      borderRadius: 30,
                      backgroundColor: '#1f1f1f',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      style={{width: 20, height: 20}}
                      source={Spotify_Icon_RGB_Green}
                    />
                  </View>
                </TouchableOpacity>
              )}
              <TouchableHighlight
                onPress={onEditProfile}
                style={{marginTop: 4}}>
                <View
                  style={{
                    height: 35,
                    width: 100,
                    backgroundColor: '#1f1f1f',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 30,
                  }}>
                  <Text
                    style={{
                      fontSize: 13,
                      color: 'white',
                    }}>
                    Edit Profile
                  </Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </View>
    ) : null;
  };

  // Render playlist data
  const renderMyPlaylistData = ({item}) => (
    <View
      key={item.id}
      style={{
        // alignItems: 'center',
        // backgroundColor: 'brown',
        flex: 1,
        marginHorizontal: 12,
      }}>
      <Pressable
        onPress={() => onPlaylistDetail(item)}
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          width: window / 2 - 24,
          // backgroundColor: 'darkgreen',
        }}>
        {item.playlist_cover ? (
          <Image
            style={{
              width: window / 2 - 20,
              height: window / 2 - 20,
              borderRadius: 2,
              backgroundColor: '#1f1f1f',
            }}
            source={{uri: item.playlist_cover}}
          />
        ) : null}
        <View
          style={{
            flexDirection: 'row',
            marginTop: 10,
            alignSelf: 'flex-start',
          }}>
          <View style={{flexDirection: 'column'}}>
            {item.playlist_title ? (
              <Text
                style={{
                  textAlign: 'left',
                  color: 'white',
                  fontSize: 13,
                  fontWeight: '500',
                }}
                numberOfLines={1}>
                {item.playlist_title}
              </Text>
            ) : null}
            {item.playlist_type ? (
              <Text
                style={{
                  textAlign: 'left',
                  marginTop: 2,
                  color: 'lightgrey',
                  fontSize: 12,
                }}
                numberOfLines={1}>
                {item.playlist_type}
              </Text>
            ) : null}
          </View>
        </View>
      </Pressable>
    </View>
  );

  return playlistContext?.state?.myProfileData ? (
    <SafeAreaView
      style={StyleSheet.create({
        backgroundColor: '#0C0C0C',
        flex: 1,
        width: window,
      })}>
      <View style={styles.container} blurRadius={1}>
        <View style={{height: 50, width: 50}} />
        {playlistContext?.state?.myProfileData ? (
          <Text key={item => item.id} style={styles.textUser}>
            {playlistContext?.state?.myProfileData.username}
          </Text>
        ) : null}
        <View style={{height: 50, width: 50, justifyContent: 'center'}}>
          <Pressable onPress={() => onProfileSettings()}>
            <TouchableOpacity onPress={() => onProfileSettings()}>
              <Ionicons
                name="ellipsis-horizontal"
                size={25}
                color={'white'}
                style={{alignSelf: 'center'}}
              />
            </TouchableOpacity>
          </Pressable>
        </View>
      </View>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <FlatList
          data={playlistContext?.state?.myPlaylistData}
          ListHeaderComponent={renderProfileData}
          renderItem={renderMyPlaylistData}
          numColumns={2}
          scrollEnabled={true}
          refreshing={isRefreshing}
          onRefresh={onRefresh}></FlatList>
      </View>
    </SafeAreaView>
  ) : (
    <View
      style={{
        justifyContent: 'center',
        backgroundColor: '#0C0C0C',
        flex: 1,
      }}></View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0C0C0C',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#252525',
    borderBottomWidth: 0.3,
    alignItems: 'center',
  },
  textUser: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
});

export default MyProfile;
