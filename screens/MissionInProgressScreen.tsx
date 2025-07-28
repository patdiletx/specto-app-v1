import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from '../lib/supabase';

// Definimos los tipos para el Stack de navegación actualizado
type MissionStackParamList = {
  MissionsList: undefined;
  MissionInProgress: { missionId: number; duration: number };
  Streaming: { missionId: number; channelName: string }; // <-- Añadimos la nueva pantalla y sus parámetros
};

type MissionInProgressRouteProp = RouteProp<MissionStackParamList, 'MissionInProgress'>;
type MissionInProgressNavigationProp = NativeStackNavigationProp<MissionStackParamList, 'MissionInProgress'>;

export default function MissionInProgressScreen() {
  const navigation = useNavigation<MissionInProgressNavigationProp>();
  const route = useRoute<MissionInProgressRouteProp>();
  const { missionId, duration } = route.params;

  const handleStartStreaming = async () => {
    // Generamos un nombre de canal único para la misión
    const channelName = `mission_${missionId}`;

    // Actualizamos la misión en la base de datos para incluir el nombre del canal
    // y cambiar el estado a 'in_progress'. Esto notificará al Explorador.
    const { error } = await supabase
      .from('missions')
      .update({ status: 'in_progress', agora_channel_name: channelName })
      .eq('id', missionId);
    
    if (error) {
      Alert.alert("Error", "No se pudo iniciar la misión. Inténtalo de nuevo.");
    } else {
      // Navegamos a la pantalla de streaming
      navigation.navigate('Streaming', { missionId, channelName });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Misión Aceptada</Text>
      <View style={styles.detailsCard}>
        <Text style={styles.detailText}>ID de Misión: {missionId}</Text>
        <Text style={styles.detailText}>Duración: {duration} minutos</Text>
        <Text style={styles.instructions}>Dirígete a la ubicación marcada y presiona "Iniciar Transmisión" cuando estés listo.</Text>
      </View>
      <TouchableOpacity style={styles.streamButton} onPress={handleStartStreaming}>
        <Text style={styles.streamButtonText}>Iniciar Transmisión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f8',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 30,
    },
    detailsCard: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 25,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        marginBottom: 40,
    },
    detailText: {
        fontSize: 18,
        marginBottom: 10,
    },
    instructions: {
        fontSize: 16,
        color: '#475569',
        marginTop: 15,
        textAlign: 'center',
    },
    streamButton: {
        backgroundColor: '#ef4444',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
    },
    streamButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
