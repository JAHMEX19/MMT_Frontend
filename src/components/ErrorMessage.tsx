import React from 'react';

type ErrorMessageProps = {
  children: React.ReactNode;
};

export default function ErrorMessage({ children }: ErrorMessageProps) {
  if (!children) return null; // No renderiza nada si no hay error

  return (
    <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-medium text-red-400/90 animate-fade-in">
      
      {/* Indicador LED Industrial Sutil */}
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
      </span>

      {/* Texto de Error */}
      <span className="leading-none tracking-wide">
        {children}
      </span>
      
    </div>
  );
}