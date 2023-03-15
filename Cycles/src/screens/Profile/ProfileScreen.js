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
  Linking,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-root-toast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Spotify_Icon_RGB_Green from '../../../assets/logos/Spotify_Icon_RGB_Green.png';

import {Context as AuthContext} from '../../context/AuthContext';
import {Context as PlaylistContext} from '../../context/PlaylistContext';

const window = Dimensions.get('window').width;

const ProfileScreen = route => {
  const [toast, setToast] = useState(null);
  const profileID = route.route.params.userID
    ? route.route.params.userID
    : route.route.params?.id
    ? route.route.params?.id
    : route.route.params?.item?.from_user;
  const navigation = useNavigation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const authContext = useContext(AuthContext);
  const playlistContext = useContext(PlaylistContext);
  const props = {
    to_user: profileID,
    currentUser: authContext?.state?.user_id,
  };

  useEffect(() => {
    if (playlistContext?.state?.errorMessage) {
      setToast(
        Toast.show(playlistContext?.state?.errorMessage, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.CENTER,
          onHidden: () => dispatch({type: 'clear_error_message'}),
        }),
      );
    } else if (toast) {
      Toast.hide(toast);
    }
  }, [playlistContext?.state?.errorMessage]);

  //Call to fetch current users playlists
  useEffect(() => {
    authContext?.getCurrentUser();
    try {
      playlistContext?.getPlaylistData(profileID);
      playlistContext
        ?.getProfileData(profileID)
        .then(res => setIsFollowing(res));
    } catch {
      null;
    }
  }, [authContext?.state.token]);

  const wait = timeout => {
    // Defined the timeout function for testing purpose
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setLoadingData(true);
    playlistContext?.getPlaylistData(profileID);
    playlistContext?.getProfileData(profileID).then(res => setIsFollowing(res));
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

  const onBack = () => {
    navigation.goBack();
  };

  const onEditProfile = () => {
    navigation.navigate({
      name: 'EditProfile',
      params: {profile_data: playlistContext?.state?.userProfileData},
      merge: true,
    });
  };

  //Navigate to playlist detail screen
  const onPlaylistDetail = async item => {
    navigation.navigate({
      name: 'Playlist',
      params: {playlist_id: item.id, userToken: authContext?.state.token},
    });
  };

  const onFollowers = item => {
    navigation.push('FollowersList', item);
  };

  const onFollowing = item => {
    navigation.push('FollowingList', item);
  };

  const onFollowUser = () => {
    playlistContext?.followUser(props);
    setIsFollowing('true');
  };

  const onUnfollowUser = () => {
    playlistContext?.unfollowUser(props);
    setIsFollowing('false');
  };

  // // Follow user
  // const followUser = async () => {
  //   const data = {
  //     to_user: to_user.toString(),
  //     title: 'Cycles',
  //     body: 'followed you',
  //   };
  //   try {
  //     await axios
  //       .post(
  //         'http://127.0.0.1:8000/users/following/',
  //         [{currentUser: userID, toFollowUser: profileData.id}],
  //         {
  //           headers: {
  //             'Content-Type': 'application/json',
  //             Authorization: 'token ' + JSON.parse(state.token),
  //           },
  //         },
  //       )
  //       .then(res => {
  //         setProfileData([res.data]);
  //         ws.send(JSON.stringify(data));
  //         // Send notificiation to user
  //         try {
  //           axios
  //             .post(
  //               'http://127.0.0.1:8000/notifications/message/',
  //               {
  //                 to_user: userID,
  //                 title: 'Cycles',
  //                 body: currentUser + ' followed you.',
  //                 image: PlaylistData.playlist_cover,
  //               },
  //               {
  //                 headers: {
  //                   'Content-Type': 'application/json',
  //                   Authorization: 'token ' + JSON.parse(state.token),
  //                 },
  //               },
  //             )
  //             .then(res => {
  //               response = res.data;
  //               console.log(response);
  //             });
  //         } catch (error) {
  //           console.error(error);
  //         }
  //       });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // Unfollow user
  // const unllowUser = async () => {
  //   try {
  //     await axios
  //       .post(
  //         'http://127.0.0.1:8000/users/following/',
  //         [{currentUser: userID, toFollowUser: profileData.id}],
  //         {
  //           headers: {
  //             'Content-Type': 'application/json',
  //             Authorization: 'token ' + JSON.parse(state.token),
  //           },
  //         },
  //       )
  //       .then(res => {
  //         setProfileData([res.data]);
  //       });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  //Fetch current users profile data

  // // Get a users profile data
  // const getProfileData = async () => {
  //   const token = await RNSInfo.getItem('token', {});
  //   try {
  //     await axios
  //       .get(`${BACKEND_URL}/users/user/${userID}/`, {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: token,
  //         },
  //       })
  //       .then(res => {
  //         const profile_Data = res.data;
  //         const followers = profile_Data.followers;
  //         const followersID = followers.map(item => item.user);
  //         if (followersID.toString().includes(authContext?.state?.user_id)) {
  //           setIsFollowing('true');
  //         } else {
  //           setIsFollowing('false');
  //         }
  //         setProfileData([profile_Data]);
  //       });
  //   } catch (error) {
  //     playlistContext?.dispatch({
  //       type: 'error_1',
  //       payload: 'Something went wrong. Please try again.',
  //     });
  //   }
  // };

  // //Fetch a users playlists
  // const getPlaylistData = async () => {
  //   const token = await RNSInfo.getItem('token', {});
  //   try {
  //     await axios
  //       .get(`${BACKEND_URL}/feed/user-playlists/?id=${userID}`, {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: token,
  //         },
  //       })
  //       .then(res => {
  //         const playlistData = res.data;
  //         // console.log(playlistData);
  //         setPlaylistData(playlistData);
  //       });
  //   } catch (error) {
  //     playlistContext?.dispatch({
  //       type: 'error_1',
  //       payload: 'Something went wrong. Please try again.',
  //     });
  //   }
  // };

  // Render profile data
  const renderProfileData = () => {
    return playlistContext?.state?.userProfileData ? (
      <View
        style={{
          marginBottom: 12,
          borderBottomWidth: 0.3,
          borderBottomColor: '#1f1f1f',
        }}>
        <View
          key={playlistContext?.state?.userProfileData?.id}
          style={{marginBottom: -30}}>
          {playlistContext?.state?.userProfileData?.header_pic ? (
            <View style={{height: 200, backgroundColor: '#121212'}}>
              <Image
                style={{height: 200, width: window}}
                source={{
                  uri: playlistContext?.state?.userProfileData?.header_pic,
                }}
              />
            </View>
          ) : (
            <View
              style={{
                height: 200,
                width: window,
                backgroundColor: '#121212',
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
              {playlistContext?.state?.userProfileData?.avi_pic ? (
                <Image
                  style={{
                    height: 60,
                    width: 60,
                    borderRadius: 50,
                    alignSelf: 'center',
                    backgroundColor: '#1f1f1f',
                  }}
                  source={{
                    uri: playlistContext?.state?.userProfileData?.avi_pic,
                  }}
                />
              ) : (
                <View
                  style={{
                    height: 60,
                    width: 60,
                    borderRadius: 30,
                    alignSelf: 'center',
                    backgroundColor: 'grey',
                  }}
                />
              )}
            </View>
            {!playlistContext?.state?.userProfileData?.name ? null : (
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
                    fontWeight: 'bold',
                  }}>
                  {playlistContext?.state?.userProfileData?.name}
                </Text>
              </View>
            )}
            {!playlistContext?.state?.userProfileData?.bio ? null : (
              <View
                style={{
                  width: 400,
                  alignSelf: 'center',
                  marginTop: 4,
                }}>
                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 13,
                    color: 'white',
                    textAlign: 'center',
                  }}>
                  {playlistContext?.state?.userProfileData?.bio}
                </Text>
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: 300,
                alignSelf: 'center',
                marginTop: 4,
              }}>
              <Pressable onPress={() => onFollowing(props)}>
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
                    {playlistContext?.state?.userProfileData?.following.length}
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
              </Pressable>
              <Pressable onPress={() => onFollowers(props)}>
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
                    {playlistContext?.state?.userProfileData?.followers.length}
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
              </Pressable>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 8,
              }}>
              {!playlistContext?.state?.userProfileData?.spotify_url ? null : (
                <Pressable
                  style={{paddingRight: 6}}
                  onPress={() =>
                    Linking.openURL(
                      playlistContext?.state?.userProfileData?.spotify_url,
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
                </Pressable>
              )}
              <View>
                {authContext?.state?.user_id === profileID.toString() ? (
                  <TouchableOpacity onPress={onEditProfile}>
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
                  </TouchableOpacity>
                ) : isFollowing === true ? (
                  <TouchableOpacity onPress={() => onUnfollowUser()}>
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
                        Unfollow
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => onFollowUser()}>
                    <View
                      style={{
                        height: 35,
                        width: 100,
                        backgroundColor: '#246EE9',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 30,
                      }}>
                      <Text
                        style={{
                          fontSize: 13,
                          color: 'white',
                        }}>
                        Follow
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>
    ) : null;
  };

  // Render playlist data
  const renderPlaylistData = ({item}) => (
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

  return (
    <SafeAreaView
      style={StyleSheet.create({
        backgroundColor: '#0C0C0C',
        height: '100%',
        flex: 1,
      })}>
      <View style={styles.container} blurRadius={1}>
        <Pressable onPress={onBack}>
          <View
            style={{
              height: 50,
              width: 50,
              paddingLeft: 12,
              justifyContent: 'center',
            }}>
            <Ionicons name="chevron-back" size={25} color={'white'} />
          </View>
        </Pressable>
        {playlistContext?.state?.userProfileData ? (
          <Text key={item => item.id} style={styles.textUser}>
            {playlistContext?.state?.userProfileData.username}
          </Text>
        ) : null}
        <View style={{height: 50, width: 50}} />
      </View>
      {playlistContext?.state?.userPlaylistData ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <FlatList
            data={playlistContext?.state?.userPlaylistData}
            ListHeaderComponent={renderProfileData}
            renderItem={renderPlaylistData}
            numColumns={2}
            scrollEnabled={true}
            refreshing={isRefreshing}
            onRefresh={onRefresh}></FlatList>
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: '#0C0C0C',
            justifyContent: 'center',
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0C0C0C',
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#232323',
    borderBottomWidth: 0.4,
  },
  textUser: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
});

export default ProfileScreen;
