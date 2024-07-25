// Simulation.js
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import ProgressBar from '../../../../components/ProgressBar'; // Import ProgressBar component
import { useSocket } from '../../../../context/SocketContext'; // Import useSocket hook
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const Simulation = ({ navigation }) => {
    const { socket, socketConnected } = useSocket(); // Use the socket from context
    const [totalPower, setTotalPower] = useState(2000);
    const [consumedPower, setConsumedPower] = useState(0);
    const [simulating, setSimulating] = useState(false);
    const [reset, setReset] = useState(false);
    const intervalRef = useRef(null); // Ref to store the interval ID
    const [userId, setId] = useState('');  // State to hold the user's email

    useEffect(() => {
        const fetchEmail = async () => {
            const storedId = await AsyncStorage.getItem('userId'); // Fetch email from AsyncStorage
            if (storedId) {
                setId(storedId);
            }
        };
        fetchEmail();
    }, []);

    const startSimulation = () => {
        // Clear any existing interval before starting a new simulation
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        if (!socket || !socketConnected) {
            console.error('Socket.IO is not connected');
            return;
        }

        setSimulating(true);
        setReset(false); // Ensure reset is false when starting the simulation
        setConsumedPower(0); // Reset consumed power when starting the simulation

        socket.emit('startSimulation', { totalPower, userId });

        intervalRef.current = setInterval(() => {
            setConsumedPower(prev => {
                if (prev + 100 >= totalPower) {
                    clearInterval(intervalRef.current);
                    setSimulating(false);
                    return totalPower;
                }
                return prev + 100;
            });
        }, 3000);
    };

    const stopSimulation = () => {
        setSimulating(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current); // Clear the interval
        }
        setConsumedPower(0); // Reset consumed power
        setReset(true); // Trigger reset for ProgressBar

        if (socket) {
            socket.emit('stopSimulation');
        }
    };

    const handleInputChange = (value) => {
        setTotalPower(Number(value));
    };

    return (
        <SafeAreaView className="flex-1 bg-white p-4">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

                <View className="bg-[#fff] flex-row justify-start items-center mt-4">
                    <TouchableOpacity onPress={() => navigation.goBack()} className=" p-1">
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text className="text-center font-bold text-lg ml-4">Simulation Screen</Text>
                </View>

                <Text className="text-[#db9a2b] text-3xl font-bold my-5">
                    Consumed Power: {consumedPower} / {totalPower} watts
                </Text>
                <ProgressBar
                    totalPower={totalPower}
                    consumedPower={consumedPower}
                    reset={reset}
                />

                <Text className="text-lg">
                    {socketConnected ? 'Connected to Server' : 'Not Connected to Server'}
                </Text>

                <View className="flex flex-col items-center w-1/2">
                    <TextInput
                        className="mt-4 px-4 py-2 border rounded"
                        keyboardType="numeric"
                        value={totalPower.toString()}
                        onChangeText={handleInputChange}
                        placeholder="Enter total power"
                    />
                    {!simulating ? (
                        <TouchableOpacity
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                            onPress={startSimulation}
                        >
                            <Text className="text-white">Start Simulation</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                            onPress={stopSimulation}
                        >
                            <Text className="text-white">Stop Simulation</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Simulation;
