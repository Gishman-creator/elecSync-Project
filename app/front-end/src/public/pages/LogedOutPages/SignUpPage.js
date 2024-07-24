import React, { useRef } from 'react';
import { SafeAreaView, TextInput, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import CheckBox from 'expo-checkbox';
import { Formik } from 'formik';
import * as Yup from 'yup';
import PhoneInput from 'react-native-phone-number-input';

const SignUpPage = ({ navigateTo }) => {
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
      console.log(values)
      const response = await fetch('http://192.168.1.73:3000/api/auth/signup', {
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
        // Navigate to the login screen
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
          <Text className="text-2xl font-bold">Welcome to Elec
            <Text className="text-[#f99e00]">Sync,</Text>
          </Text>
          <Text className="text-base font-semibold">Please fill in your information.</Text>
        </View>

        <Formik
          initialValues={{ name: '', email: '', phone: '', meterId: '', password: '', confirmPassword: '', agreeTerms: false }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <View className="w-full px-10">
              <Text className="text-sm font-semibold my-1">Name</Text>
              <TextInput
                className="border-2 border-[#ffbd4c] py-1 px-2 rounded-lg mb-2"
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
                placeholder="Name"
              />
              {touched.name && errors.name && (
                <Text className="text-red-500 text-sm">{errors.name}</Text>
              )}

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

              <Text className="text-sm font-semibold my-1">Phone Number</Text>
              <PhoneInput
                ref={phoneInput}
                defaultValue={values.phone}
                defaultCode="RW"
                layout="first"
                placeholder="Phone"
                onChangeFormattedText={(text) => handlePhoneChange(text, setFieldValue)}
                containerStyle={{ borderColor: '#ffbd4c', borderWidth: 2, borderRadius: 10, marginBottom: 10, width: '100%' }}
                textContainerStyle={{ paddingVertical: 2 }}
              />
              {touched.phone && errors.phone && (
                <Text className="text-red-500 text-sm">{errors.phone}</Text>
              )}

              <Text className="text-sm font-semibold my-1">Electric Meter ID</Text>
              <TextInput
                className="border-2 border-[#ffbd4c] py-1 px-2 rounded-lg mb-2"
                onChangeText={(text) => setFieldValue('meterId', formatMeterId(text))}
                onBlur={handleBlur('meterId')}
                value={values.meterId}
                placeholder="XXX XXXX XXXX"
                keyboardType="numeric"
              />
              {touched.meterId && errors.meterId && (
                <Text className="text-red-500 text-sm">{errors.meterId}</Text>
              )}

              <Text className="text-sm font-semibold my-1">Password</Text>
              <TextInput
                className="border-2 border-[#ffbd4c] py-1 px-2 rounded-lg mb-2"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                placeholder="Password"
                secureTextEntry
              />
              {touched.password && errors.password && (
                <Text className="text-red-500 text-sm">{errors.password}</Text>
              )}

              <Text className="text-sm font-semibold my-1">Confirm Password</Text>
              <TextInput
                className="border-2 border-[#ffbd4c] py-1 px-2 rounded-lg mb-2"
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                value={values.confirmPassword}
                placeholder="Confirm Password"
                secureTextEntry
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <Text className="text-red-500 text-sm">{errors.confirmPassword}</Text>
              )}

              <View className="flex-row items-center mt-4">
                <CheckBox
                  value={values.agreeTerms}
                  onValueChange={(value) => setFieldValue('agreeTerms', value)}
                />
                <Text className="ml-2">I agree to the terms and conditions</Text>
              </View>
              {touched.agreeTerms && errors.agreeTerms && (
                <Text className="text-red-500 text-sm">{errors.agreeTerms}</Text>
              )}

              <TouchableOpacity
                onPress={handleSubmit}
                className="bg-[#f99e00] w-52 p-2 rounded-3xl flex justify-center items-center mt-4 mx-auto"
              >
                <Text className="text-lg font-bold text-center text-white">Register</Text>
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
