import React, {useContext, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-root-toast';
import {Context as AuthContext} from '../../context/AuthContext';

const ProfileSettings = route => {
  const authContext = useContext(AuthContext);
  const {user_id} = route.route.params;
  const navigation = useNavigation();
  const [toast, setToast] = React.useState(null);
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

  const deleteProfileAlert = () =>
    Alert.alert(
      'Are you sure you want to delete your account?',
      'Action is not reversable',
      [
        {
          text: 'Yes',
          onPress: () => authContext?.deleteAccount(user_id),
        },
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
      ],
      {
        cancelable: true,
      },
    );

  return (
    <SafeAreaView
      style={StyleSheet.create({backgroundColor: '#0C0C0C', flex: 1})}>
      <View style={styles.container}>
        <Pressable onPress={onBack}>
          <View
            style={{
              height: 50,
              width: 50,
              justifyContent: 'center',
              paddingLeft: 6,
            }}>
            <Ionicons name="chevron-back" size={25} color={'white'} />
          </View>
        </Pressable>
        <Text style={styles.textUser}>Settings</Text>
        <View style={{height: 50, width: 50}} />
      </View>
      <View style={{paddingHorizontal: 12}}>
        <Pressable
          onPress={() => navigation.navigate('ServicesScreen')}
          style={{paddingTop: 12}}>
          <View
            style={{
              justifyContent: 'space-between',
              height: 30,
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomColor: '#262626',
            }}>
            <Text style={{fontSize: 14, color: 'white'}}>Services</Text>
            <Ionicons
              name="chevron-forward"
              style={{color: 'white', fontSize: 20}}
            />
          </View>
        </Pressable>
        <Pressable
          onPress={() => authContext?.signout()}
          style={{paddingTop: 12}}>
          <View
            style={{
              justifyContent: 'space-between',
              height: 30,
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomColor: '#262626',
            }}>
            <Text style={{fontSize: 14, color: 'white'}}>Log Out</Text>
            <Ionicons
              name="chevron-forward"
              style={{color: 'white', fontSize: 20}}
            />
          </View>
        </Pressable>
        <Pressable onPress={deleteProfileAlert} style={{paddingTop: 12}}>
          <View
            style={{
              justifyContent: 'space-between',
              height: 30,
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomColor: '#262626',
            }}>
            <Text style={{fontSize: 14, color: 'white'}}>Delete Account</Text>
            <Ionicons
              name="chevron-forward"
              style={{color: 'white', fontSize: 20}}
            />
          </View>
        </Pressable>
        {/* <Pressable style={{ alignItems: 'center', top: 560 }} onPress={signout} >
            <View style={{ height: 30, width: 85, backgroundColor: '#1f1f1f', alignItems: 'center', justifyContent: 'center', borderRadius: 30 }}>
              <Text style={{ fontSize: 12, color: 'white', fontWeight: '600' }}>Log Out</Text>
            </View>
        </Pressable>
        <Pressable style={{ top: 570 }} >
            <View style={{ height: 30, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize:13, fontWeight: '600', color: 'white' }}>Delete Account</Text>
            </View>
        </Pressable> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0C0C0C',
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.3,
    borderBottomColor: '#252525',
  },
  textUser: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
});

export default ProfileSettings;
