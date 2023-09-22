import {View, Text, TextInput, StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import {Controller} from 'react-hook-form';

const window = Dimensions.get('window').width;
const CustomInput = ({
  control,
  name,
  rules = {},
  placeholder,
  secureTextEntry,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
        <>
          <View style={[styles.container]}>
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              placeholderTextColor="#B3B3B3"
              style={styles.input}
              secureTextEntry={secureTextEntry}
              returnKeyType={'done'}
            />
          </View>
          {error && (
            <Text
              style={{
                color: '#F9A01B',
                alignSelf: 'flex-start',
                paddingLeft: 12,
                paddingTop: 5,
              }}>
              {error.message || 'Error'}
            </Text>
          )}
        </>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1f1f1f',
    width: 350,
    height: 45,
    borderRadius: 10,
    fontSize: 14,
  },
  input: {
    color: 'white',
    paddingTop: 13,
    paddingLeft: 12,
    width: window,
  },
});

export default CustomInput;
