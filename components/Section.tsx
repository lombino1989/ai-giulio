
import React from 'react';

interface SectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ title, icon, children, className = '' }) => {
  return (
    <section className={`py-6 ${className}`}>
      <div className="flex items-center mb-6">
        {icon && <span className="mr-3">{icon}</span>}
        <h2 className="text-2xl md:text-3xl font-bold text-sky-300 border-b-2 border-sky-500 pb-2">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
};
    