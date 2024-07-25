import React, { useState, useEffect } from 'react';
import { TextInput, Text, View, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PayWithFlutterwave } from 'flutterwave-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FLUTTERWAVE_PUBLIC_KEY } from '@env';  // Import environment variable

const Bill = () => {
    const [selectedOption, setSelectedOption] = useState('your_meter');
    const [kw, setKw] = useState('1');
    const [price, setPrice] = useState('250');
    const [email, setEmail] = useState('');  // State to hold the user's email

    useEffect(() => {
        const fetchEmail = async () => {
            const storedEmail = await AsyncStorage.getItem('userEmail'); // Fetch email from AsyncStorage
            if (storedEmail) {
                setEmail(storedEmail);
            }
        };
        fetchEmail();
    }, []);

    const generateTransactionRef = (length) => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return `flw_tx_ref_${result}`;
    };

    const totalAmount = parseInt(price) + 10; // Calculate total with fee

    const handleOnRedirect = (data) => {
        console.log(data);
        if (data.status === 'successful') {
            Alert.alert('Success', 'Payment was successful');
        } else if (data.status === 'cancelled') {
            Alert.alert('Cancelled', 'Payment was cancelled');
        }
    };

    return (
        <SafeAreaView className={`w-full h-full bg-white`}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View className="w-full top-0 fixed flex-row justify-between items-center shadow-2xl py-4 px-7">
                    <Text className="font-bold text-lg">Purchase electricity</Text>
                </View>

                <View className="px-7 flex-grow">
                    <View className="h-full">
                        <Text className="mr-auto text-sm my-4">Power in KiloWatts(KW)</Text>
                        <View className="flex-row justify-start items-center">
                            <TextInput
                                className="border border-[#ffbd4c] py-1 px-3 rounded-lg w-20"
                                onChangeText={(kw) => {
                                    const calculatedPrice = kw ? parseInt(kw) * 250 : '';
                                    setKw(kw);
                                    setPrice(calculatedPrice.toString());
                                }}
                                value={kw}
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
                                    const calculatedKw = price ? parseInt(price) / 250 : '';
                                    setKw(calculatedKw.toString());
                                    setPrice(price);
                                }}
                                value={price}
                                placeholder="RWF"
                                keyboardType="numeric"
                            />
                            <Text className="text-sm my-auto">RWF</Text>
                        </View>

                        <View className="flex-row items-center mb-2">
                            <TouchableOpacity
                                onPress={() => setSelectedOption('your_meter')}
                                className={`flex-row justify-between items-center rounded-lg shadow-md`}
                            >
                                <View className={`w-4 h-4 rounded-full border-2 border-gray-600`}>
                                    {selectedOption === 'your_meter' && <View className="w-2 h-2 m-auto rounded-full bg-gray-600" />}
                                </View>
                                <Text className="text-base ml-2">Use your electric meter</Text>
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row items-center mb-2 pb-4 border-b border-gray-300">
                            <TouchableOpacity
                                onPress={() => setSelectedOption('another_meter')}
                                className={`flex-row justify-between items-center rounded-lg shadow-md`}
                            >
                                <View className={`w-4 h-4 rounded-full border-2 border-gray-600`}>
                                    {selectedOption === 'another_meter' && <View className="w-2 h-2 m-auto rounded-full bg-gray-600" />}
                                </View>
                                <Text className="text-base ml-2">Use another meter</Text>
                            </TouchableOpacity>
                        </View>

                        <Text className="text-base font-medium my-1">Fee: 10 RWF</Text>
                        <Text className="text-base font-medium my-1 mb-36">Total: {totalAmount} RWF</Text>

                        <PayWithFlutterwave
                            onRedirect={handleOnRedirect}
                            options={{
                                tx_ref: generateTransactionRef(10),
                                authorization: FLUTTERWAVE_PUBLIC_KEY,
                                customer: {
                                    email: email // Use the retrieved email
                                },
                                amount: totalAmount,
                                currency: 'FRW',
                                payment_options: 'card',
                            }}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    paymentButton: {
        backgroundColor: '#f99e00',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    paymentButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default Bill;
