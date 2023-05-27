import {
  Text,
  StyleSheet,
  Image,
  View,
  FlatList,
  Pressable,
  SafeAreaView,
  TextInput,
  Keyboard,
  ActivityIndicator,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import RNSInfo from 'react-native-sensitive-info';
import Icon from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Toast from 'react-native-root-toast';
import {Context as AuthContext} from '../../context/AuthContext';
import {Context as PlaylistContext} from '../../context/PlaylistContext';
import envs from '../../../Config/env';

const BACKEND_URL = envs.PROD_URL;

const window = Dimensions.get('window').width;

const DiscoverFeed = () => {
  const [recentSearch, setRecentSearched] = useState([]);
  const [searchUsers, setSearchUsers] = useState([]);
  const [searchPlaylists, setSearchPlaylists] = useState([]);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);
  const [isPressed, setPressed] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);
  const playlistContext = useContext(PlaylistContext);
  const getUserID = async () => await RNSInfo.getItem('user_id', {});
  const searchResults = [...searchUsers, ...searchPlaylists];

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

  //Call to fetch Playlists function
  useEffect(() => {
    playlistContext?.getAllPlaylists();
  }, [authContext?.state.token]);

  const wait = timeout => {
    // Defined the timeout function for testing purpose
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setLoadingData(true);
    playlistContext?.getAllPlaylists();
    loadingData == true ? (
      <View
        style={{
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}>
        <ActivityIndicator color="white" size="large" />
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

  const onSearched = item => {
    setRecentSearched(item);
    item.playlist_title
      ? onPlaylistDetail(item)
      : navigation.navigate({
          name: 'ProfileScreen',
          params: item,
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

  //Render Playlist data
  const renderPlaylists = ({item}) => (
    <View
      style={{
        marginTop: 8,
        marginHorizontal: item.length > 1 ? 2 : 12,
        marginBottom: 6,
        width: window / 2 - 12,
        alignItems: 'center',
      }}>
      <Pressable
        onPress={() => onPlaylistDetail(item)}
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
        {item.playlist_cover ? (
          <Image
            style={{
              width: window / 2 - 22,
              height: window / 2 - 22,
              borderRadius: 2,
              backgroundColor: '#1f1f1f',
            }}
            source={{uri: item.playlist_cover}}
          />
        ) : null}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Pressable
            onPress={() => onUserPic(item)}
            style={{
              height: 30,
              width: 30,
              borderRadius: 30,
              backgroundColor: '#121212',
            }}>
            {item.avi_pic ? (
              <Image
                style={{height: 30, width: 30, borderRadius: 30}}
                source={{uri: item.avi_pic}}
              />
            ) : null}
          </Pressable>
          <View
            style={{
              flexDirection: 'column',
              marginLeft: 8,
            }}>
            <View>
              <Text
                style={{
                  textAlign: 'left',
                  color: 'white',
                  fontSize: 13,
                }}
                numberOfLines={1}>
                {item.username}
              </Text>
              <Text
                style={{
                  textAlign: 'left',
                  color: 'lightgrey',
                  fontSize: 12,
                  marginTop: 1,
                }}
                numberOfLines={1}>
                {item.playlist_title}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );

  // Render recent searched
  const renderRecentSearch = ({item}) => {
    <Pressable
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        width: window,
        paddingHorizontal: 12,
      }}
      onPress={() => onPlaylistDetail(item)}>
      <View style={{flexDirection: 'row'}}>
        <Image
          style={{
            width: 50,
            height: 50,
            borderRadius: 2,
            backgroundColor: '#1f1f1f',
          }}
          source={{uri: item.playlist_cover}}
        />
        <View
          style={{
            flexDirection: 'column',
            marginLeft: 10,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              textAlign: 'left',
              color: 'white',
              fontSize: 14,
              fontWeight: '500',
            }}
            numberOfLines={1}>
            {item.username}
          </Text>
          <Text
            style={{
              textAlign: 'left',
              color: 'lightgrey',
              fontSize: 13,
              marginTop: 2,
            }}
            numberOfLines={1}>
            {item.playlist_title}
          </Text>
        </View>
      </View>
      <Entypo name="cross" size={20} color="white" onPress={null} />
    </Pressable>;
  };

  //Render searched playlist
  const renderFilteredPlaylists = ({item, index}) =>
    item.username ? (
      <TouchableHighlight
        key={`${item.id}-${index}`}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 10,
          width: window,
          paddingHorizontal: 12,
        }}
        onPress={() => onSearched(item)}>
        <View style={{flexDirection: 'row'}}>
          {item.playlist_cover ? (
            <Image
              style={{
                width: 50,
                height: 50,
                borderRadius: 2,
                backgroundColor: '#1f1f1f',
              }}
              source={{
                uri: item.playlist_cover,
              }}
            />
          ) : (
            <Image
              style={{
                width: 50,
                height: 50,
                borderRadius: 40,
                backgroundColor: '#1f1f1f',
              }}
              source={{
                uri: item.avi_pic,
              }}
            />
          )}
          <View
            style={{
              flexDirection: 'column',
              marginLeft: 10,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                textAlign: 'left',
                color: 'white',
                fontSize: 14,
                fontWeight: '500',
              }}
              numberOfLines={1}>
              {item.username}
            </Text>
            {item.playlist_title ? (
              <Text
                style={{
                  textAlign: 'left',
                  color: 'lightgrey',
                  fontSize: 13,
                  marginTop: 2,
                }}
                numberOfLines={1}>
                {item.playlist_title
                  ? item.playlist_title
                  : item.name
                  ? item.name
                  : null}
              </Text>
            ) : null}
          </View>
        </View>
      </TouchableHighlight>
    ) : null;

  const searchAPI = async text => {
    const token = await RNSInfo.getItem('token', {});
    if (text.length > 0)
      try {
        const response = await axios.get(
          `${BACKEND_URL}/feed/search/?q=${text}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
          },
        );
        const searchResults = response.data;
        setSearchUsers(searchResults[0].users);
        setSearchPlaylists(searchResults[0].playlists);
      } catch (error) {
        // console.error(error);
      }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.text}>cycles</Text>
      </View>
      <View
        style={
          isPressed ? styles.search_container_pressed : styles.search_container
        }>
        <View style={isPressed ? styles.searchBarPressed : styles.searchBar}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="search" size={13} color={'white'} />
            <TextInput
              placeholder={'Search:'}
              selectionColor={'white'}
              placeholderTextColor={'white'}
              onFocus={() => {
                setPressed(true);
              }}
              value={search}
              onChangeText={text => {
                setSearch(text);
                searchAPI(text);
                setSearchPlaylists(text);
                setSearchUsers(text);
              }}
              style={
                isPressed ? styles.textInputOpened : styles.textInput
              }></TextInput>
          </View>
          {search.length > 0 ? (
            <Entypo
              name="cross"
              size={20}
              color="white"
              onPress={() => {
                setSearch('');
              }}
            />
          ) : null}
        </View>
        {isPressed ? (
          <Pressable
            style={{
              width: 60,
              height: 50,
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}
            onPress={() => {
              Keyboard.dismiss();
              setPressed(false);
              setSearch('');
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 14,
                fontWeight: '500',
              }}>
              Cancel
            </Text>
          </Pressable>
        ) : null}
      </View>
      <View
        style={
          playlistContext.state.allPlaylists &&
          playlistContext.state.allPlaylists.length > 1
            ? {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }
            : {
                flex: 1,
                justifyContent: 'center',
              }
        }>
        {isPressed ? (
          search ? (
            <FlatList
              keyExtractor={(item, index) => `${item.id}-${index}`}
              data={searchResults}
              numColumns={1}
              renderItem={renderFilteredPlaylists}></FlatList>
          ) : (
            <FlatList
              // keyExtractor={recentSearch => recentSearch.id}
              data={recentSearch}
              numColumns={1}
              renderItem={renderRecentSearch}></FlatList>
          )
        ) : (
          <FlatList
            data={playlistContext?.state.allPlaylists}
            key={playlistContext?.state.allPlaylists}
            renderItem={renderPlaylists}
            numColumns={2}
            refreshing={isRefreshing}
            onRefresh={onRefresh}></FlatList>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#0C0C0C',
    flex: 1,
  },
  columnWrapper: {
    justifyContent: 'space-evenly',
  },
  container: {
    backgroundColor: '#0C0C0C',
    height: 50,
    alignItems: 'center',
  },
  text: {
    fontSize: 32,
    fontFamily: 'futura',
    fontWeight: 'bold',
    color: 'white',
  },
  search_container: {
    height: 50,
    width: window,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderBottomColor: '#262626',
    borderBottomWidth: 0.3,
  },
  search_container_pressed: {
    height: 50,
    width: window,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomColor: '#262626',
    borderBottomWidth: 0.3,
  },
  searchBarPressed: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // // backgroundColor: 'blue',
    // height: 50,
    paddingHorizontal: 12,
    backgroundColor: '#202020',
    height: 35,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: window - 84,
    justifyContent: 'space-between',
  },
  searchBar: {
    paddingHorizontal: 12,
    backgroundColor: '#202020',
    height: 35,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: window - 24,
    // justifyContent: 'center',
  },
  // inputPressed: {
  //   paddingHorizontal: 12,
  //   backgroundColor: '#202020',
  //   height: 35,
  //   borderRadius: 10,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   width: window - 84,
  //   justifyContent: 'space-evenly',
  // },
  // inputClosed: {
  //   paddingHorizontal: 12,
  //   backgroundColor: '#202020',
  //   height: 35,
  //   borderRadius: 10,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   width: window - 24,
  // },
  textInput: {
    fontSize: 13,
    color: 'white',
    marginLeft: 8,
    width: window - 57,
    height: 35,
  },
  textInputOpened: {
    fontSize: 13,
    color: 'white',
    height: 35,
    marginLeft: 8,
  },
});

export default DiscoverFeed;
