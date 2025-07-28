import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';

// Definimos los parámetros que esta pantalla puede recibir desde la navegación
type MissionInProgressScreenRouteProp = RouteProp<{
  MissionDetails: { missionId: number; duration: number };
}, 'MissionDetails'>;

export default function MissionInProgressScreen() {
  const route = useRoute<MissionInProgressScreenRouteProp>();
  const { missionId, duration } = route.params;

  const handleStartStreaming = () => {
    // En la siguiente fase, esto nos llevará a la pantalla de Agora.io
    Alert.alert("Iniciar Transmisión", `Próximamente: Iniciar streaming para la misión ${missionId}.`);
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
