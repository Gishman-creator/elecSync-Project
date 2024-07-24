import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Week = () => {
  return (
    <SafeAreaView className="h-full">
        <ScrollView contentContainerStyle={{ flexGrow: 1, }} className="px-1">

            <Text className="text-base font-semibold">Total electric used:</Text>

            <View className="flex-row justify-start items-end">
                <Text className="text-[100px] text-[#f99e00]">0</Text>
                <Text className="text-base font-semibold mb-6">kW used</Text>
            </View>

            <Text className="text-base font-semibold">Detailed consumption</Text>

        </ScrollView>
    </SafeAreaView>
  )
}

export default Week