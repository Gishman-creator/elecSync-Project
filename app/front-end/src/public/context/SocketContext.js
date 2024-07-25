// context/SocketContext.js
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { BASE_URL } from '@env';  // Import the environment variable

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socketConnected, setSocketConnected] = useState(false);
    const [simulating, setSimulating] = useState(false); // New state for simulation
    const socketRef = useRef(null);

    useEffect(() => {
        const socket = io(`${BASE_URL}`); // Replace with your server URL
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Socket connected');
            setSocketConnected(true);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
            setSocketConnected(false);
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            setSocketConnected(false);
        });

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);

    const startSimulation = (totalPower, userId) => {
        if (socketRef.current) {
            socketRef.current.emit('startSimulation', { totalPower, userId });
            setSimulating(true);
        }
    };

    const stopSimulation = () => {
        if (socketRef.current) {
            socketRef.current.emit('stopSimulation');
            setSimulating(false);
        }
    };

    return (
        <SocketContext.Provider value={{ 
            socket: socketRef.current, 
            socketConnected, 
            startSimulation, 
            stopSimulation, 
            simulating 
        }}>
            {children}
        </SocketContext.Provider>
    );
};
