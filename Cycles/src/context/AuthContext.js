import {Linking} from 'react-native';
import RNSInfo from 'react-native-sensitive-info';
import axios from 'axios';
import {firebase} from '@react-native-firebase/auth';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import context from './context';
import envs from '../../Config/env';

const BACKEND_URL = envs.DEV_URL;
console.log(BACKEND_URL);
// export const ngrokURL = BACKEND_URL;

// Get Token from storage
const getToken = async () => await RNSInfo.getItem('token', {});

const defaultValue = {
  user: 'false',
  token: '',
  username: '',
  user_id: '',
  spotifyAuth: 'false',
  errorMessage: '',
  username_error: '',
  confirmation: '',
  code: '',
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'error_1':
      return {
        ...state,
        errorMessage: action.payload,
      };
    case 'clear_error_message':
      return {
        ...state,
        errorMessage: '',
      };
    case 'username_error':
      return {
        ...state,
        username_error: action.username_error,
      };
    case 'confirmation':
      return {
        errorMessage: '',
        confirmation: action.payload,
      };
    case 'code':
      return {
        ...state,
        errorMessage: '',
        code: action.payload,
      };
    case 'signin':
      return {
        ...state,
        token: action.token,
        username: action.username,
        user_id: action.user_id,
        user: action.user,
      };
    case 'signout':
      return {
        ...state,
        token: null,
        username: null,
        user_id: null,
        user: 'false',
      };
    case 'spotifyAuth':
      return {
        ...state,
        spotifyAuth: action.payload,
      };
    case 'notifications':
      return {
        notifications: action.payload,
      };
    case 'currentUser':
      return {
        ...state,
        user_id: action.user_id,
      };
    default:
      return state;
  }
};

const tryLocalStorage = dispatch => async () => {
  const token = await RNSInfo.getItem('token', {});
  const username = await RNSInfo.getItem('username', {});
  const user = await RNSInfo.getItem('user', {});
  if ((token, username, user)) {
    dispatch({
      type: 'signin',
      token: token,
      username: username,
      user: user,
    });
  }
};

const getCurrentUser = dispatch => async () => {
  const user = await RNSInfo.getItem('user_id', {});
  if (user) {
    dispatch({
      type: 'currentUser',
      user_id: user,
    });
    return user;
  }
};

// RNSInfo.deleteItem('token', {});
// RNSInfo.deleteItem('user_id', {});
// RNSInfo.deleteItem('username', {});
// RNSInfo.deleteItem('user', {});
// RNSInfo.deleteItem('fcmToken', {});

const completeSignUp = dispatch => async data => {
  const formData = new FormData();
  const token = data.token;
  const username = data.user_name;
  formData.append('avi_pic', {
    uri: data.avi_pic,
    type: 'image/jpeg',
    name: data.avi_pic,
  });
  formData.append('username', username.toLowerCase());
  try {
    const res = await axios.post(`${BACKEND_URL}/users/register/`, formData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    if (res.status === 201) {
      const response = res.data;
      RNSInfo.setItem('username', response?.username, {});
      RNSInfo.setItem('user_id', JSON.stringify(response?.id), {});
      RNSInfo.setItem('token', response?.firebase_id, {});
      RNSInfo.setItem('user', 'true', {});
      dispatch({
        type: 'signin',
        token: response?.firebase_id,
        user_id: JSON.stringify(response?.id),
        username: response?.username,
        user: 'true',
      });
    }
  } catch (error) {
    if (error.response.status === 400) {
      dispatch({
        type: 'username_error',
        username_error: 'Username is already taken.',
      });
    } else {
      dispatch({
        type: 'error_1',
        payload: 'Something went wrong. Please try again.',
      });
    }
  }
};

const login = dispatch => async token => {
  try {
    const res = await axios.get(`${BACKEND_URL}/users/login/`, {
      params: {
        token: token,
      },
    });
    const data = res.data.data;
    if (data == 'None') {
      dispatch({
        type: 'signin',
        user: 'false',
        token: token,
        user_id: '',
        username: '',
      });
    } else {
      RNSInfo.setItem('token', data.firebase_id, {});
      RNSInfo.setItem('user_id', data.id.toString(), {});
      RNSInfo.setItem('username', data.username, {});
      RNSInfo.setItem('user', 'true', {});
      dispatch({
        type: 'signin',
        token: data.firebase_id,
        user_id: data.id.toString(),
        username: data.username,
        user: 'true',
      });
    }
  } catch (err) {
    dispatch({
      type: 'error_1',
      payload: 'Something went wrong. Please try again.',
    });
  }
};

const onAppleButtonPress = dispatch => async () => {
  try {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    const {identityToken, nonce} = appleAuthRequestResponse;
    if (identityToken) {
      const appleCredential = firebase.auth.AppleAuthProvider.credential(
        identityToken,
        nonce,
      );
      //     in this example `signInWithCredential` is used, but you could also call `linkWithCredential`
      //     to link the account to an existing user
      const userCredential = await firebase
        .auth()
        .signInWithCredential(appleCredential);
      const token = userCredential.user.uid;
      login(dispatch)(token);
    }
  } catch (err) {
    null;
  }
};

const onGoogleButtonPress = dispatch => async () => {
  try {
    GoogleSignin.configure({
      loginHint: '',
      webClientId: envs.WEB_CLIENT_ID,
      iosClientId: envs.IOS_CLIENT_ID,
    });
    const {idToken} = await GoogleSignin.signIn();
    const googleCredential =
      firebase.auth.GoogleAuthProvider.credential(idToken);
    const userCredential = await firebase
      .auth()
      .signInWithCredential(googleCredential);
    const token = userCredential.user.uid;
    login(dispatch)(token);
  } catch (err) {
    null;
  }
};

const signInWithPhone = dispatch => async number => {
  try {
    const response = await firebase.auth().signInWithPhoneNumber(number);
    const confirmationNum = response.verificationId;
    dispatch({type: 'confirmation', payload: confirmationNum});
  } catch (err) {
    dispatch({
      type: 'error_1',
      payload: 'Something went wrong. Please try again.',
    });
  }
};

const confirmNumber = dispatch => async data => {
  console.log('confirmation:', data.params.confirmation);
  const code = data.params.code;
  const confirmationa = data.params.confirmation;
  try {
    confirmationa &&
      (await confirmationa.confirm(code).then(res => {
        console.log('------------', res.data);
      }));
  } catch (err) {
    dispatch({
      type: 'error_1',
      payload: 'Something went wrong. Please try again.',
    });
  }
};

const signout = dispatch => async () => {
  const token = await getToken();
  try {
    await axios.delete(`${BACKEND_URL}/notifications/fcmToken/`, {
      headers: {
        Authorization: token,
      },
    });
    RNSInfo.deleteItem('token', {});
    RNSInfo.deleteItem('user_id', {});
    RNSInfo.deleteItem('username', {});
    RNSInfo.deleteItem('user', {});
    RNSInfo.deleteItem('fcmToken', {});
    dispatch({
      type: 'signout',
      token: null,
      user_id: null,
      username: null,
      user: 'false',
    });
  } catch (err) {
    dispatch({
      type: 'error_1',
      payload: 'Something went wrong. Please try again.',
    });
  }
};

const deleteAccount = dispatch => async user_id => {
  const token = await getToken();
  try {
    await axios
      .delete(`${BACKEND_URL}/users/user/` + user_id + '/', {
        headers: {
          Authorization: token,
        },
      })
      .then(res => {
        if (res.status === 204) {
          RNSInfo.deleteItem('token', {});
          RNSInfo.deleteItem('user_id', {});
          RNSInfo.deleteItem('username', {});
          RNSInfo.deleteItem('user', {});
          RNSInfo.deleteItem('fcmToken', {});
          dispatch({
            type: 'signout',
            token: null,
            user_id: null,
            username: null,
            user: 'false',
          });
        }
      });
  } catch (err) {
    dispatch({
      type: 'error_1',
      payload: 'Something went wrong. Please try again.',
    });
  }
};

// Check if Spotify is authenticated
const isSpotifyAuth = dispatch => async () => {
  const token = await RNSInfo.getItem('token', {});
  try {
    const isAuth = await axios.get(`${BACKEND_URL}/spotify_api/token/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    console.log(isAuth.data);
    dispatch({type: 'spotifyAuth', payload: JSON.stringify(isAuth.data)});
    return JSON.stringify(isAuth.data);
  } catch (e) {
    console.log(e);
  }
};

// Authenticate Spotify
const authSpotify = dispatch => async () => {
  const userToken = await RNSInfo.getItem('token', {});
  try {
    axios
      .get(`${BACKEND_URL}/spotify_api/get-auth-url/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: userToken,
        },
      })
      .then(res => {
        let url = JSON.stringify(res.data);
        Linking.openURL(JSON.parse(url));
      });
  } catch (err) {
    dispatch({
      type: 'error_1',
      payload: 'Something went wrong. Please try again.',
    });
  }
};

//Spotify Callback
const spotifyCallback = dispatch => async code => {
  const token = await RNSInfo.getItem('token', {});
  try {
    const tokenresponse = await axios.post(
      `${BACKEND_URL}/spotify_api/token-request/`,
      {code: code},
      {
        headers: {
          Authorization: token,
        },
      },
    );
    return tokenresponse.data;
  } catch (e) {
    dispatch({
      type: 'error_1',
      payload: 'Something went wrong. Please try again.',
    });
  }
};

const spotifyLogin = dispatch => async data => {
  const userToken = await RNSInfo.getItem('token', {});
  try {
    const res = await axios.post(
      `${BACKEND_URL}/spotify_api/spotify_login/`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: userToken,
        },
      },
    );
    dispatch({type: 'spotifyAuth', payload: res.data});
    return res.data;
  } catch (err) {
    dispatch({
      type: 'error_1',
      payload: 'Something went wrong. Please try again.',
    });
  }
};

const spotifyLogout = dispatch => async () => {
  const userToken = await RNSInfo.getItem('token', {});
  try {
    await axios
      .delete(`${BACKEND_URL}/spotify_api/spotify_logout/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: userToken,
        },
      })
      .then(res => {
        dispatch({type: 'spotifyAuth', payload: res.data});
      });
  } catch (err) {
    dispatch({
      type: 'error_1',
      payload: 'Something went wrong. Please try again.',
    });
  }
};

export const {Provider, Context} = context(
  authReducer,
  {
    tryLocalStorage,
    getCurrentUser,
    completeSignUp,
    onAppleButtonPress,
    onGoogleButtonPress,
    signInWithPhone,
    confirmNumber,
    signout,
    isSpotifyAuth,
    spotifyCallback,
    spotifyLogin,
    spotifyLogout,
    authSpotify,
    deleteAccount,
  },
  defaultValue,
);
