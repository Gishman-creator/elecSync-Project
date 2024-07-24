import React, { useState } from 'react';
import { TextInput, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Formik } from 'formik';
import { SafeAreaView } from 'react-native-safe-area-context';

const Bill = () => {
    const [selectedOption, setSelectedOption] = useState('your_meter');

    const handleSubmit = (values) => {
        console.log(values);
        console.log('Selected meter option:', selectedOption);
    };

    return (
        <SafeAreaView className="w-full">
            <ScrollView contentContainerStyle={{ height: '100%' }}>

                <View className="w-full top-0 fixed flex-row justify-between items-center shadow-2xl py-4 px-7">
                    <Text className="font-bold text-lg">Purchase electricity</Text>
                </View>

                <View className="px-7">

                    <Formik
                        initialValues={{ kw: '1', price: '250' }}
                        onSubmit={handleSubmit}
                    >
                        {({ handleChange, values }) => (
                            <View className="h-full">
                                <Text className="mr-auto text-sm my-4">Power in KiloWatts(KW)</Text>
                                <View className=" flex-row justify-start items-center">
                                    <TextInput
                                        className="border border-[#ffbd4c] py-1 px-3 rounded-lg w-20"
                                        onChangeText={(kw) => {
                                            const price = kw ? parseInt(kw) * 250 : '';
                                            handleChange('kw')(kw);
                                            handleChange('price')(price.toString());
                                        }}
                                        value={values.kw}
                                        placeholder="KW"
                                        keyboardType="numeric"
                                    />
                                    <Text className="text-sm my-auto ml-2">KW</Text>
                                </View>

                                <View className="flex-row justify-start items-center my-4 space-x-2">
                                    <Text className="text-sm my-auto ml-2">Total amount:</Text>
                                    <TextInput
                                        className="border border-[#ffbd4c] py-1 px-3 rounded-lg w-20"
                                        onChangeText={(price) => {
                                            const kw = price ? parseInt(price) / 250 : '';
                                            handleChange('price')(price);
                                            handleChange('kw')(kw.toString());
                                        }}
                                        value={values.price}
                                        placeholder="RWF"
                                        keyboardType="numeric"
                                    />
                                    <Text className="text-sm my-auto">RWF</Text>
                                </View>

                                <View className="flex-row items-center mb-2">
                                    <TouchableOpacity
                                        onPress={() => setSelectedOption('your_meter')}
                                        className={`flex-row justify-between items-center  rounded-lg shadow-md`}
                                    >
                                        <View
                                            className={`w-4 h-4 rounded-full border-2 border-gray-600`}
                                        >
                                            {selectedOption === 'your_meter' && <View className="w-2 h-2 m-auto rounded-full bg-gray-600" />}
                                        </View>
                                        <Text className="text-base ml-2">Use your electric meter</Text>
                                    </TouchableOpacity>
                                </View>

                                <View className="flex-row items-center mb-2 pb-4 border-b border-gray-300">
                                    <TouchableOpacity
                                        onPress={() => setSelectedOption('another_meter')}
                                        className={`flex-row justify-between items-center  rounded-lg shadow-md`}
                                    >
                                        <View
                                            className={`w-4 h-4 rounded-full border-2 border-gray-600 `}
                                        >
                                            {selectedOption === 'another_meter' && <View className="w-2 h-2 m-auto rounded-full bg-gray-600" />}
                                        </View>
                                        <Text className="text-base ml-2">Use another meter</Text>
                                    </TouchableOpacity>
                                </View>

                                <Text className="text-base font-medium my-1">Fee: 10 RWF</Text>
                                <Text className="text-base font-medium my-1">Total: {values.kw * 250 + 10}</Text>

                                <TouchableOpacity onPress={() => handleSubmit(values)} className="bg-[#f99e00] w-full p-2 rounded-lg flex justify-center items-center mt-36 mx-auto">
                                    <Text className="text-lg font-bold text-center text-white">Buy electricity</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Formik>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Bill;
