
import React from 'react';

interface CardProps {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, icon, children, className = '' }) => {
  return (
    <div className={`bg-slate-800 p-6 rounded-xl shadow-2xl transition-all hover:shadow-sky-500/30 ${className}`}>
      {title && (
        <div className="flex items-center mb-4">
          {icon && <span className="mr-2">{icon}</span>}
          <h3 className="text-lg font-semibold text-sky-200">{title}</h3>
        </div>
      )}
      <div className="text-slate-300 text-sm">
        {children}
      </div>
    </div>
  );
};
    