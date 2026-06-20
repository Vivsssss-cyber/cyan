import React from 'react';

interface CyanLogoProps {
  dark?: boolean;
  size?: 'sm' | 'lg';
}

export function CyanLogo({ dark = false, size = 'sm' }: CyanLogoProps) {
  const isLarge = size === 'lg';
  const w = isLarge ? 80 : 32;
  const h = isLarge ? 80 : 32;

  const gradId = dark ? 'cyanGradDark' : 'cyanGradLight';
  const topColor = dark ? '#FFFFFF' : '#00D2FF';
  const midColor = dark ? '#C0C0C0' : '#00A0C2';
  const botColor = dark ? '#808080' : '#003D47';

  return (
    <div className="flex items-center gap-2">
      <svg width={w} height={h} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={topColor} />
            <stop offset="50%" stopColor={midColor} />
            <stop offset="100%" stopColor={botColor} />
          </linearGradient>
        </defs>
        {/* Isometric C shape */}
        <path
          d={`M55 15 L25 15 Q10 15 10 30 L10 50 Q10 65 25 65 L55 65 L55 55 L28 55 Q20 55 20 48 L20 32 Q20 25 28 25 L55 25 Z`}
          fill={`url(#${gradId})`}
        />
        {/* 3D depth */}
        <path
          d="M55 15 L60 10 L30 10 Q12 10 8 25 L10 30 Q10 15 25 15 Z"
          fill={topColor}
          opacity="0.4"
        />
        <path
          d="M10 50 L8 55 Q12 70 30 70 L60 70 L55 65 L25 65 Q10 65 10 50 Z"
          fill={botColor}
          opacity="0.6"
        />
      </svg>
      {size === 'sm' && (
        <div className="flex flex-col leading-none">
          <span
            className={`tracking-[3px] ${dark ? 'text-white' : 'text-[#002C33]'}`}
            style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '14px' }}
          >
            CYAN
          </span>
          <span
            className={`${dark ? 'text-white/60' : 'text-[#64748B]'}`}
            style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '9px', letterSpacing: '1px' }}
          >
            Innovations
          </span>
        </div>
      )}
      {size === 'lg' && (
        <div className="flex flex-col leading-none">
          <span
            className={`tracking-[5px] ${dark ? 'text-white' : 'text-[#002C33]'}`}
            style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: '28px' }}
          >
            CYAN
          </span>
          <span
            className={`${dark ? 'text-white/60' : 'text-[#64748B]'}`}
            style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '14px', letterSpacing: '2px' }}
          >
            Innovations
          </span>
        </div>
      )}
    </div>
  );
}
