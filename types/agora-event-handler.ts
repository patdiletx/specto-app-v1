import type { IRtcEngineEventHandler } from 'react-native-agora';

// Este tipo utiliza la definición oficial de la librería para todos los manejadores de eventos,
// haciéndolos opcionales. Es la forma más robusta y escalable.
export type AgoraEventHandler = Partial<IRtcEngineEventHandler>;
