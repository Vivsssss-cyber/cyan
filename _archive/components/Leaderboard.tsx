import React, { useState } from 'react';
import { useAppNavigate } from '../../lib/use-app-navigate';
import { GridBackground } from './GridBackground';
import { GameHeader } from './GameHeader';
import { GameButton } from './GameButton';
import { PageTransition } from './PageTransition';
import { Trophy, Medal, TrendingUp, TrendingDown, Crown, Star, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const finalStandings = [
  {
    rank: 1,
    team: 'Team Alpha',
    color: '#006E85',
    ev: 1420000,
    fv: 1207000,
    revenue: 892000,
    retention: 91,
    marketShare: 32,
    satisfaction: 88,
    runway: 24,
    cashBalance: 485000,
  },
  {
    rank: 2,
    team: 'Team Gamma',
    color: '#7C3AED',
    ev: 1180000,
    fv: 944000,
    revenue: 745000,
    retention: 85,
    marketShare: 26,
    satisfaction: 82,
    runway: 18,
    cashBalance: 380000,
  },
  {
    rank: 3,
    team: 'Team Beta',
    color: '#003D47',
    ev: 980000,
    fv: 784000,
    revenue: 680000,
    retention: 78,
    marketShare: 24,
    satisfaction: 74,
    runway: 14,
    cashBalance: 290000,
  },
  {
    rank: 4,
    team: 'Team Delta',
    color: '#B45309',
    ev: 720000,
    fv: 576000,
    revenue: 520000,
    retention: 65,
    marketShare: 18,
    satisfaction: 62,
    runway: 8,
    cashBalance: 155000,
  },
];

const radarData = [
  { metric: 'Revenue', Alpha: 95, Gamma: 80, Beta: 72, Delta: 55 },
  { metric: 'Retention', Alpha: 91, Gamma: 85, Beta: 78, Delta: 65 },
  { metric: 'Market Share', Alpha: 88, Gamma: 75, Beta: 70, Delta: 52 },
  { metric: 'Satisfaction', Alpha: 88, Gamma: 82, Beta: 74, Delta: 62 },
  { metric: 'Valuation', Alpha: 92, Gamma: 78, Beta: 65, Delta: 48 },
  { metric: 'Cash Health', Alpha: 85, Gamma: 72, Beta: 60, Delta: 40 },
];

const evCompare = finalStandings.map((t) => ({
  name: t.team.replace('Team ', ''),
  ev: t.ev,
  fv: t.fv,
  color: t.color,
}));

const rankIcons = [Crown, Medal, Award, Star];
const rankColors = ['#D4A400', '#94A3B8', '#B45309', '#606569'];

export function Leaderboard() {
  const navigate = useAppNavigate();
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

  return (
    <PageTransition>
      <GridBackground className="flex flex-col min-h-screen">
        <GameHeader />

        <div className="max-w-[1288px] mx-auto px-6 w-full pb-16">
          {/* Trophy Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-[#006E85]/10 flex items-center justify-center mx-auto mb-4">
              <Trophy size={32} color="#006E85" />
            </div>
            <h1
              className="text-[#202326] mb-2"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: '36px', letterSpacing: '-0.36px' }}
            >
              Final Leaderboard
            </h1>
            <p className="text-[#606569]" style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px' }}>
              Week 52 - End of Year Performance Rankings
            </p>
          </div>

          {/* Podium Cards */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {finalStandings.map((team, i) => {
              const RankIcon = rankIcons[i];
              const isSelected = selectedTeam === i;
              return (
                <button
                  key={team.team}
                  onClick={() => setSelectedTeam(isSelected ? null : i)}
                  className={`rounded-2xl p-5 text-left transition-all cursor-pointer relative overflow-hidden ${
                    i === 0 ? 'ring-2 ring-[#D4A400]/30' : ''
                  }`}
                  style={{
                    background: 'rgba(255,255,255,0.7)',
                    border: isSelected ? '1.4px solid rgba(21,97,98,0.33)' : '1.4px solid white',
                    boxShadow: isSelected ? '0px 2.5px 10px 0px rgba(77,181,182,0.29)' : 'none',
                  }}
                >
                  {i === 0 && (
                    <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                      <div className="absolute top-2 right-[-20px] w-[80px] text-center transform rotate-45 bg-[#D4A400] text-white py-0.5" style={{ fontSize: '8px', fontWeight: 700 }}>
                        WINNER
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${rankColors[i]}15` }}
                    >
                      <RankIcon size={20} color={rankColors[i]} />
                    </div>
                    <div>
                      <span className="text-[#606569]" style={{ fontSize: '11px' }}>Rank #{team.rank}</span>
                      <h3 className="text-[#202326]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '18px' }}>
                        {team.team}
                      </h3>
                    </div>
                  </div>

                  <div className="mb-3">
                    <span className="text-[#606569]" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Enterprise Value</span>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '24px', color: team.color, fontVariantNumeric: 'tabular-nums' }}>
                      ${(team.ev / 1000).toFixed(0)}K
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <MiniStat label="Revenue" value={`$${(team.revenue / 1000).toFixed(0)}K`} />
                    <MiniStat label="Retention" value={`${team.retention}%`} />
                    <MiniStat label="Market Share" value={`${team.marketShare}%`} />
                    <MiniStat label="Cash" value={`$${(team.cashBalance / 1000).toFixed(0)}K`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Comparison Charts */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* EV Comparison */}
            <div className="bg-white/60 rounded-2xl p-5" style={{ border: '1.4px solid white' }}>
              <h3 className="text-[#202326] mb-1" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '16px' }}>
                Valuation Comparison
              </h3>
              <p className="text-[#94A3B8] mb-4" style={{ fontSize: '12px' }}>Enterprise Value vs Founder Value</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={evCompare}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, '']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="ev" name="Enterprise Value" radius={[4, 4, 0, 0]}>
                    {evCompare.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                  <Bar dataKey="fv" name="Founder Value" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Radar Chart */}
            <div className="bg-white/60 rounded-2xl p-5" style={{ border: '1.4px solid white' }}>
              <h3 className="text-[#202326] mb-1" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '16px' }}>
                Performance Radar
              </h3>
              <p className="text-[#94A3B8] mb-4" style={{ fontSize: '12px' }}>Multi-dimensional team comparison</p>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Alpha" dataKey="Alpha" stroke="#006E85" fill="#006E85" fillOpacity={0.15} strokeWidth={2} />
                  <Radar name="Gamma" dataKey="Gamma" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.08} strokeWidth={1.5} />
                  <Radar name="Beta" dataKey="Beta" stroke="#003D47" fill="#003D47" fillOpacity={0.05} strokeWidth={1} />
                </RadarChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-4 justify-center mt-1">
                <LegendDot color="#006E85" label="Alpha" />
                <LegendDot color="#7C3AED" label="Gamma" />
                <LegendDot color="#003D47" label="Beta" />
              </div>
            </div>
          </div>

          {/* Awards Row */}
          <div className="bg-white/60 rounded-2xl p-5 mb-8" style={{ border: '1.4px solid white' }}>
            <h3 className="text-[#202326] mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '16px' }}>
              Special Awards
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {[
                { icon: TrendingUp, label: 'Fastest Growth', team: 'Team Alpha', stat: '+152% EV', bg: '#E0F7FF' },
                { icon: Star, label: 'Best Retention', team: 'Team Alpha', stat: '91%', bg: '#FEF3C7' },
                { icon: Medal, label: 'Highest Revenue', team: 'Team Alpha', stat: '$892K', bg: '#ECFDF5' },
                { icon: Award, label: 'Most Efficient', team: 'Team Gamma', stat: '1.48x ratio', bg: '#F0F0FF' },
              ].map((award) => {
                const Icon = award.icon;
                return (
                  <div key={award.label} className="rounded-xl p-4" style={{ background: award.bg }}>
                    <Icon size={18} className="mb-2" color="#606569" />
                    <p className="text-[#606569]" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>{award.label}</p>
                    <p className="text-[#202326] mt-1" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '14px' }}>{award.team}</p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 700, color: '#006E85', fontVariantNumeric: 'tabular-nums' }}>{award.stat}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTAs */}
          <div className="max-w-[600px] mx-auto flex gap-4">
            <GameButton variant="secondary" onClick={() => navigate('/game/results')}>
              View Full Report
            </GameButton>
            <GameButton onClick={() => navigate('/game/fundraising')}>
              Fundraising Round
            </GameButton>
          </div>
        </div>
      </GridBackground>
    </PageTransition>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[#94A3B8]" style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>{label}</span>
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: 600, color: '#202326', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
      <span className="text-[#94A3B8]" style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>{label}</span>
    </div>
  );
}
