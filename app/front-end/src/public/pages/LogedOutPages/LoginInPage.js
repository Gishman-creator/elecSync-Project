import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { SafeAreaView, TextInput, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { BASE_URL } from '@env';  // Import the environment variable

const LoginInPage = ({ navigateTo, setLogedIn }) => {
  // Validation schema for formik
  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Invalid email format'),
    password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  });

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      // Make login request
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Login successful');
  
        // Ensure user data exists and is valid
        if (data.data && data.data.user) {
          const { _id, email, name } = data.data.user;
  
          // Check if values are defined
          if (_id && email && name) {
            await AsyncStorage.setItem('userId', _id.toString()); // Convert to string
            await AsyncStorage.setItem('userEmail', email);
            await AsyncStorage.setItem('userName', name);
    
            console.log('Stored user details:', { id: _id, email, name });
    
            setLogedIn(true); // Set logged in status
          } else {
            console.warn('User data is incomplete:', data.data.user);
          }
        } else {
          console.warn('No user data returned from login response');
        }
      } else {
        Alert.alert('Login failed', data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login failed', 'Something went wrong');
    }
  };
  

  return (
    <SafeAreaView className="h-full flex-col justify-center items-center">
      <View className="mb-20 h-3/4 flex-col justify-around items-center">
        <View>
          <Text className="text-2xl font-bold">Welcome back,</Text>
          <Text className="text-base font-semibold">Let's get you logged in!</Text>
        </View>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View className="w-full px-10">
              <Text className="text-sm font-semibold my-1">Email</Text>
              <TextInput
                className="border-2 border-[#ffbd4c] py-1 px-2 rounded-lg mb-2"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                placeholder="Email"
              />
              {touched.email && errors.email && (
                <Text className="text-red-500 text-sm">{errors.email}</Text>
              )}

              <Text className="text-sm font-semibold my-1">Password</Text>
              <TextInput
                className="border-2 border-[#ffbd4c] py-1 px-2 rounded-lg mb-10"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                placeholder="Password"
                secureTextEntry
              />
              {touched.password && errors.password && (
                <Text className="text-red-500 text-sm">{errors.password}</Text>
              )}

              <TouchableOpacity
                onPress={handleSubmit}
                className="bg-[#f99e00] w-52 p-2 rounded-3xl flex justify-center items-center mt-4 mx-auto"
              >
                <Text className="text-lg font-bold text-center text-white">Login</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigateTo('SignUpPage')}
                className="font-bold mt-4 mx-auto"
              >
                <Text>
                  New here?
                  <Text className="text-[#f99e00]"> Signup</Text>
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  );
};

export default LoginInPage;
