import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {Context as AuthContext} from '../../context/AuthContext';

const SplashLoading = () => {
  const {state, tryLocalStorage} = useContext(AuthContext);
  // console.log('APP.JS STATE', state.user);

  useEffect(() => {
    tryLocalStorage();
  }, []);

  return null;
  // (
  //     <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#06BCEE' }}>
  //         <ActivityIndicator size='large' color='ffffff' />
  //     </View>
  // );
};

export default SplashLoading;
