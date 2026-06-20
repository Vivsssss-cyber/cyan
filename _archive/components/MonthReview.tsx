import React, { useState } from 'react';
import { useAppNavigate } from '../../lib/use-app-navigate';
import { useGame } from '../context/GameContext';
import { GridBackground } from './GridBackground';
import { GameHeader } from './GameHeader';
import { GameButton } from './GameButton';
import { PageTransition } from './PageTransition';
import {
  Users, Heart, Settings, Lightbulb, Package, Landmark, UserPlus, BarChart3,
  Check, DollarSign, TrendingUp, TrendingDown, LayoutGrid, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid,
  AreaChart, Area, LineChart, Line, PieChart, Pie,
} from 'recharts';

const FI = "'Inter', sans-serif";

// --- Monthly KPIs ---
const monthKpis = [
  { label: 'Monthly Revenue', value: '$99,200', delta: '+18.4%', positive: true, icon: DollarSign },
  { label: 'Total Costs', value: '$119,700', delta: '+8.2%', positive: false, icon: TrendingDown },
  { label: 'Net Cash Change', value: '-$20,500', delta: 'Improving', positive: true, icon: TrendingUp },
  { label: 'Avg Customers/Week', value: '342', delta: '+24 vs M2', positive: true, icon: Users },
  { label: 'Retention Rate', value: '86%', delta: '+4% vs M2', positive: true, icon: Heart },
  { label: 'Market Share', value: '28%', delta: '+2.1%', positive: true, icon: BarChart3 },
];

// --- Waterfall Data ---
const waterfallData = [
  { name: 'Revenue', value: 99200, fill: '#006E85' },
  { name: 'COGS', value: -32800, fill: '#C0392B' },
  { name: 'Labour', value: -22400, fill: '#C0392B' },
  { name: 'Rent', value: -52500, fill: '#C0392B' },
  { name: 'Marketing', value: -12000, fill: '#C0392B' },
  { name: 'Net', value: -20500, fill: '#B45309' },
];

// --- Weekly breakdown within this month ---
const weeklyBreakdown = [
  { week: 'W1', revenue: 22400, costs: 28500, customers: 310, retention: 82 },
  { week: 'W2', revenue: 24100, costs: 29200, customers: 335, retention: 84 },
  { week: 'W3', revenue: 25800, costs: 30500, customers: 348, retention: 87 },
  { week: 'W4', revenue: 26900, costs: 31500, customers: 375, retention: 89 },
];

// --- Expense breakdown pie ---
const expenseBreakdown = [
  { name: 'COGS', value: 32800, color: '#006E85' },
  { name: 'Labour', value: 22400, color: '#4DB5B6' },
  { name: 'Rent', value: 52500, color: '#003D47' },
  { name: 'Marketing', value: 12000, color: '#B45309' },
];

// --- Month-over-month comparison ---
const monthComparison = [
  { month: 'M1', revenue: 48000, costs: 52000, margin: -8.3 },
  { month: 'M2', revenue: 72000, costs: 65000, margin: 9.7 },
  { month: 'M3', revenue: 99200, costs: 119700, margin: -20.7 },
];

const tabs = ['Overview', 'Financials', 'Operations', 'Investments'];

// --- Monthly decisions data ---
const monthlyDecisions = [
  { id: 1, icon: Users, title: 'Employee Capacity, Bonus & Training', cost: '$25,000', impact: '+2.5% productivity', color: '#006E85' },
  { id: 2, icon: Heart, title: 'Customer Satisfaction & Relationship Push', cost: '$25,000', impact: '+10% satisfaction', color: '#006E85' },
  { id: 3, icon: Settings, title: 'Operation Optimization', cost: '$25,000', impact: '+2% efficiency', color: '#006E85' },
  { id: 4, icon: Lightbulb, title: 'Customer R&D / Product Improvement', cost: '$25,000', impact: '+3% demand', color: '#006E85' },
  { id: 5, icon: Package, title: 'Supplier Relation to Cost & Credit', cost: '$25,000', impact: '+5% COGS reduction', color: '#006E85' },
  { id: 6, icon: Landmark, title: 'Loan Adjustments / Refinancing', cost: 'Variable', impact: 'Lowers interest burden', color: '#B45309' },
  { id: 7, icon: UserPlus, title: 'Hiring / Firing Strategic Adjustment', cost: 'Variable', impact: 'Expand/contract labour', color: '#B45309' },
  { id: 8, icon: BarChart3, title: 'Financial View: Burn & Runway Check', cost: '$0', impact: 'Unlocks warning flags', color: '#166534' },
];

export function MonthReview() {
  const { state, setCurrentWeek } = useGame();
  const navigate = useAppNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [activated, setActivated] = useState<number[]>([]);
  const monthNum = Math.ceil(state.currentWeek / 4);

  const toggleDecision = (id: number) => {
    setActivated(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <GridBackground className="flex flex-col min-h-screen">
      <PageTransition>
      <GameHeader />

      <div className="max-w-[1288px] mx-auto px-6 w-full pb-24">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1
              className="text-[#202326] mb-1"
              style={{ fontFamily: FI, fontWeight: 700, fontSize: '32px', letterSpacing: '-0.32px' }}
            >
              Month {monthNum} Dashboard
            </h1>
            <p className="text-[#606569]" style={{ fontFamily: FI, fontSize: '14px' }}>
              4-Week Performance Review & Strategic Investments
            </p>
          </div>
          <div className="w-[200px]">
            <GameButton
              onClick={() => {
                setCurrentWeek(state.currentWeek + 1);
                navigate('/game/cockpit');
              }}
            >
              Proceed to Week {state.currentWeek + 1}
            </GameButton>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-6 gap-3 mb-6">
          {monthKpis.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <div key={i} className="bg-white/60 rounded-2xl p-4" style={{ border: '1.4px solid white' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={14} color="#94A3B8" />
                  <span className="text-[#606569]" style={{ fontFamily: FI, fontSize: '11px' }}>{kpi.label}</span>
                </div>
                <div
                  className="text-[#202326] mb-1"
                  style={{ fontFamily: FI, fontWeight: 700, fontSize: '20px', fontVariantNumeric: 'tabular-nums' }}
                >
                  {kpi.value}
                </div>
                <div className="flex items-center gap-1">
                  {kpi.positive ? (
                    <ArrowUpRight size={12} color="#156162" />
                  ) : (
                    <ArrowDownRight size={12} color="#c65252" />
                  )}
                  <span style={{ fontFamily: FI, fontSize: '11px', fontWeight: 600, color: kpi.positive ? '#156162' : '#c65252' }}>
                    {kpi.delta}
                  </span>
                </div>
              </div>
            );
          })}
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
              style={{ fontFamily: FI, fontSize: '13px', fontWeight: 500 }}
            >
              {activeTab === tab && <LayoutGrid size={14} />}
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'Overview' && (
          <>
            {/* Row 1: Waterfall + Expense Breakdown */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="col-span-2">
                <ChartCard title="Cash Flow Waterfall" subtitle="Month-end revenue to net cash bridge">
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={waterfallData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {waterfallData.map((entry, index) => (
                          <Cell key={index} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
              <ChartCard title="Expense Breakdown" subtitle="Cost distribution this month">
                <div className="space-y-3 mt-2">
                  {expenseBreakdown.map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                      <span className="flex-1 text-[#606569]" style={{ fontFamily: FI, fontSize: '12px' }}>{item.name}</span>
                      <div className="flex-1 h-2 bg-[#f0f2f4] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(item.value / 52500) * 100}%`, background: item.color }} />
                      </div>
                      <span style={{ fontFamily: FI, fontSize: '12px', fontWeight: 600, color: '#202326', fontVariantNumeric: 'tabular-nums' }}>
                        ${(item.value / 1000).toFixed(1)}K
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-[#e5e7eb]">
                  <div className="flex justify-between">
                    <span className="text-[#606569]" style={{ fontFamily: FI, fontSize: '12px' }}>Total Expenses</span>
                    <span style={{ fontFamily: FI, fontSize: '14px', fontWeight: 700, color: '#c65252', fontVariantNumeric: 'tabular-nums' }}>$119,700</span>
                  </div>
                </div>
              </ChartCard>
            </div>

            {/* Row 2: Weekly breakdown + Market share */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <ChartCard title="Weekly Revenue Trend" subtitle="This month's 4-week performance">
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={weeklyBreakdown}>
                    <defs>
                      <linearGradient id="mRevGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#006E85" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#006E85" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#006E85" strokeWidth={2} fill="url(#mRevGrad)" />
                    <Line type="monotone" dataKey="costs" stroke="#c65252" strokeWidth={1.5} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="flex items-center gap-4 mt-2 justify-center">
                  <LegendDot color="#006E85" label="Revenue" />
                  <LegendDot color="#c65252" label="Costs" />
                </div>
              </ChartCard>

              <ChartCard title="Market Share & Health" subtitle="Competitive position this month">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 h-6 rounded-full bg-[#F0F6FA] overflow-hidden flex">
                    <div className="h-full bg-[#00C1EB]" style={{ width: '28%' }} />
                    <div className="h-full bg-[#003D47]" style={{ width: '25%' }} />
                    <div className="h-full bg-[#7C3AED]" style={{ width: '22%' }} />
                    <div className="h-full bg-[#B45309]" style={{ width: '25%' }} />
                  </div>
                  <span style={{ fontFamily: FI, fontSize: '16px', fontWeight: 700, color: '#006E85', fontVariantNumeric: 'tabular-nums' }}>28%</span>
                </div>
                <div className="flex gap-4 mb-4">
                  {[
                    { color: '#00C1EB', label: 'You (28%)' },
                    { color: '#003D47', label: 'Team B (25%)' },
                    { color: '#7C3AED', label: 'Team C (22%)' },
                    { color: '#B45309', label: 'Team D (25%)' },
                  ].map((t) => (
                    <div key={t.label} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} />
                      <span className="text-[#64748B]" style={{ fontSize: '11px' }}>{t.label}</span>
                    </div>
                  ))}
                </div>
                {/* Health Scores */}
                <div className="space-y-2.5">
                  {[
                    { label: 'Customer Satisfaction', value: 74, color: '#006E85' },
                    { label: 'Operational Efficiency', value: 68, color: '#4DB5B6' },
                    { label: 'Revenue Growth', value: 82, color: '#156162' },
                  ].map((gauge) => (
                    <div key={gauge.label}>
                      <div className="flex justify-between mb-1">
                        <span className="text-[#606569]" style={{ fontFamily: FI, fontSize: '11px' }}>{gauge.label}</span>
                        <span style={{ fontFamily: FI, fontSize: '11px', fontWeight: 700, color: gauge.color, fontVariantNumeric: 'tabular-nums' }}>{gauge.value}%</span>
                      </div>
                      <div className="h-2 bg-[#f0f2f4] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${gauge.value}%`, background: gauge.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </ChartCard>
            </div>

            {/* Row 3: Month-over-month */}
            <ChartCard title="Month-over-Month Comparison" subtitle="Revenue, costs, and margin trend">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="revenue" fill="#006E85" radius={[4, 4, 0, 0]} name="Revenue" />
                  <Bar dataKey="costs" fill="#c65252" radius={[4, 4, 0, 0]} name="Costs" />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-4 mt-2 justify-center">
                <LegendDot color="#006E85" label="Revenue" />
                <LegendDot color="#c65252" label="Costs" />
              </div>
            </ChartCard>
          </>
        )}

        {activeTab === 'Financials' && (
          <div className="space-y-4">
            {/* P&L Summary */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Gross Revenue', value: '$99,200', color: '#156162' },
                { label: 'Total COGS', value: '$32,800', color: '#c65252' },
                { label: 'Gross Margin', value: '66.9%', color: '#006E85' },
                { label: 'Operating Margin', value: '-20.7%', color: '#c65252' },
              ].map((m) => (
                <div key={m.label} className="bg-white/60 rounded-2xl p-5 text-center" style={{ border: '1.4px solid white' }}>
                  <span className="text-[#606569]" style={{ fontSize: '11px' }}>{m.label}</span>
                  <div style={{ fontFamily: FI, fontWeight: 700, fontSize: '24px', color: m.color, fontVariantNumeric: 'tabular-nums' }}>{m.value}</div>
                </div>
              ))}
            </div>

            {/* P&L Table */}
            <ChartCard title="Profit & Loss Statement" subtitle="Monthly income statement breakdown">
              <div className="space-y-2">
                {[
                  { label: 'Revenue', amount: 99200, pct: 100, color: '#156162', bold: true },
                  { label: 'Cost of Goods Sold', amount: -32800, pct: -33.1, color: '#c65252', bold: false },
                  { label: 'Gross Profit', amount: 66400, pct: 66.9, color: '#156162', bold: true },
                  { label: 'Labour Costs', amount: -22400, pct: -22.6, color: '#c65252', bold: false },
                  { label: 'Rent & Utilities', amount: -52500, pct: -52.9, color: '#c65252', bold: false },
                  { label: 'Marketing Spend', amount: -12000, pct: -12.1, color: '#c65252', bold: false },
                  { label: 'Net Income', amount: -20500, pct: -20.7, color: '#c65252', bold: true },
                ].map((row) => (
                  <div key={row.label} className={`flex items-center justify-between py-2 ${row.bold ? 'border-t border-[#e5e7eb]' : ''}`}>
                    <span className="text-[#202326]" style={{ fontFamily: FI, fontSize: '13px', fontWeight: row.bold ? 700 : 400 }}>
                      {row.label}
                    </span>
                    <div className="flex items-center gap-6">
                      <span style={{ fontFamily: FI, fontSize: '13px', fontWeight: 600, color: row.color, fontVariantNumeric: 'tabular-nums' }}>
                        {row.amount >= 0 ? '' : '-'}${Math.abs(row.amount).toLocaleString()}
                      </span>
                      <span className="w-12 text-right" style={{ fontFamily: FI, fontSize: '11px', color: '#94A3B8', fontVariantNumeric: 'tabular-nums' }}>
                        {row.pct >= 0 ? '' : ''}{row.pct.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        )}

        {activeTab === 'Operations' && (
          <div className="space-y-4">
            {/* Operational metrics */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Avg Wait Time', value: '12 min', color: '#B45309' },
                { label: 'Table Turnover', value: '3.2x', color: '#006E85' },
                { label: 'Staff Utilization', value: '78%', color: '#156162' },
                { label: 'Waste Rate', value: '8.4%', color: '#c65252' },
              ].map((m) => (
                <div key={m.label} className="bg-white/60 rounded-2xl p-5 text-center" style={{ border: '1.4px solid white' }}>
                  <span className="text-[#606569]" style={{ fontSize: '11px' }}>{m.label}</span>
                  <div style={{ fontFamily: FI, fontWeight: 700, fontSize: '24px', color: m.color, fontVariantNumeric: 'tabular-nums' }}>{m.value}</div>
                </div>
              ))}
            </div>

            {/* Customer + Retention chart */}
            <ChartCard title="Weekly Customer & Retention Trend" subtitle="Customers served and retention rate this month">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={weeklyBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#94A3B8' }} tickFormatter={(v) => `${v}%`} domain={[70, 100]} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar yAxisId="left" dataKey="customers" fill="#006E85" radius={[4, 4, 0, 0]} name="Customers" />
                  <Line yAxisId="right" type="monotone" dataKey="retention" stroke="#4DB5B6" strokeWidth={2.5} name="Retention %" dot={{ fill: '#4DB5B6', r: 4 }} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-4 mt-2 justify-center">
                <LegendDot color="#006E85" label="Customers" />
                <LegendDot color="#4DB5B6" label="Retention %" />
              </div>
            </ChartCard>
          </div>
        )}

        {activeTab === 'Investments' && (
          <div className="mb-8">
            <h3 className="text-[#202326] mb-4" style={{ fontFamily: FI, fontSize: '20px', fontWeight: 700 }}>
              Monthly Strategic Investments
            </h3>
            <p className="text-[#606569] mb-6" style={{ fontFamily: FI, fontSize: '13px' }}>
              Select investments to activate. Costs are deducted from cash balance immediately.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {monthlyDecisions.map((dec) => {
                const isActive = activated.includes(dec.id);
                const Icon = dec.icon;
                return (
                  <div
                    key={dec.id}
                    className="bg-white/60 rounded-2xl p-4 transition-all cursor-pointer"
                    style={{
                      border: isActive ? '1.4px solid rgba(21,97,98,0.33)' : '1.4px solid white',
                      boxShadow: isActive ? '0px 2.5px 10px 0px rgba(77,181,182,0.29)' : 'none',
                    }}
                    onClick={() => toggleDecision(dec.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#E0F7FF] shrink-0">
                          <Icon size={18} color="#006E85" />
                        </div>
                        <div>
                          <h4 className="text-[#002C33]" style={{ fontFamily: FI, fontSize: '13px', fontWeight: 700 }}>{dec.title}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span style={{ fontFamily: FI, fontSize: '13px', fontWeight: 700, color: '#C0392B', fontVariantNumeric: 'tabular-nums' }}>
                              {dec.cost}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-[#F0F6FA] text-[#166534]" style={{ fontSize: '10px', fontWeight: 600 }}>
                              {dec.impact}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        className={`px-3 py-1.5 rounded-full transition-all ${
                          isActive
                            ? 'bg-[#00C1EB] text-white'
                            : 'border border-[#C8DDE6] text-[#64748B] hover:bg-[#E0F7FF]'
                        }`}
                        style={{ fontSize: '11px', fontWeight: 700 }}
                      >
                        {isActive ? <Check size={14} /> : 'Activate'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
