import React from 'react';
import svgPaths from '../../imports/svg-cw0zf03bpx';
import { useGame } from '../context/GameContext';

const FO = "'Outfit', sans-serif";

interface GameHeaderProps {
  className?: string;
}

export function GameHeader({ className = '' }: GameHeaderProps) {
  const { state } = useGame();
  const monthNum = Math.ceil((state?.currentWeek ?? 1) / 4);
  const teamName = state?.teamName ?? 'Dhaulagiri Cafe';
  const roleName = 'Restaurant Owner';

  return (
    <div className={`flex items-center justify-between w-full max-w-[1286px] mx-auto px-6 py-4 ${className}`}>
      {/* Logo + wordmark */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7">
          <svg className="w-full h-full" fill="none" viewBox="0 0 32 32">
            <g>
              <path d={svgPaths.p198f6b80} fill="#002C33" />
              <path d={svgPaths.ped2e900} fill="#002C33" />
              <path d={svgPaths.p1e193b00} fill="#002C33" />
              <path d={svgPaths.p19f10980} fill="#002C33" />
              <path d={svgPaths.p6604e70} fill="#002C33" />
              <path d={svgPaths.p1a1f980} fill="#002C33" />
              <path d={svgPaths.p77149f0} fill="#002C33" />
              <path d={svgPaths.p10e28f00} fill="#002C33" />
              <path d={svgPaths.p2b83b600} fill="#002C33" />
              <path d={svgPaths.pc66300} fill="#002C33" />
              <path d={svgPaths.p2c77300} fill="#002C33" />
            </g>
          </svg>
        </div>
        <span style={{ fontFamily: FO, fontWeight: 700, fontSize: '18px', letterSpacing: '-0.2px', color: '#202326' }}>
          Startup Valley
        </span>
      </div>

      {/* Right side: Team + Role + Month */}
      <div className="flex items-center gap-2">
        {/* Team name pill */}
        <div style={{
          background: '#fafafa',
          border: '1px solid #e8eef2',
          borderRadius: '20px',
          padding: '5px 12px',
          display: 'flex', alignItems: 'center', gap: '6px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
        }}>
          <span style={{ fontFamily: FO, fontWeight: 500, fontSize: '12px', color: '#606569' }}>Team:</span>
          <span style={{ fontFamily: FO, fontWeight: 600, fontSize: '12px', color: '#202326' }}>{teamName}</span>
        </div>

        {/* Role pill */}
        <div style={{
          background: '#fafafa',
          border: '1px solid #e8eef2',
          borderRadius: '20px',
          padding: '5px 12px',
          display: 'flex', alignItems: 'center', gap: '6px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
        }}>
          <span style={{ fontFamily: FO, fontWeight: 600, fontSize: '12px', color: '#202326' }}>{roleName}</span>
          {/* person icon inline */}
          <svg width="14" height="14" viewBox="0 0 16 14.5" fill="none">
            <path d={svgPaths.p2ce64f80} fill="#94A3B8" />
            <path d={svgPaths.p2a8bfc00} fill="#94A3B8" />
          </svg>
        </div>

        {/* Month pill */}
        <div style={{
          background: '#fafafa',
          border: '1px solid #e8eef2',
          borderRadius: '20px',
          padding: '5px 12px',
          display: 'flex', alignItems: 'center', gap: '6px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
        }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22C55E', flexShrink: 0 }} />
          <span style={{ fontFamily: FO, fontWeight: 600, fontSize: '12px', color: '#202326' }}>Month {monthNum}</span>
        </div>
      </div>
    </div>
  );
}
