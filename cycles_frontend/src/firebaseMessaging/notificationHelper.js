import messaging from '@react-native-firebase/messaging';
import RNSInfo from 'react-native-sensitive-info';
import axios from 'axios';
import envs from '../../Config/env';
import {useNavigation} from '@react-navigation/native';

const getToken = async () => await RNSInfo.getItem('token', {});

const BACKEND_URL = envs.PROD_URL;

export async function requestUserPermission() {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      getFcmToken();
    }
  } catch (e) {
    null;
  }
}

const getFcmToken = async () => {
  const token = await getToken();
  try {
    messaging()
      .getToken()
      .then(fcmToken => {
        try {
          axios.post(
            `${BACKEND_URL}/notifications/fcmToken/`,
            {token: fcmToken},
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: token,
              },
            },
          );
        } catch (error) {
          null;
        }
      });
  } catch (error) {
    null;
  }
};
