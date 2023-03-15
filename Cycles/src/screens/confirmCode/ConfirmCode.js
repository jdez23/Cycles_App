import React, {useContext, useState, useRef, useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text, View, Pressable} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-root-toast';
// import CodeInput from 'react-native-confirmation-code-input';
import {Context as AuthContext} from '../../context/AuthContext';
import {useNavigation} from '@react-navigation/native';

const ConfirmCode = data => {
  const window = Dimensions.get('window').width;
  const number = data.route.params;
  const [toast, setToast] = useState(null);
  let codeInput = useRef(null);
  const inputLength = 6;
  const navigation = useNavigation();
  const [code, setCode] = useState('');
  const authContext = useContext(AuthContext);
  const confirmation = authContext?.state.confirmNumber;
  // console.log(state.confirmation);
  const onBack = () => {
    navigation.goBack();
  };
  const onConfirmNumber = () => {
    authContext?.confirmNumber({
      params: {
        code: code,
        confirmation: confirmation,
      },
    });
  };

  useEffect(() => {
    if (authContext?.state?.errorMessage) {
      setToast(
        Toast.show(authContext?.state?.errorMessage, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.TOP,
          onHidden: () => authContext?.dispatch({type: 'clear_error_message'}),
        }),
      );
    } else if (toast) {
      Toast.hide(toast);
    }
  }, [authContext?.state?.errorMessage]);

  useEffect(() => {
    codeInput.current.focus();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          justifyContent: 'center',
          height: 50,
          width: window,
          borderBottomColor: '#232323',
          borderBottomWidth: 0.5,
        }}>
        <Pressable onPress={onBack}>
          <View
            style={{
              height: 40,
              width: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Ionicons name="chevron-back" size={25} color={'white'} />
          </View>
        </Pressable>
      </View>
      <View style={styles.body}>
        <View>
          <Text style={styles.text}>Enter 6-digit code</Text>
          <Text style={styles.text2}>
            Enter the code we just sent to your mobile number.
          </Text>
        </View>
        <View>
          <TextInput
            ref={codeInput}
            value={code}
            maxLength={inputLength}
            returnKeyType="done"
            keyboardType="phone-pad"
            style={{
              width: 0,
              height: 0,
            }}
            onChangeText={code => {
              setCode(code);
            }}
          />
          <View style={styles.numContainer}>
            {Array(inputLength)
              .fill()
              .map((data, index) => (
                <View key={index} style={styles.cellView}>
                  <Text
                    style={styles.cellText}
                    onPress={() => codeInput.current.focus()}>
                    {code && code.length > 0 ? code[index] : ''}
                  </Text>
                </View>
              ))}
          </View>
        </View>
        {code.length === 6 ? (
          <Pressable onPress={() => onConfirmNumber()}>
            <View style={styles.continueBox}>
              <Text style={styles.continueText}>Continue</Text>
            </View>
          </Pressable>
        ) : (
          <Pressable>
            <View style={styles.continueBoxEmpty}>
              <Text style={styles.continueText}>Continue</Text>
            </View>
          </Pressable>
        )}
        <Pressable onPress={() => authContext?.signInWithPhone(number)}>
          <Text style={{color: 'white'}}>Resend code</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151515',
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  text2: {
    color: 'lightgrey',
    fontSize: 12,
    fontWeight: '500',
    paddingTop: 8,
  },
  body: {
    // paddingTop: 12,
    height: 300,
    // backgroundColor: 'brown',
    justifyContent: 'space-evenly',
    paddingHorizontal: 24,
  },
  numContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // backgroundColor: 'yellow',
    height: 40,
  },
  cellView: {
    marginRight: 14,
    borderColor: 'grey',
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    // backgroundColor: 'green',
    height: 40,
  },
  cellText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
  },
  continueBox: {
    backgroundColor: '#E04326',
    width: 350,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  continueBoxEmpty: {
    backgroundColor: '#1f1f1f',
    width: 350,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  continueText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ConfirmCode;
