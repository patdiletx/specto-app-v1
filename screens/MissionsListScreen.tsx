import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Database } from '../types/database.types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Mission = Database['public']['Tables']['missions']['Row'];
// Definimos los tipos para el Stack de navegación que acabamos de crear
type MissionStackParamList = {
  MissionsList: undefined;
  MissionInProgress: { missionId: number; duration: number };
};
type MissionsListNavigationProp = NativeStackNavigationProp<MissionStackParamList, 'MissionsList'>;

export default function MissionsListScreen() {
  const { session } = useAuth();
  const navigation = useNavigation<MissionsListNavigationProp>();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) fetchMissions();
  }, [session]);

  const fetchMissions = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('missions').select('*').eq('status', 'pending');
    if (error) Alert.alert('Error', 'No se pudieron cargar las misiones.');
    else setMissions(data || []);
    setLoading(false);
  };

  // Lógica actualizada para aceptar una misión
  const handleAcceptMission = async (mission: Mission) => {
    if (!session?.user) return;
    
    const { error } = await supabase
      .from('missions')
      .update({ status: 'accepted', scout_id: session.user.id })
      .eq('id', mission.id);

    if (error) {
      Alert.alert('Error', 'No se pudo aceptar la misión. Quizás ya fue tomada.');
      fetchMissions(); // Refrescamos la lista
    } else {
      // Si todo sale bien, navegamos a la pantalla de "Misión en Progreso"
      navigation.navigate('MissionInProgress', {
        missionId: mission.id,
        duration: mission.requested_duration_minutes,
      });
    }
  };

  const renderMissionItem = ({ item }: { item: Mission }) => (
    <View style={styles.missionItem}>
      <Text style={styles.missionId}>Misión ID: {item.id}</Text>
      <Text>Duración: {item.requested_duration_minutes} minutos</Text>
      <TouchableOpacity 
        style={styles.acceptButton} 
        onPress={() => handleAcceptMission(item)}
      >
        <Text style={styles.acceptButtonText}>Aceptar</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) return <ActivityIndicator style={styles.loader} size="large" />;

  return (
    <View style={styles.container}>
      <FlatList
        data={missions}
        renderItem={renderMissionItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay misiones disponibles.</Text>}
        onRefresh={fetchMissions}
        refreshing={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f8',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    missionItem: {
        backgroundColor: 'white',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    missionId: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    acceptButton: {
        backgroundColor: '#16a34a',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 15,
    },
    acceptButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: 'gray',
    },
});
