import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { createAgoraRtcEngine, RtcSurfaceView, IRtcEngine, RtcConnection } from 'react-native-agora';
import type { AgoraEventHandler } from '../types/agora-event-handler'; // Crearemos este archivo
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Camera } from 'expo-camera';

// --- CONFIGURACIÓN DE AGORA ---
// ¡IMPORTANTE! Reemplaza estos valores con los de tu proyecto de Agora.io
const AGORA_APP_ID = 'ef71d45ff3ff46f1b82dff852d6414d3'; 
const TEMP_TOKEN = '007eJxTYMiYs9jEza9Mo07gor73AZG4C4t+zwr9zHx6d8KeVgZW7/0KDKlp5oYpJqZpacZpaSZmaYZJFkYpaWkWpkYpZiaGJinGZafaMhoCGRn+uXQyMjJAIIjPwlCSWlzCwAAAHb4feA=='; 

type StreamingScreenRouteProp = RouteProp<{
  Streaming: { missionId: number; channelName: string };
}, 'Streaming'>;

export default function StreamingScreen() {
  const navigation = useNavigation();
  const route = useRoute<StreamingScreenRouteProp>();
  const { missionId, channelName } = route.params;

  const [hasPermission, setHasPermission] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const engine = useRef<IRtcEngine | null>(null);

  useEffect(() => {
    const initAgora = async () => {
      // Pedir permisos de cámara y micrófono
      const { status } = await Camera.requestCameraPermissionsAsync();
      await Camera.requestMicrophonePermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permisos requeridos", "Necesitamos acceso a la cámara y al micrófono para iniciar la transmisión.");
        navigation.goBack();
        return;
      }
      setHasPermission(true);

      engine.current = createAgoraRtcEngine();
      engine.current.initialize({ appId: AGORA_APP_ID });
      engine.current.enableVideo();

      const agoraHandlers: AgoraEventHandler = {
        onJoinChannelSuccess: (connection: RtcConnection, elapsed: number) => {
          console.log('Scout se ha unido al canal!', connection.channelId);
          setIsJoined(true);
        },
      };
      engine.current.registerEventHandler(agoraHandlers);

      // El Scout se une al canal como HOST (transmisor)
      engine.current.joinChannel(TEMP_TOKEN, channelName, 0, {
        clientRoleType: 1, // 1 = Host
        channelProfile: 1, // 1 = Live Broadcasting
      });
    };

    initAgora();

    // Limpieza al salir de la pantalla
    return () => {
      engine.current?.leaveChannel();
      engine.current?.release();
    };
  }, []);

  const handleEndCall = () => {
    navigation.goBack(); // Por ahora, solo volvemos atrás
  };

  if (!hasPermission) {
    return <View style={styles.container}><Text>Solicitando permisos...</Text></View>;
  }

  return (
    <View style={styles.container}>
      {isJoined ? (
        // Muestra la vista de la cámara local del Scout
        <RtcSurfaceView
          style={styles.localVideo}
          canvas={{ uid: 0, renderMode: 1 }}
        />
      ) : (
        <Text style={{color: 'white'}}>Conectando a la transmisión...</Text>
      )}
      
      <View style={styles.controls}>
        <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
          <Text style={styles.buttonText}>Finalizar Misión</Text>
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
    backgroundColor: 'black',
  },
  localVideo: {
    width: '100%',
    height: '100%',
  },
  controls: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
  },
  endCallButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
