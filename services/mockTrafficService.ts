
import { Flight, AnalyzedVariable, SystemStatus, ImpactMetrics, TrafficData } from '../types';

const INITIAL_FLIGHTS = 5000;
const MAX_FLIGHTS_DISPLAY = 50; // For visualization performance

const random = (min: number, max: number) => Math.random() * (max - min) + min;
const randomInt = (min: number, max: number) => Math.floor(random(min, max));

const createRandomFlight = (id: string): Flight => ({
  id,
  callsign: `QTF${randomInt(100, 9999)}`,
  lat: random(-90, 90),
  lon: random(-180, 180),
  altitude: randomInt(10000, 41000), // feet
  speed: randomInt(300, 600), // knots
  heading: randomInt(0, 359),
});

let flightStore: Flight[] = Array.from({ length: INITIAL_FLIGHTS }, (_, i) => createRandomFlight(`flight-${i}`));

const updateFlightData = () => {
  flightStore.forEach(flight => {
    flight.lat += random(-0.5, 0.5);
    flight.lon += random(-0.5, 0.5);
    flight.altitude = Math.max(1000, Math.min(45000, flight.altitude + randomInt(-500, 500)));
    flight.speed = Math.max(100, Math.min(700, flight.speed + randomInt(-10, 10)));
    flight.heading = (flight.heading + randomInt(-5, 5) + 360) % 360;

    // Boundary checks for lat/lon (simplified wrap-around for longitude)
    if (flight.lat > 90) flight.lat = 90;
    if (flight.lat < -90) flight.lat = -90;
    if (flight.lon > 180) flight.lon -= 360;
    if (flight.lon < -180) flight.lon += 360;
  });
};


export const mockTrafficService = (callback: (data: TrafficData) => void) => {
  let intervalId: number | undefined;
  let tickCount = 0;

  const generateData = (): TrafficData => {
    tickCount++;
    updateFlightData();

    const variablesAnalyzed: AnalyzedVariable[] = [
      { name: 'Condizioni Meteo Globali', value: ['Sereno', 'Parzialmente Nuvoloso', 'Zone Temporalesche'][randomInt(0,2)], status: ['Optimal', 'Normal', 'Warning'][randomInt(0,2)] as any },
      { name: 'Congestione Spazio Aereo', value: `${randomInt(10,80)}%`, unit: 'Capacità', status: randomInt(0,10) > 7 ? 'Warning' : 'Normal' },
      { name: 'Flussi Dati Volo in Tempo Reale', value: flightStore.length, unit: 'Attivi', status: 'Optimal' },
      { name: 'Allarmi Emergenza Potenziali', value: randomInt(0, 3), unit: 'Attivi', status: randomInt(0,10) > 8 ? 'Critical' : 'Normal' },
      { name: 'Conformità Preferenze Piloti', value: `${randomInt(90,99)}%`, status: 'Optimal' },
      { name: 'Disponibilità Piste (Hub Principali)', value: `${randomInt(75,95)}%`, status: 'Normal' },
    ];

    const systemStatus: SystemStatus = {
      quantumProcessingLoad: random(30, 70) + Math.sin(tickCount * 0.1) * 10,
      iotSensorConnections: flightStore.length * randomInt(3,5) + randomInt(1000,5000),
      dataThroughputGbps: random(50, 200) + Math.cos(tickCount * 0.05) * 20,
      aiModelAccuracy: 98.5 + random(-0.2, 0.2),
    };

    const impactMetrics: ImpactMetrics = {
      totalFlightsManaged: flightStore.length + tickCount * 10,
      onTimePerformance: 92.5 + random(-1.5, 1.5) + Math.sin(tickCount*0.2)*1,
      averageDelayReductionMinutes: 15 + random(-2, 2),
      safetyIncidentsPrevented: 12 + Math.floor(tickCount / 10),
      fuelSavedMillionsLiters: 250 + tickCount * 0.5 + random(-10,10),
      co2EmissionsReducedKiloTons: 750 + tickCount * 1.5 + random(-20,20),
      efficiencyGainPercent: 20 + random(-1,1) + Math.cos(tickCount * 0.15)*0.5,
    };
    
    // Return a slice of flights for performance reasons
    const displayedFlights = flightStore.slice(0, MAX_FLIGHTS_DISPLAY);

    return {
      flights: displayedFlights,
      variablesAnalyzed,
      systemStatus,
      impactMetrics,
    };
  };

  return {
    start: () => {
      if (intervalId) clearInterval(intervalId);
      callback(generateData()); // Initial call
      intervalId = window.setInterval(() => {
        callback(generateData());
      }, 2000); // Update every 2 seconds
    },
    stop: () => {
      if (intervalId) clearInterval(intervalId);
      intervalId = undefined;
    },
  };
};

export type { TrafficData };