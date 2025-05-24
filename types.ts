
export interface Flight {
  id: string;
  callsign: string;
  lat: number;
  lon: number;
  altitude: number; // in feet
  speed: number; // in knots
  heading: number; // degrees from North
}

export interface AnalyzedVariable {
  name: string;
  value: string | number;
  unit?: string;
  status?: 'Optimal' | 'Warning' | 'Critical' | 'Normal';
}

export interface SystemStatus {
  quantumProcessingLoad: number; // percentage
  iotSensorConnections: number;
  dataThroughputGbps: number;
  aiModelAccuracy: number; // percentage
}

export interface ImpactMetrics {
  totalFlightsManaged: number;
  onTimePerformance: number; // percentage
  averageDelayReductionMinutes: number;
  safetyIncidentsPrevented: number; // per day
  fuelSavedMillionsLiters: number; // annually
  co2EmissionsReducedKiloTons: number; // annually
  efficiencyGainPercent: number;
}

export interface TrafficData {
  flights: Flight[];
  variablesAnalyzed: AnalyzedVariable[];
  systemStatus: SystemStatus;
  impactMetrics: ImpactMetrics;
}
    