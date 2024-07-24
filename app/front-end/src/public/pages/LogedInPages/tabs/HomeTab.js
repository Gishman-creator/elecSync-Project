import React from 'react';
import { View } from 'react-native';
import Home from '../pages/HomeTbPages/Home';

const HomeTab = ({ userName }) => {
  return (
    <View className="bg-[#fff] h-full">
      <Home userName={userName} />
    </View>
  );
};

export default HomeTab;
