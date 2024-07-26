import React, { useRef, useState } from 'react';
import { SafeAreaView, TextInput, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import CheckBox from 'expo-checkbox';
import { Formik } from 'formik';
import * as Yup from 'yup';
import PhoneInput from 'react-native-phone-number-input';
import { BASE_URL } from '@env';  // Import the environment variable

const SignUpPage = ({ navigateTo }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const phoneInput = useRef(null);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required').min(3, 'Name must be at least 3 characters'),
    email: Yup.string().required('Email is required').email('Invalid email format'),
    phone: Yup.string().required('Phone number is required').matches(/^\d{12}$/, 'Phone number must be 12 digits long'),
    meterId: Yup.string().required('Electric meter ID is required').matches(/^\d{3} \d{4} \d{4}$/, 'Electric meter ID must be in the format XXX XXXX XXXX'),
    password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string().required('Confirm password is required').oneOf([Yup.ref('password')], 'Passwords must match'),
    agreeTerms: Yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
  });

  const handleSubmit = async (values, { setErrors }) => {
    try {
      console.log(values);
      const response = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Signup successful:', data);
        Alert.alert('Signup Successful', 'You have successfully registered!');
        navigateTo('LoginPage');
      } else {
        if (data.message) {
          if (data.message.includes('Email')) {
            setErrors({ email: data.message });
          } else if (data.message.includes('Phone number')) {
            setErrors({ phone: data.message });
          } else if (data.message.includes('Electric meter ID')) {
            setErrors({ meterId: data.message });
          } else {
            Alert.alert('Signup failed', data.message);
          }
        } else {
          Alert.alert('Signup failed', 'Something went wrong');
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Signup failed', 'Something went wrong');
    }
  };

  const formatMeterId = (text) => {
    const cleaned = text.replace(/\D+/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,4})(\d{0,4})$/);
    if (match) {
      return [match[1], match[2], match[3]].filter(x => x).join(' ');
    }
    return text;
  };

  const handlePhoneChange = (text, setFieldValue) => {
    const numericPhone = text.replace(/\D/g, '');
    setFieldValue('phone', numericPhone);
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} className="py-10">
        <View className="mb-5 flex-col justify-center items-center">
          <Text className="text-2xl font-semibold">Welcome to Elec
            <Text className="text-[#f99e00]">Sync,</Text>
          </Text>
          <Text className="text-sm">Please fill in your information.</Text>
        </View>

        <Formik
          initialValues={{ name: '', email: '', phone: '', meterId: '', password: '', confirmPassword: '', agreeTerms: false }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <View className="w-full px-7">
              <Text className="text-sm font-semibold my-1">Name</Text>
              <TextInput
                className="border border-gray-300 focus:border-[#ffbd4c] py-1 px-3 rounded-md mb-1"
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
                placeholder="Name"
              />
              {touched.name && errors.name && (
                <Text className="text-xs mb-1">{errors.name}</Text>
              )}

              <Text className="text-sm font-semibold my-1">Email</Text>
              <TextInput
                className="border border-gray-300 focus:border-[#ffbd4c] py-1 px-3 rounded-md mb-1"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                placeholder="Email"
              />
              {touched.email && errors.email && (
                <Text className="text-xs mb-1">{errors.email}</Text>
              )}

              <Text className="text-sm font-semibold my-1">Phone Number</Text>
              <PhoneInput
                ref={phoneInput}
                defaultValue={values.phone}
                defaultCode="RW"
                layout="first"
                placeholder="Phone"
                onChangeFormattedText={(text) => handlePhoneChange(text, setFieldValue)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                containerStyle={{
                  borderColor: isFocused ? '#ffbd4c' : '#d1d5db',
                  borderWidth: 1,
                  borderRadius: 6,
                  marginBottom: 10,
                  width: '100%',
                  paddingVertical: 2
                }}
                textContainerStyle={{ paddingVertical: 2 }}
              />
              {touched.phone && errors.phone && (
                <Text className="text-xs mb-1">{errors.phone}</Text>
              )}

              <Text className="text-sm font-semibold my-1">Electric Meter ID</Text>
              <TextInput
                className="border border-gray-300 focus:border-[#ffbd4c] py-1 px-3 rounded-md mb-1"
                onChangeText={(text) => setFieldValue('meterId', formatMeterId(text))}
                onBlur={handleBlur('meterId')}
                value={values.meterId}
                placeholder="XXX XXXX XXXX"
                keyboardType="numeric"
              />
              {touched.meterId && errors.meterId && (
                <Text className="text-xs mb-1">{errors.meterId}</Text>
              )}

              <Text className="text-sm font-semibold my-1">Password</Text>
              <View className="relative">
                <TextInput
                  className="border border-gray-300 focus:border-[#ffbd4c] py-1 px-3 rounded-md mb-1 pr-10"
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 transform -translate-y-1/2"
                >
                  <Text className="text-sm font-semibold text-gray-600">
                    {showPassword ? 'Hide' : 'Show'}
                  </Text>
                </TouchableOpacity>
              </View>
              {touched.password && errors.password && (
                <Text className="text-xs mb-1">{errors.password}</Text>
              )}

              <Text className="text-sm font-semibold my-1">Confirm Password</Text>
              <View className="relative">
                <TextInput
                  className="border border-gray-300 focus:border-[#ffbd4c] py-1 px-3 rounded-md mb-1 pr-10"
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  placeholder="Confirm Password"
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2 transform -translate-y-1/2"
                >
                  <Text className="text-sm font-semibold text-gray-600">
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </Text>
                </TouchableOpacity>
              </View>
              {touched.confirmPassword && errors.confirmPassword && (
                <Text className="text-xs mb-1">{errors.confirmPassword}</Text>
              )}

              <View className="flex-row items-center mt-4">
                <CheckBox
                  value={values.agreeTerms}
                  onValueChange={(value) => setFieldValue('agreeTerms', value)}
                />
                <Text className="ml-2">I agree to the terms and conditions</Text>
              </View>
              {touched.agreeTerms && errors.agreeTerms && (
                <Text className="text-xs mb-1">{errors.agreeTerms}</Text>
              )}

              <TouchableOpacity
                onPress={handleSubmit}
                className="bg-[#f99e00] w-full p-2 rounded-3xl flex justify-center items-center mt-4 mx-auto"
              >
                <Text className="text-sm font-semibold text-center text-white">Sign up</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigateTo('LoginPage')}
                className="font-bold mt-4 mb-14 mx-auto"
              >
                <Text>
                  Already have an account?
                  <Text className="text-[#f99e00]"> Login</Text>
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpPage;
