import React, { useState } from 'react';
import { useAppNavigate } from '../lib/use-app-navigate';
import { useGame } from '../context/GameContext';
import { GridBackground } from './GridBackground';
import { GameHeader } from './GameHeader';
import { GameButton } from './GameButton';
import { PageTransition } from './PageTransition';
import { TrendingUp, TrendingDown, Expand, Building2, Award, LayoutGrid, Target, Shield, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
  BarChart, Bar, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import { chartGrid, chartAxis, tooltipCursor, ThemedTooltip } from './custom/charts';

const FI = "'Inter', sans-serif";

// --- Board KPI data ---
const kpiData = [
  { name: 'Total Revenue', value: '$644,000', delta: '+12%', positive: true },
  { name: 'Total Customers', value: '2,548', delta: '+8%', positive: true },
  { name: 'Customer Retention', value: '68%', delta: '-3%', positive: false },
  { name: 'Market Share', value: '28%', delta: '+2%', positive: true },
  { name: 'Avg Order Value', value: '$17.20', delta: '+$0.80', positive: true },
  { name: 'Employee Productivity', value: '82%', delta: '+5%', positive: true },
  { name: 'Customer Satisfaction', value: '74%', delta: '-2%', positive: false },
  { name: 'Operating Margin', value: '-8.2%', delta: '+1.5%', positive: true },
  { name: 'Cash Balance', value: '$412,500', delta: '-$87,500', positive: false },
  { name: 'Capacity Utilization', value: '72%', delta: '+4%', positive: true },
];

// --- Revenue by month ---
const revenueByMonth = [
  { month: 'M1', revenue: 48000, costs: 52000 },
  { month: 'M2', revenue: 62000, costs: 55000 },
  { month: 'M3', revenue: 74000, costs: 58000 },
  { month: 'M4', revenue: 82000, costs: 62000 },
  { month: 'M5', revenue: 91000, costs: 65000 },
  { month: 'M6', revenue: 99200, costs: 68000 },
];

// --- Cash position trend ---
const cashTrend = [
  { month: 'M1', cash: 465000 },
  { month: 'M2', cash: 440000 },
  { month: 'M3', cash: 425000 },
  { month: 'M4', cash: 418000 },
  { month: 'M5', cash: 415000 },
  { month: 'M6', cash: 412500 },
];

// --- Valuation trajectory ---
const valuationData = [
  { period: 'Start', ev: 500000, fv: 500000 },
  { period: 'M3', ev: 680000, fv: 680000 },
  { period: 'M6', ev: 920000, fv: 828000 },
  { period: 'M9', ev: 1080000, fv: 972000 },
  { period: 'M12', ev: 1240000, fv: 868000 },
];

// --- Radar performance data ---
const radarData = [
  { metric: 'Revenue', score: 78 },
  { metric: 'Retention', score: 68 },
  { metric: 'Market Share', score: 72 },
  { metric: 'Satisfaction', score: 74 },
  { metric: 'Efficiency', score: 82 },
  { metric: 'Cash Health', score: 58 },
];

// --- Unit economics ---
const unitEconomics = [
  { label: 'Customer Acquisition Cost (CAC)', value: '$12.40', trend: '-8%', positive: true },
  { label: 'Customer Lifetime Value (LTV)', value: '$142.00', trend: '+12%', positive: true },
  { label: 'LTV:CAC Ratio', value: '11.5x', trend: '+2.1x', positive: true },
  { label: 'Payback Period', value: '2.4 weeks', trend: '-0.3 wks', positive: true },
  { label: 'Revenue per Employee', value: '$12,880', trend: '+15%', positive: true },
  { label: 'Revenue per Sq Ft', value: '$28.40', trend: '+9%', positive: true },
];

const tabs = ['Performance', 'Valuation', 'Unit Economics', 'Strategy'];

export function BoardReview() {
  const { state, setCurrentWeek } = useGame();
  const navigate = useAppNavigate();
  const [activeTab, setActiveTab] = useState('Performance');
  const [narrative, setNarrative] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const year = Math.ceil(state.currentWeek / 52);
  const half = (state.currentWeek % 52) <= 26 ? 1 : 2;

  return (
    <GridBackground className="flex flex-col min-h-screen">
      <PageTransition>
      <GameHeader />

      {/* Board review header band */}
      <div className="py-6 text-center bg-[#202326]">
        <h1 className="text-white" style={{ fontFamily: FI, fontSize: '32px', fontWeight: 800, letterSpacing: '-0.32px' }}>
          Board Review · Year {year} · H{half}
        </h1>
        <p className="text-white/50 mt-1" style={{ fontFamily: FI, fontSize: '14px' }}>
          Semi-Annual Performance Assessment & Strategic Planning
        </p>
      </div>

      <div className="max-w-[1312px] mx-auto px-6 py-8 w-full pb-24">
        {/* KPI Grid */}
        <div className="mb-6">
          <h3 className="text-[#202326] uppercase mb-4" style={{ fontFamily: FI, fontSize: '12px', letterSpacing: '3px', fontWeight: 700 }}>
            Key Performance Indicators
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {kpiData.map((kpi, i) => (
              <div key={i} className="bg-white/60 rounded-2xl p-4" style={{ border: '1.4px solid white' }}>
                <div className="text-[#606569] uppercase mb-2" style={{ fontFamily: FI, fontSize: '9px', letterSpacing: '2px' }}>
                  {kpi.name}
                </div>
                <div style={{ fontFamily: FI, fontSize: '18px', fontWeight: 700, color: '#202326', fontVariantNumeric: 'tabular-nums' }}>
                  {kpi.value}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {kpi.positive ? (
                    <ArrowUpRight size={10} color="#156162" />
                  ) : (
                    <ArrowDownRight size={10} color="#c65252" />
                  )}
                  <span style={{ fontFamily: FI, fontSize: '11px', fontWeight: 600, color: kpi.positive ? '#156162' : '#c65252', fontVariantNumeric: 'tabular-nums' }}>
                    {kpi.delta}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center gap-1 mb-6 bg-white/60 rounded-xl p-1 w-fit" style={{ border: '1.4px solid white' }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === tab
                  ? 'text-white shadow-sm'
                  : 'text-[#606569] hover:text-[#202326] hover:bg-white/50'
              }`}
              style={{ fontFamily: FI, fontSize: '13px', fontWeight: 500, borderRadius: 30, background: activeTab === tab ? 'var(--game-cta-gradient)' : 'transparent' }}
            >
              {activeTab === tab && <LayoutGrid size={14} />}
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'Performance' && (
          <div className="space-y-4">
            {/* Revenue vs Costs over 6 months */}
            <div className="grid grid-cols-2 gap-4">
              <ChartCard title="Revenue vs Costs (6 Months)" subtitle="Monthly revenue and cost trajectory">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={revenueByMonth}>
                    <CartesianGrid {...chartGrid} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip cursor={tooltipCursor} content={<ThemedTooltip valueFormatter={(v) => `$${Number(v).toLocaleString()}`} />} />
                    <Bar dataKey="revenue" fill="var(--game-teal-mid)" radius={[4, 4, 0, 0]} name="Revenue" />
                    <Bar dataKey="costs" fill="var(--game-negative)" radius={[4, 4, 0, 0]} name="Costs" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center gap-4 mt-2 justify-center">
                  <LegendDot color="var(--game-teal-mid)" label="Revenue" />
                  <LegendDot color="var(--game-negative)" label="Costs" />
                </div>
              </ChartCard>

              <ChartCard title="Performance Radar" subtitle="Multi-dimensional business health">
                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="var(--color-border)" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Score" dataKey="score" stroke="var(--game-teal-mid)" fill="var(--game-teal-mid)" fillOpacity={0.15} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Cash position */}
            <ChartCard title="Cash Position Trend" subtitle="6-month cash balance trajectory">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={cashTrend}>
                  <defs>
                    <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--game-teal-mid)" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="var(--game-teal-mid)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid {...chartGrid} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip cursor={tooltipCursor} content={<ThemedTooltip valueFormatter={(v) => `$${Number(v).toLocaleString()}`} />} />
                  <Area type="monotone" dataKey="cash" stroke="var(--game-teal-mid)" strokeWidth={2} fill="url(#cashGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        )}

        {activeTab === 'Valuation' && (
          <div className="space-y-4">
            {/* DCF Valuation */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/60 rounded-2xl p-6" style={{ border: '1.4px solid white' }}>
                <span className="text-[#606569] uppercase" style={{ fontFamily: FI, fontSize: '9px', letterSpacing: '2px' }}>Enterprise Value</span>
                <div style={{ fontFamily: FI, fontSize: '36px', fontWeight: 700, color: '#156162', fontVariantNumeric: 'tabular-nums' }}>$1,240,000</div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp size={12} color="#156162" />
                  <span style={{ fontFamily: FI, fontSize: '12px', color: '#156162', fontWeight: 600 }}>+148% since start</span>
                </div>
              </div>
              <div className="bg-white/60 rounded-2xl p-6" style={{ border: '1.4px solid white' }}>
                <span className="text-[#606569] uppercase" style={{ fontFamily: FI, fontSize: '9px', letterSpacing: '2px' }}>Founder Value</span>
                <div style={{ fontFamily: FI, fontSize: '36px', fontWeight: 700, color: '#006E85', fontVariantNumeric: 'tabular-nums' }}>$868,000</div>
                <div className="flex items-center gap-1 mt-1">
                  <Shield size={12} color="#006E85" />
                  <span style={{ fontFamily: FI, fontSize: '12px', color: '#006E85', fontWeight: 600 }}>70% ownership</span>
                </div>
              </div>
              <div className="bg-white/60 rounded-2xl p-6" style={{ border: '1.4px solid white' }}>
                <span className="text-[#606569] uppercase" style={{ fontFamily: FI, fontSize: '9px', letterSpacing: '2px' }}>Fundraise Status</span>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-3 h-3 rounded-full bg-[#166534]" />
                  <span style={{ fontFamily: FI, fontWeight: 700, fontSize: '18px', color: '#166534' }}>Eligible</span>
                </div>
                <p className="text-[#606569] mt-2" style={{ fontFamily: FI, fontSize: '11px' }}>Available at next Annual Review</p>
              </div>
            </div>

            {/* Valuation Chart */}
            <ChartCard title="Valuation Trajectory" subtitle="Enterprise value and founder equity over time">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={valuationData}>
                  <CartesianGrid {...chartGrid} />
                  <XAxis dataKey="period" tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip cursor={tooltipCursor} content={<ThemedTooltip valueFormatter={(v) => `$${Number(v).toLocaleString()}`} />} />
                  <Line type="monotone" dataKey="ev" stroke="var(--game-positive)" strokeWidth={2.5} name="Enterprise Value" dot={{ fill: 'var(--game-positive)', r: 4 }} />
                  <Line type="monotone" dataKey="fv" stroke="var(--game-teal-mid)" strokeWidth={2} name="Founder Value" dot={{ fill: 'var(--game-teal-mid)', r: 4 }} strokeDasharray="6 3" />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-4 mt-2 justify-center">
                <LegendDot color="var(--game-positive)" label="Enterprise Value" />
                <LegendDot color="var(--game-teal-mid)" label="Founder Value" />
              </div>
            </ChartCard>

            {/* Health Gauges */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Revenue Growth Rate', value: 65, color: 'var(--game-cyan-bright)' },
                { label: 'Retention Health', value: 52, color: 'var(--color-chart-4)' },
                { label: 'Margin Quality', value: 35, color: 'var(--color-chart-5)' },
              ].map((gauge) => (
                <div key={gauge.label} className="bg-white/60 rounded-2xl p-5" style={{ border: '1.4px solid white' }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#606569]" style={{ fontFamily: FI, fontSize: '12px' }}>{gauge.label}</span>
                    <span style={{ fontFamily: FI, fontSize: '14px', fontWeight: 700, color: gauge.color, fontVariantNumeric: 'tabular-nums' }}>
                      {gauge.value}%
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full overflow-hidden bg-[#f0f2f4]">
                    <div className="h-full rounded-full transition-all" style={{ width: `${gauge.value}%`, background: gauge.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Unit Economics' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {unitEconomics.map((metric) => (
                <div key={metric.label} className="bg-white/60 rounded-2xl p-5" style={{ border: '1.4px solid white' }}>
                  <span className="text-[#606569]" style={{ fontFamily: FI, fontSize: '11px' }}>{metric.label}</span>
                  <div className="mt-2" style={{ fontFamily: FI, fontSize: '28px', fontWeight: 700, color: '#202326', fontVariantNumeric: 'tabular-nums' }}>
                    {metric.value}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {metric.positive ? <ArrowUpRight size={12} color="#156162" /> : <ArrowDownRight size={12} color="#c65252" />}
                    <span style={{ fontFamily: FI, fontSize: '12px', fontWeight: 600, color: metric.positive ? '#156162' : '#c65252' }}>
                      {metric.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* LTV:CAC visualization */}
            <ChartCard title="Unit Economics Health" subtitle="Key ratios and efficiency metrics">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-[#202326] mb-3" style={{ fontFamily: FI, fontSize: '13px', fontWeight: 700 }}>LTV:CAC Ratio</h4>
                  <div className="flex items-end gap-4 mb-4">
                    <div className="text-center">
                      <div className="h-32 w-16 bg-[#006E85] rounded-t-lg flex items-end justify-center pb-2">
                        <span className="text-white" style={{ fontFamily: FI, fontSize: '11px', fontWeight: 700 }}>$142</span>
                      </div>
                      <span className="text-[#606569] mt-1 block" style={{ fontSize: '10px' }}>LTV</span>
                    </div>
                    <div className="text-center">
                      <div className="h-12 w-16 bg-[#c65252] rounded-t-lg flex items-end justify-center pb-2">
                        <span className="text-white" style={{ fontFamily: FI, fontSize: '11px', fontWeight: 700 }}>$12</span>
                      </div>
                      <span className="text-[#606569] mt-1 block" style={{ fontSize: '10px' }}>CAC</span>
                    </div>
                  </div>
                  <div className="bg-[#ECFDF5] rounded-lg p-3">
                    <span className="text-[#166534]" style={{ fontFamily: FI, fontSize: '12px', fontWeight: 700 }}>
                      11.5x ratio — Excellent unit economics
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="text-[#202326] mb-3" style={{ fontFamily: FI, fontSize: '13px', fontWeight: 700 }}>Efficiency Scores</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Revenue per Employee', value: 88, color: 'var(--game-teal-mid)' },
                      { label: 'Revenue per Sq Ft', value: 72, color: 'var(--color-chart-6)' },
                      { label: 'Marketing ROI', value: 95, color: 'var(--game-positive)' },
                      { label: 'Capacity Utilization', value: 72, color: 'var(--color-chart-4)' },
                    ].map((g) => (
                      <div key={g.label}>
                        <div className="flex justify-between mb-1">
                          <span className="text-[#606569]" style={{ fontFamily: FI, fontSize: '11px' }}>{g.label}</span>
                          <span style={{ fontFamily: FI, fontSize: '11px', fontWeight: 700, color: g.color, fontVariantNumeric: 'tabular-nums' }}>{g.value}/100</span>
                        </div>
                        <div className="h-2 bg-[#f0f2f4] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${g.value}%`, background: g.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ChartCard>
          </div>
        )}

        {activeTab === 'Strategy' && (
          <div className="space-y-6">
            {/* Strategic decisions */}
            <div>
              <h3 className="text-[#202326] uppercase mb-4" style={{ fontFamily: FI, fontSize: '12px', letterSpacing: '3px', fontWeight: 700 }}>
                Strategic Decisions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedStrategy('extension')}
                  className="bg-white/60 rounded-2xl p-6 text-left transition-all cursor-pointer"
                  style={{
                    border: selectedStrategy === 'extension' ? '1.4px solid rgba(21,97,98,0.33)' : '1.4px solid white',
                    boxShadow: selectedStrategy === 'extension' ? '0px 2.5px 10px 0px rgba(77,181,182,0.29)' : 'none',
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E0F7FF] flex items-center justify-center">
                      <Expand size={20} color="#006E85" />
                    </div>
                    <h4 className="text-[#202326]" style={{ fontFamily: FI, fontSize: '16px', fontWeight: 800 }}>Extension</h4>
                  </div>
                  <p className="text-[#606569] mb-3" style={{ fontFamily: FI, fontSize: '13px', lineHeight: '1.6' }}>
                    Increase space at current location. Same location parameters apply.
                  </p>
                  <div style={{ fontFamily: FI, fontSize: '14px', fontWeight: 700, color: '#C0392B', fontVariantNumeric: 'tabular-nums' }}>
                    Cost: 2x original setup ($126,000)
                  </div>
                  <div className="mt-2 text-[#00D2FF]" style={{ fontFamily: FI, fontSize: '12px', fontWeight: 600 }}>
                    Capacity ceiling increase
                  </div>
                </button>

                <button
                  onClick={() => setSelectedStrategy('expansion')}
                  className="bg-white/60 rounded-2xl p-6 text-left transition-all cursor-pointer"
                  style={{
                    border: selectedStrategy === 'expansion' ? '1.4px solid rgba(21,97,98,0.33)' : '1.4px solid white',
                    boxShadow: selectedStrategy === 'expansion' ? '0px 2.5px 10px 0px rgba(77,181,182,0.29)' : 'none',
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E0F7FF] flex items-center justify-center">
                      <Building2 size={20} color="#006E85" />
                    </div>
                    <h4 className="text-[#202326]" style={{ fontFamily: FI, fontSize: '16px', fontWeight: 800 }}>Expansion</h4>
                  </div>
                  <p className="text-[#606569] mb-3" style={{ fontFamily: FI, fontSize: '13px', lineHeight: '1.6' }}>
                    Open a second location. 2x theoretical capacity, 2x fixed costs. TAM grows +10%.
                  </p>
                  <div style={{ fontFamily: FI, fontSize: '14px', fontWeight: 700, color: '#C0392B', fontVariantNumeric: 'tabular-nums' }}>
                    Cost: Original setup ($63,000)
                  </div>
                  <div className="mt-2 text-[#00D2FF]" style={{ fontFamily: FI, fontSize: '12px', fontWeight: 600 }}>
                    2x capacity, 2x fixed costs
                  </div>
                </button>
              </div>
            </div>

            {/* Strategic narrative */}
            <div className="bg-white/60 rounded-2xl p-6" style={{ border: '1.4px solid white' }}>
              <h3 className="text-[#202326] mb-2" style={{ fontFamily: FI, fontSize: '18px', fontWeight: 700 }}>
                What is your company becoming?
              </h3>
              <p className="text-[#606569] mb-4" style={{ fontFamily: FI, fontSize: '12px' }}>
                Your facilitator may ask you to share this in debrief
              </p>
              <textarea
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
                placeholder="Reflect on your strategy, what's working, and where you're heading..."
                rows={4}
                className="w-full rounded-xl p-4 text-[#202326] placeholder:text-[#c4c4c4] resize-none bg-white border border-[#d1d5db]"
                style={{ fontFamily: FI, fontSize: '14px', borderRadius: '10px' }}
              />
            </div>

            {/* Fundraising eligibility */}
            <div className="rounded-2xl p-4 flex items-center gap-3 bg-white/60" style={{ border: '1.4px solid white' }}>
              <Award size={20} color="#156162" />
              <span className="text-[#156162]" style={{ fontFamily: FI, fontSize: '13px', fontWeight: 600 }}>
                You are eligible for fundraising at the next Annual Review.
              </span>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="max-w-[853px] mx-auto mt-8">
          <GameButton
            onClick={() => {
              setCurrentWeek(state.currentWeek + 1);
              navigate('/game/cockpit');
            }}
          >
            Continue to Next Period
          </GameButton>
        </div>
      </div>
      </PageTransition>
    </GridBackground>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/60 rounded-2xl p-5" style={{ border: '1.4px solid white' }}>
      <h3 className="text-[#202326] mb-0.5" style={{ fontFamily: FI, fontWeight: 700, fontSize: '16px' }}>{title}</h3>
      <p className="text-[#94A3B8] mb-4" style={{ fontFamily: FI, fontSize: '12px' }}>{subtitle}</p>
      {children}
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
      <span className="text-[#94A3B8]" style={{ fontFamily: FI, fontSize: '11px' }}>{label}</span>
    </div>
  );
}

