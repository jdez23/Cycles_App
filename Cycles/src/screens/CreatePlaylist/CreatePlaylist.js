import React, {useRef, useState, useContext, useEffect} from 'react';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  Linking,
  SafeAreaView,
  FlatList,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import {Divider} from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {Context as AuthContext} from '../../context/AuthContext';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Context as PlaylistContext} from '../../context/PlaylistContext';
import RNSInfo from 'react-native-sensitive-info';
import Toast from 'react-native-root-toast';
import envs from '../../../Config/env';

const BACKEND_URL = envs.DEV_URL;

const CreatePlaylist = () => {
  const window = Dimensions.get('window').width;
  let actionSheet = useRef();
  let optionArray = ['Spotify', 'Cancel'];
  const [toast, setToast] = useState(null);
  const navigation = useNavigation();
  const [images, setRenderImages] = useState([]);
  const [description, setDescription] = useState('');
  const authContext = useContext(AuthContext);
  const playlistContext = useContext(PlaylistContext);
  const selected_playlist = playlistContext?.state?.selectedSpotifyPlaylist;
  const getToken = async () => await RNSInfo.getItem('token', {});

  //Listen for Callback URL
  useEffect(() => {
    const callback = Linking.addEventListener('url', onSpotifyCallback);
    return () => callback.remove();
  }, [authContext?.state.token]);

  // Listen for errors
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

  //  Listen for image updates
  useEffect(() => {
    images;
  }, [images]);

  //Show action sheet
  const showActionSheet = () => {
    actionSheet.current.show();
  };

  //Choose or Spotify or Apple Music
  const onActionSelect = index => {
    if (index === 0) {
      spotifyPlaylists();
    } else if (index === 1) {
      alert(optionArray[1]);
    }
  };

  //Pick images from gallery
  const pickGalleryImages = () => {
    let imageList = [];
    let renderList = [];

    ImagePicker.openPicker({
      multiple: true,
      mediaType: 'any',
      maxFiles: 10,
      cropping: true,
    })
      .then(response => {
        response.map(imgs => {
          imageList.push(imgs.path);
          renderList.push(imgs.path);
        });
        setRenderImages(renderList);
      })
      .catch(() => null);
  };

  // Crop selected image
  const cropImage = item => {
    ImagePicker.openCropper({
      path: item.item,
      width: window,
      height: window,
    })
      .then(image => {
        setRenderImages(prev => {
          const oldIndex = prev.findIndex(img => img === item.item);
          const newImages = [...prev];
          newImages[oldIndex] = image.path;
          return newImages;
        });
      })
      .catch(() => null);
  };

  // Authenticate Spotify
  const authenticateSpotify = async () => {
    const isSpotifyAuth = await authContext?.isSpotifyAuth();
    isSpotifyAuth === 'true' ? navigation.navigate('SpotifyPlaylist') : null;
    isSpotifyAuth === 'false' ? authContext?.authSpotify() : null;
  };

  //Spotify Callback
  const onSpotifyCallback = async url => {
    if (url !== null) {
      const urlCallback = new URL(url.url);
      const code = urlCallback.searchParams.get('code');
      const tokenresponse = await authContext?.spotifyCallback(code);
      const data = {
        access_token: tokenresponse.access_token,
        token_type: tokenresponse.token_type,
        expires_in: tokenresponse.expires_in,
        refresh_token: tokenresponse.refresh_token,
      };
      const res = await authContext?.spotifyLogin(data);
      if (res == 'true') {
        navigation.navigate('SpotifyPlaylist');
      } else {
        null;
      }
    }
  };

  //Post playlist to API
  const postPlaylist = async () => {
    const token = await getToken();
    const formData = new FormData();

    images.forEach(image => {
      formData.append(`images`, {
        uri: image,
        type: 'image/jpeg',
        name: image,
      });
    });

    formData.append('description', description);
    formData.append('playlist_url', selected_playlist.external_urls.spotify);
    formData.append('playlist_ApiURL', selected_playlist.href);
    formData.append('playlist_id', selected_playlist.id);
    formData.append('playlist_cover', selected_playlist.images[0].url);
    formData.append('playlist_title', selected_playlist.name);
    formData.append('playlist_type', selected_playlist.type);
    formData.append('playlist_uri', selected_playlist.uri);
    formData.append('playlist_tracks', selected_playlist.tracks.href);
    try {
      const res = await fetch(`${BACKEND_URL}/feed/my-playlists/`, {
        method: 'POST',
        headers: {
          Authorization: token,
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
      if (res.status === 201) {
        playlistContext?.clearSelectedPlaylist();
        playlistContext?.getFollowersPlaylists();
        navigation.navigate('FollowingFeed');
      }
    } catch (e) {
      authContext?.dispatch({
        type: 'error_1',
        payload: 'Something went wrong. Please try again.',
      });
    }
  };

  //Navigate back to previous screen
  const cancel = () => {
    playlistContext?.clearSelectedPlaylist();
    navigation.goBack(null);
  };

  // console.log('---', selected_playlist?.name);

  return (
    <SafeAreaView
      style={StyleSheet.create({backgroundColor: '#0C0C0C', flex: 1})}>
      <View style={styles.header}>
        <Pressable onPress={() => cancel()}>
          <View
            style={{
              height: 50,
              width: 80,
              justifyContent: 'center',
            }}>
            <TouchableOpacity onPress={() => cancel()}>
              <Text style={styles.canceltext}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
        <Text style={styles.header_text}>Upload Playlist</Text>
        <Pressable onPress={() => postPlaylist()}>
          <View
            style={{
              height: 50,
              width: 80,
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}>
            <TouchableOpacity onPress={() => postPlaylist()}>
              <Text style={styles.posttext}>Share</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </View>
      <KeyboardAwareScrollView>
        <View style={{alignItems: 'center', height: window}}>
          {images?.length > 0 ? (
            images?.length >= 1 ? (
              <FlatList
                data={images}
                horizontal={true}
                decelerationRate={0}
                snapToInterval={window}
                snapToAlignment={'center'}
                showsHorizontalScrollIndicator={false}
                renderItem={item => {
                  return (
                    <Pressable
                      onPress={pickGalleryImages}
                      style={{
                        height: window,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <ImageBackground
                        style={{height: window, width: window}}
                        source={{uri: item.item}}>
                        <Pressable
                          style={styles.cropIcon}
                          onPress={() => cropImage(item)}>
                          <Feather name="crop" size={15} color={'lightgrey'} />
                        </Pressable>
                      </ImageBackground>
                    </Pressable>
                  );
                }}></FlatList>
            ) : (
              <Pressable onPress={pickGalleryImages}>
                <Image style={{height: window}} source={images} />
              </Pressable>
            )
          ) : (
            <Pressable
              onPress={pickGalleryImages}
              style={{
                alignSelf: 'center',
                justifyContent: 'center',
                width: window,
                height: window,
                backgroundColor: '#1F1F1F',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <View style={styles.camera_container}>
                <Ionicons
                  name="camera"
                  size={10}
                  color={'grey'}
                  style={styles.camera_icon}
                />
              </View>
            </Pressable>
          )}
        </View>
        {!selected_playlist ? (
          <TouchableHighlight onPress={() => authenticateSpotify()}>
            <View style={styles.uploadplaylist}>
              <Text style={styles.uploadplaylist_text}>Upload playlist</Text>
              <Ionicons name="chevron-forward" size={18} color={'lightgrey'} />
            </View>
          </TouchableHighlight>
        ) : (
          <TouchableHighlight onPress={() => authenticateSpotify()}>
            <View style={styles.selected_playlist}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={selected_playlist?.images}
                  style={styles.playlistimage}
                />
                <View style={{flexDirection: 'column', marginLeft: 10}}>
                  <Text style={styles.playlisttitle} numberOfLines={1}>
                    {selected_playlist?.name}
                  </Text>
                  <Text style={styles.playlisttype} numberOfLines={1}>
                    {selected_playlist?.type}
                  </Text>
                </View>
              </View>
              <Icon
                name="angle-right"
                size={20}
                style={{right: 3, color: 'white'}}
              />
            </View>
          </TouchableHighlight>
        )}
        <Divider width={0.2} color="grey" />
        <View style={styles.description_container}>
          <TextInput
            style={styles.description_text}
            value={description}
            onChangeText={setDescription}
            placeholder={'Title:'}
            selectionColor={'white'}
            placeholderTextColor={'lightgrey'}
            clearTextOnFocus={true}></TextInput>
        </View>
        {/* <ActionSheet
          ref={actionSheet}
          options={optionArray}
          cancelButtonIndex={2}
          onPress={onActionSelect}
        /> */}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  posttext: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0C8ECE',
    paddingHorizontal: 12,
  },
  canceltext: {
    fontSize: 14,
    fontWeight: '500',
    color: 'lightgrey',
    paddingHorizontal: 12,
  },
  header_text: {
    fontSize: 14,
    alignSelf: 'center',
    color: 'white',
    fontWeight: '500',
  },
  header: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  camera_container: {
    justifyContent: 'center',
    height: 30,
    width: 30,
    backgroundColor: 'black',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 15,
  },
  camera_icon: {
    alignItems: 'center',
  },
  uploadplaylist: {
    flexDirection: 'row',
    height: 100,
    alignItems: 'center',
  },
  uploadplaylist_text: {
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#0C8ECE',
    textAlign: 'left',
  },
  description_container: {
    flexDirection: 'row',
  },
  description_text: {
    paddingHorizontal: 12,
    fontSize: 13,
    color: 'white',
    textAlign: 'left',
    height: 80,
    width: '100%',
  },
  selected_playlist: {
    flexDirection: 'row',
    height: 100,
    alignItems: 'center',
    marginHorizontal: 12,
    justifyContent: 'space-between',
  },
  playlistimage: {
    height: 60,
    width: 60,
    borderRadius: 3,
  },
  playlisttitle: {
    fontSize: 13,
    color: 'white',
    left: 6,
  },
  playlisttype: {
    marginTop: 1,
    fontSize: 12,
    color: 'lightgrey',
    left: 6,
  },
  cropIcon: {
    height: 30,
    width: 30,
    borderRadius: 30,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    position: 'absolute',
    right: 15,
    bottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CreatePlaylist;
