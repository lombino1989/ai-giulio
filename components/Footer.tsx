
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-center py-6 mt-auto">
      <p className="text-sm text-slate-400">
        &copy; {new Date().getFullYear()} Concetto Q-Traffic AI. Tutti i diritti riservati.
      </p>
      <p className="text-xs text-slate-500 mt-1">
        Una dimostrazione della gestione futuristica del traffico aereo.
      </p>
    </footer>
  );
};