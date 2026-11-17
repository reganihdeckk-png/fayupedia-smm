import React, { useState } from 'react';

interface MacOSWindowProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  onClose?: () => void;
  showTrafficLights?: boolean;
}

export const MacOSWindow: React.FC<MacOSWindowProps> = ({
  title,
  subtitle,
  children,
  icon,
  actions,
  className = '',
  onClose,
  showTrafficLights = true
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  return (
    <div
      className={`
        liquid-glass rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-300
        ${isMaximized ? 'fixed inset-4 z-50 overflow-y-auto' : ''}
        ${isMinimized ? 'h-14 overflow-hidden' : ''}
        ${className}
      `}
    >
      {/* Window Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/[0.04] border-b border-white/[0.08] backdrop-blur-md select-none">
        {/* Left: Traffic Lights */}
        <div className="flex items-center gap-2">
          {showTrafficLights && (
            <div className="flex items-center gap-2 mr-3 group">
              <button
                onClick={onClose}
                title="Tutup"
                className="traffic-light traffic-light-close text-red-950 opacity-90 hover:opacity-100 flex items-center justify-center font-bold"
              >
                <span className="opacity-0 group-hover:opacity-100 text-[9px] leading-none">×</span>
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title="Kecilkan"
                className="traffic-light traffic-light-minimize text-amber-950 opacity-90 hover:opacity-100 flex items-center justify-center font-bold"
              >
                <span className="opacity-0 group-hover:opacity-100 text-[8px] leading-none">−</span>
              </button>
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                title="Perbesar"
                className="traffic-light traffic-light-maximize text-emerald-950 opacity-90 hover:opacity-100 flex items-center justify-center font-bold"
              >
                <span className="opacity-0 group-hover:opacity-100 text-[8px] leading-none">+</span>
              </button>
            </div>
          )}

          {/* Window Title & Icon */}
          <div className="flex items-center gap-2">
            {icon && <span className="text-sky-400">{icon}</span>}
            <div className="flex flex-col">
              <span className="text-xs md:text-sm font-semibold tracking-wide text-slate-100">
                {title}
              </span>
              {subtitle && (
                <span className="text-[10px] text-slate-400 font-normal -mt-0.5">
                  {subtitle}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Window actions */}
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* Window Body */}
      {!isMinimized && (
        <div className="p-4 md:p-6 water-specular">
          {children}
        </div>
      )}
    </div>
  );
};
