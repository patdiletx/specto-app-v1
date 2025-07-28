import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { LatLng } from 'react-native-maps';

// Definimos las propiedades que recibirá el componente
interface MissionRequestModalProps {
  visible: boolean;
  onClose: () => void;
  coordinate: LatLng | null;
  onSubmit: (duration: number) => void;
}

// Definimos nuestras tarifas (RF4.1)
const TARIFA_BASE = 2.0; // Tarifa fija por iniciar una misión
const PRECIO_POR_MINUTO = 0.5; // Costo por cada minuto de transmisión

export default function MissionRequestModal({
  visible,
  onClose,
  coordinate,
  onSubmit,
}: MissionRequestModalProps) {
  const [duration, setDuration] = useState(10); // Duración inicial en minutos

  // Función para calcular el costo estimado
  const calculateCost = () => {
    return TARIFA_BASE + duration * PRECIO_POR_MINUTO;
  };

  // Función para incrementar la duración
  const increaseDuration = () => {
    setDuration(d => d + 5);
  };

  // Función para decrementar la duración
  const decreaseDuration = () => {
    setDuration(d => Math.max(5, d - 5)); // Mínimo de 5 minutos
  };

  if (!coordinate) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Confirmar Misión</Text>
          
          <Text style={styles.label}>Ubicación seleccionada:</Text>
          <Text style={styles.coordsText}>
            {coordinate.latitude.toFixed(4)}, {coordinate.longitude.toFixed(4)}
          </Text>

          <Text style={styles.label}>Duración (minutos):</Text>
          <View style={styles.durationContainer}>
            <TouchableOpacity style={styles.durationButton} onPress={decreaseDuration}>
              <Text style={styles.durationButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.durationText}>{duration}</Text>
            <TouchableOpacity style={styles.durationButton} onPress={increaseDuration}>
              <Text style={styles.durationButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Costo Estimado:</Text>
          <Text style={styles.costText}>${calculateCost().toFixed(2)}</Text>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => onSubmit(duration)}
          >
            <Text style={styles.submitButtonText}>Confirmar y Crear Misión</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '85%',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#475569',
        marginTop: 15,
        alignSelf: 'flex-start',
    },
    coordsText: {
        fontSize: 14,
        color: '#1e293b',
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    durationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    durationButton: {
        backgroundColor: '#e2e8f0',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    durationButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#3b82f6',
    },
    durationText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginHorizontal: 20,
    },
    costText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#16a34a',
        marginVertical: 10,
    },
    submitButton: {
        backgroundColor: '#3b82f6',
        borderRadius: 20,
        padding: 15,
        elevation: 2,
        marginTop: 20,
        width: '100%',
    },
    submitButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
    closeButton: {
        marginTop: 15,
    },
    closeButtonText: {
        color: '#64748b',
        fontSize: 14,
    },
});
