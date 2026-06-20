import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAppNavigate } from '../lib/use-app-navigate';
import { GridBackground } from './GridBackground';
import { GameHeader } from './GameHeader';
import { GameButton } from './GameButton';
import { PageTransition } from './PageTransition';
import { Download, Crown, Clock, BarChart3, Users, Heart, Trophy, Copy, Check } from './PixelIcons';
import { ComposedChart, Line, Area, Bar, Cell, XAxis, YAxis, CartesianGrid, ReferenceArea } from 'recharts';
import { ChartContainer, ChartTooltip, type ChartConfig } from './ui/chart';

// ─── Theme tokens ─────────────────────────────────────────────────────────────
const F = "'Outfit', system-ui, sans-serif";
// Softened, lighter palette for this report screen — toned down from the bright
// system cyan toward periwinkle blue + soft teal, per the in-game reference art.
// Normalized onto the Startup Valley theme tokens (no bespoke palette).
const C = {
  TEAL:    'var(--game-dark)',
  CYAN:    'var(--color-chart-1)',         // primary line/accent
  EMERALD: 'var(--game-positive)',         // text / positive
  GREEN:   'var(--color-chart-6)',         // soft teal — chart green series
  ROSE:    'var(--game-negative)',         // soft red
  AMBER:   'var(--color-chart-4)',         // soft amber
  BORDER:  'var(--color-border)',          // dividers
  MUTED:   'var(--muted)',
  FG1:     'var(--game-text)',
  FG3:     'var(--game-text-secondary)',
  FG4:     'var(--color-muted-foreground)',
  TEAL8:   'var(--game-dark)',             // deep ink
  TEAL7:   'var(--game-teal-mid)',
  SOFT:    'var(--color-chart-6)',
  CYAN100: 'var(--secondary)',             // soft tint
  SLATE:   'var(--color-muted-foreground)',// neutral harbor
  NAVY:    'var(--color-chart-3)',         // distinct categorical series
  CARD:    'var(--color-card)',
  CARDBORDER: 'var(--color-border)',
  CARDSHADOW: '0 1px 2px rgba(20,45,70,0.03), 0 2px 10px -6px rgba(20,45,70,0.08)',
  HEADERBG: 'var(--muted)',
  ROWLINE: 'var(--color-border)',
  WAVE1:   'color-mix(in srgb, var(--color-chart-3) 30%, white)',  // soft wave tint
  WAVE2:   'color-mix(in srgb, var(--color-chart-3) 16%, white)',  // softer wave tint
  PURPLE:  'var(--color-chart-3)',         // charts only
};
const ZONE = { harbor: 'var(--color-muted-foreground)', coastal: 'var(--color-chart-1)', deep: 'var(--color-chart-6)' };
const fmt$ = (v: number) => '$' + Math.round(v).toLocaleString('en-US');
const fmtK = (v: number) => v >= 1e6 ? `$${(v / 1e6).toFixed(2)}M` : v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v.toFixed(0)}`;

// ─── DATA · individual (from the fish-game end report) ───────────────────────────
const R = ['R1','R2','R3','R4','R5','R6','R7','R8','R9','R10','R11','R12','R13'];
const DATA = {
  meta: { team: 'Team B', role: 'Fleet Operator', season: 'Season 1 · Round 13 of 13' },
  summary: {
    finalNetWorth: 727563, peakFleet: 7, totalFishCaught: 1473, finalFishStock: 15.23,
    totalRevenue: 412400, totalShips: 7, totalCost: 12200, loan: 0,
  },
  kpi: {
    bankBalance: 725463, netWorth: 727563, fishCaught: 1473, fishHealth: 18.47, shipsOwned: 7,
    currentProfit: 65951, profitPerShip: 7254, startBalance: 221210, finalBalance: 659512, marketAvgCatch: 1178,
  },
  netWorth: [222110,245670,273294,302090,333678,367567,404295,443771,492960,540951,597987,661612,661612],
  fleet: {
    harbor:  [0,0,0,0,0,3,0,0,0,0,0,0,0],
    coastal: [1,1,1,0,1,1,0,0,5,0,4,5,0],
    deep:    [1,1,4,5,4,1,5,5,0,5,1,0,0],
    bought:  [1,1,0,0,0,0,0,0,0,0,0,2,0],
    sold:    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    total:   [3,3,5,5,5,5,5,5,5,5,5,7,7],
    totalValue: [900,900,1525,1550,1500,1500,1500,1500,1500,1500,1500,2100,2100],
    marketPrice: [300,300,305,310,300,300,300,300,300,300,300,300,300],
  },
  catch: {
    coastal: [40,44,45,0,45,42,0,0,263,0,182,221,0],
    deep:    [50,42,160,136,82,16,68,26,0,10,1,0,0],
    harbor:  [0,0,0,0,0,0,0,0,0,0,0,0,0],
    total:   [90,86,205,136,127,58,68,26,263,10,183,221,0],
  },
  revenue: {
    fish:     [1800,1720,4100,2720,2540,1160,1360,520,5260,200,3660,4420,0],
    shipSales:[0,0,0,0,0,0,0,0,0,0,0,0,0],
    interest: [20110,22252,24709,27326,30198,33279,36479,39844,43383,47105,51016,55129,59453],
  },
  expenses: {
    operating: [400,400,1150,1250,1150,550,1250,1250,750,1250,850,750,0],
    other:     [0,0,0,0,0,0,0,0,0,0,0,0,0],
    auction:   [0,0,0,0,0,0,0,0,0,0,0,0,0],
    ships:     [300,300,0,0,0,0,0,0,0,0,0,600,0],
    interestPaid: [0,0,0,0,0,0,0,0,0,0,0,0,0],
    total:     [700,700,1150,1250,1150,550,1250,1250,750,1250,850,1350,0],
  },
  profit:        [22110,23560,27624,28796,31588,33889,36728,39476,49189,47991,57036,63625,65951],
  profitPerShip: [7370,7853,5525,5759,6318,6778,7346,7895,9838,9598,11407,9089,7254],
};

// ─── DATA · team / cohort (from the team performance end report) ─────────────────
const ramp = (a: number, b: number, ease = 1.6) => R.map((_, i) => { const t = i / (R.length - 1); return Math.round(a + (b - a) * Math.pow(t, ease)); });
const makeFinance = (finalNW: number) => {
  const revenue = ramp(40000, finalNW * 1.5, 1.5);
  const cost = ramp(25000, finalNW * 1.5 * 0.62, 1.45);
  const profit = revenue.map((r, i) => r - cost[i]);
  const netWorth = ramp(Math.round(finalNW * 0.2), finalNW, 1.8);
  return { revenue, cost, profit, netWorth };
};
const TEAMS = [
  { id: 'C', name: 'Team C', you: false, netWorth: 1142300, fish: 2025, peakFleet: 40, finalFleet: 40, loan: 120000, sustainability: 32.1, balanced: 81.2, behavior: 'Profit Maximizer',     resource: 'Low',    fleetDisc: 'High',   debtDisc: 'Medium', color: C.AMBER },
  { id: 'B', name: 'Team B', you: true,  netWorth: 727563,  fish: 1473, peakFleet: 32, finalFleet: 32, loan: 210000, sustainability: 18.4, balanced: 64.7, behavior: 'Aggressive Expander',  resource: 'High',   fleetDisc: 'Medium', debtDisc: 'Low',    color: C.CYAN },
  { id: 'A', name: 'Team A', you: false, netWorth: 542137,  fish: 1560, peakFleet: 28, finalFleet: 28, loan: 95000,  sustainability: 25.7, balanced: 58.9, behavior: 'Conservative Operator', resource: 'Low',    fleetDisc: 'High',   debtDisc: 'High',   color: C.SOFT },
  { id: 'D', name: 'Team D', you: false, netWorth: 398410,  fish: 540,  peakFleet: 22, finalFleet: 22, loan: 60000,  sustainability: 21.3, balanced: 52.3, behavior: 'Balanced Operator',     resource: 'Medium', fleetDisc: 'Medium', debtDisc: 'Medium', color: C.EMERALD },
  { id: 'E', name: 'Team E', you: false, netWorth: 241880,  fish: 322,  peakFleet: 16, finalFleet: 16, loan: 45000,  sustainability: 15.8, balanced: 45.6, behavior: 'Conservative Operator', resource: 'Low',    fleetDisc: 'High',   debtDisc: 'High',   color: C.ROSE },
].map(t => ({ ...t, finance: makeFinance(t.netWorth) }));

const T = {
  totals: {
    netWorth: TEAMS.reduce((a, t) => a + t.netWorth, 0),
    avgNetWorth: Math.round(TEAMS.reduce((a, t) => a + t.netWorth, 0) / TEAMS.length),
    fleet: TEAMS.reduce((a, t) => a + t.finalFleet, 0),
    fish: TEAMS.reduce((a, t) => a + t.fish, 0),
    debt: TEAMS.reduce((a, t) => a + t.loan, 0),
    interestPaid: 13700,
  },
  ocean: { health: 18.4, depletion: 81.6, collapseRound: 9, overfishingRounds: 7, totalRounds: 13, recovery: 'Low' },
  fishStock:      [92,90,88,85,82,76,71,64,57,49,38,24,18.4],
  marketNetWorth: [260000,360000,500000,680000,860000,1080000,1320000,1580000,1860000,2150000,2470000,2780000,3052290],
  totalFleet:     [28,42,58,74,90,104,116,126,134,138,136,138,138],
  pressure: {
    harbor:  [6,9,13,17,19,23,26,27,30,30,30,30,30],
    coastal: [9,14,19,24,30,34,38,42,44,46,45,46,46],
    deep:    [13,19,26,33,41,47,52,57,60,62,61,62,62],
  },
  cumCatch:       [600,1100,1650,2250,2900,3400,3950,4450,4900,5250,5550,5780,5920],
  auction: {
    demand:    [420,470,520,580,650,720,820,900,1000,1120,1240,1360,1320],
    gap:       [-150,-150,-130,-140,-180,-260,-330,-400,-430,-480,-470,500,300],
    shipsSold: [2,3,3,4,5,6,7,9,10,12,13,15,12],
  },
  yourZone: [
    { label: 'Deep Sea', value: 936, color: C.EMERALD },
    { label: 'Coastal',  value: 430, color: C.CYAN },
    { label: 'Harbor',   value: 107, color: C.SLATE },
  ],
  lessons: [
    { icon: Clock,    title: 'Watch delayed feedback', body: 'Fish stocks don’t respond immediately. Harvesting heavily today can create costs several rounds later.' },
    { icon: BarChart3,title: 'Avoid overcapacity',     body: 'Fleet growth without restraint drives competition, lowers prices, and increases pressure on the resource.' },
    { icon: Users,    title: 'Coordinate earlier',     body: 'Shared agreements and transparency lead to better outcomes for all teams and the fishery.' },
    { icon: Heart,   title: 'Balance profit with stewardship', body: 'Sustainable strategies protect long-term earning potential and the health of the ocean.' },
  ],
};

// ─── Tooltip hook ─────────────────────────────────────────────────────────────
function useTooltip(): [React.Dispatch<React.SetStateAction<any>>, React.ReactNode] {
  const [tip, setTip] = useState<any>(null);
  const node = tip && typeof document !== 'undefined' && createPortal((
    <div style={{
      position: 'fixed', left: tip.x + 12, top: tip.y - 8, zIndex: 50, background: C.TEAL8, color: 'var(--color-card)',
      padding: '8px 12px', borderRadius: 8, fontFamily: F, fontSize: 12, pointerEvents: 'none',
      boxShadow: 'var(--shadow-elev-3)', lineHeight: 1.45, whiteSpace: 'nowrap', maxWidth: 300,
    }}>
      {tip.label && <div style={{ fontFamily: F, fontWeight: 600, fontSize: 13 }}>{tip.label}</div>}
      {tip.rows && tip.rows.map((r: any, i: number) => (
        <div key={i} style={{ display: 'flex', gap: 12, justifyContent: 'space-between', opacity: 0.92 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {r.color && <span style={{ width: 8, height: 8, borderRadius: 99, background: r.color, display: 'inline-block' }} />}{r.k}
          </span>
          <span style={{ fontFamily: F, fontWeight: 600 }}>{r.v}</span>
        </div>
      ))}
    </div>
  ), document.body);
  return [setTip, node];
}

// ─── Series-toggle hook + clickable legend ─────────────────────────────────────
function useSeriesToggle() {
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const toggle = (n: string) => setHidden(p => { const s = new Set(p); s.has(n) ? s.delete(n) : s.add(n); return s; });
  return { hidden, toggle };
}
function Legend({ items, hidden, toggle }: { items: { name: string; color: string; shape?: 'dot' | 'line' }[]; hidden: Set<string>; toggle: (n: string) => void }) {
  return (
    <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 10, flexWrap: 'wrap' }}>
      {items.map(it => {
        const off = hidden.has(it.name);
        return (
          <button key={it.name} onClick={() => toggle(it.name)} title="Click to filter"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontFamily: F, fontSize: 12, fontWeight: 500, color: off ? C.FG4 : C.FG3, opacity: off ? 0.5 : 1, textDecoration: off ? 'line-through' : 'none' }}>
            <span style={{ width: 12, height: it.shape === 'line' ? 3 : 12, borderRadius: it.shape === 'line' ? 2 : 99, background: it.color }} />{it.name}
          </button>
        );
      })}
    </div>
  );
}

// ─── Shared chart helpers (Recharts + shadcn) ──────────────────────────────────
const AXIS = { tickLine: false, axisLine: false, stroke: C.FG4, tick: { fontSize: 10, fill: C.FG4, fontFamily: F } } as const;
// Themed tooltip — shadcn surface tokens, per-series formatting.
function ThemedTip({ active, payload, label, fmtMap }: { active?: boolean; payload?: any[]; label?: any; fmtMap: Record<string, (v: number) => string> }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ fontFamily: F, background: C.CARD, border: `1px solid ${C.CARDBORDER}`, borderRadius: 10, padding: '8px 12px', boxShadow: C.CARDSHADOW, minWidth: 140 }}>
      <div style={{ fontWeight: 600, fontSize: 12, color: C.FG1, marginBottom: 4 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ display: 'flex', justifyContent: 'space-between', gap: 14, fontSize: 12, lineHeight: 1.6 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.FG3 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: p.color || p.stroke || p.fill }} />{p.name}</span>
          <span style={{ fontWeight: 600, color: C.FG1, fontVariantNumeric: 'tabular-nums' }}>{(fmtMap[p.name] || ((v: number) => String(v)))(p.value)}</span>
        </div>
      ))}
    </div>
  );
}
const lastDot = (color: string, lastIdx: number) => (p: any) =>
  p.index === lastIdx
    ? <circle key={p.index} cx={p.cx} cy={p.cy} r={5} fill="var(--color-card)" stroke={color} strokeWidth={3} />
    : <circle key={p.index} cx={p.cx} cy={p.cy} r={0} fill="none" />;
const toData = (xLabels: string[], series: { name: string; data: number[] }[]) =>
  xLabels.map((x, i) => { const o: any = { x }; series.forEach(s => { o[s.name] = s.data[i]; }); return o; });
const cfgOf = (series: { name: string; color: string }[]): ChartConfig =>
  Object.fromEntries(series.map(s => [s.name, { label: s.name, color: s.color }]));

// ─── BarsLineChart — workhorse dual-axis (Recharts ComposedChart) ───────────────
type BarSeries = { name: string; color: string; negColor?: string; data: number[]; axis?: 'left' | 'right'; fmt?: (v: number) => string };
type LineSeries = { name: string; color: string; data: number[]; axis?: 'left' | 'right'; dashed?: boolean; fill?: boolean; normalize?: boolean; fmt?: (v: number) => string; marker?: boolean };
function BarsLineChart({ xLabels, barMode = 'stacked', bars = [], lines = [], bands = [], leftAxis, rightAxis, height = 300 }: {
  xLabels: string[]; barMode?: 'stacked' | 'grouped'; bars?: BarSeries[]; lines?: LineSeries[];
  bands?: { from: number; to: number; color: string; label?: string }[];
  leftAxis: { format: (v: number) => string; label?: string; max?: number };
  rightAxis?: { format: (v: number) => string; label?: string; max?: number };
  width?: number; height?: number; leftTicks?: number;
}) {
  const { hidden, toggle } = useSeriesToggle();
  const all = [...bars, ...lines];
  const data = toData(xLabels, all);
  const fmtMap: Record<string, (v: number) => string> = {};
  all.forEach(s => { fmtMap[s.name] = s.fmt || ((s as any).axis === 'right' ? (rightAxis?.format || String) : leftAxis.format); });
  const onRight = (a?: string) => a === 'right';
  const hasNeg = bars.some(b => b.data.some(v => v < 0)) || lines.some(l => !l.normalize && (l.axis !== 'right') && l.data.some(v => v < 0));
  const leftDomain: [any, any] = leftAxis.max != null ? [0, leftAxis.max] : hasNeg ? ['auto', 'auto'] : [0, 'auto'];
  const rightDomain: [any, any] = [0, rightAxis?.max ?? 'auto'];
  const lastIdx = xLabels.length - 1;

  return (
    <div>
      <ChartContainer config={cfgOf(all)} className="w-full" style={{ height, aspectRatio: 'auto' }}>
        <ComposedChart data={data} margin={{ top: 16, right: rightAxis ? 10 : 8, left: 4, bottom: 4 }}>
          <CartesianGrid vertical={false} stroke={C.BORDER} strokeOpacity={0.5} />
          {bands.map((b, i) => (
            <ReferenceArea key={i} yAxisId="left" y1={b.from} y2={b.to} fill={b.color} fillOpacity={1} stroke="none"
              label={{ value: b.label, position: 'insideTopLeft', fontSize: 9, fill: C.FG4, fontWeight: 700, fontFamily: F }} />
          ))}
          <XAxis dataKey="x" interval={0} tickMargin={8} {...AXIS} />
          <YAxis yAxisId="left" width={50} domain={leftDomain} tickFormatter={leftAxis.format} {...AXIS} />
          {rightAxis && <YAxis yAxisId="right" orientation="right" width={46} domain={rightDomain} tickFormatter={rightAxis.format} {...AXIS} />}
          {lines.filter(l => l.normalize).map(l => <YAxis key={l.name} yAxisId={l.name} hide domain={[0, Math.max(...l.data)]} />)}
          <ChartTooltip cursor={{ stroke: C.TEAL, strokeDasharray: '3 3', strokeOpacity: 0.4 }} content={<ThemedTip fmtMap={fmtMap} />} />
          {bars.map(b => (
            <Bar key={b.name} dataKey={b.name} yAxisId={onRight(b.axis) ? 'right' : 'left'} stackId={barMode === 'stacked' ? 's' : undefined}
              fill={b.color} radius={barMode === 'stacked' ? 0 : 3} maxBarSize={46} hide={hidden.has(b.name)} isAnimationActive={false}>
              {b.negColor && data.map((d, i) => <Cell key={i} fill={(d[b.name] as number) < 0 ? b.negColor! : b.color} />)}
            </Bar>
          ))}
          {lines.map(l => {
            const yId = l.normalize ? l.name : onRight(l.axis) ? 'right' : 'left';
            if (l.fill) return <Area key={l.name} dataKey={l.name} yAxisId={yId} type="monotone" stroke={l.color} strokeWidth={2.25} fill={l.color} fillOpacity={0.07} dot={false} hide={hidden.has(l.name)} isAnimationActive={false} strokeDasharray={l.dashed ? '5 4' : undefined} />;
            return <Line key={l.name} dataKey={l.name} yAxisId={yId} type="monotone" stroke={l.color} strokeWidth={2.25} strokeDasharray={l.dashed ? '5 4' : undefined} dot={l.marker ? lastDot(l.color, lastIdx) : false} activeDot={{ r: 4 }} hide={hidden.has(l.name)} isAnimationActive={false} />;
          })}
        </ComposedChart>
      </ChartContainer>
      <Legend items={all.map(s => ({ name: s.name, color: s.color }))} hidden={hidden} toggle={toggle} />
    </div>
  );
}

// ─── Donut ──────────────────────────────────────────────────────────────────--
function Donut({ data, size = 200, centerLabel, centerSub }: { data: { label: string; value: number; color: string }[]; size?: number; centerLabel?: string; centerSub?: string }) {
  const [setTip, tipNode] = useTooltip();
  const [hover, setHover] = useState<number | null>(null);
  const cx = size / 2, cy = size / 2, Rr = size / 2 - 6, r = Rr - 26;
  const total = data.reduce((a, d) => a + d.value, 0);
  const f = (n: number) => Number(n.toFixed(4));
  let a0 = -Math.PI / 2;
  const arcs = data.map((d, i) => {
    const a1 = a0 + (d.value / total) * Math.PI * 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const x0 = f(cx + Math.cos(a0) * Rr), y0 = f(cy + Math.sin(a0) * Rr);
    const x1 = f(cx + Math.cos(a1) * Rr), y1 = f(cy + Math.sin(a1) * Rr);
    const xi1 = f(cx + Math.cos(a1) * r), yi1 = f(cy + Math.sin(a1) * r);
    const xi0 = f(cx + Math.cos(a0) * r), yi0 = f(cy + Math.sin(a0) * r);
    const path = `M${x0},${y0} A${Rr},${Rr} 0 ${large} 1 ${x1},${y1} L${xi1},${yi1} A${r},${r} 0 ${large} 0 ${xi0},${yi0} Z`;
    const seg = { ...d, path, pct: (d.value / total) * 100 }; a0 = a1; return seg;
  });
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
      <svg width={size} height={size}>
        {arcs.map((a, i) => (
          <path key={i} d={a.path} fill={a.color} opacity={hover != null && hover !== i ? 0.35 : 1} style={{ transition: 'opacity 120ms', cursor: 'pointer' }}
            onMouseEnter={e => { setHover(i); setTip({ x: e.clientX, y: e.clientY, label: a.label, rows: [{ k: 'Catch', v: a.value.toLocaleString(), color: a.color }, { k: 'Share', v: a.pct.toFixed(1) + '%' }] }); }}
            onMouseLeave={() => { setHover(null); setTip(null); }} />
        ))}
        {centerLabel && <text x={cx} y={cy - 2} textAnchor="middle" fontSize="24" fontFamily={F} fontWeight="700" fill={C.FG1}>{centerLabel}</text>}
        {centerSub && <text x={cx} y={cy + 18} textAnchor="middle" fontSize="10" fill={C.FG3} fontFamily={F} letterSpacing="0.06em">{centerSub}</text>}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 160, flex: 1 }}>
        {arcs.map((a, i) => (
          <div key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
            style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 12, alignItems: 'center', opacity: hover != null && hover !== i ? 0.5 : 1, transition: 'opacity 120ms' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: F, fontSize: 13, color: C.FG1 }}><span style={{ width: 10, height: 10, borderRadius: 99, background: a.color }} />{a.label}</span>
            <span style={{ fontFamily: F, fontWeight: 600, fontSize: 13, color: C.FG3, fontVariantNumeric: 'tabular-nums' }}>{a.pct.toFixed(1)}%</span>
            <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: C.FG1, fontVariantNumeric: 'tabular-nums', minWidth: 44, textAlign: 'right' }}>{a.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
      {tipNode}
    </div>
  );
}

// ─── Radial gauge ──────────────────────────────────────────────────────────────
function Gauge({ value, label, sub, color, size = 200 }: { value: number; label: string; sub: string; color: string; size?: number }) {
  const cx = size / 2, cy = size / 2, Rr = size / 2 - 14;
  const start = Math.PI * 0.75, end = Math.PI * 2.25;
  const a1 = start + (end - start) * Math.max(0, Math.min(1, value / 100));
  const f = (n: number) => Number(n.toFixed(4));
  const polar = (a: number, rr: number) => [f(cx + Math.cos(a) * rr), f(cy + Math.sin(a) * rr)];
  const arc = (a0: number, aa: number) => { const [x0, y0] = polar(a0, Rr); const [x1, y1] = polar(aa, Rr); const large = aa - a0 > Math.PI ? 1 : 0; return `M${x0},${y0} A${Rr},${Rr} 0 ${large} 1 ${x1},${y1}`; };
  return (
    <svg width={size} height={size}>
      <path d={arc(start, end)} fill="none" stroke={C.BORDER} strokeWidth="14" strokeLinecap="round" />
      <path d={arc(start, a1)} fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" />
      <text x={cx} y={cy - 2} textAnchor="middle" fontFamily={F} fontWeight="700" fontSize="34" fill={C.FG1}>{value.toFixed(1)}%</text>
      <text x={cx} y={cy + 20} textAnchor="middle" fontFamily={F} fontSize="11" fill={C.FG3} letterSpacing="0.06em">{label}</text>
      <text x={cx} y={cy + 38} textAnchor="middle" fontFamily={F} fontSize="10" fill={color} fontWeight={600}>{sub}</text>
    </svg>
  );
}

// ─── BalanceScale (individual market share) ────────────────────────────────────
function BalanceScale({ you, avg }: { you: number; avg: number }) {
  const f = (n: number) => Number(n.toFixed(4));
  const tilt = f(Math.max(-9, Math.min(9, ((you - avg) / Math.max(you, avg)) * 22)));
  return (
    <svg width="220" height="150" viewBox="0 0 220 150">
      <line x1="110" y1="24" x2="110" y2="118" stroke={C.BORDER} strokeWidth="3" strokeLinecap="round" />
      <rect x="86" y="118" width="48" height="8" rx="4" fill={C.BORDER} />
      <g transform={`rotate(${tilt} 110 28)`}>
        <line x1="40" y1="28" x2="180" y2="28" stroke={C.TEAL7} strokeWidth="3" strokeLinecap="round" />
        <path d="M40 28 L24 64 L56 64 Z" fill={C.CYAN100} stroke={C.CYAN} strokeWidth="1.5" />
        <text x="40" y="56" textAnchor="middle" fontFamily={F} fontWeight="700" fontSize="13" fill={C.TEAL8}>{you.toLocaleString()}</text>
        <path d="M180 28 L164 60 L196 60 Z" fill={C.MUTED} stroke={C.BORDER} strokeWidth="1.5" />
        <text x="180" y="52" textAnchor="middle" fontFamily={F} fontWeight="700" fontSize="13" fill={C.FG3}>{avg.toLocaleString()}</text>
      </g>
      <text x="40" y="142" textAnchor="middle" fontFamily={F} fontSize="10" fill={C.FG3}>You</text>
      <text x="180" y="142" textAnchor="middle" fontFamily={F} fontSize="10" fill={C.FG3}>Market avg</text>
    </svg>
  );
}

// ─── Single-series line / area / bar (individual report, Recharts) ──────────────
function LineChart({ series, xLabels, height = 240, yFormat = (v: number) => String(v), yTicks = 4 }: {
  series: { name: string; color: string; data: number[]; fill?: boolean }[]; xLabels: string[]; width?: number; height?: number; yFormat?: (v: number) => string; yTicks?: number;
}) {
  const data = toData(xLabels, series);
  const fmtMap = Object.fromEntries(series.map(s => [s.name, yFormat]));
  return (
    <div>
      <ChartContainer config={cfgOf(series)} className="w-full" style={{ height, aspectRatio: 'auto' }}>
        <ComposedChart data={data} margin={{ top: 12, right: 8, left: 4, bottom: 4 }}>
          <CartesianGrid vertical={false} stroke={C.BORDER} strokeOpacity={0.5} />
          <XAxis dataKey="x" interval={0} tickMargin={8} {...AXIS} />
          <YAxis width={50} tickFormatter={yFormat} tickCount={yTicks + 1} {...AXIS} />
          <ChartTooltip cursor={{ stroke: C.TEAL, strokeDasharray: '3 3', strokeOpacity: 0.4 }} content={<ThemedTip fmtMap={fmtMap} />} />
          {series.map(s => s.fill
            ? <Area key={s.name} dataKey={s.name} type="monotone" stroke={s.color} strokeWidth={2.25} fill={s.color} fillOpacity={0.07} dot={false} isAnimationActive={false} />
            : <Line key={s.name} dataKey={s.name} type="monotone" stroke={s.color} strokeWidth={2.25} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />)}
        </ComposedChart>
      </ChartContainer>
      {series.length > 1 && <Legend items={series.map(s => ({ name: s.name, color: s.color }))} hidden={new Set()} toggle={() => { }} />}
    </div>
  );
}
function StackedArea({ labels, series, height = 240 }: { labels: string[]; series: { name: string; color: string; data: number[] }[]; width?: number; height?: number }) {
  const data = toData(labels, series);
  const fmtMap = Object.fromEntries(series.map(s => [s.name, (v: number) => String(v)]));
  return (
    <div>
      <ChartContainer config={cfgOf(series)} className="w-full" style={{ height, aspectRatio: 'auto' }}>
        <ComposedChart data={data} margin={{ top: 12, right: 8, left: 4, bottom: 4 }}>
          <CartesianGrid vertical={false} stroke={C.BORDER} strokeOpacity={0.5} />
          <XAxis dataKey="x" interval={0} tickMargin={8} {...AXIS} />
          <YAxis width={40} {...AXIS} />
          <ChartTooltip cursor={{ stroke: C.TEAL, strokeDasharray: '3 3', strokeOpacity: 0.4 }} content={<ThemedTip fmtMap={fmtMap} />} />
          {series.map(s => <Area key={s.name} dataKey={s.name} stackId="a" type="monotone" stroke={s.color} strokeWidth={1.5} fill={s.color} fillOpacity={0.6} isAnimationActive={false} />)}
        </ComposedChart>
      </ChartContainer>
      <Legend items={series.map(s => ({ name: s.name, color: s.color }))} hidden={new Set()} toggle={() => { }} />
    </div>
  );
}
function BarChart({ labels, data: vals, color = C.EMERALD, height = 240, yFormat = (v: number) => String(v) }: { labels: string[]; data: number[]; color?: string; width?: number; height?: number; yFormat?: (v: number) => string }) {
  const data = labels.map((x, i) => ({ x, value: vals[i] }));
  return (
    <ChartContainer config={{ value: { label: 'Value', color } }} className="w-full" style={{ height, aspectRatio: 'auto' }}>
      <ComposedChart data={data} margin={{ top: 12, right: 8, left: 4, bottom: 4 }}>
        <CartesianGrid vertical={false} stroke={C.BORDER} strokeOpacity={0.5} />
        <XAxis dataKey="x" interval={0} tickMargin={8} {...AXIS} />
        <YAxis width={50} tickFormatter={yFormat} {...AXIS} />
        <ChartTooltip cursor={{ fill: C.MUTED, fillOpacity: 0.6 }} content={<ThemedTip fmtMap={{ Value: yFormat }} />} />
        <Bar dataKey="value" name="Value" fill={color} radius={3} maxBarSize={42} isAnimationActive={false} />
      </ComposedChart>
    </ChartContainer>
  );
}

// ─── UI primitives ──────────────────────────────────────────────────────────--
function Card({ children, padding = 22, style = {} }: { children: React.ReactNode; padding?: number; style?: React.CSSProperties }) {
  return <div style={{ background: C.CARD, border: `1px solid ${C.CARDBORDER}`, borderRadius: 16, padding, boxShadow: C.CARDSHADOW, ...style }}>{children}</div>;
}
function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div style={{ fontFamily: F, fontWeight: 600, fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: C.FG3 }}>{children}</div>;
}
function SectionTitle({ eyebrow, title, sub, right }: { eyebrow?: string; title: string; sub?: string; right?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, gap: 12 }}>
      <div>{eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}<div style={{ fontFamily: F, fontWeight: 600, fontSize: 16, color: C.FG1, marginTop: 2 }}>{title}</div>{sub && <div style={{ fontFamily: F, fontSize: 12, color: C.FG3, marginTop: 2 }}>{sub}</div>}</div>
      {right}
    </div>
  );
}
function Pill({ children, tone = 'neutral', dot }: { children: React.ReactNode; tone?: 'neutral' | 'cyan' | 'success' | 'error' | 'warning'; dot?: string }) {
  const tones: Record<string, { bg: string; fg: string; border: string }> = {
    neutral: { bg: 'var(--color-card)', fg: C.FG1, border: `1px solid ${C.BORDER}` }, cyan: { bg: C.CYAN100, fg: C.TEAL8, border: 'none' },
    success: { bg: 'rgba(21,97,98,.1)', fg: C.EMERALD, border: 'none' }, error: { bg: 'rgba(198,82,82,.1)', fg: 'var(--destructive)', border: 'none' }, warning: { bg: 'rgba(180,83,9,.1)', fg: C.AMBER, border: 'none' },
  };
  const t = tones[tone];
  return <div style={{ background: t.bg, color: t.fg, border: t.border, height: 26, padding: '0 10px', borderRadius: 999, fontFamily: F, fontWeight: 500, fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>{dot && <span style={{ width: 6, height: 6, borderRadius: 99, background: dot }} />}{children}</div>;
}
// Tiny trend sparkline
function Sparkline({ data, color, width = 76, height = 26 }: { data: number[]; color: string; width?: number; height?: number }) {
  const max = Math.max(...data), min = Math.min(...data);
  const xs = data.map((_, i) => (i / (data.length - 1)) * (width - 3) + 1.5);
  const ys = data.map(v => height - 3 - ((v - min) / ((max - min) || 1)) * (height - 6));
  const d = xs.map((x, i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
  const area = `${d} L${xs[xs.length - 1].toFixed(1)},${height} L${xs[0].toFixed(1)},${height} Z`;
  return (
    <svg width={width} height={height} style={{ flexShrink: 0 }}>
      <path d={area} fill={color} opacity="0.1" />
      <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r="2.4" fill={color} />
    </svg>
  );
}
type Trend = 'up' | 'down' | 'flat';
type Tone = 'good' | 'bad' | 'neutral';
// KPI tile — flat glass, no left-accent ribbon (anti-ribbon rule). Accent = label dot.
// Optional sparkline + trend arrow restore "improving / declining" direction without round deltas.
function KpiTile({ label, value, accent, valueColor, caption, spark, trendDir, trendTone = 'neutral' }: { label: string; value: string; accent: string; valueColor?: string; caption?: string; spark?: number[]; trendDir?: Trend; trendTone?: Tone }) {
  const toneColor = trendTone === 'good' ? C.EMERALD : trendTone === 'bad' ? C.ROSE : C.FG4;
  const arrow = trendDir === 'up' ? '▲' : trendDir === 'down' ? '▼' : '';
  return (
    <div style={{ background: C.CARD, border: `1px solid ${C.CARDBORDER}`, borderRadius: 14, padding: '16px 18px', boxShadow: C.CARDSHADOW }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{ width: 7, height: 7, borderRadius: 99, background: accent, flexShrink: 0 }} />
        <span style={{ fontFamily: F, fontWeight: 600, fontSize: 11, letterSpacing: '.05em', textTransform: 'uppercase' as const, color: C.FG4 }}>{label}</span>
      </div>
      <div style={{ fontFamily: F, fontWeight: 700, fontSize: 24, color: valueColor || C.FG1, fontVariantNumeric: 'tabular-nums', lineHeight: 1, marginTop: 6 }}>{value}</div>
      {(caption || trendDir) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
          {arrow && <span style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: toneColor }}>{arrow}</span>}
          {caption && <span style={{ fontFamily: F, fontSize: 11, color: valueColor && valueColor !== C.FG1 ? valueColor : C.FG3, fontWeight: 500 }}>{caption}</span>}
        </div>
      )}
    </div>
  );
}
type Cell = string | { v: string; color?: string; bold?: boolean };
function DataTable({ cols, rows, firstColWidth = '1.6fr', minWidth = 760 }: { cols: string[]; rows: Cell[][]; firstColWidth?: string; minWidth?: number }) {
  const grid = `${firstColWidth} ${cols.slice(1).map(() => '1fr').join(' ')}`;
  return (
    <div style={{ overflowX: 'auto', borderRadius: 12, border: `1px solid ${C.CARDBORDER}` }}>
      <div style={{ minWidth }}>
        <div style={{ display: 'grid', gridTemplateColumns: grid, background: C.HEADERBG, padding: '12px 16px', fontFamily: F, fontSize: 10.5, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase' as const, color: C.FG4 }}>{cols.map((c, i) => <div key={i} style={{ textAlign: i === 0 ? 'left' : 'right' }}>{c}</div>)}</div>
        {rows.map((row, ri) => (<div key={ri} className="fr-row" style={{ display: 'grid', gridTemplateColumns: grid, padding: '13px 16px', borderTop: `1px solid ${C.ROWLINE}`, alignItems: 'center' }}>{row.map((cell, ci) => { const o = typeof cell === 'string' ? { v: cell } as { v: string; color?: string; bold?: boolean } : cell; return <div key={ci} style={{ textAlign: ci === 0 ? 'left' : 'right', fontFamily: F, fontSize: 13, fontWeight: ci === 0 || o.bold ? 600 : 500, color: o.color || (ci === 0 ? C.FG1 : C.FG3), fontVariantNumeric: 'tabular-nums' }}>{o.v}</div>; })}</div>))}
      </div>
    </div>
  );
}
// Level chip for impact matrix
function Level({ v }: { v: string }) {
  const map: Record<string, string> = { High: C.ROSE, Medium: C.AMBER, Low: C.EMERALD };
  return <span style={{ fontFamily: F, fontWeight: 700, fontSize: 12, color: map[v] || C.FG1 }}>{v}</span>;
}
// Team identity badge — letter chip (A–E) in the Cyan token style. Replaces color
// dots, which read as generic / AI. Active state fills teal for the user's team.
function TeamBadge({ id, active = false, size = 24 }: { id: string; active?: boolean; size?: number }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: 8, flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: F, fontWeight: 700, fontSize: size * 0.5, lineHeight: 1,
      background: active ? C.TEAL7 : C.CYAN100, color: active ? 'var(--color-card)' : C.TEAL7,
      border: `1px solid ${active ? C.TEAL7 : 'var(--color-border)'}`,
    }}>{id}</span>
  );
}
// Group header — top-level wayfinding between report phases (creates the IA rhythm:
// generous space before each group, tight spacing within).
function GroupHeader({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div style={{ marginTop: 22 }}>
      <span style={{ fontFamily: F, fontWeight: 700, fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase' as const, color: C.TEAL7, background: C.CYAN100, padding: '3px 9px', borderRadius: 6 }}>{eyebrow}</span>
      <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 22, color: C.FG1, margin: '10px 0 0', letterSpacing: '-.01em' }}>{title}</h2>
      {sub && <p style={{ fontFamily: F, fontSize: 13, color: C.FG3, margin: '4px 0 0' }}>{sub}</p>}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// INDIVIDUAL REPORT
// ════════════════════════════════════════════════════════════════════════════
function IndividualReport() {
  const s = DATA.summary, k = DATA.kpi;
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.9fr 1fr', gap: 16, alignItems: 'start' }}>
        <Card>
          <SectionTitle eyebrow="Audit trail" title="Strategic decisions log" sub="Fleet position and catch, every round" />
          <DataTable firstColWidth="0.7fr" minWidth={820}
            cols={['Round', 'Harbor', 'Coastal', 'Deep sea', 'Bought', 'Sold', 'Fish', 'Net worth']}
            rows={R.map((r, i) => [
              { v: r.replace('R', ''), bold: true, color: C.TEAL8 },
              { v: String(DATA.fleet.harbor[i]), color: DATA.fleet.harbor[i] ? ZONE.harbor : C.FG4 },
              { v: String(DATA.fleet.coastal[i]), color: DATA.fleet.coastal[i] ? C.TEAL7 : C.FG4 },
              { v: String(DATA.fleet.deep[i]), color: DATA.fleet.deep[i] ? C.EMERALD : C.FG4 },
              { v: String(DATA.fleet.bought[i]), color: DATA.fleet.bought[i] ? C.AMBER : C.FG4 },
              String(DATA.fleet.sold[i]),
              { v: String(DATA.catch.total[i]), color: C.FG1 },
              { v: fmt$(DATA.netWorth[i]), bold: true, color: C.FG1 },
            ])} />
        </Card>
        <Card>
          <SectionTitle eyebrow="Scoreboard" title="Your team" sub="Final season standings" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              { k: 'Final net worth', v: fmt$(s.finalNetWorth), c: C.TEAL8, bold: true }, { k: 'Peak fleet size', v: String(s.peakFleet) },
              { k: 'Total fish caught', v: s.totalFishCaught.toLocaleString() }, { k: 'Final fish stock', v: s.finalFishStock.toFixed(1) + '%', c: C.ROSE },
              { k: 'Total revenue', v: fmt$(s.totalRevenue), c: C.EMERALD }, { k: 'Total ships', v: String(s.totalShips) },
              { k: 'Total cost', v: fmt$(s.totalCost), c: C.ROSE }, { k: 'Loan', v: fmt$(s.loan), c: C.EMERALD },
            ].map((row, i, arr) => (<div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: i < arr.length - 1 ? `1px solid ${C.MUTED}` : 'none' }}><span style={{ fontFamily: F, fontSize: 13, color: C.FG3 }}>{row.k}</span><span style={{ fontFamily: F, fontSize: 14, fontWeight: row.bold ? 700 : 600, color: row.c || C.FG1, fontVariantNumeric: 'tabular-nums' }}>{row.v}</span></div>))}
          </div>
        </Card>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        <KpiTile label="Bank balance" value={fmt$(k.bankBalance)} accent={C.CYAN} />
        <KpiTile label="Net worth" value={fmt$(k.netWorth)} accent={C.TEAL8} />
        <KpiTile label="Fish caught" value={k.fishCaught.toLocaleString()} accent={C.EMERALD} />
        <KpiTile label="Fish health" value={k.fishHealth.toFixed(1) + '%'} accent={C.ROSE} valueColor={C.ROSE} />
        <KpiTile label="Ships owned" value={String(k.shipsOwned)} accent={C.SOFT} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        <KpiTile label="Current profit" value={fmt$(k.currentProfit)} accent={C.EMERALD} valueColor={C.EMERALD} />
        <KpiTile label="Profit per ship" value={fmt$(k.profitPerShip)} accent={C.AMBER} />
        <KpiTile label="Start balance" value={fmt$(k.startBalance)} accent={C.FG4} />
        <KpiTile label="Final balance" value={fmt$(k.finalBalance)} accent={C.TEAL7} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card><SectionTitle eyebrow="Market" title="Market price of ships" sub="Cost per ship ($/ship)" /><LineChart width={540} height={220} xLabels={R} series={[{ name: 'Market price', color: C.CYAN, data: DATA.fleet.marketPrice }]} yFormat={v => `$${v.toFixed(0)}`} yTicks={3} /></Card>
        <Card><SectionTitle eyebrow="Capacity" title="Total fleet size" sub="Ships owned per round" /><LineChart width={540} height={220} xLabels={R} series={[{ name: 'Ships', color: C.GREEN, data: DATA.fleet.total, fill: true }]} yFormat={v => v.toFixed(0)} yTicks={3} /></Card>
      </div>
      <Card>
        <SectionTitle eyebrow="Fleet status history" title="Round-by-round fleet log" />
        <DataTable firstColWidth="1.4fr" cols={['Metric', ...R]} rows={[
          ['Market price ($/ship)', ...DATA.fleet.marketPrice.map(v => `$${v}`)],
          ['Ships ordered', ...DATA.fleet.bought.map(v => ({ v: String(v), color: v ? C.AMBER : C.FG4 }))],
          ['Auctioned (sell)', ...DATA.fleet.sold.map(v => String(v))],
          ['Total ships', ...DATA.fleet.total.map(v => ({ v: String(v), bold: true, color: C.FG1 }))],
          ['Total value ($)', ...DATA.fleet.totalValue.map(v => `$${v}`)],
        ]} />
      </Card>
      <Card>
        <SectionTitle eyebrow="Revenue breakdown" title="Income by source" sub="Fish sales, ship sales and interest" />
        <DataTable firstColWidth="1.4fr" cols={['Source', ...R]} rows={[
          ['Revenue from fish', ...DATA.revenue.fish.map(v => `$${v}`)],
          ['Ship sales', ...DATA.revenue.shipSales.map(v => `$${v}`)],
          ['Interest received', ...DATA.revenue.interest.map(v => ({ v: `$${v.toLocaleString()}`, color: C.EMERALD }))],
        ]} />
      </Card>
      <Card>
        <SectionTitle eyebrow="Expenses breakdown" title="Cost by type" />
        <DataTable firstColWidth="1.4fr" cols={['Expense type', ...R]} rows={[
          ['Operating costs', ...DATA.expenses.operating.map(v => `$${v}`)], ['Other costs', ...DATA.expenses.other.map(v => `$${v}`)],
          ['Auction costs', ...DATA.expenses.auction.map(v => `$${v}`)], ['New ship orders', ...DATA.expenses.ships.map(v => ({ v: `$${v}`, color: v ? C.AMBER : C.FG4 }))],
          ['Interest payment', ...DATA.expenses.interestPaid.map(v => `$${v}`)], ['Total expenses', ...DATA.expenses.total.map(v => ({ v: `$${v}`, bold: true, color: C.FG1 }))],
        ]} />
      </Card>
      <Card><SectionTitle eyebrow="Profitability" title="Profit over time" sub="Net gain per round" /><BarChart width={1080} height={260} labels={R} data={DATA.profit} color={C.GREEN} yFormat={v => `$${(v / 1000).toFixed(0)}k`} /></Card>
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 16, alignItems: 'start' }}>
        <Card><SectionTitle eyebrow="Catch summary" title="Catch by zone per round" /><DataTable firstColWidth="1.2fr" cols={['Zone', ...R]} rows={[
          ['Coast catch', ...DATA.catch.coastal.map(v => ({ v: String(v), color: v ? C.TEAL7 : C.FG4 }))], ['Deep catch', ...DATA.catch.deep.map(v => ({ v: String(v), color: v ? C.EMERALD : C.FG4 }))],
          ['Harbor catch', ...DATA.catch.harbor.map(v => ({ v: String(v), color: C.FG4 }))], ['Total catch', ...DATA.catch.total.map(v => ({ v: String(v), bold: true, color: v ? C.FG1 : C.ROSE }))],
        ]} /></Card>
        <Card>
          <SectionTitle eyebrow="Benchmark" title="Market share" sub="Your catch vs fleet average" />
          <div style={{ display: 'flex', justifyContent: 'center' }}><BalanceScale you={k.fishCaught} avg={k.marketAvgCatch} /></div>
          <div style={{ marginTop: 8, padding: 12, borderRadius: 10, background: C.CYAN100 }}><span style={{ fontFamily: F, fontSize: 12, color: C.TEAL8, lineHeight: 1.45 }}>You are outperforming the market average by <strong>{Math.round((k.fishCaught / k.marketAvgCatch - 1) * 100)}%</strong> this season.</span></div>
        </Card>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card><SectionTitle eyebrow="Efficiency" title="Profit generated per ship" sub="$/ship per round" /><LineChart width={540} height={240} xLabels={R} series={[{ name: 'Profit / ship', color: C.CYAN, data: DATA.profitPerShip, fill: true }]} yFormat={v => `$${(v / 1000).toFixed(0)}k`} /></Card>
        <Card><SectionTitle eyebrow="Deployment" title="Ship deployment visualization" sub="Fleet split across grounds" /><StackedArea width={540} height={240} labels={R} series={[{ name: 'Coast', color: ZONE.coastal, data: DATA.fleet.coastal }, { name: 'Deep sea', color: ZONE.deep, data: DATA.fleet.deep }, { name: 'Harbor', color: ZONE.harbor, data: DATA.fleet.harbor }]} /></Card>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// TEAM REPORT — cohort end report (redesigned)
// ════════════════════════════════════════════════════════════════════════════

// Sortable team ranking table
function RankingTable() {
  const totalFish = T.totals.fish;
  const rows0 = TEAMS.map(t => ({ ...t, catchShare: (t.fish / totalFish) * 100 }));
  const rankByNW = [...rows0].sort((a, b) => b.netWorth - a.netWorth).map(t => t.id);
  type K = 'netWorth' | 'fish' | 'catchShare' | 'finalFleet' | 'loan' | 'sustainability' | 'balanced' | 'name';
  const [sort, setSort] = useState<{ k: K; dir: 'asc' | 'desc' }>({ k: 'netWorth', dir: 'desc' });
  const cols: { k: K; label: string; num: boolean; fmt?: (v: any) => string }[] = [
    { k: 'name', label: 'Team', num: false },
    { k: 'netWorth', label: 'Final net worth', num: true, fmt: fmt$ },
    { k: 'fish', label: 'Fish caught', num: true, fmt: (v) => v.toLocaleString() },
    { k: 'catchShare', label: 'Catch share', num: true, fmt: (v) => v.toFixed(1) + '%' },
    { k: 'finalFleet', label: 'Fleet', num: true, fmt: String },
    { k: 'loan', label: 'Loan balance', num: true, fmt: fmt$ },
    { k: 'sustainability', label: 'Sustainability', num: true, fmt: (v) => v.toFixed(1) + '%' },
    { k: 'balanced', label: 'Balanced', num: true, fmt: (v) => v.toFixed(1) },
  ];
  const rows = [...rows0].sort((a, b) => { const av = a[sort.k] as any, bv = b[sort.k] as any; const d = av < bv ? -1 : av > bv ? 1 : 0; return sort.dir === 'asc' ? d : -d; });
  const grid = '40px 1.3fr 1.2fr 1fr 1fr 0.8fr 1.1fr 1.2fr 1fr 1.4fr';
  const sortCol = (k: K) => setSort(s => s.k === k ? { k, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { k, dir: 'desc' });
  const scoreColor = (v: number, hi: number, mid: number) => v >= hi ? C.EMERALD : v >= mid ? C.AMBER : C.ROSE;
  return (
    <div style={{ overflowX: 'auto', borderRadius: 12, border: `1px solid ${C.CARDBORDER}` }}>
      <div style={{ minWidth: 980 }}>
        <div style={{ display: 'grid', gridTemplateColumns: grid, background: C.HEADERBG, padding: '12px 16px', fontFamily: F, fontSize: 10.5, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' as const, color: C.FG4 }}>
          <div>Rank</div>
          {cols.map(c => (
            <button key={c.k} onClick={() => sortCol(c.k)} style={{ textAlign: c.num ? 'right' : 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: F, fontSize: 10, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase' as const, color: sort.k === c.k ? C.TEAL7 : C.FG3, display: 'flex', justifyContent: c.num ? 'flex-end' : 'flex-start', alignItems: 'center', gap: 4 }}>
              {c.label}{sort.k === c.k && <span style={{ fontSize: 9 }}>{sort.dir === 'asc' ? '▲' : '▼'}</span>}
            </button>
          ))}
          <div style={{ textAlign: 'right' }}>Behavior</div>
        </div>
        {rows.map(t => {
          const rank = rankByNW.indexOf(t.id) + 1;
          return (
            <div key={t.id} className={t.you ? undefined : 'fr-row'} style={{ display: 'grid', gridTemplateColumns: grid, padding: '13px 16px', borderTop: `1px solid ${C.ROWLINE}`, alignItems: 'center', background: t.you ? C.CYAN100 : 'transparent' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>{rank === 1 ? <Crown size={18} color={C.AMBER} /> : <span style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: C.FG4 }}>{rank}</span>}</div>
              <div style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: t.you ? C.TEAL7 : C.FG1 }}>{t.name}{t.you && <span style={{ fontWeight: 600, color: C.TEAL7 }}> · you</span>}</div>
              <div style={{ textAlign: 'right', fontFamily: F, fontWeight: 700, fontSize: 13, color: C.FG1, fontVariantNumeric: 'tabular-nums' }}>{fmt$(t.netWorth)}</div>
              <div style={{ textAlign: 'right', fontFamily: F, fontSize: 13, color: C.FG3, fontVariantNumeric: 'tabular-nums' }}>{t.fish.toLocaleString()}</div>
              <div style={{ textAlign: 'right', fontFamily: F, fontSize: 13, color: C.FG3, fontVariantNumeric: 'tabular-nums' }}>{t.catchShare.toFixed(1)}%</div>
              <div style={{ textAlign: 'right', fontFamily: F, fontSize: 13, color: C.FG3, fontVariantNumeric: 'tabular-nums' }}>{t.finalFleet}</div>
              <div style={{ textAlign: 'right', fontFamily: F, fontSize: 13, color: C.FG3, fontVariantNumeric: 'tabular-nums' }}>{fmt$(t.loan)}</div>
              <div style={{ textAlign: 'right', fontFamily: F, fontWeight: 600, fontSize: 13, color: scoreColor(t.sustainability, 30, 20), fontVariantNumeric: 'tabular-nums' }}>{t.sustainability.toFixed(1)}%</div>
              <div style={{ textAlign: 'right', fontFamily: F, fontWeight: 600, fontSize: 13, color: scoreColor(t.balanced, 70, 55), fontVariantNumeric: 'tabular-nums' }}>{t.balanced.toFixed(1)}</div>
              <div style={{ textAlign: 'right' }}><span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: C.TEAL7 }}>{t.behavior}</span></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Per-company financial explorer (click company → its revenue/cost/profit/net worth)
function FinancialExplorer({ width = 1080 }: { width?: number }) {
  const [active, setActive] = useState('B');
  const team = TEAMS.find(t => t.id === active)!;
  const f = team.finance;
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {TEAMS.map(t => {
          const on = t.id === active;
          return (
            <button key={t.id} onClick={() => setActive(t.id)} style={{
              border: `1px solid ${on ? C.TEAL7 : C.BORDER}`, cursor: 'pointer', padding: '6px 14px 6px 6px', borderRadius: 999,
              background: on ? C.CYAN100 : C.CARD, fontFamily: F, fontWeight: on ? 700 : 500, fontSize: 13, color: on ? C.TEAL8 : C.FG3,
              display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 140ms ease',
            }}><TeamBadge id={t.id} active={on} size={22} />{t.name.replace('Team ', 'Team ')}{t.you ? ' · you' : ''}</button>
          );
        })}
      </div>
      <BarsLineChart width={width} height={300} xLabels={R}
        lines={[
          { name: 'Revenue', color: C.GREEN, data: f.revenue, fmt: fmtK },
          { name: 'Cost', color: C.ROSE, data: f.cost, fmt: fmtK },
          { name: 'Profit', color: C.CYAN, data: f.profit, fmt: fmtK },
          { name: 'Net worth', color: C.TEAL8, data: f.netWorth, fill: true, fmt: fmtK },
        ]}
        leftAxis={{ format: fmtK }} />
    </div>
  );
}

function TeamReport() {
  const o = T.ocean, tot = T.totals;
  const you = TEAMS.find(t => t.id === 'B')!;
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {/* Verdict hero — the "so what", promoted to the top */}
      <Card style={{ background: 'linear-gradient(135deg, #3A8290, #244E59)' }}>
        <div style={{ fontFamily: F, fontWeight: 600, fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.65)' }}>Season verdict</div>
        <div style={{ fontFamily: F, fontWeight: 800, fontSize: 26, color: 'var(--color-card)', marginTop: 4, letterSpacing: '-.01em' }}>Profit grew, the commons collapsed</div>
        <p style={{ fontFamily: F, fontSize: 13, color: 'rgba(255,255,255,0.85)', margin: '8px 0 0', maxWidth: 720, lineHeight: 1.5 }}>
          Across {TEAMS.length} teams, market net worth reached {fmtK(tot.netWorth)} — but fleet pressure drove the shared stock to {o.health.toFixed(1)}%. Without intervention, recovery potential is {o.recovery.toLowerCase()}.
        </p>
        <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
          {['Ocean: At Risk', `Collapse warning · R${o.collapseRound}`, `Overfished ${o.overfishingRounds}/${o.totalRounds} rounds`, `Recovery: ${o.recovery}`].map((c, i) => (
            <span key={i} style={{ fontFamily: F, fontWeight: 600, fontSize: 11, color: 'var(--color-card)', background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.22)', borderRadius: 999, padding: '5px 12px' }}>{c}</span>
          ))}
        </div>
      </Card>

      {/* Headline KPI strip — sparkline + trend arrow restore direction */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(186px, 1fr))', gap: 12 }}>
        <KpiTile label="Final ocean health" value={o.health.toFixed(1) + '%'} accent={C.ROSE} valueColor={C.ROSE} caption="At Risk · declining" spark={T.fishStock} trendDir="down" trendTone="bad" />
        <KpiTile label="Your final net worth" value={fmt$(you.netWorth)} accent={C.TEAL8} caption="Team B · rising" spark={you.finance.netWorth} trendDir="up" trendTone="good" />
        <KpiTile label="Market net worth" value={fmtK(tot.netWorth)} accent={C.CYAN} caption="All teams · rising" spark={T.marketNetWorth} trendDir="up" trendTone="good" />
        <KpiTile label="Total fish harvested" value={tot.fish.toLocaleString()} accent={C.EMERALD} caption="Across all teams" spark={T.cumCatch} trendDir="up" trendTone="neutral" />
        <KpiTile label="Total market fleet" value={`${tot.fleet} ships`} accent={C.SOFT} caption="Across all teams" spark={T.totalFleet} trendDir="up" trendTone="neutral" />
      </div>

      {/* ─── DIAGNOSIS — is the ocean healthy? ─────────────────────────────── */}
      <GroupHeader eyebrow="Diagnosis" title="Ocean & market health" sub="The shared stock is collapsing while wealth keeps climbing — here's the divergence." />

      {/* Lead diagnosis chart */}
      <Card>
        <SectionTitle eyebrow="Sustainability" title="Ocean health over time" sub="Fish stock as % of carrying capacity — danger marker at season end"
          right={<div style={{ display: 'flex', gap: 8 }}><Pill tone="error" dot={C.ROSE}>Depletion {o.depletion.toFixed(1)}%</Pill><Pill tone="warning" dot={C.AMBER}>Recovery: {o.recovery}</Pill></div>} />
        <BarsLineChart width={1080} height={280} xLabels={R}
          bands={[
            { from: 0, to: 30, color: 'rgba(198,82,82,0.12)', label: 'DANGER < 30%' },
            { from: 30, to: 60, color: 'rgba(180,83,9,0.09)', label: 'AT RISK 30–60%' },
            { from: 60, to: 100, color: 'rgba(21,97,98,0.07)', label: 'HEALTHY > 60%' },
          ]}
          lines={[{ name: 'Fish stock', color: C.CYAN, data: T.fishStock, axis: 'left', marker: true, fmt: v => v.toFixed(1) + '%' }]}
          leftAxis={{ max: 100, format: v => `${v.toFixed(0)}%` }} />
      </Card>

      {/* Commons timeline + market summary KPIs (asymmetric) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 16, alignItems: 'start' }}>
        <Card>
          <SectionTitle eyebrow="The commons" title="Commons timeline — wealth, fleet & fish health" sub="Fish health falls (left axis) while market net worth and fleet keep rising. Click legend to filter." />
          <BarsLineChart width={720} height={300} xLabels={R}
            bands={[
              { from: 0, to: 30, color: 'rgba(198,82,82,0.10)', label: 'CRITICAL (0–30%)' },
              { from: 30, to: 70, color: 'rgba(180,83,9,0.08)', label: 'AT RISK (30–70%)' },
            ]}
            bars={[{ name: 'Total market net worth', color: 'rgba(79,144,224,0.45)', data: T.marketNetWorth, axis: 'right', fmt: fmtK }]}
            lines={[
              { name: 'Fish health %', color: C.GREEN, data: T.fishStock, axis: 'left', fill: true, fmt: v => v.toFixed(1) + '%' },
              { name: 'Total fleet size', color: C.FG4, data: T.totalFleet, axis: 'right', dashed: true, normalize: true, fmt: v => `${v} ships` },
            ]}
            leftAxis={{ max: 100, format: v => `${v.toFixed(0)}%` }}
            rightAxis={{ max: 3200000, format: v => `$${(v / 1e6).toFixed(1)}M` }} />
        </Card>
        <div style={{ display: 'grid', gap: 12, alignContent: 'start' }}>
          <KpiTile label="Average team net worth" value={fmtK(tot.avgNetWorth)} accent={C.TEAL7} caption="rising" trendDir="up" trendTone="good" />
          <KpiTile label="Total market debt" value={fmtK(tot.debt)} accent={C.ROSE} valueColor={C.ROSE} caption="climbing" trendDir="up" trendTone="bad" />
          <KpiTile label="Total interest paid" value={fmtK(tot.interestPaid)} accent={C.AMBER} caption="across all teams" trendDir="up" trendTone="neutral" />
        </div>
      </div>

      <Card>
        <SectionTitle eyebrow="Collective market pressure" title="Fleet pressure by zone vs total catch" sub="Stacked fleet count (left axis) and cumulative market catch (right axis). Filter zones via legend." />
        <BarsLineChart width={1080} height={300} xLabels={R} barMode="stacked"
          bars={[
            { name: 'Harbor fleet', color: ZONE.harbor, data: T.pressure.harbor, axis: 'left', fmt: v => `${v} ships` },
            { name: 'Coastal fleet', color: ZONE.coastal, data: T.pressure.coastal, axis: 'left', fmt: v => `${v} ships` },
            { name: 'Deep sea fleet', color: C.NAVY, data: T.pressure.deep, axis: 'left', fmt: v => `${v} ships` },
          ]}
          lines={[{ name: 'Total market catch', color: C.GREEN, data: T.cumCatch, axis: 'right', fmt: v => v.toLocaleString() + ' fish' }]}
          leftAxis={{ format: v => v.toFixed(0), label: 'Fleet' }}
          rightAxis={{ max: 6000, format: v => `${(v / 1000).toFixed(1)}k` }} />
      </Card>

      <Card>
        <SectionTitle eyebrow="Auction market" title="Auction dynamics — demand vs supply gap" sub="Bars: equilibrium gap (supply − demand) per round. Line: ships sold that round. Negative gap = demand exceeds supply." />
        <BarsLineChart width={1080} height={300} xLabels={R} barMode="grouped"
          bars={[{ name: 'Equilibrium gap', color: C.GREEN, negColor: C.ROSE, data: T.auction.gap, axis: 'left', fmt: v => (v > 0 ? '+' : '') + v }]}
          lines={[{ name: 'Ships sold', color: C.CYAN, data: T.auction.shipsSold, axis: 'right', fmt: v => `${v} ships` }]}
          leftAxis={{ format: v => v.toFixed(0), label: 'Gap' }}
          rightAxis={{ max: 16, format: v => v.toFixed(0) }} />
        <div style={{ marginTop: 8, padding: 12, borderRadius: 10, background: C.MUTED }}><span style={{ fontFamily: F, fontSize: 12, color: C.FG3, lineHeight: 1.45 }}>Demand outpaced supply for most of the game (negative gap → upward price pressure). From R12 supply catches up and the gap turns positive as ships sold peaks.</span></div>
      </Card>

      {/* ─── COMPARISON — how did the teams do? ────────────────────────────── */}
      <GroupHeader eyebrow="Comparison" title="Team standings" sub="Where each crew finished, and how your team's finances tracked." />

      <Card>
        <SectionTitle eyebrow="Leaderboard" title="Team performance ranking" sub="Click any column to sort. Your team is highlighted."
          right={<Pill tone="cyan">You · Team B</Pill>} />
        <RankingTable />
      </Card>

      {/* Financial explorer + your catch mix (asymmetric) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16, alignItems: 'start' }}>
        <Card>
          <SectionTitle eyebrow="Financials" title="Revenue, cost, profit & net worth" sub="Pick a company to inspect its full trajectory. Click legend to isolate a metric." />
          <FinancialExplorer width={640} />
        </Card>
        <Card>
          <SectionTitle eyebrow="Company performance" title="Your fish caught by zone" sub={`Team B harvest · ${you.fish.toLocaleString()} fish`} />
          <Donut size={188} centerLabel={you.fish.toLocaleString()} centerSub="TOTAL FISH" data={T.yourZone} />
        </Card>
      </div>

      {/* ─── ACTION — what to carry into next season? ──────────────────────── */}
      <GroupHeader eyebrow="Action" title="Behavior & what to carry forward" sub="Each crew's discipline profile, and the cohort's lessons for next season." />

      <Card>
        <SectionTitle eyebrow="Behavioral read" title="Team impact matrix" sub="Resource, fleet and debt discipline by team" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12 }}>
          {TEAMS.map(t => (
            <div key={t.id} style={{ borderRadius: 14, padding: 16, border: `1px solid ${t.you ? C.TEAL7 : C.CARDBORDER}`, background: t.you ? C.CYAN100 : C.CARD, boxShadow: t.you ? 'none' : C.CARDSHADOW }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
                <TeamBadge id={t.id} active={t.you} />
                <span style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: C.FG1 }}>{t.name}{t.you ? ' · you' : ''}</span>
              </div>
              {[['Resource impact', t.resource], ['Fleet discipline', t.fleetDisc], ['Debt discipline', t.debtDisc]].map(([k, v], idx, arr) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: idx < arr.length - 1 ? `1px solid ${C.ROWLINE}` : 'none', fontFamily: F, fontSize: 12, color: C.FG3 }}><span>{k}</span><Level v={v} /></div>
              ))}
              <div style={{ marginTop: 12 }}><Pill tone="cyan">{t.behavior}</Pill></div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle eyebrow="Debrief" title="Lessons learned" sub="What the cohort should carry into next season" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {T.lessons.map((l, i) => {
            const Icon = l.icon;
            return (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: 14, alignItems: 'start' }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: C.CYAN100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={18} color={C.TEAL7} /></div>
                <div><div style={{ fontFamily: F, fontWeight: 600, fontSize: 14, color: C.FG1 }}>{l.title}</div><div style={{ fontFamily: F, fontSize: 12, color: C.FG3, marginTop: 3, lineHeight: 1.5 }}>{l.body}</div></div>
              </div>
            );
          })}
        </div>
      </Card>

    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────--
type Mode = 'individual' | 'team';
const MODES: { id: Mode; label: string; sub: string }[] = [
  { id: 'individual', label: 'Individual report', sub: 'your crew, every round' },
  { id: 'team', label: 'Team report', sub: 'cohort standings & shared stock' },
];

export function FleetReport() {
  const navigate = useAppNavigate();
  const [mode, setMode] = useState<Mode>('team');
  const [copied, setCopied] = useState(false);
  const heading = mode === 'individual' ? 'Individual Report' : 'Team Performance Report';

  const copySummary = () => {
    const k = DATA.kpi, s = DATA.summary;
    const summary = mode === 'individual'
      ? [
          `FLEET REPORT — Individual · ${DATA.meta.team} · ${DATA.meta.season}`,
          `Net worth: ${fmt$(k.netWorth)}  |  Bank balance: ${fmt$(k.bankBalance)}`,
          `Fish caught: ${k.fishCaught.toLocaleString()}  |  Fish health: ${k.fishHealth.toFixed(1)}%`,
          `Ships owned: ${k.shipsOwned}  |  Profit/ship: ${fmt$(k.profitPerShip)}`,
          `Total revenue: ${fmt$(s.totalRevenue)}  |  Current profit: ${fmt$(k.currentProfit)}`,
        ].join('\n')
      : [
          `FLEET REPORT — Team Performance · ${DATA.meta.season}`,
          `Cohort net worth: ${fmt$(T.totals.netWorth)}  |  Avg: ${fmt$(T.totals.avgNetWorth)}`,
          `Total fleet: ${T.totals.fleet} ships  |  Total fish caught: ${T.totals.fish.toLocaleString()}`,
          `Ocean health: ${T.ocean.health}%  |  Depletion: ${T.ocean.depletion}%  |  Collapse round: R${T.ocean.collapseRound}`,
          `Standings: ${TEAMS.map(t => `${t.name}${t.you ? '(you)' : ''} ${fmt$(t.netWorth)}`).join(', ')}`,
        ].join('\n');
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageTransition>
      <style>{`.fr-row{transition:background 120ms ease;} .fr-row:hover{background:${C.MUTED};}`}</style>
      <GridBackground className="flex flex-col">
        <GameHeader />
        <div className="max-w-[1312px] mx-auto px-6 pb-24 pt-6 w-full">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <Eyebrow>Fish Game End Report · {DATA.meta.season}</Eyebrow>
              <h1 style={{ fontFamily: F, fontWeight: 800, fontSize: 44, marginTop: 4, letterSpacing: '-.02em', color: C.FG1, lineHeight: 1.1, display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ display: 'inline-flex', width: 52, height: 52, borderRadius: 14, background: C.CYAN100, alignItems: 'center', justifyContent: 'center' }}><Trophy size={26} color={C.TEAL7} /></span>
                {heading}
              </h1>
              <p style={{ fontFamily: F, color: C.FG3, fontSize: 14, margin: '6px 0 0' }}>{DATA.meta.team} · {DATA.meta.role} · compiled {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
              <button onClick={copySummary} style={{ height: 44, padding: '0 22px', borderRadius: 9999, background: 'var(--color-card)', color: copied ? C.EMERALD : C.FG1, border: `1px solid ${copied ? C.EMERALD : C.BORDER}`, fontFamily: F, fontWeight: 600, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'all 160ms ease' }}>{copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}</button>
              <button style={{ height: 44, padding: '0 22px', borderRadius: 9999, background: 'var(--color-card)', color: C.FG1, border: `1px solid ${C.BORDER}`, fontFamily: F, fontWeight: 600, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}><Download size={14} /> Export PDF</button>
              <div style={{ width: 200 }}><GameButton onClick={() => navigate('/game/leaderboard')}>View leaderboard</GameButton></div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'inline-flex', background: C.MUTED, borderRadius: 999, padding: 4 }}>
              {MODES.map(m => { const active = mode === m.id; return (<button key={m.id} onClick={() => setMode(m.id)} style={{ border: 'none', cursor: 'pointer', padding: '10px 22px', borderRadius: 999, background: active ? 'var(--color-card)' : 'transparent', boxShadow: active ? 'var(--shadow-elev-1)' : 'none', fontFamily: F, fontWeight: active ? 600 : 500, fontSize: 14, color: active ? C.TEAL8 : C.FG3, whiteSpace: 'nowrap' as const, transition: 'all 160ms ease' }}>{m.label}</button>); })}
            </div>
            <span style={{ fontFamily: F, fontSize: 12, color: C.FG3 }}>{MODES.find(m => m.id === mode)?.sub}</span>
          </div>
          <div style={{ paddingBottom: 28 }}>{mode === 'individual' ? <IndividualReport /> : <TeamReport />}</div>
          {/* soft wave footer — reference accent */}
          <div style={{ position: 'relative', height: 64, marginTop: 8, borderRadius: 16, overflow: 'hidden' }}>
            <svg width="100%" height="64" viewBox="0 0 1200 64" preserveAspectRatio="none" style={{ display: 'block' }}>
              <defs>
                <linearGradient id="frWave" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor={C.WAVE1} /><stop offset="1" stopColor={C.WAVE2} />
                </linearGradient>
              </defs>
              <path d="M0 28 C 150 8 300 48 450 28 S 750 8 900 28 1200 28 1200 28 L1200 64 L0 64 Z" fill="url(#frWave)" opacity="0.85" />
              <path d="M0 38 C 150 22 300 54 450 38 S 750 22 900 38 1200 38 1200 38 L1200 64 L0 64 Z" fill={C.WAVE1} opacity="0.55" />
            </svg>
          </div>
        </div>
      </GridBackground>
    </PageTransition>
  );
}

