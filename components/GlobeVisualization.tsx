
import React from 'react';
import { Flight } from '../types';
import { PaperAirplaneIcon } from './IconComponents';

interface GlobeVisualizationProps {
  flights: Flight[];
}

export const GlobeVisualization: React.FC<GlobeVisualizationProps> = ({ flights }) => {
  // Simplified representation: a static globe SVG with animated flight icons
  // A real implementation would involve complex mapping libraries (e.g., D3, Deck.gl)

  return (
    <Card title="Vista Traffico Aereo Globale" className="h-full">
      <div className="relative w-full aspect-video bg-slate-700 rounded-lg overflow-hidden p-4 flex items-center justify-center">
        {/* Globe Background (Placeholder SVG) */}
        <svg viewBox="0 0 200 200" className="w-full h-full opacity-30 absolute inset-0">
          <circle cx="100" cy="100" r="90" fill="none" stroke="#475569" strokeWidth="2"/>
          {/* Simplified continents - very abstract */}
          <path d="M60,60 Q90,40 130,70 T160,100 Q140,150 100,160 T50,120 Q30,90 60,60 Z" fill="#334155" opacity="0.5"/>
          <path d="M100,20 Q120,50 100,80 T70,60 Q80,30 100,20 Z" fill="#334155" opacity="0.5"/>
           {/* Grid lines */}
          <line x1="100" y1="10" x2="100" y2="190" stroke="#475569" strokeWidth="0.5" />
          <line x1="10" y1="100" x2="190" y2="100" stroke="#475569" strokeWidth="0.5" />
          <ellipse cx="100" cy="100" rx="90" ry="30" fill="none" stroke="#475569" strokeWidth="0.5" strokeDasharray="2 2" />
          <ellipse cx="100" cy="100" rx="60" ry="80" fill="none" stroke="#475569" strokeWidth="0.5" strokeDasharray="2 2" />
        </svg>
        
        {/* Animated Flight Icons */}
        <div className="relative w-full h-full">
          {flights.slice(0, 10).map((flight, index) => ( // Show max 10 flights for performance
            <div
              key={flight.id}
              className="absolute animate-pulse"
              style={{
                left: `${(flight.lon + 180) / 360 * 100}%`, // Normalize lon to 0-100%
                top: `${(90 - flight.lat) / 180 * 100}%`,    // Normalize lat to 0-100% (inverted)
                transform: `translate(-50%, -50%) rotate(${flight.heading}deg)`,
                animationDelay: `${index * 0.2}s`,
              }}
            >
              <PaperAirplaneIcon className="w-4 h-4 text-sky-400 opacity-75" />
            </div>
          ))}
        </div>
         <div className="absolute bottom-2 right-2 text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded">
          {flights.length} voli tracciati
        </div>
      </div>
       <p className="mt-2 text-sm text-slate-400">
        Posizioni di volo illustrative in tempo reale ottimizzate da Q-Traffic AI. 
        La visualizzazione effettiva richiederebbe una mappatura globale precisa.
      </p>
    </Card>
  );
};

// Re-import Card to fix scope issue if not already imported at top level
import { Card } from './Card';