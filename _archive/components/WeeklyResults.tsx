import React, { useState } from 'react';
import { useAppNavigate } from '../../lib/use-app-navigate';
import { useGame } from '../context/GameContext';
import { GridBackground } from './GridBackground';
import { GameHeader } from './GameHeader';
import { GameButton } from './GameButton';
import { PageTransition } from './PageTransition';
import { EditChoicesModal } from './EditChoicesModal';
import { TrendingUp, TrendingDown, LayoutGrid } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts';

// --- Mock Data ---
const kpiCards = [
  { label: 'Revenue', value: '$24,500', badge: 'Week 12', delta: '+12.4% vs last week', positive: true },
  { label: 'Cash Balance', value: '$122,400', badge: null, delta: '+$39,700', positive: true },
  { label: 'Weekly Burn', value: '$12,400', badge: null, delta: '+3.5%', positive: false },
  { label: 'Runway', value: '9.9 wks', badge: null, delta: '-0.3 wks', positive: false },
  { label: 'Retention %', value: '89%', badge: null, delta: '+3% vs M2', positive: true },
  { label: 'Market Share', value: '28%', badge: null, delta: '+2.1%', positive: true },
];

const revenueData = Array.from({ length: 12 }, (_, i) => ({
  week: `W${i + 1}`,
  revenue: 8000 + Math.round(Math.random() * 4000 + i * 1200),
  costs: 6000 + Math.round(Math.random() * 2000 + i * 800),
  profit: 2000 + Math.round(Math.random() * 2000 + i * 400),
}));

const customerData = Array.from({ length: 12 }, (_, i) => ({
  week: `W${i + 1}`,
  regular: 200 + Math.round(i * 15 + Math.random() * 30),
  premium: 80 + Math.round(i * 12 + Math.random() * 20),
}));

const cashFlowData = [
  { name: 'Revenue', value: 24500, color: '#156162' },
  { name: 'COGS', value: -6200, color: '#c65252' },
  { name: 'Labor', value: -3800, color: '#c65252' },
  { name: 'Rent', value: -1200, color: '#c65252' },
  { name: 'Marketing', value: -800, color: '#c65252' },
  { name: 'Operations', value: -400, color: '#c65252' },
  { name: 'Net Cash', value: 12100, color: '#006E85' },
];

const marketShareData = [
  { name: 'Your Restaurant', value: 28, color: '#006E85' },
  { name: 'Team Alpha', value: 22, color: '#4DB5B6' },
  { name: 'Team Beta', value: 18, color: '#94A3B8' },
  { name: 'Team Gamma', value: 15, color: '#B45309' },
  { name: 'Others', value: 17, color: '#CBD5E1' },
];

const monthlyRevBurn = [
  { month: 'M1', revenue: 48000, burn: 52000 },
  { month: 'M2', revenue: 62000, burn: 55000 },
  { month: 'M3', revenue: 74000, burn: 58000 },
];

const monthlyCashRetention = [
  { month: 'M1', cash: 45000, retention: 78 },
  { month: 'M2', cash: 82000, retention: 84 },
  { month: 'M3', cash: 122400, retention: 89 },
];

const tabs = ['Overview', 'Revenue & Cash', 'Customers', 'Valuation'];

export function WeeklyResults() {
  const { state, unlockDecisions, setCurrentWeek } = useGame();
  const navigate = useAppNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [showEditModal, setShowEditModal] = useState(false);

  const handleNextWeek = () => {
    unlockDecisions();
    const nextWeek = state.currentWeek + 1;
    setCurrentWeek(nextWeek);
    if (nextWeek % 4 === 0) {
      navigate('/game/month-review');
    } else if (nextWeek % 26 === 0) {
      navigate('/game/board-review');
    } else {
      navigate('/game/cockpit');
    }
  };

  return (
    <PageTransition>
      <GridBackground className="flex flex-col min-h-screen">
        <GameHeader />

        <div className="max-w-[1288px] mx-auto px-6 w-full pb-16">
          {/* Header row */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1
                className="text-[#202326] mb-1"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '32px', letterSpacing: '-0.32px' }}
              >
                Week {state.currentWeek} Dashboard
              </h1>
              <p className="text-[#606569]" style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
                Streets of Bagbazar - Restaurant Performance
              </p>
            </div>
            <div className="w-[170px]">
              <GameButton onClick={handleNextWeek}>
                Next Round
              </GameButton>
            </div>
          </div>

          {/* KPI Cards Row */}
          <div className="grid grid-cols-6 gap-3 mb-6">
            {kpiCards.map((kpi, i) => (
              <div
                key={i}
                className="bg-white/60 rounded-2xl p-4 relative"
                style={{ border: '1.4px solid white' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#606569]" style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>
                    {kpi.label}
                  </span>
                  {kpi.badge && (
                    <span
                      className="px-2 py-0.5 rounded-full bg-[#006E85] text-white"
                      style={{ fontSize: '9px', fontWeight: 700 }}
                    >
                      {kpi.badge}
                    </span>
                  )}
                </div>
                <div
                  className="text-[#202326] mb-1"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '22px', fontVariantNumeric: 'tabular-nums' }}
                >
                  {kpi.value}
                </div>
                <div className="flex items-center gap-1">
                  {kpi.positive ? (
                    <TrendingUp size={12} color="#156162" />
                  ) : (
                    <TrendingDown size={12} color="#c65252" />
                  )}
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '11px',
                      fontWeight: 600,
                      color: kpi.positive ? '#156162' : '#c65252',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {kpi.delta}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Tab Bar */}
          <div className="flex items-center gap-1 mb-6 bg-white/60 rounded-xl p-1 w-fit" style={{ border: '1.4px solid white' }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === tab
                    ? 'bg-[#006E85] text-white shadow-sm'
                    : 'text-[#606569] hover:text-[#202326] hover:bg-white/50'
                }`}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 500 }}
              >
                {activeTab === tab && <LayoutGrid size={14} />}
                {tab}
              </button>
            ))}
          </div>

          {/* Charts Grid */}
          {activeTab === 'Overview' && <OverviewTab />}
          {activeTab === 'Revenue & Cash' && <RevenueCashTab />}
          {activeTab === 'Customers' && <CustomersTab />}
          {activeTab === 'Valuation' && <ValuationTab />}
        </div>

        <EditChoicesModal
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          onConfirm={() => setShowEditModal(false)}
        />
      </GridBackground>
    </PageTransition>
  );
}

function OverviewTab() {
  return (
    <>
      {/* Row 1: Revenue & Customer Charts */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <ChartCard title="Revenue & Costs" subtitle="Weekly trend over 12 weeks">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#006E85" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#006E85" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, '']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="revenue" stroke="#006E85" strokeWidth={2} fill="url(#revGrad)" />
              <Line type="monotone" dataKey="costs" stroke="#c65252" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="profit" stroke="#166534" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 justify-center">
            <LegendDot color="#006E85" label="Revenue" />
            <LegendDot color="#c65252" label="Costs" />
            <LegendDot color="#166534" label="Profit" />
          </div>
        </ChartCard>

        <ChartCard title="Customer Segments" subtitle="Regular vs Premium acquisition">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={customerData}>
              <defs>
                <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#006E85" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#006E85" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="premGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4DB5B6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4DB5B6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="regular" stroke="#006E85" strokeWidth={2} fill="url(#regGrad)" stackId="1" />
              <Area type="monotone" dataKey="premium" stroke="#4DB5B6" strokeWidth={2} fill="url(#premGrad)" stackId="1" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 justify-center">
            <LegendDot color="#006E85" label="Regular" />
            <LegendDot color="#4DB5B6" label="Premium" />
          </div>
        </ChartCard>
      </div>

      {/* Row 2: Cash Flow, Market Share, Valuation */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <ChartCard title="Cash Flow Breakdown" subtitle="Current week waterfall">
          <div className="space-y-3">
            {cashFlowData.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="w-20 text-right text-[#606569] shrink-0" style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>
                  {item.name}
                </span>
                <div className="flex-1 h-6 bg-[#f0f2f4] rounded-full overflow-hidden relative">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.abs(item.value) / 250}%`,
                      background: item.color,
                    }}
                  />
                </div>
                <span
                  className="w-16 text-right shrink-0"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '12px',
                    fontWeight: 600,
                    color: item.value >= 0 ? '#156162' : '#c65252',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {item.value >= 0 ? '' : '-'}${Math.abs(item.value).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Market Share" subtitle="Competitive landscape">
          <div className="flex items-center gap-4">
            <div className="w-[140px] h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={marketShareData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {marketShareData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {marketShareData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                  <span className="text-[#606569]" style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                    {item.name}
                  </span>
                  <span
                    className="ml-auto"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: 600, color: '#202326', fontVariantNumeric: 'tabular-nums' }}
                  >
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Valuation Summary" subtitle="DCF-based enterprise value">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#f7f8f9] rounded-xl p-3">
                <span className="text-[#606569]" style={{ fontSize: '11px' }}>Enterprise Value</span>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '20px', color: '#202326', fontVariantNumeric: 'tabular-nums' }}>
                  $485K
                </div>
              </div>
              <div className="bg-[#f7f8f9] rounded-xl p-3">
                <span className="text-[#c65252]" style={{ fontSize: '11px' }}>Founder Value</span>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '20px', color: '#202326', fontVariantNumeric: 'tabular-nums' }}>
                  $412K
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[#606569]" style={{ fontSize: '11px' }}>Growth Rate</span>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '18px', color: '#156162', fontVariantNumeric: 'tabular-nums' }}>
                  18.5%
                </div>
              </div>
              <div>
                <span className="text-[#606569]" style={{ fontSize: '11px' }}>Stability</span>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '18px', color: '#202326', fontVariantNumeric: 'tabular-nums' }}>
                  72/100
                </div>
              </div>
            </div>
            {/* Ownership bar */}
            <div className="bg-[#f0f2f4] rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#006E85]" style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: 600 }}>
                  Founder Ownership
                </span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 700, color: '#006E85', fontVariantNumeric: 'tabular-nums' }}>
                  85%
                </span>
              </div>
              <div className="h-3 bg-white rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-[#006E85]" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Row 3: Monthly Performance Trends */}
      <ChartCard title="Monthly Performance Trends" subtitle="Key metrics by month">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="text-[#202326] mb-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 700 }}>
              Revenue vs Burn Rate
            </h4>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={monthlyRevBurn}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, '']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="revenue" fill="#006E85" radius={[4, 4, 0, 0]} />
                <Bar dataKey="burn" fill="#c65252" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-2 justify-center">
              <LegendDot color="#006E85" label="revenue" />
              <LegendDot color="#c65252" label="burn" />
            </div>
          </div>
          <div>
            <h4 className="text-[#202326] mb-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 700 }}>
              Cash Position & Retention
            </h4>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={monthlyCashRetention}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94A3B8' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#94A3B8' }} tickFormatter={(v) => `${v}%`} domain={[70, 100]} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar yAxisId="left" dataKey="cash" fill="#4DB5B6" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="left" dataKey="retention" fill="#006E85" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-2 justify-center">
              <LegendDot color="#4DB5B6" label="cash" />
              <LegendDot color="#006E85" label="retention" />
            </div>
          </div>
        </div>
      </ChartCard>
    </>
  );
}

function RevenueCashTab() {
  const weeklyData = Array.from({ length: 12 }, (_, i) => ({
    week: `W${i + 1}`,
    revenue: 8000 + Math.round(i * 1400 + 2000),
    cogs: 3000 + Math.round(i * 300 + 500),
    labor: 3500 + Math.round(i * 100),
    rent: 3000,
    marketing: 800 + Math.round(i * 50),
    netCash: 1700 + Math.round(i * 900),
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Revenue (12W)', value: '$198,400', color: '#156162' },
          { label: 'Total Expenses (12W)', value: '$148,200', color: '#c65252' },
          { label: 'Gross Margin', value: '25.3%', color: '#156162' },
          { label: 'Cash Efficiency', value: '1.34x', color: '#006E85' },
        ].map((m) => (
          <div key={m.label} className="bg-white/60 rounded-2xl p-5 text-center" style={{ border: '1.4px solid white' }}>
            <span className="text-[#606569]" style={{ fontSize: '11px' }}>{m.label}</span>
            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '24px', color: m.color, fontVariantNumeric: 'tabular-nums' }}>{m.value}</div>
          </div>
        ))}
      </div>
      <ChartCard title="Weekly Revenue Breakdown" subtitle="Stacked view of income and expenses">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94A3B8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <Bar dataKey="revenue" fill="#006E85" radius={[4, 4, 0, 0]} name="Revenue" />
            <Bar dataKey="cogs" fill="#c65252" radius={[4, 4, 0, 0]} name="COGS" />
            <Bar dataKey="labor" fill="#B45309" radius={[4, 4, 0, 0]} name="Labor" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function CustomersTab() {
  const acquisitionData = Array.from({ length: 12 }, (_, i) => ({
    week: `W${i + 1}`,
    newCustomers: 20 + Math.round(i * 3 + Math.random() * 10),
    churned: 5 + Math.round(Math.random() * 8),
    retained: 60 + Math.round(i * 5),
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Unique Customers', value: '1,248', color: '#156162' },
          { label: 'Avg Weekly Retention', value: '89%', color: '#006E85' },
          { label: 'Customer LTV', value: '$142', color: '#156162' },
          { label: 'Churn Rate', value: '11%', color: '#c65252' },
        ].map((m) => (
          <div key={m.label} className="bg-white/60 rounded-2xl p-5 text-center" style={{ border: '1.4px solid white' }}>
            <span className="text-[#606569]" style={{ fontSize: '11px' }}>{m.label}</span>
            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '24px', color: m.color, fontVariantNumeric: 'tabular-nums' }}>{m.value}</div>
          </div>
        ))}
      </div>
      <ChartCard title="Customer Acquisition & Retention" subtitle="Weekly new, retained, and churned customers">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={acquisitionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94A3B8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <Area type="monotone" dataKey="retained" stroke="#006E85" fill="#006E85" fillOpacity={0.15} strokeWidth={2} />
            <Area type="monotone" dataKey="newCustomers" stroke="#4DB5B6" fill="#4DB5B6" fillOpacity={0.15} strokeWidth={2} />
            <Area type="monotone" dataKey="churned" stroke="#c65252" fill="#c65252" fillOpacity={0.1} strokeWidth={1.5} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-2 justify-center">
          <LegendDot color="#006E85" label="Retained" />
          <LegendDot color="#4DB5B6" label="New" />
          <LegendDot color="#c65252" label="Churned" />
        </div>
      </ChartCard>
    </div>
  );
}

function ValuationTab() {
  const valuationTrend = [
    { period: 'W1', ev: 320000, fv: 272000 },
    { period: 'W4', ev: 380000, fv: 323000 },
    { period: 'W8', ev: 440000, fv: 374000 },
    { period: 'W12', ev: 485000, fv: 412000 },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/60 rounded-2xl p-6" style={{ border: '1.4px solid white' }}>
          <span className="text-[#606569]" style={{ fontSize: '11px' }}>Enterprise Value</span>
          <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '32px', color: '#156162', fontVariantNumeric: 'tabular-nums' }}>$485,000</div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp size={12} color="#156162" />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#156162', fontWeight: 600 }}>+51.6% since W1</span>
          </div>
        </div>
        <div className="bg-white/60 rounded-2xl p-6" style={{ border: '1.4px solid white' }}>
          <span className="text-[#606569]" style={{ fontSize: '11px' }}>Founder Equity Value</span>
          <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '32px', color: '#006E85', fontVariantNumeric: 'tabular-nums' }}>$412,000</div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp size={12} color="#006E85" />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#006E85', fontWeight: 600 }}>85% ownership</span>
          </div>
        </div>
        <div className="bg-white/60 rounded-2xl p-6" style={{ border: '1.4px solid white' }}>
          <span className="text-[#606569]" style={{ fontSize: '11px' }}>Fundraise Eligibility</span>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-3 h-3 rounded-full bg-[#166534]" />
            <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '18px', color: '#166534' }}>Eligible</span>
          </div>
          <p className="text-[#606569] mt-2" style={{ fontSize: '11px' }}>Available at next Board Review</p>
        </div>
      </div>

      <ChartCard title="Valuation Trajectory" subtitle="Enterprise & Founder value over time">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={valuationTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#94A3B8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, '']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <Line type="monotone" dataKey="ev" stroke="#156162" strokeWidth={2.5} name="Enterprise Value" dot={{ fill: '#156162', r: 4 }} />
            <Line type="monotone" dataKey="fv" stroke="#006E85" strokeWidth={2} name="Founder Value" dot={{ fill: '#006E85', r: 4 }} strokeDasharray="6 3" />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-2 justify-center">
          <LegendDot color="#156162" label="Enterprise Value" />
          <LegendDot color="#006E85" label="Founder Value" />
        </div>
      </ChartCard>

      {/* Health Gauges */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Revenue Growth', value: 78, color: '#156162' },
          { label: 'Retention Quality', value: 89, color: '#006E85' },
          { label: 'Margin Stability', value: 62, color: '#B45309' },
          { label: 'Market Position', value: 72, color: '#4DB5B6' },
        ].map((gauge) => (
          <div key={gauge.label} className="bg-white/60 rounded-2xl p-4" style={{ border: '1.4px solid white' }}>
            <span className="text-[#606569]" style={{ fontSize: '11px' }}>{gauge.label}</span>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-2.5 bg-[#f0f2f4] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${gauge.value}%`, background: gauge.color }} />
              </div>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 700, color: gauge.color, fontVariantNumeric: 'tabular-nums' }}>
                {gauge.value}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Shared Sub-components ---
function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/60 rounded-2xl p-5" style={{ border: '1.4px solid white' }}>
      <h3 className="text-[#202326] mb-0.5" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '16px' }}>
        {title}
      </h3>
      <p className="text-[#94A3B8] mb-4" style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px' }}>
        {subtitle}
      </p>
      {children}
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
      <span className="text-[#94A3B8]" style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
        {label}
      </span>
    </div>
  );
}
