import React from 'react';
import { View } from 'react-native';
import Settings from '../pages/SettingsTbPages/Settings';

const SettingsTab = ({ setLogedIn, userName, navigation }) => {
  // Function to handle navigation to Simulation screen
  const handleStartSimulation = () => {
    navigation.navigate('Simulation');
  };

  return (
    <View className="bg-[#fff] h-full">
      <Settings setLogedIn={setLogedIn} userName={userName} onStartSimulation={handleStartSimulation} />
    </View>
  );
};

export default SettingsTab;
