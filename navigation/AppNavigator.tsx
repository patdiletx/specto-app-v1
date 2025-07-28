import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

// Importamos nuestras nuevas pantallas
import MapScreen from '../screens/MapScreen';
import AccountScreen from '../screens/AccountScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { session } = useAuth();

  // Creamos un componente "wrapper" para poder pasar la sesión a la pantalla de Perfil
  const AccountScreenWrapper = () => <AccountScreen session={session!} />;

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#3b82f6',
          tabBarInactiveTintColor: 'gray',
          headerShown: false, // Ocultamos la barra de título por defecto
        }}
      >
        <Tab.Screen 
          name="Mapa" 
          component={MapScreen} 
          // Aquí podríamos añadir íconos en el futuro
        />
        <Tab.Screen 
          name="Perfil" 
          component={AccountScreenWrapper}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
