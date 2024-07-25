import { View, Text } from 'react-native'
import React from 'react'
import Bill from '../pages/PurchaseTbPages/Bill'
import { GestureHandlerRootView } from 'react-native-gesture-handler'


const PurchaseTab = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="bg-[#fff] h-full">
        <Bill />
      </View>
    </GestureHandlerRootView>
  )
}

export default PurchaseTab