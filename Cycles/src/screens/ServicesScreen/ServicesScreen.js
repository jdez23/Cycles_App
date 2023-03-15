import React, {useContext, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Linking,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import Toast from 'react-native-root-toast';
import {Context as AuthContext} from '../../context/AuthContext';
import {TouchableOpacity} from 'react-native-gesture-handler';

const ServicesScreen = () => {
  const authContext = useContext(AuthContext);
  const navigation = useNavigation();
  const [toast, setToast] = React.useState(null);
  const onBack = () => {
    navigation.goBack();
  };

  // Check if Spotify is authenticated
  useEffect(() => {
    authContext?.isSpotifyAuth();
  }, [authContext?.state.spotifyAuth]);

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

  return (
    <SafeAreaView
      style={StyleSheet.create({backgroundColor: '#0C0C0C', flex: 1})}>
      <View style={styles.container}>
        <Pressable onPress={onBack}>
          <View
            style={{
              height: 50,
              width: 50,
              justifyContent: 'center',
              paddingLeft: 6,
            }}>
            <Ionicons name="chevron-back" size={25} color={'white'} />
          </View>
        </Pressable>
        <Text style={styles.textUser}>Services</Text>
        <View style={{height: 50, width: 50}} />
      </View>
      <View style={{paddingHorizontal: 12}}>
        <TouchableOpacity
          onPress={() =>
            authContext?.state?.spotifyAuth === 'true'
              ? authContext?.spotifyLogout()
              : authContext?.authSpotify()
          }
          style={{paddingTop: 12}}>
          <View
            style={{
              justifyContent: 'space-between',
              height: 40,
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomColor: '#262626',
            }}>
            <Text style={{fontSize: 14, color: 'white'}}>
              {authContext.state?.spotifyAuth === 'true'
                ? 'Disconnect Spotify'
                : 'Connect Spotify'}
            </Text>
            <Octicons
              name="dot-fill"
              color={
                authContext.state?.spotifyAuth === 'true' ? 'lightgreen' : 'red'
              }
              size={12}
            />
          </View>
        </TouchableOpacity>
      </View>
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
    borderBottomWidth: 0.3,
    borderBottomColor: '#252525',
  },
  textUser: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
});

export default ServicesScreen;
