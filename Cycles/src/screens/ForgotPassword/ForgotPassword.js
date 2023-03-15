import React from "react";

import {View, StyleSheet, Text, Pressable} from "react-native";

import {useNavigation} from '@react-navigation/native';
import { useForm } from "react-hook-form";

import CustomButton from "../../components/CustomButton/CustomButton";
import CustomInput from "../../components/CustomInput/CustomInput";

import axios from "axios";
import { navigate } from "../../components/RootNavigation";

const ForgotPassword = () => {
    const navigation = useNavigation();
    const {
        control, 
        handleSubmit, 
        formState: {errors},
    } = useForm();

    const onSignIn = () => {
        navigation.navigate('SignIn');
    };

    // Post Forgot password API
    const resetPassword = async (data) => {
        try {
            await axios.post('http://127.0.0.1:8000/dj-rest-auth/password/reset/', data
        );
        navigation.navigate('SignIn')} catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.root}>
            <Text style={styles.text}>Forgot password?</Text>
            <CustomInput
                name={"email"}
                placeholder= 'enter email:'
                control={control}
                clearTextOnFocus={true}
                rules={{
                    required: 'email is required',
                }}
            />
            <CustomButton onPress={handleSubmit(resetPassword)} />
            <Pressable onPress={onSignIn} >
                <Text style={styles.signin}>sign in</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        backgroundColor: '#151515',
        flex: 1
    },
    text: {
        marginTop: '70%',
        fontSize: 24,
        fontFamily: 'futura',
        fontWeight: 'bold',
        color: 'white'
    },
    signin: {
        marginTop: 325,
        fontFamily: 'futura',
        color: '#D3D3D3',
        fontSize: 12,
    }
});

export default ForgotPassword;