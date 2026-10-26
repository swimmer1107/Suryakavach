export type RiskLevel = 'safe' | 'moderate' | 'high' | 'critical';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';
export type AlertSeverity = 'critical' | 'high' | 'moderate' | 'low';
export type DataSourceStatus = 'live' | 'simulated' | 'historical' | 'demo' | 'offline';

export interface Substation {
  id: string;
  name: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  voltageLevel: number; // kV
  transformerAge: number; // years
  load: number; // percentage
  transmissionExposure: 'low' | 'moderate' | 'high' | 'very_high';
  historicalExposure: number; // 0-5
  gvi: number; // 0-100
  estimatedGIC: number; // Amperes
  status: RiskLevel;
  region: string;
  capacity: number; // MVA
  lastInspection: string;
  coordinates: [number, number];
}

export interface StormData {
  id: string;
  name: string;
  kp: number;
  solarWindSpeed: number; // km/s
  bz: number; // nT (negative = southward)
  density: number; // particles/cm³
  xrayFlux: string; // e.g. "M5.8"
  cmeVelocity: number; // km/s
  predictedArrival: string; // ISO datetime
  confidence: number; // percentage
  severity: 'G1' | 'G2' | 'G3' | 'G4' | 'G5';
  status: 'approaching' | 'active' | 'subsiding' | 'passed';
  earthDirected: boolean;
}

export interface Alert {
  id: string;
  alertNumber: string;
  severity: AlertSeverity;
  title: string;
  substationId?: string;
  substationName?: string;
  gvi?: number;
  estimatedGIC?: number;
  timestamp: string;
  status: AlertStatus;
  recommendedActions: string[];
  affectedSubstations?: number;
  criticalSubstations?: number;
  region?: string;
  impactWindow?: string;
  message: string;
}

export interface ChartDataPoint {
  time: string;
  value: number;
  label?: string;
}

export interface StormTimelineEvent {
  timeOffset: number; // minutes from T0
  label: string;
  description: string;
  kp: number;
  solarWindSpeed: number;
  bz: number;
  density: number;
  criticalSubstations: number;
  highSubstations: number;
  moderateSubstations: number;
  safeSubstations: number;
  alertTriggered?: boolean;
}

export interface DataSource {
  id: string;
  name: string;
  shortName: string;
  status: DataSourceStatus;
  latency: number; // ms
  lastUpdated: string;
  recordsProcessed: number;
  uptime: number; // percentage
  description: string;
  endpoint?: string;
}

export interface SystemService {
  id: string;
  name: string;
  status: 'operational' | 'degraded' | 'offline';
  latency: number;
  uptime: number;
  requestsPerMin: number;
  lastCheck: string;
}

export interface ReplayScenario {
  id: string;
  name: string;
  year: number;
  date: string;
  description: string;
  maxKp: number;
  maxGVI: number;
  affectedSubstations: number;
  criticalSubstations: number;
  duration: number; // minutes
  timeline: StormTimelineEvent[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'GRID_OPERATOR' | 'ADMIN';
  region: string;
}

export interface Notification {
  id: string;
  type: 'critical' | 'high' | 'moderate' | 'system' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}
