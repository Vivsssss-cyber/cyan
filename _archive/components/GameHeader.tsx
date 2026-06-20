import React from 'react';
import svgPaths from '../../imports/svg-cw0zf03bpx';

interface GameHeaderProps {
  className?: string;
}

export function GameHeader({ className = '' }: GameHeaderProps) {
  return (
    <div className={`flex items-center justify-between w-full max-w-[1286px] mx-auto px-6 py-6 ${className}`}>
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8">
          <svg className="w-full h-full" fill="none" viewBox="0 0 32 32">
            <g>
              <path d={svgPaths.p198f6b80} fill="#000001" />
              <path d={svgPaths.ped2e900} fill="#000001" />
              <path d={svgPaths.p1e193b00} fill="#000001" />
              <path d={svgPaths.p19f10980} fill="#000001" />
              <path d={svgPaths.p6604e70} fill="#000001" />
              <path d={svgPaths.p1a1f980} fill="#000001" />
              <path d={svgPaths.p77149f0} fill="#000001" />
              <path d={svgPaths.p10e28f00} fill="#000001" />
              <path d={svgPaths.p2b83b600} fill="#000001" />
              <path d={svgPaths.pc66300} fill="#000001" />
              <path d={svgPaths.p2c77300} fill="#000001" />
            </g>
          </svg>
        </div>
        <span
          className="text-[#202326] whitespace-nowrap"
          style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '28px', letterSpacing: '-0.32px' }}
        >
          Startup Valley
        </span>
      </div>
      <div className="flex items-center">
        <div className="bg-[#fafafa] flex items-center gap-2.5 px-3.5 py-2 rounded-full shadow-[0px_0px_0px_0px_#e1e4eb,0px_3px_8px_0px_rgba(0,0,0,0.06)]">
          <span
            className="text-[#0f172b] whitespace-nowrap"
            style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: '12px' }}
          >
            Restaurant Owner
          </span>
          <div className="w-4 h-4">
            <svg className="w-full h-full" fill="none" viewBox="0 0 16 14.5">
              <g>
                <path d={svgPaths.p2ce64f80} fill="#000001" />
                <path d={svgPaths.p2a8bfc00} fill="#000001" />
                <path d={svgPaths.p106cae80} fill="#000001" />
                <path d={svgPaths.p3cf6600} fill="#000001" />
                <path d={svgPaths.p280ecd00} fill="#000001" />
                <path d={svgPaths.p22186080} fill="#000001" />
                <path d={svgPaths.p33a42380} fill="#000001" />
                <path d={svgPaths.p38377f00} fill="#000001" />
                <path d={svgPaths.p3c5ea100} fill="#000001" />
                <path d={svgPaths.p304fbd70} fill="#000001" />
                <path d={svgPaths.p298be500} fill="#000001" />
                <path d={svgPaths.p2c737700} fill="#000001" />
                <path d={svgPaths.p6cb6b00} fill="#000001" />
                <path d={svgPaths.p2051d720} fill="#000001" />
                <path d={svgPaths.p12900d00} fill="#000001" />
                <path d={svgPaths.p20bc900} fill="#000001" />
                <path d={svgPaths.p8fee900} fill="#000001" />
                <path d={svgPaths.p330b5d92} fill="#000001" />
                <path d={svgPaths.p99f1000} fill="#000001" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}