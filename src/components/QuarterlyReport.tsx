import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAppNavigate } from '../lib/use-app-navigate';
import { GridBackground } from './GridBackground';
import { GameHeader } from './GameHeader';
import { PageTransition } from './PageTransition';
import { TabBar } from './TabBar';
import {
  TrendingUp, Users, DollarSign, Package, Wallet, Activity, BarChart2,
  Star, RefreshCw, PieChart, Trophy, Zap, ChevronRight, Settings, Info,
  Coffee, Box, Landmark, Lightbulb, ArrowUpRight, ArrowDownRight, Map,
  Milk, Cake, Bread, CoffeeBeans, Salad,
} from './PixelIcons';

// ─── Theme — Cyan chart tokens (shadcn skin per report-chart-prompt) ────────────
// Series colors strictly from --sv-chart-* tokens. Deltas use --sv-positive / --sv-negative.
const F = "'Outfit', system-ui, sans-serif";
const C = {
  INK:      'var(--game-dark)',
  TEAL:     'var(--color-chart-2)',         // totals / "Sold"
  CYAN:     'var(--color-chart-1)',         // primary series
  TEAL_MID: 'var(--game-teal-mid)',         // eyebrow / labels / secondary accent
  EMERALD:  'var(--game-positive)',         // positive delta
  ROSE:     'var(--color-chart-5)',         // negative series
  NEG:      'var(--game-negative)',         // negative delta
  AMBER:    'var(--color-chart-4)',         // warning
  VIOLET:   'var(--color-chart-3)',         // charts only
  SOFT_TEAL:'var(--color-chart-6)',
  BORDER:   'var(--color-border)',
  MUTED:    'var(--muted)',
  FG1:      'var(--game-text)',
  FG2:      'var(--text-body)',
  FG3:      'var(--game-text-secondary)',
  FG4:      'var(--color-muted-foreground)',
  CYAN100:  'var(--cyan-tint)',
};

// Figma html-to-design capture can't resolve CSS var() inside SVG <linearGradient>
// <stop> — it renders them black, killing chart gradients. Map the chart-palette
// tokens to literal hex (keep in sync with theme.css) and resolve stop colors
// through solidStop(). On-screen rendering is unaffected (same colors).
const GRADIENT_HEX: Record<string, string> = {
  'var(--color-chart-1)': '#00C1EB',
  'var(--color-chart-2)': '#003D47',
  'var(--color-chart-3)': '#7C3AED',
  'var(--color-chart-4)': '#B45309',
  'var(--color-chart-5)': '#C0392B',
  'var(--color-chart-6)': '#4DB5B6',
  'var(--game-positive)': '#156162',
  'var(--game-negative)': '#c65252',
  'var(--cyan-deep)': '#00A0C2',
};
const solidStop = (c: string) => GRADIENT_HEX[c] ?? c;

// ─── Single-accent chart language (shadcn-style, light glass) ──────────────────
// One cyan focus + a cohesive cyan→teal→grey ramp. No multi-hue, no textures.
// Curves are smooth monotone; categorical series step down the ramp.
const PAT_GREY = 'var(--color-muted-foreground)';
const PAT_CYAN = 'var(--color-chart-1)';
const CYAN_RAMP = [PAT_CYAN, 'var(--cyan-deep)', 'var(--color-chart-2)', 'var(--color-chart-6)', PAT_GREY];
const rampFill = (i: number) => CYAN_RAMP[i % CYAN_RAMP.length];

// Catmull-Rom → cubic bézier: smooth monotone curve through points.
function smoothPath(pts: [number, number][]) {
  if (pts.length < 2) return pts.length ? `M${pts[0][0]},${pts[0][1]}` : '';
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}

// Legend row marker: rounded vertical accent tick in the series colour (lead-source style).
function LegendTick({ color }: { color: string }) {
  return <span style={{ width: 4, height: 16, borderRadius: 3, background: color, flexShrink: 0 }} />;
}

// ─── Contextual popover (follows cursor) ───────────────────────────────────────
type Tip = { x: number; y: number; label: string; value: string } | null;
function useTip() {
  const [tip, setTip] = useState<Tip>(null);
  return {
    tip,
    show: (e: React.MouseEvent, label: string, value: string) => setTip({ x: e.clientX, y: e.clientY, label, value }),
    hide: () => setTip(null),
  };
}
function Tooltip({ tip }: { tip: Tip }) {
  if (!tip || typeof document === 'undefined') return null;
  return createPortal(
    <div style={{
      position: 'fixed', left: tip.x + 14, top: tip.y + 14, zIndex: 60, pointerEvents: 'none',
      background: 'color-mix(in srgb, var(--game-dark) 90%, transparent)', color: 'var(--primary-foreground)',
      fontFamily: F, fontSize: 11.5, fontWeight: 500, padding: '6px 10px', borderRadius: 8,
      boxShadow: '0 6px 18px rgba(0,44,51,0.22)', whiteSpace: 'nowrap',
    }}>
      <span style={{ opacity: 0.72 }}>{tip.label}</span>
      {tip.value && <span style={{ fontWeight: 700, marginLeft: 8 }}>{tip.value}</span>}
    </div>,
    document.body,
  );
}

// Global hover behaviours (CSS — inline styles can't express :hover).
const QR_CSS = `
.qr-lift{transition:transform .2s ease, box-shadow .2s ease;}
.qr-lift:hover{transform:translateY(-3px);box-shadow:0 16px 36px rgba(0,44,51,0.13);}
.qr-seg{transition:filter .16s ease;cursor:pointer;}
.qr-fbar{transition:transform .16s ease, box-shadow .16s ease;cursor:pointer;}
.qr-shape{transition:filter .15s ease;cursor:pointer;}
`;

// ─── Shared primitives ─────────────────────────────────────────────────────────
function Card({ children, style = {}, pad = 20, className }: { children: React.ReactNode; style?: React.CSSProperties; pad?: number; className?: string }) {
  return (
    <div className={className} style={{ background: 'var(--game-surface)', border: 'var(--game-card-border)', borderRadius: 16, padding: pad, boxShadow: 'var(--shadow-elev-1)', ...style }}>{children}</div>
  );
}

function Eyebrow(_props: { children: React.ReactNode }) {
  return null;
}

function SectionTitle({ title, sub, right }: { title: string; sub?: string; right?: React.ReactNode; eyebrow?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, gap: 16 }}>
      <div>
        <div style={{ fontFamily: F, fontWeight: 800, fontSize: 20, letterSpacing: '-.01em', color: C.FG1, display: 'flex', alignItems: 'center', gap: 6 }}>{title}</div>
        {sub && <div style={{ fontFamily: F, fontSize: 12, color: C.FG3, marginTop: 2 }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}

// Insight caption — one-line narrative beneath a chart (per prompt)
function Insight({ children }: { children: React.ReactNode }) {
  return <div style={{ fontFamily: F, fontSize: 12, color: C.FG3, marginTop: 10, lineHeight: 1.45 }}>{children}</div>;
}

function Delta({ label, positive, noIcon }: { label: string; positive: boolean; noIcon?: boolean }) {
  const col = positive ? C.EMERALD : C.NEG;
  if (noIcon) {
    const arrow = positive ? '↑ ' : '↓ ';
    return (
      <span style={{ fontFamily: F, fontWeight: 600, fontSize: 12, color: col, fontVariantNumeric: 'tabular-nums' }}>
        {arrow}{label}
      </span>
    );
  }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontFamily: F, fontWeight: 600, fontSize: 12, color: col }}>
      {positive ? (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ display: 'inline-block', flexShrink: 0 }}>
          <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ display: 'inline-block', flexShrink: 0 }}>
          <path d="M2.5 2.5L9.5 9.5M9.5 9.5H4M9.5 9.5V4" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {label}
    </span>
  );
}

function IconChip({ icon: Icon, color = C.TEAL_MID, bg = C.CYAN100, size = 30, iconSize = 15 }: { icon: any; color?: string; bg?: string; size?: number; iconSize?: number }) {
  return (
    <span style={{ width: size, height: size, borderRadius: 8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={iconSize} color={color} />
    </span>
  );
}

function StatTile({ icon, label, value, valueColor, deltaLabel, deltaPositive, deltaNeutral }: {
  icon: any; label: string; value: string; valueColor?: string; deltaLabel?: string; deltaPositive?: boolean; deltaNeutral?: boolean;
}) {
  return (
    <div style={{ border: `1px solid ${C.BORDER}`, borderRadius: 12, padding: 14, background: 'rgba(255,255,255,0.5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <IconChip icon={icon} />
        <span style={{ fontFamily: F, fontSize: 12, color: C.FG3, fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ fontFamily: F, fontWeight: 700, fontSize: 22, color: valueColor || C.FG1, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      {deltaLabel && (
        <div style={{ marginTop: 4, fontFamily: F, fontSize: 11, color: C.FG3 }}>
          {deltaNeutral
            ? deltaLabel
            : <><span style={{ color: deltaPositive ? C.EMERALD : C.ROSE, fontWeight: 600 }}>{deltaPositive ? '↑' : '↓'} {deltaLabel.split('·')[0].trim()}</span>{deltaLabel.includes('·') ? ` ${deltaLabel.split('·')[1]}` : ''}</>}
        </div>
      )}
    </div>
  );
}

function MiniSpark({ points, color = C.CYAN, w = 70, h = 22 }: { points: number[]; color?: string; w?: number; h?: number }) {
  const max = Math.max(...points), min = Math.min(...points);
  const xs = points.map((_, i) => (i / (points.length - 1)) * (w - 2) + 1);
  const ys = points.map(p => h - 2 - ((p - min) / ((max - min) || 1)) * (h - 4));
  const pts = xs.map((x, i) => [x, ys[i]] as [number, number]);
  const d = smoothPath(pts);
  const area = `${d} L${xs[xs.length - 1]},${h} L${xs[0]},${h} Z`;
  const lx = xs[xs.length - 1], ly = ys[ys.length - 1];
  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="qr-spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={solidStop(color)} stopOpacity="0.22" />
          <stop offset="100%" stopColor={solidStop(color)} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#qr-spark-fill)" stroke="none" />
      <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r="2.4" fill="var(--color-card)" stroke={color} strokeWidth="1.6" />
    </svg>
  );
}

// ─── KPI catalog (per PDF) + per-tab strips ────────────────────────────────────
type Kpi = { label: string; value: string; icon: any; delta: string; pos: boolean; dot: string };
const KPI: Record<string, Kpi> = {
  'Total Revenue':         { label: 'Total Revenue',         value: '$644,000', icon: TrendingUp, delta: '+12%',     pos: true,  dot: C.CYAN },
  'Total Customers':       { label: 'Total Customers',       value: '2,548',    icon: Users,      delta: '+8%',      pos: true,  dot: C.TEAL },
  'Avg Order Value':       { label: 'Avg Order Value',       value: '$17.20',   icon: DollarSign, delta: '+$0.80',   pos: true,  dot: C.SOFT_TEAL },
  'Unit Sales':            { label: 'Unit Sales',            value: '36,420',   icon: Package,    delta: '+10%',     pos: true,  dot: C.TEAL_MID },
  'Cash Balance':          { label: 'Cash Balance',          value: '$412,500', icon: Wallet,     delta: '-$87,500', pos: false, dot: C.AMBER },
  'Employee Productivity': { label: 'Employee Productivity', value: '82%',      icon: Users,      delta: '+5%',      pos: true,  dot: C.CYAN },
  'Capacity Utilization':  { label: 'Capacity Utilization',  value: '72%',      icon: Activity,   delta: '+4%',      pos: true,  dot: C.SOFT_TEAL },
  'Customer Satisfaction': { label: 'Customer Satisfaction', value: '74%',      icon: Star,       delta: '-2%',      pos: false, dot: C.TEAL_MID },
  'Customer Retention':    { label: 'Customer Retention',    value: '68%',      icon: RefreshCw,  delta: '-3%',      pos: false, dot: C.AMBER },
  'Operating Margin':      { label: 'Operating Margin',      value: '-8.2%',    icon: BarChart2,  delta: '+1.5pp',   pos: true,  dot: C.TEAL },
};

// Flat glass KPI ribbon — no ribbon border, accent = 7px colored dot beside the label.
/* Optional injected data (demo flow) — module mocks remain the /ref defaults. */
export interface QuarterlyReportData {
  quarter: number;
  monthsLabel: string;
  kpiOverrides: Record<string, { value: string; delta: string; pos: boolean }>;
  trend: { months: string[]; revenue: number[]; costs: number[]; profit: number[]; cac: number[] };
  finLog: { rows: string[]; cols: { head: string; profit: string; vals: string[] }[] };
}

function KpiStrip({ labels, overrides }: { labels: string[]; overrides?: QuarterlyReportData['kpiOverrides'] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: 12, marginBottom: 16 }}>
      {labels.map((lb, i) => {
        const k = overrides?.[lb] ? { ...KPI[lb], ...overrides[lb] } : KPI[lb];
        return (
          <div key={i} style={{ background: 'var(--game-surface)', border: 'var(--game-card-border)', borderRadius: 16, padding: '16px 18px', boxShadow: 'var(--shadow-elev-1)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
              <span style={{ width: 7, height: 7, borderRadius: 99, background: k.dot, flexShrink: 0 }} />
              <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: C.FG3, textTransform: 'uppercase', letterSpacing: '.04em' }}>{k.label}</span>
            </div>
            <div style={{ fontFamily: F, fontWeight: 700, fontSize: 26, color: C.FG1, letterSpacing: '-.01em', fontVariantNumeric: 'tabular-nums', marginBottom: 5 }}>{k.value}</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <Delta label={k.delta} positive={k.pos} noIcon />
              <span style={{ fontFamily: F, fontSize: 11, color: C.FG4 }}>vs Q4 2025</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Multi-line chart (Overview revenue trend) ─────────────────────────────────
function RevenueTrendChart({ trend }: { trend?: QuarterlyReportData['trend'] }) {
  const W = 620, H = 300, pad = { t: 24, r: 16, b: 36, l: 52 };
  const x = trend?.months ?? ['M1', 'M2', 'M3'];
  const revenue = trend?.revenue ?? [180, 212, 252];
  const costs = trend?.costs ?? [132, 148, 164];
  const profit = trend?.profit ?? [48, 64, 88];
  const cac = trend?.cac ?? [6.2, 6.4, 6.4];
  const maxY = trend ? Math.max(50, Math.ceil((Math.max(...revenue, ...costs) * 1.15) / 50) * 50) : 300;
  const xAt = (i: number) => pad.l + (i / (x.length - 1)) * (W - pad.l - pad.r);
  const yAt = (v: number) => pad.t + (1 - v / maxY) * (H - pad.t - pad.b);
  const cacLo = Math.min(...cac) * 0.9, cacHi = Math.max(...cac) * 1.1 || 1;
  const cacY = (v: number) => H - pad.b - 6 - ((v - cacLo) / Math.max(0.01, cacHi - cacLo)) * 28;
  const ticks = trend ? [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(t * maxY)) : [0, 75, 150, 225, 300];
  const line = (data: number[]) => smoothPath(data.map((v, i) => [xAt(i), yAt(v)] as [number, number]));
  // Soft shadcn area fill under the primary (Revenue) series, gradient to baseline.
  const areaFill = `${line(revenue)} L${xAt(x.length - 1)},${yAt(0)} L${xAt(0)},${yAt(0)} Z`;
  // Single cyan focus (Revenue); supporting series in the cyan family + dashed CAC.
  const series = [
    { name: 'Revenue', color: C.CYAN, data: revenue, focus: true },
    { name: 'Costs',   color: 'var(--color-chart-6)', data: costs },
    { name: 'Profit',  color: 'var(--cyan-deep)', data: profit },
  ];
  const last = x.length - 1;
  const [hi, setHi] = useState<number | null>(null);
  const { tip, show, hide } = useTip();
  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const vx = ((e.clientX - r.left) / r.width) * W;
    let idx = 0, best = Infinity;
    x.forEach((_, i) => { const d = Math.abs(xAt(i) - vx); if (d < best) { best = d; idx = i; } });
    setHi(idx);
    show(e, x[idx], `Revenue $${revenue[idx]}K · Profit $${profit[idx]}K`);
  };
  return (
    <div style={{ position: 'relative' }}>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}
        role="img" aria-label="Line chart: quarterly revenue rose 40% from $180K in M1 to $252K in M3, outpacing cost growth while CAC held flat at $6.40."
        onMouseMove={onMove} onMouseLeave={() => { setHi(null); hide(); }}>
        <defs>
          <linearGradient id="qr-rev-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={solidStop(C.CYAN)} stopOpacity="0.18" />
            <stop offset="100%" stopColor={solidStop(C.CYAN)} stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={pad.l} x2={W - pad.r} y1={yAt(t)} y2={yAt(t)} stroke={C.BORDER} strokeWidth="1" strokeDasharray="1,5" opacity="0.7" />
            <text x={pad.l - 8} y={yAt(t) + 4} textAnchor="end" fontSize="10" fill={C.FG4} fontFamily={F} style={{ fontVariantNumeric: 'tabular-nums' }}>${t}K</text>
          </g>
        ))}
        {x.map((l, i) => <text key={i} x={xAt(i)} y={H - 12} textAnchor="middle" fontSize="11" fill={hi === i ? C.CYAN : C.FG3} fontWeight={hi === i ? 700 : 400} fontFamily={F}>{l}</text>)}
        {/* hover cursor */}
        {hi !== null && <line x1={xAt(hi)} x2={xAt(hi)} y1={pad.t} y2={H - pad.b} stroke={C.FG4} strokeWidth="1" strokeDasharray="3,3" />}
        <path d={areaFill} fill="url(#qr-rev-fill)" stroke="none" />
        <path d={cac.map((v, i) => `${i ? 'L' : 'M'}${xAt(i)},${cacY(v)}`).join(' ')} fill="none" stroke={PAT_GREY} strokeWidth="1.8" strokeDasharray="4,3" strokeLinecap="round" />
        {series.map((s, si) => (
          <g key={si}>
            <path d={line(s.data)} fill="none" stroke={s.color} strokeWidth={s.focus ? 2.4 : 2} strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={xAt(last)} cy={yAt(s.data[last])} r="4.5" fill="var(--color-card)" stroke={s.color} strokeWidth="2.5" />
            <text x={xAt(last)} y={yAt(s.data[last]) - 10} textAnchor="middle" fontSize="11" fontWeight="700" fontFamily={F} fill={s.color} style={{ fontVariantNumeric: 'tabular-nums' }}>${s.data[last]}K</text>
            {/* cyan node at the hovered column on the focus series */}
            {s.focus && hi !== null && <circle cx={xAt(hi)} cy={yAt(s.data[hi])} r="5" fill={C.CYAN} stroke="var(--color-card)" strokeWidth="2" />}
          </g>
        ))}
        <circle cx={xAt(last)} cy={cacY(cac[last])} r="3.5" fill="var(--color-card)" stroke={PAT_GREY} strokeWidth="2" />
        <text x={xAt(last)} y={cacY(cac[last]) + 16} textAnchor="middle" fontSize="10" fontFamily={F} fill={C.FG3} style={{ fontVariantNumeric: 'tabular-nums' }}>${cac[last].toFixed(2)}</text>
      </svg>
      <div style={{ display: 'flex', gap: 18, justifyContent: 'center', marginTop: 6 }}>
        {[...series, { name: 'CAC', color: PAT_GREY, dashed: true }].map((s: any, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: F, fontSize: 12, color: C.FG3 }}>
            {s.dashed
              ? <svg width="16" height="6"><line x1="0" y1="3" x2="16" y2="3" stroke={s.color} strokeWidth="2" strokeDasharray="3,2" /></svg>
              : <span style={{ width: 10, height: 10, borderRadius: 99, background: s.color }} />}
            {s.name}
          </span>
        ))}
      </div>
      <Insight>
        {trend
          ? `Revenue ${revenue[last] >= revenue[0] ? 'up' : 'down'} ${Math.abs(Math.round(((revenue[last] - revenue[0]) / Math.max(1, revenue[0])) * 100))}% across the quarter to $${revenue[last]}K in ${x[last]}.`
          : 'Revenue up 40% across the quarter to $252K in M3 — outpacing cost growth, with CAC holding flat at $6.40.'}
      </Insight>
      <Tooltip tip={tip} />
    </div>
  );
}

// ─── Radar chart (Quarter at a Glance) ─────────────────────────────────────────
function RadarChart() {
  const size = 260, cx = size / 2, cy = size / 2, R = 92;
  const axes = ['Revenue Strength', 'Customer Retention', 'Customer Satisfaction', 'Employee Efficiency', 'Cash Health'];
  const values = [82, 68, 74, 80, 76];
  const f = (n: number) => Number(n.toFixed(4));
  const angleAt = (i: number) => -Math.PI / 2 + (i / axes.length) * Math.PI * 2;
  const pt = (i: number, r: number) => [f(cx + Math.cos(angleAt(i)) * r), f(cy + Math.sin(angleAt(i)) * r)];
  const rings = [25, 50, 75, 100];
  const poly = values.map((v, i) => pt(i, (v / 100) * R).join(',')).join(' ');
  const aria = `Radar chart of five health scores out of 100: ${axes.map((a, i) => `${a} ${values[i]}`).join(', ')}. Revenue Strength is highest at 82; Customer Retention lowest at 68.`;
  const [hi, setHi] = useState<number | null>(null);
  const { tip, show, hide } = useTip();
  return (
    <>
      <svg width={size} height={size} style={{ overflow: 'visible' }} role="img" aria-label={aria}>
        {rings.map((rg, ri) => <polygon key={ri} points={axes.map((_, i) => pt(i, (rg / 100) * R).join(',')).join(' ')} fill="none" stroke={C.BORDER} strokeWidth="1" />)}
        {axes.map((_, i) => { const [x, y] = pt(i, R); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={C.BORDER} strokeWidth="1" />; })}
        <polygon points={poly} fill={C.CYAN} fillOpacity="0.22" stroke={C.CYAN} strokeWidth="2" strokeLinejoin="round" />
        {values.map((v, i) => {
          const [x, y] = pt(i, (v / 100) * R);
          return (
            <circle key={i} cx={x} cy={y} r={hi === i ? 5.5 : 3.5} fill={hi === i ? C.CYAN : 'var(--color-card)'} stroke={C.CYAN} strokeWidth="2"
              className="qr-shape"
              style={{ filter: hi === i ? 'drop-shadow(0 0 5px color-mix(in srgb, var(--color-chart-1) 55%, transparent))' : 'none' }}
              onMouseEnter={() => setHi(i)}
              onMouseMove={(e) => show(e, axes[i], `${values[i]} / 100`)}
              onMouseLeave={() => { setHi(null); hide(); }} />
          );
        })}
        {[0, 25, 50, 75, 100].map((t) => <text key={t} x={cx + 4} y={cy - (t / 100) * R - 2} fontSize="9" fill={C.FG4} fontFamily={F}>{t}</text>)}
      </svg>
      <Tooltip tip={tip} />
    </>
  );
}

// ─── Gauge (Operating ROI) ─────────────────────────────────────────────────────
// Radiating-tick gauge (shadcn radial style) — cyan ticks fill to value, grey beyond.
function Gauge({ value, label }: { value: number; label: string }) {
  const W = 200, H = 120, cx = W / 2, cy = 104, R = 78;
  const clamp = Math.max(-20, Math.min(20, value));
  const frac = (clamp + 20) / 40;
  const col = value >= 0 ? C.EMERALD : C.ROSE;
  const N = 40;
  const rIn = R - 13, rOut = R;
  const f = (n: number) => Number(n.toFixed(4));
  return (
    <svg width={W} height={H} role="img" aria-label={`Gauge: ${label} is ${value > 0 ? '+' : ''}${value}% on a -20% to +20% scale (${value >= 0 ? 'positive' : 'negative'} territory).`}>
      {Array.from({ length: N }).map((_, i) => {
        const fi = i / (N - 1), ang = Math.PI - fi * Math.PI, on = fi <= frac;
        const x0 = f(cx + Math.cos(ang) * rIn), y0 = f(cy - Math.sin(ang) * rIn);
        const x1 = f(cx + Math.cos(ang) * rOut), y1 = f(cy - Math.sin(ang) * rOut);
        return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke={on ? C.CYAN : C.BORDER} strokeWidth={on ? 3 : 2.4} strokeLinecap="round" />;
      })}
      <text x={cx} y={cy - 18} textAnchor="middle" fontFamily={F} fontWeight="700" fontSize="30" fill={col}>{value > 0 ? '+' : ''}{value}%</text>
      <text x={cx} y={cy + 2} textAnchor="middle" fontFamily={F} fontSize="11" fill={C.FG3}>{label}</text>
    </svg>
  );
}

// ─── Donut chart ───────────────────────────────────────────────────────────────
function Donut({ data, centerTop, centerSub, size = 150 }: {
  data: { label: string; value: number; color: string; valueLabel?: string }[];
  centerTop?: string; centerSub?: string; size?: number;
}) {
  const cx = size / 2, cy = size / 2, R = size / 2 - 6, r = R - 24;
  const total = data.reduce((s, d) => s + d.value, 0);
  const f = (n: number) => Number(n.toFixed(4));
  let a0 = -Math.PI / 2;
  const arcs = data.map(d => {
    const sweep = (d.value / total) * Math.PI * 2;
    const a1 = a0 + sweep, large = sweep > Math.PI ? 1 : 0;
    const x0 = f(cx + Math.cos(a0) * R), y0 = f(cy + Math.sin(a0) * R);
    const x1 = f(cx + Math.cos(a1) * R), y1 = f(cy + Math.sin(a1) * R);
    const xi1 = f(cx + Math.cos(a1) * r), yi1 = f(cy + Math.sin(a1) * r);
    const xi0 = f(cx + Math.cos(a0) * r), yi0 = f(cy + Math.sin(a0) * r);
    const path = `M${x0},${y0} A${R},${R} 0 ${large} 1 ${x1},${y1} L${xi1},${yi1} A${r},${r} 0 ${large} 0 ${xi0},${yi0} Z`;
    a0 = a1; return { ...d, path };
  });
  const [hi, setHi] = useState<number | null>(null);
  const { tip, show, hide } = useTip();
  const aria = `Donut chart, part-to-whole: ${data.map(d => `${d.label} ${d.valueLabel || d.value}`).join(', ')}.`;
  return (
    <>
      <svg width={size} height={size} style={{ overflow: 'visible' }} role="img" aria-label={aria}>
        {arcs.map((a, i) => (
          <path
            key={i} d={a.path} className="qr-seg"
            fill={rampFill(i)}
            stroke={hi === i ? PAT_CYAN : 'var(--color-card)'}
            strokeWidth={hi === i ? 2 : 1.5}
            style={{ filter: hi === i ? 'drop-shadow(0 0 6px color-mix(in srgb, var(--color-chart-1) 55%, transparent))' : 'none', opacity: hi === null || hi === i ? 1 : 0.55 }}
            onMouseEnter={() => setHi(i)}
            onMouseMove={(e) => show(e, a.label, a.valueLabel || String(a.value))}
            onMouseLeave={() => { setHi(null); hide(); }}
          />
        ))}
        {centerTop && <text x={cx} y={cy - 2} textAnchor="middle" fontFamily={F} fontWeight="700" fontSize={size > 150 ? 22 : 18} fill={C.FG1}>{centerTop}</text>}
        {centerSub && <text x={cx} y={cy + 14} textAnchor="middle" fontFamily={F} fontSize="9" fill={C.FG3} letterSpacing="0.04em">{centerSub}</text>}
      </svg>
      <Tooltip tip={tip} />
    </>
  );
}

function Legend({ data, withValue }: { data: { label: string; color: string; valueLabel?: string }[]; withValue?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: F, fontSize: 12.5, color: C.FG2 }}>
            <LegendTick color={rampFill(i)} />{d.label}
          </span>
          {withValue && d.valueLabel && <span style={{ fontFamily: F, fontWeight: 600, fontSize: 12.5, color: C.FG1, fontVariantNumeric: 'tabular-nums' }}>{d.valueLabel}</span>}
        </div>
      ))}
    </div>
  );
}

// Vertical fade gradients shared by the finance bar charts.
function BarGradients() {
  const g = (id: string, c: string) => (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1" key={id}>
      <stop offset="0%" stopColor={solidStop(c)} stopOpacity="0.95" />
      <stop offset="100%" stopColor={solidStop(c)} stopOpacity="0.5" />
    </linearGradient>
  );
  return <defs>{g('qr-bar-cyan', C.CYAN)}{g('qr-bar-rose', C.ROSE)}{g('qr-bar-emerald', C.EMERALD)}{g('qr-bar-teal', C.TEAL)}</defs>;
}

// ─── Combo bar + margin line (Finance) ─────────────────────────────────────────
function ComboBarLine() {
  const W = 620, H = 250, pad = { t: 22, r: 44, b: 42, l: 48 };
  const labels = ['M1\nJanuary 2026', 'M2\nFebruary 2026', 'M3\nMarch 2026'];
  const revenue = [180, 212, 252], burn = [-132, -148, -164], profit = [48, 64, 88];
  const margin = [26.7, 30.2, 34.9];
  const yMax = 300, yMin = -200;
  const yAt = (v: number) => pad.t + (1 - (v - yMin) / (yMax - yMin)) * (H - pad.t - pad.b);
  const mAt = (v: number) => pad.t + (1 - (v + 60) / 120) * (H - pad.t - pad.b);
  const n = labels.length, groupW = (W - pad.l - pad.r) / n, inner = groupW * 0.62, barW = inner / 3;
  const yticks = [-200, -100, 0, 100, 200, 300];
  const mticks = [-60, -20, 20, 60];
  const bars = [
    { key: 'Revenue', data: revenue, color: C.CYAN, grad: 'qr-bar-cyan' },
    { key: 'Burn', data: burn, color: C.ROSE, grad: 'qr-bar-rose' },
    { key: 'Profit', data: profit, color: C.EMERALD, grad: 'qr-bar-emerald' },
  ];
  const [hi, setHi] = useState<number | null>(null);
  const { tip, show, hide } = useTip();
  return (
    <div style={{ position: 'relative' }}>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }} role="img" aria-label="Grouped bar chart with margin line: across M1–M3 revenue grew $180K→$252K and profit $48K→$88K against rising burn, while operating margin climbed 26.7%→34.9%.">
        <BarGradients />
        {yticks.map((t, i) => (
          <g key={i}>
            <line x1={pad.l} x2={W - pad.r} y1={yAt(t)} y2={yAt(t)} stroke={t === 0 ? C.FG4 : C.BORDER} strokeWidth={t === 0 ? 1.4 : 1} strokeDasharray={t === 0 ? undefined : '1,5'} opacity={t === 0 ? 1 : 0.7} />
            <text x={pad.l - 8} y={yAt(t) + 4} textAnchor="end" fontSize="9.5" fill={C.FG4} fontFamily={F} style={{ fontVariantNumeric: 'tabular-nums' }}>${t}K</text>
          </g>
        ))}
        {mticks.map((t, i) => <text key={i} x={W - pad.r + 8} y={mAt(t) + 4} textAnchor="start" fontSize="9.5" fill={C.FG4} fontFamily={F}>{t}%</text>)}
        {labels.map((l, i) => {
          const gStart = pad.l + i * groupW + (groupW - inner) / 2, active = hi === i;
          return (
            <g key={i}>
              {active && <rect x={pad.l + i * groupW + 2} y={pad.t} width={groupW - 4} height={H - pad.t - pad.b} fill={C.CYAN} opacity="0.06" rx="8" />}
              {bars.map((b, bi) => {
                const v = b.data[i], x = gStart + bi * barW;
                const y = v >= 0 ? yAt(v) : yAt(0);
                const h = Math.max(Math.abs(yAt(v) - yAt(0)), 2);
                return <rect key={bi} x={x} y={y} width={barW - 3} height={h} fill={`url(#${b.grad})`} rx="3" style={{ opacity: hi === null || active ? 1 : 0.5, transition: 'opacity .15s' }} />;
              })}
              {l.split('\n').map((ln, li) => (
                <text key={li} x={pad.l + i * groupW + groupW / 2} y={H - 24 + li * 12} textAnchor="middle" fontSize={li === 0 ? 11 : 9.5} fontWeight={li === 0 ? 700 : 400} fill={li === 0 ? (active ? C.CYAN : C.FG2) : C.FG4} fontFamily={F}>{ln}</text>
              ))}
              <rect x={pad.l + i * groupW} y={pad.t} width={groupW} height={H - pad.t - pad.b} fill="transparent"
                onMouseEnter={() => setHi(i)}
                onMouseMove={(e) => show(e, labels[i].split('\n')[0], `Rev $${revenue[i]}K · Burn -$${Math.abs(burn[i])}K · Profit $${profit[i]}K · Margin ${margin[i]}%`)}
                onMouseLeave={() => { setHi(null); hide(); }} />
            </g>
          );
        })}
        <path d={smoothPath(margin.map((v, i) => [pad.l + i * groupW + groupW * 0.5, mAt(v)] as [number, number]))} fill="none" stroke={C.TEAL_MID} strokeWidth="2.2" strokeLinecap="round" />
        {margin.map((v, i) => { const gx = pad.l + i * groupW + groupW * 0.5; return (
          <g key={i}>
            <circle cx={gx} cy={mAt(v)} r={hi === i ? 5 : 4} fill={hi === i ? C.TEAL_MID : 'var(--color-card)'} stroke={C.TEAL_MID} strokeWidth="2.2" />
            <text x={gx} y={mAt(v) - 10} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.TEAL_MID} fontFamily={F}>{v}%</text>
          </g>
        ); })}
      </svg>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 6, flexWrap: 'wrap' }}>
        {[{ n: 'Revenue', c: C.CYAN }, { n: 'Burn / Costs', c: C.ROSE }, { n: 'Profit', c: C.EMERALD }, { n: 'Margin (%)', c: C.TEAL_MID, line: true }].map((s, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: F, fontSize: 11.5, color: C.FG3 }}>
            {s.line ? <svg width="16" height="6"><line x1="0" y1="3" x2="16" y2="3" stroke={s.c} strokeWidth="2" /></svg> : <span style={{ width: 9, height: 9, borderRadius: 2, background: s.c }} />}{s.n}
          </span>
        ))}
      </div>
      <Tooltip tip={tip} />
    </div>
  );
}

// ─── Waterfall (Cash bridge) ───────────────────────────────────────────────────
function CashBridge() {
  const items = [
    { label: 'Opening Cash', sub: 'Dec 31, 2025', value: 500000, type: 'total' as const },
    { label: 'Revenue Inflow', value: 644000, type: 'delta' as const },
    { label: 'COGS', value: -258000, type: 'delta' as const },
    { label: 'Labor (Direct)', value: -102000, type: 'delta' as const },
    { label: 'Rent', value: -36000, type: 'delta' as const },
    { label: 'Marketing', value: -24000, type: 'delta' as const },
    { label: 'Other Indirect', value: -311500, type: 'delta' as const },
    { label: 'Closing Cash', sub: 'Mar 31, 2026', value: 412500, type: 'total' as const },
  ];
  const W = 620, H = 250, pad = { t: 26, r: 12, b: 42, l: 48 };
  let running = 0;
  const bars = items.map(it => {
    if (it.type === 'total') { const b = { ...it, from: 0, to: it.value, color: C.TEAL, grad: 'qr-bar-teal' }; running = it.value; return b; }
    const from = running; running += it.value;
    return { ...it, from, to: running, color: it.value >= 0 ? C.CYAN : C.ROSE, grad: it.value >= 0 ? 'qr-bar-cyan' : 'qr-bar-rose' };
  });
  const maxV = Math.max(...bars.map(b => Math.max(b.from, b.to)));
  const yAt = (v: number) => pad.t + (1 - v / (maxV * 1.05)) * (H - pad.t - pad.b);
  const slot = (W - pad.l - pad.r) / bars.length, barW = slot * 0.6;
  const [hi, setHi] = useState<number | null>(null);
  const { tip, show, hide } = useTip();
  return (
    <>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }} role="img" aria-label="Waterfall chart: opening cash $500K plus $644K revenue inflow, less COGS, labor, rent, marketing and $311.5K other indirect, ends at $412.5K closing cash — a $87.5K net decline.">
        <BarGradients />
        <line x1={pad.l} x2={W - pad.r} y1={yAt(0)} y2={yAt(0)} stroke={C.BORDER} strokeWidth="1.4" />
        {bars.map((b, i) => {
          const x = pad.l + i * slot + (slot - barW) / 2;
          const y = yAt(Math.max(b.from, b.to)), h = Math.max(Math.abs(yAt(b.from) - yAt(b.to)), 2);
          const active = hi === i, val = (b as any).value as number;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={h} fill={`url(#${b.grad})`} rx="3"
                style={{ opacity: hi === null || active ? 1 : 0.5, filter: active ? 'drop-shadow(0 4px 10px rgba(0,44,51,0.16))' : 'none', transition: 'opacity .15s' }} />
              {i < bars.length - 1 && bars[i + 1].type !== 'total' && <line x1={x + barW} x2={x + slot} y1={yAt(b.to)} y2={yAt(b.to)} stroke={C.FG4} strokeDasharray="2,3" />}
              <text x={x + barW / 2} y={y - 6} textAnchor="middle" fontSize="9.5" fontWeight="700" fontFamily={F} fill={b.color}>{val >= 0 && b.type === 'delta' ? '+' : ''}${Math.round(Math.abs(val) / 1000)}K</text>
              <text x={x + barW / 2} y={H - 24} textAnchor="middle" fontSize="9" fontFamily={F} fontWeight="600" fill={active ? C.CYAN : C.FG2}>{b.label}</text>
              {(b as any).sub && <text x={x + barW / 2} y={H - 13} textAnchor="middle" fontSize="8" fontFamily={F} fill={C.FG4}>{(b as any).sub}</text>}
              <rect x={pad.l + i * slot} y={pad.t} width={slot} height={H - pad.t - pad.b} fill="transparent"
                onMouseEnter={() => setHi(i)}
                onMouseMove={(e) => show(e, b.label, `${val >= 0 && b.type === 'delta' ? '+' : ''}$${Math.abs(val).toLocaleString()}`)}
                onMouseLeave={() => { setHi(null); hide(); }} />
            </g>
          );
        })}
      </svg>
      <Tooltip tip={tip} />
    </>
  );
}

// ─── Funnel (Market customer acquisition) ──────────────────────────────────────
// Smooth cyan flow funnel (shadcn-style): a single tapering band, % pill per stage.
function Funnel() {
  const stages = [
    { label: 'Awareness',       value: '125,000', rate: 'Visit Rate', rateVal: '45%' },
    { label: 'Visits',          value: '56,250',  rate: 'Order Rate', rateVal: '18%' },
    { label: 'Orders',          value: '10,125',  rate: 'Repeat Rate', rateVal: '34%' },
    { label: 'Customers',       value: '3,443',   rate: 'Retention Rate', rateVal: '42%' },
    { label: 'Loyal Customers', value: '1,446',   rate: '', rateVal: '' },
  ];
  const nums = [125000, 56250, 10125, 3443, 1446];
  // % pill = step conversion into the stage (= the prior stage's quoted rate); first = 100%.
  const pills = ['100%', stages[0].rateVal, stages[1].rateVal, stages[2].rateVal, stages[3].rateVal];
  const W = 620, H = 268, padL = 8, padR = 8, plotTop = 46, plotBottom = 214;
  const midY = (plotTop + plotBottom) / 2, maxHalf = 76, max = nums[0], n = nums.length;
  const segW = (W - padL - padR) / n;
  const cxAt = (i: number) => padL + segW * (i + 0.5);
  const half = (v: number) => (v / max) * maxHalf;
  const tops: [number, number][] = nums.map((v, i) => [cxAt(i), midY - half(v)]);
  const bots: [number, number][] = nums.map((v, i) => [cxAt(i), midY + half(v)]);
  const topsE: [number, number][] = [[padL, tops[0][1]], ...tops, [W - padR, tops[n - 1][1]]];
  const botsE: [number, number][] = [[padL, bots[0][1]], ...bots, [W - padR, bots[n - 1][1]]];
  const botD = 'L' + smoothPath([...botsE].reverse()).slice(1);
  const bandD = `${smoothPath(topsE)} ${botD} Z`;
  const [hi, setHi] = useState<number | null>(null);
  const { tip, show, hide } = useTip();
  return (
    <>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}
        role="img" aria-label="Funnel chart: 125,000 Awareness → 56,250 Visits (45%) → 10,125 Orders (18%) → 3,443 Customers (34%) → 1,446 Loyal Customers (42% retention). Visits→Orders is the steepest drop-off.">
        <defs>
          <linearGradient id="qr-funnel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={solidStop(C.CYAN)} stopOpacity="0.92" />
            <stop offset="100%" stopColor={solidStop(C.CYAN)} stopOpacity="0.42" />
          </linearGradient>
        </defs>
        <path d={bandD} fill="url(#qr-funnel)" />
        {/* stage dividers */}
        {nums.slice(1).map((_, i) => { const x = padL + segW * (i + 1); return <line key={i} x1={x} x2={x} y1={plotTop} y2={plotBottom} stroke="var(--color-card)" strokeWidth="1.5" opacity="0.7" />; })}
        {nums.map((v, i) => {
          const x0 = padL + segW * i, active = hi === i;
          return (
            <g key={i}>
              {active && <rect x={x0} y={plotTop} width={segW} height={plotBottom - plotTop} fill={C.CYAN} opacity="0.1" />}
              {/* value (top) */}
              <text x={cxAt(i)} y={30} textAnchor="middle" fontFamily={F} fontWeight="700" fontSize="16" fill={active ? C.CYAN : C.FG1} style={{ fontVariantNumeric: 'tabular-nums' }}>{stages[i].value}</text>
              {/* % pill (center) */}
              <rect x={cxAt(i) - 24} y={midY - 12} width="48" height="24" rx="12" fill={active ? C.CYAN : 'var(--color-card)'} stroke={active ? C.CYAN : C.BORDER} strokeWidth="1" style={{ filter: active ? 'drop-shadow(0 2px 6px rgba(0,44,51,0.18))' : 'none' }} />
              <text x={cxAt(i)} y={midY + 4} textAnchor="middle" fontFamily={F} fontWeight="700" fontSize="12" fill={active ? 'var(--primary-foreground)' : C.FG1}>{pills[i]}</text>
              {/* label (bottom) */}
              <text x={cxAt(i)} y={plotBottom + 28} textAnchor="middle" fontFamily={F} fontSize="11.5" fontWeight={active ? 700 : 500} fill={active ? C.CYAN : C.FG3}>{stages[i].label}</text>
              {/* hit area */}
              <rect x={x0} y={plotTop} width={segW} height={plotBottom - plotTop + 34} fill="transparent"
                onMouseEnter={() => setHi(i)}
                onMouseMove={(e) => show(e, stages[i].label, `${stages[i].value}${stages[i].rate ? ` · ${stages[i].rate} ${stages[i].rateVal}` : ''}`)}
                onMouseLeave={() => { setHi(null); hide(); }} />
            </g>
          );
        })}
      </svg>
      <Tooltip tip={tip} />
    </>
  );
}

// ─── Bubble quadrant (Team positioning) ────────────────────────────────────────
// Price × Quantity map; coloured team bubbles sized by market share, Team A focus.
function PositioningMap() {
  const W = 460, H = 280, pad = { t: 20, r: 20, b: 40, l: 46 };
  const teams = [
    { name: 'Team A', x: 0.78, y: 0.82, tag: 'Premium',  share: 28, focus: true, color: C.CYAN },
    { name: 'Team B', x: 0.34, y: 0.74, tag: 'Premium',  share: 25, color: C.TEAL_MID },
    { name: 'Team C', x: 0.62, y: 0.50, tag: 'Value',    share: 22, color: C.AMBER },
    { name: 'Team D', x: 0.30, y: 0.24, tag: 'Standard', share: 15, color: C.VIOLET },
    { name: 'Others', x: 0.16, y: 0.20, tag: 'Standard', share: 10, color: C.FG4 },
  ];
  const px = (v: number) => pad.l + v * (W - pad.l - pad.r);
  const py = (v: number) => pad.t + (1 - v) * (H - pad.t - pad.b);
  const midX = (pad.l + W - pad.r) / 2, midY = (pad.t + H - pad.b) / 2;
  // bubble radius scaled by market share (10–28% → 11–22px)
  const rAt = (share: number) => 11 + ((share - 10) / 18) * 11;
  const [hi, setHi] = useState<number | null>(null);
  const { tip, show, hide } = useTip();
  return (
    <>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}
        role="img" aria-label="Bubble quadrant of price position vs quantity sold, bubble size = market share: Team A (you) leads the high-price high-volume Premium quadrant at 28% share; standard players cluster low-left.">
        {/* quadrant dividers at centre */}
        <line x1={midX} y1={pad.t} x2={midX} y2={H - pad.b} stroke={C.BORDER} strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
        <line x1={pad.l} y1={midY} x2={W - pad.r} y2={midY} stroke={C.BORDER} strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
        {/* quadrant labels */}
        <text x={W - pad.r - 8} y={pad.t + 14} textAnchor="end" fontSize="8.5" fontWeight="700" fill={C.FG4} opacity="0.35" fontFamily={F} letterSpacing="0.05em">PREMIUM LEADERS</text>
        <text x={pad.l + 8} y={pad.t + 14} textAnchor="start" fontSize="8.5" fontWeight="700" fill={C.FG4} opacity="0.35" fontFamily={F} letterSpacing="0.05em">PREMIUM NICHE</text>
        <text x={pad.l + 8} y={H - pad.b - 8} textAnchor="start" fontSize="8.5" fontWeight="700" fill={C.FG4} opacity="0.35" fontFamily={F} letterSpacing="0.05em">STANDARD CLASS</text>
        <text x={W - pad.r - 8} y={H - pad.b - 8} textAnchor="end" fontSize="8.5" fontWeight="700" fill={C.FG4} opacity="0.35" fontFamily={F} letterSpacing="0.05em">VALUE LEADERS</text>
        {/* axes */}
        <line x1={pad.l} y1={pad.t} x2={pad.l} y2={H - pad.b} stroke={C.BORDER} />
        <line x1={pad.l} y1={H - pad.b} x2={W - pad.r} y2={H - pad.b} stroke={C.BORDER} />
        <text x={pad.l - 8} y={pad.t + 8} textAnchor="end" fontSize="9" fill={C.FG4} fontFamily={F}>High</text>
        <text x={pad.l - 8} y={H - pad.b} textAnchor="end" fontSize="9" fill={C.FG4} fontFamily={F}>Low</text>
        <text x={pad.l} y={H - 10} textAnchor="middle" fontSize="9" fill={C.FG4} fontFamily={F}>Low</text>
        <text x={(pad.l + W - pad.r) / 2} y={H - 10} textAnchor="middle" fontSize="9.5" fill={C.FG3} fontFamily={F}>Quantity Sold</text>
        <text x={W - pad.r} y={H - 10} textAnchor="middle" fontSize="9" fill={C.FG4} fontFamily={F}>High</text>
        <text transform={`rotate(-90 14 ${(pad.t + H - pad.b) / 2})`} x={14} y={(pad.t + H - pad.b) / 2} textAnchor="middle" fontSize="9.5" fill={C.FG3} fontFamily={F}>Price Position</text>
        {/* hover projection lines */}
        {hi !== null && (
          <g>
            <line x1={pad.l} x2={px(teams[hi].x)} y1={py(teams[hi].y)} y2={py(teams[hi].y)} stroke={teams[hi].color} strokeWidth="1.2" strokeDasharray="2,2" opacity="0.6" />
            <line x1={px(teams[hi].x)} x2={px(teams[hi].x)} y1={py(teams[hi].y)} y2={H - pad.b} stroke={teams[hi].color} strokeWidth="1.2" strokeDasharray="2,2" opacity="0.6" />
          </g>
        )}
        {/* bubbles (largest first so small ones stay clickable on top) */}
        {teams.map((t, i) => {
          const active = hi === i, faded = hi !== null && !active;
          const r = rAt(t.share) + (active ? 2 : 0);
          return (
            <g key={i} className="qr-shape"
              style={{ opacity: faded ? 0.4 : 1, transition: 'opacity .2s ease', filter: active ? 'drop-shadow(0 4px 10px rgba(0,44,51,0.18))' : 'none' }}
              onMouseEnter={() => setHi(i)}
              onMouseMove={(e) => show(e, t.name, `${t.tag} · ${t.share}% share · Price ${Math.round(t.y * 100)}% · Vol ${Math.round(t.x * 100)}%`)}
              onMouseLeave={() => { setHi(null); hide(); }}
            >
              {t.focus && <circle cx={px(t.x)} cy={py(t.y)} r={r + 5} fill="none" stroke={C.CYAN} strokeWidth="1.2" strokeDasharray="2,2" opacity="0.55" />}
              <circle cx={px(t.x)} cy={py(t.y)} r={r} fill={t.color} fillOpacity={active ? 0.95 : 0.82} stroke="var(--color-card)" strokeWidth="1.6" />
              <text x={px(t.x)} y={py(t.y) + 3.5} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="var(--primary-foreground)" fontFamily={F} style={{ pointerEvents: 'none' }}>{t.share}%</text>
              <text x={px(t.x) + r + 6} y={py(t.y) - 1} fontSize="10" fontWeight="700" fill={active ? t.color : C.FG1} fontFamily={F} style={{ pointerEvents: 'none' }}>{t.name}</text>
              <text x={px(t.x) + r + 6} y={py(t.y) + 10} fontSize="7.5" fontWeight="600" fill={C.FG4} fontFamily={F} style={{ pointerEvents: 'none', letterSpacing: '0.02em' }}>{t.tag.toUpperCase()}</text>
            </g>
          );
        })}
      </svg>
      <Tooltip tip={tip} />
      {/* legend — team colours */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 12 }}>
        {teams.map((t, i) => {
          const active = hi === i;
          return (
            <span key={i}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: F, fontSize: 11.5, color: active ? C.FG1 : C.FG3, fontWeight: active ? 700 : 500, cursor: 'pointer', opacity: hi === null || active ? 1 : 0.55, transition: 'opacity .15s, color .15s' }}
              onMouseEnter={() => setHi(i)}
              onMouseLeave={() => setHi(null)}
            >
              <span style={{ width: 11, height: 11, borderRadius: 99, background: t.color, flexShrink: 0 }} />
              {t.name}
            </span>
          );
        })}
      </div>
    </>
  );
}

// ─── TABS ──────────────────────────────────────────────────────────────────────
const TAB_ITEMS = [
  { id: 'Overview', label: 'Overview' },
  { id: 'Finance', label: 'Finance' },
  { id: 'Inventory', label: 'Inventory' },
  { id: 'Market View', label: 'Market View' },
];
type TabId = 'Overview' | 'Finance' | 'Inventory' | 'Market View';

// ─── OVERVIEW TAB ──────────────────────────────────────────────────────────────
const HEALTH_METRICS = [
  { label: 'Revenue Strength',    score: 82, status: 'Strong',          statusColor: C.EMERALD, spark: [70, 74, 78, 80, 82] },
  { label: 'Customer Retention',  score: 68, status: 'Needs Attention', statusColor: C.AMBER,   spark: [74, 72, 70, 69, 68] },
  { label: 'Customer Satisfaction', score: 74, status: 'Good',          statusColor: C.TEAL_MID, spark: [70, 72, 73, 73, 74] },
  { label: 'Cash Health',         score: 76, status: 'Healthy',         statusColor: C.EMERALD, spark: [82, 80, 78, 77, 76] },
  { label: 'Employee Efficiency', score: 80, status: 'Strong',          statusColor: C.EMERALD, spark: [74, 76, 78, 79, 80] },
];

function OverviewTab({ data }: { data?: QuarterlyReportData }) {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <KpiStrip labels={['Total Revenue', 'Total Customers', 'Avg Order Value', 'Unit Sales', 'Cash Balance']} overrides={data?.kpiOverrides} />
      <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 16 }}>
        <Card className="qr-lift">
          <SectionTitle eyebrow="Trend" title="Quarterly Revenue Trend" right={
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: F, fontSize: 10, color: C.FG3, letterSpacing: '.06em' }}>CAC (Q3)</div>
              <div style={{ fontFamily: F, fontSize: 18, fontWeight: 700, color: C.TEAL_MID }}>$6.40</div>
            </div>
          } />
          <RevenueTrendChart trend={data?.trend} />
        </Card>
        <Card>
          <SectionTitle eyebrow="Scorecard" title="Quarter at a Glance" />
          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16, alignItems: 'center' }}>
            <RadarChart />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {HEALTH_METRICS.map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, borderTop: i ? `1px solid ${C.MUTED}` : 'none', paddingTop: i ? 10 : 0 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: F, fontSize: 11, color: C.FG3 }}>{m.label}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                      <span style={{ fontFamily: F, fontWeight: 700, fontSize: 19, color: C.FG1, fontVariantNumeric: 'tabular-nums' }}>{m.score}</span>
                      <span style={{ fontFamily: F, fontSize: 10, color: C.FG4 }}>/100</span>
                      <span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: m.statusColor, marginLeft: 2 }}>{m.status}</span>
                    </div>
                    {/* slim score track */}
                    <div style={{ height: 4, borderRadius: 99, background: C.MUTED, marginTop: 6, overflow: 'hidden' }}>
                      <div style={{ width: `${m.score}%`, height: '100%', borderRadius: 99, background: C.CYAN }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Insight>Revenue Strength leads at 82/100; Customer Retention (68) is the weakest pillar and the priority to shore up.</Insight>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 16 }}>
        <Card>
          <SectionTitle eyebrow="Products" title="Top & Weak Product Performance" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <Eyebrow>Sales Amount</Eyebrow>
              <ProductMini label="Highest Sales Product" name="Espresso Blend" value="$182,400" icon={Coffee} positive />
              <ProductMini label="Lowest Sales Product" name="Matcha cake slice" value="$28,300" icon={Box} />
            </div>
            <div>
              <Eyebrow>Inventory Efficiency</Eyebrow>
              <ProductMini label="Highest Inventory Efficiency" name="Almond croissant" value="82%" icon={Box} positive />
              <ProductMini label="Lowest Inventory Efficiency" name="Oat-milk latte" value="41%" icon={Coffee} />
            </div>
          </div>
        </Card>
        <Card>
          <SectionTitle eyebrow="Operations" title="Business Health & People" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
            <StatTile icon={TrendingUp} label="Quarterly ROI" value="-12.6%" valueColor={C.ROSE} deltaLabel="+3.2pp · vs Q4 2025" deltaPositive />
            <StatTile icon={PieChart} label="Market Share" value="28%" deltaLabel="+2pp · vs Q4 2025" deltaPositive />
            <StatTile icon={Trophy} label="Current Rank" value="#4" deltaLabel="— vs Q4 2025" deltaNeutral />
            <StatTile icon={Zap} label="R&D Streak" value="5" deltaLabel="+1 · Quarters" deltaPositive />
          </div>
          <Eyebrow>Quarterly Initiatives</Eyebrow>
          <div style={{ marginTop: 8, border: `1px solid ${C.BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr', background: C.MUTED, padding: '9px 14px', fontFamily: F, fontSize: 10, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: C.FG3 }}>
              <div>Initiative</div><div>Cost</div><div>Impact Area</div>
            </div>
            {[
              { i: 'Employee Training', c: '$2,400', a: 'People', icon: Users },
              { i: 'Customer Acquisition Push', c: '$3,500', a: 'Growth', icon: ChevronRight },
              { i: 'Supplier Relationship', c: '$1,200', a: 'Efficiency', icon: Settings },
            ].map((r, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr', padding: '11px 14px', borderTop: `1px solid ${C.MUTED}`, alignItems: 'center' }}>
                <div style={{ fontFamily: F, fontSize: 13, fontWeight: 500, color: C.FG1 }}>{r.i}</div>
                <div style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: C.FG2 }}>{r.c}</div>
                <div style={{ fontFamily: F, fontSize: 12, color: C.TEAL_MID, display: 'inline-flex', alignItems: 'center', gap: 6 }}><r.icon size={13} color={C.TEAL_MID} />{r.a}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function ProductMini({ label, name, value, icon: Icon, positive }: { label: string; name: string; value: string; icon: any; positive?: boolean }) {
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontFamily: F, fontSize: 11, color: C.FG3, marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, border: `1px solid ${C.BORDER}`, borderRadius: 10, padding: '10px 12px' }}>
        <IconChip icon={Icon} iconSize={16} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: C.FG1 }}>{name}</div>
          <div style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: positive ? C.EMERALD : C.ROSE }}>{value}</div>
        </div>
      </div>
    </div>
  );
}

// ─── FINANCE TAB ───────────────────────────────────────────────────────────────
const FIN_LOG = {
  rows: ['Opening Cash', 'Revenue', 'COGS', 'Labor (Direct)', 'Rent', 'Marketing', 'Other Indirect', 'Profit', 'Closing Cash'],
  cols: [
    { head: 'M1 · January 2026', profit: '+$48,000', vals: ['$500,000', '$180,000', '-$72,000', '-$32,000', '-$12,000', '-$8,000', '-$8,000', '$48,000', '$548,000'] },
    { head: 'M2 · February 2026', profit: '+$64,000', vals: ['$548,000', '$212,000', '-$86,000', '-$34,000', '-$12,000', '-$8,000', '-$12,000', '$64,000', '$612,000'] },
    { head: 'M3 · March 2026', profit: '+$88,000', vals: ['$612,000', '$252,000', '-$100,000', '-$36,000', '-$12,000', '-$8,000', '-$8,000', '$88,000', '$700,000'] },
  ],
};

function FinanceTab({ data }: { data?: QuarterlyReportData }) {
  const finLog = data?.finLog ?? FIN_LOG;
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <KpiStrip labels={['Total Revenue', 'Cash Balance', 'Operating Margin']} overrides={data?.kpiOverrides} />
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        <Card>
          <SectionTitle eyebrow="Financials" title="Revenue, Burn/Costs, Profit & Margin Trend" />
          <ComboBarLine />
          <Insight>Margin climbed from 26.7% to 34.9% as revenue scaled faster than burn — profit nearly doubled to $88K by M3.</Insight>
        </Card>
        <div style={{ display: 'grid', gap: 16, gridTemplateRows: 'auto auto' }}>
          <Card>
            <SectionTitle eyebrow="Efficiency" title="Operating ROI" />
            <div style={{ display: 'flex', justifyContent: 'center' }}><Gauge value={-4.8} label="Operating ROI" /></div>
            <p style={{ fontFamily: F, fontSize: 12, color: C.FG3, lineHeight: 1.5, margin: '8px 0 0', textAlign: 'center' }}>
              Operating profit relative to operating investment/cost base. Higher is better.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
              <span style={{ fontFamily: F, fontSize: 12, color: C.FG3 }}>vs Q4 2025 <span style={{ color: C.EMERALD, fontWeight: 600 }}>↗ 2.1 pp</span></span>
            </div>
          </Card>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <StatTile icon={Landmark} label="Total Debt" value="$120,000" deltaLabel="-$10,000 · vs Q4 2025" deltaPositive />
            <StatTile icon={DollarSign} label="Interest Incurred" value="$3,600" deltaLabel="-$400 · vs Q4 2025" deltaPositive />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 16 }}>
        <Card>
          <SectionTitle eyebrow="Cash Flow" title="Quarterly Cash Movement (Bridge)" />
          <CashBridge />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 12 }}>
            <BridgeStat label="Net Cash Change" value="-$87,500" color={C.ROSE} />
            <BridgeStat label="Cash In" value="$644,000" color={C.EMERALD} />
            <BridgeStat label="Cash Out" value="$731,500" color={C.ROSE} />
            <BridgeStat label="Burn Multiple" value="1.13x" sub="vs Revenue" />
          </div>
          <Insight>Cash fell $87.5K despite $644K inflow — &quot;Other Indirect&quot; ($311.5K) is the dominant outflow to scrutinize next quarter.</Insight>
        </Card>
        <Card>
          <SectionTitle eyebrow="Ledger" title="Financial Log" />
          <div style={{ overflow: 'hidden', borderRadius: 10, border: `1px solid ${C.BORDER}` }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr 1fr', background: C.MUTED }}>
              <div style={{ padding: '8px 12px' }} />
              {finLog.cols.map((c, i) => (
                <div key={i} style={{ padding: '8px 10px', borderLeft: `1px solid ${C.BORDER}` }}>
                  <div style={{ fontFamily: F, fontSize: 9.5, fontWeight: 600, color: C.TEAL_MID, letterSpacing: '.02em' }}>{c.head}</div>
                  <div style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: C.EMERALD }}>{c.profit}</div>
                </div>
              ))}
            </div>
            {finLog.rows.map((r, ri) => {
              const emphasis = r === 'Profit' || r === 'Closing Cash';
              return (
                <div key={ri} style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr 1fr', borderTop: `1px solid ${C.MUTED}`, background: emphasis ? 'rgba(91,163,184,0.08)' : 'transparent' }}>
                  <div style={{ padding: '8px 12px', fontFamily: F, fontSize: 11.5, fontWeight: emphasis ? 700 : 500, color: emphasis ? C.FG1 : C.FG3 }}>{r}</div>
                  {finLog.cols.map((c, ci) => {
                    const v = c.vals[ri], neg = v.startsWith('-');
                    return <div key={ci} style={{ padding: '8px 10px', textAlign: 'right', borderLeft: `1px solid ${C.MUTED}`, fontFamily: F, fontSize: 11.5, fontWeight: emphasis ? 700 : 500, color: emphasis ? C.FG1 : neg ? C.ROSE : C.FG2, fontVariantNumeric: 'tabular-nums' }}>{v}</div>;
                  })}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: C.CYAN100, borderRadius: 12, border: `1px solid ${C.BORDER}` }}>
        <Lightbulb size={16} color={C.TEAL_MID} />
        <span style={{ fontFamily: F, fontSize: 13, color: C.INK }}>
          Strong revenue growth and improving margin trend. Focus on controlling COGS and labor costs to drive operating ROI into positive territory.
        </span>
      </div>
    </div>
  );
}

function BridgeStat({ label, value, color, sub }: { label: string; value: string; color?: string; sub?: string }) {
  return (
    <div style={{ border: `1px solid ${C.BORDER}`, borderRadius: 10, padding: '10px 12px' }}>
      <div style={{ fontFamily: F, fontSize: 10.5, color: C.FG3 }}>{label}</div>
      <div style={{ fontFamily: F, fontSize: 17, fontWeight: 700, color: color || C.FG1, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      {sub && <div style={{ fontFamily: F, fontSize: 10, color: C.FG4 }}>{sub}</div>}
    </div>
  );
}

// ─── INVENTORY TAB ─────────────────────────────────────────────────────────────
const INV_ROWS = [
  { idx: 1, name: 'Oat-milk latte',    icon: Milk,        unitsSold: '1,560', salesShare: '22.8%', avgQty: '1,780', closing: '240', soldAmt: '$49,920',  wasteAmt: '$1,240', wasteRate: '2.5%', margin: '55%' },
  { idx: 2, name: 'Matcha cake slice', icon: Cake,        unitsSold: '340',   salesShare: '9.1%',  avgQty: '520',   closing: '180', soldAmt: '$10,200',  wasteAmt: '$540',   wasteRate: '5.0%', margin: '22%' },
  { idx: 3, name: 'Almond croissant',  icon: Bread,       unitsSold: '1,840', salesShare: '26.9%', avgQty: '2,110', closing: '310', soldAmt: '$58,880',  wasteAmt: '$1,860', wasteRate: '3.1%', margin: '42%' },
  { idx: 4, name: 'Cold-brew 500ml',   icon: Coffee,      unitsSold: '620',   salesShare: '9.1%',  avgQty: '760',   closing: '160', soldAmt: '$9,920',   wasteAmt: '$360',   wasteRate: '1.8%', margin: '48%' },
  { idx: 5, name: 'Espresso blend',    icon: CoffeeBeans, unitsSold: '3,420', salesShare: '25.0%', avgQty: '3,780', closing: '520', soldAmt: '$102,600', wasteAmt: '$2,460', wasteRate: '2.4%', margin: '68%' },
  { idx: 6, name: 'Seasonal salad',    icon: Salad,       unitsSold: '840',   salesShare: '6.1%',  avgQty: '1,020', closing: '120', soldAmt: '$12,480',  wasteAmt: '$360',   wasteRate: '2.9%', margin: '38%' },
];
const PRODUCT_COLORS = ['#9AA67A', '#8A9F4D', '#A9805A', '#4A6E78', '#7C6A4A', '#6E8F5A'];

const STOCK_DISP = [
  { label: 'Sold',      value: 87.0, color: C.TEAL,      valueLabel: '6,620 u (87.0%)' },
  { label: 'Remaining', value: 10.8, color: C.SOFT_TEAL, valueLabel: '820 u (10.8%)' },
  { label: 'Waste',     value: 2.4,  color: C.ROSE,      valueLabel: '180 u (2.4%)' },
  { label: 'Damaged',   value: 0.5,  color: C.AMBER,     valueLabel: '40 u (0.5%)' },
  { label: 'Phantom',   value: 0.5,  color: C.VIOLET,    valueLabel: '40 u (0.5%)' },
];
const SUPPLIER_MIX = [
  { label: 'Local Suppliers',    value: 62, color: C.TEAL,  valueLabel: '62%' },
  { label: 'Regional Suppliers', value: 26, color: C.CYAN,  valueLabel: '26%' },
  { label: 'National Suppliers', value: 8,  color: C.AMBER, valueLabel: '8%' },
  { label: 'Imports',            value: 4,  color: C.ROSE,  valueLabel: '4%' },
];

function InventoryTab() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <KpiStrip labels={['Unit Sales', 'Capacity Utilization', 'Employee Productivity']} />
      <Card>
        <SectionTitle eyebrow="Inventory" title="Quarterly Inventory Overview" />
        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: 880 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '36px 1.6fr 0.9fr 0.9fr 1.1fr 1.1fr 1fr 1fr 0.9fr 0.8fr', background: C.MUTED, padding: '10px 14px', borderRadius: '8px 8px 0 0', fontFamily: F, fontSize: 9.5, fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', color: C.FG3 }}>
              <div>#</div><div>Product</div>
              <div style={{ textAlign: 'right' }}>Units Sold</div><div style={{ textAlign: 'right' }}>Sales Share</div>
              <div style={{ textAlign: 'right' }}>Avg Purchased Qty</div><div style={{ textAlign: 'right' }}>Closing Inventory</div>
              <div style={{ textAlign: 'right' }}>Sold Amount</div><div style={{ textAlign: 'right' }}>Waste Amount</div>
              <div style={{ textAlign: 'right' }}>Waste Rate</div><div style={{ textAlign: 'right' }}>Margin %</div>
            </div>
            {INV_ROWS.map((r, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '36px 1.6fr 0.9fr 0.9fr 1.1fr 1.1fr 1fr 1fr 0.9fr 0.8fr', padding: '12px 14px', borderTop: `1px solid ${C.MUTED}`, alignItems: 'center' }}>
                <div style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: C.FG3 }}>{r.idx}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <IconChip icon={r.icon} bg={PRODUCT_COLORS[i] + '22'} color={PRODUCT_COLORS[i]} iconSize={16} />
                  <span style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: C.FG1 }}>{r.name}</span>
                </div>
                {[r.unitsSold, r.salesShare, r.avgQty, r.closing, r.soldAmt, r.wasteAmt].map((v, vi) => (
                  <div key={vi} style={{ textAlign: 'right', fontFamily: F, fontSize: 12.5, fontWeight: vi === 0 ? 600 : 500, color: C.FG1, fontVariantNumeric: 'tabular-nums' }}>{v}</div>
                ))}
                <div style={{ textAlign: 'right', fontFamily: F, fontSize: 12.5, fontWeight: 600, color: parseFloat(r.wasteRate) >= 4 ? C.ROSE : C.EMERALD, fontVariantNumeric: 'tabular-nums' }}>{r.wasteRate}</div>
                <div style={{ textAlign: 'right', fontFamily: F, fontSize: 12.5, fontWeight: 600, color: parseInt(r.margin) > 40 ? C.EMERALD : C.FG1, fontVariantNumeric: 'tabular-nums' }}>{r.margin}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div style={{ display: 'grid', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 16 }}>
        <Card className="qr-lift">
          <Eyebrow>Stock Disposition</Eyebrow>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '14px 0 18px' }}>
            <Donut data={STOCK_DISP} centerTop="2.4%" centerSub="waste rate" size={150} />
          </div>
          <Legend data={STOCK_DISP} withValue />
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.MUTED}`, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: F, fontSize: 12, color: C.FG3 }}>
            <span>Total Inventory</span><span style={{ fontWeight: 700, fontSize: 14, color: C.FG1 }}>7,700 units</span>
          </div>
        </Card>

        <Card>
          <Eyebrow>Storage Utilization</Eyebrow>
          {/* bento: two stat cells */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
            {[
              { k: 'Used', v: '1,440', u: 'sq ft', s: '72% of capacity' },
              { k: 'Total capacity', v: '2,000', u: 'sq ft', s: ' ' },
            ].map((c, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.5)', border: `1px solid ${C.BORDER}`, borderRadius: 12, padding: '12px 14px' }}>
                <div style={{ fontFamily: F, fontSize: 11, color: C.FG3 }}>{c.k}</div>
                <div style={{ fontFamily: F, fontWeight: 700, fontSize: 20, color: C.FG1, fontVariantNumeric: 'tabular-nums' }}>{c.v} <span style={{ fontSize: 11, fontWeight: 500, color: C.FG4 }}>{c.u}</span></div>
                <div style={{ fontFamily: F, fontSize: 10, color: i === 0 ? C.TEAL_MID : C.FG4, fontWeight: i === 0 ? 600 : 400 }}>{c.s}</div>
              </div>
            ))}
          </div>
          {/* split track with marker (budget-card reference) */}
          <div style={{ position: 'relative', marginTop: 18, marginBottom: 4, height: 30 }}>
            <div style={{ position: 'absolute', left: '72%', top: -2, fontFamily: F, fontSize: 12, color: C.FG1, transform: 'translateX(8px)', whiteSpace: 'nowrap' }}>
              <span style={{ fontWeight: 700 }}>72%</span> <span style={{ color: C.FG3 }}>used</span>
            </div>
            <div style={{ position: 'absolute', left: '72%', top: 16, bottom: -8, width: 2, background: C.FG2 }} />
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: -8, height: 10, borderRadius: 6, overflow: 'hidden', background: C.MUTED, border: `1px solid ${C.BORDER}` }}>
              <div style={{ width: '72%', height: '100%', background: `linear-gradient(90deg, ${C.CYAN}, color-mix(in srgb, ${C.CYAN} 70%, white))` }} />
            </div>
          </div>
          {/* 2×2 detail grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 22 }}>
            {[
              { k: 'Peak Utilization', v: '78%', s: '1,560 sq ft' },
              { k: 'Extra Storage Cost', v: '$1,120', s: 'sq ft/unit' },
              { k: 'Avg. Inventory Left', v: '820 u', s: '70.8% of cap.' },
              { k: 'Phantom Stock', v: '40 u', s: '0.5% of inv.' },
            ].map((r, i) => (
              <div key={i} style={{ borderTop: `1px solid ${C.MUTED}`, paddingTop: 8 }}>
                <div style={{ fontFamily: F, fontSize: 10.5, color: C.FG3 }}>{r.k}</div>
                <div style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: C.FG1, fontVariantNumeric: 'tabular-nums' }}>{r.v}</div>
                <div style={{ fontFamily: F, fontSize: 9.5, color: C.FG4 }}>{r.s}</div>
              </div>
            ))}
          </div>
        </Card>

        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>
        <Card>
          <Eyebrow>Inventory Unit Economics</Eyebrow>
          <div style={{ display: 'flex', alignItems: 'stretch', gap: 8, marginTop: 18, marginBottom: 20 }}>
            <UnitEconBlock label="Planned Margin" value="48.0%" color={'var(--cyan-deep)'} />
            <span style={{ fontFamily: F, fontSize: 16, color: C.FG4, alignSelf: 'center' }}>=</span>
            <UnitEconBlock label="Realized Margin" value="44.1%" color={C.CYAN} />
            <span style={{ fontFamily: F, fontSize: 16, color: C.FG4, alignSelf: 'center' }}>+</span>
            <UnitEconBlock label="Margin Lost to Waste" value="3.9%" color={C.ROSE} small />
          </div>
          <div style={{ fontFamily: F, fontSize: 11, color: C.FG3, marginBottom: 6 }}>Margin Flow (% of Sales)</div>
          <MarginFlowChart />
        </Card>

        <Card className="qr-lift">
          <Eyebrow>Supplier & Source Mix</Eyebrow>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '14px 0 18px' }}>
            <Donut data={SUPPLIER_MIX} size={150} />
          </div>
          <Legend data={SUPPLIER_MIX} withValue />
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { k: 'Avg. Distance to Source', v: '126 miles', s: '' },
              { k: 'Estimated Distance Cost', v: '$3,840', s: '(7% of COGS)' },
              { k: 'Top Sourcing Risk', v: 'Low', s: '' },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: `1px solid ${C.MUTED}`, paddingTop: 8 }}>
                <span style={{ fontFamily: F, fontSize: 11.5, color: C.FG3 }}>{r.k}</span>
                <span style={{ fontFamily: F, fontSize: 12.5, fontWeight: 700, color: r.v === 'Low' ? C.EMERALD : C.FG1 }}>{r.v} {r.s && <span style={{ fontWeight: 400, fontSize: 10, color: C.FG4 }}>{r.s}</span>}</span>
              </div>
            ))}
          </div>
        </Card>
        </div>
      </div>
    </div>
  );
}

// Margin Flow — proper bar chart with Y-axis (%) ticks + X baseline.
function MarginFlowChart() {
  const data = [
    { k: ['Planned', 'Margin'], v: 48.0, color: 'var(--cyan-deep)', grad: 'qr-mf-0' },
    { k: ['Realized', 'Margin'], v: 44.1, color: C.CYAN, grad: 'qr-mf-1' },
    { k: ['Lost to', 'Waste'], v: 3.9, color: C.ROSE, grad: 'qr-mf-2' },
  ];
  const W = 400, H = 200, pad = { t: 18, r: 10, b: 34, l: 34 };
  const yMax = 50, ticks = [0, 10, 20, 30, 40, 50];
  const yAt = (v: number) => pad.t + (1 - v / yMax) * (H - pad.t - pad.b);
  const plotW = W - pad.l - pad.r, slot = plotW / data.length, barW = slot * 0.42;
  const cxAt = (i: number) => pad.l + slot * (i + 0.5);
  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Bar chart, Margin Flow as percent of sales: Planned Margin 48.0%, Realized Margin 44.1%, Margin Lost to Waste 3.9%.">
      <defs>
        {data.map(d => (
          <linearGradient key={d.grad} id={d.grad} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={solidStop(d.color)} stopOpacity="0.95" />
            <stop offset="100%" stopColor={solidStop(d.color)} stopOpacity="0.5" />
          </linearGradient>
        ))}
      </defs>
      {/* Y grid + axis labels */}
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={pad.l} x2={W - pad.r} y1={yAt(t)} y2={yAt(t)} stroke={t === 0 ? C.FG4 : C.BORDER} strokeWidth={t === 0 ? 1.3 : 1} strokeDasharray={t === 0 ? undefined : '1,5'} opacity={t === 0 ? 1 : 0.7} />
          <text x={pad.l - 7} y={yAt(t) + 3.5} textAnchor="end" fontSize="9" fill={C.FG4} fontFamily={F} style={{ fontVariantNumeric: 'tabular-nums' }}>{t}%</text>
        </g>
      ))}
      {/* Y axis line */}
      <line x1={pad.l} x2={pad.l} y1={pad.t} y2={yAt(0)} stroke={C.FG4} strokeWidth="1.3" />
      {data.map((d, i) => {
        const y = yAt(d.v), h = yAt(0) - y, x = cxAt(i) - barW / 2;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={h} fill={`url(#${d.grad})`} rx="6" />
            <text x={cxAt(i)} y={y - 7} textAnchor="middle" fontSize="11" fontWeight="700" fill={d.color} fontFamily={F}>{d.v}%</text>
            {d.k.map((ln, li) => <text key={li} x={cxAt(i)} y={yAt(0) + 14 + li * 11} textAnchor="middle" fontSize="9.5" fill={C.FG4} fontFamily={F}>{ln}</text>)}
          </g>
        );
      })}
    </svg>
  );
}

function UnitEconBlock({ label, value, color, small }: { label: string; value: string; color: string; small?: boolean }) {
  return (
    <div style={{ flex: 1, textAlign: 'center', padding: '10px 4px', background: `color-mix(in srgb, ${color} 10%, transparent)`, borderRadius: 10, border: `1px solid color-mix(in srgb, ${color} 22%, transparent)` }}>
      <div style={{ fontFamily: F, fontWeight: 700, fontSize: small ? 16 : 18, color }}>{value}</div>
      <div style={{ fontFamily: F, fontSize: 9, color: C.FG3, marginTop: 2, lineHeight: 1.2 }}>{label}</div>
    </div>
  );
}

// ─── MARKET VIEW TAB ───────────────────────────────────────────────────────────
const MARKET_SHARE = [
  { label: 'Team A', value: 28, color: C.CYAN,     valueLabel: '28%', rank: 'Rank 1' },
  { label: 'Team B', value: 25, color: C.TEAL_MID, valueLabel: '25%', rank: 'Rank 2' },
  { label: 'Team C', value: 22, color: C.AMBER,    valueLabel: '22%', rank: 'Rank 3' },
  { label: 'Team D', value: 15, color: C.VIOLET,   valueLabel: '15%', rank: 'Rank 4' },
  { label: 'Others', value: 10, color: C.FG4,      valueLabel: '10%', rank: 'Rank 5' },
];
const SEGMENTS = [
  { name: 'Regular', icon: Users,  revShare: '48%', revVal: '$209K', custShare: '52%', custVal: '1,224', retention: '61%', aov: '$14.10', color: C.CYAN },
  { name: 'Value',   icon: Wallet, revShare: '32%', revVal: '$206K', custShare: '30%', custVal: '786',   retention: '67%', aov: '$13.20', color: C.AMBER },
  { name: 'Premium', icon: Star,   revShare: '20%', revVal: '$129K', custShare: '18%', custVal: '440',   retention: '78%', aov: '$24.60', color: C.VIOLET },
];
const LOCATIONS = [
  { loc: 'Downtown', size: '$980K', cust: '1,126', change: '+10%', pos: true },
  { loc: 'Midtown',  size: '$660K', cust: '702',   change: '+8%',  pos: true },
  { loc: 'Uptown',   size: '$420K', cust: '432',   change: '-2%',  pos: false },
  { loc: 'Suburban', size: '$260K', cust: '288',   change: '+5%',  pos: true },
];

function MarketTab() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <KpiStrip labels={['Total Customers', 'Customer Retention', 'Customer Satisfaction']} />
      <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 16 }}>
        <Card className="qr-lift">
          <SectionTitle eyebrow="Acquisition" title="Customer Acquisition Funnel" sub="Q1 2026 Performance" right={
            <div style={{ textAlign: 'center', border: `1px solid ${C.BORDER}`, borderRadius: 10, padding: '8px 14px' }}>
              <div style={{ fontFamily: F, fontSize: 17, fontWeight: 700, color: C.TEAL_MID }}>$6.40</div>
              <div style={{ fontFamily: F, fontSize: 9.5, color: C.FG3 }}>Cost per Acquired Customer</div>
              <div style={{ marginTop: 2 }}><Delta label="-8% vs Q4 2025" positive={false} /></div>
            </div>
          } />
          <Funnel />
          <Insight>Largest drop-off is Visits → Orders (18% conversion) — the highest-leverage point to lift acquisition efficiency.</Insight>
        </Card>
        <Card className="qr-lift">
          <SectionTitle
            eyebrow="Competition"
            title="Team Positioning"
            sub="Market Positioning Map"
            right={<IconChip icon={Map} />}
          />
          <PositioningMap />
          <Insight>Team A leads on both price and volume (Premium quadrant); standard players cluster low-left with room to differentiate.</Insight>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card className="qr-lift">
          <SectionTitle eyebrow="Market Share" title="Market Share Distribution" />
          <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 20, alignItems: 'center' }}>
            <Donut data={MARKET_SHARE} centerTop="$2.30M" centerSub="Total Market" size={160} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {MARKET_SHARE.map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: F, fontSize: 12.5, color: C.FG2 }}>
                    <LegendTick color={rampFill(i)} />
                    <span style={{ color: C.FG4, fontSize: 11 }}>{m.rank}</span> {m.label}
                  </span>
                  <span style={{ fontFamily: F, fontWeight: 700, fontSize: 12.5, color: C.FG1 }}>{m.valueLabel}</span>
                </div>
              ))}
            </div>
          </div>
          <Insight>You lead the market at 28% share — a 3pt edge over Team B — within a fragmented $2.30M field.</Insight>
        </Card>
        <Card style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span style={{ fontFamily: F, fontWeight: 600, fontSize: 16, color: C.FG1 }}>TAM</span>
            <Info size={13} color={C.FG4} />
          </div>
          <div style={{ fontFamily: F, fontWeight: 800, fontSize: 52, color: C.TEAL_MID, letterSpacing: '-.02em', lineHeight: 1 }}>$2.30M</div>
          <p style={{ fontFamily: F, fontSize: 14, color: C.FG2, lineHeight: 1.55, margin: '14px 0 0', maxWidth: 380 }}>
            Total Addressable Market (TAM) represents the total annual revenue opportunity available in the market.
          </p>
        </Card>
      </div>

      <Card>
        <SectionTitle eyebrow="Market" title="Market Snapshot" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {[
            { icon: TrendingUp, k: 'Market Growth', v: '+7.4%', d: 'vs Q4 2025', pos: true },
            { icon: Users, k: 'Competitive Intensity', v: 'High', d: '8.3 / 10' },
            { icon: DollarSign, k: 'Price Index', v: '102', d: 'vs Market Avg' },
            { icon: PieChart, k: 'Market Total Spend', v: '$2.30M', d: 'Q1 2026' },
            { icon: Wallet, k: 'Your Spend Share', v: '28%', d: 'vs Market' },
          ].map((s, i) => (
            <div key={i} style={{ borderLeft: i ? `1px solid ${C.MUTED}` : 'none', paddingLeft: i ? 14 : 0 }}>
              <IconChip icon={s.icon} size={32} iconSize={16} />
              <div style={{ fontFamily: F, fontSize: 11, color: C.FG3, marginTop: 10 }}>{s.k}</div>
              <div style={{ fontFamily: F, fontWeight: 700, fontSize: 18, color: C.FG1, margin: '2px 0' }}>{s.v}</div>
              <div style={{ fontFamily: F, fontSize: 10.5, color: s.pos ? C.EMERALD : C.FG4, fontWeight: s.pos ? 600 : 400 }}>{s.pos ? '↗ ' : ''}{s.d}</div>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
        <Card>
          <SectionTitle eyebrow="Segments" title="Segment Mix & Retention" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr 1.1fr 0.9fr 0.8fr', padding: '0 4px 8px', fontFamily: F, fontSize: 9.5, fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', color: C.FG3, borderBottom: `1px solid ${C.BORDER}` }}>
            <div>Segment</div><div style={{ textAlign: 'right' }}>Revenue Share</div><div style={{ textAlign: 'right' }}>Customer Share</div><div style={{ textAlign: 'right' }}>Retention Rate</div><div style={{ textAlign: 'right' }}>AOV</div>
          </div>
          {SEGMENTS.map((s, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr 1.1fr 0.9fr 0.8fr', padding: '12px 4px', borderTop: i ? `1px solid ${C.MUTED}` : 'none', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <IconChip icon={s.icon} bg={s.color + '22'} color={s.color} size={28} iconSize={14} />
                <span style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: C.FG1 }}>{s.name}</span>
              </div>
              <div style={{ textAlign: 'right' }}><div style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: C.FG1 }}>{s.revShare}</div><div style={{ fontFamily: F, fontSize: 10.5, color: C.FG4 }}>{s.revVal}</div></div>
              <div style={{ textAlign: 'right' }}><div style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: C.FG1 }}>{s.custShare}</div><div style={{ fontFamily: F, fontSize: 10.5, color: C.FG4 }}>{s.custVal}</div></div>
              <div style={{ textAlign: 'right', fontFamily: F, fontSize: 13, fontWeight: 600, color: C.EMERALD }}>{s.retention}</div>
              <div style={{ textAlign: 'right', fontFamily: F, fontSize: 13, fontWeight: 700, color: C.FG1 }}>{s.aov}</div>
            </div>
          ))}
        </Card>
        <Card>
          <SectionTitle eyebrow="Geography" title="Location Performance" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.1fr', padding: '0 4px 8px', fontFamily: F, fontSize: 9.5, fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', color: C.FG3, borderBottom: `1px solid ${C.BORDER}` }}>
            <div>Location</div><div style={{ textAlign: 'right' }}>Market Size</div><div style={{ textAlign: 'right' }}>Your Customers</div><div style={{ textAlign: 'right' }}>Change vs Q4 2025</div>
          </div>
          {LOCATIONS.map((l, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.1fr', padding: '12px 4px', borderTop: i ? `1px solid ${C.MUTED}` : 'none', alignItems: 'center' }}>
              <div style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: C.FG1 }}>{l.loc}</div>
              <div style={{ textAlign: 'right', fontFamily: F, fontSize: 12.5, fontWeight: 600, color: C.FG1 }}>{l.size}</div>
              <div style={{ textAlign: 'right', fontFamily: F, fontSize: 12.5, color: C.FG2 }}>{l.cust}</div>
              <div style={{ textAlign: 'right' }}><Delta label={l.change} positive={l.pos} /></div>
            </div>
          ))}
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.BORDER}`, display: 'flex', justifyContent: 'space-between', fontFamily: F, fontSize: 11, color: C.FG3 }}>
            <span>Total market spending: <span style={{ fontWeight: 700, color: C.FG1 }}>$2.30M</span></span>
            <span>Market customer satisfaction: <span style={{ fontWeight: 700, color: C.FG1 }}>72%</span></span>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function QuarterlyReport({ data }: { data?: QuarterlyReportData } = {}) {
  const navigate = useAppNavigate();
  const [tab, setTab] = useState<TabId>('Overview');

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('tab');
    const ids: TabId[] = ['Overview', 'Finance', 'Inventory', 'Market View'];
    if ((ids as string[]).includes(t ?? '')) {
      setTab(t as TabId);
    }
  }, []);

  return (
    <PageTransition>
      <GridBackground className="flex flex-col">
        <GameHeader />
        <style>{QR_CSS}</style>
        <div className="max-w-[1312px] mx-auto px-6 pb-24 pt-6 w-full">

          {/* Page header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h1 style={{ fontFamily: F, fontWeight: 700, fontSize: 32, letterSpacing: '-.01em', color: C.FG1, lineHeight: 1.12, margin: 0 }}>Quarterly Performance Report</h1>
              <p style={{ fontFamily: F, color: C.FG3, fontSize: 14, fontWeight: 500, margin: '4px 0 0' }}>{data?.monthsLabel ?? 'Months 1–3 · Quarter 1 · 2026'}</p>
            </div>
            <TabBar
              tabs={[{ id: 'Report', label: 'Report' }, { id: 'Decisions', label: 'Decisions' }]}
              activeTab="Report"
              onChange={(id) => id === 'Decisions' && navigate('/ref/game/performance-report')}
            />
          </div>

          {/* Tab bar */}
          <div style={{ marginBottom: 16 }}>
            <TabBar tabs={TAB_ITEMS} activeTab={tab} onChange={(id) => setTab(id as TabId)} />
          </div>

          {/* Tab body */}
          {tab === 'Overview'    && <OverviewTab data={data} />}
          {tab === 'Finance'     && <FinanceTab data={data} />}
          {tab === 'Inventory'   && <InventoryTab />}
          {tab === 'Market View' && <MarketTab />}

          {/* Footer note — source + last-updated */}
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, fontFamily: 'var(--sv-font-mono, monospace)', fontSize: 11, color: C.FG4 }}>
            <span>Source: Startup Valley simulation engine · Q1 2026 close</span>
            <span>Last updated: 2026-03-31 23:59 UTC</span>
          </div>

        </div>
      </GridBackground>
    </PageTransition>
  );
}

