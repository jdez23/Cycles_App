import React, {useContext, useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Image,
  Text,
  View,
  Pressable,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Context as AuthContext} from '../../context/AuthContext';
import PhoneInput from 'react-native-phone-number-input';
import Toast from 'react-native-root-toast';
import google_logo from '/Users/jessehernandez/Cycles_App/Cycles/assets/logos/google_logo.png';
import apple_logo from '/Users/jessehernandez/Cycles_App/Cycles/assets/logos/apple_logo.png';
import cycleshuman_1 from '/Users/jessehernandez/Cycles_App/Cycles/assets/logos/cycles_human.png';

const SignIn = () => {
  const navigation = useNavigation();
  const [number, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [country, setCountryCode] = useState('');
  const authContext = useContext(AuthContext);
  const [toast, setToast] = useState(null);

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
    authContext?.state?.token
      ? navigation.navigate({
          name: 'OnBoardScreen',
          params: authContext?.state?.token,
        })
      : null;
  }, [authContext?.state?.token]);

  const logInGoogle = () => {
    setLoading(true);
    authContext?.onGoogleButtonPress();
  };

  const logInApple = () => {
    setLoading(true);
    authContext?.onAppleButtonPress();
  };

  // const onComplete = () => {
  //   navigation.navigate({
  //     name: 'OnBoardScreen',
  //     params: authContext?.state?.token,
  //   });
  // };

  const onContinue = () => {
    console.log('pressed');
    navigation.navigate({
      name: 'ConfirmCode',
      params: `${country}${number}`,
    });
    authContext?.signInWithPhone(`${country}${number}`);
  };

  return (
    <SafeAreaView style={styles.root}>
      <View
        style={{
          top: 60,
          alignItems: 'center',
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-evenly',
            height: 340,
          }}>
          <Text style={styles.text}>cycles</Text>
          <Image
            source={cycleshuman_1}
            style={styles.logo}
            resizeMode="contain"
          />
          <View
            style={{
              width: 350,
              alignItems: 'center',
            }}>
            <View style={{alignItems: 'center'}}>
              <PhoneInput
                clearTextOnFocus={true}
                placeholder="Phone number"
                textInputProps={styles.numberInputProps}
                containerStyle={{
                  height: 50,
                  width: 350,
                  borderRadius: 10,
                  backgroundColor: '#333132',
                }}
                textInputStyle={{color: 'white'}}
                textContainerStyle={{
                  backgroundColor: '#1f1f1f',
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                }}
                codeTextStyle={{color: 'white'}}
                disableArrowIcon
                defaultValue={number}
                defaultCode="US"
                layout="second"
                onChange={text => {
                  setValue({mobile: text.replace(/[^0-9]/g, '')});
                }}
                onChangeFormattedText={text => {
                  setCountryCode(text);
                }}
                autoFocus
              />
            </View>
            <Text style={styles.smallPrint}>
              We'll send you a text to confirm your number.
            </Text>
            {/* <Pressable onPress={() => onContinue()}>
              <View style={styles.continueBox}>
                <Text style={styles.continueText}>Continue</Text>
              </View>
            </Pressable> */}
            {number ? (
              <Pressable onPress={() => onContinue()}>
                <View style={styles.continueBoxEmpty}>
                  <Text style={styles.continueText}>Continue</Text>
                </View>
              </Pressable>
            ) : (
              <Pressable>
                <View style={styles.continueBox}>
                  <Text style={styles.continueText}>Continue</Text>
                </View>
              </Pressable>
            )}
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: 350,
          }}>
          <View style={{flex: 1, height: 0.3, backgroundColor: 'lightgrey'}} />
          <View>
            <Text
              style={{
                color: 'white',
                fontWeight: 'bold',
                width: 50,
                textAlign: 'center',
              }}>
              or
            </Text>
          </View>
          <View style={{flex: 1, height: 0.3, backgroundColor: 'lightgrey'}} />
        </View>
        <View
          style={{
            top: 30,
          }}>
          <Pressable onPress={() => logInGoogle()}>
            <View style={styles.googleButton}>
              <Image
                source={google_logo}
                style={{
                  height: 20,
                  width: 20,
                  right: 8,
                }}
              />
              <Text style={styles.signup}>Continue with Google</Text>
            </View>
          </Pressable>
          <Pressable onPress={() => logInApple()}>
            <View style={styles.appleButton}>
              <Image
                source={apple_logo}
                style={{
                  height: 15,
                  width: 15,
                  right: 9,
                }}
              />
              <Text style={styles.signup}>Continue with Apple</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    backgroundColor: '#0C0C0C',
    flex: 1,
  },
  logo: {
    maxWidth: 30,
    maxHeight: 25,
    tintColor: '#333333',
  },
  text: {
    fontSize: 38,
    fontFamily: 'futura',
    fontWeight: 'bold',
    color: 'white',
  },
  signup: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  smallPrint: {
    fontSize: 12,
    paddingVertical: 16,
    color: 'white',
    fontWeight: '400',
    alignSelf: 'flex-start',
  },
  numberInputProps: {
    clearTextOnFocus: true,
    cursorColor: 'white',
    placeholderTextColor: 'grey',
    selectionColor: 'white',
    textContentType: 'telephoneNumber',
    keyboardType: 'phone-pad',
    returnKeyType: 'done',
    height: 50,
  },
  googleButton: {
    backgroundColor: '#1f1f1f',
    width: 350,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    flexDirection: 'row',
  },
  appleButton: {
    backgroundColor: '#1f1f1f',
    width: 350,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    top: 20,
    flexDirection: 'row',
  },
  continueText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  continueBox: {
    backgroundColor: '#E04326',
    width: 350,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  continueBoxEmpty: {
    backgroundColor: '#1f1f1f',
    width: 350,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
});

export default SignIn;
