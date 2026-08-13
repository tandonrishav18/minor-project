export type ViewMode = 
  | 'landing' 
  | 'overview' 
  | 'map' 
  | 'models' 
  | 'nodes' 
  | 'settings' 
  | 'alerts';

export type NodeStatus = 'Online' | 'Warning' | 'Maint' | 'Offline';
export type SeverityLevel = 'Critical' | 'Warning' | 'Info';

export interface EdgeNode {
  id: string;
  name: string;
  status: NodeStatus;
  locationName: string;
  lat: number;
  lng: number;
  temperature: number; // in Celsius
  humidity: number; // in percentage
  aqi: number;
  anomalyScore: number;
  powerType: 'Battery' | 'AC';
  batteryLevel?: number;
  lastPing: string;
  firmwareVersion: string;
  hardwareModel: string;
  mapX?: number; // percentage on map overlay
  mapY?: number; // percentage on map overlay
}

export interface AnomalyEvent {
  id: string;
  timestamp: string;
  sensorId: string;
  sensorName?: string;
  type: string;
  primarySensor: string;
  rawReading: string;
  anomalyScore: number;
  severity: SeverityLevel;
  status: 'Active' | 'Investigating' | 'Resolved';
  description?: string;
  potentialCause?: string;
}

export interface TelemetryPoint {
  time: string;
  timestamp: number;
  temperature: number;
  humidity: number;
  aqi: number;
  pressure: number;
}

export interface PcaPoint {
  id: string;
  x: number;
  y: number;
  isAnomaly: boolean;
  score: number;
  nodeId: string;
  label: string;
}

export interface SystemSettings {
  projectName: string;
  dataRetention: '30 Days' | '90 Days' | '1 Year' | 'Indefinite';
  unitPreference: 'Celsius' | 'Fahrenheit';
  masterApiKey: string;
  alertWebhookUrl: string;
  backendEndpoint: string;
  isolationForestSensitivity: number; // 0.01 to 0.20
  trainingFrequency: 'hourly' | 'daily';
}
