import React from 'react';

export const LiquidBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#070b14]">
      {/* Deep ambient gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#050a18] via-[#09152e] to-[#040814]" />

      {/* Floating Liquid Orbs with blur */}
      <div 
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-500/20 blur-[100px] animate-liquid-pulse"
        style={{ animationDuration: '14s' }}
      />
      <div 
        className="absolute top-1/3 -right-20 w-[450px] h-[450px] rounded-full bg-sky-600/18 blur-[120px] animate-liquid-pulse"
        style={{ animationDuration: '18s', animationDelay: '-4s' }}
      />
      <div 
        className="absolute -bottom-32 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-700/15 blur-[130px] animate-liquid-pulse"
        style={{ animationDuration: '22s', animationDelay: '-8s' }}
      />
      <div 
        className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-teal-400/10 blur-[90px] animate-water-float"
      />

      {/* Subtle water caustics / mesh grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.4) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />
    </div>
  );
};
