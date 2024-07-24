import React from 'react';
import { View, Image, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ProgressBar from '../../../../components/ProgressBar';

const Home = ({ userName }) => {
  return (
    <SafeAreaView className="h-full">
      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }} className="">
        <View className="bg-white w-full top-0 fixed flex-row justify-between items-center shadow-2xl py-4 px-7">
          <Text className="font-bold text-base">Hello, {userName}</Text>
          <View className="flex-row justify-between items-center space-x-3">
            <Ionicons name="notifications-outline" size={25} color="#000" />
            <Image
              source={require("../../../../../images/profile.png")}
              className="bg-[#e6e6e6] rounded-full p-5 w-10 h-10"
            />
          </View>
        </View>

        <View className="pb-4 pt-1 px-7">
          <View style={styles.shadowContainer} className="bg-[#f99e00] h-fit w-full p-3 rounded-lg flex-row justify-between items-center">
            <Image
              resizeMode="contain"
              source={require("../../../../../images/piggy_bank.png")}
              className="w-[35%] h-28"
            />
            <Text className="w-[60%] font-bold text-base">Save money by unplugging appliances you're not using</Text>
          </View>

          <View className="space-y-2 mt-3">
            <Text className="text-lg font-bold">Today</Text>
            <Text className="text-base font-semibold">Total units consumed:</Text>
            <View className="">
              <ProgressBar />
            </View>
            <Text className="text-base font-semibold text-[#f99e00] ml-auto">See more statistics</Text>
            <Text className="text-base font-semibold text-center">Set goal for today and tomorrow and manage your bills efficiently.</Text>
            <TouchableOpacity className="bg-[#f99e00] w-52 p-1 rounded-3xl flex justify-center items-center mx-auto">
              <Text className="text-white text-lg font-semibold w-[70%] text-center">Set your goals</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.shadowContainer} className="bg-[#fff4e8] flex-row justify-start items-center border border-[#f99e00] p-2 rounded-lg mt-5">
            <Ionicons name="flash" size={25} color="#f99e00" />
            <Text className="text-lg font-medium ml-4">Buy electricity</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shadowContainer} className="bg-[#fff4e8] flex-row justify-start items-center border border-[#f99e00] p-2 rounded-lg mt-5">
            <Ionicons name="archive" size={25} color="#f99e00" />
            <Text className="text-lg font-medium ml-4">Transaction history</Text>
          </TouchableOpacity>

          <View style={styles.shadowContainer} className="bg-[#f99e00] h-fit w-full p-3 mt-3 rounded-lg flex-row justify-between items-center">
            <Image
              resizeMode="contain"
              source={require("../../../../../images/bulb_2.png")}
              className="w-[35%] h-28"
            />
            <View className="w-[60%]">
              <Text className="font-bold text-base mb-1">Plan ahead for today!</Text>
              <Text className="font-medium text-base">As of now, 1Kw of power is valued at 200frw</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Android shadow
    elevation: 5,
  },
});

export default Home;
