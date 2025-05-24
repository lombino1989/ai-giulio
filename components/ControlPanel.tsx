

import React from 'react';
import { AnalyzedVariable, SystemStatus } from '../types';
import { Card } from './Card';
import { ChipIcon, CloudIcon, CogIcon, ExclamationTriangleIcon, FireIcon, LightBulbIcon, MapIcon, ServerIcon, VariableIcon, WifiIcon } from './IconComponents';

interface ControlPanelProps {
  variables: AnalyzedVariable[];
  systemStatus: SystemStatus;
}

const getStatusColor = (status?: 'Optimal' | 'Warning' | 'Critical' | 'Normal') => {
  switch (status) {
    case 'Optimal': return 'text-green-400';
    case 'Warning': return 'text-yellow-400';
    case 'Critical': return 'text-red-400';
    default: return 'text-slate-300';
  }
};

const getVariableIcon = (variableName: string): React.ReactNode => {
  const lowerName = variableName.toLowerCase();
  if (lowerName.includes('meteo')) return <CloudIcon className="w-5 h-5 mr-2 text-blue-400" />;
  if (lowerName.includes('congestione')) return <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-yellow-400" />;
  if (lowerName.includes('dati volo')) return <MapIcon className="w-5 h-5 mr-2 text-green-400" />;
  if (lowerName.includes('emergenza')) return <FireIcon className="w-5 h-5 mr-2 text-red-400" />;
  if (lowerName.includes('preferenze piloti')) return <CogIcon className="w-5 h-5 mr-2 text-indigo-400" />;
  if (lowerName.includes('piste')) return <VariableIcon className="w-5 h-5 mr-2 text-purple-400" />; // For 'Disponibilità Piste'
  return <LightBulbIcon className="w-5 h-5 mr-2 text-slate-400" />;
}


export const ControlPanel: React.FC<ControlPanelProps> = ({ variables, systemStatus }) => {
  return (
    <div className="space-y-6">
      <Card title="Variabili di Sistema Monitorate" icon={<ChipIcon className="w-6 h-6 text-sky-400" />}>
        <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {variables.map((variable, index) => (
            <li key={index} className="flex justify-between items-center text-sm p-2 bg-slate-700/50 rounded-md">
              <span className="flex items-center text-slate-300">
                {getVariableIcon(variable.name)}
                {variable.name}
              </span>
              <span className={`${getStatusColor(variable.status)} font-semibold`}>
                {variable.value} {variable.unit}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Stato Nucleo IA Quantistico" icon={<ServerIcon className="w-6 h-6 text-sky-400" />}>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Carico Elaborazione Quantistica:</span>
            <span className="font-semibold text-green-400">{systemStatus.quantumProcessingLoad.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2.5">
            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${systemStatus.quantumProcessingLoad}%` }}></div>
          </div>

          <div className="flex justify-between pt-2">
            <span className="text-slate-400">Connessioni Sensori IoT:</span>
            <span className="font-semibold text-blue-400">{systemStatus.iotSensorConnections}</span>
          </div>
           <div className="flex justify-between">
            <span className="text-slate-400">Precisione Modello IA:</span>
            <span className="font-semibold text-purple-400">{systemStatus.aiModelAccuracy.toFixed(2)}%</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Throughput Dati:</span>
            <span className="font-semibold text-teal-400">{systemStatus.dataThroughputGbps.toFixed(2)} Gbps</span>
          </div>
        </div>
      </Card>
    </div>
  );
};