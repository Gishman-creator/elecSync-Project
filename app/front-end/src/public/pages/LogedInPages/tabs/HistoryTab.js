import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import LineChart from '../pages/HistoryTbPages/LineChart';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const HistoryTab = () => {
  const [selectedTab, setSelectedTab] = useState('daily');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data based on the selected filter
  const fetchData = async (filter) => {
    try {
      setLoading(true);
      const response = await fetch(`http://192.168.1.73:4000/data/${filter}`);
      const responseData = await response.json();
      setData(responseData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedTab);
  }, [selectedTab]);

  const renderContent = () => {
    if (loading) {
      return (
        <View className="flex-1 justify-center items-center">
          <Text>Loading...</Text>
        </View>
      );
    } else if (data.length === 0) {
      return (
        <View className="flex-1 justify-center items-center">
          <Text>No data available</Text>
        </View>
      );
    } else {
      return (
        <LineChart
          data={data}
          chartHeight={100}
          chartMargin={5}
          chartWidth={300} // Adjust according to your layout
        />
      );
    }
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="bg-white h-full">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="py-4 px-7">
          <View className="flex-row justify-center items-center">
            <View className="bg-[#ffb432] w-[90%] h-fit p-1 rounded-lg flex-row items-center">
              <TouchableOpacity
                className={`w-1/3 rounded-lg ${selectedTab === 'daily' ? 'bg-white' : 'bg-transparent'}`}
                onPress={() => setSelectedTab('daily')}
              >
                <Text className="text-base font-semibold mx-auto">Daily</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`w-1/3 rounded-lg ${selectedTab === 'weekly' ? 'bg-white' : 'bg-transparent'}`}
                onPress={() => setSelectedTab('weekly')}
              >
                <Text className="text-base font-semibold mx-auto">Weekly</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`w-1/3 rounded-lg ${selectedTab === 'monthly' ? 'bg-white' : 'bg-transparent'}`}
                onPress={() => setSelectedTab('monthly')}
              >
                <Text className="text-base font-semibold mx-auto">Monthly</Text>
              </TouchableOpacity>
            </View>
            <Ionicons name="ellipsis-vertical" size={24} color="black" />
          </View>

          <View className="mt-4">
            {renderContent()}
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default HistoryTab;
