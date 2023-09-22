import React, {useContext, useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Pressable,
  Linking,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Context as PlaylistContext} from '../../context/PlaylistContext';
import {Context as AuthContext} from '../../context/AuthContext';
import Toast from 'react-native-root-toast';
import Spotify_Icon_RGB_Green from '../../../assets/logos/Spotify_Icon_RGB_Green.png';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Playlist Details Component
export default PlaylistDetails = item => {
  const navigation = useNavigation();
  const playlistContext = useContext(PlaylistContext);
  const authContext = useContext(AuthContext);
  const [isLiked, setIsLiked] = useState();
  const [toast, setToast] = useState(null);
  const window = Dimensions.get('window').width;
  const playlist = item?.item?.item;
  const tracks = playlistContext?.state?.tracks;
  const imgs = playlist?.images;
  const props = {
    playlist_id: playlist?.id,
    images: imgs,
    to_user: playlist?.user,
    playlist_user_id: playlist?.user,
  };

  // Listen for errors
  useEffect(() => {
    if (authContext?.state?.errorMessage) {
      setToast(
        Toast.show(authContext?.state?.errorMessage, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.CENTER,
          onHidden: () => dispatch({type: 'clear_error_message'}),
        }),
      );
    } else if (toast) {
      Toast.hide(toast);
    }
  }, [authContext?.state?.errorMessage]);

  // Check if current user liked this image
  useEffect(() => {
    playlistContext
      ?.checkIfLiked(playlist.id)
      .then(item => setIsLiked(item.data));
  }, []);

  // Go to comments screen
  const onComments = () => {
    navigation.navigate({
      name: 'CommentsScreen',
      params: {
        props: props,
      },
    });
  };

  // Unlike playlist
  const onUnlike = () => {
    playlistContext?.unlikePlaylist(playlist.id).then(item => setIsLiked(item));
  };

  // Like playlist
  const onLike = props => {
    playlistContext?.likePlaylist(props).then(item => setIsLiked(item));
  };

  return playlist ? (
    <View>
      <View
        style={[
          playlist?.isSpotifyAuth === true
            ? styles.isAuthPadding
            : styles.notauthPadding,
        ]}>
        {imgs ? (
          <FlatList
            data={imgs}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            decelerationRate={0}
            snapToInterval={window}
            snapToAlignment={'center'}
            key={item => item.id}
            renderItem={item => {
              return (
                <View style={{height: window, backgroundColor: '#121212'}}>
                  <Image
                    style={{height: window, width: window}}
                    source={{
                      uri: item?.item?.images,
                    }}
                  />
                </View>
              );
            }}></FlatList>
        ) : (
          <Image style={{height: window, width: window}} source={imgs} />
        )}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            paddingHorizontal: 12,
            marginVertical: 12,
          }}>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                height: 25,
                width: 25,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {isLiked == true ? (
                <TouchableOpacity onPress={() => onUnlike(item.item)}>
                  <FontAwesome name="heart" size={24} color={'red'} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => onLike(props)}>
                  <Feather name="heart" size={24} color={'white'} />
                </TouchableOpacity>
              )}
            </View>
            <View
              style={{
                height: 25,
                width: 25,
                marginLeft: 15,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity onPress={() => onComments(item?.playlist_id)}>
                <Feather name="message-circle" size={25} color={'white'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {!playlist?.description ? null : (
          <Text
            style={{
              color: 'white',
              fontSize: 13,
              paddingLeft: 12,
              marginBottom: 6,
            }}>
            {playlist?.description}
          </Text>
        )}
        <TouchableOpacity onPress={() => onComments(playlist?.playlist_id)}>
          <Text
            style={{
              color: 'lightgrey',
              fontSize: 13,
              paddingLeft: 12,
              marginBottom: 12,
            }}>
            See all comments
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 12,
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {!playlist?.playlist_cover ? null : (
              <Image
                style={{
                  width: 70,
                  height: 70,
                  resizeMode: 'cover',
                  borderRadius: 2,
                  backgroundColor: '#1f1f1f',
                }}
                source={{uri: playlist?.playlist_cover}}
              />
            )}
            <View
              style={{
                flexDirection: 'column',
                alignSelf: 'center',
                paddingLeft: 10,
              }}>
              {!playlist?.playlist_title ? null : (
                <Text style={{color: 'white', fontSize: 13}}>
                  {playlist?.playlist_title}
                </Text>
              )}
              <Text
                style={{
                  marginTop: 2,
                  color: 'lightgrey',
                  fontSize: 13,
                }}>
                {playlist?.playlist_type}
              </Text>
            </View>
          </View>
          {!playlist?.playlist_url ? null : (
            <Pressable onPress={() => Linking.openURL(playlist?.playlist_url)}>
              <View
                style={{
                  height: 25,
                  width: 25,
                  borderRadius: 30,
                  backgroundColor: '#1f1f1f',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  style={{width: 15, height: 15}}
                  source={Spotify_Icon_RGB_Green}
                />
              </View>
            </Pressable>
          )}
        </View>
      </View>
      <FlatList
        data={tracks}
        renderItem={({item}) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 4,
              paddingHorizontal: 12,
              alignItems: 'center',
            }}>
            <View
              style={{
                paddingTop: 7,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 50,
                  height: 50,
                  resizeMode: 'cover',
                  borderRadius: 3,
                }}
                source={{uri: item.images}}
              />
              <View
                style={{
                  flexDirection: 'column',
                  alignSelf: 'center',
                  paddingLeft: 10,
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: 'white',
                    fontSize: 13,
                    fontWeight: '500',
                    width: 250,
                  }}>
                  {item?.name}
                </Text>
                <Text
                  style={{
                    marginTop: 2,
                    color: 'lightgrey',
                    fontSize: 13,
                  }}>
                  {item?.artist}
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
              onPress={() => Linking.openURL(item?.track_id)}>
              <Image
                style={{width: 15, height: 15}}
                source={Spotify_Icon_RGB_Green}
              />
            </Pressable>
          </View>
        )}></FlatList>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  isAuthPadding: {
    paddingBottom: 12,
    borderBottomColor: '#1f1f1f',
    borderBottomWidth: 0.3,
  },
  notauthPadding: {
    paddingBottom: 12,
    borderBottomColor: '#1f1f1f',
    borderBottomWidth: 0.3,
  },
});
