'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { GridBackground } from './GridBackground';
import { PageTransition } from './PageTransition';
import { GameHeader } from './GameHeader';
import { GameButton } from './GameButton';
import { TabBar } from './TabBar';
import {
  Check, ArrowUpRight, ArrowDownRight, Info,
  Layers, Box, Heart, DollarSign, Star, Users, ShoppingCart, Coffee,
  Package, RefreshCw, Plus, TrendingUp, Award,
} from './PixelIcons';

const FO = "'Outfit', sans-serif";
const INK = 'var(--game-text)';
const TEXT = 'var(--game-text-secondary)';
const MUTED = 'var(--game-text-muted)';
const BORDER = 'var(--color-border)';
const SURFACE = 'rgba(255,255,255,0.6)';
const SOLID = 'var(--game-surface-solid)';
const TINT = 'var(--game-cyan-tint)';
const TEAL = 'var(--game-teal-mid)';
const CYAN = 'var(--game-cyan)';
const DEEP = 'var(--color-chart-2)';
const SOFT_TEAL = 'var(--color-chart-6)';
const AMBER = 'var(--game-warning)';
const RED = 'var(--game-negative)';
const POSITIVE = 'var(--game-positive)';
const CTA_BG = 'var(--game-cta-gradient)';
const STRATEGIC = 'linear-gradient(135deg, #006E85 0%, #003D47 100%)';

// Figma html-to-design capture can't resolve CSS var() inside SVG <linearGradient>
// <stop> — it renders them black. Map the tokens used in gradients to literal hex
// (keep in sync with theme.css) and resolve stop colors through solidStop().
const GRADIENT_HEX: Record<string, string> = {
  'var(--game-cyan)': '#00C1EB',
  'var(--game-teal-mid)': '#006E85',
};
const solidStop = (c: string) => GRADIENT_HEX[c] ?? c;

const viewTabs = [
  { id: 'report', label: 'Report' },
  { id: 'decisions', label: 'Decisions' },
];

// ════════════════════════════════════════════════════════════════════════════
//  Shared primitives
// ════════════════════════════════════════════════════════════════════════════
function Panel({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <section className={`ao-lift rounded-2xl p-5 ${className}`} style={{ background: SURFACE, border: '1.4px solid white', boxShadow: 'var(--shadow-elev-1)', ...style }}>
      {children}
    </section>
  );
}

const AO_CSS = `
.ao-lift{transition:transform .2s ease, box-shadow .2s ease;}
.ao-lift:hover{transform:translateY(-3px);box-shadow:0 16px 36px rgba(0,44,51,0.13);}
.ms-fill{transform-origin:left center;animation:msGrow .6s cubic-bezier(0.22,1,0.36,1) both;}
@keyframes msGrow{from{transform:scaleX(0);}to{transform:scaleX(1);}}
@media (prefers-reduced-motion: reduce){.ms-fill{animation:none;}}
`;

function SectionLabel({ title }: { tag?: string; title: string; desc?: string }) {
  return (
    <div className="mb-4">
      <h2 style={{ fontFamily: FO, fontSize: 17, fontWeight: 800, color: INK, letterSpacing: '-0.01em', margin: 0 }}>{title}</h2>
    </div>
  );
}

function CardHead({ title }: { title: string; sub?: string; badge?: string; badgeTone?: 'cyan' | 'positive' }) {
  return (
    <div className="mb-3">
      <h3 style={{ fontFamily: FO, fontSize: 15, fontWeight: 700, color: INK, margin: 0 }}>{title}</h3>
    </div>
  );
}

function Delta({ value, positive, suffix = '', showIcon = true }: { value: string; positive: boolean; suffix?: string; showIcon?: boolean }) {
  const color = positive ? POSITIVE : RED;
  return (
    <span className="inline-flex items-center gap-1" style={{ color, fontFamily: FO, fontSize: 11, fontWeight: 700 }}>
      {showIcon && (positive ? <ArrowUpRight size={11} color={color} /> : <ArrowDownRight size={11} color={color} />)}
      {value}{suffix}
    </span>
  );
}

function IconShell({ children, size = 38 }: { children: React.ReactNode; size?: number }) {
  return (
    <span style={{ alignItems: 'center', background: TINT, border: `1px solid ${BORDER}`, borderRadius: 11, color: TEAL, display: 'flex', flexShrink: 0, height: size, justifyContent: 'center', width: size }}>
      {children}
    </span>
  );
}

// KPI ribbon tile — flat glass, accent dot (no left ribbon border)
function KpiTile({ Icon, label, value, delta, positive }: { Icon: React.ComponentType<{ size?: number; color?: string }>; label: string; value: string; delta: string; positive: boolean }) {
  return (
    <div className="ao-lift rounded-2xl p-4" style={{ background: SURFACE, border: '1.4px solid white', boxShadow: 'var(--shadow-elev-1)' }}>
      <div className="flex items-center gap-2">
        <IconShell size={30}><Icon size={15} color={TEAL} /></IconShell>
        <span style={{ fontFamily: FO, fontSize: 11, fontWeight: 600, color: TEXT, lineHeight: 1.2 }}>{label}</span>
      </div>
      <div style={{ fontFamily: FO, fontSize: 22, fontWeight: 800, color: INK, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', marginTop: 10 }}>{value}</div>
      <div style={{ marginTop: 4 }}><Delta value={delta} positive={positive} showIcon={false} /></div>
    </div>
  );
}

// Plain stat block for dense metric grids
function Stat({ label, value, delta, positive, accent = INK, Icon, showDeltaIcon = true }: { label: string; value: string; delta?: string; positive?: boolean; accent?: string; Icon?: React.ComponentType<{ size?: number; color?: string }>; showDeltaIcon?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      {Icon && (
        <IconShell size={42}>
          <Icon size={20} color={TEAL} />
        </IconShell>
      )}
      <div>
        <div style={{ fontFamily: FO, fontSize: 11, fontWeight: 600, color: TEXT }}>{label}</div>
        <div style={{ fontFamily: FO, fontSize: 20, fontWeight: 800, color: accent, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', marginTop: 3 }}>{value}</div>
        {delta && <div style={{ marginTop: 3 }}><Delta value={delta} positive={!!positive} showIcon={showDeltaIcon} /></div>}
      </div>
    </div>
  );
}

function Donut({ pct, color, center, sub }: { pct: number; color: string; center: string; sub?: string }) {
  const data = [{ v: pct }, { v: 100 - pct }];
  return (
    <div className="relative" style={{ height: 96, width: 96 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="v" innerRadius={32} outerRadius={46} startAngle={90} endAngle={-270} stroke="none" isAnimationActive={false}>
            <Cell fill={color} />
            <Cell fill="var(--muted)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span style={{ fontFamily: FO, fontSize: 18, fontWeight: 800, color: INK, fontVariantNumeric: 'tabular-nums' }}>{center}</span>
        {sub && <span style={{ fontFamily: FO, fontSize: 9, fontWeight: 600, color: MUTED }}>{sub}</span>}
      </div>
    </div>
  );
}

function ChartTip({ active, payload, label, suffix = '', prefix = '' }: { active?: boolean; payload?: Array<{ name: string; value: number; color?: string }>; label?: string; suffix?: string; prefix?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--color-popover)', border: `1px solid ${BORDER}`, borderRadius: 12, boxShadow: 'var(--shadow-elev-2)', fontFamily: FO, minWidth: 140, padding: 12 }}>
      {label && <div style={{ color: INK, fontSize: 12, fontWeight: 800, marginBottom: 6 }}>{label}</div>}
      {payload.map((it) => (
        <div key={it.name} className="flex items-center justify-between gap-5" style={{ color: TEXT, fontSize: 12 }}>
          <span className="inline-flex items-center gap-1.5">
            <span style={{ background: it.color ?? TEAL, borderRadius: 999, height: 8, width: 8, display: 'inline-block' }} />
            {it.name}
          </span>
          <span style={{ color: INK, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{prefix}{it.value}{suffix}</span>
        </div>
      ))}
    </div>
  );
}

function Legend({ items }: { items: Array<{ label: string; color: string }> }) {
  return (
    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5" style={{ fontFamily: FO, fontSize: 11, fontWeight: 700, color: TEXT }}>
      {items.map((it) => (
        <span key={it.label} className="inline-flex items-center gap-2">
          <span aria-hidden style={{ background: it.color, borderRadius: 999, height: 8, width: 18, display: 'inline-block' }} />
          {it.label}
        </span>
      ))}
    </div>
  );
}

const axisTick = { fontSize: 10, fill: MUTED, fontFamily: FO };

// ════════════════════════════════════════════════════════════════════════════
//  REPORT DATA
// ════════════════════════════════════════════════════════════════════════════
const ribbonKpis = [
  { Icon: TrendingUp, label: 'Total Revenue', value: '$644,000', delta: '+12% vs Year 4', positive: true },
  { Icon: Users, label: 'Total Customers', value: '86,420', delta: '+32.7% vs Year 4', positive: true },
  { Icon: Heart, label: 'Customer Retention', value: '71.0%', delta: '+12.6pp vs Year 4', positive: true },
  { Icon: Award, label: 'Market Share', value: '18.4%', delta: '+4.8pp vs Year 4', positive: true },
  { Icon: ShoppingCart, label: 'Avg Order Value', value: '$17.80', delta: '+9.2% vs Year 4', positive: true },
  { Icon: DollarSign, label: 'Operating Margin', value: '8.2%', delta: '+1.5pp vs Year 4', positive: true },
  { Icon: RefreshCw, label: 'CAC Efficiency', value: '$10.60', delta: '+14.6% vs Year 4', positive: true },
];

const monthlyPerformance = [
  { m: 'Jan', revenue: 38, cost: 31, profit: 7 },
  { m: 'Feb', revenue: 42, cost: 33, profit: 9 },
  { m: 'Mar', revenue: 46, cost: 35, profit: 11 },
  { m: 'Apr', revenue: 49, cost: 37, profit: 12 },
  { m: 'May', revenue: 52, cost: 38, profit: 14 },
  { m: 'Jun', revenue: 54, cost: 39, profit: 15 },
  { m: 'Jul', revenue: 56, cost: 40, profit: 16 },
  { m: 'Aug', revenue: 57, cost: 40, profit: 17 },
  { m: 'Sep', revenue: 58, cost: 41, profit: 17 },
  { m: 'Oct', revenue: 60, cost: 42, profit: 18 },
  { m: 'Nov', revenue: 62, cost: 42, profit: 20 },
  { m: 'Dec', revenue: 64, cost: 43, profit: 21 },
];

const fullYearSummary = [
  { label: 'Revenue', value: '$644K', delta: '+72% vs Year 4', positive: true, color: CYAN },
  { label: 'Cost', value: '$460K', delta: '+9% vs Year 4', positive: false, color: AMBER },
  { label: 'Profit', value: '$184K', delta: '+28% vs Year 4', positive: true, color: TEAL },
];

const yearReview = [
  { q: 'Q1', title: 'Strong Start', desc: 'Solid demand and customer acquisition momentum.', revenue: '$138K', customers: '18.2K', retention: '64.2%' },
  { q: 'Q2', title: 'Building Momentum', desc: 'Improved retention and market share through better experiences.', revenue: '$156K', customers: '19.6K', retention: '69.3%' },
  { q: 'Q3', title: 'Scaling Up', desc: 'Higher order value and operational leverage kick-in.', revenue: '$168K', customers: '23.1K', retention: '70.5%' },
  { q: 'Q4', title: 'Finishing Strong', desc: 'Peak performance in retention, market share, and profitability.', revenue: '$182K', customers: '26.5K', retention: '71.0%' },
];

const marketShareTrend = [
  { y: 'Year 4', v: 13.6 }, { y: 'Year 5', v: 18.4 },
];

const segmentMix = [
  { name: 'Premium Buyers', pct: 22.6, color: DEEP },
  { name: 'Balanced Buyers', pct: 47.8, color: CYAN },
  { name: 'Value Buyers', pct: 29.6, color: SOFT_TEAL },
];

const segmentMascots = [
  { 
    name: 'Premium Buyers', 
    pct: 22.6, 
    color: DEEP, 
    src: '/annual-report/clean/mascot-premium-loyalists.png', 
    icon: Star, 
    width: 1082, 
    height: 1715,
    desc: 'High spenders, loyal visitors who value premium quality.' 
  },
  { 
    name: 'Balanced Buyers', 
    pct: 47.8, 
    color: CYAN, 
    src: '/annual-report/clean/mascot-balanced-buyers.png', 
    icon: Award, 
    width: 1052, 
    height: 1970,
    desc: 'Value quality and convenience, representing our core volume.' 
  },
  { 
    name: 'Value Buyers', 
    pct: 29.6, 
    color: SOFT_TEAL, 
    src: '/annual-report/clean/mascot-value-seekers.png', 
    icon: ShoppingCart, 
    width: 1103, 
    height: 1938,
    desc: 'Price-sensitive customers who look for deals and combos.' 
  },
];

function SegmentMascotRow({ name, pct, color, src, icon: Icon, desc }: { name: string; pct: number; color: string; src: string; icon: any; desc: string }) {
  return (
    <div className="flex items-center gap-4 rounded-xl p-3 border transition-all hover:bg-white/40" style={{ background: 'rgba(255, 255, 255, 0.3)', borderColor: BORDER }}>
      <div className="relative flex-shrink-0 h-16 w-12">
        <Image
          src={src}
          alt={name}
          width={100}
          height={150}
          style={{ display: 'block', height: '120%', objectFit: 'contain', objectPosition: 'center top', width: '100%' }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm" style={{ fontFamily: FO, color: INK }}>
            {name}
          </span>
          <span className="font-extrabold text-base" style={{ fontFamily: FO, color }}>
            {pct}%
          </span>
        </div>
        <p className="text-[10.5px] text-gray-500 truncate mt-1" style={{ fontFamily: FO }}>{desc}</p>
        <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100/80 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
        </div>
      </div>
    </div>
  );
}

const retentionBars = [
  { y: 'Year 4', v: 58.4 }, { y: 'Year 5', v: 71.0 },
];

const customerBehavior = [
  { label: 'Visits / Customer', value: '12.6', delta: '+1.9 vs Year 4', positive: true, Icon: RefreshCw },
  { label: 'Repeat Purchase Rate', value: '68.6%', delta: '+0.5pp vs Year 4', positive: true, Icon: Heart },
  { label: 'Loyal Customers', value: '8.6K', delta: '+1.7K vs Year 4', positive: true, Icon: Star },
];

const initiativesImpact = [
  { Icon: Box, title: 'Extension', desc: 'Expanded seating and kitchen capacity, ambitious upgrade.', impact: '+$64K', roi: '3.1x', data: [10, 24, 40, 64], launched: true },
  { Icon: Layers, title: 'Menu Reconstruction', desc: 'Streamlined menu with higher-margin items.', impact: '+$38K', roi: '2.4x', data: [6, 14, 26, 38], launched: true },
  { Icon: Heart, title: 'Loyalty Initiative', desc: 'Not launched this year.', impact: '$0', roi: '—', data: [0, 0, 0, 0], launched: false },
];

// ════════════════════════════════════════════════════════════════════════════
//  REPORT VIEW
// ════════════════════════════════════════════════════════════════════════════
function ReportView() {
  const [activeQuarter, setActiveQuarter] = useState<string>('Q4');

  return (
    <div className="flex flex-col gap-4">
      {/* 1 · KPI ribbon */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {ribbonKpis.map((k) => <KpiTile key={k.label} {...k} />)}
      </section>

      {/* 2 · Annual Performance Overview */}
      <Panel>
        <SectionLabel tag="Key Financials" title="Annual Performance Overview" desc="Revenue, cost, and profit tracked month over month across the fiscal year." />
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyPerformance} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="aoRevArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={solidStop(CYAN)} stopOpacity={0.22} />
                    <stop offset="100%" stopColor={solidStop(CYAN)} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="1 5" stroke={BORDER} strokeOpacity={0.7} vertical={false} />
                <XAxis dataKey="m" tick={axisTick} axisLine={{ stroke: BORDER }} tickLine={false} interval={0} />
                <YAxis tick={axisTick} tickFormatter={(v) => `$${v}K`} width={46} domain={[0, 80]} ticks={[0, 20, 40, 60, 80]} axisLine={{ stroke: BORDER }} tickLine={false} />
                <Tooltip content={<ChartTip prefix="$" suffix="K" />} cursor={{ stroke: BORDER, strokeDasharray: '3 3' }} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke={CYAN} strokeWidth={2.8} fill="url(#aoRevArea)" dot={false} activeDot={{ r: 4, fill: CYAN, stroke: 'white', strokeWidth: 2 }} isAnimationActive={false} />
                <Area type="monotone" dataKey="cost" name="Cost" stroke={AMBER} strokeWidth={2.2} fill="none" dot={false} isAnimationActive={false} />
                <Area type="monotone" dataKey="profit" name="Profit" stroke={TEAL} strokeWidth={2.2} fill="none" dot={false} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
            <Legend items={[{ label: 'Revenue', color: CYAN }, { label: 'Cost', color: AMBER }, { label: 'Profit', color: TEAL }]} />
          </div>
          <div className="rounded-xl p-5" style={{ background: SOLID, border: `1px solid ${BORDER}` }}>
            <div style={{ fontFamily: FO, fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 14 }}>Full Year Summary</div>
            <div className="flex flex-col gap-4">
              {fullYearSummary.map((s) => (
                <div key={s.label} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0" style={{ borderColor: BORDER }}>
                  <span style={{ fontFamily: FO, fontSize: 13, fontWeight: 600, color: TEXT }}>{s.label}</span>
                  <div className="text-right">
                    <div style={{ fontFamily: FO, fontSize: 20, fontWeight: 800, color: INK, fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
                    <Delta value={s.delta} positive={s.positive} showIcon={false} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      {/* 4 · The Year in Review */}
      <Panel>
        <SectionLabel tag="Annual Decisions Review" title="The Year in Review" desc="Consistent progress compounded across all four quarters. Click a quarter to focus." />
        
        {/* Timeline track selector limited inside a box matching the theme, without gradients/glow */}
        <div className="rounded-xl p-5 mb-5" style={{ background: SOLID, border: `1.4px solid ${BORDER}`, boxShadow: 'var(--shadow-elev-1)' }}>
          <div className="relative flex items-center justify-between px-12 py-3">
            {/* Timeline track line */}
            <div className="absolute left-12 right-12 top-1/2 h-[2px] -translate-y-1/2" style={{ background: BORDER }} />
            {/* Active track line (no gradient) */}
            <div 
              className="absolute left-12 top-1/2 h-[2.5px] -translate-y-1/2 transition-all duration-300 ease-out" 
              style={{ 
                background: CYAN,
                width: activeQuarter === 'Q1' ? '0%' : activeQuarter === 'Q2' ? '33.3%' : activeQuarter === 'Q3' ? '66.6%' : '100%' 
              }} 
            />

            {yearReview.map((q) => {
              const isSelected = activeQuarter === q.q;
              return (
                <button
                  key={q.q}
                  type="button"
                  onClick={() => setActiveQuarter(q.q)}
                  className="relative z-10 flex flex-col items-center cursor-pointer focus:outline-none"
                  style={{ background: 'none', border: 'none', padding: 0 }}
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-150"
                    style={{
                      background: isSelected ? CYAN : 'white',
                      color: isSelected ? 'white' : TEXT,
                      border: `1.4px solid ${isSelected ? CYAN : BORDER}`,
                    }}
                  >
                    {q.q}
                  </div>
                  <span 
                    className="absolute top-10 text-[11px] font-bold whitespace-nowrap transition-colors duration-150"
                    style={{ 
                      fontFamily: FO,
                      color: isSelected ? TEAL : TEXT
                    }}
                  >
                    {q.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quarters grid connected by timeline interaction (no glow, no transform) */}
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 mt-6">
          {yearReview.map((q) => {
            const isSelected = activeQuarter === q.q;
            return (
              <div 
                key={q.q} 
                onClick={() => setActiveQuarter(q.q)}
                className="rounded-xl p-4 transition-all duration-300 cursor-pointer" 
                style={{ 
                  background: SOLID, 
                  border: isSelected ? `2px solid ${CYAN}` : `1.4px solid ${BORDER}`,
                  boxShadow: 'none',
                  transform: 'none'
                }}
              >
                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: FO, fontSize: 13, fontWeight: 800, color: isSelected ? TEAL : INK }}>{q.q}</span>
                  <span style={{ background: isSelected ? TINT : 'rgba(255,255,255,0.4)', color: TEAL, borderRadius: 999, fontFamily: FO, fontSize: 10, fontWeight: 700, padding: '2px 8px' }}>{q.title}</span>
                </div>
                <p style={{ fontFamily: FO, fontSize: 11, fontWeight: 500, color: TEXT, lineHeight: 1.45, margin: '8px 0 12px', minHeight: 48 }}>{q.desc}</p>
                <div className="grid grid-cols-3 gap-2 border-t pt-3" style={{ borderColor: BORDER }}>
                  {[{ l: 'Revenue', v: q.revenue }, { l: 'Customers', v: q.customers }, { l: 'Retention', v: q.retention }].map((s) => (
                    <div key={s.l}>
                      <div style={{ fontFamily: FO, fontSize: 9, fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.l}</div>
                      <div style={{ fontFamily: FO, fontSize: 14, fontWeight: 800, color: INK, fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>{s.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      {/* 5 · Market & Customers */}
      <div>
        <SectionLabel tag="Operational Highlights" title="Market & Customers" desc="Share gains, addressable demand, and the loyalty that drives repeat revenue." />
        <div className="grid gap-4 xl:grid-cols-3">
          {/* Market share + TAM + spend */}
          <Panel>
            <CardHead title="Market Share" />
            {/* two stat cells */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { k: 'Your Share', v: '18.4', u: '%', s: '+4.8pp vs Year 4', accent: true },
                { k: 'Category TAM', v: '$2.80M', u: '', s: 'Addressable', accent: false },
              ].map((c, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.5)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '12px 14px' }}>
                  <div style={{ fontFamily: FO, fontSize: 11, fontWeight: 600, color: TEXT }}>{c.k}</div>
                  <div style={{ fontFamily: FO, fontWeight: 800, fontSize: 20, color: INK, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', marginTop: 2 }}>{c.v}<span style={{ fontSize: 11, fontWeight: 500, color: MUTED, marginLeft: 2 }}>{c.u}</span></div>
                  <div style={{ fontFamily: FO, fontSize: 10, fontVariantNumeric: 'tabular-nums', color: c.accent ? TEAL : MUTED, fontWeight: c.accent ? 700 : 500, marginTop: 2 }}>{c.s}</div>
                </div>
              ))}
            </div>
            {/* split track with marker */}
            <div style={{ position: 'relative', marginTop: 24, marginBottom: 6, height: 28 }}>
              <div style={{ position: 'absolute', left: '18.4%', top: 0, fontFamily: FO, fontSize: 12, color: INK, transform: 'translateX(8px)', whiteSpace: 'nowrap' }}>
                <span style={{ fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>18.4%</span> <span style={{ fontWeight: 600, color: TEXT }}>share</span>
              </div>
              <div style={{ position: 'absolute', left: '18.4%', top: 18, bottom: -4, width: 2, background: TEXT }} />
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: -4, height: 10, borderRadius: 6, overflow: 'hidden', background: 'var(--muted)', border: `1px solid ${BORDER}` }}>
                <div className="ms-fill" style={{ width: '18.4%', height: '100%', borderRadius: 6, background: `linear-gradient(90deg, ${CYAN}, color-mix(in srgb, ${CYAN} 70%, white))` }} />
              </div>
            </div>
            {/* detail rows */}
            <div className="grid grid-cols-2 gap-x-4 mt-5">
              {[
                { k: 'Total Market Spend', v: '$1.12M', s: 'Category' },
                { k: 'Prior Year Share', v: '13.6%', s: 'Year 4' },
              ].map((r, i) => (
                <div key={i} style={{ borderTop: '1px solid var(--muted)', paddingTop: 8 }}>
                  <div style={{ fontFamily: FO, fontSize: 10.5, fontWeight: 600, color: TEXT }}>{r.k}</div>
                  <div style={{ fontFamily: FO, fontSize: 14, fontWeight: 800, color: INK, fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>{r.v}</div>
                  <div style={{ fontFamily: FO, fontSize: 9.5, color: MUTED, marginTop: 1 }}>{r.s}</div>
                </div>
              ))}
            </div>
          </Panel>

          {/* Redesigned Segment mix with character personas */}
          <Panel>
            <CardHead title="Segment Mix by Revenue" sub="Revenue contribution by customer segment" />
            <div className="mt-1 mb-4 flex overflow-hidden rounded-lg" style={{ height: 36, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' }}>
              {segmentMascots.map((s) => (
                <div key={s.name} style={{ width: `${s.pct}%`, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: FO, fontSize: 11, fontWeight: 800 }}>{s.pct}%</div>
              ))}
            </div>
            <div className="flex flex-col gap-2.5">
              {segmentMascots.map((s) => (
                <SegmentMascotRow key={s.name} {...s} />
              ))}
            </div>
          </Panel>

          {/* Retention + behavior */}
          <Panel>
            <CardHead title="Customer Retention" sub="Annual repeat-customer rate" badge="+12.6pp vs Year 4" badgeTone="positive" />
            <div className="h-[96px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={retentionBars} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                  <defs>
                    <linearGradient id="aoRetBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={solidStop(TEAL)} stopOpacity={0.95} />
                      <stop offset="100%" stopColor={solidStop(TEAL)} stopOpacity={0.5} />
                    </linearGradient>
                  </defs>
                  <YAxis hide domain={[0, 100]} />
                  <XAxis dataKey="y" tick={axisTick} axisLine={false} tickLine={false} />
                  <Bar dataKey="v" radius={[6, 6, 0, 0]} maxBarSize={48} isAnimationActive={false}>
                    <Cell fill="color-mix(in srgb, var(--color-border) 70%, var(--game-teal-mid))" />
                    <Cell fill="url(#aoRetBar)" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex flex-col gap-2.5 border-t pt-3" style={{ borderColor: BORDER }}>
              {customerBehavior.map((b) => (
                <div key={b.label} className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2" style={{ fontFamily: FO, fontSize: 12, fontWeight: 600, color: TEXT }}>
                    <b.Icon size={13} color={TEAL} />{b.label}
                  </span>
                  <span className="text-right">
                    <span style={{ fontFamily: FO, fontSize: 13, fontWeight: 800, color: INK, fontVariantNumeric: 'tabular-nums', marginRight: 6 }}>{b.value}</span>
                    <Delta value={b.delta} positive={b.positive} />
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* 6 · Finance & Capital */}
      <div>
        <SectionLabel tag="Key Financial Performance" title="Finance & Capital" desc="Balance-sheet health, ownership position, and return on invested capital." />
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.95fr)_minmax(0,0.8fr)]">
          <Panel>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
              <Stat label="Cash Balance" value="$412.5K" delta="-$87.3K vs Year 4" positive={false} Icon={DollarSign} showDeltaIcon={false} />
              <Stat label="Total Debt" value="$180.0K" delta="-$24.0K vs Year 4" positive={true} Icon={TrendingUp} showDeltaIcon={false} />
              <Stat label="Taxation Cost" value="$42.6K" delta="+18.3% vs Year 4" positive={false} Icon={Layers} showDeltaIcon={false} />
              <Stat label="Implied Enterprise Value" value="$2.15M" delta="+18.7% vs Year 4" positive={true} accent={TEAL} Icon={Star} showDeltaIcon={false} />
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 border-t pt-5" style={{ borderColor: BORDER }}>
              {[
                { title: "Founder’s Position", pct: 68, color: DEEP, equity: '$1.46M' },
                { title: "Investor’s Position", pct: 32, color: CYAN, equity: '$689K' },
              ].map((o) => (
                <div key={o.title} className="flex items-center gap-5 rounded-xl p-5" style={{ background: SOLID, border: `1px solid ${BORDER}` }}>
                  <Donut pct={o.pct} color={o.color} center={`${o.pct}%`} sub="owned" />
                  <div className="flex-1 min-w-0">
                    <div style={{ fontFamily: FO, fontSize: 13.5, fontWeight: 800, color: INK }}>{o.title}</div>
                    <div className="mt-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${BORDER}`, paddingBottom: 8 }}>
                      <span style={{ fontFamily: FO, fontSize: 11.5, fontWeight: 600, color: TEXT }}>Ownership</span>
                      <span style={{ fontFamily: FO, fontSize: 15, fontWeight: 800, color: o.color, fontVariantNumeric: 'tabular-nums' }}>{o.pct}%</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span style={{ fontFamily: FO, fontSize: 11.5, fontWeight: 600, color: TEXT }}>Equity Value</span>
                      <span style={{ fontFamily: FO, fontSize: 18, fontWeight: 800, color: INK, fontVariantNumeric: 'tabular-nums' }}>{o.equity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <CardHead title="Return Metrics" sub="Investor outcomes" />
            <div className="flex flex-col gap-3">
              {[
                { Icon: TrendingUp, label: 'Investment Multiple', value: '2.7x', color: INK },
                { Icon: DollarSign, label: 'IRR', value: '28.3%', color: POSITIVE },
              ].map((r) => (
                <div key={r.label} className="rounded-xl p-4" style={{ background: SOLID, border: `1px solid ${BORDER}` }}>
                  <div className="flex items-center gap-2.5">
                    <IconShell size={30}><r.Icon size={15} color={TEAL} /></IconShell>
                    <span style={{ fontFamily: FO, fontSize: 12, fontWeight: 600, color: TEXT, lineHeight: 1.2 }}>{r.label}</span>
                  </div>
                  <div style={{ fontFamily: FO, fontSize: 26, fontWeight: 800, color: r.color, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', marginTop: 10 }}>{r.value}</div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* 7 · Operations Excellence */}
      <div>
        <SectionLabel tag="Operational Highlights" title="Operations Excellence" desc="Throughput, waste discipline, and the initiatives that moved the business." />
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
          {/* product + utilization */}
          <div className="flex flex-col gap-4">
            <Panel>
              <CardHead title="Product Performance" sub="Top menu item by revenue" />
              <div className="flex items-center gap-4">
                <IconShell size={64}><Coffee size={30} color={TEAL} /></IconShell>
                <div>
                  <div style={{ fontFamily: FO, fontSize: 16, fontWeight: 800, color: INK }}>Himalayan Bowl</div>
                  <div style={{ fontFamily: FO, fontSize: 22, fontWeight: 800, color: TEAL, fontVariantNumeric: 'tabular-nums', marginTop: 4 }}>$34K</div>
                  <div style={{ fontFamily: FO, fontSize: 11, fontWeight: 600, color: TEXT, marginTop: 2 }}>26.1% of total revenue</div>
                </div>
              </div>
            </Panel>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Annual Waste', value: '4.2%', delta: '-1.4pp', positive: true },
                { label: 'Staff Utilization', value: '82%', delta: '+3pp', positive: true },
                { label: 'Capacity Utilization', value: '72%', delta: '+4pp', positive: true },
              ].map((s) => (
                <Panel key={s.label} className="!p-4">
                  <Stat label={s.label} value={s.value} delta={`${s.delta} vs Year 4`} positive={s.positive} showDeltaIcon={false} />
                </Panel>
              ))}
            </div>
          </div>

          {/* initiatives impact */}
          <Panel>
            <CardHead title="Initiatives Impact" sub="Strategic initiatives drove growth and stronger customer experiences" />
            <div className="flex flex-col gap-3">
              {initiativesImpact.map((it) => (
                <div key={it.title} className="grid items-center gap-3 rounded-xl p-4 sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]" style={{ background: SOLID, border: `1px solid ${BORDER}`, opacity: it.launched ? 1 : 0.6 }}>
                  <div className="flex items-start gap-3">
                    <IconShell size={34}><it.Icon size={16} color={TEAL} /></IconShell>
                    <div>
                      <div style={{ fontFamily: FO, fontSize: 13, fontWeight: 800, color: INK }}>{it.title}</div>
                      <p style={{ fontFamily: FO, fontSize: 11, fontWeight: 500, color: TEXT, lineHeight: 1.4, marginTop: 2 }}>{it.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-5">
                    <div className="text-right">
                      <div style={{ fontFamily: FO, fontSize: 9, fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Revenue Impact</div>
                      <div style={{ fontFamily: FO, fontSize: 16, fontWeight: 800, color: it.launched ? POSITIVE : MUTED, fontVariantNumeric: 'tabular-nums' }}>{it.impact}</div>
                    </div>
                    <div className="text-right">
                      <div style={{ fontFamily: FO, fontSize: 9, fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.04em' }}>ROI</div>
                      <div style={{ fontFamily: FO, fontSize: 16, fontWeight: 800, color: INK, fontVariantNumeric: 'tabular-nums' }}>{it.roi}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  DECISIONS DATA
// ════════════════════════════════════════════════════════════════════════════
const capacityOptions = ['+25%', '+50%', '+75%', '+100%'];
const loyaltyOptions = ['$5,000', '$10,000', '$20,000', '$30,000'];

const menuPool = [
  { name: 'Signature Bowl', price: '$14.50', Icon: Coffee },
  { name: 'Himalayan Bowl', price: '$13.80', Icon: Coffee },
  { name: 'Morning Combo', price: '$11.20', Icon: Coffee },
  { name: 'Veggie Wrap', price: '$9.40', Icon: Package },
  { name: 'Cold Brew', price: '$5.60', Icon: Coffee },
  { name: 'Cappuccino', price: '$4.80', Icon: Coffee },
  { name: 'Espresso', price: '$3.90', Icon: Coffee },
  { name: 'Croissant', price: '$4.20', Icon: Package },
  { name: 'Dessert Jar', price: '$6.50', Icon: Package },
  { name: 'Spicy Noodle', price: '$10.10', Icon: Package },
];
const MENU_MAX = 6;

const enterpriseStats = [
  { label: 'Revenue multiple', value: '4.7x' },
  { label: 'EBITDA multiple', value: '52.0x' },
  { label: 'Driver score', value: '5.1 / 10' },
];

const ownershipStats = [
  { label: 'Founder ownership', value: '72%', note: 'Significant dilution', accent: TEAL },
  { label: 'Cash injected', value: '$250k', note: 'Available within 30 days of close', accent: INK },
  { label: 'Post-money valuation', value: '$640k', note: 'Anchors next round', accent: INK },
];

// Segmented selector — capacity / loyalty
function Segmented({ options, value, onChange, suffix }: { options: string[]; value: string; onChange: (v: string) => void; suffix?: string }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {options.map((o) => {
        const active = o === value;
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className="rounded-lg transition-all"
            style={{
              fontFamily: FO, cursor: 'pointer', padding: '10px 6px', textAlign: 'center',
              border: active ? `1.4px solid ${TEAL}` : `1px solid ${BORDER}`,
              background: active ? TINT : SOLID,
            }}
          >
            <div style={{ fontFamily: FO, fontSize: 15, fontWeight: 800, color: active ? TEAL : INK, fontVariantNumeric: 'tabular-nums' }}>{o}</div>
            {suffix && <div style={{ fontFamily: FO, fontSize: 9, fontWeight: 600, color: MUTED }}>{suffix}</div>}
          </button>
        );
      })}
    </div>
  );
}

function ConfigLabel({ tag, desc }: { tag: string; desc: string }) {
  return (
    <div className="mb-2.5">
      <div style={{ fontFamily: FO, fontSize: 10, fontWeight: 700, color: TEAL, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{tag}</div>
      <div style={{ fontFamily: FO, fontSize: 11.5, fontWeight: 500, color: TEXT, marginTop: 3 }}>{desc}</div>
    </div>
  );
}

function InfoNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 flex items-start gap-2 rounded-lg" style={{ background: '#F0F9FC', border: `1px solid ${BORDER}`, padding: '8px 10px' }}>
      <Info size={13} color={MUTED} />
      <span style={{ fontFamily: FO, fontSize: 11, fontWeight: 500, color: TEXT, lineHeight: 1.4 }}>{children}</span>
    </div>
  );
}

function Radio({ active }: { active: boolean }) {
  return (
    <span style={{
      flexShrink: 0, height: 22, width: 22, borderRadius: 999,
      border: active ? `6px solid ${CYAN}` : `2px solid ${BORDER}`,
      background: 'white', transition: 'all 0.15s', display: 'inline-block',
    }} />
  );
}

function StrategyShell({ Icon, title, sub, active, onToggle, children }: { Icon: React.ComponentType<{ size?: number; color?: string }>; title: string; sub: string; active: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <Panel style={{ border: active ? 'var(--game-card-selected-border)' : '1.4px solid white', boxShadow: active ? 'var(--game-card-selected-shadow)' : 'var(--shadow-elev-1)' }}>
      <button type="button" onClick={onToggle} className="flex w-full items-start justify-between gap-3 text-left" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
        <div className="flex items-start gap-3">
          <IconShell size={40}><Icon size={19} color={TEAL} /></IconShell>
          <div>
            <h3 style={{ fontFamily: FO, fontSize: 16, fontWeight: 800, color: INK, margin: 0 }}>{title}</h3>
            <p style={{ fontFamily: FO, fontSize: 12, fontWeight: 600, color: TEAL, margin: '2px 0 0' }}>{sub}</p>
          </div>
        </div>
        <Radio active={active} />
      </button>
      <div className="mt-4">{children}</div>
    </Panel>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  MENU RECONSTRUCTION MODAL
// ════════════════════════════════════════════════════════════════════════════
function MenuModal({ open, initial, onClose, onSave }: { open: boolean; initial: string[]; onClose: () => void; onSave: (items: string[]) => void }) {
  const [picked, setPicked] = useState<string[]>(initial);
  React.useEffect(() => { if (open) setPicked(initial); }, [open, initial]);
  if (!open) return null;

  function toggle(name: string) {
    setPicked((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : prev.length >= MENU_MAX ? prev : [...prev, name]);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div className="w-full max-w-[640px] rounded-3xl p-6" style={{ background: SOLID, boxShadow: 'var(--shadow-elev-2)', maxHeight: '88vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 style={{ fontFamily: FO, fontSize: 18, fontWeight: 800, color: INK, margin: 0 }}>Edit Active Menu</h3>
            <p style={{ fontFamily: FO, fontSize: 12, fontWeight: 500, color: TEXT, margin: '4px 0 0' }}>
              Choose up to {MENU_MAX} items from your pool of {menuPool.length} to feature on the active menu.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" style={{ background: 'var(--muted)', border: 'none', borderRadius: 999, cursor: 'pointer', height: 32, width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ display: 'inline-flex', transform: 'rotate(45deg)' }}><Plus size={16} color={TEXT} /></span>
          </button>
        </div>

        <div className="my-4 flex items-center justify-between rounded-lg px-3 py-2" style={{ background: TINT }}>
          <span style={{ fontFamily: FO, fontSize: 12, fontWeight: 700, color: TEAL }}>Active selection</span>
          <span style={{ fontFamily: FO, fontSize: 13, fontWeight: 800, color: TEAL, fontVariantNumeric: 'tabular-nums' }}>{picked.length} / {MENU_MAX} selected</span>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {menuPool.map((item) => {
            const on = picked.includes(item.name);
            const full = !on && picked.length >= MENU_MAX;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => toggle(item.name)}
                disabled={full}
                className="flex items-center justify-between gap-2 rounded-xl p-3 text-left transition-all"
                style={{
                  border: on ? `1.4px solid ${TEAL}` : `1px solid ${BORDER}`,
                  background: on ? TINT : SOLID,
                  cursor: full ? 'not-allowed' : 'pointer',
                  opacity: full ? 0.45 : 1,
                }}
              >
                <span className="flex items-center gap-2.5">
                  <item.Icon size={16} color={TEAL} />
                  <span>
                    <span style={{ display: 'block', fontFamily: FO, fontSize: 13, fontWeight: 700, color: INK }}>{item.name}</span>
                    <span style={{ display: 'block', fontFamily: FO, fontSize: 11, fontWeight: 600, color: MUTED, fontVariantNumeric: 'tabular-nums' }}>{item.price}</span>
                  </span>
                </span>
                <span style={{
                  height: 20, width: 20, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  background: on ? TEAL : 'transparent', border: on ? 'none' : `1.4px solid ${BORDER}`,
                }}>
                  {on && <Check size={12} color="white" />}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-full px-5 py-2.5" style={{ fontFamily: FO, fontSize: 13, fontWeight: 700, color: INK, background: 'white', border: `1px solid ${BORDER}`, cursor: 'pointer' }}>Cancel</button>
          <button type="button" onClick={() => onSave(picked)} className="rounded-full px-5 py-2.5" style={{ fontFamily: FO, fontSize: 13, fontWeight: 700, color: 'white', background: CTA_BG, border: 'none', cursor: 'pointer' }}>Save Menu</button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  DECISIONS VIEW
// ════════════════════════════════════════════════════════════════════════════
const MAX_INITIATIVES = 2;

function DecisionsView() {
  const [selected, setSelected] = useState<string[]>(['extension', 'menu']);
  const [capacity, setCapacity] = useState('+25%');
  const [loyalty, setLoyalty] = useState('$10,000');
  const [dilution, setDilution] = useState(28);
  const [owner, setOwner] = useState<'founder' | 'investor'>('founder');
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string[]>(menuPool.slice(0, MENU_MAX).map((m) => m.name));

  function toggle(id: string) {
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : prev.length >= MAX_INITIATIVES ? prev : [...prev, id]);
  }

  const labels: Record<string, string> = { extension: 'Extension', menu: 'Menu Reconstruction', loyalty: 'Loyalty Initiative' };

  return (
    <div className="flex flex-col gap-4">
      {/* Strategy cards */}
      <div className="grid gap-4 xl:grid-cols-3">
        {/* Extension */}
        <StrategyShell Icon={Box} title="Extension" sub="Capacity Upgrade" active={selected.includes('extension')} onToggle={() => toggle('extension')}>
          <p style={{ fontFamily: FO, fontSize: 12, fontWeight: 500, color: TEXT, lineHeight: 1.5, margin: '0 0 16px' }}>
            Increase your seating capacity and kitchen throughput by expanding your space.
          </p>
          <ConfigLabel tag="Choose Capacity Growth" desc="Select your target capacity increase for the year." />
          <Segmented options={capacityOptions} value={capacity} onChange={setCapacity} suffix="Capacity Growth" />
          <InfoNote>Higher expansion increases capacity but requires higher investment.</InfoNote>
        </StrategyShell>

        {/* Menu Reconstruction */}
        <StrategyShell Icon={Layers} title="Menu Reconstruction" sub="Menu Optimization" active={selected.includes('menu')} onToggle={() => toggle('menu')}>
          <p style={{ fontFamily: FO, fontSize: 12, fontWeight: 500, color: TEXT, lineHeight: 1.5, margin: '0 0 14px' }}>
            Rearrange your existing menu to align with customer preferences and improve performance. You can feature up to {MENU_MAX} of {menuPool.length} products on the active menu at one time.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { Icon: Package, v: String(menuPool.length), l: 'Products Available' },
              { Icon: Star, v: `Max ${MENU_MAX}`, l: 'Active Menu Items' },
              { Icon: RefreshCw, v: 'Applies', l: 'Cost If Menu Changes' },
              { Icon: DollarSign, v: '$2,500', l: 'Menu Change Cost' },
            ].map((s) => (
              <div key={s.l} className="rounded-lg p-2.5" style={{ background: SOLID, border: `1px solid ${BORDER}` }}>
                <s.Icon size={14} color={TEAL} />
                <div style={{ fontFamily: FO, fontSize: 14, fontWeight: 800, color: INK, fontVariantNumeric: 'tabular-nums', marginTop: 4 }}>{s.v}</div>
                <div style={{ fontFamily: FO, fontSize: 9.5, fontWeight: 600, color: MUTED, lineHeight: 1.3 }}>{s.l}</div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg py-2.5"
            style={{ fontFamily: FO, fontSize: 12.5, fontWeight: 700, color: TEAL, background: TINT, border: `1px solid ${BORDER}`, cursor: 'pointer' }}
          >
            <Layers size={14} color={TEAL} /> Edit Menu · {activeMenu.length}/{MENU_MAX} active
          </button>
          <InfoNote>Rearranging the active menu (replacing items) incurs a cost. No cost if the menu remains unchanged.</InfoNote>
        </StrategyShell>

        {/* Loyalty Initiative */}
        <StrategyShell Icon={Heart} title="Loyalty Initiative" sub="Retention &amp; Repeat Purchase" active={selected.includes('loyalty')} onToggle={() => toggle('loyalty')}>
          <p style={{ fontFamily: FO, fontSize: 12, fontWeight: 500, color: TEXT, lineHeight: 1.5, margin: '0 0 16px' }}>
            Invest in loyalty to increase retention and repeat purchase. Returning customers increase loyalty burn over time.
          </p>
          <ConfigLabel tag="Set Monthly Loyalty Spend" desc="Choose your monthly loyalty burn level." />
          <Segmented options={loyaltyOptions} value={loyalty} onChange={setLoyalty} suffix="/ month" />
          <InfoNote>Higher monthly spend increases retention &amp; repeat purchase.</InfoNote>
        </StrategyShell>
      </div>

      {/* Selection summary bar */}
      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span style={{ height: 30, width: 30, borderRadius: 999, background: POSITIVE, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Check size={15} color="white" />
            </span>
            <div>
              <div style={{ fontFamily: FO, fontSize: 14, fontWeight: 800, color: INK }}>{selected.length} selected</div>
              <div style={{ fontFamily: FO, fontSize: 11, fontWeight: 500, color: TEXT }}>You can select up to {MAX_INITIATIVES} initiatives per year.</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span style={{ fontFamily: FO, fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Selected</span>
            {selected.length === 0 && <span style={{ fontFamily: FO, fontSize: 12, fontWeight: 600, color: MUTED }}>None</span>}
            {selected.map((id) => (
              <span key={id} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: TINT, color: TEAL, fontFamily: FO, fontSize: 12, fontWeight: 700 }}>
                <Check size={12} color={TEAL} />{labels[id]}
              </span>
            ))}
          </div>

          <div className="text-right">
            <div style={{ fontFamily: FO, fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Total Investment</div>
            <div style={{ fontFamily: FO, fontSize: 22, fontWeight: 800, color: INK, fontVariantNumeric: 'tabular-nums' }}>$385,000</div>
          </div>
        </div>
      </Panel>

      {/* Enterprise value band (flat — no decorative blobs) */}
      <div className="rounded-2xl p-6 text-white" style={{ background: STRATEGIC, boxShadow: 'var(--shadow-elev-2)' }}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div style={{ fontFamily: FO, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.8 }}>Implied enterprise value</div>
            <div style={{ fontFamily: FO, fontSize: 52, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.05, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>$583k</div>
          </div>
          <div className="flex flex-wrap gap-8">
            {enterpriseStats.map((st) => (
              <div key={st.label}>
                <div style={{ fontFamily: FO, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.75 }}>{st.label}</div>
                <div style={{ fontFamily: FO, fontSize: 22, fontWeight: 800, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>{st.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dilution + ownership */}
      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <Panel>
          <CardHead title="Dilute your Share" />
          <p style={{ fontFamily: FO, fontSize: 12.5, fontWeight: 500, color: TEXT, lineHeight: 1.5, margin: 0 }}>
            Dilution is the process of reducing the concentration of your ownership stake, typically by issuing new equity to raise capital.
          </p>
          <label style={{ display: 'block', fontFamily: FO, fontSize: 11, fontWeight: 700, color: TEXT, margin: '16px 0 6px' }}>Dilution Percentage</label>
          <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: SOLID, border: `1px solid ${BORDER}` }}>
            <span style={{ fontFamily: FO, fontSize: 24, fontWeight: 800, color: INK, fontVariantNumeric: 'tabular-nums' }}>{dilution}%</span>
            <div className="flex flex-col gap-1">
              <button type="button" aria-label="Increase" onClick={() => setDilution((d) => Math.min(100, d + 1))} style={{ background: 'var(--muted)', border: 'none', borderRadius: 6, cursor: 'pointer', height: 22, width: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="11" height="7" viewBox="0 0 11 7" fill="none"><path d="M1 6L5.5 1.5L10 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ color: TEXT }} /></svg>
              </button>
              <button type="button" aria-label="Decrease" onClick={() => setDilution((d) => Math.max(0, d - 1))} style={{ background: 'var(--muted)', border: 'none', borderRadius: 6, cursor: 'pointer', height: 22, width: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="11" height="7" viewBox="0 0 11 7" fill="none"><path d="M1 1L5.5 5.5L10 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ color: TEXT }} /></svg>
              </button>
            </div>
          </div>
          <p style={{ fontFamily: FO, fontSize: 11, fontWeight: 500, color: MUTED, margin: '8px 0 0' }}>Use arrows to adjust dilution percentage.</p>
        </Panel>

        <Panel>
          <CardHead title="Ownership Going into Year 2" />
          <div className="flex rounded-xl p-1" style={{ background: 'var(--muted)', border: '1.4px solid white', width: 'fit-content' }}>
            {([
              { id: 'founder', label: 'Founder · 72%' },
              { id: 'investor', label: 'Investor · 28%' },
            ] as const).map((o) => (
              <button key={o.id} type="button" onClick={() => setOwner(o.id)} className="rounded-lg transition-all"
                style={{ fontFamily: FO, fontSize: 13, fontWeight: 600, padding: '8px 18px', cursor: 'pointer', border: 'none', background: owner === o.id ? TEAL : 'transparent', color: owner === o.id ? 'white' : TEXT }}>
                {o.label}
              </button>
            ))}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {ownershipStats.map((st) => (
              <div key={st.label} className="rounded-xl p-4" style={{ background: SOLID, border: `1px solid ${BORDER}` }}>
                <div style={{ fontFamily: FO, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: MUTED }}>{st.label}</div>
                <div style={{ fontFamily: FO, fontSize: 26, fontWeight: 800, color: st.accent, fontVariantNumeric: 'tabular-nums', marginTop: 6, letterSpacing: '-0.02em' }}>{st.value}</div>
                <div style={{ fontFamily: FO, fontSize: 11, fontWeight: 600, color: TEXT, marginTop: 4 }}>{st.note}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-2 pt-2">
        <div style={{ width: 360 }}>
          <GameButton onClick={() => {}}>Confirm Annual Decisions</GameButton>
        </div>
        <span style={{ fontFamily: FO, fontSize: 12, fontWeight: 500, color: MUTED }}>You can review the impact of your decisions in the Report.</span>
      </div>

      <MenuModal open={menuOpen} initial={activeMenu} onClose={() => setMenuOpen(false)} onSave={(items) => { setActiveMenu(items); setMenuOpen(false); }} />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  SCREEN
// ════════════════════════════════════════════════════════════════════════════
// Read initial view from `?view=` so each tab can be deep-linked (used by Figma capture).
function readInitialView(fallback: 'report' | 'decisions'): 'report' | 'decisions' {
  if (typeof window === 'undefined') return fallback;
  const v = new URLSearchParams(window.location.search).get('view');
  return v === 'report' || v === 'decisions' ? v : fallback;
}

export function AnnualOverview({ initialView = 'report' }: { initialView?: 'report' | 'decisions' } = {}) {
  const [view, setView] = useState<'report' | 'decisions'>(initialView);

  React.useEffect(() => {
    const v = new URLSearchParams(window.location.search).get('view');
    if (v === 'report' || v === 'decisions') {
      setView(v);
    }
  }, [initialView]);
  const isReport = view === 'report';

  return (
    <GridBackground>
      <style>{AO_CSS}</style>
      <PageTransition>
        <GameHeader />
        <main className="mx-auto w-full max-w-[1312px] px-6 pb-24 pt-2">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <div style={{ width: 88, height: 88, flexShrink: 0, borderRadius: 16, overflow: 'hidden', border: '1.4px solid white', boxShadow: 'var(--shadow-elev-1)' }}>
                <Image src="/annual-report/clean/hero-cafe-vignette.png" alt="Dhaulagiri Cafe" width={1880} height={1082} style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <h1 style={{ fontFamily: FO, fontSize: 28, fontWeight: 800, color: INK, letterSpacing: '-0.02em', margin: 0 }}>
                  {isReport ? 'Annual Performance Report' : 'Annual Decisions'}
                </h1>
                <p style={{ fontFamily: FO, fontSize: 13, fontWeight: 500, color: TEXT, margin: '4px 0 0' }}>
                  {isReport ? 'Year 5 · Fiscal review · March 2026' : 'Choose up to 2 strategic initiatives for the year.'}
                </p>
              </div>
            </div>
            <TabBar tabs={viewTabs} activeTab={view} onChange={(id) => setView(id as 'report' | 'decisions')} />
          </div>

          {isReport ? <ReportView /> : <DecisionsView />}
        </main>
      </PageTransition>
    </GridBackground>
  );
}
