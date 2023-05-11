import React, {useEffect, useContext, useState, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  Pressable,
  SafeAreaView,
  Linking,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {wait} from './utils';
import PlaylistDetails from './playlistData';
import {Context as PlaylistContext} from '../../context/PlaylistContext';
import {Context as AuthContext} from '../../context/AuthContext';
import Toast from 'react-native-root-toast';
import ActionSheet from 'react-native-actionsheet';

const window = Dimensions.get('window').width;

const PlaylistScreen = route => {
  let actionSheet = useRef();
  const optionArray = ['Delete', 'Cancel'];
  const navigation = useNavigation();
  const data = route.route;
  const [isLoading, setLoading] = useState(false);
  const [loading, set_Loading] = useState(false);
  const [isSetLoading, setIsLoading] = useState(true);
  const [isRefreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState(null);
  const playlistContext = useContext(PlaylistContext);
  const authContext = useContext(AuthContext);
  const playlist = playlistContext?.state?.playlist;
  const me = authContext?.state?.user_id;

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

  useEffect(() => {
    playlistContext?.fetchPlaylist(
      data?.item?.playlist_id
        ? data?.item?.playlist_id
        : data?.playlist_id.toString(),
    );
  }, []);

  //Listen for Callback URL
  useEffect(() => {
    const callback = Linking.addEventListener('url', onSpotifyCallback);
    return () => callback.remove();
  }, [authContext?.state.token]);

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
      await authContext?.spotifyLogin(data);
    }
  };

  const onDeletePlaylist = async userID => {
    set_Loading(true);
    try {
      const res = await playlistContext?.deletePlaylist(playlist?.id);
      if (res === 200) {
        playlistContext.getFollowersPlaylists();
        playlistContext.getMyPlaylistData();
        if (userID) {
          playlistContext.getPlaylistData();
        }
        set_Loading(false);
        navigation.goBack();
      } else {
        null;
      }
    } catch (error) {
      playlistContext?.dispatch({
        type: 'error_1',
        payload: 'Something went wrong. Please try again.',
      });
    }
    set_Loading(false);
  };

  //Show action sheet
  const showActionSheet = () => {
    actionSheet.current.show();
  };

  const showAlert = () =>
    Alert.alert(
      'Are you sure you want to delete this playlist?',
      'Action is not reversable',
      [
        {
          text: 'Yes',
          onPress: () => onDeletePlaylist(),
        },
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
      ],
      {
        cancelable: true,
      },
    );

  const onActionSelect = index => {
    if (index === 0) {
      showAlert();
    } else if (index === 1) {
      null;
    }
  };

  // Refresh screen
  const onRefresh = () => {
    setRefreshing(true);
    setLoading(true);
    playlistContext?.checkIfLiked(data.playlist_id);
    playlistContext?.fetchPlaylist(data.playlist_id);
    isLoading === true ? (
      <View
        style={{
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}>
        <ActivityIndicator color={'white'} size="large" />
      </View>
    ) : null,
      wait(1000).then(() => setRefreshing(false), setLoading(false));
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1300);
    authContext?.getCurrentUser();
  }, []);

  // Go back to prev screen
  const onBack = () => {
    navigation.goBack();
  };

  if (isSetLoading) {
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

  return playlist ? (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Pressable onPress={onBack}>
          <View style={styles.header}>
            <Ionicons name="chevron-back" size={25} color={'white'} />
          </View>
        </Pressable>
        {playlist?.username ? (
          <Text style={styles.username}>{'@' + playlist?.username}</Text>
        ) : null}
        {JSON.stringify(playlist?.user) === me ? (
          <Pressable onPress={showActionSheet} style={styles.header}>
            <Feather name="more-horizontal" size={25} color={'white'} />
            <ActionSheet
              ref={actionSheet}
              options={optionArray}
              cancelButtonIndex={1}
              onPress={onActionSelect}
              title={'Delete playlist'}
              destructiveButtonIndex={0}
            />
          </Pressable>
        ) : (
          <View style={{height: 50, width: 50, justifyContent: 'center'}} />
        )}
      </View>
      <View style={{width: window, flex: 1}}>
        {playlist ? (
          <FlatList
            key={item => item.id}
            data={[playlist]}
            renderItem={item => <PlaylistDetails item={item} params={data} />}
            refreshing={isRefreshing}
            onRefresh={onRefresh}></FlatList>
        ) : null}
      </View>
      {loading == true ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(12, 12, 12, 0.5)',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            alignItems: 'center',
          }}>
          <ActivityIndicator size="small" />
        </View>
      ) : null}
    </SafeAreaView>
  ) : (
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
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#0C0C0C',
    alignItems: 'center',
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    width: window,
    backgroundColor: '#0C0C0C',
    borderBottomColor: '#232323',
    borderBottomWidth: 0.3,
  },
  header: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    paddingLeft: 12,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    justifyContent: 'center',
  },
});

const Playlist = props => {
  const route = props.route.params;
  return <PlaylistScreen route={route} />;
};

export default Playlist;
