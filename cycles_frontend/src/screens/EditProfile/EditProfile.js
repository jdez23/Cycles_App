import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  SafeAreaView,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import Toast from 'react-native-root-toast';
import RNSInfo from 'react-native-sensitive-info';
import {Context as AuthContext} from '../../context/AuthContext';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import envs from '../../../Config/env';

const BACKEND_URL = envs.PROD_URL;

const window = Dimensions.get('window').width;

const EditProfile = ({route}) => {
  const data = route.params?.profile_data;
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [new_header_pic, setHeaderPic] = useState(data?.header_pic);
  const [new_avi_pic, setAviPic] = useState(data?.avi_pic);
  const [new_name, setName] = useState(data?.name);
  const [new_username, setUsername] = useState(data?.username);
  const [new_location, setLocation] = useState(data?.location);
  const [new_bio, setBio] = useState(data?.bio);
  const [new_spotify_url, setSpotifyLink] = useState(data?.spotify_url);
  const [toast, setToast] = useState(null);
  const navigation = useNavigation();
  const getToken = async () => await RNSInfo.getItem('token', {});
  const getCurrentUser = async () => await RNSInfo.getItem('user_id', {});

  const onBack = () => {
    navigation.goBack();
  };

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

  //Pick header image
  const pickHeaderImage = () => {
    try {
      ImagePicker.openPicker({
        multiple: false,
        mediaType: 'photo',
      })
        .then(header_image => {
          ImagePicker.openCropper({
            path: header_image.path,
            width: window,
            height: 200,
            compressImageQuality: 1,
            compressImageMaxHeight: 200,
            compressImageMaxWidth: window,
            cropping: true,
          })
            .then(image => {
              setHeaderPic(image.path);
            })
            .catch(() => null);
        })
        .catch(() => null);
    } catch {
      null;
    }
  };

  //Pick avi image
  const pickAviImage = () => {
    try {
      ImagePicker.openPicker({
        multiple: false,
        mediaType: 'photo',
      })
        .then(avi_image => {
          ImagePicker.openCropper({
            cropperCircleOverlay: true,
            path: avi_image.path,
            width: 70,
            height: 70,
            compressImageQuality: true,
          }).then(image => {
            setAviPic(image.path);
          });
        })
        .catch(() => null);
    } catch {
      null;
    }
  };

  //Update Profile to API
  const updateProfile = async () => {
    setLoading(true);
    const currentUser = await getCurrentUser();
    const token = await getToken();
    const formData = new FormData();
    new_header_pic != null
      ? formData.append('header_pic', {
          uri: new_header_pic,
          type: 'image/jpeg',
          name: new_header_pic,
        })
      : null;
    formData.append('avi_pic', {
      uri: new_avi_pic,
      type: 'image/jpeg',
      name: new_avi_pic,
    });
    formData.append('name', new_name);
    formData.append('username', new_username);
    formData.append('location', new_location);
    formData.append('bio', new_bio);
    formData.append('spotify_url', new_spotify_url);
    try {
      const res = await axios.put(
        `${BACKEND_URL}/users/user/${currentUser}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: token,
          },
        },
      );
      if (res.status === 200) {
        setLoading(false);
        navigation.navigate('MyProfile');
      }
    } catch (e) {
      authContext?.dispatch({
        type: 'error_1',
        payload: 'Something went wrong. Please try again.',
      });
    }
    setLoading(false);
  };

  return (
    <SafeAreaView
      style={StyleSheet.create({backgroundColor: 'black', flex: 1})}>
      <View style={styles.container}>
        <TouchableOpacity onPress={onBack}>
          <View
            style={{
              height: 50,
              width: 70,
              justifyContent: 'center',
            }}>
            <Text style={styles.canceltext}>Cancel</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.textUser}>Edit Profile</Text>
        <TouchableOpacity onPress={() => updateProfile()}>
          <View
            style={{
              height: 50,
              width: 70,
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}>
            <Text
              style={{
                color: '#0C8ECE',
                fontWeight: '500',
                fontSize: 14,
                paddingRight: 12,
              }}>
              Save
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <KeyboardAwareScrollView>
        <Pressable onPress={pickHeaderImage}>
          {new_header_pic ? (
            <View
              style={{height: 200, width: window, backgroundColor: '#1f1f1f'}}>
              <Image
                style={{
                  height: 200,
                  width: window,
                  backgroundColor: '#1f1f1f',
                }}
                source={{uri: new_header_pic}}
              />
              <View
                style={{
                  backgroundColor: 'black',
                  height: 40,
                  width: 40,
                  borderRadius: 30,
                  alignSelf: 'center',
                  bottom: 110,
                  justifyContent: 'center',
                }}>
                <Icon
                  name="camera"
                  size={8}
                  color={'grey'}
                  style={{alignSelf: 'center'}}
                />
              </View>
            </View>
          ) : (
            <View
              style={{
                backgroundColor: '#1f1f1f',
                height: 200,
                width: window,
                justifyContent: 'center',
              }}>
              <View
                style={{
                  backgroundColor: 'black',
                  height: 40,
                  width: 40,
                  borderRadius: 30,
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}>
                <Icon
                  name="camera"
                  size={8}
                  color={'grey'}
                  style={{alignSelf: 'center'}}
                />
              </View>
            </View>
          )}
        </Pressable>
        <View
          borderBottomWidth={0.5}
          borderBottomColor={'#1f1f1f'}
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            width: window,
          }}
          bottom={15}>
          <Pressable
            onPress={pickAviImage}
            style={{
              height: 94,
              width: 94,
              borderRadius: 50,
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              bottom: 15,
            }}>
            {new_avi_pic ? (
              <View
                style={{
                  height: 94,
                  width: 94,
                  borderRadius: 50,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'black',
                }}>
                <Image
                  style={{
                    height: 90,
                    width: 90,
                    borderRadius: 50,
                    backgroundColor: '#1f1f1f',
                  }}
                  source={{uri: new_avi_pic}}
                />
              </View>
            ) : (
              <View
                style={{
                  height: 94,
                  width: 94,
                  borderRadius: 50,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'black',
                }}>
                <View
                  style={{
                    backgroundColor: '#1f1f1f',
                    height: 90,
                    width: 90,
                    borderRadius: 50,
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}>
                  <Icon
                    name="camera"
                    size={8}
                    color={'grey'}
                    style={{alignSelf: 'center'}}
                  />
                </View>
              </View>
            )}
          </Pressable>
        </View>
        <View style={{paddingHorizontal: 12, bottom: 13}}>
          <View
            style={{
              borderBottomWidth: 0.5,
              borderBottomColor: '#1f1f1f',
              height: 60,
              justifyContent: 'flex-start',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                fontWeight: '500',
                fontSize: 14,
                width: 80,
                marginRight: 50,
              }}>
              Name:
            </Text>
            <TextInput
              style={{
                color: 'white',
                fontSize: 14,
                width: 200,
              }}
              numberOfLines={1}
              value={new_name === 'null' ? null : new_name}
              onChangeText={setName}
              placeholder={'Name'}
              placeholderTextColor={'grey'}></TextInput>
          </View>
          <View
            style={{
              borderBottomWidth: 0.5,
              borderBottomColor: '#1f1f1f',
              height: 60,
              justifyContent: 'flex-start',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                fontWeight: '500',
                fontSize: 14,
                width: 80,
                marginRight: 50,
              }}>
              Username:
            </Text>
            <TextInput
              style={{color: 'white', fontSize: 14, width: 200}}
              value={new_username === 'null' ? null : new_username}
              numberOfLines={1}
              onChangeText={setUsername}
              placeholder={'Username'}
              placeholderTextColor={'grey'}></TextInput>
          </View>
          <View
            style={{
              borderBottomWidth: 0.5,
              borderBottomColor: '#1f1f1f',
              height: 60,
              justifyContent: 'flex-start',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                fontWeight: '500',
                fontSize: 14,
                width: 80,
                marginRight: 50,
              }}>
              Location:
            </Text>
            <TextInput
              style={{color: 'white', fontSize: 14, width: 200}}
              value={new_location === 'null' ? null : new_location}
              numberOfLines={1}
              onChangeText={setLocation}
              placeholder={'Location'}
              placeholderTextColor={'grey'}></TextInput>
          </View>
          <View
            style={{
              borderBottomWidth: 0.5,
              borderBottomColor: '#1f1f1f',
              height: 60,
              justifyContent: 'flex-start',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                fontWeight: '500',
                fontSize: 14,
                width: 80,
                marginRight: 50,
              }}>
              Bio:
            </Text>
            <TextInput
              style={{color: 'white', fontSize: 14, width: 200}}
              value={new_bio === 'null' ? null : new_bio}
              onChangeText={setBio}
              numberOfLines={1}
              placeholder={'Bio'}
              placeholderTextColor={'grey'}></TextInput>
          </View>
          <View
            style={{
              borderBottomWidth: 0.5,
              borderBottomColor: '#1f1f1f',
              height: 60,
              justifyContent: 'flex-start',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                fontWeight: '500',
                fontSize: 14,
                width: 80,
                marginRight: 50,
              }}>
              Spotify Link:
            </Text>
            <TextInput
              style={{
                color: 'white',
                fontSize: 14,
                width: 235,
              }}
              value={new_spotify_url === 'null' ? null : new_spotify_url}
              onChangeText={setSpotifyLink}
              placeholder={'Spotify link'}
              numberOfLines={1}
              placeholderTextColor={'grey'}></TextInput>
          </View>
        </View>
      </KeyboardAwareScrollView>
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
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textUser: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    paddingHorizontal: 12,
  },
  canceltext: {
    fontSize: 14,
    fontWeight: '600',
    color: 'lightgrey',
    paddingLeft: 12,
  },
});

export default EditProfile;
