import React, {useContext, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  FlatList,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Context as AuthContext} from '../../context/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Context as PlaylistContext} from '../../context/PlaylistContext';
import Toast from 'react-native-root-toast';

const window = Dimensions.get('window').width;

const SpotifyPlaylist = () => {
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);
  const [isLoading, setIsLoading] = React.useState(true);
  const [toast, setToast] = React.useState(null);
  const playlistContext = useContext(PlaylistContext);
  const selected_playlist = playlistContext?.state?.selectedSpotifyPlaylist;
  const spotifyPlaylists = playlistContext?.state?.spotifyPlaylists;

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

  //Call fetch Spotify playlists function
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    playlistContext?.getSpotifyPlaylist();
  }, [authContext?.state?.token]);

  //Navigate back to previous screen
  const onBack = () => {
    playlistContext?.clearSelectedPlaylist();
    navigation.goBack();
  };

  //Navigate back to previous screen
  const onSave = () => {
    navigation.goBack();
  };

  const renderSpotifyPlaylist = ({item}) => (
    <Pressable
      style={{paddingTop: 12}}
      onPress={() => playlistContext?.selectPlaylist(item)}>
      <View
        style={
          playlistContext?.state?.isSelected == item.id
            ? styles.card_selected
            : styles.card_not_selected
        }>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              width: window / 2 - 30,
              height: window / 2 - 30,
              backgroundColor: '#1f1f1f',
            }}>
            <Image
              style={{
                width: window / 2 - 30,
                height: window / 2 - 30,
                position: 'absolute',
              }}
              source={item.images}
            />
          </View>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignSelf: 'flex-start',
            }}>
            <Text
              style={{
                textAlign: 'left',
                marginTop: 6,
                color: 'white',
                fontSize: 13,
                fontWeight: '500',
                width: 150,
              }}
              numberOfLines={1}>
              {item.name}
            </Text>
            <Text
              style={{
                textAlign: 'left',
                marginTop: 4,
                color: 'lightgrey',
                fontSize: 12,
              }}>
              {item.type}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'black',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={StyleSheet.create({backgroundColor: 'black', flex: 1})}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <View style={styles.icon_box}>
            <Ionicons name="chevron-back" size={20} color={'white'} />
          </View>
        </TouchableOpacity>
        <Text style={styles.header_text}>Spotify Playlists</Text>
        <View style={styles.icon_box}>
          <TouchableOpacity onPress={onSave}>
            <Text
              style={{
                fontSize: 14,
                color: '#0C8ECE',
                fontWeight: '600',
                paddingRight: 5,
              }}>
              {'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {!spotifyPlaylists ? null : (
        <View
          style={{
            alignItems: 'center',
            flex: 1,
          }}>
          <FlatList
            data={spotifyPlaylists}
            initialNumToRender={10}
            extraData={selected_playlist}
            renderItem={renderSpotifyPlaylist}
            keyExtractor={item => item.id}
            numColumns={2}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header_text: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: '#121212',
  },
  icon_box: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card_selected: {
    marginHorizontal: 6,
    backgroundColor: '#202020',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card_not_selected: {
    marginHorizontal: 6,
    backgroundColor: '#151515',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SpotifyPlaylist;
