import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useSocket } from '../context/SocketContext';

const ProgressBar = ({ totalPower, reset }) => {
  const { socket } = useSocket();
  const [progress, setProgress] = useState(0);
  const [currentTotalPower, setCurrentTotalPower] = useState(totalPower);

  useEffect(() => {
    if (!socket) return;

    const onUpdatePower = (data) => {
      if (data.totalPower > 0) {
        setProgress(data.consumedPower / data.totalPower);
        setCurrentTotalPower(data.totalPower);
      } else {
        // Handle the case where the totalPower is zero
        setProgress(0);
        setCurrentTotalPower(0);
      }
    };

    // Listen for power updates from the server
    socket.on('updatePower', onUpdatePower);

    // Cleanup on component unmount
    return () => {
      socket.off('updatePower', onUpdatePower);
    };
  }, [socket]); // Dependency on socket

  useEffect(() => {
    // Reset the progress and total power when the reset prop changes
    if (reset) {
      setProgress(0);
      setCurrentTotalPower(totalPower); // Reset totalPower based on current prop
      console.log("The progress bar has been reset to:", 0);
      console.log("The Total Power bar has been reset to:", totalPower);
    }
  }, [reset, totalPower]); // Ensure totalPower is included in dependencies

  return (
    <View>
      <Text className="text-left text-sm">
        {(progress * currentTotalPower).toFixed(2)} / {currentTotalPower} watts
      </Text>
      <View className="w-full rounded-full my-2 p-[2px] border-2 border-[#f99e00] ">
        <View style={{ width: `${progress * 100}%` }} className="h-4 bg-[#f99e00] flex-row rounded-full justify-center items-center" >
        </View>
      </View>
    </View>
  );
};

export default ProgressBar;
