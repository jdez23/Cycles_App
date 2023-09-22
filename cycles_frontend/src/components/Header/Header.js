import React from 'react';

import {StyleSheet, View, Text, Dimensions} from 'react-native';

const window = Dimensions.get('window').width;

const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.cycles}>cycles</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#0C0C0C',
    height: 50,
    width: window,
    alignItems: 'center',
    borderBottomColor: '#252525',
    borderBottomWidth: 0.3,
  },
  cycles: {
    fontSize: 32,
    fontFamily: 'futura',
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Header;
