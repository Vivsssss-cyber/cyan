import React from 'react';

interface GridBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function GridBackground({ children, className = '' }: GridBackgroundProps) {
  return (
    <div className={`min-h-screen w-full bg-[#eff2f4] relative ${className}`}>
      {/* Subtle grid texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #232323 1px, transparent 1px),
            linear-gradient(to bottom, #232323 1px, transparent 1px)
          `,
          backgroundSize: '63px 63px',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
