import React from 'react';
import climoraIcon from '../assets/climora-icon.png';
import climoraLogoDark from '../assets/climora-logo-dark.png';

interface ClimoraLogoProps {
  size?: number | string;
  className?: string;
  showText?: boolean;
  variant?: 'icon' | 'full';
}

export const ClimoraLogo: React.FC<ClimoraLogoProps> = ({
  size = 36,
  className = '',
  showText = false,
  variant = 'icon',
}) => {
  const pixelSize = typeof size === 'number' ? `${size}px` : size;

  if (variant === 'full') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <img
          src={climoraLogoDark}
          alt="CLIMORA"
          style={{ height: pixelSize, width: 'auto' }}
          className="object-contain select-none"
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src={climoraIcon}
        alt="CLIMORA Logo"
        style={{ width: pixelSize, height: pixelSize }}
        className="shrink-0 object-contain select-none"
        draggable={false}
      />
      {showText && (
        <span className="font-bold text-xl md:text-2xl text-[#e1fdff] tracking-tight font-sans">
          CLIMORA
        </span>
      )}
    </div>
  );
};

