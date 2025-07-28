import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import Auth from './components/Auth';
import AppNavigator from './navigation/AppNavigator'; // Importamos el navegador

const AppLayout = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  // Si hay sesión, muestra el Navegador Principal.
  // Si no, muestra la pantalla de Autenticación.
  return session && session.user ? <AppNavigator /> : <Auth />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
