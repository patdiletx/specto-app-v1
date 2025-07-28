import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { StyleSheet, View, Alert, Text, TextInput, TouchableOpacity } from 'react-native';
import { Session } from '@supabase/supabase-js';

// Este es el mismo componente de Perfil que teníamos, ahora como una pantalla dedicada.
export default function AccountScreen({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, full_name`)
        .eq('id', session?.user.id)
        .single();
        
      if (error && status !== 406) throw error;

      if (data) {
        setUsername(data.username || '');
        setFullName(data.full_name || '');
      }
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ username, full_name }: { username: string; full_name: string }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const updates = {
        id: session?.user.id,
        username,
        full_name,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;
      Alert.alert('¡Éxito!', 'Perfil actualizado correctamente.');
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput style={[styles.input, styles.disabledInput]} value={session?.user?.email} editable={false} />

      <Text style={styles.label}>Nombre de Usuario</Text>
      <TextInput style={styles.input} value={username || ''} onChangeText={(text) => setUsername(text)} />
      
      <Text style={styles.label}>Nombre Completo</Text>
      <TextInput style={styles.input} value={fullName || ''} onChangeText={(text) => setFullName(text)} />

      <TouchableOpacity
        style={styles.button}
        onPress={() => updateProfile({ username, full_name: fullName })}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Cargando...' : 'Actualizar Perfil'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.signOutButton]} onPress={() => supabase.auth.signOut()}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  label: {
    color: '#475569',
    marginBottom: 5,
    fontSize: 16,
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
    marginBottom: 15,
  },
  disabledInput: {
    backgroundColor: '#e2e8f0',
    color: '#64748b',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  signOutButton: {
    backgroundColor: '#ef4444',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
