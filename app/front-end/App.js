import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import LogedOut from './src/public/screens/LogedOut';
import LogedIn from './src/public/screens/LogedIn';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeWindStyleSheet } from "nativewind";
NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function App() {
  const [logedIn, setLogedIn] = useState(false);

  useEffect(() => {
    const fetchLoginStatus = async () => {
      const status = await AsyncStorage.getItem('logedIn');
      if (status) {
        setLogedIn(JSON.parse(status));
      }
    };
    fetchLoginStatus();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('logedIn', JSON.stringify(logedIn));
  }, [logedIn]);

  return (
    <SafeAreaView className="h-screen">
      {logedIn ? <LogedIn setLogedIn={setLogedIn} /> : <LogedOut setLogedIn={setLogedIn} />}
    </SafeAreaView>
  );
}
