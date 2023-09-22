import React, {useState, useContext, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Context as AuthContext} from '../../context/AuthContext';
import Toast from 'react-native-root-toast';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-crop-picker';

const OnBoardScreen = () => {
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);
  const token = authContext.state.token;
  const [new_avi_pic, setAviPic] = useState('');
  const [user_name, setUsername] = useState('');
  const [toast, setToast] = useState(null);
  let usernameInput = useRef(null);
  const inputLength = 30;
  const continueDisabled = new_avi_pic === '' || user_name.length < 4;
  const data = {avi_pic: new_avi_pic, token: token, user_name: user_name};

  //Pick avi image
  const pickAviImage = () => {
    ImagePicker.openPicker({
      multiple: false,
      cropping: true,
    })
      .then(avi_image => {
        setAviPic(avi_image.path);
      })
      .catch(() => null);
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

  useEffect(() => {
    usernameInput.current.focus();
  }, []);

  const completeProfile = () => {
    authContext?.completeSignUp(data).then(res => {
      if (res === true) {
        navigation.navigate({
          name: 'BottomBar',
        });
      }
    });
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.mainView}>
        <Text style={styles.text}>Complete your profile</Text>
        <View style={styles.form_container}>
          <Pressable onPress={pickAviImage} style={styles.avi_box}>
            {new_avi_pic ? (
              <View>
                <Image style={styles.avi} source={{uri: new_avi_pic}} />
              </View>
            ) : (
              <View style={styles.no_avi}>
                <Icon
                  name="camera"
                  size={12}
                  color={'grey'}
                  style={{alignSelf: 'center'}}
                />
              </View>
            )}
          </Pressable>
          <Text style={styles.avi_text}>Upload profile image</Text>
          <View
            style={{
              backgroundColor: '#1f1f1f',
              width: 350,
              height: 45,
              borderRadius: 10,
              fontSize: 14,
              justifyContent: 'center',
            }}>
            <TextInput
              ref={usernameInput}
              selectionColor={'white'}
              maxLength={inputLength}
              style={{color: 'white', left: 12}}
              placeholderTextColor={'lightgrey'}
              value={user_name}
              placeholder="Username:"
              clearTextOnFocus={true}
              onChangeText={setUsername}
            />
          </View>
          {authContext?.state?.username_error ? (
            <Text
              style={{
                fontSize: 13,
                color: 'red',
                top: 4,
                alignSelf: 'flex-start',
              }}>
              {authContext?.state?.username_error}
            </Text>
          ) : null}
        </View>
        <View style={{marginTop: 16}}>
          <TouchableOpacity
            disabled={continueDisabled}
            onPress={() => completeProfile()}
            style={
              continueDisabled
                ? styles.continue_botton_disabled
                : styles.button_container
            }>
            <Text style={styles.button_text}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#0c0c0c',
    flex: 1,
  },
  mainView: {
    marginTop: 30,
    alignItems: 'center',
  },
  form_container: {
    alignItems: 'center',
    marginTop: 30,
  },
  avi_text: {
    marginBottom: 20,
    marginTop: 14,
    color: 'white',
    fontWeight: '600',
  },
  text: {
    fontSize: 20,
    color: 'white',
    fontWeight: '600',
  },
  avi_box: {
    height: 128,
    width: 128,
    borderRadius: 70,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#1f1f1f',
  },
  no_avi: {
    backgroundColor: '#232323',
    height: 120,
    width: 120,
    borderRadius: 70,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  avi: {
    height: 120,
    width: 120,
    borderRadius: 60,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  button_container: {
    backgroundColor: '#32D74B',
    width: 350,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  continue_botton_disabled: {
    backgroundColor: '#1f1f1f',
    width: 350,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  button_text: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default OnBoardScreen;
