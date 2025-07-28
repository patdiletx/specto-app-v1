import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

import MapScreen from '../screens/MapScreen';
import AccountScreen from '../screens/AccountScreen';
import MissionsListScreen from '../screens/MissionsListScreen';
import MissionInProgressScreen from '../screens/MissionInProgressScreen';
import StreamingScreen from '../screens/StreamingScreen'; // <-- Importamos la nueva pantalla

const Tab = createBottomTabNavigator();
const MissionStack = createNativeStackNavigator();

function MissionStackNavigator() {
  return (
    <MissionStack.Navigator>
      <MissionStack.Screen name="MissionsList" component={MissionsListScreen} options={{ title: 'Misiones Disponibles' }} />
      <MissionStack.Screen name="MissionInProgress" component={MissionInProgressScreen} options={{ title: 'Misión en Progreso' }} />
      {/* AÑADIMOS LA PANTALLA DE STREAMING AL STACK */}
      <MissionStack.Screen name="Streaming" component={StreamingScreen} options={{ headerShown: false }} />
    </MissionStack.Navigator>
  );
}

export default function AppNavigator() {
  const { session } = useAuth();
  const AccountScreenWrapper = () => <AccountScreen session={session!} />;

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#3b82f6',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        }}
      >
        <Tab.Screen name="Mapa" component={MapScreen} />
        <Tab.Screen name="Misiones" component={MissionStackNavigator} />
        <Tab.Screen name="Perfil" component={AccountScreenWrapper} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
