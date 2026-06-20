'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { GridBackground } from './GridBackground';
import { GameHeader } from './GameHeader';
import { PageTransition } from './PageTransition';
import { TabBar } from './TabBar';
import {
  TrendingUp, Users, Wallet, Activity, DollarSign, Crown, Sliders, Star,
  RefreshCw, Calendar, Box, Package, Trash2, Landmark, Zap, Check,
  Coffee, Milk, CoffeeBeans, Bread, Cake, Lightbulb,
  Sun, Cloud, Heart, Settings, BarChart3,
} from './PixelIcons';
import { ArrowRight } from 'lucide-react';

// ─── Cyan single-accent chart theme (per /cyan-graphs, shared w/ QuarterlyReport) ─
const F = "'Outfit', system-ui, sans-serif";
const C = {
  INK:      'var(--game-dark)',
  TEAL:     'var(--color-chart-2)',
  CYAN:     'var(--color-chart-1)',
  TEAL_MID: 'var(--game-teal-mid)',
  EMERALD:  'var(--game-positive)',
  ROSE:     'var(--color-chart-5)',
  NEG:      'var(--game-negative)',
  AMBER:    'var(--color-chart-4)',
  VIOLET:   'var(--color-chart-3)',
  SOFT_TEAL:'var(--color-chart-6)',
  CYAN_DEEP:'var(--cyan-deep)',
  BORDER:   'var(--color-border)',
  MUTED:    'var(--muted)',
  FG1:      'var(--game-text)',
  FG2:      'var(--text-body)',
  FG3:      'var(--game-text-secondary)',
  FG4:      'var(--color-muted-foreground)',
  CYAN100:  'var(--cyan-tint)',
  CARD:     'var(--game-surface)',
  CARD_BORDER: 'var(--game-card-border)',
};

// Figma html-to-design capture can't resolve CSS var() inside SVG gradient stops —
// map chart tokens to literal hex (kept in sync w/ theme.css). On-screen identical.
const GRADIENT_HEX: Record<string, string> = {
  'var(--color-chart-1)': '#00C1EB',
  'var(--color-chart-2)': '#003D47',
  'var(--color-chart-5)': '#C0392B',
  'var(--color-chart-6)': '#4DB5B6',
  'var(--game-positive)': '#156162',
  'var(--game-negative)': '#c65252',
  'var(--cyan-deep)': '#00A0C2',
};
const solidStop = (c: string) => GRADIENT_HEX[c] ?? c;

const PAT_GREY = 'var(--color-muted-foreground)';
const PAT_CYAN = 'var(--color-chart-1)';
const CYAN_RAMP = [PAT_CYAN, 'var(--cyan-deep)', 'var(--color-chart-2)', 'var(--color-chart-6)', PAT_GREY];
const rampFill = (i: number) => CYAN_RAMP[i % CYAN_RAMP.length];

// Catmull-Rom → cubic bézier: smooth monotone curve.
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

function LegendTick({ color }: { color: string }) {
  return <span style={{ width: 4, height: 16, borderRadius: 3, background: color, flexShrink: 0 }} />;
}

// ─── Cursor-following tooltip ──────────────────────────────────────────────────
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

const QR_CSS = `
.mr-lift{transition:transform .2s ease, box-shadow .2s ease;}
.mr-lift:hover{transform:translateY(-3px);box-shadow:0 16px 36px rgba(0,44,51,0.13);}
.mr-seg{transition:filter .16s ease;cursor:pointer;}
.mr-row{transition:background .15s ease;}
.mr-row:hover{background:color-mix(in srgb, var(--color-chart-1) 5%, transparent);}
`;

// ─── Shared layout primitives ──────────────────────────────────────────────────
function Card({ children, style = {}, pad = 20, className = 'mr-lift' }: { children: React.ReactNode; style?: React.CSSProperties; pad?: number; className?: string }) {
  return (
    <div className={className} style={{ background: C.CARD, border: C.CARD_BORDER, borderRadius: 16, padding: pad, boxShadow: 'var(--shadow-elev-1)', ...style }}>{children}</div>
  );
}

function CardTitle({ title, sub, right }: { title: string; sub?: string; right?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, marginBottom: 14 }}>
      <div>
        <div style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: C.FG1, letterSpacing: '-.01em' }}>{title}</div>
        {sub && <div style={{ fontFamily: F, fontSize: 11.5, color: C.FG3, marginTop: 2 }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}

function Delta({ label, positive, neutral }: { label: string; positive?: boolean; neutral?: boolean }) {
  const col = neutral ? C.FG3 : positive ? C.EMERALD : C.NEG;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontFamily: F, fontWeight: 600, fontSize: 11, color: col, fontVariantNumeric: 'tabular-nums' }}>
      {!neutral && (positive
        ? <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        : <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2.5 2.5L9.5 9.5M9.5 9.5H4M9.5 9.5V4" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>)}
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

// ─── Asset placeholder slot — reserves space for art to be generated ────────────
// Pixel-character portraits (customer segments + funnel stages) are not in the
// icon set; drop generated assets here. Dashed cyan frame keeps layout stable.
function AssetSlot({ w, h, label, round, style = {} }: { w: number; h: number; label?: string; round?: boolean; style?: React.CSSProperties }) {
  return (
    <div
      data-asset-slot={label || true}
      style={{
        width: w, height: h, borderRadius: round ? '50%' : 12, flexShrink: 0,
        border: '1.5px dashed color-mix(in srgb, var(--color-chart-1) 55%, transparent)',
        background: 'color-mix(in srgb, var(--color-chart-1) 7%, transparent)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 3, textAlign: 'center', padding: 5, overflow: 'hidden', ...style,
      }}
    >
      <svg width={Math.min(20, h * 0.32)} height={Math.min(20, h * 0.32)} viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="2" stroke={solidStop(C.CYAN)} strokeWidth="1.6" />
        <circle cx="8.5" cy="9" r="1.8" fill={solidStop(C.CYAN)} />
        <path d="M5 17l4.5-4.5L13 16l3-3 3 4" stroke={solidStop(C.CYAN)} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label && <span style={{ fontFamily: F, fontSize: 8, fontWeight: 600, color: C.TEAL_MID, lineHeight: 1.15, letterSpacing: '.02em' }}>{label}</span>}
    </div>
  );
}

// Segment mascot (shared art set from the Annual Report customer-segment snapshot).
function Mascot({ src, size = 64 }: { src: string; size?: number }) {
  const w = Math.round(size * 0.62);
  return (
    <div style={{ height: size, width: w, overflow: 'hidden', flexShrink: 0 }}>
      <Image src={src} alt="" width={1103} height={1938} style={{ display: 'block', width: w, height: Math.round(size * 1.15), objectFit: 'contain', objectPosition: 'center top' }} />
    </div>
  );
}

// ─── Multi-line trend (Revenue vs Costs) ───────────────────────────────────────
const TREND = {
  x: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12'],
  revenue: [12000, 13500, 15000, 14200, 16800, 17400, 19200, 19200, 18400, 21000, 22800, 24500],
  costs:   [9800, 10400, 11200, 11000, 12000, 12300, 12800, 11200, 11000, 11600, 12000, 12400],
  profit:  [2200, 3100, 3800, 3200, 4800, 5100, 6400, 8000, 7400, 9400, 10800, 12100],
};
function RevenueCostsChart() {
  const W = 600, H = 240, pad = { t: 18, r: 14, b: 30, l: 44 };
  const { x, revenue, costs, profit } = TREND;
  const maxY = 30000;
  const xAt = (i: number) => pad.l + (i / (x.length - 1)) * (W - pad.l - pad.r);
  const yAt = (v: number) => pad.t + (1 - v / maxY) * (H - pad.t - pad.b);
  const ticks = [3000, 8000, 15000, 22000, 30000];
  const line = (d: number[]) => smoothPath(d.map((v, i) => [xAt(i), yAt(v)] as [number, number]));
  const areaFill = `${line(revenue)} L${xAt(x.length - 1)},${yAt(0)} L${xAt(0)},${yAt(0)} Z`;
  const series = [
    { name: 'Revenue', color: C.CYAN, data: revenue, focus: true },
    { name: 'Costs', color: C.ROSE, data: costs },
    { name: 'Profit', color: C.EMERALD, data: profit },
  ];
  const [hi, setHi] = useState<number | null>(null);
  const { tip, show, hide } = useTip();
  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const vx = ((e.clientX - r.left) / r.width) * W;
    let idx = 0, best = Infinity;
    x.forEach((_, i) => { const d = Math.abs(xAt(i) - vx); if (d < best) { best = d; idx = i; } });
    setHi(idx);
    show(e, x[idx], `Rev $${revenue[idx].toLocaleString()} · Profit $${profit[idx].toLocaleString()}`);
  };
  return (
    <div style={{ position: 'relative' }}>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }} role="img"
        aria-label="Line chart: monthly revenue, costs and profit over 12 months. Revenue rises to $24,500 in M12 with profit widening as costs stay flat."
        onMouseMove={onMove} onMouseLeave={() => { setHi(null); hide(); }}>
        <defs>
          <linearGradient id="mr-rev-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={solidStop(C.CYAN)} stopOpacity="0.18" />
            <stop offset="100%" stopColor={solidStop(C.CYAN)} stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={pad.l} x2={W - pad.r} y1={yAt(t)} y2={yAt(t)} stroke={C.BORDER} strokeWidth="1" strokeDasharray="1,5" opacity="0.7" />
            <text x={pad.l - 8} y={yAt(t) + 4} textAnchor="end" fontSize="9.5" fill={C.FG4} fontFamily={F} style={{ fontVariantNumeric: 'tabular-nums' }}>${t / 1000}k</text>
          </g>
        ))}
        {/* axes */}
        <line x1={pad.l} y1={pad.t} x2={pad.l} y2={H - pad.b} stroke={C.FG4} strokeWidth="1.2" />
        <line x1={pad.l} y1={H - pad.b} x2={W - pad.r} y2={H - pad.b} stroke={C.FG4} strokeWidth="1.2" />
        {x.map((l, i) => <text key={i} x={xAt(i)} y={H - 10} textAnchor="middle" fontSize="9.5" fill={hi === i ? C.CYAN : C.FG4} fontWeight={hi === i ? 700 : 400} fontFamily={F}>{l}</text>)}
        {hi !== null && <line x1={xAt(hi)} x2={xAt(hi)} y1={pad.t} y2={H - pad.b} stroke={C.FG4} strokeWidth="1" strokeDasharray="3,3" />}
        <path d={areaFill} fill="url(#mr-rev-fill)" stroke="none" />
        {series.map((s, si) => (
          <g key={si}>
            <path d={line(s.data)} fill="none" stroke={s.color} strokeWidth={s.focus ? 2.4 : 1.8} strokeLinecap="round" strokeLinejoin="round" opacity={s.focus ? 1 : 0.9} />
            {hi !== null && <circle cx={xAt(hi)} cy={yAt(s.data[hi])} r={s.focus ? 5 : 3.5} fill={s.focus ? C.CYAN : s.color} stroke="var(--color-card)" strokeWidth="2" />}
          </g>
        ))}
      </svg>
      <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
        {series.map((s, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: F, fontSize: 11.5, color: C.FG3 }}>
            <span style={{ width: 9, height: 9, borderRadius: 99, background: s.color }} />{s.name}
          </span>
        ))}
      </div>
      <Tooltip tip={tip} />
    </div>
  );
}

// ─── Donut ─────────────────────────────────────────────────────────────────────
function Donut({ data, centerTop, centerSub, size = 150, thickness = 24 }: {
  data: { label: string; value: number; valueLabel?: string }[];
  centerTop?: string; centerSub?: string; size?: number; thickness?: number;
}) {
  const cx = size / 2, cy = size / 2, R = size / 2 - 4, r = R - thickness;
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
  return (
    <>
      <svg width={size} height={size} style={{ overflow: 'visible' }} role="img"
        aria-label={`Donut chart: ${data.map(d => `${d.label} ${d.valueLabel || d.value}`).join(', ')}.`}>
        {arcs.map((a, i) => (
          <path key={i} d={a.path} className="mr-seg" fill={rampFill(i)}
            stroke={hi === i ? PAT_CYAN : 'var(--color-card)'} strokeWidth={hi === i ? 2 : 1.5}
            style={{ filter: hi === i ? 'drop-shadow(0 0 6px color-mix(in srgb, var(--color-chart-1) 55%, transparent))' : 'none', opacity: hi === null || hi === i ? 1 : 0.55 }}
            onMouseEnter={() => setHi(i)} onMouseMove={(e) => show(e, a.label, a.valueLabel || String(a.value))} onMouseLeave={() => { setHi(null); hide(); }} />
        ))}
        {centerTop && <text x={cx} y={centerSub ? cy - 2 : cy + 5} textAnchor="middle" fontFamily={F} fontWeight="700" fontSize={18} fill={C.FG1}>{centerTop}</text>}
        {centerSub && <text x={cx} y={cy + 14} textAnchor="middle" fontFamily={F} fontSize="9" fill={C.FG3} letterSpacing="0.04em">{centerSub}</text>}
      </svg>
      <Tooltip tip={tip} />
    </>
  );
}

function DonutLegend({ data }: { data: { label: string; valueLabel: string }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: F, fontSize: 12, color: C.FG2 }}>
            <LegendTick color={rampFill(i)} />{d.label}
          </span>
          <span style={{ fontFamily: F, fontWeight: 700, fontSize: 12, color: C.FG1, fontVariantNumeric: 'tabular-nums' }}>{d.valueLabel}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Radial retention ring (single value) ──────────────────────────────────────
function RingGauge({ value, color = C.CYAN, size = 110 }: { value: number; color?: string; size?: number }) {
  const cx = size / 2, cy = size / 2, R = size / 2 - 5, r = R - 11;
  const sweep = (value / 100) * Math.PI * 2;
  const a0 = -Math.PI / 2, a1 = a0 + sweep, large = sweep > Math.PI ? 1 : 0;
  const f = (n: number) => Number(n.toFixed(4));
  const arc = (s: number, e: number, rad: number) => {
    const x0 = f(cx + Math.cos(s) * rad), y0 = f(cy + Math.sin(s) * rad);
    const x1 = f(cx + Math.cos(e) * rad), y1 = f(cy + Math.sin(e) * rad);
    return `${x0},${y0} A${rad},${rad} 0 ${large} 1 ${x1},${y1}`;
  };
  const fullArc = (rad: number) => {
    const x0 = f(cx + Math.cos(a0) * rad), y0 = f(cy + Math.sin(a0) * rad);
    const x1 = f(cx + Math.cos(a0 + Math.PI * 1.999) * rad), y1 = f(cy + Math.sin(a0 + Math.PI * 1.999) * rad);
    return `${x0},${y0} A${rad},${rad} 0 1 1 ${x1},${y1}`;
  };
  const ringW = R - r;
  const mid = (R + r) / 2;
  return (
    <svg width={size} height={size} role="img" aria-label={`Retention ${value}%`}>
      <path d={`M${fullArc(mid)}`} fill="none" stroke={C.BORDER} strokeWidth={ringW} strokeLinecap="round" opacity="0.5" />
      <path d={`M${arc(a0, a1, mid)}`} fill="none" stroke={color} strokeWidth={ringW} strokeLinecap="round" />
      <text x={cx} y={cy - 1} textAnchor="middle" fontFamily={F} fontWeight="700" fontSize="22" fill={C.FG1}>{value}%</text>
      <text x={cx} y={cy + 15} textAnchor="middle" fontFamily={F} fontSize="9" fill={C.FG3}>retention</text>
    </svg>
  );
}

// ─── Vertical-fade bar gradients ───────────────────────────────────────────────
function BarGradients() {
  const g = (id: string, c: string) => (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1" key={id}>
      <stop offset="0%" stopColor={solidStop(c)} stopOpacity="0.95" />
      <stop offset="100%" stopColor={solidStop(c)} stopOpacity="0.5" />
    </linearGradient>
  );
  return <defs>{g('mr-bar-cyan', C.CYAN)}{g('mr-bar-rose', C.ROSE)}{g('mr-bar-teal', C.TEAL)}{g('mr-bar-deep', C.CYAN_DEEP)}</defs>;
}

// Legend row for the axed charts.
function ChartLegend({ items }: { items: { name: string; color: string; bar?: boolean }[] }) {
  return (
    <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
      {items.map((s, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: F, fontSize: 11.5, color: C.FG3 }}>
          <span style={{ width: 10, height: 10, borderRadius: s.bar ? 2 : 99, background: s.color }} />{s.name}
        </span>
      ))}
    </div>
  );
}

// ─── Footfall — area line with X/Y axes (visitors per month) ────────────────────
function FootfallChart() {
  const labels = ['M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12'];
  const data = [1800, 1950, 2100, 2000, 2200, 2300, 2400, 2548];
  const W = 540, H = 170, pad = { t: 14, r: 14, b: 26, l: 40 };
  const minY = 1500, maxY = 3000, ticks = [1500, 2000, 2500, 3000];
  const xAt = (i: number) => pad.l + (i / (labels.length - 1)) * (W - pad.l - pad.r);
  const yAt = (v: number) => pad.t + (1 - (v - minY) / (maxY - minY)) * (H - pad.t - pad.b);
  const last = labels.length - 1;
  const line = smoothPath(data.map((v, i) => [xAt(i), yAt(v)] as [number, number]));
  const area = `${line} L${xAt(last)},${yAt(minY)} L${xAt(0)},${yAt(minY)} Z`;
  const [hi, setHi] = useState<number | null>(null);
  const { tip, show, hide } = useTip();
  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const vx = ((e.clientX - r.left) / r.width) * W;
    let idx = 0, best = Infinity;
    labels.forEach((_, i) => { const d = Math.abs(xAt(i) - vx); if (d < best) { best = d; idx = i; } });
    setHi(idx); show(e, labels[idx], `${data[idx].toLocaleString()} visitors`);
  };
  return (
    <div>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }} role="img"
        aria-label="Footfall area chart: monthly customer visits rising from 1,800 (M5) to 2,548 (M12)."
        onMouseMove={onMove} onMouseLeave={() => { setHi(null); hide(); }}>
        <defs>
          <linearGradient id="mr-foot" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={solidStop(C.CYAN)} stopOpacity="0.2" />
            <stop offset="100%" stopColor={solidStop(C.CYAN)} stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={pad.l} x2={W - pad.r} y1={yAt(t)} y2={yAt(t)} stroke={C.BORDER} strokeWidth="1" strokeDasharray="1,5" opacity="0.7" />
            <text x={pad.l - 8} y={yAt(t) + 4} textAnchor="end" fontSize="9.5" fill={C.FG4} fontFamily={F} style={{ fontVariantNumeric: 'tabular-nums' }}>{(t / 1000).toFixed(1)}k</text>
          </g>
        ))}
        {/* axes */}
        <line x1={pad.l} y1={pad.t} x2={pad.l} y2={H - pad.b} stroke={C.FG4} strokeWidth="1.2" />
        <line x1={pad.l} y1={H - pad.b} x2={W - pad.r} y2={H - pad.b} stroke={C.FG4} strokeWidth="1.2" />
        {labels.map((l, i) => <text key={i} x={xAt(i)} y={H - 8} textAnchor="middle" fontSize="9.5" fill={hi === i ? C.CYAN : C.FG4} fontWeight={hi === i ? 700 : 400} fontFamily={F}>{l}</text>)}
        {hi !== null && <line x1={xAt(hi)} x2={xAt(hi)} y1={pad.t} y2={H - pad.b} stroke={C.FG4} strokeWidth="1" strokeDasharray="3,3" />}
        <path d={area} fill="url(#mr-foot)" />
        <path d={line} fill="none" stroke={C.CYAN} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        {hi !== null && <circle cx={xAt(hi)} cy={yAt(data[hi])} r="5" fill={C.CYAN} stroke="var(--color-card)" strokeWidth="2" />}
      </svg>
      <ChartLegend items={[{ name: 'Visitors', color: C.CYAN }]} />
      <Tooltip tip={tip} />
    </div>
  );
}

// ─── Marketing spend — bar chart with X/Y axes ($ per month) ────────────────────
function MarketingChart() {
  const labels = ['M8', 'M9', 'M10', 'M11', 'M12'];
  const data = [3500, 4200, 3800, 4500, 3200];
  const W = 540, H = 170, pad = { t: 14, r: 14, b: 26, l: 40 };
  const maxY = 5000, ticks = [0, 2500, 5000];
  const yAt = (v: number) => pad.t + (1 - v / maxY) * (H - pad.t - pad.b);
  const slot = (W - pad.l - pad.r) / labels.length, barW = slot * 0.42;
  const [hi, setHi] = useState<number | null>(null);
  const { tip, show, hide } = useTip();
  return (
    <div>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }} role="img"
        aria-label="Marketing spend bar chart by month: M8 $3.5k, M9 $4.2k, M10 $3.8k, M11 $4.5k, M12 $3.2k.">
        <BarGradients />
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={pad.l} x2={W - pad.r} y1={yAt(t)} y2={yAt(t)} stroke={t === 0 ? C.FG4 : C.BORDER} strokeWidth={t === 0 ? 1.2 : 1} strokeDasharray={t === 0 ? undefined : '1,5'} opacity={t === 0 ? 1 : 0.7} />
            <text x={pad.l - 8} y={yAt(t) + 4} textAnchor="end" fontSize="9.5" fill={C.FG4} fontFamily={F} style={{ fontVariantNumeric: 'tabular-nums' }}>${(t / 1000).toFixed(0)}k</text>
          </g>
        ))}
        {/* axes */}
        <line x1={pad.l} y1={pad.t} x2={pad.l} y2={yAt(0)} stroke={C.FG4} strokeWidth="1.2" />
        <line x1={pad.l} y1={yAt(0)} x2={W - pad.r} y2={yAt(0)} stroke={C.FG4} strokeWidth="1.2" />
        {labels.map((l, i) => {
          const x = pad.l + i * slot + (slot - barW) / 2, y = yAt(data[i]), h = yAt(0) - y, active = hi === i;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={Math.max(h, 2)} rx="6" fill="url(#mr-bar-cyan)" style={{ opacity: hi === null || active ? 1 : 0.5, filter: active ? 'drop-shadow(0 4px 10px rgba(0,44,51,0.16))' : 'none', transition: 'opacity .15s' }} />
              <text x={x + barW / 2} y={H - 8} textAnchor="middle" fontSize="9.5" fill={active ? C.CYAN : C.FG4} fontWeight={active ? 700 : 400} fontFamily={F}>{l}</text>
              <rect x={pad.l + i * slot} y={pad.t} width={slot} height={H - pad.t - pad.b} fill="transparent"
                onMouseEnter={() => setHi(i)} onMouseMove={(e) => show(e, labels[i], `$${data[i].toLocaleString()}`)} onMouseLeave={() => { setHi(null); hide(); }} />
            </g>
          );
        })}
      </svg>
      <ChartLegend items={[{ name: 'Spend', color: C.CYAN, bar: true }]} />
      <Tooltip tip={tip} />
    </div>
  );
}

// ─── Waterfall (Finance cash movement) ─────────────────────────────────────────
function Waterfall() {
  const items = [
    { label: 'Opening Cash', value: 125800, type: 'total' as const, icon: Landmark },
    { label: 'Revenue / Inflow', value: 24500, type: 'delta' as const, icon: TrendingUp },
    { label: 'COGS', value: -7200, type: 'delta' as const, icon: Coffee },
    { label: 'Rent', value: -5000, type: 'delta' as const, icon: Landmark },
    { label: 'Salary', value: -8400, type: 'delta' as const, icon: Users },
    { label: 'Marketing', value: -2600, type: 'delta' as const, icon: Zap },
    { label: 'Other', value: -1300, type: 'delta' as const, icon: Settings },
    { label: 'Closing Cash', value: 125800, type: 'total' as const, icon: Wallet },
  ];
  const W = 640, H = 250, pad = { t: 30, r: 12, b: 56, l: 44 };
  const domain = 150000, ticks = [0, 50000, 100000, 150000];
  let running = 0;
  const bars = items.map(it => {
    if (it.type === 'total') { const b = { ...it, from: 0, to: it.value, grad: 'mr-bar-teal', color: C.TEAL }; running = it.value; return b; }
    const from = running; running += it.value;
    return { ...it, from, to: running, grad: it.value >= 0 ? 'mr-bar-cyan' : 'mr-bar-rose', color: it.value >= 0 ? C.CYAN : C.ROSE };
  });
  const yAt = (v: number) => pad.t + (1 - v / domain) * (H - pad.t - pad.b);
  const slot = (W - pad.l - pad.r) / bars.length, barW = slot * 0.56;
  const [hi, setHi] = useState<number | null>(null);
  const { tip, show, hide } = useTip();
  return (
    <div>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }} role="img"
        aria-label="Waterfall: opening cash $125,800 plus inflows less COGS, rent, salary, marketing and other, ending at closing cash $125,800.">
        <BarGradients />
        {ticks.map((t, i) => (
          <g key={`t${i}`}>
            <line x1={pad.l} x2={W - pad.r} y1={yAt(t)} y2={yAt(t)} stroke={t === 0 ? C.FG4 : C.BORDER} strokeWidth={t === 0 ? 1.2 : 1} strokeDasharray={t === 0 ? undefined : '1,5'} opacity={t === 0 ? 1 : 0.7} />
            <text x={pad.l - 8} y={yAt(t) + 4} textAnchor="end" fontSize="9.5" fill={C.FG4} fontFamily={F} style={{ fontVariantNumeric: 'tabular-nums' }}>${t / 1000}k</text>
          </g>
        ))}
        {/* axes */}
        <line x1={pad.l} y1={pad.t} x2={pad.l} y2={yAt(0)} stroke={C.FG4} strokeWidth="1.2" />
        <line x1={pad.l} y1={yAt(0)} x2={W - pad.r} y2={yAt(0)} stroke={C.FG4} strokeWidth="1.2" />
        {bars.map((b, i) => {
          const x = pad.l + i * slot + (slot - barW) / 2;
          const y = yAt(Math.max(b.from, b.to)), h = Math.max(Math.abs(yAt(b.from) - yAt(b.to)), 2);
          const active = hi === i, val = b.value;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={h} fill={`url(#${b.grad})`} rx="3"
                style={{ opacity: hi === null || active ? 1 : 0.5, filter: active ? 'drop-shadow(0 4px 10px rgba(0,44,51,0.16))' : 'none', transition: 'opacity .15s' }} />
              {i < bars.length - 1 && bars[i + 1].type !== 'total' && <line x1={x + barW} x2={x + slot} y1={yAt(b.to)} y2={yAt(b.to)} stroke={C.FG4} strokeDasharray="2,3" />}
              <text x={x + barW / 2} y={y - 6} textAnchor="middle" fontSize="9" fontWeight="700" fontFamily={F} fill={b.color}>{val >= 0 && b.type === 'delta' ? '+' : val < 0 ? '-' : ''}${Math.abs(Math.round(val / 100) / 10).toFixed(1)}k</text>
              <text x={x + barW / 2} y={H - 30} textAnchor="middle" fontSize="8.5" fontFamily={F} fontWeight="600" fill={active ? C.CYAN : C.FG2}>{b.label.length > 12 ? b.label.split(' ')[0] : b.label}</text>
              <g transform={`translate(${x + barW / 2 - 7}, ${H - 22})`}><b.icon size={14} color={C.FG4} /></g>
              <rect x={pad.l + i * slot} y={pad.t} width={slot} height={H - pad.t - pad.b} fill="transparent"
                onMouseEnter={() => setHi(i)} onMouseMove={(e) => show(e, b.label, `${val >= 0 && b.type === 'delta' ? '+' : val < 0 ? '-' : ''}$${Math.abs(val).toLocaleString()}`)} onMouseLeave={() => { setHi(null); hide(); }} />
            </g>
          );
        })}
      </svg>
      <Tooltip tip={tip} />
    </div>
  );
}

// ─── Acquisition funnel (Customers) ────────────────────────────────────────────
// Quarterly-style: one smooth tapering cyan band, value above + % pill + label below.
function Funnel() {
  const stages = [
    { label: 'Reach', value: '4,200', rate: 'Interest Rate', rateVal: '60.5%' },
    { label: 'Interest', value: '2,540', rate: 'Visit Rate', rateVal: '58.3%' },
    { label: 'Visit', value: '1,480', rate: 'Purchase Rate', rateVal: '66.2%' },
    { label: 'Purchase', value: '980', rate: 'Repeat Rate', rateVal: '66.3%' },
    { label: 'Repeat', value: '650', rate: '', rateVal: '' },
  ];
  const nums = [4200, 2540, 1480, 980, 650];
  // % pill = step conversion into the stage; first = 100%.
  const pills = ['100%', '60.5%', '58.3%', '66.2%', '66.3%'];
  const W = 620, H = 252, padL = 8, padR = 8, plotTop = 44, plotBottom = 200;
  const midY = (plotTop + plotBottom) / 2, maxHalf = 70, max = nums[0], n = nums.length;
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
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }} role="img"
        aria-label="Funnel chart: 4,200 Reach → 2,540 Interest (60.5%) → 1,480 Visit (58.3%) → 980 Purchase (66.2%) → 650 Repeat (66.3%).">
        <defs>
          <linearGradient id="mr-funnel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={solidStop(C.CYAN)} stopOpacity="0.92" />
            <stop offset="100%" stopColor={solidStop(C.CYAN)} stopOpacity="0.42" />
          </linearGradient>
        </defs>
        <path d={bandD} fill="url(#mr-funnel)" />
        {nums.slice(1).map((_, i) => { const x = padL + segW * (i + 1); return <line key={i} x1={x} x2={x} y1={plotTop} y2={plotBottom} stroke="var(--color-card)" strokeWidth="1.5" opacity="0.7" />; })}
        {nums.map((v, i) => {
          const x0 = padL + segW * i, active = hi === i;
          return (
            <g key={i}>
              {active && <rect x={x0} y={plotTop} width={segW} height={plotBottom - plotTop} fill={C.CYAN} opacity="0.1" />}
              <text x={cxAt(i)} y={30} textAnchor="middle" fontFamily={F} fontWeight="700" fontSize="16" fill={active ? C.CYAN : C.FG1} style={{ fontVariantNumeric: 'tabular-nums' }}>{stages[i].value}</text>
              <rect x={cxAt(i) - 25} y={midY - 12} width="50" height="24" rx="12" fill={active ? C.CYAN : 'var(--color-card)'} stroke={active ? C.CYAN : C.BORDER} strokeWidth="1" style={{ filter: active ? 'drop-shadow(0 2px 6px rgba(0,44,51,0.18))' : 'none' }} />
              <text x={cxAt(i)} y={midY + 4} textAnchor="middle" fontFamily={F} fontWeight="700" fontSize="12" fill={active ? 'var(--primary-foreground)' : C.FG1}>{pills[i]}</text>
              <text x={cxAt(i)} y={plotBottom + 26} textAnchor="middle" fontFamily={F} fontSize="11.5" fontWeight={active ? 700 : 500} fill={active ? C.CYAN : C.FG3}>{stages[i].label}</text>
              <rect x={x0} y={plotTop} width={segW} height={plotBottom - plotTop + 32} fill="transparent"
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

// ─── Data ──────────────────────────────────────────────────────────────────────
export type KpiItem = { label: string; value: string; delta: string; positive?: boolean; neutral?: boolean; dot: string };

// Optional injected data (demo flow) — module consts below remain the /ref defaults.
export interface MonthReviewData {
  monthLabel: string;
  subtitle: string;
  overviewKpis: KpiItem[];
  soldUnsold: { sold: number; total: number; unsold: number; soldPct: number };
  cash: { opening: number; inflow: number; outflow: number; closing: number };
  insights: string[];
}
const overviewKpis: KpiItem[] = [
  { label: 'Revenue', value: '$24,500', delta: '+12.4% vs last Month', positive: true, dot: C.CYAN },
  { label: 'Market Share', value: '28%', delta: '+2.1% vs M2', positive: true, dot: C.TEAL_MID },
  { label: 'Retention %', value: '89%', delta: '+3% vs M2', positive: true, dot: C.CYAN_DEEP },
  { label: 'Runway', value: '9.9 wks', delta: '-0.3 wks vs last Month', positive: false, dot: C.SOFT_TEAL },
];
const financeKpis: KpiItem[] = [
  { label: 'Revenue', value: '$24,500', delta: '+12.4% vs last Month', positive: true, dot: C.CYAN },
  { label: 'Cash Balance', value: '$124,500', delta: '+12.4% vs last Month', positive: true, dot: C.TEAL },
  { label: 'Monthly Burn', value: '$12,400', delta: '+3.5% vs last Month', positive: false, dot: C.AMBER },
  { label: 'Runway', value: '9.9 wks', delta: '-0.3 wks vs last Month', positive: false, dot: C.SOFT_TEAL },
];
const operationsKpis: KpiItem[] = [
  { label: 'Units Sold', value: '3,840', delta: '+10% vs last Month', positive: true, dot: C.CYAN },
  { label: 'Footfall', value: '2,548', delta: '+8% vs last Month', positive: true, dot: C.TEAL },
  { label: 'Total Waste', value: '379', delta: '-12% vs last Month', neutral: true, dot: C.AMBER },
  { label: 'Marketing Spend', value: '$3.2k', delta: '+4% vs last Month', positive: true, dot: C.CYAN_DEEP },
];
const customersKpis: KpiItem[] = [
  { label: 'Total Customers', value: '2,548', delta: '+8% vs last Month', positive: true, dot: C.CYAN },
  { label: 'Retention %', value: '89%', delta: '+3% vs M2', positive: true, dot: C.CYAN_DEEP },
  { label: 'CAC', value: '$6.20', delta: '-$0.40 vs last Month', neutral: true, dot: C.TEAL_MID },
  { label: 'Satisfaction', value: '81/100', delta: '+3 vs last Month', positive: true, dot: C.SOFT_TEAL },
];

const segments = [
  { name: 'Value Buyers', buyers: '1,120', retention: '58%', deltaLabel: '-8%', positive: false, tag: 'Price-sensitive', tagIcon: DollarSign, retVal: 58, ramp: 0, mascot: '/annual-report/clean/mascot-value-seekers.png' },
  { name: 'Balanced Buyers', buyers: '980', retention: '74%', deltaLabel: '+4%', positive: true, tag: 'Best fit this month', tagIcon: Sliders, retVal: 74, ramp: 1, mascot: '/annual-report/clean/mascot-balanced-buyers.png' },
  { name: 'Premium Buyers', buyers: '448', retention: '86%', deltaLabel: '+2%', positive: true, tag: 'High margin', tagIcon: Crown, retVal: 86, ramp: 2, mascot: '/annual-report/clean/mascot-premium-loyalists.png' },
];

const marketShare = [
  { label: 'Dhaulagiri Cafe (You)', value: 28, valueLabel: '28%' },
  { label: 'Team Alpha', value: 22, valueLabel: '22%' },
  { label: 'Team Beta', value: 18, valueLabel: '18%' },
  { label: 'Team Gamma', value: 15, valueLabel: '15%' },
  { label: 'Others', value: 17, valueLabel: '17%' },
];

const financialLog = [
  { month: 'M8', revenue: '$19,200', costs: '$11,200', profit: '$8,000', cash: '$98,200', margin: '41.7%' },
  { month: 'M9', revenue: '$18,400', costs: '$11,000', profit: '$7,400', cash: '$105,600', margin: '40.2%' },
  { month: 'M10', revenue: '$21,000', costs: '$11,600', profit: '$9,400', cash: '$115,000', margin: '44.8%' },
  { month: 'M11', revenue: '$22,800', costs: '$12,000', profit: '$10,800', cash: '$125,800', margin: '47.4%' },
  { month: 'M12', revenue: '$24,500', costs: '$12,400', profit: '$12,100', cash: '$137,900', margin: '49.4%' },
];

const costBreakdown = [
  { label: 'COGS', icon: Coffee, amount: '$7,200', pct: 58 },
  { label: 'Labor', icon: Users, amount: '$2,400', pct: 21 },
  { label: 'Rent', icon: Landmark, amount: '$1,500', pct: 12 },
  { label: 'Marketing', icon: Zap, amount: '$600', pct: 5 },
  { label: 'Operations', icon: Settings, amount: '$300', pct: 2 },
  { label: 'Other', icon: Box, amount: '$200', pct: 2 },
];

const waste = [
  { label: 'Expiry', value: 180, pct: '5.3% of waste', icon: Calendar, color: C.AMBER },
  { label: 'Phantom', value: 95, pct: '2.8% of waste', icon: Box, color: C.SOFT_TEAL },
  { label: 'Damaged', value: 62, pct: '1.8% of waste', icon: Package, color: C.CYAN_DEEP },
  { label: 'Scrap', value: 42, pct: '1.2% of waste', icon: Trash2, color: C.NEG },
];

const productRevenue = [
  { name: 'Espresso', icon: Coffee, revenue: '$1,631', units: 466, share: '22%' },
  { name: 'Cappuccino', icon: Milk, revenue: '$2,889', units: 642, share: '39%' },
  { name: 'Cold Brew', icon: CoffeeBeans, revenue: '$990', units: 198, share: '13%' },
  { name: 'Croissant', icon: Bread, revenue: '$1,005', units: 268, share: '14%' },
  { name: 'Muffin', icon: Cake, revenue: '$468', units: 146, share: '6%' },
  { name: 'Whole Bean', icon: Box, revenue: '$392', units: 28, share: '5%' },
];

const soldUnsold = [
  { name: 'Espresso', icon: Coffee, sold: 466, unsold: 18, soldPct: 96, unsoldPct: 4 },
  { name: 'Cappuccino', icon: Milk, sold: 642, unsold: 12, soldPct: 98, unsoldPct: 2 },
  { name: 'Cold Brew', icon: CoffeeBeans, sold: 198, unsold: 22, soldPct: 90, unsoldPct: 10 },
  { name: 'Croissant', icon: Bread, sold: 268, unsold: 34, soldPct: 89, unsoldPct: 11 },
  { name: 'Muffin', icon: Cake, sold: 146, unsold: 26, soldPct: 85, unsoldPct: 15 },
  { name: 'Whole Bean', icon: Box, sold: 28, unsold: 0, soldPct: 100, unsoldPct: 0 },
];

const cacBySegment = [
  { label: 'Value', icon: DollarSign, value: '$4.20' },
  { label: 'Balanced', icon: Sliders, value: '$6.80' },
  { label: 'Premium', icon: Crown, value: '$11.40' },
];

const teamCapability = [
  { label: 'Service', value: 38, valueLabel: '38%' },
  { label: 'Kitchen', value: 27, valueLabel: '27%' },
  { label: 'Inventory', value: 14, valueLabel: '14%' },
  { label: 'Marketing', value: 11, valueLabel: '11%' },
  { label: 'Admin', value: 10, valueLabel: '10%' },
];

const efficiency = [
  { label: 'Customers per Support Staff', value: '32', delta: '+2', positive: true },
  { label: 'Avg Service Load / Hour', value: '78%', delta: '-3%', positive: false },
  { label: 'Fulfillment Efficiency', value: '93%', delta: '+4%', positive: true },
];

const satScale = [
  { label: 'Poor', icon: Cloud }, { label: 'Weak', icon: Cloud }, { label: 'OK', icon: Cloud },
  { label: 'Good', icon: Sun }, { label: 'Excellent', icon: Sun },
];

const tabs = ['Overview', 'Finance', 'Operations', 'Customers'];

// Read initial tab from `?tab=` so each tab can be deep-linked (used by Figma capture).
function readInitialTab(): string {
  if (typeof window === 'undefined') return 'Overview';
  const t = new URLSearchParams(window.location.search).get('tab');
  return t && tabs.includes(t) ? t : 'Overview';
}

// ─── Embeddable content (title + tabs + body) ───────────────────────────────────
// `embedded` drops the page-width wrapper and own title so this can live inside
// another screen (e.g. the Report tab on Monthly Decisions).
export function MonthReviewContent({ data, embedded }: { data?: MonthReviewData; embedded?: boolean } = {}) {
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    if (embedded) return; // host screen owns the `?tab=` param when embedded
    const t = new URLSearchParams(window.location.search).get('tab');
    if (t && tabs.includes(t)) {
      setActiveTab(t);
    }
  }, [embedded]);

  const body = (
    <>
      <style>{QR_CSS}</style>

      {!embedded && (
        <div style={{ marginBottom: 18 }}>
          <h1 style={{ fontFamily: F, fontWeight: 700, fontSize: 26, letterSpacing: '-0.4px', color: '#002C33' }}>{data?.monthLabel ?? 'Month 12 Dashboard'}</h1>
          <div style={{ fontFamily: F, fontSize: 13, color: C.FG3, marginTop: 3 }}>{data?.subtitle ?? 'Streets of Bagbazaar — Restaurant Performance'}</div>
        </div>
      )}

      {/* Tab bar */}
      <div style={{ marginBottom: 18 }}>
        <TabBar tabs={tabs.map(t => ({ id: t, label: t }))} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === 'Overview' && <OverviewTab data={data} />}
      {activeTab === 'Finance' && <FinanceTab />}
      {activeTab === 'Operations' && <OperationsTab />}
      {activeTab === 'Customers' && <CustomersTab />}
    </>
  );

  if (embedded) return body;

  return <div className="max-w-[1312px] mx-auto px-6 w-full pb-24">{body}</div>;
}

// ─── Main component ─────────────────────────────────────────────────────────────
export function MonthReview({ data }: { data?: MonthReviewData } = {}) {
  return (
    <GridBackground className="flex flex-col min-h-screen">
      <PageTransition>
        <GameHeader />
        <MonthReviewContent data={data} />
      </PageTransition>
    </GridBackground>
  );
}

// ════════════════════════════════════════ OVERVIEW ════════════════════════════
function OverviewTab({ data }: { data?: MonthReviewData }) {
  const su = data?.soldUnsold ?? { sold: 3840, total: 4460, unsold: 620, soldPct: 86 };
  const cashFlow = data?.cash ?? { opening: 145000, inflow: 99200, outflow: 119700, closing: 124500 };
  const fmt = (n: number) => `$${Math.abs(n).toLocaleString('en-US')}`;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <KpiStrip items={data?.overviewKpis ?? overviewKpis} />
      {/* Row 1: revenue chart + customer segments */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 16 }}>
        <Card>
          <CardTitle title="Revenue vs Costs" sub="Monthly trend over 12 months" />
          <RevenueCostsChart />
        </Card>
        <Card>
          <CardTitle title="Customer Segments" sub="Overview of your customers by segment" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {segments.map((s) => (
              <div key={s.name} style={{ border: `1px solid ${C.BORDER}`, borderRadius: 12, padding: 14, background: 'rgba(255,255,255,0.5)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                  <Mascot src={s.mascot} size={64} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 12 }}>
                  <span style={{ fontFamily: F, fontWeight: 700, fontSize: 12.5, color: C.FG1 }}>{s.name}</span>
                </div>
                <SegRow label="Buyers" icon={Users} value={s.buyers} />
                <SegRow label="Retention" icon={RefreshCw} value={s.retention} valueColor={rampFill(s.ramp)} />
                <SegRow label="vs last month" icon={s.positive ? TrendingUp : Activity} value={s.deltaLabel} valueColor={s.positive ? C.EMERALD : C.NEG} />
                <div style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: F, fontSize: 9.5, fontWeight: 600, background: C.CYAN100, color: C.TEAL_MID, padding: '3px 8px', borderRadius: 6 }}>
                  <s.tagIcon size={10} color={C.TEAL_MID} />{s.tag}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 2: sold/unsold + market share + valuation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.1fr', gap: 16 }}>
        <Card>
          <CardTitle title="Sold vs Unsold" />
          {/* bento: two stat cells (storage-card style) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
            {[
              { k: 'Sold', v: su.sold.toLocaleString('en-US'), u: 'units', s: `${su.soldPct}% of total`, accent: true },
              { k: 'Total Units', v: su.total.toLocaleString('en-US'), u: 'units', s: `${su.unsold.toLocaleString('en-US')} unsold`, accent: false },
            ].map((c, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.5)', border: `1px solid ${C.BORDER}`, borderRadius: 12, padding: '12px 14px' }}>
                <div style={{ fontFamily: F, fontSize: 11, color: C.FG3 }}>{c.k}</div>
                <div style={{ fontFamily: F, fontWeight: 700, fontSize: 20, color: C.FG1, fontVariantNumeric: 'tabular-nums' }}>{c.v} <span style={{ fontSize: 11, fontWeight: 500, color: C.FG4 }}>{c.u}</span></div>
                <div style={{ fontFamily: F, fontSize: 10, color: c.accent ? C.TEAL_MID : C.FG4, fontWeight: c.accent ? 600 : 400 }}>{c.s}</div>
              </div>
            ))}
          </div>
          {/* split track with marker */}
          <div style={{ position: 'relative', marginTop: 18, marginBottom: 4, height: 30 }}>
            <div style={{ position: 'absolute', left: `${su.soldPct}%`, top: -2, fontFamily: F, fontSize: 12, color: C.FG1, transform: 'translateX(-100%) translateX(-8px)', whiteSpace: 'nowrap' }}>
              <span style={{ fontWeight: 700 }}>{su.soldPct}%</span> <span style={{ color: C.FG3 }}>sold</span>
            </div>
            <div style={{ position: 'absolute', left: `${su.soldPct}%`, top: 16, bottom: -8, width: 2, background: C.FG2 }} />
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: -8, height: 10, borderRadius: 6, overflow: 'hidden', background: C.MUTED, border: `1px solid ${C.BORDER}`, display: 'flex' }}>
              <div style={{ width: `${su.soldPct}%`, height: '100%', background: `linear-gradient(90deg, ${C.CYAN}, color-mix(in srgb, ${C.CYAN} 70%, white))` }} />
              <div style={{ width: `${100 - su.soldPct}%`, height: '100%', background: C.AMBER }} />
            </div>
          </div>
          {/* legend */}
          <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
            <LegendRow color={C.CYAN} label={`Sold ${su.soldPct}% (${su.sold.toLocaleString('en-US')})`} />
            <LegendRow color={C.AMBER} label={`Unsold ${100 - su.soldPct}% (${su.unsold.toLocaleString('en-US')})`} />
          </div>
        </Card>

        <Card>
          <CardTitle title="Market Share" sub="Competitive landscape" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Donut data={marketShare} size={130} centerTop="28%" centerSub="YOU" />
            <DonutLegend data={marketShare} />
          </div>
        </Card>

        <ValuationSummary />
      </div>

      {/* Row 3: cash movement + insight */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>
        <Card>
          <CardTitle title="Cash Movement This Month" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr auto 1fr', alignItems: 'center', gap: 6 }}>
            <CashStep icon={Landmark} label="Opening Cash" value={fmt(cashFlow.opening)} color={C.FG1} />
            <ArrowRight size={18} color={C.BORDER} className="shrink-0" />
            <CashStep icon={TrendingUp} label="Inflow" value={`+${fmt(cashFlow.inflow)}`} color={C.EMERALD} bg="color-mix(in srgb, var(--game-positive) 9%, transparent)" />
            <ArrowRight size={18} color={C.BORDER} className="shrink-0" />
            <CashStep icon={Activity} label="Outflow" value={`-${fmt(cashFlow.outflow)}`} color={C.NEG} bg="color-mix(in srgb, var(--game-negative) 9%, transparent)" />
            <ArrowRight size={18} color={C.BORDER} className="shrink-0" />
            <CashStep icon={Wallet} label="Closing Cash" value={fmt(cashFlow.closing)} color={C.TEAL_MID} bg={C.CYAN100} />
          </div>
        </Card>
        <Card>
          <CardTitle title="Monthly Insight" right={<Lightbulb size={16} color={C.AMBER} />} />
          <NoteList items={data?.insights ?? [
            'Revenue grew 12.4% driven by strong weekend sales.',
            'Cold Brew is your top performer this month.',
            'Reduce waste further to improve monthly burn by $1k+.',
          ]} />
        </Card>
      </div>
    </div>
  );
}

// ════════════════════════════════════════ FINANCE ════════════════════════════
function FinanceTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <KpiStrip items={financeKpis} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 16 }}>
        <Card>
          <CardTitle title="Revenue vs Costs" sub="Monthly trend over 12 months" />
          <RevenueCostsChart />
        </Card>
        <Card pad={0}>
          <div style={{ padding: '20px 20px 0' }}><CardTitle title="Monthly Financial Log" sub="Detailed breakdown per Month" /></div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '0.7fr 1fr 1fr 1fr 1fr 0.8fr', padding: '8px 20px', background: C.MUTED, fontFamily: F, fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: C.FG3 }}>
              <div>Month</div><div style={{ textAlign: 'right' }}>Revenue</div><div style={{ textAlign: 'right' }}>Costs</div><div style={{ textAlign: 'right' }}>Profit</div><div style={{ textAlign: 'right' }}>Cash</div><div style={{ textAlign: 'right' }}>Margin</div>
            </div>
            {financialLog.map((r, i) => (
              <div key={i} className="mr-row" style={{ display: 'grid', gridTemplateColumns: '0.7fr 1fr 1fr 1fr 1fr 0.8fr', padding: '11px 20px', borderTop: `1px solid ${C.MUTED}`, alignItems: 'center', fontFamily: F, fontSize: 12.5, fontVariantNumeric: 'tabular-nums' }}>
                <div style={{ fontWeight: 700, color: C.TEAL_MID }}>{r.month}</div>
                <div style={{ textAlign: 'right', color: C.FG1, fontWeight: 600 }}>{r.revenue}</div>
                <div style={{ textAlign: 'right', color: C.NEG }}>{r.costs}</div>
                <div style={{ textAlign: 'right', color: C.EMERALD, fontWeight: 600 }}>{r.profit}</div>
                <div style={{ textAlign: 'right', color: C.FG2 }}>{r.cash}</div>
                <div style={{ textAlign: 'right', color: C.FG1, fontWeight: 700 }}>{r.margin}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 16 }}>
        <ValuationSummary />
        <Card>
          <CardTitle title="Cash Movement This Month" sub="Monthly cash flow breakdown" />
          <Waterfall />
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 16 }}>
        <Card>
          <CardTitle title="Cost Breakdown This Month" sub="Total cost: $12,400" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {costBreakdown.map((c, i) => (
              <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <IconChip icon={c.icon} size={26} iconSize={13} />
                <span style={{ fontFamily: F, fontSize: 12, color: C.FG2, width: 78 }}>{c.label}</span>
                <div style={{ flex: 1, height: 8, borderRadius: 99, background: C.MUTED, overflow: 'hidden' }}>
                  <div style={{ width: `${c.pct}%`, height: '100%', background: rampFill(i % 5) }} />
                </div>
                <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: C.FG1, fontVariantNumeric: 'tabular-nums', width: 56, textAlign: 'right' }}>{c.amount}</span>
                <span style={{ fontFamily: F, fontSize: 11, color: C.FG4, width: 34, textAlign: 'right' }}>{c.pct}%</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardTitle title="Finance Notes" right={<Check size={16} color={C.EMERALD} />} />
          <NoteList check items={[
            'Revenue grew 12.4% this month driven by weekend footfall and repeat customers.',
            'COGS increased slightly due to higher ingredient prices; monitor portion control.',
            'Cash position is strong with 9.9 weeks of runway. Focus on marketing ROI.',
          ]} />
        </Card>
      </div>
    </div>
  );
}

// ════════════════════════════════════════ OPERATIONS ═════════════════════════
function OperationsTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <KpiStrip items={operationsKpis} />
      {/* waste KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {waste.map((w) => (
          <Card key={w.label}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <IconChip icon={w.icon} color={w.color} bg="color-mix(in srgb, var(--color-chart-1) 8%, transparent)" />
              <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: C.FG3 }}>{w.label}</span>
            </div>
            <div style={{ fontFamily: F, fontWeight: 700, fontSize: 30, color: C.FG1, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{w.value}</div>
            <div style={{ fontFamily: F, fontSize: 11, color: C.FG4, marginTop: 4 }}>{w.pct}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 16 }}>
        <Card>
          <CardTitle title="Sold vs Unsold" />
          {/* bento: two stat cells (storage-card style) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
            {[
              { k: 'Sold', v: '3,840', u: 'units', s: '86% of total', accent: true },
              { k: 'Total Units', v: '4,460', u: 'units', s: '620 unsold', accent: false },
            ].map((c, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.5)', border: `1px solid ${C.BORDER}`, borderRadius: 12, padding: '12px 14px' }}>
                <div style={{ fontFamily: F, fontSize: 11, color: C.FG3 }}>{c.k}</div>
                <div style={{ fontFamily: F, fontWeight: 700, fontSize: 20, color: C.FG1, fontVariantNumeric: 'tabular-nums' }}>{c.v} <span style={{ fontSize: 11, fontWeight: 500, color: C.FG4 }}>{c.u}</span></div>
                <div style={{ fontFamily: F, fontSize: 10, color: c.accent ? C.TEAL_MID : C.FG4, fontWeight: c.accent ? 600 : 400 }}>{c.s}</div>
              </div>
            ))}
          </div>
          {/* split track with marker */}
          <div style={{ position: 'relative', marginTop: 18, marginBottom: 4, height: 30 }}>
            <div style={{ position: 'absolute', left: '86%', top: -2, fontFamily: F, fontSize: 12, color: C.FG1, transform: 'translateX(-100%) translateX(-8px)', whiteSpace: 'nowrap' }}>
              <span style={{ fontWeight: 700 }}>86%</span> <span style={{ color: C.FG3 }}>sold</span>
            </div>
            <div style={{ position: 'absolute', left: '86%', top: 16, bottom: -8, width: 2, background: C.FG2 }} />
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: -8, height: 10, borderRadius: 6, overflow: 'hidden', background: C.MUTED, border: `1px solid ${C.BORDER}`, display: 'flex' }}>
              <div style={{ width: '86%', height: '100%', background: `linear-gradient(90deg, ${C.CYAN}, color-mix(in srgb, ${C.CYAN} 70%, white))` }} />
              <div style={{ width: '14%', height: '100%', background: C.AMBER }} />
            </div>
          </div>
          {/* legend */}
          <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
            <LegendRow color={C.CYAN} label="Sold 86% (3,840)" />
            <LegendRow color={C.AMBER} label="Unsold 14% (620)" />
          </div>
        </Card>
        <Card pad={0}>
          <div style={{ padding: '20px 20px 0' }}><CardTitle title="Revenue by Product" /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', padding: '8px 20px', background: C.MUTED, fontFamily: F, fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: C.FG3 }}>
            <div>Product</div><div style={{ textAlign: 'right' }}>Revenue</div><div style={{ textAlign: 'right' }}>Units Sold</div><div style={{ textAlign: 'right' }}>Rev. Share</div>
          </div>
          {productRevenue.map((p) => (
            <div key={p.name} className="mr-row" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', padding: '10px 20px', borderTop: `1px solid ${C.MUTED}`, alignItems: 'center', fontFamily: F, fontSize: 12.5, fontVariantNumeric: 'tabular-nums' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}><IconChip icon={p.icon} size={24} iconSize={13} /><span style={{ color: C.FG1, fontWeight: 600 }}>{p.name}</span></div>
              <div style={{ textAlign: 'right', color: C.FG1, fontWeight: 600 }}>{p.revenue}</div>
              <div style={{ textAlign: 'right', color: C.FG2 }}>{p.units}</div>
              <div style={{ textAlign: 'right', color: C.TEAL_MID, fontWeight: 700 }}>{p.share}</div>
            </div>
          ))}
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        <Card>
          <CardTitle title="Sold vs Unsold by Product" sub="Units this month" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {soldUnsold.map((p) => (
              <div key={p.name} style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.6fr 0.6fr 2fr', alignItems: 'center', gap: 12 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: F, fontSize: 12, color: C.FG2 }}><p.icon size={15} color={C.TEAL_MID} />{p.name}</span>
                <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: C.FG1, fontVariantNumeric: 'tabular-nums' }}>{p.sold}</span>
                <span style={{ fontFamily: F, fontSize: 12, color: C.FG4, fontVariantNumeric: 'tabular-nums' }}>{p.unsold}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ flex: 1, height: 8, borderRadius: 99, background: C.MUTED, overflow: 'hidden', display: 'flex' }}>
                    <span style={{ width: `${p.soldPct}%`, background: C.CYAN }} />
                    {p.unsoldPct > 0 && <span style={{ width: `${p.unsoldPct}%`, background: C.AMBER }} />}
                  </span>
                  <span style={{ fontFamily: F, fontSize: 10.5, color: C.FG4, width: 60, textAlign: 'right' }}>{p.soldPct}% · {p.unsoldPct}%</span>
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 14 }}>
            <LegendRow color={C.CYAN} label="Sold" />
            <LegendRow color={C.AMBER} label="Unsold" />
          </div>
        </Card>
        <Card>
          <CardTitle title="Operations Notes" right={<Settings size={16} color={C.TEAL_MID} />} />
          <NoteList items={[
            'High expiry due to over-prep on weekend promotions.',
            'Phantom losses improved by 18% vs last month.',
            'Damaged items mainly from packaging issues.',
            'Waste reduction initiatives are showing positive impact.',
          ]} />
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <CardTitle title="Footfall" sub="Customer visits this month" right={<Delta label="+8%" positive />} />
          <div style={{ fontFamily: F, fontWeight: 700, fontSize: 26, color: C.FG1, fontVariantNumeric: 'tabular-nums' }}>2,548</div>
          <div style={{ fontFamily: F, fontSize: 11, color: C.FG4, marginBottom: 10 }}>vs last month · 2,360</div>
          <FootfallChart />
        </Card>
        <Card>
          <CardTitle title="Marketing Spend" sub="Allocation vs. acquired customer" right={<Delta label="+4%" positive />} />
          <div style={{ fontFamily: F, fontWeight: 700, fontSize: 26, color: C.FG1, fontVariantNumeric: 'tabular-nums' }}>$3.2k</div>
          <div style={{ fontFamily: F, fontSize: 11, color: C.FG4, marginBottom: 10 }}>CAC down to $1.26 per customer</div>
          <MarketingChart />
        </Card>
      </div>
    </div>
  );
}

// ════════════════════════════════════════ CUSTOMERS ═══════════════════════════
function CustomersTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <KpiStrip items={customersKpis} />
      {/* segment retention + funnel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 16 }}>
        <Card>
          <CardTitle title="Segment Retention" sub="How many customers stay and come back" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {segments.map((s) => (
              <div key={s.name} style={{ border: `1px solid ${C.BORDER}`, borderRadius: 12, padding: 12, textAlign: 'center', background: 'rgba(255,255,255,0.5)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                  <Mascot src={s.mascot} size={58} />
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
                  <span style={{ fontFamily: F, fontWeight: 700, fontSize: 11.5, color: C.FG1 }}>{s.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}><RingGauge value={s.retVal} color={rampFill(s.ramp)} size={96} /></div>
                <div style={{ fontFamily: F, fontSize: 11, color: C.FG3 }}>{s.buyers} customers</div>
                <div style={{ marginTop: 4 }}><Delta label={`${s.deltaLabel} vs last month`} positive={s.positive} /></div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardTitle title="Customer Acquisition Funnel" sub="Month 12 conversion from awareness to repeat purchase" />
          <Funnel />
          <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: F, fontSize: 11, fontWeight: 600, background: C.CYAN100, color: C.TEAL_MID, padding: '5px 10px', borderRadius: 8 }}>
            <Activity size={12} color={C.TEAL_MID} /> Overall conversion from Reach to Repeat: 15.5%
          </div>
        </Card>
      </div>

      {/* CAC */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 16 }}>
        <Card>
          <CardTitle title="CAC This Month" />
          <div style={{ fontFamily: F, fontWeight: 700, fontSize: 32, color: C.FG1, fontVariantNumeric: 'tabular-nums' }}>$6.20</div>
          <div style={{ fontFamily: F, fontSize: 11.5, color: C.FG4 }}>/customer</div>
        </Card>
        <Card>
          <CardTitle title="CAC by Segment" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {cacBySegment.map((c, i) => (
              <div key={c.label} style={{ border: `1px solid ${C.BORDER}`, borderRadius: 12, padding: 14, background: 'rgba(255,255,255,0.5)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ width: 26, height: 26, borderRadius: 8, background: 'color-mix(in srgb, var(--color-chart-1) 9%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><c.icon size={13} color={rampFill(i)} /></span>
                  <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: C.FG3 }}>{c.label}</span>
                </div>
                <div style={{ fontFamily: F, fontWeight: 700, fontSize: 22, color: C.FG1, fontVariantNumeric: 'tabular-nums' }}>{c.value}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* HR row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.8fr 1fr 1fr', gap: 16 }}>
        {/* satisfaction */}
        <Card>
          <CardTitle title="Customer Satisfaction" sub="Average rating this month" />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            {satScale.map((s, i) => (
              <div key={s.label} style={{ textAlign: 'center', opacity: i === 3 ? 1 : 0.4 }}>
                <s.icon size={20} color={i === 3 ? C.AMBER : C.FG4} />
                <div style={{ fontFamily: F, fontSize: 8.5, color: i === 3 ? C.TEAL_MID : C.FG4, marginTop: 3, fontWeight: i === 3 ? 700 : 400 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: F, fontWeight: 700, fontSize: 34, color: C.FG1, fontVariantNumeric: 'tabular-nums' }}>81<span style={{ fontSize: 14, color: C.FG4, fontWeight: 600 }}> / 100</span></div>
          <div style={{ marginTop: 4 }}><Delta label="+3 vs last month" positive /></div>
        </Card>
        {/* HR stability */}
        <Card>
          <CardTitle title="HR Stability" sub="Satisfaction vs. turnover trend" />
          <StatLine label="Employee Satisfaction" value="81%" delta="+4%" positive />
          <StatLine label="Turnover Rate" value="1.7%" delta="-0.4%" positive />
          <div style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: F, fontSize: 11, fontWeight: 700, background: 'color-mix(in srgb, var(--game-positive) 12%, transparent)', color: C.EMERALD, padding: '5px 10px', borderRadius: 8 }}>
            <Check size={12} color={C.EMERALD} /> Stability: Strong
          </div>
        </Card>
        {/* efficiency */}
        <Card>
          <CardTitle title="Employee Efficiency" sub="How efficiently we serve customers" />
          {efficiency.map((e) => (
            <div key={e.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: `1px solid ${C.MUTED}` }}>
              <span style={{ fontFamily: F, fontSize: 11.5, color: C.FG3, maxWidth: 130 }}>{e.label}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: C.FG1, fontVariantNumeric: 'tabular-nums' }}>{e.value}</span>
                <Delta label={e.delta} positive={e.positive} />
              </span>
            </div>
          ))}
        </Card>
        {/* team capability */}
        <Card>
          <CardTitle title="Team Capability Mix" sub="Team composition by role" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Donut data={teamCapability} size={110} thickness={20} centerTop="48" centerSub="TOTAL" />
            <DonutLegend data={teamCapability} />
          </div>
        </Card>
      </div>

      {/* notes */}
      <Card>
        <CardTitle title="Customer & HR Notes" right={<Heart size={16} color={C.CYAN} />} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 32px' }}>
          <NoteList check items={[
            'Satisfaction improved with faster service and better food quality.',
            'Turnover reduced slightly after new incentive plan rollout.',
            'Premium segment retention remains strongest.',
          ]} />
          <NoteList check items={[
            'Focus this month: grow repeat purchases and upsell.',
            'Keep momentum going.',
          ]} />
        </div>
      </Card>
    </div>
  );
}

// ─── Small shared sub-components ────────────────────────────────────────────────
function SegRow({ label, icon: Icon, value, valueColor }: { label: string; icon: any; value: string; valueColor?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: F, fontSize: 11, color: C.FG3 }}><Icon size={12} color={C.FG4} />{label}</span>
      <span style={{ fontFamily: F, fontSize: 12.5, fontWeight: 700, color: valueColor || C.FG1, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
  );
}

function ValBox({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ background: accent ? C.CYAN100 : C.MUTED, borderRadius: 10, padding: '10px 12px' }}>
      <div style={{ fontFamily: F, fontSize: 10, fontWeight: 600, color: C.FG3, textTransform: 'uppercase', letterSpacing: '.04em' }}>{label}</div>
      <div style={{ fontFamily: F, fontWeight: 700, fontSize: 18, color: accent ? C.TEAL_MID : C.FG1, fontVariantNumeric: 'tabular-nums', marginTop: 3 }}>{value}</div>
    </div>
  );
}

function CashStep({ icon: Icon, label, value, color, bg }: { icon: any; label: string; value: string; color: string; bg?: string }) {
  return (
    <div style={{ background: bg || C.MUTED, borderRadius: 12, padding: '14px 12px', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}><Icon size={18} color={color} /></div>
      <div style={{ fontFamily: F, fontSize: 10.5, color: C.FG3, marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    </div>
  );
}

function LegendRow({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: F, fontSize: 11, color: C.FG3 }}>
      <span style={{ width: 9, height: 9, borderRadius: 3, background: color }} />{label}
    </span>
  );
}

function StatLine({ label, value, delta, positive }: { label: string; value: string; delta: string; positive: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
      <span style={{ fontFamily: F, fontSize: 11.5, color: C.FG3 }}>{label}</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: C.FG1, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
        <Delta label={delta} positive={positive} />
      </span>
    </div>
  );
}

// Per-tab KPI strip — flat glass tiles, accent = dot beside label (no ribbon).
function KpiStrip({ items }: { items: KpiItem[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: 12 }}>
      {items.map((k, i) => (
        <div key={i} className="mr-lift" style={{ background: C.CARD, border: C.CARD_BORDER, borderRadius: 16, padding: '14px 16px', boxShadow: 'var(--shadow-elev-1)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 9 }}>
            <span style={{ width: 7, height: 7, borderRadius: 99, background: k.dot, flexShrink: 0 }} />
            <span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: C.FG3, textTransform: 'uppercase', letterSpacing: '.04em' }}>{k.label}</span>
          </div>
          <div style={{ fontFamily: F, fontWeight: 700, fontSize: 22, color: C.FG1, fontVariantNumeric: 'tabular-nums', lineHeight: 1.15, marginBottom: 5 }}>{k.value}</div>
          <Delta label={k.delta} positive={k.positive} neutral={k.neutral} />
        </div>
      ))}
    </div>
  );
}

// Radiating-tick semicircle gauge (quarterly style) — cyan ticks fill to value.
function OwnershipGauge({ value, label }: { value: number; label: string }) {
  const W = 176, H = 108, cx = W / 2, cy = 92, R = 72, rIn = R - 12, rOut = R, N = 40;
  const frac = value / 100;
  const f = (n: number) => Number(n.toFixed(4));
  return (
    <svg width={W} height={H} role="img" aria-label={`${label} ${value}%`}>
      {Array.from({ length: N }).map((_, i) => {
        const fi = i / (N - 1), ang = Math.PI - fi * Math.PI, on = fi <= frac;
        const x0 = f(cx + Math.cos(ang) * rIn), y0 = f(cy - Math.sin(ang) * rIn);
        const x1 = f(cx + Math.cos(ang) * rOut), y1 = f(cy - Math.sin(ang) * rOut);
        return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke={on ? C.CYAN : C.BORDER} strokeWidth={on ? 3 : 2.4} strokeLinecap="round" />;
      })}
      <text x={cx} y={cy - 14} textAnchor="middle" fontFamily={F} fontWeight="700" fontSize="30" fill={C.FG1}>{value}%</text>
      <text x={cx} y={cy + 4} textAnchor="middle" fontFamily={F} fontSize="10.5" fill={C.FG3}>{label}</text>
    </svg>
  );
}

// Quarterly-style stat tile — icon chip + label + value (+ optional delta).
function VStat({ icon: Icon, label, value, accent, delta, positive }: { icon: any; label: string; value: string; accent?: boolean; delta?: string; positive?: boolean }) {
  return (
    <div style={{ border: `1px solid ${C.BORDER}`, borderRadius: 12, padding: 13, background: accent ? C.CYAN100 : 'rgba(255,255,255,0.5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
        <IconChip icon={Icon} size={26} iconSize={13} />
        <span style={{ fontFamily: F, fontSize: 11, fontWeight: 500, color: C.FG3 }}>{label}</span>
      </div>
      <div style={{ fontFamily: F, fontWeight: 700, fontSize: 20, color: accent ? C.TEAL_MID : C.FG1, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      {delta && <div style={{ marginTop: 4 }}><Delta label={delta} positive={positive} /></div>}
    </div>
  );
}

// Valuation summary — quarterly chart language: radial gauge + stat tiles.
function ValuationSummary() {
  return (
    <Card>
      <CardTitle title="Valuation Summary" sub="DCF-based enterprise value" />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8, marginBottom: 14 }}>
        <OwnershipGauge value={85} label="Founder Share" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: C.CYAN100, border: `1px solid color-mix(in srgb, ${C.CYAN} 30%, transparent)`, borderRadius: 14, padding: '14px 16px' }}>
        <IconChip icon={BarChart3} size={38} iconSize={19} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: C.TEAL_MID, textTransform: 'uppercase', letterSpacing: '.04em' }}>Enterprise Value</span>
          <span style={{ fontFamily: F, fontWeight: 700, fontSize: 30, color: C.FG1, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>$485K</span>
        </div>
      </div>
    </Card>
  );
}

function NoteList({ items, check }: { items: string[]; check?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
          {check
            ? <span style={{ width: 16, height: 16, borderRadius: 99, background: 'color-mix(in srgb, var(--game-positive) 14%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}><Check size={10} color={C.EMERALD} /></span>
            : <span style={{ width: 6, height: 6, borderRadius: 99, background: C.CYAN, flexShrink: 0, marginTop: 6 }} />}
          <span style={{ fontFamily: F, fontSize: 12, lineHeight: 1.5, color: C.FG2 }}>{it}</span>
        </div>
      ))}
    </div>
  );
}
