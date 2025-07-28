import React, { useState } from 'react';
import { Alert, StyleSheet, View, Text, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { supabase } from '../lib/supabase';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Función para iniciar sesión con email y contraseña
  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert('Error', error.message);
    setLoading(false);
  }

  // Función para registrar un nuevo usuario
  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert('Error', error.message);
    else Alert.alert('¡Éxito!', 'Revisa tu correo para verificar tu cuenta.');
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Specto</Text>
        <Text style={styles.description}>Tu ventana al mundo, en vivo.</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@direccion.com"
          autoCapitalize={'none'}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Contraseña"
          autoCapitalize={'none'}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.signInButton]}
          disabled={loading}
          onPress={() => signInWithEmail()}
        >
          <Text style={styles.buttonText}>{loading ? 'Cargando...' : 'Iniciar Sesión'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.signUpButton]}
          disabled={loading}
          onPress={() => signUpWithEmail()}
        >
          <Text style={styles.buttonText}>{loading ? 'Cargando...' : 'Registrarse'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  headerContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  header: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  description: {
    fontSize: 16,
    color: '#475569',
    marginTop: 8,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    fontSize: 16,
    marginBottom: 12,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  signInButton: {
    backgroundColor: '#3b82f6',
  },
  signUpButton: {
    backgroundColor: '#16a34a',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
