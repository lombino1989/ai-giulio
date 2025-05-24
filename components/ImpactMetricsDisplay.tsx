
import React from 'react';
import { ImpactMetrics } from '../types';
import { Card } from './Card';
import { ArrowTrendingUpIcon, CheckBadgeIcon, ClockIcon, CloudArrowDownIcon, FireIcon, RocketLaunchIcon, ScaleIcon, ShieldCheckIcon } from './IconComponents';

interface ImpactMetricsDisplayProps {
  metrics: ImpactMetrics;
}

const MetricItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number; unit?: string; colorClass: string }> = ({ icon, label, value, unit, colorClass }) => (
  <div className="bg-slate-700/50 p-4 rounded-lg shadow-md flex items-center space-x-3">
    <div className={`p-2 rounded-full bg-slate-600 ${colorClass}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`text-xl font-bold ${colorClass}`}>
        {value} <span className="text-sm font-normal">{unit}</span>
      </p>
    </div>
  </div>
);


export const ImpactMetricsDisplay: React.FC<ImpactMetricsDisplayProps> = ({ metrics }) => {
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-slate-200 mb-4 flex items-center">
        <ArrowTrendingUpIcon className="w-6 h-6 mr-2 text-green-400" />
        Indicatori Chiave di Prestazione
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricItem icon={<RocketLaunchIcon className="w-5 h-5"/>} label="Voli Totali Gestiti" value={metrics.totalFlightsManaged.toLocaleString()} colorClass="text-sky-400" />
        <MetricItem icon={<CheckBadgeIcon className="w-5 h-5"/>} label="Puntualità" value={metrics.onTimePerformance.toFixed(1)} unit="%" colorClass="text-green-400" />
        <MetricItem icon={<ClockIcon className="w-5 h-5"/>} label="Riduzione Media Ritardi" value={metrics.averageDelayReductionMinutes.toFixed(0)} unit="min" colorClass="text-yellow-400" />
        <MetricItem icon={<ShieldCheckIcon className="w-5 h-5"/>} label="Incidenti Prevenuti (Giornaliero)" value={metrics.safetyIncidentsPrevented} colorClass="text-red-400" />
        <MetricItem icon={<FireIcon className="w-5 h-5"/>} label="Carburante Risparmiato (Annuale)" value={metrics.fuelSavedMillionsLiters.toFixed(1)} unit="M L" colorClass="text-orange-400" />
        <MetricItem icon={<CloudArrowDownIcon className="w-5 h-5"/>} label="CO₂ Ridotta (Annuale)" value={metrics.co2EmissionsReducedKiloTons.toFixed(1)} unit="kT" colorClass="text-lime-400" />
         <MetricItem icon={<ScaleIcon className="w-5 h-5"/>} label="Guadagno Efficienza" value={metrics.efficiencyGainPercent.toFixed(1)} unit="%" colorClass="text-teal-400" />
      </div>
    </div>
  );
};