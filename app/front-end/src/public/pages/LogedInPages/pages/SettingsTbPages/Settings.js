import React from 'react';
import { View, Image, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const Settings = ({ setLogedIn, userName, onStartSimulation }) => {
  const handleLogout = () => {
    setLogedIn(false);
    Alert.alert('Logged out', 'You have been logged out successfully.');
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }} className="px-7">
        <Image
          fadeDuration={1000}
          source={require("../../../../../images/profile.png")}
          className="bg-[#f2f2f2] rounded-full mb-4 w-24 h-24"
        />
        <Text className="font-bold text-base mb-4">{userName}</Text>
        <TouchableOpacity className="bg-[#f99e00] w-52 p-1 rounded-3xl flex justify-center items-center mb-4 mx-auto">
          <Text className="text-white text-lg font-semibold w-[70%] text-center">Profile Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity className="w-full flex-row justify-start items-center border-t-2 border-gray-200 p-4 mt-4">
          <View className="bg-[#ffecd8] p-2 rounded-full">
            <Ionicons className="rounded-full p-3 bg-[#ffd3a5]" name="settings-outline" size={20} color="#f99e00" />
          </View>
          <Text className="text-base font-medium ml-4">Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onStartSimulation} className="w-full flex-row justify-start items-center border-t-2 border-gray-200 p-4">
          <View className="bg-[#ffecd8] p-2 rounded-full">
            <Ionicons className="rounded-full p-3 bg-[#ffd3a5]" name="play-circle" size={20} color="#f99e00" />
          </View>
          <Text className="text-base font-medium ml-4">Start Simulation</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} className="w-full flex-row justify-start items-center border-y-2 border-gray-200 p-4">
          <View className="bg-[#ffecd8] p-2 rounded-full">
            <Ionicons className="rounded-full p-3 bg-[#ffd3a5]" name="log-out-outline" size={20} color="#f99e00" />
          </View>
          <Text className="text-base font-medium ml-4">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
