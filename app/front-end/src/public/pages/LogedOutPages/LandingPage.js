import React from 'react';
import { SafeAreaView, Image, Text, TouchableOpacity } from 'react-native';

export default function LandingPage({ navigateTo }) {
  return (
    <SafeAreaView className="h-full flex-col justify-evenly items-center">
      <Text className="text-3xl font-bold">
        Elec
        <Text className="text-[#f99e00]">Sync</Text>
      </Text>
      <Image
        resizeMode="contain"
        source={require("../../../images/standing_on_bulb.png")}
        className="bg-[#ffd489] rounded-full p-5 w-60 h-60"
      />
      <Text className="text-lg font-semibold w-[65%] text-center">
        Power your world effortlessly with just a click!
      </Text>
      <TouchableOpacity
        className="bg-[#f99e00] w-52 p-1 py-2 rounded-3xl flex justify-center items-center"
        onPress={() => navigateTo('LoginPage')}
      >
        <Text className="text-lg font-bold w-[70%] text-center">Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
