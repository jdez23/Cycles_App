import RNSInfo from 'react-native-sensitive-info';

export const wait = timeout => {
  // Defined the timeout function for testing purpose
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const getUserID = async () => await RNSInfo.getItem('user_id', {});

export const getID = async () => {
  const me = await getUserID();
  return me;
};
