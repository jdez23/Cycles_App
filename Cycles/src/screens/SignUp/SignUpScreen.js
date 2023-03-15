import React, {useContext} from 'react';
import {View, StyleSheet, Text, Image, Pressable} from 'react-native';

import cycleshuman from '../../../assets/logos/cycleshuman.svg';
import {useNavigation} from '@react-navigation/native';
import {useForm} from 'react-hook-form';

import CustomInput from '../../components/CustomInput/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';

import {Context as AuthContext} from '../../context/AuthContext';

const EMAIL_REGEX = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;

const SignUp = () => {
  const {signup} = useContext(AuthContext);
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm();
  const pwd = watch('password1');

  const onTOSPressed = () => {
    console.warn('TOS');
  };

  const onSignInScreenPressed = () => {
    navigation.navigate('SignIn');
  };

  return (
    <View style={styles.root}>
      <Text style={styles.text}>cycles</Text>
      <Image source={cycleshuman} style={styles.logo} resizeMode="contain" />
      <CustomInput
        name="username"
        placeholder="username:"
        control={control}
        rules={{
          required: 'username is required',
          minLength: {
            value: 4,
            message: 'username should be minimum of 4 characters.',
          },
          maxLength: {
            value: 23,
            message: 'username should not be more than 23 characters.',
          },
        }}
      />
      <CustomInput
        name="email"
        placeholder="email:"
        control={control}
        rules={{
          required: 'email is required',
          pattern: {EMAIL_REGEX, message: 'Invalid email'},
        }}
      />
      <CustomInput
        name="password1"
        placeholder="password:"
        secureTextEntry={true}
        control={control}
        rules={{
          required: 'password is required',
          minLength: {
            value: 8,
            message: 'password must be at least 8 characters long.',
          },
          maxLength: {
            value: 24,
            message: 'password must be no longer than 24 characters.',
          },
        }}
      />
      <CustomInput
        name="password2"
        placeholder="confirm password:"
        secureTextEntry={true}
        control={control}
        rules={{
          required: 'confirm password is required',
          minLength: {
            value: 8,
            message: 'password must be at least 8 characters long.',
          },
          maxLength: {
            value: 24,
            message: 'password must be no longer than 24 characters.',
          },
          validate: value => value == pwd || 'passwords do not match',
        }}
      />
      <CustomButton onPress={handleSubmit(signup)} />

      <Pressable onPress={onTOSPressed}>
        <Text style={styles.tos}>
          By creating an account you agree to our{'\n'}
          Terms of Service and Privacy Policy{' '}
        </Text>
      </Pressable>

      <Pressable onPress={onSignInScreenPressed}>
        <Text style={styles.signin}>already have an account? sign in </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#151515',
  },
  logo: {
    maxWidth: 25,
    maxHeight: 25,
    marginTop: 30,
    tintColor: '#333333',
  },
  text: {
    marginTop: 80,
    fontSize: 38,
    fontFamily: 'futura',
    fontWeight: 'bold',
    color: 'white',
  },
  signin: {
    paddingTop: 175,
    fontFamily: 'futura',
    color: '#D3D3D3',
    fontSize: 12,
  },
  tos: {
    marginTop: 20,
    fontFamily: 'futura',
    color: '#D3D3D3',
    fontSize: 11,
    flexWrap: 'wrap',
    textAlign: 'center',
  },
});

export default SignUp;
