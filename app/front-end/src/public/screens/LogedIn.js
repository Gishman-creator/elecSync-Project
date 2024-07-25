import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeTab from '../pages/LogedInPages/tabs/HomeTab';
import PurchaseTab from '../pages/LogedInPages/tabs/PurchaseTab';
import HistoryTab from '../pages/LogedInPages/tabs/HistoryTab';
import SettingsTab from '../pages/LogedInPages/tabs/SettingsTab';
import Simulation from '../pages/LogedInPages/pages/SettingsTbPages/Simulation';
import { Ionicons } from '@expo/vector-icons'; // for icons
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SocketProvider } from '../context/SocketContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const LogedInTabs = ({ userName, setLogedIn }) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'Purchase') {
          iconName = 'flash';
        } else if (route.name === 'History') {
          iconName = 'time';
        } else if (route.name === 'Settings') {
          iconName = 'settings';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      headerShown: false, // This hides the upper titles
      tabBarStyle: { paddingVertical: 5 }, // Adding padding to the navbar
      tabBarLabelStyle: { paddingBottom: 5 }, // Adding padding to the labels
    })}
    tabBarOptions={{
      activeTintColor: '#f99e00',
      inactiveTintColor: 'gray',
    }}
  >
    <Tab.Screen name="Home">
      {props => <HomeTab {...props} userName={userName} />}
    </Tab.Screen>
    <Tab.Screen name="Purchase" component={PurchaseTab} />
    <Tab.Screen name="History" component={HistoryTab} />
    <Tab.Screen name="Settings">
      {props => <SettingsTab {...props} setLogedIn={setLogedIn} userName={userName} />}
    </Tab.Screen>
  </Tab.Navigator>
);

const LogedIn = ({ setLogedIn }) => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      const name = await AsyncStorage.getItem('userName');
      const email = await AsyncStorage.getItem('userEmail'); // Fetch email if needed
      const id = await AsyncStorage.getItem('userId'); // Fetch user ID if needed
      if (name) {
        setUserName(name);
      }
    };
    fetchUserName();
  }, []);

  return (
    <SocketProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main">
            {props => <LogedInTabs {...props} userName={userName} setLogedIn={setLogedIn} />}
          </Stack.Screen>
          <Stack.Screen name="Simulation" component={Simulation} />
        </Stack.Navigator>
      </NavigationContainer>
    </SocketProvider>
  );
};

export default LogedIn;
