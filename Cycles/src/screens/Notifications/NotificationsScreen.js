import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  SafeAreaView,
  Dimensions,
  Pressable,
} from 'react-native';
import {
  Context as NotifContext,
  Provider as PProvider,
} from '../../context/NotifContext';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Toast from 'react-native-root-toast';
import moment from 'moment';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

const window = Dimensions.get('window').width;

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const notifContext = useContext(NotifContext);
  const [toast, setToast] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const notif = notifContext?.state?.notifications;

  useEffect(() => {
    if (notifContext?.state?.errorMessage) {
      setToast(
        Toast.show(notifContext?.state?.errorMessage, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.CENTER,
          onHidden: () => notifContext?.dispatch({type: 'clear_error_message'}),
        }),
      );
    } else if (toast) {
      Toast.hide(toast);
    }
  }, [notifContext?.state?.errorMessage]);

  //Call to fetch notifications .
  useEffect(() => {
    notifContext?.resetCount();
    notifContext?.getNotifications();
  }, [notifContext?.state?.notifCount]);

  const wait = timeout => {
    // Defined the timeout function for testing purpose
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setLoadingData(true);
    notifContext?.getNotifications();
    loadingData == true ? (
      <View
        style={{
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}>
        <ActivityIndicator color={'white'} size="large" />
      </View>
    ) : null;
    wait(2000).then(() => setIsRefreshing(false), setLoadingData(false));
  };

  const onDelete = item => {
    notifContext?.deleteNotification(item.id);
    notifContext?.getNotifications();
  };

  const rightSwipeActions = item => {
    return (
      <Pressable
        onPress={() => onDelete(item)}
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
          }}>
          Delete
        </Text>
      </Pressable>
    );
  };

  const onNotif = async item => {
    if (item.type === 'comment') {
      navigation.navigate({
        name: 'CommentsScreen',
        params: {item},
      });
    } else if (item.type === 'like') {
      navigation.navigate({
        name: 'Playlist',
        params: {item},
      });
    } else if (item.type === 'follow') {
      navigation.navigate({
        name: 'ProfileScreen',
        params: {item},
      });
    }
  };

  const _renderItem = ({item}) =>
    item ? (
      <Swipeable
        containerStyle={{
          flexDirection: 'row',
          alignItems: 'center',
          width: window,
          paddingVertical: 16,
          justifyContent: 'space-between',
        }}
        renderRightActions={() => rightSwipeActions(item)}>
        <Pressable
          onPress={() => onNotif(item)}
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            width: window,
            justifyContent: 'space-between',
            paddingHorizontal: 12,
          }}>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            {item.avi_pic ? (
              <Pressable
                onPress={() =>
                  navigation.navigate({
                    name: 'ProfileScreen',
                    params: {item},
                  })
                }>
                <Image
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 30,
                    backgroundColor: '#1f1f1f',
                  }}
                  source={{uri: item.avi_pic}}
                />
              </Pressable>
            ) : null}
            <View
              style={{
                marginLeft: 10,
                flexDirection: 'column',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  width: window - 116,
                }}>
                <Text
                  style={{
                    textAlign: 'left',
                    color: 'white',
                    fontSize: 13,
                    fontWeight: '600',
                  }}>
                  {item.username}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    textAlign: 'left',
                    marginLeft: 3,
                    color: 'white',
                    fontSize: 13,
                  }}>
                  {item.body}
                </Text>
              </View>
              <Text
                style={{
                  color: 'lightgrey',
                  fontSize: 12,
                  marginTop: 2,
                }}>
                {moment(item.date).fromNow()}
              </Text>
            </View>
          </View>
          {item?.image ? (
            <View style={{height: 40, width: 40, backgroundColor: '#1f1f1f'}}>
              <Image
                style={{height: 40, width: 40}}
                source={{uri: item.image}}
              />
            </View>
          ) : null}
        </Pressable>
      </Swipeable>
    ) : null;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#0C0C0C'}}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: 50,
          width: window,
          borderBottomColor: '#232323',
          borderBottomWidth: 0.3,
        }}>
        <Text style={{fontWeight: '600', fontSize: 14, color: 'white'}}>
          Notifications
        </Text>
      </View>
      <FlatList
        data={notif}
        renderItem={_renderItem}
        refreshing={isRefreshing}
        onRefresh={onRefresh}></FlatList>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0C0C0C',
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: '#232323',
    borderBottomWidth: 0.4,
  },
  inboxtext: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
});

export default NotificationsScreen;
