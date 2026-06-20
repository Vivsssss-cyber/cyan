import React, { useState } from 'react';
import { useAppNavigate } from '../../lib/use-app-navigate';
import { GridBackground } from './GridBackground';
import { GameHeader } from './GameHeader';
import { GameButton } from './GameButton';
import { PageTransition } from './PageTransition';
import { Download, ArrowRight } from 'lucide-react';

// ─── Theme tokens ─────────────────────────────────────────────────────────────
const F = "'Outfit', system-ui, sans-serif";
const C = {
  TEAL:    '#002C33',
  CYAN:    '#00C1EB',
  EMERALD: '#156162',
  ROSE:    '#c65252',
  AMBER:   '#B45309',
  VIOLET:  '#7C3AED',
  BORDER:  '#C8DDE6',
  MUTED:   '#F0F6FA',
  FG1:     '#202326',
  FG2:     '#202326',
  FG3:     '#606569',
  FG4:     '#94A3B8',
  TEAL8:   '#002C33',
  TEAL7:   '#006E85',
  CYAN100: '#E0F7FF',
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const DATA = {
  meta: { team: 'Dhaulagiri Cafe', role: 'Restaurant Owner', round: 'Month 12 of 12', founder: 'Sarah Johnson' },
  revenue: [280,310,340,360,390,420,460,495,530,560,598,644].map(v => v * 1000),
  margin:  [-12,-10,-8,-5,-3,-1,2,4,6,7,8,10],
  alerts: [
    { type: 'phantom', title: 'Phantom stock · Croissants',    detail: '840 units show in POS but not in fridge count',            impact: '-$2,940', round: 'M12' },
    { type: 'expiry',  title: 'Expiry wave · Oat-milk 2L',     detail: '112 cartons expire within 4 days at current sell-through', impact: '-$1,120', round: 'M12' },
    { type: 'phantom', title: 'Phantom stock · Espresso beans', detail: 'Re-order triggered on ghost inventory last round',         impact: '-$1,840', round: 'M11' },
    { type: 'warn',    title: 'Square-footage capacity 92%',    detail: 'Close to overflow — next delivery will land in aisle',     impact: 'watch',   round: 'M12' },
    { type: 'expiry',  title: 'Expiry risk · Fresh pastries',   detail: '3-day shelf life; forecast misses by 18% weekends',       impact: '-$680',   round: 'M12' },
  ],
  assets: [
    { name: 'Espresso machines ×2',    tag: 'La Marzocco Linea',     value: 38000,   depreciation: 520,  interest: 0    },
    { name: 'Commercial refrigeration',tag: 'Walk-in + 4 display',   value: 28600,   depreciation: 380,  interest: 0    },
    { name: 'Store build-out',         tag: 'Fit-out capitalised',   value: 112000,  depreciation: 1400, interest: 2240 },
    { name: 'POS + kitchen systems',   tag: 'Toast + KDS',           value: 14200,   depreciation: 180,  interest: 0    },
    { name: 'Delivery van',            tag: 'Ford Transit (leased)', value: 24000,   depreciation: 440,  interest: 620  },
    { name: 'Working capital loan',    tag: "SBA 7(a) · $80k",       value: -62000,  depreciation: 0,    interest: 1380 },
  ],
  monthlyReports: [
    { label: 'M12 · March 2026',    tag: 'current · live', net: 28000,  lines: [
      { k: 'Revenue', v: '$644,000' }, { k: 'COGS', v: '-$312,000' },
      { k: 'Labor',   v: '-$186,000' }, { k: 'Rent', v: '-$62,000' },
      { k: 'Marketing', v: '-$32,000' }, { k: 'Operations', v: '-$24,000' },
    ]},
    { label: 'M11 · February 2026', tag: 'closed', net: 14200, lines: [
      { k: 'Revenue', v: '$598,000' }, { k: 'COGS', v: '-$298,000' },
      { k: 'Labor',   v: '-$182,000' }, { k: 'Rent', v: '-$62,000' },
      { k: 'Marketing', v: '-$28,000' }, { k: 'Operations', v: '-$13,800' },
    ]},
    { label: 'M10 · January 2026',  tag: 'closed', net: -4200, lines: [
      { k: 'Revenue', v: '$560,000' }, { k: 'COGS', v: '-$286,000' },
      { k: 'Labor',   v: '-$178,000' }, { k: 'Rent', v: '-$62,000' },
      { k: 'Marketing', v: '-$26,000' }, { k: 'Operations', v: '-$12,200' },
    ]},
    { label: 'M09 · December 2025', tag: 'closed', net: -11400, lines: [
      { k: 'Revenue', v: '$530,000' }, { k: 'COGS', v: '-$281,000' },
      { k: 'Labor',   v: '-$174,000' }, { k: 'Rent', v: '-$62,000' },
      { k: 'Marketing', v: '-$24,000' }, { k: 'Operations', v: '-$0' },
    ]},
  ],
  products: [
    { name: 'Espresso blend',   icon: '☕', color: '#7C4A2B', tag: 'Hot · signature',  price: 4.25, sold: 3420, margin: 68, phantom: 0,   trend: [1800,2100,2380,2600,2900,3420] },
    { name: 'Almond croissant', icon: '◍', color: '#B5651D', tag: 'Bakery · fresh',   price: 3.75, sold: 1840, margin: 42, phantom: 120, trend: [900,1120,1240,1480,1720,1840]  },
    { name: 'Oat-milk latte',   icon: '◉', color: '#C3A37A', tag: 'Hot · dairy-free', price: 5.50, sold: 1560, margin: 55, phantom: 32,  trend: [400,620,820,1080,1320,1560]   },
    { name: 'Seasonal salad',   icon: '❀', color: '#4B8C3B', tag: 'Cold · lunch',     price: 9.80, sold: 840,  margin: 38, phantom: 0,   trend: [600,720,780,810,830,840]       },
    { name: 'Cold-brew 500ml',  icon: '◈', color: '#2B3A3A', tag: 'Cold · bottled',   price: 6.25, sold: 620,  margin: 48, phantom: 0,   trend: [120,240,340,480,560,620]       },
    { name: 'Matcha cake slice',icon: '◐', color: '#7A9F3D', tag: 'Bakery · premium', price: 7.25, sold: 340,  margin: 22, phantom: 48,  trend: [410,380,360,355,348,340]       },
  ],
  suppliers: [
    { name: 'Highland Coffee Co.', distance: 42,  lead: 2, reliability: 96, distCost: 680  },
    { name: 'Valley Dairy Farm',   distance: 18,  lead: 1, reliability: 92, distCost: 320  },
    { name: 'Brooklyn Bakehouse',  distance: 6,   lead: 1, reliability: 88, distCost: 180  },
    { name: 'Sunrise Produce',     distance: 28,  lead: 2, reliability: 72, distCost: 420  },
    { name: 'Pacific Oat Co.',     distance: 112, lead: 4, reliability: 68, distCost: 1240 },
  ],
  segments: [
    { name: 'Value buyers',    size: 1120, retention: 58, delta: -8, color: C.AMBER,   trend: [72,70,68,66,64,62,60,61,60,59,58,58] },
    { name: 'Balanced buyers', size: 980,  retention: 74, delta: 4,  color: C.CYAN,    trend: [60,62,64,66,68,69,70,71,72,73,74,74] },
    { name: 'Premium buyers',  size: 448,  retention: 86, delta: 2,  color: C.TEAL,    trend: [80,82,82,83,84,84,85,86,86,85,85,86] },
  ],
  exhibits: [
    { name: 'Age distribution',    insight: '62% of buyers are 25-38. Weekday afternoons skew older.',           icon: '◑', unlocked: true,  pen: 'millennials dominate', unlockRound: 0  },
    { name: 'Location heatmap',    insight: '3-block catchment holds 74% of footfall; subway drives peaks.',     icon: '◎', unlocked: true,  pen: 'near the L train',     unlockRound: 0  },
    { name: 'Preference matrix',   insight: 'Oat-milk converts 2.1× better in premium segment.',                 icon: '◈', unlocked: true,  pen: 'oat sells ↑',          unlockRound: 0  },
    { name: 'Visit frequency',     insight: 'Premium tier visits 3.4×/week; Value tier 1.1×.',                   icon: '◬', unlocked: true,  pen: '',                     unlockRound: 0  },
    { name: 'Basket composition',  insight: 'Morning: coffee + pastry 68%. Lunch: salad + drink 41%.',           icon: '▣', unlocked: true,  pen: '',                     unlockRound: 0  },
    { name: 'Word-of-mouth score', insight: 'NPS 42 · driven by baristas, hurt by seating.',                     icon: '◌', unlocked: true,  pen: '',                     unlockRound: 0  },
    { name: 'Weather sensitivity', insight: 'Cold-brew sales +180% on days over 78°F.',                          icon: '◔', unlocked: true,  pen: '',                     unlockRound: 0  },
    { name: 'Competitor overlap',  insight: 'Blue Bottle shares 31% of Premium buyers.',                         icon: '◒', unlocked: true,  pen: 'watch bb',             unlockRound: 0  },
    { name: 'Brand affinity',      insight: 'Buyers 2.3× more likely to follow on Instagram.',                   icon: '◉', unlocked: true,  pen: '',                     unlockRound: 0  },
    { name: 'Loyalty cohort',      insight: '',                                                                   icon: '◍', unlocked: false, pen: '',                     unlockRound: 14 },
    { name: 'Referral graph',      insight: '',                                                                   icon: '◎', unlocked: false, pen: '',                     unlockRound: 16 },
    { name: 'Lifetime value',      insight: '',                                                                   icon: '◕', unlocked: false, pen: '',                     unlockRound: 18 },
  ],
  dilution: [
    { round: 'Pre-seed', investor: 'Founder self-fund',  date: 'M1',  raise: 80,  dilution: 0,  founderPct: 100 },
    { round: 'Seed',     investor: 'Crumb Ventures',     date: 'M4',  raise: 150, dilution: 18, founderPct: 82  },
    { round: 'Series A', investor: 'Baker + Grounds LP', date: 'M8',  raise: 320, dilution: 14, founderPct: 70  },
    { round: 'Bridge',   investor: 'Angel syndicate',    date: 'M11', raise: 90,  dilution: 8,  founderPct: 62  },
  ],
};

// ─── Tooltip hook ─────────────────────────────────────────────────────────────
function useTooltip(): [React.Dispatch<React.SetStateAction<any>>, React.ReactNode] {
  const [tip, setTip] = useState<any>(null);
  const node = tip && (
    <div style={{
      position: 'fixed', left: tip.x + 12, top: tip.y - 8, zIndex: 50,
      background: C.TEAL8, color: '#fff', padding: '8px 12px',
      borderRadius: 8, fontFamily: F, fontSize: 12,
      pointerEvents: 'none', boxShadow: 'var(--shadow-elev-3)', lineHeight: 1.45,
      whiteSpace: 'nowrap', maxWidth: 240,
    }}>
      {tip.label && <div style={{ fontFamily: F, fontWeight: 600, fontSize: 13 }}>{tip.label}</div>}
      {tip.rows && tip.rows.map((r: any, i: number) => (
        <div key={i} style={{ display: 'flex', gap: 10, justifyContent: 'space-between', opacity: 0.92 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {r.color && <span style={{ width: 8, height: 8, borderRadius: 99, background: r.color, display: 'inline-block' }} />}
            {r.k}
          </span>
          <span style={{ fontFamily: F, fontWeight: 600 }}>{r.v}</span>
        </div>
      ))}
      {tip.foot && <div style={{ marginTop: 4, fontSize: 10, opacity: 0.65, letterSpacing: '.04em', textTransform: 'uppercase' as const }}>{tip.foot}</div>}
    </div>
  );
  return [setTip, node];
}

// ─── SVG LineChart ────────────────────────────────────────────────────────────
function PRLineChart({ series, xLabels, width = 560, height = 240, yFormat = (v: number) => String(v), yTicks = 4 }: {
  series: { name: string; color: string; data: number[]; fill?: boolean }[];
  xLabels: string[];
  width?: number; height?: number;
  yFormat?: (v: number) => string;
  yTicks?: number;
}) {
  const [setTip, tipNode] = useTooltip();
  const [hover, setHover] = useState<number | null>(null);
  const pad = { t: 16, r: 16, b: 28, l: 52 };
  const W = width, H = height;
  const allVals = series.flatMap(s => s.data);
  const maxY = Math.max(...allVals) * 1.08;
  const minY = Math.min(0, Math.min(...allVals));
  const n = xLabels.length;
  const xAt = (i: number) => pad.l + (i / (n - 1)) * (W - pad.l - pad.r);
  const yAt = (v: number) => pad.t + (1 - (v - minY) / ((maxY - minY) || 1)) * (H - pad.t - pad.b);
  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => minY + (i / yTicks) * (maxY - minY));

  return (
    <div style={{ position: 'relative' }}>
      <svg width={W} height={H}
        onMouseMove={e => {
          const rect = (e.currentTarget as SVGElement).getBoundingClientRect();
          const px = e.clientX - rect.left;
          const fx = Math.max(0, Math.min(n - 1, Math.round((px - pad.l) / (W - pad.l - pad.r) * (n - 1))));
          setHover(fx);
          setTip({ x: e.clientX, y: e.clientY, label: xLabels[fx], rows: series.map(s => ({ k: s.name, v: yFormat(s.data[fx]), color: s.color })) });
        }}
        onMouseLeave={() => { setHover(null); setTip(null); }}
      >
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={pad.l} x2={W - pad.r} y1={yAt(t)} y2={yAt(t)} stroke={C.BORDER} strokeWidth="1" />
            <text x={pad.l - 8} y={yAt(t) + 4} textAnchor="end" fontSize="10" fill={C.FG4} fontFamily={F}>{yFormat(t)}</text>
          </g>
        ))}
        {xLabels.map((l, i) => (
          (i % Math.ceil(n / 12) === 0 || i === n - 1) &&
          <text key={i} x={xAt(i)} y={H - 8} textAnchor="middle" fontSize="10" fill={C.FG4} fontFamily={F}>{l}</text>
        ))}
        {series.map((s, si) => {
          const d = s.data.map((v, i) => `${i ? 'L' : 'M'}${xAt(i)},${yAt(v)}`).join(' ');
          const area = `${d} L${xAt(n-1)},${yAt(minY)} L${xAt(0)},${yAt(minY)} Z`;
          return (
            <g key={si}>
              {s.fill && <path d={area} fill={s.color} opacity="0.08" />}
              <path d={d} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          );
        })}
        {hover != null && (
          <g>
            <line x1={xAt(hover)} x2={xAt(hover)} y1={pad.t} y2={H - pad.b} stroke={C.TEAL} strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
            {series.map((s, si) => (
              <circle key={si} cx={xAt(hover!)} cy={yAt(s.data[hover!])} r="5" fill="#fff" stroke={s.color} strokeWidth="2.5" />
            ))}
          </g>
        )}
      </svg>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 4 }}>
        {series.map((s, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: F, fontSize: 12, color: C.FG3 }}>
            <span style={{ width: 10, height: 10, borderRadius: 99, background: s.color }} />{s.name}
          </span>
        ))}
      </div>
      {tipNode}
    </div>
  );
}

// ─── SVG BarChart ─────────────────────────────────────────────────────────────
function PRBarChart({ labels, series, width = 560, height = 240, yFormat = (v: number) => String(v) }: {
  labels: string[];
  series: { name: string; color: string; data: number[] }[];
  width?: number; height?: number;
  yFormat?: (v: number) => string;
}) {
  const [setTip, tipNode] = useTooltip();
  const pad = { t: 16, r: 16, b: 32, l: 52 };
  const W = width, H = height;
  const allVals = series.flatMap(s => s.data);
  const maxY = Math.max(...allVals) * 1.1;
  const n = labels.length;
  const groupW = (W - pad.l - pad.r) / n;
  const barW = groupW * 0.7 / series.length;
  const yAt = (v: number) => pad.t + (1 - v / maxY) * (H - pad.t - pad.b);

  return (
    <div style={{ position: 'relative' }}>
      <svg width={W} height={H}>
        {Array.from({ length: 5 }, (_, i) => {
          const v = (i / 4) * maxY;
          return (
            <g key={i}>
              <line x1={pad.l} x2={W - pad.r} y1={yAt(v)} y2={yAt(v)} stroke={C.BORDER} strokeWidth="1" />
              <text x={pad.l - 8} y={yAt(v) + 4} textAnchor="end" fontSize="10" fill={C.FG4} fontFamily={F}>{yFormat(v)}</text>
            </g>
          );
        })}
        {labels.map((l, i) => {
          const gx = pad.l + i * groupW + groupW * 0.15;
          return (
            <g key={i}>
              {series.map((s, si) => {
                const x = gx + si * barW;
                const y = yAt(s.data[i]);
                return (
                  <rect key={si} x={x} y={y} width={barW - 2} height={H - pad.b - y} fill={s.color} rx="3"
                    onMouseEnter={e => setTip({ x: e.clientX, y: e.clientY, label: l, rows: series.map(ss => ({ k: ss.name, v: yFormat(ss.data[i]), color: ss.color })) })}
                    onMouseLeave={() => setTip(null)}
                    style={{ cursor: 'pointer' }}
                  />
                );
              })}
              <text x={gx + groupW * 0.7 / 2} y={H - 10} textAnchor="middle" fontSize="10" fill={C.FG4} fontFamily={F}>{l}</text>
            </g>
          );
        })}
      </svg>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 4 }}>
        {series.map((s, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: F, fontSize: 12, color: C.FG3 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: s.color }} />{s.name}
          </span>
        ))}
      </div>
      {tipNode}
    </div>
  );
}

// ─── SVG WaterfallChart ───────────────────────────────────────────────────────
function PRWaterfall({ items, width = 560, height = 280, yFormat = (v: number) => `$${(v/1000).toFixed(1)}k` }: {
  items: { label: string; value: number; type: 'delta' | 'total'; hint?: string }[];
  width?: number; height?: number;
  yFormat?: (v: number) => string;
}) {
  const [setTip, tipNode] = useTooltip();
  const pad = { t: 32, r: 16, b: 48, l: 64 };
  const W = width, H = height;
  let running = 0;
  const bars = items.map(it => {
    if (it.type === 'total') {
      const b = { ...it, from: 0, to: it.value, color: it.value >= 0 ? C.TEAL : C.ROSE };
      running = it.value;
      return b;
    }
    const from = running;
    running += it.value;
    return { ...it, from, to: running, color: it.value >= 0 ? C.EMERALD : C.ROSE };
  });
  const maxVal = Math.max(...bars.map(b => Math.max(b.from, b.to)), 0);
  const minVal = Math.min(...bars.map(b => Math.min(b.from, b.to)), 0);
  const yAt = (v: number) => pad.t + (1 - (v - minVal) / ((maxVal - minVal) || 1)) * (H - pad.t - pad.b);
  const barW = (W - pad.l - pad.r) / bars.length * 0.7;
  const gap  = (W - pad.l - pad.r) / bars.length * 0.3;

  return (
    <div style={{ position: 'relative', overflowX: 'auto' }}>
      <svg width={W} height={H}>
        <line x1={pad.l} x2={W - pad.r} y1={yAt(0)} y2={yAt(0)} stroke={C.BORDER} strokeWidth="1.5" />
        {bars.map((b, i) => {
          const x = pad.l + i * (barW + gap) + gap / 2;
          const y = yAt(Math.max(b.from, b.to));
          const h = Math.max(Math.abs(yAt(b.from) - yAt(b.to)), 2);
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={h} fill={b.color} rx="4"
                onMouseEnter={e => setTip({ x: e.clientX, y: e.clientY, label: b.label, rows: [{ k: b.type === 'total' ? 'Running total' : 'Impact', v: yFormat(b.value), color: b.color }], foot: b.hint })}
                onMouseLeave={() => setTip(null)}
                style={{ cursor: 'pointer' }}
              />
              {i < bars.length - 1 && bars[i + 1].type !== 'total' && (
                <line x1={x + barW} x2={x + barW + gap} y1={yAt(b.to)} y2={yAt(b.to)} stroke="#B2B2B2" strokeDasharray="2,3" />
              )}
              <text x={x + barW / 2} y={y - 6} textAnchor="middle" fontSize="11" fontFamily={F} fontWeight="700" fill={b.color}>{yFormat(b.value)}</text>
              <text x={x + barW / 2} y={H - 16} textAnchor="middle" fontSize="11" fill={C.FG2} fontFamily={F} fontWeight="500">{b.label}</text>
            </g>
          );
        })}
      </svg>
      {tipNode}
    </div>
  );
}

// ─── SVG DonutChart ───────────────────────────────────────────────────────────
function PRDonut({ data, width = 220, height = 220, centerLabel, centerSub }: {
  data: { label: string; value: number; color: string; valueLabel?: string }[];
  width?: number; height?: number;
  centerLabel?: string; centerSub?: string;
}) {
  const [setTip, tipNode] = useTooltip();
  const [hover, setHover] = useState<number | null>(null);
  const cx = width / 2, cy = height / 2;
  const R = Math.min(cx, cy) - 8, r = R - 26;
  const total = data.reduce((a, d) => a + d.value, 0);
  let a0 = -Math.PI / 2;
  const arcs = data.map((d, i) => {
    const a1 = a0 + (d.value / total) * Math.PI * 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const x0 = cx + Math.cos(a0) * R, y0 = cy + Math.sin(a0) * R;
    const x1 = cx + Math.cos(a1) * R, y1 = cy + Math.sin(a1) * R;
    const xi1 = cx + Math.cos(a1) * r, yi1 = cy + Math.sin(a1) * r;
    const xi0 = cx + Math.cos(a0) * r, yi0 = cy + Math.sin(a0) * r;
    const path = `M${x0},${y0} A${R},${R} 0 ${large} 1 ${x1},${y1} L${xi1},${yi1} A${r},${r} 0 ${large} 0 ${xi0},${yi0} Z`;
    const seg = { ...d, path, idx: i, pct: (d.value / total) * 100 };
    a0 = a1;
    return seg;
  });

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 20 }}>
      <svg width={width} height={height}>
        {arcs.map((a, i) => (
          <path key={i} d={a.path} fill={a.color}
            opacity={hover != null && hover !== i ? 0.35 : 1}
            style={{ transition: 'opacity 120ms', cursor: 'pointer' }}
            onMouseEnter={e => { setHover(i); setTip({ x: e.clientX, y: e.clientY, label: a.label, rows: [{ k: 'Value', v: a.valueLabel || a.value, color: a.color }, { k: 'Share', v: a.pct.toFixed(1) + '%' }] }); }}
            onMouseLeave={() => { setHover(null); setTip(null); }}
          />
        ))}
        {centerLabel && (
          <g>
            <text x={cx} y={cy - 2} textAnchor="middle" fontSize="22" fontFamily={F} fontWeight="700" fill={C.FG1}>{centerLabel}</text>
            {centerSub && <text x={cx} y={cy + 16} textAnchor="middle" fontSize="10" fill={C.FG3} fontFamily={F} letterSpacing="0.08em" style={{ textTransform: 'uppercase' as const }}>{centerSub}</text>}
          </g>
        )}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 140 }}>
        {arcs.map((a, i) => (
          <div key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, opacity: hover != null && hover !== i ? 0.5 : 1, transition: 'opacity 120ms' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: F, fontSize: 12, color: C.FG2 }}>
              <span style={{ width: 10, height: 10, borderRadius: 99, background: a.color }} />{a.label}
            </span>
            <span style={{ fontFamily: F, fontWeight: 600, fontSize: 12, color: C.FG1 }}>{a.pct.toFixed(0)}%</span>
          </div>
        ))}
      </div>
      {tipNode}
    </div>
  );
}

// ─── MiniSpark ────────────────────────────────────────────────────────────────
function MiniSpark({ points, color = C.CYAN, w = 80, h = 26 }: { points: number[]; color?: string; w?: number; h?: number }) {
  const max = Math.max(...points), min = Math.min(...points);
  const xs = points.map((_, i) => (i / (points.length - 1)) * (w - 2) + 1);
  const ys = points.map(p => h - 2 - ((p - min) / ((max - min) || 1)) * (h - 4));
  const d = xs.map((x, i) => `${i ? 'L' : 'M'}${x},${ys[i]}`).join(' ');
  return <svg width={w} height={h}><path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

// ─── ProgressBar ──────────────────────────────────────────────────────────────
function PRProgressBar({ value, max = 100, color, right, warningBelow }: {
  value: number; max?: number; color?: string; right?: string; warningBelow?: number;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const c = color || (warningBelow != null && value < warningBelow ? C.ROSE : C.CYAN);
  return (
    <div>
      {right && <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
        <span style={{ fontFamily: F, fontWeight: 600, fontSize: 13, color: c }}>{right}</span>
      </div>}
      <div style={{ height: 8, background: C.BORDER, borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: c, borderRadius: 99, transition: 'width 400ms ease' }} />
      </div>
    </div>
  );
}

// ─── Delta ────────────────────────────────────────────────────────────────────
function Delta({ value, unit = '%' }: { value: number; unit?: string }) {
  const pos = value >= 0;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: F, fontWeight: 600, fontSize: 12, color: pos ? C.EMERALD : C.ROSE }}>
      {pos ? '↑' : '↓'} {Math.abs(value)}{unit}
    </span>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function Card({ children, padding = 22, style = {} }: { children: React.ReactNode; padding?: number; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'var(--game-surface)', border: 'var(--game-card-border)',
      borderRadius: 16, padding, boxShadow: 'var(--shadow-elev-1)', ...style,
    }}>
      {children}
    </div>
  );
}

// ─── Eyebrow ──────────────────────────────────────────────────────────────────
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: F, fontWeight: 600, fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: C.FG3 }}>
      {children}
    </div>
  );
}

// ─── SectionTitle ─────────────────────────────────────────────────────────────
function SectionTitle({ eyebrow, title, sub, right }: { eyebrow?: string; title: string; sub?: string; right?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
      <div>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <div style={{ fontFamily: F, fontWeight: 600, fontSize: 16, color: C.FG1, marginTop: 2 }}>{title}</div>
        {sub && <div style={{ fontFamily: F, fontSize: 12, color: C.FG3, marginTop: 2 }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}

// ─── Pill ─────────────────────────────────────────────────────────────────────
function Pill({ children, tone = 'neutral', dot, size = 'md' }: {
  children: React.ReactNode;
  tone?: 'neutral' | 'cyan' | 'success' | 'error' | 'warning';
  dot?: string;
  size?: 'sm' | 'md';
}) {
  const sizes = { sm: { h: 26, fs: 11, px: 10 }, md: { h: 34, fs: 13, px: 14 } }[size];
  const tones: Record<string, { bg: string; fg: string; border: string }> = {
    neutral: { bg: '#fff',             fg: C.FG1,    border: `1px solid ${C.BORDER}` },
    cyan:    { bg: C.CYAN100,          fg: C.TEAL8,  border: 'none' },
    success: { bg: 'rgba(21,97,98,.1)',fg: C.EMERALD,border: 'none' },
    error:   { bg: 'rgba(198,82,82,.1)',fg:'#820606', border: 'none' },
    warning: { bg: 'rgba(180,83,9,.1)',fg: C.AMBER,  border: 'none' },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <div style={{ background: t.bg, color: t.fg, border: t.border, height: sizes.h, padding: `0 ${sizes.px}px`, borderRadius: 999, fontFamily: F, fontWeight: 500, fontSize: sizes.fs, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: 99, background: dot }} />}
      {children}
    </div>
  );
}

// ─── FounderRing ──────────────────────────────────────────────────────────────
function FounderRing({ pct, size = 180 }: { pct: number; size?: number }) {
  const cx = size / 2, cy = size / 2, R = size / 2 - 12;
  const circ = 2 * Math.PI * R;
  return (
    <svg width={size} height={size}>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={C.BORDER} strokeWidth="12" />
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={C.TEAL8} strokeWidth="12" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)}
        transform={`rotate(-90 ${cx} ${cy})`} />
      <text x={cx} y={cy - 4} textAnchor="middle" fontFamily={F} fontWeight="700" fontSize="36" fill={C.FG1}>{pct}%</text>
      <text x={cx} y={cy + 18} textAnchor="middle" fontFamily={F} fontSize="10" fill={C.FG3} letterSpacing="0.08em" style={{ textTransform: 'uppercase' as const }}>founder stake</text>
    </svg>
  );
}

// ─── TAB 1: Overview ──────────────────────────────────────────────────────────
function OverviewTab() {
  const months = ['M1','M2','M3','M4','M5','M6','M7','M8','M9','M10','M11','M12'];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
      {/* Revenue & Margin trend */}
      <Card>
        <SectionTitle
          eyebrow="15.1 × 15.3"
          title="Revenue & margin trend"
          sub="12-month view of top-line vs. profitability"
          right={
            <div style={{ display: 'flex', gap: 8 }}>
              <Pill size="sm" tone="cyan">Revenue +42%</Pill>
              <Pill size="sm" tone="success">Margin +6pts</Pill>
            </div>
          }
        />
        <PRLineChart
          width={1080} height={260}
          xLabels={months}
          series={[
            { name: 'Revenue', color: C.TEAL,   data: DATA.revenue, fill: true },
            { name: 'Margin %', color: C.CYAN,  data: DATA.margin.map(m => m * 1000) },
          ]}
          yFormat={v => `$${(v / 1000).toFixed(0)}k`}
        />
      </Card>

      {/* 3-col grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.1fr', gap: 16 }}>
        {/* Footfall */}
        <Card>
          <SectionTitle eyebrow="15.9" title="Footfall" sub="Customer visits this month" />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <div style={{ fontFamily: F, fontWeight: 700, fontSize: 36, color: C.FG1 }}>2,548</div>
            <Delta value={8} />
          </div>
          <div style={{ fontFamily: F, fontSize: 11, color: C.FG3, marginTop: 2, marginBottom: 14 }}>vs. last month · 318 below capacity</div>
          <PRLineChart
            width={320} height={130}
            xLabels={months}
            series={[{ name: 'Visitors', color: C.CYAN, data: [1620,1780,1840,2010,1960,2180,2240,2310,2180,2420,2480,2548], fill: true }]}
            yFormat={v => v >= 1000 ? `${(v/1000).toFixed(1)}k` : String(v)}
            yTicks={3}
          />
        </Card>

        {/* Marketing spend */}
        <Card>
          <SectionTitle eyebrow="15.8" title="Marketing spend" sub="Allocation vs. acquired customer" />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <div style={{ fontFamily: F, fontWeight: 700, fontSize: 36, color: C.FG1 }}>$3.2k</div>
            <Delta value={-4} />
          </div>
          <div style={{ fontFamily: F, fontSize: 11, color: C.FG3, marginTop: 2, marginBottom: 14 }}>CAC down to $8.20 per customer</div>
          <PRBarChart
            width={320} height={130}
            labels={['M8','M9','M10','M11','M12']}
            series={[{ name: 'Spend', color: C.TEAL, data: [2400,2800,3100,3400,3200] }]}
            yFormat={v => `$${(v/1000).toFixed(1)}k`}
          />
        </Card>

        {/* Strategic summary */}
        <Card>
          <SectionTitle
            eyebrow="17.11" title="Strategic summary"
            sub="AI narrative · compiled from round outputs"
            right={<Pill size="sm">Auto-generated</Pill>}
          />
          <p style={{ fontFamily: F, fontSize: 13, lineHeight: 1.55, color: C.FG2, margin: 0 }}>
            Dhaulagiri Cafe posted its strongest month since launch —{' '}
            <strong style={{ color: C.TEAL8 }}>$644k revenue (+12%)</strong> on a still-thin operating margin.
            Retention slipped 3pts as Value-segment buyers pushed to Balanced; watch this on the segment tab.
          </p>
          <div style={{ marginTop: 14, padding: 12, borderRadius: 10, background: 'rgba(180,83,9,0.08)', border: `1px solid rgba(180,83,9,0.2)` }}>
            <div style={{ fontFamily: F, fontWeight: 600, fontSize: 13, color: C.AMBER }}>▲ Next-month focus</div>
            <div style={{ fontFamily: F, fontSize: 12, color: C.AMBER, marginTop: 4, lineHeight: 1.45 }}>
              Trim phantom-stock exposure on croissants and re-price the espresso blend before supplier cost flows through.
            </div>
          </div>
        </Card>
      </div>

      {/* Critical notifications */}
      <Card>
        <SectionTitle
          eyebrow="15.6 × 15.7" title="Critical notifications"
          sub="Expiry and phantom-stock alerts · capital leakage flagged in rose"
          right={<Pill size="sm" tone="error">3 high</Pill>}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 260, overflowY: 'auto', paddingRight: 4 }}>
          {DATA.alerts.map((a, i) => {
            const tone = (a.type === 'expiry' || a.type === 'phantom')
              ? { bg: 'rgba(198,82,82,0.08)', fg: '#BE123C', icon: a.type === 'phantom' ? '◈' : '◷', glow: `0 0 0 1px rgba(198,82,82,0.25), 0 0 18px -2px rgba(198,82,82,0.35)` }
              : { bg: 'rgba(180,83,9,0.08)', fg: C.AMBER, icon: '!', glow: 'none' };
            return (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 1fr auto auto', gap: 16, alignItems: 'center', padding: '12px 16px', borderRadius: 10, background: tone.bg, boxShadow: tone.glow }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F, fontWeight: 700, color: tone.fg }}>{tone.icon}</div>
                <div>
                  <div style={{ fontFamily: F, fontWeight: 600, fontSize: 14, color: C.FG1 }}>{a.title}</div>
                  <div style={{ fontFamily: F, fontSize: 12, color: C.FG3, marginTop: 2 }}>{a.detail}</div>
                </div>
                <span style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: tone.fg }}>{a.impact}</span>
                <Pill size="sm" tone={(a.type === 'expiry' || a.type === 'phantom') ? 'error' : 'warning'}>{a.round}</Pill>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ─── TAB 2: Financials ────────────────────────────────────────────────────────
function FinancialsTab() {
  const [openRow, setOpenRow] = useState(0);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
      {/* Cash-flow waterfall */}
      <Card>
        <SectionTitle eyebrow="15.1 – 15.3" title="Cash-flow waterfall · March 2026" sub="How revenue becomes net profit this month" />
        <PRWaterfall width={1080} height={300}
          items={[
            { label: 'Revenue',    value:  644000, type: 'delta', hint: 'Top-line from 2,548 customers' },
            { label: 'COGS',       value: -312000, type: 'delta', hint: 'Ingredients + packaging' },
            { label: 'Labor',      value: -186000, type: 'delta', hint: '9 FTE @ blended $22/hr' },
            { label: 'Rent',       value:  -62000, type: 'delta', hint: '1,450 sqft @ $42/sqft' },
            { label: 'Marketing',  value:  -32000, type: 'delta' },
            { label: 'Operations', value: -104000, type: 'delta' },
            { label: 'Net profit', value:  -52000, type: 'total', hint: 'Below break-even this round' },
          ]}
        />
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16 }}>
        {/* Asset ledger */}
        <Card>
          <SectionTitle eyebrow="13.4 – 13.8" title="Asset ledger" sub="Assets, depreciation, and loan interest" />
          <div style={{ overflow: 'hidden', borderRadius: 10, border: `1px solid ${C.BORDER}` }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', background: C.MUTED, padding: '10px 16px', fontFamily: F, fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: C.FG3 }}>
              <div>Asset</div><div style={{ textAlign: 'right' }}>Book value</div><div style={{ textAlign: 'right' }}>Depreciation</div><div style={{ textAlign: 'right' }}>Loan interest</div>
            </div>
            {DATA.assets.map((a, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', padding: '12px 16px', borderTop: `1px solid ${C.MUTED}`, alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: F, fontWeight: 600, fontSize: 13, color: C.FG1 }}>{a.name}</div>
                  <div style={{ fontFamily: F, fontSize: 11, color: C.FG3, marginTop: 2 }}>{a.tag}</div>
                </div>
                <div style={{ textAlign: 'right', fontFamily: F, fontWeight: 600, fontSize: 13 }}>${a.value.toLocaleString()}</div>
                <div style={{ textAlign: 'right', fontFamily: F, fontSize: 12, color: C.FG3 }}>-${a.depreciation.toLocaleString()}</div>
                <div style={{ textAlign: 'right', fontFamily: F, fontSize: 12, color: a.interest ? C.ROSE : C.FG3 }}>{a.interest ? `-$${a.interest.toLocaleString()}` : '—'}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Monthly reporting accordion */}
        <Card>
          <SectionTitle eyebrow="15.11" title="Monthly reporting" sub="Expand any month for the full breakdown" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {DATA.monthlyReports.map((m, i) => {
              const open = openRow === i;
              return (
                <div key={i} style={{ border: `1px solid ${C.BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
                  <button onClick={() => setOpenRow(open ? -1 : i)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: open ? C.CYAN100 : '#fff', border: 'none', cursor: 'pointer' }}>
                    <span style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: C.TEAL8 }}>{m.label}</span>
                      <span style={{ fontFamily: F, fontSize: 11, color: C.FG3 }}>{m.tag}</span>
                    </span>
                    <span style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontFamily: F, fontWeight: 600, fontSize: 13, color: m.net >= 0 ? C.EMERALD : C.ROSE }}>{m.net >= 0 ? '+' : ''}${(m.net / 1000).toFixed(1)}k</span>
                      <span style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 200ms', color: C.FG3, fontSize: 10 }}>▾</span>
                    </span>
                  </button>
                  {open && (
                    <div style={{ padding: '12px 14px', background: C.MUTED, borderTop: `1px solid ${C.BORDER}`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                      {m.lines.map((l, li) => (
                        <div key={li} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: F, fontSize: 11, color: C.FG2 }}>
                          <span>{l.k}</span><span style={{ fontFamily: F, fontWeight: 600 }}>{l.v}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── TAB 3: Inventory ─────────────────────────────────────────────────────────
function InventoryTab() {
  const [sortBy, setSortBy] = useState<'sold' | 'margin'>('sold');
  const sorted = [...DATA.products].sort((a, b) => b[sortBy] - a[sortBy]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
      {/* Product ranking */}
      <Card>
        <SectionTitle
          eyebrow="15.4 × Margin%" title="Active 6 · product ranking" sub="Sorted by volume and margin"
          right={
            <div style={{ display: 'inline-flex', background: C.MUTED, borderRadius: 999, padding: 4 }}>
              {(['sold', 'margin'] as const).map(t => (
                <button key={t} onClick={() => setSortBy(t)} style={{ border: 'none', cursor: 'pointer', padding: '6px 16px', borderRadius: 999, background: sortBy === t ? '#fff' : 'transparent', boxShadow: sortBy === t ? 'var(--shadow-elev-1)' : 'none', fontFamily: F, fontWeight: sortBy === t ? 600 : 500, fontSize: 13, color: sortBy === t ? C.TEAL8 : C.FG3 }}>{t}</button>
              ))}
            </div>
          }
        />
        <div style={{ display: 'grid', gridTemplateColumns: '40px 1.4fr 1fr 1fr 1.2fr 1fr', background: C.MUTED, padding: '10px 16px', borderRadius: '8px 8px 0 0', fontFamily: F, fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: C.FG3 }}>
          <div>#</div><div>Product</div><div style={{ textAlign: 'right' }}>Sold (u)</div><div style={{ textAlign: 'right' }}>Margin %</div><div style={{ textAlign: 'right' }}>Trend</div><div style={{ textAlign: 'right' }}>Phantom</div>
        </div>
        {sorted.map((p, i) => (
          <div key={p.name} style={{ display: 'grid', gridTemplateColumns: '40px 1.4fr 1fr 1fr 1.2fr 1fr', padding: '14px 16px', borderTop: `1px solid ${C.MUTED}`, alignItems: 'center' }}>
            <div style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: i === 0 ? C.TEAL : C.FG3 }}>{i + 1}</div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: p.color + '22', color: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F, fontWeight: 700 }}>{p.icon}</div>
              <div>
                <div style={{ fontFamily: F, fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                <div style={{ fontFamily: F, fontSize: 11, color: C.FG3, marginTop: 2 }}>${p.price.toFixed(2)} · {p.tag}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right', fontFamily: F, fontWeight: 600, fontSize: 14 }}>{p.sold.toLocaleString()}</div>
            <div style={{ textAlign: 'right', fontFamily: F, fontWeight: 600, fontSize: 14, color: p.margin > 40 ? C.EMERALD : p.margin > 25 ? C.FG1 : C.ROSE }}>{p.margin}%</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}><MiniSpark points={p.trend} color={p.margin > 40 ? C.EMERALD : C.CYAN} w={120} h={30} /></div>
            <div style={{ textAlign: 'right' }}>
              {p.phantom > 0
                ? <Pill size="sm" tone="error">⚠ {p.phantom}u</Pill>
                : <span style={{ fontFamily: F, fontSize: 12, color: C.FG4 }}>—</span>}
            </div>
          </div>
        ))}
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 16 }}>
        {/* Stock disposition donut */}
        <Card>
          <SectionTitle eyebrow="Waste analytics" title="Stock disposition" sub="Sold vs. unsold vs. expired vs. damaged · this round" />
          <PRDonut
            width={200} height={200}
            centerLabel="14%" centerSub="waste rate"
            data={[
              { label: 'Sold',    value: 8620, color: C.TEAL,   valueLabel: '8,620 u' },
              { label: 'Unsold',  value: 640,  color: '#4DB5B6', valueLabel: '640 u'   },
              { label: 'Expired', value: 420,  color: C.ROSE,   valueLabel: '420 u'   },
              { label: 'Damaged', value: 180,  color: C.AMBER,  valueLabel: '180 u'   },
            ]}
          />
        </Card>

        {/* Supplier reliability */}
        <Card>
          <SectionTitle eyebrow="Supplier efficiency" title="Delivery reliability vs. distance cost" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {DATA.suppliers.map((s, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.2fr 120px 100px', gap: 16, alignItems: 'center', padding: '10px 0', borderBottom: i < DATA.suppliers.length - 1 ? `1px solid ${C.MUTED}` : 'none' }}>
                <div>
                  <div style={{ fontFamily: F, fontWeight: 600, fontSize: 13 }}>{s.name}</div>
                  <div style={{ fontFamily: F, fontSize: 11, color: C.FG3, marginTop: 2 }}>{s.distance} km · {s.lead}-day lead</div>
                </div>
                <PRProgressBar value={s.reliability} max={100} right={`${s.reliability}%`} warningBelow={80} />
                <div style={{ textAlign: 'right', fontFamily: F, fontWeight: 600, fontSize: 13, color: C.FG2 }}>${s.distCost}/mo</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── TAB 4: Customer & HR ─────────────────────────────────────────────────────
function CustomerHRTab() {
  const months = ['M1','M2','M3','M4','M5','M6','M7','M8','M9','M10','M11','M12'];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Segment retention */}
        <Card>
          <SectionTitle eyebrow="17.3" title="Segment retention" sub="12-round trend by buyer segment" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 4 }}>
            {DATA.segments.map((s, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '110px 80px 1fr 80px', gap: 14, alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: F, fontWeight: 600, fontSize: 13 }}>{s.name}</div>
                  <div style={{ fontFamily: F, fontSize: 11, color: C.FG3, marginTop: 2 }}>{s.size.toLocaleString()} buyers</div>
                </div>
                <div style={{ fontFamily: F, fontWeight: 700, fontSize: 22, color: s.color }}>{s.retention}%</div>
                <MiniSpark points={s.trend} color={s.color} w={260} h={36} />
                <div style={{ textAlign: 'right' }}><Delta value={s.delta} /></div>
              </div>
            ))}
          </div>
        </Card>

        {/* HR stability */}
        <Card>
          <SectionTitle eyebrow="17.7 × 17.8" title="HR stability" sub="Satisfaction vs. turnover trend" />
          <PRLineChart
            width={520} height={260}
            xLabels={months}
            series={[
              { name: 'Satisfaction', color: C.CYAN, data: [68,70,72,71,70,74,76,78,77,76,74,74], fill: true },
              { name: 'Turnover',     color: C.ROSE, data: [12,14,13,15,18,20,22,19,16,14,13,14] },
            ]}
            yFormat={v => `${v}%`}
          />
        </Card>
      </div>

      {/* Research vault */}
      <Card>
        <SectionTitle
          eyebrow="Research vault" title="Unlocked exhibits"
          sub="Customer research exhibits accumulated across rounds"
          right={<Pill size="sm" tone="cyan">9 / 12 unlocked</Pill>}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {DATA.exhibits.map((e, i) => (
            <div key={i} style={{ border: `1px solid ${e.unlocked ? C.BORDER : C.MUTED}`, borderRadius: 12, padding: 16, background: e.unlocked ? 'rgba(255,255,255,0.6)' : C.MUTED, opacity: e.unlocked ? 1 : 0.55, position: 'relative' as const }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: e.unlocked ? C.CYAN100 : C.MUTED, color: e.unlocked ? C.TEAL8 : C.FG4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F, fontWeight: 700 }}>{e.icon}</div>
                {!e.unlocked && <Pill size="sm">🔒 M{e.unlockRound}</Pill>}
              </div>
              <div style={{ fontFamily: F, fontWeight: 600, fontSize: 14, marginTop: 12 }}>{e.name}</div>
              <div style={{ fontFamily: F, fontSize: 11, color: C.FG3, marginTop: 4, lineHeight: 1.45, minHeight: 32 }}>{e.insight}</div>
              {e.unlocked && e.pen && <div style={{ marginTop: 10, fontFamily: F, fontSize: 14, color: C.TEAL7 }}>{e.pen}</div>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── TAB 5: Valuation ─────────────────────────────────────────────────────────
function ValuationTab() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
      {/* DCF waterfall */}
      <Card>
        <SectionTitle eyebrow="19.4 – 19.8" title="Valuation bridge" sub="DCF build-up · how performance drives enterprise value" />
        <PRWaterfall width={1080} height={280} yFormat={v => `$${(v/1000).toFixed(0)}k`}
          items={[
            { label: 'Revenue TTM',      value:  644000, type: 'delta' },
            { label: 'Op. cash flow',    value: -112000, type: 'delta', hint: 'Revenue less opex & COGS' },
            { label: 'Growth premium',   value:  320000, type: 'delta', hint: 'DCF forward-years contribution' },
            { label: 'Risk discount',    value: -180000, type: 'delta', hint: 'Cafe sector WACC 14.5%' },
            { label: 'Terminal value',   value:  213000, type: 'delta' },
            { label: 'Enterprise value', value:  885000, type: 'total' },
          ]}
        />
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.4fr', gap: 16 }}>
        {/* Owner equity */}
        <Card>
          <SectionTitle eyebrow="19.6" title="Owner's equity" sub="Founder ownership and current value" />
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginTop: 8 }}>
            <FounderRing pct={62} size={180} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
              <div>
                <Eyebrow>Founder value</Eyebrow>
                <div style={{ fontFamily: F, fontWeight: 700, fontSize: 32, color: C.TEAL8, marginTop: 2 }}>$548,700</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <Delta value={14.2} /><span style={{ fontFamily: F, fontSize: 12, color: C.FG3 }}>vs. last round</span>
                </div>
              </div>
              <div>
                <Eyebrow>Stake remaining</Eyebrow>
                <div style={{ fontFamily: F, fontWeight: 700, fontSize: 32, marginTop: 2 }}>62%</div>
                <div style={{ fontFamily: F, fontSize: 12, color: C.FG3, marginTop: 2 }}>down from 100% at founding</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Dilution table */}
        <Card>
          <SectionTitle eyebrow="Dilution history" title="Funding rounds & share swaps" />
          <div style={{ overflow: 'hidden', borderRadius: 10, border: `1px solid ${C.BORDER}` }}>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 100px 100px 90px', background: C.MUTED, padding: '10px 14px', fontFamily: F, fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: C.FG3 }}>
              <div>Round</div><div>Investor</div><div style={{ textAlign: 'right' }}>Raise</div><div style={{ textAlign: 'right' }}>Dilution</div><div style={{ textAlign: 'right' }}>Post-%</div>
            </div>
            {DATA.dilution.map((r, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 100px 100px 90px', padding: '12px 14px', borderTop: `1px solid ${C.MUTED}`, alignItems: 'center' }}>
                <div style={{ fontFamily: F, fontWeight: 700, color: C.TEAL8, fontSize: 13 }}>{r.round}</div>
                <div>
                  <div style={{ fontFamily: F, fontWeight: 600, fontSize: 13 }}>{r.investor}</div>
                  <div style={{ fontFamily: F, fontSize: 11, color: C.FG3 }}>{r.date}</div>
                </div>
                <div style={{ textAlign: 'right', fontFamily: F, fontWeight: 600, fontSize: 13 }}>${r.raise}k</div>
                <div style={{ textAlign: 'right', fontFamily: F, fontSize: 12, color: C.ROSE }}>-{r.dilution}%</div>
                <div style={{ textAlign: 'right', fontFamily: F, fontWeight: 700, fontSize: 13 }}>{r.founderPct}%</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview',   label: 'Overview',      icon: '◉', sub: 'at-a-glance founder view' },
  { id: 'financials', label: 'Financials',    icon: '◈', sub: 'deep-dive accounting' },
  { id: 'inventory',  label: 'Inventory',     icon: '▣', sub: 'product performance' },
  { id: 'customer',   label: 'Customer & HR', icon: '◎', sub: 'sentiment & growth' },
  { id: 'valuation',  label: 'Valuation',     icon: '◬', sub: 'DCF scoreboard' },
] as const;
type TabId = typeof TABS[number]['id'];

export function PerformanceReport() {
  const navigate = useAppNavigate();
  const [tab, setTab] = useState<TabId>('overview');

  return (
    <PageTransition>
      <GridBackground className="flex flex-col">
        <GameHeader />
        <div className="max-w-[1288px] mx-auto px-6 pb-24 pt-6 w-full">

          {/* Page header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <Eyebrow>{DATA.meta.team} · {DATA.meta.round}</Eyebrow>
              <h1 style={{ fontFamily: F, fontWeight: 800, fontSize: 44, marginTop: 4, letterSpacing: '-.02em', color: C.FG1, lineHeight: 1.1 }}>Performance Report</h1>
              <p style={{ fontFamily: F, color: C.FG3, fontSize: 14, margin: '6px 0 0', fontWeight: 400 }}>
                March 2026 · founder view · compiled {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
              <button style={{ height: 44, padding: '0 22px', borderRadius: 9999, background: '#fff', color: C.FG1, border: `1px solid ${C.BORDER}`, fontFamily: F, fontWeight: 600, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <Download size={14} />
                Export PDF
              </button>
              <GameButton onClick={() => navigate('/game/cockpit')}>
                Month 13 decisions
              </GameButton>
            </div>
          </div>

          {/* Tab selector */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'inline-flex', background: C.MUTED, borderRadius: 999, padding: 4 }}>
              {TABS.map(t => {
                const active = tab === t.id;
                return (
                  <button key={t.id} onClick={() => setTab(t.id)} style={{
                    border: 'none', cursor: 'pointer', padding: '10px 18px', borderRadius: 999,
                    background: active ? '#fff' : 'transparent',
                    boxShadow: active ? 'var(--shadow-elev-1)' : 'none',
                    fontFamily: F, fontWeight: active ? 600 : 500, fontSize: 13,
                    color: active ? C.TEAL8 : C.FG3,
                    whiteSpace: 'nowrap' as const, display: 'inline-flex', alignItems: 'center', gap: 8,
                    transition: 'all 160ms ease',
                  }}>
                    <span style={{ color: active ? C.CYAN : C.FG4, fontSize: 14 }}>{t.icon}</span>
                    {t.label}
                  </button>
                );
              })}
            </div>
            <span style={{ fontFamily: F, fontSize: 12, color: C.FG3 }}>
              {TABS.find(t => t.id === tab)?.sub}
            </span>
          </div>

          {/* Tab body */}
          <div style={{ paddingBottom: 60 }}>
            {tab === 'overview'   && <OverviewTab />}
            {tab === 'financials' && <FinancialsTab />}
            {tab === 'inventory'  && <InventoryTab />}
            {tab === 'customer'   && <CustomerHRTab />}
            {tab === 'valuation'  && <ValuationTab />}
          </div>
        </div>
      </GridBackground>
    </PageTransition>
  );
}
