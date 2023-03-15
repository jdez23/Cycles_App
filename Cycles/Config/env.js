import {DEV_URL, PROD_URL, WS_URL, WEB_CLIENT_ID, IOS_CLIENT_ID} from '@env';

const devEnvVars = {
  DEV_URL,
  WS_URL,
  WEB_CLIENT_ID,
  IOS_CLIENT_ID,
};

const prodEnvVars = {
  PROD_URL,
  WS_URL,
  WEB_CLIENT_ID,
  IOS_CLIENT_ID,
};

export default __DEV__ ? devEnvVars : prodEnvVars;
