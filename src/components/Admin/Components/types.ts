// src/components/Admin/types.ts

export type DeviceType = 'ESP32' | 'BLUETOOTH' | 'RASPBERRY_PI' | 'NRF';

// Unified status type
export type ConnectionStatus = 'CONNECTED' | 'DISCONNECTED' | 'ERROR';

export type SignalStage = 
  | 'WAITING'
  | 'SENDING'
  | 'RECEIVED'
  | 'RETURNING'
  | 'COMPLETE'
  | 'ERROR';

export type HealthStatus = 'HEALTHY' | 'CAUTION' | 'CRITICAL';

export type MessageMode = 'AUTO' | 'MANUAL';

export type ConnectionType = 'WIFI' | 'BLUETOOTH' | 'USB';

export interface SystemDevice {
  id: string;
  name: string;
  type: ConnectionType;
  status: ConnectionStatus;
  lastSeen: string;
}

export interface Diagnostic {
  uptime: string;
  lastError?: string;
  batteryLevel?: number;
  temperature?: number;
}

export interface Device {
  id: string;
  type: DeviceType;
  name: string;
  status: ConnectionStatus;
  lastResponse: string;
  signalStrength: number;
  configurationComplete: boolean;
  currentStage: SignalStage;
  health: HealthStatus;
  messageMode: MessageMode;
  logs: Array<{
    timestamp: string;
    message: string;
    type: 'info' | 'warning' | 'error';
  }>;
  diagnostics: Diagnostic;
}

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
  deviceId: string;
}

export interface DisplayPreviewProps {
  width: number;
  height: number;
  content: string;
  deviceName: string;
}