import React from 'react';

interface HexBackgroundProps {
  dark?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function HexBackground({ dark = false, children, className = '' }: HexBackgroundProps) {
  const bgColor = dark ? '#002C33' : '#F0F6FA';
  const strokeColor = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,193,235,0.10)';

  const hexSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="70" height="80.83">
      <polygon points="35,0 70,20.21 70,60.62 35,80.83 0,60.62 0,20.21" fill="none" stroke="${strokeColor}" stroke-width="1"/>
    </svg>
  `;

  const encodedSvg = `url("data:image/svg+xml,${encodeURIComponent(hexSvg.trim())}")`;

  return (
    <div
      className={`min-h-screen w-full ${className}`}
      style={{
        backgroundColor: bgColor,
        backgroundImage: encodedSvg,
        backgroundSize: '70px 80.83px',
        backgroundRepeat: 'repeat',
      }}
    >
      {children}
    </div>
  );
}
