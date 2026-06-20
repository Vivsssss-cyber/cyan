import React, { useState } from 'react';
import { GridBackground } from './GridBackground';
import { PageTransition } from './PageTransition';
import { GameButton } from './GameButton';
import {
  TrendingUp, TrendingDown, Building2, User, Percent, Star,
  BarChart3, Clock, Target, Users, MapPin, DollarSign,
  Award, Shield, Zap, ArrowRight, Download, FileSpreadsheet,
  Share2, RotateCcw, LogOut, CheckCircle2, ChevronRight,
  CircleDot, Layers, LineChart as LineChartIcon,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip,
  CartesianGrid, Area, AreaChart, ReferenceLine,
} from 'recharts';

// ─── Data ───────────────────────────────────────────────────────────────────

const kpiCards = [
  {
    label: 'Company Valuation',
    value: '$12.4M',
    icon: Building2,
    trend: '+41%',
    positive: true,
    compare: 'Industry avg: $7.8M',
    insight: 'Consistent margin control drove above-avg valuation multiples through Y4–Y5.',
    accentColor: 'var(--game-cyan)',
  },
  {
    label: 'Owner Valuation',
    value: '$7.9M',
    icon: User,
    trend: '+38%',
    positive: true,
    compare: 'Industry avg: $4.1M',
    insight: 'Equity retained at 64% with strong exit multiples. Top-quartile founder outcome.',
    accentColor: 'var(--game-teal-mid)',
  },
  {
    label: 'Founder Equity',
    value: '64.0%',
    icon: Percent,
    trend: '+12pp',
    positive: true,
    compare: 'Industry avg: 52.3%',
    insight: 'Minimal dilution strategy preserved majority control throughout fundraising.',
    accentColor: 'var(--color-chart-6)',
  },
  {
    label: 'Final Score',
    value: '847 / 1000',
    icon: Star,
    trend: 'Top 15%',
    positive: true,
    compare: 'Cohort avg: 612',
    insight: 'Strong execution across retention, efficiency, and capital allocation.',
    accentColor: 'var(--game-teal)',
  },
];

const perfRows = [
  { metric: 'Revenue', icon: TrendingUp, yours: '$3,240,000', avg: '$2,180,000', top: '$5,400,000', outperform: true },
  { metric: 'Net Profit', icon: DollarSign, yours: '$864,000', avg: '$436,000', top: '$1,620,000', outperform: true },
  { metric: 'Market Share', icon: Target, yours: '18.4%', avg: '12.6%', top: '28.7%', outperform: true },
  { metric: 'Customer Retention', icon: Users, yours: '71.0%', avg: '58.4%', top: '82.6%', outperform: true },
  { metric: 'Occupancy', icon: MapPin, yours: '78.5%', avg: '64.2%', top: '92.1%', outperform: true },
  { metric: 'CAC', icon: BarChart3, yours: '$142', avg: '$218', top: '$95', outperform: true },
  { metric: 'LTV', icon: TrendingUp, yours: '$1,840', avg: '$980', top: '$3,200', outperform: true },
  { metric: 'Debt Ratio', icon: Shield, yours: '0.28', avg: '0.46', top: '0.18', outperform: true },
  { metric: 'Founder Ownership', icon: User, yours: '64.0%', avg: '52.3%', top: '41.8%', outperform: true },
  { metric: 'DCF Valuation', icon: Building2, yours: '$12.4M', avg: '$7.8M', top: '$21.0M', outperform: true },
];

const timelineItems = [
  {
    year: 'Year 1',
    stage: 'Survival Stage',
    icon: Clock,
    milestone: 'Launched MVP, secured first 200 customers',
    challenge: 'Navigated cash burn with minimal headcount',
    outcome: 'Achieved breakeven on operating costs by Q4',
    metric: 'Rev: $840K',
    color: 'var(--game-cyan)',
    gold: false,
  },
  {
    year: 'Year 2',
    stage: 'Product-Market Fit',
    icon: Target,
    milestone: 'Retention crossed 60%, CAC fell 22%',
    challenge: 'Pricing optimization and churn reduction',
    outcome: 'Sustainable unit economics unlocked',
    metric: 'Rev: $1.32M',
    color: 'var(--game-teal-light)',
    gold: false,
  },
  {
    year: 'Year 3',
    stage: 'Expansion',
    icon: MapPin,
    milestone: 'Opened 2nd location, team grew to 34 FTEs',
    challenge: 'Managing multi-site operational complexity',
    outcome: 'Customer LTV improved 40% from loyalty programs',
    metric: 'Rev: $1.95M',
    color: 'var(--game-teal-mid)',
    gold: false,
  },
  {
    year: 'Year 4',
    stage: 'Operational Scaling',
    icon: Layers,
    milestone: 'Automated 3 core processes, CAC down 35%',
    challenge: 'Building leverage without overhiring',
    outcome: 'EBITDA margins expanded from 18% → 27%',
    metric: 'Rev: $2.19M',
    color: 'var(--game-teal)',
    gold: false,
  },
  {
    year: 'Year 5',
    stage: 'Market Leadership',
    icon: Award,
    milestone: '18.4% market share — #2 in category',
    challenge: 'Sustaining growth without compromising culture',
    outcome: 'Compounding retention positioned brand as category leader',
    metric: 'Rev: $3.24M',
    color: '#D97706',
    gold: true,
  },
];

const growthData = [
  { year: 'Y1', revenue: 840, profit: 120, valuation: 2100 },
  { year: 'Y2', revenue: 1320, profit: 210, valuation: 3400 },
  { year: 'Y3', revenue: 1950, profit: 365, valuation: 5800 },
  { year: 'Y4', revenue: 2190, profit: 635, valuation: 8600 },
  { year: 'Y5', revenue: 3240, profit: 864, valuation: 12400 },
];

const decisions = [
  {
    title: 'Expansion Strategy',
    icon: MapPin,
    impact: 'Opened second location when unit economics were stable. Avoided premature geographic overextension.',
    tag: 'Excellent',
    tagStyle: 'excellent',
    roi: '+$1.84M',
    positive: true,
  },
  {
    title: 'Pricing Optimization',
    icon: DollarSign,
    impact: 'Mid-range price point preserved volume while improving per-unit margin by 12%.',
    tag: 'Efficient',
    tagStyle: 'efficient',
    roi: '+12 pts margin',
    positive: true,
  },
  {
    title: 'Employee Raise Strategy',
    icon: Users,
    impact: 'Incremental raises tied to performance targets reduced voluntary attrition by 34%.',
    tag: 'Excellent',
    tagStyle: 'excellent',
    roi: '-34% attrition',
    positive: true,
  },
  {
    title: 'Retention Investment',
    icon: Shield,
    impact: 'Loyalty program launched in Y2 compounded into 71% 12-month retention by Year 5.',
    tag: 'Excellent',
    tagStyle: 'excellent',
    roi: '+$860 / customer',
    positive: true,
  },
  {
    title: 'Marketing Allocation',
    icon: TrendingUp,
    impact: 'Heavy spend in Y3 created brand awareness but strained operating margins temporarily.',
    tag: 'Aggressive',
    tagStyle: 'aggressive',
    roi: '-$120K (Y3)',
    positive: false,
  },
  {
    title: 'Capital Management',
    icon: Building2,
    impact: 'Conservative debt strategy kept ratio at 0.28 vs industry 0.46. Strong balance sheet preserved.',
    tag: 'Efficient',
    tagStyle: 'efficient',
    roi: '$340K saved',
    positive: true,
  },
];

const leaderboard = [
  { rank: 1, name: 'Summit Peak Co.', sub: 'Aggressive Growth', score: 940, rating: 5, valuation: '$18.2M', isYou: false },
  { rank: 2, name: 'Indigo Ventures', sub: 'Balanced Strategy', score: 892, rating: 5, valuation: '$15.6M', isYou: false },
  { rank: 3, name: 'Dhaulagiri Cafe', sub: 'Founder-Led Growth', score: 847, rating: 4, valuation: '$12.4M', isYou: true },
  { rank: 4, name: 'Ridgeline Labs', sub: 'Conservative Path', score: 781, rating: 4, valuation: '$10.1M', isYou: false },
  { rank: 5, name: 'Crescent Foods', sub: 'Volume Strategy', score: 724, rating: 3, valuation: '$8.7M', isYou: false },
];

const insights = [
  {
    icon: Shield,
    title: 'Retention Drives Compounding Growth',
    body: 'Each percentage point of retention compounds into significantly higher LTV over multi-year periods. Your 71% retention rate generated 87% more total customer revenue than the cohort average.',
    stat: '+87%',
    statLabel: 'LTV vs cohort avg',
  },
  {
    icon: DollarSign,
    title: 'Cash Discipline Increased Long-Term Valuation',
    body: 'Maintaining a debt ratio of 0.28 preserved optionality and allowed opportunistic reinvestment. Conservative capital allocation prevented the liquidity crises that eliminated 6 competing teams.',
    stat: '0.28',
    statLabel: 'Debt ratio vs 0.46 avg',
  },
  {
    icon: Zap,
    title: 'Operational Efficiency Protected Margins',
    body: 'Investing in process automation in Year 4 expanded EBITDA from 18% to 27% without additional headcount. Efficiency gains proved more durable than revenue growth alone.',
    stat: '+9 pts',
    statLabel: 'EBITDA margin Y3 → Y5',
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionLabel({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--game-teal-mid)',
          background: 'var(--game-cyan-tint)',
          padding: '3px 8px',
          borderRadius: '6px',
          whiteSpace: 'nowrap',
        }}
      >
        {eyebrow}
      </span>
      <h2
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '20px',
          fontWeight: 800,
          color: 'var(--foreground)',
          letterSpacing: '-0.02em',
        }}
      >
        {title}
      </h2>
    </div>
  );
}

function GlowDivider() {
  return (
    <div
      style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--game-cyan), transparent)',
        opacity: 0.35,
        margin: '36px 0',
        borderRadius: '2px',
      }}
    />
  );
}

const tagStyles: Record<string, React.CSSProperties> = {
  excellent: { background: 'rgba(21,97,98,0.1)', color: 'var(--game-positive)' },
  efficient: { background: 'rgba(0,193,235,0.1)', color: 'var(--game-teal-mid)' },
  risky: { background: 'rgba(198,82,82,0.08)', color: 'var(--game-negative)' },
  aggressive: { background: 'rgba(180,83,9,0.1)', color: 'var(--game-warning)' },
};

function DecisionTag({ label, style }: { label: string; style: string }) {
  return (
    <span
      style={{
        ...(tagStyles[style] ?? tagStyles.efficient),
        fontFamily: "'Outfit', sans-serif",
        fontSize: '9px',
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        padding: '2px 7px',
        borderRadius: '6px',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}

function MedalBadge({ rank }: { rank: number }) {
  const configs: Record<number, { bg: string; label: string }> = {
    1: { bg: 'linear-gradient(135deg, #F59E0B, #D97706)', label: '1' },
    2: { bg: 'linear-gradient(135deg, #D1D5DB, #9CA3AF)', label: '2' },
    3: { bg: 'linear-gradient(135deg, #CD7F32, #B45309)', label: '3' },
  };
  const cfg = configs[rank];
  if (!cfg) {
    return (
      <div
        style={{
          width: 28, height: 28, borderRadius: '50%',
          background: 'rgba(200,221,230,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Outfit', sans-serif", fontSize: '11px', fontWeight: 800,
          color: 'var(--game-text-muted)',
        }}
      >
        {rank}
      </div>
    );
  }
  return (
    <div
      style={{
        width: 28, height: 28, borderRadius: '50%',
        background: cfg.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Outfit', sans-serif", fontSize: '11px', fontWeight: 800,
        color: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}
    >
      {cfg.label}
    </div>
  );
}

function StarRating({ count }: { count: number }) {
  return (
    <span style={{ color: '#D97706', fontSize: '12px', letterSpacing: '1px' }}>
      {'★'.repeat(count)}{'☆'.repeat(5 - count)}
    </span>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.95)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        padding: '10px 14px',
        fontFamily: "'Outfit', sans-serif",
        fontSize: '12px',
        boxShadow: '0 4px 16px rgba(0,60,73,0.12)',
      }}
    >
      <div style={{ fontWeight: 700, color: 'var(--foreground)', marginBottom: 6 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: <span style={{ fontVariantNumeric: 'tabular-nums' }}>${(p.value).toLocaleString()}K</span>
        </div>
      ))}
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

/* Optional injected outcome (demo flow) — overrides the four hero KPI cards. */
export interface FinalEvaluationOutcome {
  companyValuation: string;
  companyTrend: string;
  ownerValuation: string;
  ownerTrend: string;
  founderEquity: string;
  equityTrend: string;
  finalScore: string;
  scoreTrend: string;
  yearLabel?: string;
}

export function FinalEvaluation({ outcome }: { outcome?: FinalEvaluationOutcome } = {}) {
  const heroKpis = outcome
    ? kpiCards.map((k) => {
        switch (k.label) {
          case 'Company Valuation': return { ...k, value: outcome.companyValuation, trend: outcome.companyTrend };
          case 'Owner Valuation': return { ...k, value: outcome.ownerValuation, trend: outcome.ownerTrend };
          case 'Founder Equity': return { ...k, value: outcome.founderEquity, trend: outcome.equityTrend };
          case 'Final Score': return { ...k, value: outcome.finalScore, trend: outcome.scoreTrend };
          default: return k;
        }
      })
    : kpiCards;
  const card: React.CSSProperties = {
    background: 'rgba(255,255,255,0.6)',
    border: '1.4px solid white',
    borderRadius: '16px',
    padding: '20px',
    backdropFilter: 'blur(8px)',
  };

  return (
    <GridBackground>
      <PageTransition>
        <div style={{ minHeight: '100vh', paddingBottom: 100, fontFamily: "'Outfit', sans-serif" }}>

          {/* ── NAV ──────────────────────────────────────────────────── */}
          <nav
            style={{
              position: 'sticky', top: 0, zIndex: 100,
              background: 'rgba(239,242,244,0.8)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderBottom: '1px solid rgba(200,221,230,0.5)',
              padding: '0 24px',
            }}
          >
            <div
              style={{
                maxWidth: 1312, margin: '0 auto',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                height: 56,
              }}
            >
              {/* Logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'linear-gradient(135deg, var(--game-teal), var(--game-teal-dark))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <BarChart3 size={16} color="white" />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--foreground)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                    Startup Valley
                  </div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--game-teal-mid)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    Simulation
                  </div>
                </div>
              </div>
              {/* Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {[
                  { icon: User, label: 'Team: Dhaulagiri Cafe', style: {} },
                  { icon: Star, label: 'Founder Mode', style: { background: 'rgba(0,193,235,0.08)', borderColor: 'rgba(0,193,235,0.3)', color: 'var(--game-teal-mid)' } },
                  { icon: Award, label: `${outcome?.yearLabel ?? 'Year 5'} · Final Report`, style: { background: 'rgba(245,158,11,0.1)', borderColor: 'rgba(245,158,11,0.35)', color: '#92610A' } },
                ].map(({ icon: Icon, label, style: bs }) => (
                  <div
                    key={label}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '5px 12px', borderRadius: 9999,
                      background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(200,221,230,0.8)',
                      fontSize: 11, fontWeight: 600, color: 'var(--game-text-secondary)',
                      backdropFilter: 'blur(6px)',
                      ...bs,
                    }}
                  >
                    <Icon size={12} />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </nav>

          <div style={{ maxWidth: 1312, margin: '0 auto', padding: '0 24px' }}>

            {/* ── HERO ─────────────────────────────────────────────── */}
            <div style={{ padding: '40px 0 32px' }}>
              <div
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'var(--game-cyan-tint)', color: 'var(--game-teal-mid)',
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                  padding: '4px 10px', borderRadius: 6, marginBottom: 16,
                }}
              >
                <CheckCircle2 size={12} />
                Simulation Complete · {outcome?.yearLabel ?? 'Year 5'}
              </div>
              <h1
                style={{
                  fontSize: 40, fontWeight: 800, color: 'var(--foreground)',
                  letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 12,
                }}
              >
                Final{' '}
                <span style={{ color: 'var(--game-teal-mid)' }}>Evaluation</span>
              </h1>
              <p style={{ fontSize: 15, color: 'var(--game-text-secondary)', maxWidth: 540, lineHeight: 1.65 }}>
                You completed the Startup Valley simulation. Here's how your company performed over 5 years of strategic leadership.
              </p>
              <div
                style={{
                  marginTop: 28, height: 1,
                  background: 'linear-gradient(to right, var(--border), transparent)',
                }}
              />
            </div>

            {/* ── SECTION 1 — KPI CARDS ────────────────────────────── */}
            <div>
              <SectionLabel eyebrow="Section 01" title="Performance Scorecard" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                {heroKpis.map((k) => {
                  const Icon = k.icon;
                  return (
                    <div
                      key={k.label}
                      style={{
                        ...card,
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,60,73,0.1)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute', top: 0, right: 0, width: 80, height: 80,
                          background: 'radial-gradient(circle at top right, rgba(0,193,235,0.06), transparent)',
                          pointerEvents: 'none',
                        }}
                      />
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div
                          style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: 'var(--game-cyan-tint)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          }}
                        >
                          <Icon size={17} color="var(--game-teal-mid)" />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 600, color: k.positive ? 'var(--game-positive)' : 'var(--game-negative)' }}>
                          {k.positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                          {k.trend}
                        </div>
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--game-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>
                        {k.label}
                      </div>
                      <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--game-text)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 6 }}>
                        {k.value}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--game-text-secondary)' }}>
                        {k.compare}
                      </div>
                      <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(200,221,230,0.5)', fontSize: 11, color: 'var(--game-text-secondary)', lineHeight: 1.55 }}>
                        {k.insight}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <GlowDivider />

            {/* ── SECTION 2 — PERFORMANCE TABLE ────────────────────── */}
            <div>
              <SectionLabel eyebrow="Section 02" title="Performance Snapshot" />
              <div
                style={{
                  background: 'rgba(255,255,255,0.75)',
                  border: '1.4px solid white',
                  borderRadius: 16,
                  overflow: 'hidden',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div
                  style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)' }}>
                    Competitive Benchmark
                  </div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    {[
                      { color: 'var(--game-positive)', label: 'Your Startup' },
                      { color: 'var(--game-text-muted)', label: 'Industry Avg' },
                      { color: 'var(--game-teal-mid)', label: 'Top Performers' },
                    ].map(l => (
                      <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: 'var(--game-text-secondary)' }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: l.color }} />
                        {l.label}
                      </div>
                    ))}
                  </div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(240,249,252,0.5)' }}>
                      {['Metric', 'Your Startup', 'Industry Average', 'Top Performers'].map((h, i) => (
                        <th
                          key={h}
                          style={{
                            padding: '10px 16px',
                            textAlign: i === 0 ? 'left' : 'right',
                            fontSize: 10, fontWeight: 700,
                            color: i === 1 ? 'var(--game-teal-mid)' : 'var(--game-text-muted)',
                            textTransform: 'uppercase', letterSpacing: '0.08em',
                            borderBottom: '1px solid var(--border)',
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {perfRows.map((row, idx) => {
                      const Icon = row.icon;
                      return (
                        <tr
                          key={row.metric}
                          style={{ borderBottom: idx < perfRows.length - 1 ? '1px solid rgba(200,221,230,0.3)' : 'none' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,193,235,0.02)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <td style={{ padding: '11px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: 'var(--game-text)', fontSize: 13 }}>
                              <Icon size={13} color="var(--game-text-muted)" />
                              {row.metric}
                            </div>
                          </td>
                          <td style={{ padding: '11px 16px', textAlign: 'right' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                background: row.outperform ? 'rgba(21,97,98,0.07)' : 'transparent',
                                color: row.outperform ? 'var(--game-positive)' : 'var(--game-text)',
                                fontWeight: 700, fontSize: 13, fontVariantNumeric: 'tabular-nums',
                                padding: row.outperform ? '2px 8px' : '0',
                                borderRadius: 4,
                              }}
                            >
                              {row.yours}
                            </span>
                          </td>
                          <td style={{ padding: '11px 16px', textAlign: 'right', fontSize: 13, color: 'var(--game-text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                            {row.avg}
                          </td>
                          <td style={{ padding: '11px 16px', textAlign: 'right', fontSize: 13, color: 'var(--game-text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                            {row.top}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div
                  style={{
                    padding: '10px 20px',
                    background: 'rgba(21,97,98,0.04)',
                    borderTop: '1px solid rgba(21,97,98,0.1)',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}
                >
                  <CheckCircle2 size={13} color="var(--game-positive)" />
                  <span style={{ fontSize: 11, color: 'var(--game-positive)', fontWeight: 600 }}>
                    8 of 10 metrics above industry average
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--game-text-muted)' }}>
                    · Outperforming cohort in unit economics, retention, and capital efficiency
                  </span>
                </div>
              </div>
            </div>

            <GlowDivider />

            {/* ── SECTIONS 3+4 — TIMELINE + CHART (asymmetric) ──────── */}
            <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16, alignItems: 'start' }}>

              {/* Timeline */}
              <div>
                <SectionLabel eyebrow="Section 03" title="Strategic Journey" />
                <div style={{ ...card, padding: 24 }}>
                  <div style={{ position: 'relative', paddingLeft: 32 }}>
                    {/* Vertical line */}
                    <div
                      style={{
                        position: 'absolute', left: 11, top: 24, bottom: 24, width: 2,
                        background: 'linear-gradient(to bottom, var(--game-cyan), var(--game-teal-mid), var(--game-teal-dark))',
                        borderRadius: 2,
                      }}
                    />
                    {timelineItems.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.year}
                          style={{ position: 'relative', paddingBottom: idx < timelineItems.length - 1 ? 20 : 0, paddingLeft: 24 }}
                        >
                          {/* Dot */}
                          <div
                            style={{
                              position: 'absolute', left: -21, top: 0,
                              width: 24, height: 24, borderRadius: '50%',
                              background: item.gold
                                ? 'linear-gradient(135deg, #F59E0B, #D97706)'
                                : `linear-gradient(135deg, ${item.color}, var(--game-teal-dark))`,
                              border: '2px solid white',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              boxShadow: `0 2px 8px ${item.gold ? 'rgba(245,158,11,0.35)' : 'rgba(0,193,235,0.3)'}`,
                              zIndex: 1,
                            }}
                          >
                            <Icon size={11} color="white" />
                          </div>
                          {/* Node card */}
                          <div
                            style={{
                              background: item.gold ? 'rgba(0,193,235,0.04)' : 'rgba(255,255,255,0.65)',
                              border: `1.4px solid ${item.gold ? 'rgba(0,193,235,0.3)' : 'white'}`,
                              borderRadius: 14, padding: '14px 16px',
                              backdropFilter: 'blur(6px)',
                              transition: 'transform 0.15s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.transform = 'translateX(3px)')}
                            onMouseLeave={e => (e.currentTarget.style.transform = 'translateX(0)')}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                              <span
                                style={{
                                  fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                                  color: item.gold ? '#92610A' : 'var(--game-teal-mid)',
                                  background: item.gold ? 'rgba(245,158,11,0.12)' : 'var(--game-cyan-tint)',
                                  padding: '2px 7px', borderRadius: 6,
                                }}
                              >
                                {item.year} · {item.stage}
                              </span>
                              <span
                                style={{
                                  fontSize: 10, fontWeight: 700,
                                  color: 'var(--game-positive)',
                                  background: 'rgba(21,97,98,0.08)',
                                  padding: '2px 8px', borderRadius: 6,
                                  fontVariantNumeric: 'tabular-nums',
                                }}
                              >
                                {item.metric}
                              </span>
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--foreground)', marginBottom: 3 }}>
                              {item.milestone}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--game-teal-mid)', fontWeight: 600, marginBottom: 3 }}>
                              {item.challenge}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--game-text-secondary)', lineHeight: 1.5 }}>
                              {item.outcome}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div>
                <SectionLabel eyebrow="Section 04" title="Growth Visualization" />
                <div style={{ ...card, padding: 24 }}>
                  {/* Legend */}
                  <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
                    {[
                      { color: 'var(--chart-1)', label: 'Revenue ($K)' },
                      { color: 'var(--color-chart-6)', label: 'Net Profit ($K)' },
                      { color: 'var(--chart-2)', label: 'Valuation ($K)', dashed: true },
                    ].map(l => (
                      <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: 'var(--game-text-secondary)' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color, flexShrink: 0 }} />
                        {l.label}
                      </div>
                    ))}
                  </div>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.18} />
                          <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.01} />
                        </linearGradient>
                        <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--color-chart-6)" stopOpacity={0.15} />
                          <stop offset="100%" stopColor="var(--color-chart-6)" stopOpacity={0.01} />
                        </linearGradient>
                        <linearGradient id="valGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.1} />
                          <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0.01} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 4" stroke="var(--color-border)" strokeOpacity={0.35} vertical={false} />
                      <XAxis dataKey="year" tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 9, fill: 'var(--color-muted-foreground)', fontFamily: 'Outfit, sans-serif' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="revenue" stroke="var(--color-chart-1)" strokeWidth={2.5} fill="url(#revGrad)" dot={{ fill: 'var(--color-chart-1)', strokeWidth: 2, stroke: 'var(--color-card)', r: 4 }} />
                      <Area type="monotone" dataKey="profit" stroke="var(--color-chart-6)" strokeWidth={2} fill="url(#profGrad)" dot={{ fill: 'var(--color-chart-6)', strokeWidth: 2, stroke: 'var(--color-card)', r: 3.5 }} />
                      <Area type="monotone" dataKey="valuation" stroke="var(--color-chart-2)" strokeWidth={2} strokeDasharray="5 3" fill="url(#valGrad)" dot={{ fill: 'var(--color-chart-2)', strokeWidth: 2, stroke: 'var(--color-card)', r: 3 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                  {/* Callout stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 16 }}>
                    {[
                      { label: 'Revenue CAGR', val: '+40.2%', color: 'var(--game-teal-mid)', bg: 'rgba(0,193,235,0.06)', border: 'rgba(0,193,235,0.15)' },
                      { label: 'Profit Margin Y5', val: '26.7%', color: 'var(--game-positive)', bg: 'rgba(77,181,182,0.06)', border: 'rgba(77,181,182,0.15)' },
                      { label: 'Val. Growth 5Y', val: '+490%', color: 'var(--foreground)', bg: 'rgba(0,61,71,0.06)', border: 'rgba(0,61,71,0.12)' },
                    ].map(s => (
                      <div
                        key={s.label}
                        style={{
                          background: s.bg, border: `1px solid ${s.border}`,
                          borderRadius: 10, padding: '10px 12px',
                        }}
                      >
                        <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--game-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>
                          {s.label}
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: s.color, fontVariantNumeric: 'tabular-nums' }}>
                          {s.val}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <GlowDivider />

            {/* ── SECTION 5 — DECISIONS ─────────────────────────────── */}
            <div>
              <SectionLabel eyebrow="Section 05" title="Key Decisions" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                {decisions.map((d) => {
                  const Icon = d.icon;
                  return (
                    <div
                      key={d.title}
                      style={{ ...card, padding: 18, transition: 'transform 0.18s ease, box-shadow 0.18s ease' }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,60,73,0.08)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--game-cyan-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={15} color="var(--game-teal-mid)" />
                        </div>
                        <DecisionTag label={d.tag} style={d.tagStyle} />
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--foreground)', marginBottom: 5 }}>
                        {d.title}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--game-text-secondary)', lineHeight: 1.55, marginBottom: 10 }}>
                        {d.impact}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid rgba(200,221,230,0.4)' }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--game-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Net ROI</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: d.positive ? 'var(--game-positive)' : 'var(--game-negative)', fontVariantNumeric: 'tabular-nums' }}>
                          {d.roi}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <GlowDivider />

            {/* ── SECTION 6 — LEADERBOARD ──────────────────────────── */}
            <div>
              <SectionLabel eyebrow="Section 06" title="Final Leaderboard" />
              {/* Score strip */}
              <div
                style={{
                  background: 'linear-gradient(135deg, var(--game-teal), var(--game-teal-dark))',
                  borderRadius: 16, padding: '20px 24px', marginBottom: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, color: 'white',
                }}
              >
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.65, marginBottom: 4 }}>Your Ranking</div>
                  <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>#3 of 28</div>
                  <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>Top 11% · Cohort Spring 2026</div>
                </div>
                <div style={{ display: 'flex', gap: 32 }}>
                  {[
                    { label: 'Total Score', val: '847', gold: false },
                    { label: 'Investor Rating', val: '★★★★☆', gold: true },
                    { label: 'Percentile', val: '89th', gold: false },
                  ].map(s => (
                    <div key={s.label}>
                      <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6, marginBottom: 3 }}>{s.label}</div>
                      <div style={{ fontSize: 18, fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: s.gold ? '#FCD34D' : 'white' }}>{s.val}</div>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    padding: '6px 16px', borderRadius: 9999,
                    background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Series A Ready
                </div>
              </div>

              <div style={{ ...card }}>
                {/* Table header */}
                <div
                  style={{
                    display: 'grid', gridTemplateColumns: '40px 1fr 100px 120px 80px',
                    gap: 12, padding: '6px 8px 10px', marginBottom: 4,
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  {['Rank', 'Team', 'Score', 'Investor Rating', 'Valuation'].map((h, i) => (
                    <div key={h} style={{ fontSize: 10, fontWeight: 700, color: 'var(--game-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: i > 0 ? 'right' : 'center' }}>
                      {h}
                    </div>
                  ))}
                </div>
                {leaderboard.map(row => (
                  <div
                    key={row.rank}
                    style={{
                      display: 'grid', gridTemplateColumns: '40px 1fr 100px 120px 80px',
                      gap: 12, alignItems: 'center', padding: '10px 8px',
                      borderRadius: 10,
                      background: row.isYou ? 'rgba(0,193,235,0.07)' : 'transparent',
                      border: row.isYou ? '1.4px solid rgba(0,193,235,0.22)' : '1.4px solid transparent',
                      marginBottom: 4, transition: 'background 0.12s',
                    }}
                    onMouseEnter={e => { if (!row.isYou) (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,193,235,0.03)'; }}
                    onMouseLeave={e => { if (!row.isYou) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <MedalBadge rank={row.rank} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--foreground)' }}>
                        {row.name}
                        {row.isYou && (
                          <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--game-teal-mid)', background: 'var(--game-cyan-tint)', padding: '1px 6px', borderRadius: 4, letterSpacing: '0.05em' }}>
                            YOU
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--game-text-muted)' }}>{row.sub}</div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: 15, fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: row.isYou ? 'var(--game-teal-mid)' : 'var(--game-text)' }}>
                      {row.score}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <StarRating count={row.rating} />
                    </div>
                    <div style={{ textAlign: 'right', fontSize: 12, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: row.isYou ? 'var(--game-teal-mid)' : 'var(--game-text-secondary)' }}>
                      {row.valuation}
                    </div>
                  </div>
                ))}
                {/* Cohort avg row */}
                <div
                  style={{
                    display: 'grid', gridTemplateColumns: '40px 1fr 100px 120px 80px',
                    gap: 12, alignItems: 'center', padding: '8px 8px',
                    borderTop: '1px solid var(--border)', marginTop: 4, opacity: 0.55,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(200,221,230,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 800, color: 'var(--game-text-muted)' }}>AVG</div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--game-text-secondary)', fontWeight: 600 }}>Cohort Average (28 teams)</div>
                  <div style={{ textAlign: 'right', fontSize: 13, fontWeight: 700, color: 'var(--game-text-secondary)', fontVariantNumeric: 'tabular-nums' }}>612</div>
                  <div style={{ textAlign: 'right' }}><StarRating count={3} /></div>
                  <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--game-text-secondary)', fontVariantNumeric: 'tabular-nums' }}>$7.8M</div>
                </div>
              </div>
            </div>

            <GlowDivider />

            {/* ── SECTION 7 — INSIGHTS ─────────────────────────────── */}
            <div>
              <SectionLabel eyebrow="Section 07" title="Experience Insights" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                {insights.map((ins) => {
                  const Icon = ins.icon;
                  return (
                    <div
                      key={ins.title}
                      style={{ ...card, padding: 24, position: 'relative', overflow: 'hidden', transition: 'transform 0.18s ease' }}
                      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'}
                      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'}
                    >
                      <div style={{ position: 'absolute', bottom: -20, right: -20, width: 80, height: 80, background: 'radial-gradient(circle, rgba(0,193,235,0.07), transparent 70%)', pointerEvents: 'none' }} />
                      <div
                        style={{
                          width: 44, height: 44, borderRadius: 12,
                          background: 'linear-gradient(135deg, var(--game-cyan-tint), rgba(0,193,235,0.12))',
                          border: '1px solid rgba(0,193,235,0.2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          marginBottom: 16,
                        }}
                      >
                        <Icon size={21} color="var(--game-teal-mid)" />
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--foreground)', marginBottom: 8, letterSpacing: '-0.01em', lineHeight: 1.3 }}>
                        {ins.title}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--game-text-secondary)', lineHeight: 1.65 }}>
                        {ins.body}
                      </div>
                      <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(200,221,230,0.4)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--game-positive)', fontVariantNumeric: 'tabular-nums' }}>
                          {ins.stat}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--game-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.4 }}>
                          {ins.statLabel}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ height: 40 }} />

          </div>
        </div>

        {/* ── SECTION 8 — STICKY ACTION BAR ──────────────────────── */}
        <div
          style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
            background: 'rgba(239,242,244,0.88)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(200,221,230,0.6)',
            padding: '14px 24px',
          }}
        >
          <div style={{ maxWidth: 1312, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {[
                { icon: Download, label: 'Download PDF Report' },
                { icon: FileSpreadsheet, label: 'Export Excel' },
                { icon: Share2, label: 'Share Results' },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '9px 16px', borderRadius: 9999,
                    background: 'white', border: '1px solid rgba(200,221,230,0.9)',
                    fontSize: 12, fontWeight: 600, color: 'var(--game-text)',
                    cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(0,60,73,0.08)';
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                  }}
                >
                  <Icon size={13} style={{ opacity: 0.6 }} />
                  {label}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {[
                { icon: RotateCcw, label: 'Replay Simulation' },
                { icon: LogOut, label: 'Return to Lobby' },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '9px 16px', borderRadius: 9999,
                    background: 'transparent', border: '1px solid rgba(200,221,230,0.7)',
                    fontSize: 12, fontWeight: 600, color: 'var(--game-text-secondary)',
                    cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.6)';
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--game-text)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--game-text-secondary)';
                  }}
                >
                  <Icon size={13} style={{ opacity: 0.6 }} />
                  {label}
                </button>
              ))}
              <GameButton onClick={() => {}}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 700 }}>
                  <Award size={15} />
                  Finish Simulation
                </div>
              </GameButton>
            </div>
          </div>
        </div>
      </PageTransition>
    </GridBackground>
  );
}
