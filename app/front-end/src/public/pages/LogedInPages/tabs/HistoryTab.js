// pages/HistoryTab.js
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import LineChart from '../pages/HistoryTbPages/LineChart';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { BASE_URL } from '@env';  // Import the environment variable
import { useSocket } from '../../../context/SocketContext'; 

const HistoryTab = () => {
  const [selectedTab, setSelectedTab] = useState('daily');
  const [data, setData] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true); // Separate loading state for initial fetches
  const [userId, setUserId] = useState(null); // State for user ID
  const { socket } = useSocket(); // Access socket from context

  const fetchUserId = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId'); // Fetch user ID from AsyncStorage
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        console.warn('No user ID found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  // Fetch data based on the selected filter
  const fetchData = async (filter) => {
    if (!userId) {
      console.warn('No user ID available in HistoryTab');
      return;
    }
  
    try {
      setInitialLoading(true); // Show loading spinner for initial fetches
      const response = await fetch(`${BASE_URL}/api/data/${filter}/${userId}`); // Include user ID in URL
      const responseData = await response.json();
      console.log('Fetched data:', responseData); // Debugging log
      setData(responseData);
      setInitialLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setInitialLoading(false);
    }
  };
  

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchData(selectedTab);
    }
  }, [selectedTab, userId]);

  useEffect(() => {
    if (socket) {
      const handleUpdatePower = (update) => {
        console.log('Received update:', update);

        // Fetch new data on every update, without showing loading spinner
        fetchData(selectedTab);
      };

      socket.on('updatePower', handleUpdatePower);

      return () => {
        socket.off('updatePower', handleUpdatePower);
      };
    }
  }, [socket, selectedTab]);

  const renderContent = () => {
    if (data.length === 0) {
      return (
        <View className="flex-1 justify-center items-center">
          <Text>No data available</Text>
        </View>
      );
    } else {
      console.log('Rendering LineChart with data:', data); // Debugging log
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
            <View className="bg-[#ffb432] w-[90%] h-fit p-1 rounded-xl flex-row items-center">
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
