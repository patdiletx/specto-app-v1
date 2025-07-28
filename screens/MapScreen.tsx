import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import type { LatLng } from 'react-native-maps';
import MissionRequestModal from '../components/MissionRequestModal'; // Importamos el modal
import { supabase } from '../lib/supabase'; // Importamos supabase
import { useAuth } from '../context/AuthContext'; // Importamos el hook de autenticación

export default function MapScreen() {
  const { session } = useAuth(); // Obtenemos la sesión del usuario
  const [selectedCoord, setSelectedCoord] = useState<LatLng | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const initialRegion: Region = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const handleMapPress = (event: any) => {
    const coords = event.nativeEvent.coordinate;
    setSelectedCoord(coords);
  };

  // Esta función se ejecuta al confirmar la misión en el modal
  const handleMissionSubmit = async (duration: number) => {
    if (!selectedCoord || !session?.user) return;

    setModalVisible(false); // Cerramos el modal

    // Convertimos las coordenadas al formato PostGIS (Point)
    const location = `POINT(${selectedCoord.longitude} ${selectedCoord.latitude})`;

    // Insertamos la nueva misión en la base de datos
    const { data, error } = await supabase
      .from('missions')
      .insert({
        explorer_id: session.user.id,
        location: location,
        requested_duration_minutes: duration,
      })
      .select()
      .single();

    if (error) {
      Alert.alert('Error', 'No se pudo crear la misión. Inténtalo de nuevo.');
      console.error(error);
    } else {
      Alert.alert(
        '¡Misión Creada!',
        `Tu solicitud ha sido enviada. ID de la misión: ${data.id}`
      );
      setSelectedCoord(null); // Limpiamos el marcador del mapa
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        onPress={handleMapPress}
      >
        {selectedCoord && (
          <Marker
            coordinate={selectedCoord}
            title="Ubicación de la Misión"
          />
        )}
      </MapView>
      
      {/* El botón ahora controla la visibilidad del modal */}
      {selectedCoord && !isModalVisible && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>Solicitar Misión Aquí</Text>
          </TouchableOpacity>
        </View>
      )}

      {!selectedCoord && (
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Toca el mapa para seleccionar una ubicación</Text>
        </View>
      )}

      {/* Renderizamos el modal y le pasamos las props necesarias */}
      <MissionRequestModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        coordinate={selectedCoord}
        onSubmit={handleMissionSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    position: 'absolute',
    top: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  overlayText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    width: '80%',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
