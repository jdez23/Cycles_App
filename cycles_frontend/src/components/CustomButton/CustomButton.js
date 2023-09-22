import {Text, StyleSheet, Pressable} from 'react-native';
import React from 'react';

const CustomButton = ({onPress}) => {
  return (
    <Pressable onPress={onPress} style={styles.button_container}>
      <Text style={styles.button_text}>Continue</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button_container: {
    backgroundColor: '#E04326',
    width: 350,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  button_text: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default CustomButton;
