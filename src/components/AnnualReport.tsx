import Image from 'next/image';
import { Check, Coffee, Copy, Star, Milk, CoffeeBeans, Bread, Cake, Box } from './PixelIcons';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAppNavigate } from '../lib/use-app-navigate';
import { GridBackground } from './GridBackground';
import { PageTransition } from './PageTransition';
import { TabBar } from './TabBar';
import badgeIcon from './icons/business-product-check--Streamline-Pixel.svg';
import bankIcon from './icons/money-payments-bank--Streamline-Pixel.svg';
import buildingIcon from './icons/real-estate-building-3--Streamline-Pixel.svg';
import downloadIcon from './icons/internet-network-download--Streamline-Pixel.svg';
import moneyIcon from './icons/business-money-coin-currency--Streamline-Pixel.svg';
import priceTagIcon from './icons/business-product-price-tag--Streamline-Pixel.svg';
import refreshIcon from './icons/interface-essential-refresh--Streamline-Pixel.svg';
import targetIcon from './icons/business-product-target--Streamline-Pixel.svg';
import reportChartIcon from './icons/business-product-report-present-grahp--Streamline-Pixel.svg';
import scaleIcon from './icons/business-product-scale--Streamline-Pixel.svg';
import shieldIcon from './icons/business-products-cash-shield--Streamline-Pixel.svg';
import trophyIcon from './icons/social-rewards-vip-crown-king--Streamline-Pixel.svg';
import usersIcon from './icons/multiple-user--Streamline-Pixel.svg';

const FO = "'Outfit', sans-serif";
const INK = 'var(--game-text)';
const TEXT = 'var(--game-text-secondary)';
const BORDER = 'var(--color-border)';
const SURFACE = 'rgba(255,255,255,0.72)';
const TEAL = 'var(--game-teal-mid)';
const TEAL_MID = 'var(--game-teal-mid)';
const CYAN = 'var(--color-chart-1)';
const DEEP = 'var(--color-chart-2)';
const SOFT_TEAL = 'var(--color-chart-6)';
const AMBER = 'var(--color-chart-4)';
const RED = 'var(--color-chart-5)';
const POSITIVE = 'var(--game-positive)';
const MUTED_BAR = 'var(--color-muted-foreground)';
const CTA_BG = 'var(--game-cta-gradient)';

// ════════ Cyan single-accent chart toolkit (/cyan-graphs) ════════════════════
const RAMP = [CYAN, 'var(--cyan-deep)', DEEP, SOFT_TEAL, MUTED_BAR];
const rampFill = (i: number) => RAMP[i % RAMP.length];
// Figma capture can't resolve var() inside SVG gradient stops — map to literal hex.
const GHEX: Record<string, string> = {
  'var(--color-chart-1)': '#00C1EB', 'var(--color-chart-2)': '#003D47', 'var(--color-chart-5)': '#C0392B',
  'var(--color-chart-6)': '#4DB5B6', 'var(--cyan-deep)': '#00A0C2', 'var(--game-positive)': '#156162',
  'var(--game-negative)': '#c65252', 'var(--color-chart-4)': '#B45309', 'var(--color-muted-foreground)': '#94A3B8',
  'var(--game-teal-mid)': '#006E85',
};
const solid = (c: string) => GHEX[c] ?? c;

function arSmooth(pts: [number, number][]) {
  if (pts.length < 2) return pts.length ? `M${pts[0][0]},${pts[0][1]}` : '';
  const f = (n: number) => Number(n.toFixed(4));
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1x = f(p1[0] + (p2[0] - p0[0]) / 6), c1y = f(p1[1] + (p2[1] - p0[1]) / 6);
    const c2x = f(p2[0] - (p3[0] - p1[0]) / 6), c2y = f(p2[1] - (p3[1] - p1[1]) / 6);
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${f(p2[0])},${f(p2[1])}`;
  }
  return d;
}

type ARTip = { x: number; y: number; label: string; value: string } | null;
function useARTip() {
  const [tip, setTip] = useState<ARTip>(null);
  return {
    tip,
    show: (e: React.MouseEvent, label: string, value: string) => setTip({ x: e.clientX, y: e.clientY, label, value }),
    hide: () => setTip(null),
  };
}
function ARTooltip({ tip }: { tip: ARTip }) {
  if (!tip || typeof document === 'undefined') return null;
  return createPortal(
    <div style={{
      position: 'fixed', left: tip.x + 14, top: tip.y + 14, zIndex: 60, pointerEvents: 'none',
      background: 'color-mix(in srgb, var(--game-dark) 90%, transparent)', color: 'var(--primary-foreground)',
      fontFamily: FO, fontSize: 11.5, fontWeight: 500, padding: '6px 10px', borderRadius: 8,
      boxShadow: '0 6px 18px rgba(0,44,51,0.22)', whiteSpace: 'nowrap',
    }}>
      <span style={{ opacity: 0.72 }}>{tip.label}</span>
      {tip.value && <span style={{ fontWeight: 700, marginLeft: 8 }}>{tip.value}</span>}
    </div>,
    document.body,
  );
}

type ARSeries = { name: string; color: string; data: number[]; area?: boolean; focus?: boolean; dashed?: boolean };
function ARLineChart({ xLabels, series, yMax, yTicks, fmtY, height = 280, legend = false, tipFmt }: {
  xLabels: string[]; series: ARSeries[]; yMax: number; yTicks: number[]; fmtY: (v: number) => string;
  height?: number; legend?: boolean; tipFmt?: (i: number) => string;
}) {
  const uid = React.useId().replace(/:/g, '');
  const W = 620, H = height, pad = { t: 18, r: 18, b: 30, l: 50 };
  const xAt = (i: number) => pad.l + (i / (xLabels.length - 1)) * (W - pad.l - pad.r);
  const yAt = (v: number) => pad.t + (1 - v / yMax) * (H - pad.t - pad.b);
  const line = (d: number[]) => arSmooth(d.map((v, i) => [xAt(i), yAt(v)] as [number, number]));
  const last = xLabels.length - 1;
  const [hi, setHi] = useState<number | null>(null);
  const { tip, show, hide } = useARTip();
  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const vx = ((e.clientX - r.left) / r.width) * W;
    let idx = 0, best = Infinity;
    xLabels.forEach((_, i) => { const d = Math.abs(xAt(i) - vx); if (d < best) { best = d; idx = i; } });
    setHi(idx);
    show(e, xLabels[idx], tipFmt ? tipFmt(idx) : series.map(s => `${s.name} ${fmtY(s.data[idx])}`).join(' · '));
  };
  return (
    <div style={{ position: 'relative' }}>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }} role="img"
        onMouseMove={onMove} onMouseLeave={() => { setHi(null); hide(); }}>
        <defs>
          {series.filter(s => s.area).map((s, i) => (
            <linearGradient key={i} id={`${uid}-a${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={solid(s.color)} stopOpacity={s.focus ? 0.2 : 0.14} />
              <stop offset="100%" stopColor={solid(s.color)} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {yTicks.map((t, i) => (
          <g key={i}>
            <line x1={pad.l} x2={W - pad.r} y1={yAt(t)} y2={yAt(t)} stroke={BORDER} strokeWidth="1" strokeDasharray="1,5" opacity="0.7" />
            <text x={pad.l - 8} y={yAt(t) + 4} textAnchor="end" fontSize="9.5" fill={MUTED_BAR} fontFamily={FO} style={{ fontVariantNumeric: 'tabular-nums' }}>{fmtY(t)}</text>
          </g>
        ))}
        {/* axes */}
        <line x1={pad.l} y1={pad.t} x2={pad.l} y2={H - pad.b} stroke={MUTED_BAR} strokeWidth="1.2" />
        <line x1={pad.l} y1={H - pad.b} x2={W - pad.r} y2={H - pad.b} stroke={MUTED_BAR} strokeWidth="1.2" />
        {xLabels.map((l, i) => <text key={i} x={xAt(i)} y={H - 10} textAnchor="middle" fontSize="10" fill={hi === i ? CYAN : MUTED_BAR} fontWeight={hi === i ? 700 : 400} fontFamily={FO}>{l}</text>)}
        {hi !== null && <line x1={xAt(hi)} x2={xAt(hi)} y1={pad.t} y2={H - pad.b} stroke={MUTED_BAR} strokeWidth="1" strokeDasharray="3,3" />}
        {series.map((s, si) => {
          const ai = series.filter(x => x.area).indexOf(s);
          return (
            <g key={si}>
              {s.area && <path d={`${line(s.data)} L${xAt(last)},${yAt(0)} L${xAt(0)},${yAt(0)} Z`} fill={`url(#${uid}-a${ai})`} stroke="none" />}
              <path d={line(s.data)} fill="none" stroke={s.color} strokeWidth={s.focus ? 2.6 : 1.8} strokeDasharray={s.dashed ? '4,3' : undefined} strokeLinecap="round" strokeLinejoin="round" opacity={s.focus ? 1 : 0.9} />
              <circle cx={xAt(last)} cy={yAt(s.data[last])} r={s.focus ? 4 : 3} fill="var(--color-card)" stroke={s.color} strokeWidth="2.4" />
              {hi !== null && <circle cx={xAt(hi)} cy={yAt(s.data[hi])} r={s.focus ? 5 : 3.5} fill={s.focus ? CYAN : s.color} stroke="var(--color-card)" strokeWidth="2" />}
            </g>
          );
        })}
      </svg>
      {legend && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', marginTop: 6 }}>
          {series.map((s, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: FO, fontSize: 11.5, color: TEXT }}>
              <span style={{ width: 10, height: 10, borderRadius: 99, background: s.color }} />{s.name}
            </span>
          ))}
        </div>
      )}
      <ARTooltip tip={tip} />
    </div>
  );
}

function ARBarGrads({ uid }: { uid: string }) {
  const g = (id: string, c: string) => (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1" key={id}>
      <stop offset="0%" stopColor={solid(c)} stopOpacity="0.95" />
      <stop offset="100%" stopColor={solid(c)} stopOpacity="0.5" />
    </linearGradient>
  );
  return <defs>{g(`${uid}-cyan`, CYAN)}{g(`${uid}-grey`, MUTED_BAR)}{g(`${uid}-rose`, RED)}{g(`${uid}-teal`, DEEP)}</defs>;
}

// Competition snapshot — vertical bars, "you" = cyan focus, others grey.
function ARCompetitionBars() {
  const uid = React.useId().replace(/:/g, '');
  const W = 560, H = 250, pad = { t: 30, r: 10, b: 28, l: 40 };
  const maxY = 40, ticks = [0, 10, 20, 30, 40];
  const yAt = (v: number) => pad.t + (1 - v / maxY) * (H - pad.t - pad.b);
  const slot = (W - pad.l - pad.r) / competitionShare.length, barW = slot * 0.5;
  const [hi, setHi] = useState<number | null>(null);
  const { tip, show, hide } = useARTip();
  return (
    <div style={{ position: 'relative' }}>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }} role="img" aria-label="Competition snapshot bar chart.">
        <ARBarGrads uid={uid} />
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={pad.l} x2={W - pad.r} y1={yAt(t)} y2={yAt(t)} stroke={t === 0 ? MUTED_BAR : BORDER} strokeWidth={t === 0 ? 1.2 : 1} strokeDasharray={t === 0 ? undefined : '1,5'} opacity={t === 0 ? 1 : 0.7} />
            <text x={pad.l - 8} y={yAt(t) + 4} textAnchor="end" fontSize="9.5" fill={MUTED_BAR} fontFamily={FO}>{t}%</text>
          </g>
        ))}
        <line x1={pad.l} y1={pad.t} x2={pad.l} y2={yAt(0)} stroke={MUTED_BAR} strokeWidth="1.2" />
        {competitionShare.map((d, i) => {
          const x = pad.l + i * slot + (slot - barW) / 2, y = yAt(d.share), h = yAt(0) - y, active = hi === i;
          return (
            <g key={d.team}>
              <rect x={x} y={y} width={barW} height={Math.max(h, 2)} rx="7" fill={`url(#${uid}-${d.you ? 'cyan' : 'grey'})`}
                style={{ opacity: hi === null || active ? 1 : 0.5, filter: active ? 'drop-shadow(0 4px 10px rgba(0,44,51,0.16))' : 'none', transition: 'opacity .15s' }} />
              <text x={x + barW / 2} y={y - 7} textAnchor="middle" fontSize="11" fontWeight="800" fontFamily={FO} fill={d.you ? TEAL : INK}>{d.share}%</text>
              <rect x={pad.l + i * slot} y={pad.t} width={slot} height={yAt(0) - pad.t} fill="transparent"
                onMouseEnter={() => setHi(i)} onMouseMove={(e) => show(e, d.team, `${d.share}%${d.rank ? ` · #${d.rank}` : ''}`)} onMouseLeave={() => { setHi(null); hide(); }} />
            </g>
          );
        })}
      </svg>
      <ARTooltip tip={tip} />
    </div>
  );
}

// Revenue → Profit waterfall (floating bars; revenue/profit cyan, costs rose).
function ARProfitBridge() {
  const uid = React.useId().replace(/:/g, '');
  const W = 600, H = 270, pad = { t: 28, r: 10, b: 30, l: 46 };
  const maxY = 3.6, ticks = [0, 1, 2, 3];
  const yAt = (v: number) => pad.t + (1 - v / maxY) * (H - pad.t - pad.b);
  const slot = (W - pad.l - pad.r) / profitBridge.length, barW = slot * 0.52;
  const [hi, setHi] = useState<number | null>(null);
  const { tip, show, hide } = useARTip();
  const gradFor = (label: string) => (label === 'Revenue' ? 'teal' : label === 'Net Profit' ? 'cyan' : 'rose');
  return (
    <div style={{ position: 'relative' }}>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }} role="img" aria-label="Revenue to profit waterfall.">
        <ARBarGrads uid={uid} />
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={pad.l} x2={W - pad.r} y1={yAt(t)} y2={yAt(t)} stroke={t === 0 ? MUTED_BAR : BORDER} strokeWidth={t === 0 ? 1.2 : 1} strokeDasharray={t === 0 ? undefined : '1,5'} opacity={t === 0 ? 1 : 0.7} />
            <text x={pad.l - 8} y={yAt(t) + 4} textAnchor="end" fontSize="9.5" fill={MUTED_BAR} fontFamily={FO}>{m(t)}</text>
          </g>
        ))}
        <line x1={pad.l} y1={pad.t} x2={pad.l} y2={yAt(0)} stroke={MUTED_BAR} strokeWidth="1.2" />
        {profitBridge.map((d, i) => {
          const top = d.base + d.delta, x = pad.l + i * slot + (slot - barW) / 2;
          const y = yAt(top), h = Math.max(yAt(d.base) - yAt(top), 2), active = hi === i;
          return (
            <g key={d.label}>
              <rect x={x} y={y} width={barW} height={h} rx="5" fill={`url(#${uid}-${gradFor(d.label)})`}
                style={{ opacity: hi === null || active ? 1 : 0.5, filter: active ? 'drop-shadow(0 4px 10px rgba(0,44,51,0.16))' : 'none', transition: 'opacity .15s' }} />
              {i < profitBridge.length - 1 && profitBridge[i + 1].label !== 'Net Profit' && <line x1={x + barW} x2={x + slot} y1={yAt(top)} y2={yAt(top)} stroke={MUTED_BAR} strokeDasharray="2,3" />}
              <text x={x + barW / 2} y={y - 6} textAnchor="middle" fontSize="9" fontWeight="800" fontFamily={FO} fill={d.label === 'Revenue' ? DEEP : d.label === 'Net Profit' ? TEAL : RED}>{d.display}</text>
              <text x={x + barW / 2} y={H - 10} textAnchor="middle" fontSize="8.5" fontFamily={FO} fontWeight="600" fill={active ? CYAN : TEXT}>{d.label}</text>
              <rect x={pad.l + i * slot} y={pad.t} width={slot} height={yAt(0) - pad.t} fill="transparent"
                onMouseEnter={() => setHi(i)} onMouseMove={(e) => show(e, d.label, `${d.display}${d.tag ? ` · ${d.tag}` : ''}`)} onMouseLeave={() => { setHi(null); hide(); }} />
            </g>
          );
        })}
      </svg>
      <ARTooltip tip={tip} />
    </div>
  );
}

// Inventory donut on cyan ramp.
function ARDonut({ data, centerTop, centerSub, size = 132 }: { data: { name: string; value: number; label: string }[]; centerTop: string; centerSub: string; size?: number }) {
  const cx = size / 2, cy = size / 2, R = size / 2 - 4, r = R - 22;
  const total = data.reduce((s, d) => s + d.value, 0);
  const f = (n: number) => Number(n.toFixed(4));
  let a0 = -Math.PI / 2;
  const arcs = data.map(d => {
    const sweep = (d.value / total) * Math.PI * 2, a1 = a0 + sweep, large = sweep > Math.PI ? 1 : 0;
    const p = `M${f(cx + Math.cos(a0) * R)},${f(cy + Math.sin(a0) * R)} A${R},${R} 0 ${large} 1 ${f(cx + Math.cos(a1) * R)},${f(cy + Math.sin(a1) * R)} L${f(cx + Math.cos(a1) * r)},${f(cy + Math.sin(a1) * r)} A${r},${r} 0 ${large} 0 ${f(cx + Math.cos(a0) * r)},${f(cy + Math.sin(a0) * r)} Z`;
    a0 = a1; return p;
  });
  const [hi, setHi] = useState<number | null>(null);
  const { tip, show, hide } = useARTip();
  return (
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
      <svg width={size} height={size} role="img" aria-label="Inventory outcome donut.">
        {arcs.map((p, i) => (
          <path key={i} d={p} fill={rampFill(i)} stroke={hi === i ? CYAN : 'var(--color-card)'} strokeWidth={hi === i ? 2 : 1.5}
            style={{ cursor: 'pointer', filter: hi === i ? 'drop-shadow(0 0 6px color-mix(in srgb, var(--color-chart-1) 55%, transparent))' : 'none', opacity: hi === null || hi === i ? 1 : 0.55 }}
            onMouseEnter={() => setHi(i)} onMouseMove={(e) => show(e, data[i].name, data[i].label)} onMouseLeave={() => { setHi(null); hide(); }} />
        ))}
        <text x={cx} y={cy - 1} textAnchor="middle" fontFamily={FO} fontWeight="800" fontSize="18" fill={INK}>{centerTop}</text>
        <text x={cx} y={cy + 13} textAnchor="middle" fontFamily={FO} fontSize="8.5" fill={TEXT} letterSpacing="0.04em">{centerSub}</text>
      </svg>
      <ARTooltip tip={tip} />
    </div>
  );
}

// Market pulse — stacked mix areas (cyan family) + footfall cyan line, dual axis.
function ARMarketPulse() {
  const uid = React.useId().replace(/:/g, '');
  const W = 640, H = 250, pad = { t: 16, r: 44, b: 28, l: 40 };
  const n = marketPulse.length;
  const xAt = (i: number) => pad.l + (i / (n - 1)) * (W - pad.l - pad.r);
  const yPct = (v: number) => pad.t + (1 - v / 100) * (H - pad.t - pad.b);
  const ffMax = 70;
  const yFf = (v: number) => pad.t + (1 - v / ffMax) * (H - pad.t - pad.b);
  // stack order bottom→top: value, balanced, premium
  const cum = marketPulse.map(d => ({ v: d.value, vb: d.value + d.balanced, vbp: d.value + d.balanced + d.premium }));
  const bandArea = (topVals: number[], botVals: number[]) => {
    const top = arSmooth(topVals.map((v, i) => [xAt(i), yPct(v)] as [number, number]));
    const bot = 'L' + arSmooth([...botVals.map((v, i) => [xAt(i), yPct(v)] as [number, number])].reverse()).slice(1);
    return `${top} ${bot} Z`;
  };
  const ffLine = arSmooth(marketPulse.map((d, i) => [xAt(i), yFf(d.footfall)] as [number, number]));
  const ticks = [0, 25, 50, 75, 100];
  const [hi, setHi] = useState<number | null>(null);
  const { tip, show, hide } = useARTip();
  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const vx = ((e.clientX - r.left) / r.width) * W;
    let idx = 0, best = Infinity;
    marketPulse.forEach((_, i) => { const d = Math.abs(xAt(i) - vx); if (d < best) { best = d; idx = i; } });
    setHi(idx);
    const d = marketPulse[idx];
    show(e, d.q, `Footfall ${d.footfall}K · V ${d.value}% B ${d.balanced}% P ${d.premium}%`);
  };
  return (
    <div style={{ position: 'relative' }}>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }} role="img" aria-label="Market pulse: footfall and mix over time."
        onMouseMove={onMove} onMouseLeave={() => { setHi(null); hide(); }}>
        <defs>
          <linearGradient id={`${uid}-ff`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={solid(CYAN)} stopOpacity="0.16" /><stop offset="100%" stopColor={solid(CYAN)} stopOpacity="0" /></linearGradient>
        </defs>
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={pad.l} x2={W - pad.r} y1={yPct(t)} y2={yPct(t)} stroke={BORDER} strokeWidth="1" strokeDasharray="1,5" opacity="0.6" />
            <text x={pad.l - 8} y={yPct(t) + 4} textAnchor="end" fontSize="9" fill={MUTED_BAR} fontFamily={FO}>{t}%</text>
          </g>
        ))}
        {/* stacked mix bands */}
        <path d={bandArea(cum.map(c => c.v), cum.map(() => 0))} fill={solid(MUTED_BAR)} opacity="0.18" />
        <path d={bandArea(cum.map(c => c.vb), cum.map(c => c.v))} fill={solid(SOFT_TEAL)} opacity="0.3" />
        <path d={bandArea(cum.map(c => c.vbp), cum.map(c => c.vb))} fill={solid(CYAN)} opacity="0.22" />
        {/* footfall line */}
        <path d={`${ffLine} L${xAt(n - 1)},${yFf(0)} L${xAt(0)},${yFf(0)} Z`} fill={`url(#${uid}-ff)`} stroke="none" />
        <path d={ffLine} fill="none" stroke={CYAN} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <line x1={pad.l} y1={pad.t} x2={pad.l} y2={H - pad.b} stroke={MUTED_BAR} strokeWidth="1.2" />
        <line x1={pad.l} y1={H - pad.b} x2={W - pad.r} y2={H - pad.b} stroke={MUTED_BAR} strokeWidth="1.2" />
        {[0, 35, 70].map((t, i) => <text key={i} x={W - pad.r + 6} y={yFf(t) + 4} textAnchor="start" fontSize="9" fill={MUTED_BAR} fontFamily={FO}>{t}K</text>)}
        {marketPulse.map((d, i) => (i % 4 === 0 ? <text key={i} x={xAt(i)} y={H - 10} textAnchor="middle" fontSize="9" fill={hi === i ? CYAN : MUTED_BAR} fontFamily={FO}>{d.q}</text> : null))}
        {hi !== null && <line x1={xAt(hi)} x2={xAt(hi)} y1={pad.t} y2={H - pad.b} stroke={MUTED_BAR} strokeWidth="1" strokeDasharray="3,3" />}
      </svg>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', marginTop: 6 }}>
        {[{ n: 'Total Footfall', c: CYAN, line: true }, { n: 'Premium Loyalists', c: CYAN }, { n: 'Balanced Buyers', c: SOFT_TEAL }, { n: 'Value Seekers', c: MUTED_BAR }].map((s, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: FO, fontSize: 11, color: TEXT }}>
            {s.line ? <svg width="16" height="6"><line x1="0" y1="3" x2="16" y2="3" stroke={s.c} strokeWidth="2.4" /></svg> : <span style={{ width: 9, height: 9, borderRadius: 2, background: s.c, opacity: 0.6 }} />}{s.n}
          </span>
        ))}
      </div>
      <ARTooltip tip={tip} />
    </div>
  );
}

// Smooth tapering cyan funnel band (quarterly style).
function ARFunnel() {
  const nums = funnel.map(f => Number(f.value.replace(/,/g, '')));
  const W = 560, H = 250, padL = 8, padR = 8, plotTop = 44, plotBottom = 198;
  const midY = (plotTop + plotBottom) / 2, maxHalf = 68, max = nums[0], n = nums.length;
  const segW = (W - padL - padR) / n;
  const cxAt = (i: number) => padL + segW * (i + 0.5);
  const half = (v: number) => (v / max) * maxHalf;
  const tops: [number, number][] = nums.map((v, i) => [cxAt(i), midY - half(v)]);
  const bots: [number, number][] = nums.map((v, i) => [cxAt(i), midY + half(v)]);
  const topsE: [number, number][] = [[padL, tops[0][1]], ...tops, [W - padR, tops[n - 1][1]]];
  const botsE: [number, number][] = [[padL, bots[0][1]], ...bots, [W - padR, bots[n - 1][1]]];
  const bandD = `${arSmooth(topsE)} ${'L' + arSmooth([...botsE].reverse()).slice(1)} Z`;
  const uid = React.useId().replace(/:/g, '');
  const [hi, setHi] = useState<number | null>(null);
  const { tip, show, hide } = useARTip();
  return (
    <div style={{ position: 'relative' }}>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }} role="img" aria-label="Acquisition and loyalty funnel.">
        <defs><linearGradient id={`${uid}-f`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={solid(CYAN)} stopOpacity="0.92" /><stop offset="100%" stopColor={solid(CYAN)} stopOpacity="0.42" /></linearGradient></defs>
        <path d={bandD} fill={`url(#${uid}-f)`} />
        {nums.slice(1).map((_, i) => { const x = padL + segW * (i + 1); return <line key={i} x1={x} x2={x} y1={plotTop} y2={plotBottom} stroke="var(--color-card)" strokeWidth="1.5" opacity="0.7" />; })}
        {funnel.map((f, i) => {
          const x0 = padL + segW * i, active = hi === i, pill = f.step ?? '100%';
          return (
            <g key={f.stage}>
              {active && <rect x={x0} y={plotTop} width={segW} height={plotBottom - plotTop} fill={CYAN} opacity="0.1" />}
              <text x={cxAt(i)} y={30} textAnchor="middle" fontFamily={FO} fontWeight="800" fontSize="14.5" fill={active ? CYAN : INK} style={{ fontVariantNumeric: 'tabular-nums' }}>{f.value}</text>
              <rect x={cxAt(i) - 25} y={midY - 12} width="50" height="24" rx="12" fill={active ? CYAN : 'var(--color-card)'} stroke={active ? CYAN : BORDER} strokeWidth="1" />
              <text x={cxAt(i)} y={midY + 4} textAnchor="middle" fontFamily={FO} fontWeight="800" fontSize="12" fill={active ? 'var(--primary-foreground)' : INK}>{pill}</text>
              <text x={cxAt(i)} y={plotBottom + 26} textAnchor="middle" fontFamily={FO} fontSize="10.5" fontWeight={active ? 800 : 600} fill={active ? CYAN : TEXT}>{f.stage}</text>
              <rect x={x0} y={plotTop} width={segW} height={plotBottom - plotTop + 32} fill="transparent"
                onMouseEnter={() => setHi(i)} onMouseMove={(e) => show(e, f.stage, `${f.value} · ${f.note}`)} onMouseLeave={() => { setHi(null); hide(); }} />
            </g>
          );
        })}
      </svg>
      <ARTooltip tip={tip} />
    </div>
  );
}

// Cyan radial gauge (replaces Recharts ring).
function ARRadial({ pct, color, center, sub, max = 100 }: { pct: number; color: string; center: string; sub: string; max?: number }) {
  const size = 110, cx = size / 2, cy = size / 2, R = 48, r = 34, mid = (R + r) / 2, ringW = R - r;
  const frac = Math.min(1, pct / max), a0 = -Math.PI / 2, a1 = a0 + frac * Math.PI * 2, large = frac > 0.5 ? 1 : 0;
  const f = (n: number) => Number(n.toFixed(4));
  const arc = (s: number, e: number, lg: number) => `M${f(cx + Math.cos(s) * mid)},${f(cy + Math.sin(s) * mid)} A${mid},${mid} 0 ${lg} 1 ${f(cx + Math.cos(e) * mid)},${f(cy + Math.sin(e) * mid)}`;
  return (
    <div className="relative mt-1" style={{ height: 110 }}>
      <svg width={size} height={size} style={{ display: 'block', margin: '0 auto' }} role="img" aria-label={`${center} ${sub}`}>
        <path d={arc(a0, a0 + Math.PI * 1.999, 1)} fill="none" stroke="var(--muted)" strokeWidth={ringW} strokeLinecap="round" />
        <path d={arc(a0, a1, large)} fill="none" stroke={color} strokeWidth={ringW} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span style={{ color: INK, fontSize: 18, fontWeight: 800 }}>{center}</span>
        {sub && <span style={{ color: TEXT, fontSize: 9, fontWeight: 600 }}>{sub}</span>}
      </div>
    </div>
  );
}

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'customers', label: 'Performance & Customers' },
  { id: 'finance', label: 'Finance & Operations' },
];

// ─── Page 1 · Overview data ──────────────────────────────────────────────────
const competitionShare = [
  { team: 'Team Alpha', share: 21.8, rank: 2, you: false },
  { team: 'Dhaulagiri Cafe', share: 32.4, rank: 1, you: true },
  { team: 'Team Beta', share: 16.7, rank: 3, you: false },
  { team: 'Team Gamma', share: 11.3, rank: null, you: false },
  { team: 'Others', share: 17.8, rank: null, you: false },
];

const growthTrajectory = [
  { year: 'Year 1', revenue: 0.62, profit: 0.09, valuation: 1.24 },
  { year: 'Year 2', revenue: 1.18, profit: 0.24, valuation: 2.9 },
  { year: 'Year 3', revenue: 1.86, profit: 0.42, valuation: 4.6 },
  { year: 'Year 4', revenue: 2.5, profit: 0.64, valuation: 6.4 },
  { year: 'Year 5', revenue: 3.24, profit: 0.864, valuation: 8.45 },
];

const businessSnapshot = [
  { metric: 'Market Share', you: '32.4%', average: '18.7%', top: '32.4%' },
  { metric: 'Retention (Repeat Customers)', you: '71.0%', average: '51.6%', top: '72.9%' },
  { metric: 'Occupancy Rate', you: '74.1%', average: '58.9%', top: '82.3%' },
  { metric: 'Waste Rate (of COGS)', you: '4.6%', average: '7.8%', top: '3.2%' },
  { metric: 'Avg. Order Value', you: '$18.40', average: '$14.20', top: '$21.30' },
  { metric: 'Founder Ownership', you: '63.9%', average: '32.8%', top: '71.5%' },
];

const winningMeant = [
  { icon: reportChartIcon, title: 'Market Performance', body: 'Capture demand, grow share, and outpace the competition.' },
  { icon: usersIcon, title: 'Customer Loyalty', body: 'Delight customers so they return, recommend, and spend more.' },
  { icon: shieldIcon, title: 'Operational Discipline', body: 'Control costs, reduce waste, and run a consistently great café.' },
  { icon: moneyIcon, title: 'Financial Strength', body: 'Build profit, grow valuation, and retain lasting ownership.' },
];

const keyDrivers = [
  { icon: badgeIcon, title: 'Pricing Discipline', body: 'Smart pricing lifted margins without sacrificing volumes.', stat: '+6.2pp vs. average margin' },
  { icon: usersIcon, title: 'Retention Compounded', body: 'Loyal customers came back more often and spent more.', stat: '+16.6pp vs. average retention' },
  { icon: shieldIcon, title: 'Waste Control', body: 'Tight portioning and forecasting kept waste low and profits high.', stat: '-3.2pp vs. average waste rate' },
  { icon: reportChartIcon, title: 'Selective Investment', body: 'Focused capex in the right places drove returns that scaled.', stat: '+62% vs. average valuation' },
];

// ─── Page 2 · Performance & Customers data ───────────────────────────────────
const competitiveLandscape = [
  { year: 'Year 1', dhaulagiri: 19.5, alpha: 22.0, beta: 20.5, gamma: 11.0, others: 9.5 },
  { year: 'Year 2', dhaulagiri: 24.0, alpha: 24.5, beta: 21.0, gamma: 10.8, others: 8.7 },
  { year: 'Year 3', dhaulagiri: 28.0, alpha: 26.0, beta: 21.4, gamma: 10.6, others: 8.0 },
  { year: 'Year 4', dhaulagiri: 30.5, alpha: 27.2, beta: 21.6, gamma: 10.5, others: 7.6 },
  { year: 'Year 5', dhaulagiri: 32.4, alpha: 28.1, beta: 21.7, gamma: 10.5, others: 7.3 },
];

const funnel = [
  { stage: 'Awareness', value: '520,000', note: '100% of market', step: null },
  { stage: 'Visits', value: '201,760', note: '38.8% of aware', step: '38.8%' },
  { stage: 'Purchases', value: '62,120', note: '30.8% of visits', step: '30.8%' },
  { stage: 'Repeat Customers', value: '39,110', note: '63.0% of purchasers', step: '63.0%' },
  { stage: 'Loyal Customers', value: '20,920', note: '53.5% of repeat', step: '53.5%' },
];

const segments = [
  { name: 'Value Seekers', revenue: '42%', spend: '$9.10', retention: '59.3%', growth: '+12.4%' },
  { name: 'Balanced Buyers', revenue: '37%', spend: '$16.80', retention: '71.2%', growth: '+18.7%' },
  { name: 'Premium Loyalists', revenue: '21%', spend: '$32.60', retention: '82.6%', growth: '+21.3%' },
];

const productMix = [
  { name: 'Espresso', revenue: '28.6%', units: '24,580', tone: 'dark' },
  { name: 'Cappuccino', revenue: '23.4%', units: '20,120', tone: 'dark' },
  { name: 'Cold Brew', revenue: '16.8%', units: '14,520', tone: 'dark' },
  { name: 'Croissant', revenue: '15.2%', units: '12,480', tone: 'light' },
  { name: 'Muffin', revenue: '9.8%', units: '8,040', tone: 'light' },
  { name: 'Whole Bean', revenue: '6.2%', units: '3,920', tone: 'light' },
];

const marketPulse = Array.from({ length: 20 }, (_, index) => {
  const year = Math.floor(index / 4) + 1;
  const quarter = (index % 4) + 1;
  const progress = index / 19;

  return {
    q: `Q${quarter}Y${year}`,
    footfall: Math.round(19 + 46 * progress + 2 * Math.sin(index * 1.15)),
    value: Math.round(60 - 18 * progress),
    balanced: Math.round(30 + 7 * progress),
    premium: Math.round(10 + 11 * progress),
  };
});

const wonCustomers = [
  { icon: badgeIcon, title: 'Smart Pricing', body: 'Well-priced core items drove higher visits without hurting margins.', stat: '+2.6pp', sub: 'Conversion Uplift' },
  { icon: usersIcon, title: 'Better Retention', body: 'Loyalty programs and consistency built strong repeat behavior.', stat: '+9.8pp', sub: 'Retention Lift' },
  { icon: reportChartIcon, title: 'Stronger Segment Fit', body: 'You matched offerings to segment needs better than competitors.', stat: '+4.3pp', sub: 'Share Advantage' },
];

// ─── Page 3 · Finance & Operations data ──────────────────────────────────────
// Waterfall: base = transparent floor, delta = visible segment (in $M)
const profitBridge = [
  { label: 'Revenue', base: 0, delta: 3.24, color: TEAL, display: '$3.24M', tag: '' },
  { label: 'COGS', base: 2.01, delta: 1.23, color: RED, display: '-$1.23M', tag: '38.0%' },
  { label: 'Labor', base: 1.45, delta: 0.56, color: AMBER, display: '-$0.56M', tag: '17.3%' },
  { label: 'Rent', base: 1.22, delta: 0.23, color: AMBER, display: '-$0.23M', tag: '7.1%' },
  { label: 'Marketing', base: 1.03, delta: 0.19, color: AMBER, display: '-$0.19M', tag: '5.9%' },
  { label: 'Other Opex', base: 0.86, delta: 0.17, color: AMBER, display: '-$0.17M', tag: '5.2%' },
  { label: 'Net Profit', base: 0, delta: 0.864, color: CYAN, display: '$864K', tag: '26.7%' },
];

const cashValuation = [
  { year: 'Year 1', cash: 0.4, valuation: 1.24 },
  { year: 'Year 2', cash: 0.85, valuation: 2.9 },
  { year: 'Year 3', cash: 1.35, valuation: 4.6 },
  { year: 'Year 4', cash: 1.9, valuation: 6.4 },
  { year: 'Year 5', cash: 2.5, valuation: 8.45 },
];

const inventoryOutcome = [
  { name: 'Sold', value: 8620, label: '8,620 (82%)', color: TEAL },
  { name: 'Unsold', value: 1210, label: '1,210 (12%)', color: MUTED_BAR },
  { name: 'Expired', value: 420, label: '420 (4%)', color: AMBER },
  { name: 'Damaged', value: 250, label: '250 (2%)', color: RED },
];

const ownership = [
  { label: 'Founder Ownership', pct: 63.9, color: DEEP },
  { label: 'Investor Ownership', pct: 29.2, color: CYAN },
  { label: 'Option Pool', pct: 6.9, color: MUTED_BAR },
];

const businessLessons = [
  { icon: badgeIcon, title: 'Pricing Discipline', body: 'Smart pricing protected margins and funded growth without sacrificing value.' },
  { icon: usersIcon, title: 'Retention Compounding', body: 'Loyal customers came back more often and spent more—compounding your results.' },
  { icon: shieldIcon, title: 'Waste Control', body: 'Tight inventory and forecasting kept waste low and profits high.' },
  { icon: reportChartIcon, title: 'Selective Investment', body: 'Focused capex in the right places drove returns that scaled the business.' },
];

const finalStanding = [
  { icon: reportChartIcon, title: 'Sustainable Business', value: 'Profitable & Cash Generative' },
  { icon: buildingIcon, title: 'Strong Valuation', value: '$8.45M Company Value' },
  { icon: usersIcon, title: 'Ownership Retained', value: '63.9% Founder Owned' },
  { icon: trophyIcon, title: 'Competitive Position', value: '32.4% Share, #1 of 4' },
];

function m(value: number) {
  if (value === 0) return '$0';
  if (value < 1) return `$${Math.round(value * 1000)}K`;
  return `$${value.toFixed(value >= 10 ? 0 : 2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1')}M`;
}

type ChartCell = string | number | null;
type ChartRow = Record<string, ChartCell>;

const operationControlRows = [
  { metric: 'Inventory sold', value: '8,620 units', detail: '82% sell-through' },
  { metric: 'Inventory unsold', value: '1,210 units', detail: '12% of purchased' },
  { metric: 'Inventory expired', value: '420 units', detail: '4% of purchased' },
  { metric: 'Inventory damaged', value: '250 units', detail: '2% of purchased' },
  { metric: 'Space utilization', value: '88%', detail: '$16,400 average monthly rent' },
  { metric: 'Staff productivity', value: '$68.4K', detail: '+32% vs. average, 15 employees' },
  { metric: 'Waste rate', value: '4.6%', detail: '$68.2K waste cost' },
  { metric: 'Supplier performance', value: '4.2 / 5.0', detail: '8 miles average delivery distance' },
];

const mascotAssets = [
  { src: '/annual-report/clean/mascot-value-seekers.png', label: 'Value Seekers mascot', icon: priceTagIcon, width: 1103, height: 1938 },
  { src: '/annual-report/clean/mascot-balanced-buyers.png', label: 'Balanced Buyers mascot', icon: scaleIcon, width: 1052, height: 1970 },
  { src: '/annual-report/clean/mascot-premium-loyalists.png', label: 'Premium Loyalists mascot', icon: trophyIcon, width: 1082, height: 1715 },
];

function tableCell(value: ChartCell) {
  return value === null ? 'N/A' : String(value);
}

const REPORT_SUMMARY = `Dhaulagiri Cafe — Annual Report (End of Year 5)

Revenue:           $3.24M  (+54% vs. average · 26.7% margin)
Net Profit:        $864K   (26.7% margin)
Company Valuation: $8.45M  (+62% vs. average)
Founder Retained:  $5.41M  (63.9% of valuation)

Market Share:      32.4%   (#1 of 4 teams · 4.3pp lead)
Total Customers:   86,420  (+58.6% vs. Year 4)
Retention:         71.0%   (+9.8pp vs. Year 4)
Avg. Order Value:  $18.40  (+6.1% vs. Year 4)
Operating Margin:  26.7%   (+8.2pp vs. average)

Strong Operator. Smart Builder. True Founder.`;

function AnnualAssetStyles() {
  return (
    <style>{`
      .annual-dot-canvas > .absolute {
        background-image: radial-gradient(circle at 1px 1px, rgba(0, 110, 133, 0.28) 1px, transparent 1.3px) !important;
        background-size: 18px 18px !important;
        opacity: 0.34 !important;
      }

      .annual-chart-enter {
        animation: annualFadeUp 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
      }

      @keyframes annualFadeUp {
        from {
          opacity: 0;
          transform: translate3d(0, 8px, 0);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
      }

      .pm-row {
        transition: background 0.15s ease;
      }

      .pm-row:hover {
        background: color-mix(in srgb, var(--color-chart-1) 5%, transparent);
      }

      .ar-lift {
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .ar-lift:hover {
        transform: translateY(-3px);
        box-shadow: 0 16px 36px rgba(0, 44, 51, 0.13);
      }

      @media (prefers-reduced-motion: reduce) {
        .annual-chart-enter {
          animation: none;
        }
        .ar-lift {
          transition: none;
        }
        .ar-lift:hover {
          transform: none;
        }
      }

      .annual-tip {
        position: relative;
        outline: none;
      }

      .annual-tip::after {
        background: #ffffff;
        border: 1px solid #c8dde6;
        border-radius: 12px;
        box-shadow: none;
        color: #202326;
        content: attr(data-tip);
        font-family: Outfit, sans-serif;
        font-size: 11px;
        font-variant-numeric: tabular-nums;
        font-weight: 700;
        left: 50%;
        line-height: 1.35;
        max-width: 240px;
        opacity: 0;
        padding: 9px 10px;
        pointer-events: none;
        position: absolute;
        top: calc(100% + 8px);
        transform: translateX(-50%) translateY(-4px);
        transition: opacity 120ms ease, transform 120ms ease;
        white-space: normal;
        width: max-content;
        z-index: 30;
      }

      .annual-tip:hover::after,
      .annual-tip:focus-visible::after {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    `}</style>
  );
}

function AccessibleChart({
  children,
  columns,
  rows,
  summary,
}: {
  children: React.ReactNode;
  columns: string[];
  rows: ChartRow[];
  summary: string;
}) {
  return (
    <figure className="annual-chart-enter m-0" aria-label={summary} role="group" style={{ fontVariantNumeric: 'tabular-nums' }}>
      {children}
      <table className="sr-only">
        <caption>{summary}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {columns.map((column, columnIndex) => (
                columnIndex === 0 ? (
                  <th key={column} scope="row">
                    {tableCell(row[column])}
                  </th>
                ) : (
                  <td key={column}>{tableCell(row[column])}</td>
                )
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

function ChartLegend({ items }: { items: Array<{ label: string; color: string; note?: string }> }) {
  return (
    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2" style={{ color: TEXT, fontSize: 11, fontWeight: 700 }}>
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-2">
          <span aria-hidden="true" style={{ background: item.color, borderRadius: 999, display: 'inline-block', height: 8, width: 18 }} />
          <span>
            {item.label}
            {item.note && <span style={{ color: INK, fontVariantNumeric: 'tabular-nums' }}> {item.note}</span>}
          </span>
        </span>
      ))}
    </div>
  );
}

export function AnnualReport({ initialTab = 'overview' }: { initialTab?: 'overview' | 'customers' | 'finance' } = {}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [copied, setCopied] = useState(false);
  const navigate = useAppNavigate();

  function handleCopy() {
    navigator.clipboard.writeText(REPORT_SUMMARY).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const sub =
    activeTab === 'finance'
      ? 'You built more than a business—you built a system. Great operators don’t just grow; they compound on discipline, focus, and smart decisions.'
      : 'Five years, one location, every decision compounded. Here is what you built — how you competed, what you sold, how much you earned, and what you kept.';

  return (
    <GridBackground className="annual-dot-canvas">
      <AnnualAssetStyles />
      <PageTransition>
        <main className="mx-auto w-full max-w-[1312px] px-6 pb-16 pt-5">
          <header className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <span style={styles.eyebrow}>End of Year 5 · Final Evaluation</span>
              <h1 style={styles.h1}>Annual Report</h1>
              <p style={styles.sub}>{sub}</p>
              <div
                className="mt-4 inline-flex items-center gap-2"
                style={{ background: '#E0F7FF', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '10px 14px' }}
              >
                <Star size={16} color={TEAL} />
                <span style={{ color: TEAL, fontSize: 13, fontWeight: 700 }}>You turned a vision into value that lasts.</span>
              </div>
            </div>
            <div
              style={{
                width: '100%',
                maxWidth: 430,
                aspectRatio: '1880 / 960',
                borderRadius: 0,
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <Image
                src="/annual-report/clean/hero-cafe-vignette.png"
                alt="Dhaulagiri Cafe illustration"
                width={1880}
                height={1082}
                style={{ display: 'block', height: 'auto', width: '100%' }}
                priority
              />
            </div>
          </header>

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <span style={styles.metaPill}>Team: Dhaulagiri Cafe</span>
            <div className="flex flex-wrap gap-2">
              <ActionButton icon={copied ? <Check size={16} /> : <Copy size={16} />} onClick={handleCopy}>
                {copied ? 'Copied' : 'Copy'}
              </ActionButton>
              <ActionButton icon={<DsIcon icon={downloadIcon} size={16} />}>Export</ActionButton>
              <ActionButton icon={<DsIcon icon={trophyIcon} size={16} />} primary onClick={() => navigate('/ref/game/leaderboard')}>
                View Leaderboard
              </ActionButton>
            </div>
          </div>

          <div className="mb-5">
            <TabBar tabs={tabs} activeTab={activeTab} onChange={(id) => setActiveTab(id as 'overview' | 'customers' | 'finance')} />
          </div>

          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'customers' && <CustomersTab />}
          {activeTab === 'finance' && <FinanceTab />}

          <footer className="mt-8 flex items-center justify-between border-t border-[#C8DDE6] pt-5">
            <span className="inline-flex items-center gap-2" style={{ color: TEXT, fontSize: 13, fontWeight: 600 }}>
              <Star size={14} color={TEAL} />
              Strong choices. Steady execution. Sustainable success.
            </span>
            <span style={{ color: TEXT, fontSize: 12, fontWeight: 600 }}>
              {activeTab === 'overview' ? 'Page 1 of 3' : activeTab === 'customers' ? 'Page 2 of 3' : 'Page 3 of 3'}
            </span>
          </footer>
        </main>
      </PageTransition>
    </GridBackground>
  );
}

// ═══ PAGE 1 · OVERVIEW ════════════════════════════════════════════════════════
function OverviewTab() {
  return (
    <div className="flex flex-col gap-4">
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Kpi icon={reportChartIcon} label="Revenue" value="$3.24M" detail="+54% vs. average" />
        <Kpi icon={moneyIcon} label="Net Profit" value="$864K" detail="26.7% margin" />
        <Kpi icon={buildingIcon} label="Company Valuation" value="$8.45M" detail="+62% vs. average" />
        <Kpi icon={usersIcon} label="Founder Retained" value="$5.41M" detail="63.9% of valuation" accent />
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        {/* Competition Snapshot */}
        <Panel>
          <ChartTitle icon={reportChartIcon} title="Competition Snapshot" subtitle="Market share of total industry revenue." />
          <AccessibleChart
            summary="Competition Snapshot: Dhaulagiri Cafe finished first with 32.4% market share, ahead of Team Alpha at 21.8%."
            columns={['Team', 'Share', 'Rank']}
            rows={competitionShare.map((d) => ({ Team: d.team, Share: `${d.share}%`, Rank: d.rank ? `#${d.rank}` : 'Unranked' }))}
          >
            <div className="mt-2"><ARCompetitionBars /></div>
            <ChartLegend
              items={[
                { label: 'Dhaulagiri Cafe', color: TEAL, note: '32.4% / #1' },
                { label: 'Other teams and market', color: MUTED_BAR },
              ]}
            />
            <div className="mt-2 grid grid-cols-5 gap-2">
              {competitionShare.map((d) => (
                <div key={d.team} className="flex flex-col items-center gap-1" style={{ textAlign: 'center' }}>
                  {d.rank ? (
                    <span style={{ width: 22, height: 22, borderRadius: '50%', background: d.you ? TEAL : '#94A3B8', color: 'white', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{d.rank}</span>
                  ) : (
                    <span style={{ width: 22, height: 22 }} />
                  )}
                  <span style={{ fontSize: 9, fontWeight: 700, color: d.you ? TEAL : TEXT, lineHeight: 1.2 }}>{d.team}</span>
                </div>
              ))}
            </div>
          </AccessibleChart>
          <Callout>You led the market with 32.4% share — the strongest position in the valley.</Callout>
        </Panel>

        {/* Growth Trajectory */}
        <Panel>
          <ChartTitle icon={reportChartIcon} title="Growth Trajectory" subtitle="Five-year performance across key metrics." />
          <AccessibleChart
            summary="Growth Trajectory: revenue grew from $0.62M to $3.24M, net profit from $90K to $864K, and valuation from $1.24M to $8.45M."
            columns={['Year', 'Revenue', 'Net Profit', 'Valuation']}
            rows={growthTrajectory.map((d) => ({ Year: d.year, Revenue: m(d.revenue), 'Net Profit': m(d.profit), Valuation: m(d.valuation) }))}
          >
            <div className="mt-1">
              <ARLineChart
                xLabels={growthTrajectory.map((d) => d.year)}
                yMax={10}
                yTicks={[0, 2.5, 5, 7.5, 10]}
                fmtY={(v) => m(v)}
                height={290}
                series={[
                  { name: 'Valuation', color: SOFT_TEAL, data: growthTrajectory.map((d) => d.valuation), area: true },
                  { name: 'Revenue', color: CYAN, data: growthTrajectory.map((d) => d.revenue), area: true, focus: true },
                  { name: 'Net Profit', color: DEEP, data: growthTrajectory.map((d) => d.profit) },
                ]}
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <div
                style={{
                  background: '#FFFFFF',
                  border: `1.4px solid ${BORDER}`,
                  borderRadius: 12,
                  color: INK,
                  fontFamily: FO,
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '6px 12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: 'var(--shadow-elev-1)',
                }}
              >
                <span style={{ color: TEAL, display: 'inline-flex' }}>
                  <DsIcon icon={buildingIcon} size={14} />
                </span>
                <span>
                  Valuation: <span style={{ fontWeight: 800 }}>$8.45M</span>
                </span>
              </div>
              <div
                style={{
                  background: '#FFFFFF',
                  border: `1.4px solid ${BORDER}`,
                  borderRadius: 12,
                  color: INK,
                  fontFamily: FO,
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '6px 12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: 'var(--shadow-elev-1)',
                }}
              >
                <span style={{ color: TEAL, display: 'inline-flex' }}>
                  <DsIcon icon={reportChartIcon} size={14} />
                </span>
                <span>
                  Revenue: <span style={{ fontWeight: 800 }}>$3.24M</span>
                </span>
              </div>
              <div
                style={{
                  background: '#FFFFFF',
                  border: `1.4px solid ${BORDER}`,
                  borderRadius: 12,
                  color: INK,
                  fontFamily: FO,
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '6px 12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: 'var(--shadow-elev-1)',
                }}
              >
                <span style={{ color: TEAL, display: 'inline-flex' }}>
                  <DsIcon icon={moneyIcon} size={14} />
                </span>
                <span>
                  Net Profit: <span style={{ fontWeight: 800 }}>$864K</span>
                </span>
              </div>
            </div>
          </AccessibleChart>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        {/* Business Snapshot */}
        <Panel>
          <span style={styles.eyebrow}>Benchmarked</span>
          <h2 style={styles.h2}>Business Snapshot</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse', fontFamily: FO }}>
              <thead>
                <tr>
                  {['Metric', 'You', 'Average', 'Top'].map((head, i) => (
                    <th key={head} style={{ ...styles.th, textAlign: i === 0 ? 'left' : 'right' }}>{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {businessSnapshot.map((row) => (
                  <tr key={row.metric}>
                    <td style={styles.td}>{row.metric}</td>
                    <td style={{ ...styles.td, ...styles.num, color: TEAL, fontWeight: 800 }}>{row.you}</td>
                    <td style={{ ...styles.td, ...styles.num, color: TEXT }}>{row.average}</td>
                    <td style={{ ...styles.td, ...styles.num, color: TEXT }}>{row.top}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* What Winning Meant */}
        <Panel>
          <span style={styles.eyebrow}>The Scoreboard</span>
          <h2 style={styles.h2}>What Winning Meant in Startup Valley</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {winningMeant.map((item) => (
              <IconRow key={item.title} icon={item.icon} title={item.title} body={item.body} />
            ))}
          </div>
        </Panel>
      </div>

      {/* Why You Won / Key Drivers */}
      <Panel>
        <span style={styles.eyebrow}>Why You Won</span>
        <h2 style={styles.h2}>Key Drivers</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {keyDrivers.map((item) => (
            <div key={item.title} className="flex flex-col gap-3 rounded-xl border border-[#C8DDE6] bg-white p-4">
              <div style={styles.iconShell}><DsIcon icon={item.icon} size={20} /></div>
              <div>
                <div style={{ color: INK, fontSize: 14, fontWeight: 800 }}>{item.title}</div>
                <p style={{ color: TEXT, fontSize: 12, lineHeight: 1.5, marginTop: 4 }}>{item.body}</p>
              </div>
              <StatChip text={item.stat} positive={!item.stat.startsWith('-')} />
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

// ═══ PAGE 2 · PERFORMANCE & CUSTOMERS ═════════════════════════════════════════
function CustomersTab() {
  return (
    <div className="flex flex-col gap-4">
      <Panel style={{ overflow: 'hidden', padding: 0 }}>
        <div style={{ borderBottom: '1px solid color-mix(in srgb, var(--game-dark) 10%, transparent)', padding: '16px 20px 0' }}>
          <CafeInteriorStrip />
        </div>
        <div className="flex flex-col gap-2 px-5 pb-5 pt-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span style={styles.reportChip}>Performance & Customers</span>
            <h2 style={{ ...styles.h1, fontSize: 30, marginTop: 10 }}>How Dhaulagiri Cafe Won Its Market</h2>
          </div>
          <p style={{ ...styles.sub, maxWidth: 410 }}>
            A five-year customer story told through market share, loyalty, product mix, and the levers that compounded.
          </p>
        </div>
      </Panel>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <ReportKpi label="Market Share" value="32.4%" detail="#1 out of 4 teams" accent data={[19.5, 24, 28, 30.5, 32.4]} />
        <ReportKpi label="Total Customers" value="86,420" detail="+58.6% vs Year 4" data={[33, 41, 55, 69, 86]} />
        <ReportKpi label="Customer Retention" value="71.0%" detail="+9.8 pp vs Year 4" data={[49, 55, 61, 66, 71]} />
        <ReportKpi label="Avg. Order Value" value="$18.40" detail="+6.1% vs Year 4" data={[12.9, 14.1, 15.5, 17.3, 18.4]} />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
        <Panel>
          <ReportSectionLabel eyebrow="Competitive Landscape" title="Market share evolution over 5 years" />
          <AccessibleChart
            summary="Competitive Landscape: Dhaulagiri Cafe rose every year from 19.5% to 32.4% and finished with a 4.3 percentage point lead over Team Alpha."
            columns={['Year', 'Dhaulagiri Cafe', 'Team Alpha', 'Team Beta', 'Team Gamma', 'Others']}
            rows={competitiveLandscape.map((d) => ({
              Year: d.year,
              'Dhaulagiri Cafe': `${d.dhaulagiri}%`,
              'Team Alpha': `${d.alpha}%`,
              'Team Beta': `${d.beta}%`,
              'Team Gamma': `${d.gamma}%`,
              Others: `${d.others}%`,
            }))}
          >
            <div className="mt-1">
              <ARLineChart
                xLabels={competitiveLandscape.map((d) => d.year)}
                yMax={40}
                yTicks={[0, 10, 20, 30, 40]}
                fmtY={(v) => `${v}%`}
                height={250}
                legend
                series={[
                  { name: 'Dhaulagiri Cafe', color: CYAN, data: competitiveLandscape.map((d) => d.dhaulagiri), area: true, focus: true },
                  { name: 'Team Alpha', color: 'var(--cyan-deep)', data: competitiveLandscape.map((d) => d.alpha) },
                  { name: 'Team Beta', color: DEEP, data: competitiveLandscape.map((d) => d.beta) },
                  { name: 'Team Gamma', color: SOFT_TEAL, data: competitiveLandscape.map((d) => d.gamma) },
                  { name: 'Others', color: MUTED_BAR, data: competitiveLandscape.map((d) => d.others), dashed: true },
                ]}
              />
            </div>
          </AccessibleChart>
          <InsightBanner>You grew market share every year and finished #1 with a 4.3 pp lead.</InsightBanner>
        </Panel>

        <Panel>
          <ReportSectionLabel eyebrow="Acquisition & Loyalty Funnel" title="From awareness to loyal customers" />
          <AccessibleChart
            summary="Acquisition and Loyalty Funnel: 520,000 aware customers narrowed to 20,920 loyal customers."
            columns={['Stage', 'Value', 'Conversion', 'Note']}
            rows={funnel.map((row) => ({ Stage: row.stage, Value: row.value, Conversion: row.step ?? 'Start', Note: row.note }))}
          >
            <div className="mt-3"><ARFunnel /></div>
          </AccessibleChart>
          <InsightBanner>20,920 loyal customers drove 46.8% of total revenue.</InsightBanner>
        </Panel>
      </div>

      <Panel>
        <ReportSectionLabel eyebrow="Customer Segment Snapshot" title="Weighted by revenue contribution" />
        <AccessibleChart
          summary="Customer Segment Snapshot: Value Seekers contributed 42% of revenue, Balanced Buyers 37%, and Premium Loyalists 21% with the highest retention."
          columns={['Segment', 'Revenue Share', 'Average Spend', 'Retention Rate', 'Growth vs Year 4']}
          rows={segments.map((s) => ({
            Segment: s.name,
            'Revenue Share': s.revenue,
            'Average Spend': s.spend,
            'Retention Rate': s.retention,
            'Growth vs Year 4': s.growth,
          }))}
        >
          <div className="mt-4 grid gap-3 xl:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)_minmax(0,0.88fr)]">
            {segments.map((s, index) => (
              <div
                key={s.name}
                className="annual-tip"
                data-tip={`${s.name}: ${s.revenue} revenue share; ${s.spend} average spend; ${s.retention} retention; ${s.growth} growth`}
                tabIndex={0}
                style={styles.segmentCard}
              >
                <div className="flex items-start gap-3">
                  <PersonaInk variant={index} />
                  <div>
                    <div className="flex items-center gap-2" style={{ color: 'var(--game-text)', fontSize: 14, fontWeight: 800 }}>
                      <span style={{ color: 'var(--game-teal-mid)', display: 'inline-flex' }}>
                        <DsIcon icon={mascotAssets[index]?.icon ?? usersIcon} size={15} />
                      </span>
                      {s.name}
                    </div>
                    <div style={{ color: 'var(--game-teal-mid)', fontSize: 24, fontWeight: 800, fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>
                      {s.revenue}
                      <span style={{ color: 'var(--game-text-muted)', fontSize: 11, fontWeight: 700, marginLeft: 6 }}>of revenue</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex flex-col gap-2">
                  <SegStat label="Avg. Spend / Visit" value={s.spend} />
                  <SegStat label="Retention Rate" value={s.retention} />
                  <SegStat label="Growth vs. Year 4" value={s.growth} positive />
                </div>
              </div>
            ))}
          </div>
        </AccessibleChart>
        <InsightBanner>Premium Loyalists are your most loyal and highest spending segment.</InsightBanner>
      </Panel>

      <Panel>
        <ReportSectionLabel eyebrow="Product & Sales Mix" title="Revenue share and units sold" />
        <AccessibleChart
          summary="Product and Sales Mix: Espresso, Cappuccino, and Cold Brew drove 68.8% of revenue."
          columns={['Product', 'Revenue Share', 'Units Sold', 'Category']}
          rows={productMix.map((p) => ({
            Product: p.name,
            'Revenue Share': p.revenue,
            'Units Sold': p.units,
            Category: p.tone === 'dark' ? 'Beverage' : 'Food or retail',
          }))}
        >
          <ProductMixTable />
        </AccessibleChart>
        <InsightBanner>Beverages drove 68.8% of revenue.</InsightBanner>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
        <Panel>
          <ReportSectionLabel eyebrow="Market Pulse" title="Footfall and customer mix over time" />
          <AccessibleChart
            summary="Market Pulse: footfall grew from 19K to 66K while the customer mix shifted toward higher-value Balanced Buyers and Premium Loyalists."
            columns={['Quarter', 'Footfall', 'Value Seekers', 'Balanced Buyers', 'Premium Loyalists']}
            rows={marketPulse.map((d) => ({
              Quarter: d.q,
              Footfall: `${d.footfall}K`,
              'Value Seekers': `${d.value}%`,
              'Balanced Buyers': `${d.balanced}%`,
              'Premium Loyalists': `${d.premium}%`,
            }))}
          >
            <div className="mt-1"><ARMarketPulse /></div>
          </AccessibleChart>
          <InsightBanner>Footfall grew 2.4x from Year 1 to Year 5, shift toward higher-value customers.</InsightBanner>
        </Panel>

        <Panel>
          <ReportSectionLabel eyebrow="How You Won Customers" title="The levers that mattered" />
          <div className="mt-4 flex flex-col gap-3">
            {wonCustomers.map((item, index) => (
              <LeverRow key={item.title} item={item} index={index} />
            ))}
          </div>
          <InsightBanner>Execution clarity, customer focus, and consistency won the game.</InsightBanner>
        </Panel>
      </div>
    </div>
  );
}

function CafeInteriorStrip() {
  return (
    <Image
      src="/annual-report/clean/cafe-interior-frieze.png"
      alt=""
      aria-hidden="true"
      width={3644}
      height={877}
      style={{ display: 'block', height: 'auto', width: '100%' }}
    />
  );
}

function ReportSectionLabel({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <span style={styles.reportChip}>{eyebrow}</span>
      <h2 style={{ ...styles.h2, marginTop: 8 }}>{title}</h2>
    </div>
  );
}

function InsightBanner(_: { children: React.ReactNode }) {
  return null;
}

function ReportKpi({ label, value, detail, data, accent = false }: { label: string; value: string; detail: string; data: Array<number>; accent?: boolean }) {
  return (
    <Panel style={{ padding: 16 }}>
      <div>
        <span style={{ color: 'var(--game-text-secondary)', fontSize: 12, fontWeight: 800 }}>{label}</span>
        <div style={{ color: 'var(--game-text)', fontSize: 28, fontWeight: 800, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1, marginTop: 8 }}>{value}</div>
        <span style={{ background: 'var(--game-cyan-tint)', borderRadius: 999, color: 'var(--game-teal-mid)', display: 'inline-flex', fontSize: 10, fontWeight: 800, marginTop: 6, padding: '3px 8px' }}>
          {detail}
        </span>
      </div>
    </Panel>
  );
}

function PersonaInk({ variant }: { variant: number }) {
  const asset = mascotAssets[variant] ?? mascotAssets[0];
  return (
    <div style={{ flexShrink: 0, height: 128, overflow: 'hidden', width: 84 }}>
      <Image
        src={asset.src}
        alt={asset.label}
        width={asset.width}
        height={asset.height}
        style={{ display: 'block', height: 148, objectFit: 'contain', objectPosition: 'center top', width: 84 }}
      />
    </div>
  );
}

const PRODUCT_ICONS: Record<string, React.FC<{ size?: number; color?: string }>> = {
  Espresso: Coffee, Cappuccino: Milk, 'Cold Brew': CoffeeBeans, Croissant: Bread, Muffin: Cake, 'Whole Bean': Box,
};

// Revenue & units table — icon chip + share bar (quarterly chart language).
function ProductMixTable() {
  const max = Math.max(...productMix.map((p) => parseFloat(p.revenue)));
  const cols = '1.6fr 2fr 0.9fr';
  return (
    <div className="mt-4" style={{ overflow: 'hidden', borderRadius: 12, border: `1px solid ${BORDER}` }}>
      <div style={{ display: 'grid', gridTemplateColumns: cols, background: 'var(--muted)', padding: '9px 16px', fontFamily: FO, fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: TEXT }}>
        <div>Product</div>
        <div>Revenue Share</div>
        <div style={{ textAlign: 'right' }}>Units Sold</div>
      </div>
      {productMix.map((p) => {
        const Icon = PRODUCT_ICONS[p.name] ?? Coffee;
        const pct = parseFloat(p.revenue);
        const beverage = p.tone === 'dark';
        return (
          <div key={p.name} className="pm-row" style={{ display: 'grid', gridTemplateColumns: cols, alignItems: 'center', padding: '12px 16px', borderTop: '1px solid color-mix(in srgb, var(--game-dark) 7%, transparent)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <span style={{ width: 32, height: 32, borderRadius: 9, background: 'color-mix(in srgb, var(--color-chart-1) 11%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={16} color={TEAL} />
              </span>
              <div>
                <div style={{ fontFamily: FO, fontWeight: 800, fontSize: 13, color: INK }}>{p.name}</div>
                <div style={{ fontFamily: FO, fontSize: 10, fontWeight: 700, color: TEXT, letterSpacing: '0.03em' }}>{beverage ? 'Beverage' : 'Food & retail'}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingRight: 18 }}>
              <div style={{ flex: 1, height: 8, borderRadius: 99, background: 'var(--muted)', overflow: 'hidden' }}>
                <div style={{ width: `${(pct / max) * 100}%`, height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${CYAN}, var(--cyan-deep))` }} />
              </div>
              <span style={{ fontFamily: FO, fontWeight: 800, fontSize: 13, color: INK, fontVariantNumeric: 'tabular-nums', width: 48, textAlign: 'right' }}>{p.revenue}</span>
            </div>
            <div style={{ textAlign: 'right', fontFamily: FO, fontWeight: 700, fontSize: 13, color: TEXT, fontVariantNumeric: 'tabular-nums' }}>{p.units}</div>
          </div>
        );
      })}
    </div>
  );
}

function LeverRow({ item, index }: { item: typeof wonCustomers[number]; index: number }) {
  const icons = [priceTagIcon, refreshIcon, targetIcon];
  const icon = icons[index] ?? targetIcon;

  return (
    <div className="flex items-start gap-3" style={{ borderTop: '1px solid color-mix(in srgb, var(--game-dark) 9%, transparent)', paddingTop: 12 }}>
      <span style={{ alignItems: 'center', background: 'var(--game-cyan-tint)', borderRadius: 10, color: 'var(--game-teal-mid)', display: 'flex', flexShrink: 0, height: 36, justifyContent: 'center', width: 36 }}>
        <DsIcon icon={icon} size={17} />
      </span>
      <div className="min-w-0 flex-1">
        <div style={{ color: 'var(--game-text)', fontSize: 13, fontWeight: 800 }}>{item.title}</div>
        <p style={{ color: 'var(--game-text-secondary)', fontSize: 11.5, fontWeight: 600, lineHeight: 1.45, marginTop: 3 }}>{item.body}</p>
      </div>
      <div style={{ flexShrink: 0, textAlign: 'right' }}>
        <div style={{ color: 'var(--game-positive)', fontSize: 17, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{item.stat}</div>
        <div style={{ color: 'var(--game-text-muted)', fontSize: 10, fontWeight: 700 }}>{item.sub}</div>
      </div>
    </div>
  );
}

// ═══ PAGE 3 · FINANCE & OPERATIONS ════════════════════════════════════════════
function FinanceTab() {
  return (
    <div className="flex flex-col gap-4">
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Kpi icon={reportChartIcon} label="Revenue" value="$3.24M" detail="+54% vs. average" />
        <Kpi icon={moneyIcon} label="Net Profit" value="$864K" detail="26.7% margin" />
        <Kpi icon={reportChartIcon} label="Operating Margin" value="26.7%" detail="+8.2 pp vs. average" />
        <Kpi icon={usersIcon} label="Founder Ownership" value="63.9%" detail="Retained ownership" accent />
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        {/* Revenue to Profit Bridge */}
        <Panel>
          <ChartTitle icon={reportChartIcon} title="Revenue to Profit Bridge" subtitle="How $3.24M in revenue turned into $864K in profit." />
          <AccessibleChart
            summary="Revenue to Profit Bridge: $3.24M revenue less COGS, labor, rent, marketing, and other operating expense produced $864K net profit and a 26.7% margin."
            columns={['Line Item', 'Display Value', 'Percent of Revenue']}
            rows={profitBridge.map((d) => ({ 'Line Item': d.label, 'Display Value': d.display, 'Percent of Revenue': d.tag || 'Revenue base' }))}
          >
            <div className="mt-1"><ARProfitBridge /></div>
            <ChartLegend
              items={[
                { label: 'Revenue', color: DEEP },
                { label: 'Cost deductions', color: RED },
                { label: 'Net profit', color: CYAN },
              ]}
            />
          </AccessibleChart>
          <Callout>Strong cost control and pricing discipline helped you convert 26.7% of revenue into profit.</Callout>
        </Panel>

        {/* Cash & Valuation Over Time */}
        <Panel>
          <ChartTitle icon={bankIcon} title="Cash & Valuation Over Time" subtitle="Cash balance and company valuation tracked across all five years." />
          <AccessibleChart
            summary="Cash and Valuation Over Time: cash reached $2.50M and company valuation reached $8.45M by Year 5."
            columns={['Year', 'Cash Balance', 'Company Valuation']}
            rows={cashValuation.map((d) => ({ Year: d.year, 'Cash Balance': m(d.cash), 'Company Valuation': m(d.valuation) }))}
          >
            <div className="mt-1">
              <ARLineChart
                xLabels={cashValuation.map((d) => d.year)}
                yMax={10}
                yTicks={[0, 2.5, 5, 7.5, 10]}
                fmtY={(v) => m(v)}
                height={290}
                series={[
                  { name: 'Company Valuation', color: SOFT_TEAL, data: cashValuation.map((d) => d.valuation), area: true },
                  { name: 'Cash Balance', color: CYAN, data: cashValuation.map((d) => d.cash), area: true, focus: true },
                ]}
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <div
                style={{
                  background: '#FFFFFF',
                  border: `1.4px solid ${BORDER}`,
                  borderRadius: 12,
                  color: INK,
                  fontFamily: FO,
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '6px 12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: 'var(--shadow-elev-1)',
                }}
              >
                <span style={{ color: TEAL, display: 'inline-flex' }}>
                  <DsIcon icon={buildingIcon} size={14} />
                </span>
                <span>
                  Valuation: <span style={{ fontWeight: 800 }}>$8.45M</span>
                </span>
              </div>
              <div
                style={{
                  background: '#FFFFFF',
                  border: `1.4px solid ${BORDER}`,
                  borderRadius: 12,
                  color: INK,
                  fontFamily: FO,
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '6px 12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: 'var(--shadow-elev-1)',
                }}
              >
                <span style={{ color: TEAL, display: 'inline-flex' }}>
                  <DsIcon icon={bankIcon} size={14} />
                </span>
                <span>
                  Cash: <span style={{ fontWeight: 800 }}>$2.50M</span>
                </span>
              </div>
            </div>
          </AccessibleChart>
          <Callout>You built cash steadily while growing a valuable, investable company.</Callout>
        </Panel>
      </div>

      {/* Capital & Ownership */}
      <Panel>
        <span style={styles.eyebrow}>You Kept Control While Raising Smart Capital</span>
        <h2 style={styles.h2}>Capital & Ownership</h2>
        <AccessibleChart
          summary="Capital and Ownership: founder ownership is 63.9%, investor ownership is 29.2%, option pool is 6.9%, and retained founder value is $5.41M of an $8.45M valuation."
          columns={['Holder', 'Ownership', 'Value']}
          rows={[
            { Holder: 'Founder Ownership', Ownership: '63.9%', Value: '$5.41M retained value' },
            { Holder: 'Investor Ownership', Ownership: '29.2%', Value: 'External ownership' },
            { Holder: 'Option Pool', Ownership: '6.9%', Value: 'Team incentive pool' },
            { Holder: 'Cash Raised', Ownership: 'N/A', Value: '$800K' },
            { Holder: 'Company Valuation', Ownership: '100%', Value: '$8.45M' },
          ]}
        >
          <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)_minmax(0,0.8fr)]">
            <div className="flex flex-col gap-3">
              <MiniStat icon={bankIcon} label="Cash Raised" value="$800K" />
              <MiniStat icon={buildingIcon} label="Company Valuation" value="$8.45M" />
            </div>
            <div>
              <div style={{ color: TEXT, fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Ownership Breakdown</div>
              <div className="mt-3 overflow-hidden rounded-lg" style={{ height: 40, display: 'flex' }}>
                {ownership.map((o) => (
                  <div
                    key={o.label}
                    className="annual-tip"
                    data-tip={`${o.label}: ${o.pct}%`}
                    tabIndex={0}
                    style={{ width: `${o.pct}%`, background: o.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 800 }}
                  >
                    {o.pct}%
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-col gap-2">
                {ownership.map((o) => (
                  <div key={o.label} className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2" style={{ fontSize: 12, color: TEXT, fontWeight: 600 }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: o.color, display: 'inline-block' }} />
                      {o.label}
                    </span>
                    <span style={{ color: INK, fontSize: 13, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{o.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="annual-tip flex flex-col justify-center rounded-xl p-4" data-tip="Founder retained value: $5.41M, equal to 63.9% of the $8.45M company valuation" tabIndex={0} style={{ background: '#E0F7FF', border: `1.4px solid ${CYAN}` }}>
              <div style={{ color: TEAL, fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Founder Retained Value</div>
              <div style={{ color: TEAL, fontSize: 30, fontWeight: 800, marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>$5.41M</div>
              <div style={{ color: TEXT, fontSize: 12, fontWeight: 600, marginTop: 4 }}>63.9% of $8.45M valuation</div>
            </div>
          </div>
        </AccessibleChart>
      </Panel>

      {/* Operations Control Panel */}
      <Panel>
        <span style={styles.eyebrow}>Operational Discipline Drove Performance</span>
        <h2 style={styles.h2}>Operations Control Panel</h2>
        <AccessibleChart
          summary="Operations Control Panel: 82% sell-through, 88% space utilization, $68.4K revenue per employee, 4.6% waste rate, and 4.2 out of 5 supplier performance."
          columns={['Metric', 'Value', 'Detail']}
          rows={operationControlRows.map((row) => ({ Metric: row.metric, Value: row.value, Detail: row.detail }))}
        >
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {/* Inventory donut */}
          <div className="annual-tip rounded-xl border border-[#C8DDE6] bg-white p-4" data-tip="Inventory outcome: 8,620 sold, 1,210 unsold, 420 expired, 250 damaged; 82% sell-through" tabIndex={0}>
            <div style={styles.opLabel}>Inventory Outcome (Units)</div>
            <div className="mt-1 mb-1">
              <ARDonut data={inventoryOutcome} centerTop="82%" centerSub="SOLD" size={120} />
            </div>
            <div className="flex flex-col gap-1">
              {inventoryOutcome.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between" style={{ fontSize: 10, color: TEXT, fontWeight: 600 }}>
                  <span className="inline-flex items-center gap-1.5">
                    <span style={{ width: 4, height: 11, borderRadius: 3, background: rampFill(i), display: 'inline-block' }} />{d.name}
                  </span>
                  <span style={{ color: INK, fontWeight: 800 }}>{d.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between border-t border-[#C8DDE6] pt-2" style={{ fontSize: 10, color: TEXT, fontWeight: 600 }}>
              <span>Total Purchased <b style={{ color: INK }}>10,500</b></span>
              <span>Sell-Through <b style={{ color: INK }}>82%</b></span>
            </div>
          </div>

          {/* Space utilization ring */}
          <div className="annual-tip rounded-xl border border-[#C8DDE6] bg-white p-4 flex flex-col" data-tip="Space utilization: 88% of capacity; average monthly rent $16,400" tabIndex={0}>
            <div style={styles.opLabel}>Space Utilization</div>
            <Ring pct={88} color={TEAL} center="88%" sub="of capacity" />
            <div className="mt-auto pt-2 border-t border-[#C8DDE6]" style={{ fontSize: 10, color: TEXT, fontWeight: 600 }}>
              Avg. Monthly Rent <b style={{ color: INK }}>$16,400</b>
            </div>
          </div>

          {/* Staff productivity */}
          <div className="annual-tip rounded-xl border border-[#C8DDE6] bg-white p-4 flex flex-col" data-tip="Staff productivity: $68.4K revenue per employee; +32% vs. average; 15 average employees" tabIndex={0}>
            <div style={styles.opLabel}>Staff Productivity</div>
            <div style={{ color: TEXT, fontSize: 10, fontWeight: 600, marginTop: 8 }}>Revenue per Employee</div>
            <div style={{ color: INK, fontSize: 24, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>$68.4K</div>
            <div style={{ color: POSITIVE, fontSize: 11, fontWeight: 700 }}>+32% vs. average</div>
            <div className="mt-auto pt-2 border-t border-[#C8DDE6]" style={{ fontSize: 10, color: TEXT, fontWeight: 600 }}>
              Employees (Avg.) <b style={{ color: INK }}>15</b>
            </div>
          </div>

          {/* Waste rate ring */}
          <div className="annual-tip rounded-xl border border-[#C8DDE6] bg-white p-4 flex flex-col" data-tip="Waste rate: 4.6% of COGS; waste cost $68.2K" tabIndex={0}>
            <div style={styles.opLabel}>Waste Rate (of COGS)</div>
            <Ring pct={4.6} color={POSITIVE} center="4.6%" sub="" max={20} />
            <div className="mt-auto pt-2 border-t border-[#C8DDE6]" style={{ fontSize: 10, color: TEXT, fontWeight: 600 }}>
              Waste Cost <b style={{ color: INK }}>$68.2K</b>
            </div>
          </div>

          {/* Supplier performance */}
          <div className="annual-tip rounded-xl border border-[#C8DDE6] bg-white p-4 flex flex-col" data-tip="Supplier performance: 4.2 out of 5.0; 8 miles average delivery distance" tabIndex={0}>
            <div style={styles.opLabel}>Supplier Performance</div>
            <div className="mt-3 flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={18} color={s <= 4 ? AMBER : 'var(--color-border)'} />
              ))}
            </div>
            <div style={{ color: INK, fontSize: 18, fontWeight: 800, marginTop: 6 }}>4.2 / 5.0</div>
            <div className="mt-auto pt-2 border-t border-[#C8DDE6]" style={{ fontSize: 10, color: TEXT, fontWeight: 600 }}>
              Avg. Delivery Distance <b style={{ color: INK }}>8 miles</b>
            </div>
          </div>
        </div>
        </AccessibleChart>
      </Panel>

      {/* Business Lessons */}
      <Panel>
        <span style={styles.eyebrow}>What You Learned, Earned, and Will Carry Forward</span>
        <h2 style={styles.h2}>Business Lessons</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {businessLessons.map((item) => (
            <div key={item.title} className="flex flex-col gap-3 rounded-xl border border-[#C8DDE6] bg-white p-4">
              <div style={styles.iconShell}><DsIcon icon={item.icon} size={20} /></div>
              <div>
                <div style={{ color: INK, fontSize: 14, fontWeight: 800 }}>{item.title}</div>
                <p style={{ color: TEXT, fontSize: 12, lineHeight: 1.5, marginTop: 4 }}>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Final Standing */}
      <Panel style={{ background: 'linear-gradient(to right, #F0F9FC, rgba(255,255,255,0.72))' }}>
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] xl:items-center">
          <div className="flex items-center gap-4">
            <div style={{ flexShrink: 0, width: 184 }}>
              <Image
                src="/annual-report/trophy-medallion-kpis.svg"
                alt="Number one trophy medallion for Dhaulagiri Cafe"
                width={184}
                height={112}
                style={{ display: 'block', height: 'auto', width: '100%' }}
              />
              <Image
                src="/annual-report/kpi-glyphs.svg"
                alt="KPI glyphs for revenue, profit, valuation, and founder ownership"
                width={192}
                height={48}
                style={{ display: 'block', height: 'auto', marginTop: 6, width: '100%' }}
              />
            </div>
            <div>
              <span style={styles.eyebrow}>Final Standing</span>
              <div style={{ color: INK, fontSize: 20, fontWeight: 800, margin: '4px 0 6px' }}>Strong Operator. Smart Builder. True Founder.</div>
              <p style={{ color: TEXT, fontSize: 13, lineHeight: 1.55, maxWidth: 360 }}>
                You ran a business that balances growth, profitability, and ownership. That&rsquo;s how lasting companies are built.
              </p>
            </div>
          </div>
          <div className="grid gap-3 grid-cols-2 xl:grid-cols-4">
            {finalStanding.map((s) => (
              <div key={s.title} className="rounded-xl border border-[#C8DDE6] bg-white p-4 text-center">
                <div style={{ ...styles.iconShell, margin: '0 auto' }}><DsIcon icon={s.icon} size={20} /></div>
                <div style={{ color: TEAL, fontSize: 12, fontWeight: 800, marginTop: 8 }}>{s.title}</div>
                <div style={{ color: INK, fontSize: 12, fontWeight: 700, marginTop: 4, lineHeight: 1.35 }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </Panel>
    </div>
  );
}

// ─── Shared Components ────────────────────────────────────────────────────────
function Kpi({ icon, label, value, detail, accent = false }: { icon: React.FC<React.SVGProps<SVGSVGElement>>; label: string; value: string; detail: string; accent?: boolean }) {
  return (
    <Panel
      style={{
        border: accent ? `1.4px solid ${CYAN}` : '1.4px solid white',
        background: accent ? 'linear-gradient(155deg, var(--secondary), color-mix(in srgb, var(--color-card) 78%, var(--secondary)))' : SURFACE,
        boxShadow: 'var(--shadow-elev-1)',
      }}
    >
      <div className="flex items-start gap-3">
        <div style={{ ...styles.iconShell, background: accent ? 'var(--color-card)' : undefined }}><DsIcon icon={icon} size={19} /></div>
        <div className="min-w-0">
          <span style={{ ...styles.kpiLabel, color: accent ? TEAL : TEXT }}>{label}</span>
          <div style={{ ...styles.kpiValue, color: accent ? TEAL : INK }}>{value}</div>
          <div style={styles.kpiDetail}>{detail}</div>
        </div>
      </div>
    </Panel>
  );
}

function MiniStat({ icon, label, value }: { icon: React.FC<React.SVGProps<SVGSVGElement>>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#C8DDE6] bg-white p-3">
      <div style={styles.iconShell}><DsIcon icon={icon} size={18} /></div>
      <div>
        <div style={{ color: TEXT, fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ color: INK, fontSize: 18, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      </div>
    </div>
  );
}

function SegStat({ label, value, positive = false }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="flex items-center justify-between" style={{ fontSize: 12 }}>
      <span style={{ color: TEXT, fontWeight: 600 }}>{label}</span>
      <span style={{ color: positive ? POSITIVE : INK, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
  );
}

function StatChip({ text, positive }: { text: string; positive: boolean }) {
  return (
    <span
      className="inline-flex w-fit items-center gap-1"
      style={{ background: '#E0F7FF', color: positive ? POSITIVE : RED, borderRadius: 8, padding: '4px 8px', fontSize: 11, fontWeight: 800 }}
    >
      {text}
    </span>
  );
}

function IconRow({ icon, title, body }: { icon: React.FC<React.SVGProps<SVGSVGElement>>; title: string; body: string }) {
  return (
    <div className="flex gap-3">
      <div style={{ ...styles.iconShell, width: 34, height: 34 }}><DsIcon icon={icon} size={18} /></div>
      <div>
        <div style={{ color: INK, fontSize: 13, fontWeight: 800 }}>{title}</div>
        <p style={{ color: TEXT, fontSize: 12, lineHeight: 1.45, marginTop: 2 }}>{body}</p>
      </div>
    </div>
  );
}

function Ring({ pct, color, center, sub, max = 100 }: { pct: number; color: string; center: string; sub: string; max?: number }) {
  return <ARRadial pct={pct} color={color} center={center} sub={sub} max={max} />;
}

function Callout(_: { children: React.ReactNode }) {
  return null;
}

// Inline SVGR component — captures into Figma as vectors; `currentColor` recolors.
function DsIcon({ icon: Icon, size = 18 }: { icon: React.FC<React.SVGProps<SVGSVGElement>>; size?: number }) {
  return (
    <Icon
      width={size}
      height={size}
      aria-hidden="true"
      style={{ display: 'block', color: 'currentColor' }}
    />
  );
}

function Panel({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <section className={`ar-lift rounded-2xl p-5 ${className}`} style={{ background: SURFACE, border: '1.4px solid white', boxShadow: 'var(--shadow-elev-1)', ...style }}>
      {children}
    </section>
  );
}

function ActionButton({ children, icon, primary = false, onClick }: { children: React.ReactNode; icon: React.ReactNode; primary?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full transition-transform active:-translate-y-px"
      style={{
        border: primary ? 'none' : `1px solid ${BORDER}`,
        borderRadius: 'var(--game-cta-radius)',
        background: primary ? CTA_BG : '#FFFFFF',
        color: primary ? '#FFFFFF' : INK,
        cursor: 'pointer',
        fontFamily: FO,
        fontSize: 13,
        fontWeight: 700,
        boxShadow: 'none',
        minHeight: 44,
        padding: primary ? '11px 20px' : '10px 18px',
      }}
    >
      {icon}
      {children}
    </button>
  );
}

function ChartTitle({ icon, title, subtitle }: { icon: React.FC<React.SVGProps<SVGSVGElement>>; title: string; subtitle: string }) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <div style={styles.iconShell}><DsIcon icon={icon} size={17} /></div>
      <div>
        <h2 style={styles.h2}>{title}</h2>
        <p style={{ ...styles.sub, marginTop: 2 }}>{subtitle}</p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  eyebrow: { display: 'none' },
  h1: { color: INK, fontFamily: FO, fontSize: 38, fontWeight: 800, letterSpacing: '-0.02em', margin: '8px 0 0' },
  h2: { color: INK, fontFamily: FO, fontSize: 17, fontWeight: 800, letterSpacing: '-0.01em', margin: 0 },
  sub: { color: TEXT, fontFamily: FO, fontSize: 14, fontWeight: 500, lineHeight: 1.55, margin: '6px 0 0', maxWidth: 560 },
  iconShell: { alignItems: 'center', background: 'linear-gradient(150deg, var(--secondary), color-mix(in srgb, var(--color-card) 70%, var(--secondary)))', border: `1px solid ${BORDER}`, borderRadius: 11, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)', color: TEAL, display: 'flex', flexShrink: 0, height: 38, justifyContent: 'center', width: 38 },
  kpiLabel: { color: TEXT, fontFamily: FO, fontSize: 12, fontWeight: 700 },
  kpiValue: { color: INK, fontFamily: FO, fontSize: 28, fontWeight: 800, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', lineHeight: 1.1, marginTop: 4 },
  kpiDetail: { color: TEXT, fontFamily: FO, fontSize: 12, fontWeight: 600, marginTop: 4 },
  metaPill: { background: '#FFFFFF', border: `1px solid ${BORDER}`, borderRadius: 9999, color: INK, fontFamily: FO, fontSize: 12, fontWeight: 700, padding: '7px 14px', width: 'fit-content' },
  reportChip: { display: 'none' },
  segmentCard: { background: 'color-mix(in srgb, var(--game-surface-solid) 58%, transparent)', border: 'var(--game-card-border)', borderRadius: 14, padding: 16 },
  opLabel: { color: INK, fontFamily: FO, fontSize: 11, fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' },
  th: { borderBottom: `1px solid ${BORDER}`, color: TEXT, fontFamily: FO, fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', padding: '10px 8px', textTransform: 'uppercase', whiteSpace: 'nowrap' },
  td: { borderBottom: `1px solid rgba(200,221,230,0.55)`, color: INK, fontFamily: FO, fontSize: 13, fontWeight: 700, padding: '11px 8px', verticalAlign: 'middle' },
  num: { textAlign: 'right', fontVariantNumeric: 'tabular-nums' },
};

