
import React from 'react';
import { CubeTransparentIcon } from './IconComponents';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-800 shadow-lg">
      <div className="container mx-auto px-4 py-5 flex items-center">
        <CubeTransparentIcon className="w-10 h-10 text-sky-400 mr-3" />
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Q-Traffic AI
        </h1>
        <span className="ml-2 mt-1 text-xs text-sky-400 font-mono">STATO SISTEMA: ONLINE</span>
      </div>
    </header>
  );
};