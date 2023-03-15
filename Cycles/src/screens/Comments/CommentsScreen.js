import React, {useEffect, useContext, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';

import Swipeable from 'react-native-gesture-handler/Swipeable';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Context as AuthContext} from '../../context/AuthContext';
import {Context as PlaylistContext} from '../../context/PlaylistContext';
import {TextInput} from 'react-native-gesture-handler';
import Toast from 'react-native-root-toast';

const CommentsScreen = route => {
  const navigation = useNavigation();
  const data = route?.route?.params?.props;
  const playlist_user_id =
    route?.route?.params?.item?.to_user || data.playlist_user_id;
  const authContext = useContext(AuthContext);
  const playlistContext = useContext(PlaylistContext);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [title, setTitle] = useState('');
  const [toast, setToast] = useState('');
  const window = Dimensions.get('window').width;
  const comments = playlistContext?.state?.comments;
  const me = authContext?.state.user_id;

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

  // console.log('comments', me);

  // Call to get playlist' comments
  useEffect(() => {
    authContext?.getCurrentUser();
    playlistContext?.getComments(
      route?.route?.params?.item?.playlist_id || data?.playlist_id,
    );
  }, [authContext?.state.token]);

  const onBack = () => {
    navigation.goBack();
  };

  const wait = timeout => {
    // Defined the timeout function for testing purpose
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setLoadingData(true);
    playlistContext?.getComments(playlist_id);
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

  const onComment = async title => {
    setTitle('');
    playlistContext?.comment({
      playlist_id: data?.playlist_id,
      images: data?.images,
      to_user: data?.to_user,
      title: title,
    });
  };

  //Navigate to user profile
  const onUserPic = async item => {
    navigation.navigate({
      name: 'ProfileScreen',
      params: {userID: item?.user, playlist_id: item?.playlist},
    });
  };

  const rightSwipeActions = item => {
    return (
      <Pressable
        onPress={() => playlistContext?.deleteComment(item.id)}
        style={{
          backgroundColor: 'red',
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}>
        <Text
          style={{
            color: 'white',
            marginHorizontal: 20,
            fontWeight: '600',
            // paddingHorizontal: 30,
            // paddingVertical: 20,
          }}>
          Delete
        </Text>
      </Pressable>
    );
  };

  // Render comments
  _renderItem = ({item}) =>
    playlist_user_id == authContext?.state.user_id ||
    item.user == authContext?.state.user_id ? (
      <Swipeable renderRightActions={() => rightSwipeActions(item)}>
        <View
          style={{
            flexDirection: 'row',
            // justifyContent: 'space-between',
            alignItems: 'flex-start',
            width: window,
            marginTop: 10,
            marginBottom: 10,
            paddingLeft: 12,
            // backgroundColor: 'brown',
          }}>
          {item?.avi_pic ? (
            <Pressable
              onPress={() => onUserPic(item)}
              style={{
                height: 45,
                width: 45,
                borderRadius: 30,
                backgroundColor: '#1f1f1f',
              }}>
              <Image
                style={{
                  height: 45,
                  width: 45,
                  borderRadius: 30,
                  backgroundColor: '#1f1f1f',
                }}
                source={item?.avi_pic}
              />
            </Pressable>
          ) : null}
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
              height: '100%',
              maxWidth: window - 80,
              marginHorizontal: 10,
              // backgroundColor: 'green',
              paddingTop: 4,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {item?.username ? (
                <Pressable onPress={() => onUserPic(item)}>
                  <Text
                    numberOfLines={1}
                    style={{
                      textAlign: 'left',
                      color: 'white',
                      fontSize: 13,
                      fontWeight: '600',
                    }}>
                    {item?.username}
                  </Text>
                </Pressable>
              ) : null}
              {item?.date ? (
                <Text
                  style={{
                    color: 'lightgrey',
                    fontSize: 11,
                    fontWeight: '500',
                    marginLeft: 6,
                  }}>
                  {moment(item?.date).fromNow()}
                </Text>
              ) : null}
            </View>
            {item?.title ? (
              <Text
                style={{
                  textAlign: 'left',
                  color: 'lightgrey',
                  fontSize: 13,
                  fontWeight: '500',
                  marginTop: 2,
                }}>
                {item?.title}
              </Text>
            ) : null}
          </View>
        </View>
      </Swipeable>
    ) : (
      <View
        style={{
          flexDirection: 'row',
          // justifyContent: 'space-between',
          alignItems: 'flex-start',
          width: window,
          marginTop: 10,
          marginBottom: 10,
          paddingLeft: 12,
          // backgroundColor: 'brown',
        }}>
        {item?.avi_pic ? (
          <Pressable
            onPress={() => onUserPic(item)}
            style={{
              height: 45,
              width: 45,
              borderRadius: 30,
              backgroundColor: '#1f1f1f',
            }}>
            <Image
              style={{
                height: 45,
                width: 45,
                borderRadius: 30,
                backgroundColor: '#1f1f1f',
              }}
              source={item?.avi_pic}
            />
          </Pressable>
        ) : null}
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'flex-start',
            height: '100%',
            maxWidth: window - 80,
            marginHorizontal: 10,
            // backgroundColor: 'green',
            paddingTop: 4,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {item?.username ? (
              <Pressable onPress={() => onUserPic(item)}>
                <Text
                  numberOfLines={1}
                  style={{
                    textAlign: 'left',
                    color: 'white',
                    fontSize: 13,
                    fontWeight: '600',
                  }}>
                  {item?.username}
                </Text>
              </Pressable>
            ) : null}
            {item?.date ? (
              <Text
                style={{
                  color: 'lightgrey',
                  fontSize: 11,
                  fontWeight: '500',
                  marginLeft: 6,
                }}>
                {moment(item?.date).fromNow()}
              </Text>
            ) : null}
          </View>
          {item?.title ? (
            <Text
              style={{
                textAlign: 'left',
                color: 'lightgrey',
                fontSize: 13,
                fontWeight: '500',
                marginTop: 2,
              }}>
              {item?.title}
            </Text>
          ) : null}
        </View>
      </View>
    );

  return (
    <SafeAreaView style={{backgroundColor: '#0C0C0C', flex: 1}}>
      <View style={styles.container}>
        <Pressable onPress={onBack}>
          <View style={styles.back}>
            <Ionicons name="chevron-back" size={25} color={'white'} />
          </View>
        </Pressable>
        <Text style={{fontWeight: '700', fontSize: 15, color: 'white'}}>
          Comments
        </Text>
        <View style={{height: 50, width: 50, justifyContent: 'center'}} />
      </View>
      <FlatList
        data={comments}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        renderItem={_renderItem}></FlatList>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderTopWidth: 0.5,
          borderTopColor: '#1f1f1f',
          paddingHorizontal: 12,
          height: 75,
        }}>
        <View
          style={{
            height: 45,
            width: 45,
            borderRadius: 30,
            backgroundColor: '#1f1f1f',
          }}>
          <Image source={playlistContext?.state.avi_pic} />
        </View>
        <View
          style={{
            height: 45,
            width: 320,
            borderWidth: 1,
            borderRadius: 30,
            borderColor: '#1f1f1f',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignContent: 'center',
            left: 6,
            paddingHorizontal: 12,
          }}>
          <TextInput
            style={{
              color: 'white',
              fontWeight: '500',
              height: 45,
              width: 230,
            }}
            value={title}
            placeholder="Comment..."
            onChangeText={setTitle}></TextInput>
          {title.length > 0 ? (
            <Pressable
              onPress={() => onComment(title)}
              style={{
                height: 45,
                width: 60,
                alignItems: 'flex-end',
                justifyContent: 'center',
                borderRadius: 30,
                left: 12,
              }}>
              <Text style={{color: '#0C8ECE', fontWeight: '500', right: 12}}>
                Post
              </Text>
            </Pressable>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    width: '100%',
    flexDirection: 'row',
    borderBottomColor: '#232323',
    borderBottomWidth: 0.5,
  },
  inboxtext: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
  back: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    paddingLeft: 12,
  },
});

export default CommentsScreen;
