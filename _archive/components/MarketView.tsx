import React from 'react';
import { useAppNavigate } from '../../lib/use-app-navigate';
import { useGame } from '../context/GameContext';
import { GridBackground } from './GridBackground';
import { GameHeader } from './GameHeader';
import { PageTransition } from './PageTransition';
import { TrendingUp, Activity, ArrowLeft } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const sparklineData = [
  { week: 1, value: 3.2 },
  { week: 2, value: 3.5 },
  { week: 3, value: 3.1 },
  { week: 4, value: 3.8 },
  { week: 5, value: 4.0 },
  { week: 6, value: 4.2 },
  { week: 7, value: 4.5 },
];

const teamColors = [
  { id: 'A', color: '#00C1EB', share: 28, positioning: 'STANDARD' },
  { id: 'B', color: '#003D47', share: 25, positioning: 'PREMIUM' },
  { id: 'C', color: '#7C3AED', share: 22, positioning: 'VALUE' },
  { id: 'D', color: '#B45309', share: 25, positioning: 'STANDARD' },
];

export function MarketView() {
  const { state } = useGame();
  const navigate = useAppNavigate();

  return (
    <GridBackground className="flex flex-col min-h-screen">
      <PageTransition>
      <GameHeader />

      <div className="max-w-[1288px] mx-auto px-6 w-full pb-16">
        <h1
          className="text-[#202326] text-center mb-8"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '32px', letterSpacing: '-0.32px' }}
        >
          Market View — Week {state.currentWeek}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Category growth rate */}
          <div className="bg-white/60 rounded-2xl p-5" style={{ border: '1.4px solid white' }}>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={18} color="#006E85" />
              <span className="text-[#64748B] uppercase" style={{ fontSize: '9px', letterSpacing: '2px' }}>Category Growth Rate</span>
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '32px', fontWeight: 700, color: '#006E85', fontVariantNumeric: 'tabular-nums' }}>
              +4.5%
            </div>
            <div className="text-[#64748B]" style={{ fontSize: '12px' }}>per semi-annual period</div>
            <div className="mt-3 h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <Line type="monotone" dataKey="value" stroke="#00C1EB" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Total market pool */}
          <div className="bg-white/60 rounded-2xl p-5" style={{ border: '1.4px solid white' }}>
            <span className="text-[#606569] uppercase" style={{ fontSize: '10px', letterSpacing: '2px' }}>Total Market Pool</span>
            <div className="mt-2" style={{ fontFamily: "'Inter', sans-serif", fontSize: '32px', fontWeight: 700, color: '#002C33', fontVariantNumeric: 'tabular-nums' }}>
              2,600
            </div>
            <div className="text-[#64748B]" style={{ fontSize: '12px' }}>aggregate customer pool (weekly)</div>
          </div>

          {/* Market health index */}
          <div className="bg-white/60 rounded-2xl p-5" style={{ border: '1.4px solid white' }}>
            <div className="flex items-center gap-2 mb-3">
              <Activity size={18} color="#006E85" />
              <span className="text-[#64748B] uppercase" style={{ fontSize: '9px', letterSpacing: '2px' }}>Market Health Index</span>
            </div>
            {/* Semicircle gauge */}
            <div className="flex justify-center">
              <svg width="140" height="80" viewBox="0 0 140 80">
                <path d="M10 70 A60 60 0 0 1 130 70" fill="none" stroke="#E0F7FF" strokeWidth="12" strokeLinecap="round" />
                <path d="M10 70 A60 60 0 0 1 130 70" fill="none" stroke="url(#healthGrad)" strokeWidth="12" strokeLinecap="round" strokeDasharray="188.5" strokeDashoffset={188.5 * (1 - 0.72)} />
                <defs>
                  <linearGradient id="healthGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#C0392B" />
                    <stop offset="40%" stopColor="#B45309" />
                    <stop offset="70%" stopColor="#166534" />
                    <stop offset="100%" stopColor="#006E85" />
                  </linearGradient>
                </defs>
                <text x="70" y="65" textAnchor="middle" style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 700, fill: '#006E85' }}>
                  72
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* Market share bar */}
        <div className="bg-white/60 rounded-2xl p-5 mb-6" style={{ border: '1.4px solid white' }}>
          <h3 className="text-[#202326] mb-4" style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 700 }}>Market Share Distribution</h3>
          <div className="h-10 rounded-full overflow-hidden flex">
            {teamColors.map((team) => (
              <div
                key={team.id}
                className="h-full flex items-center justify-center text-white transition-all"
                style={{ width: `${team.share}%`, background: team.color, fontSize: '11px', fontWeight: 700 }}
              >
                {team.share}%
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 mt-3">
            {teamColors.map((team) => (
              <div key={team.id} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: team.color }} />
                <span className="text-[#64748B]" style={{ fontSize: '12px' }}>
                  Team {team.id} ({team.share}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Positioning badges */}
        <div className="bg-white/60 rounded-2xl p-5 mb-6" style={{ border: '1.4px solid white' }}>
          <h3 className="text-[#202326] mb-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 700 }}>Team Positioning</h3>
          <div className="flex flex-wrap gap-3">
            {teamColors.map((team) => {
              const posColor = team.positioning === 'VALUE' ? '#64748B' : team.positioning === 'PREMIUM' ? '#003D47' : '#006E85';
              return (
                <div key={team.id} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F0F6FA]">
                  <div className="w-4 h-4 rounded-full" style={{ background: team.color }} />
                  <span className="text-[#002C33]" style={{ fontSize: '13px', fontWeight: 600 }}>Team {team.id}</span>
                  <span
                    className="px-2 py-0.5 rounded text-white uppercase"
                    style={{ background: posColor, fontSize: '10px', fontWeight: 700, letterSpacing: '1px' }}
                  >
                    {team.positioning}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Benchmark metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/60 rounded-2xl p-5" style={{ border: '1.4px solid white' }}>
            <span className="text-[#64748B] uppercase" style={{ fontSize: '9px', letterSpacing: '2px' }}>Market Avg ARPU Band</span>
            <div className="mt-2" style={{ fontFamily: "'Inter', sans-serif", fontSize: '22px', fontWeight: 700, color: '#006E85', fontVariantNumeric: 'tabular-nums' }}>
              $14.50 – $19.80
            </div>
          </div>
          <div className="bg-white/60 rounded-2xl p-5" style={{ border: '1.4px solid white' }}>
            <span className="text-[#64748B] uppercase" style={{ fontSize: '9px', letterSpacing: '2px' }}>Market Avg Churn Rate</span>
            <div className="mt-2" style={{ fontFamily: "'Inter', sans-serif", fontSize: '22px', fontWeight: 700, color: '#B45309', fontVariantNumeric: 'tabular-nums' }}>
              18.3%
            </div>
          </div>
        </div>

        {/* Footer rule */}
        <div className="text-center p-4 rounded-2xl bg-white/60" style={{ border: '1.4px solid white' }}>
          <p className="text-[#64748B] italic" style={{ fontSize: '12px' }}>
            Individual team financials, decisions, and KPIs are never shown here.
          </p>
        </div>

        <div className="max-w-[400px] mx-auto mt-8">
          <button
            onClick={() => navigate(-1)}
            className="w-full py-3 px-6 rounded-full border border-[#d1d5db] bg-white text-[#202326] transition-all hover:bg-gray-50 cursor-pointer"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '16px' }}
          >
            Back to Game
          </button>
        </div>
      </div>
      </PageTransition>
    </GridBackground>
  );
}
