'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { GridBackground } from './GridBackground';
import { GameHeader } from './GameHeader';
import { PageTransition } from './PageTransition';
import { TabBar } from './TabBar';
import { GameButton } from './GameButton';
import { MonthReviewContent, type MonthReviewData } from './MonthReview';
import {
  Bread, Tea, Cake, Milk, Egg, Hamburger, Coffee, Box, AlertTriangle, Package,
  DollarSign, Users, Scale, Diamond, Megaphone, Eye, Flask, ShoppingBag, Heart, Wallet,
  Salad, Sparkle, Activity, TrendingUp, PieChart, Target, Receipt, CoffeeBeans, Cupcake,
  Landmark, Lock, Unlock, Check,
} from './PixelIcons';
import type { MonthlyDecisionsInput, ProductDef, SupplierTier, BankingAction } from '../lib/demo/demo-types';

const F = "'Outfit', sans-serif";

/* Optional controlled mode (demo flow). Without this prop the screen renders
 * its static /ref mock exactly as before. */
export interface MonthlyDecisionsDemo {
  value: MonthlyDecisionsInput;
  onChange: (patch: Partial<MonthlyDecisionsInput>) => void;
  catalog: ProductDef[];
  cash: number;
  month: number;
  /** Report-tab data: prior month's results, or the opening position on month 1. */
  reportData?: MonthReviewData;
  /** Ids of decision tabs locked this month. Send Decisions unlocks when all are locked. */
  lockedTabs: string[];
  onTabLockChange: (tab: string, locked: boolean) => void;
}

/* Icon mapping for sim catalog products (PixelIcons have no 1:1 set). */
const PRODUCT_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  bread: Bread, tea: Tea, butter: Cake, cheese: Milk, eggs: Egg, burger: Hamburger,
  croissant: Cupcake, juice: CoffeeBeans, salad: Salad, wrap: Coffee,
};

/* ───────────────────────── shared chart primitives (per /cyan-graphs) ───────────────────────── */
const PAT_CYAN = 'var(--color-chart-1)';
const CYAN_RAMP = [PAT_CYAN, 'var(--cyan-deep)', 'var(--color-chart-2)', 'var(--color-chart-6)', 'var(--color-muted-foreground)'];
const rampFill = (i: number) => CYAN_RAMP[i % CYAN_RAMP.length];

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

// Vertical fade gradient defs for ramp bars.
function rampBarCss(i: number) {
  const c = CYAN_RAMP[i % CYAN_RAMP.length];
  return `linear-gradient(180deg, ${c} 0%, color-mix(in srgb, ${c} 50%, transparent) 100%)`;
}

function LegendTick({ color }: { color: string }) {
  return <span style={{ width: 4, height: 16, borderRadius: 3, background: color, flexShrink: 0 }} />;
}

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

export const MD_CSS = `
.md-lift{transition:transform .2s cubic-bezier(.22,1,.36,1), box-shadow .2s ease;}
.md-lift:hover{transform:translateY(-3px);box-shadow:0 16px 36px rgba(0,44,51,0.13);}
.md-seg{transition:filter .16s ease, opacity .2s ease;cursor:pointer;}
.md-seg:hover{filter:drop-shadow(0 0 4px color-mix(in srgb, var(--game-cyan) 55%, transparent));}
.md-card-btn{transition:border-color .15s ease, box-shadow .15s ease, background .15s ease, transform .1s ease;}
.md-card-btn:not([data-on="true"]):hover{border-color:color-mix(in srgb, var(--game-cyan) 45%, var(--sv-border));background:color-mix(in srgb, var(--game-cyan) 5%, #fff);}
.md-card-btn:active{transform:translateY(1px);}
.md-root button:focus-visible{outline:2px solid var(--game-cyan);outline-offset:2px;border-radius:12px;}
@media (prefers-reduced-motion: reduce){
  .md-lift,.md-card-btn,.md-seg{transition:none !important;}
  .md-lift:hover{transform:none;}
}
`;

/* ───────────────────────── shared UI primitives ───────────────────────── */
const CARD: React.CSSProperties = {
  background: 'var(--game-surface)', border: 'var(--game-card-border)', borderRadius: 16, boxShadow: 'var(--shadow-elev-1)',
};
const SUBCARD: React.CSSProperties = {
  background: 'var(--game-surface-solid)', border: '1px solid var(--sv-border)', borderRadius: 12,
};

type IconCmp = React.ComponentType<{ size?: number; color?: string }>;

function Title({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 20, letterSpacing: '-0.4px', color: 'var(--game-text)' }}>{children}</h2>;
}
function Sub({ children }: { children: React.ReactNode }) {
  return <p style={{ fontFamily: F, fontWeight: 400, fontSize: 13, color: 'var(--game-text-secondary)', maxWidth: 520 }}>{children}</p>;
}
function CardTitle({ Icon, children }: { Icon?: IconCmp; children: React.ReactNode }) {
  return (
    <h3 style={{ fontFamily: F, fontWeight: 700, fontSize: 15, color: 'var(--game-text)', display: 'flex', alignItems: 'center', gap: 7 }}>
      {Icon && <Icon size={15} color="var(--game-teal-mid)" />}{children}
    </h3>
  );
}

function KPI({ label, value, sub, subColor }: { label: string; value: React.ReactNode; sub?: React.ReactNode; subColor?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontFamily: F, fontWeight: 500, fontSize: 11.5, color: 'var(--game-text-secondary)' }}>{label}</span>
      <span style={{ fontFamily: F, fontWeight: 800, fontSize: 22, color: 'var(--game-text)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.5px' }}>{value}</span>
      {sub != null && <span style={{ fontFamily: F, fontWeight: 600, fontSize: 11, color: subColor ?? 'var(--game-text-muted)' }}>{sub}</span>}
    </div>
  );
}

function MiniStat({ Icon, label, value, sub, valueColor }: { Icon: IconCmp; label: string; value: React.ReactNode; sub?: string; valueColor?: string }) {
  return (
    <div style={{ ...SUBCARD, padding: 14, display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, minHeight: 30 }}>
        <Icon size={15} color="var(--game-teal-mid)" />
        <span style={{ fontFamily: F, fontWeight: 500, fontSize: 11, color: 'var(--game-text-secondary)', lineHeight: 1.25 }}>{label}</span>
      </div>
      <div style={{ marginTop: 'auto', fontFamily: F, fontWeight: 700, fontSize: 16, color: valueColor ?? 'var(--game-text)', fontVariantNumeric: 'tabular-nums' }}>
        {value}{sub && <span style={{ fontWeight: 500, fontSize: 11, color: 'var(--game-text-secondary)', marginLeft: 4 }}>{sub}</span>}
      </div>
    </div>
  );
}

function HeaderPill({ Icon, children }: { Icon: IconCmp; children: React.ReactNode }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--cyan-tint)', color: 'var(--game-teal-mid)', borderRadius: 999, padding: '6px 12px', fontFamily: F, fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap' }}>
      <Icon size={13} color="var(--game-teal-mid)" />{children}
    </span>
  );
}

function MiniPill({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'var(--cyan-tint)', color: 'var(--game-teal-mid)', borderRadius: 999, padding: '3px 10px', fontFamily: F, fontWeight: 600, fontSize: 11, whiteSpace: 'nowrap' }}>
      {children}
    </span>
  );
}

function RoundStep({ dir, onClick }: { dir: 'inc' | 'dec'; onClick: () => void }) {
  return (
    <button onClick={onClick} aria-label={dir === 'inc' ? 'increase' : 'decrease'} style={{
      width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--sv-border)', background: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
      fontFamily: F, fontSize: 17, fontWeight: 600, color: 'var(--game-text-secondary)', lineHeight: 1, paddingBottom: 2,
    }}>{dir === 'inc' ? '+' : '−'}</button>
  );
}

function Stepper({ value, suffix, onChange, fullWidth }: { value: number; suffix?: string; onChange: (v: number) => void; fullWidth?: boolean }) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  const commit = () => {
    const n = parseFloat(draft);
    if (!isNaN(n) && n >= 0) onChange(n);
    setEditing(false);
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, ...(fullWidth ? { width: '100%' } : {}) }}>
      <RoundStep dir="dec" onClick={() => onChange(Math.max(0, value - 1))} />
      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false); }}
          style={{ flex: fullWidth ? 1 : undefined, minWidth: 78, height: 34, borderRadius: 999, border: '1.4px solid var(--game-cyan)', background: '#fff', textAlign: 'center', fontFamily: F, fontWeight: 700, fontSize: 14, color: 'var(--game-text)', fontVariantNumeric: 'tabular-nums', outline: 'none', paddingInline: 10 }}
        />
      ) : (
        <div
          onClick={() => { setDraft(String(value)); setEditing(true); }}
          style={{ flex: fullWidth ? 1 : undefined, minWidth: 78, height: 34, borderRadius: 999, border: '1px solid var(--sv-border)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F, fontWeight: 700, fontSize: 14, color: 'var(--game-text)', fontVariantNumeric: 'tabular-nums', cursor: 'text' }}>
          {value}{suffix && <span style={{ fontWeight: 500, color: 'var(--game-text-secondary)', marginLeft: 3 }}>{suffix}</span>}
        </div>
      )}
      <RoundStep dir="inc" onClick={() => onChange(value + 1)} />
    </div>
  );
}

function Chevron({ up }: { up?: boolean }) {
  return (
    <svg width="11" height="7" viewBox="0 0 11 7" fill="none" style={{ transform: up ? 'none' : 'rotate(180deg)' }}>
      <path d="M1 6L5.5 1.5L10 6" stroke="var(--game-text-secondary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SpinInput({ value, onChange, step = 1000 }: { value: number; onChange: (v: number) => void; step?: number }) {
  return (
    <div style={{ display: 'flex', border: '1px solid var(--sv-border)', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
      <div style={{ flex: 1, padding: '11px 16px', fontFamily: F, fontWeight: 700, fontSize: 15, color: 'var(--game-text)', fontVariantNumeric: 'tabular-nums', textAlign: 'center' }}>
        $ {value.toLocaleString('en-US')}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--sv-border)' }}>
        <button onClick={() => onChange(value + step)} style={{ flex: 1, padding: '0 11px', borderBottom: '1px solid var(--sv-border)', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }} aria-label="increase"><Chevron up /></button>
        <button onClick={() => onChange(Math.max(0, value - step))} style={{ flex: 1, padding: '0 11px', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }} aria-label="decrease"><Chevron /></button>
      </div>
    </div>
  );
}

/* ════════════════════════════════ SUPPLY ════════════════════════════════ */

const PRODUCTS = [
  { id: 'bread', name: 'Bread', cost: 'Unit cost: $ 0.40 /kg', Icon: Bread },
  { id: 'tea', name: 'Tea', cost: 'Unit cost: $ 0.40 /kg', Icon: Tea },
  { id: 'butter', name: 'Butter', cost: 'Unit cost: $ 0.80 /kg', Icon: Cake },
  { id: 'cheese', name: 'Cheese', cost: 'Unit cost: $ 1.20 /kg', Icon: Milk },
  { id: 'eggs', name: 'Eggs', cost: 'Unit cost: $ 0.10 /egg', Icon: Egg },
  { id: 'burger', name: 'Burger', cost: 'Unit cost: $ 2.00 /pc', Icon: Hamburger },
];

const MIX = [
  { label: 'Bread', pct: 5 }, { label: 'Butter', pct: 8 }, { label: 'Cheese', pct: 12 },
  { label: 'Eggs', pct: 15 }, { label: 'Tea', pct: 30 }, { label: 'Burger', pct: 8 },
  { label: 'Free', pct: 44, free: true },
];

const TIERS = [
  { id: 't1', name: 'Tier 1', who: 'Local Roaster', tag: 'Best Quality', disc: '0%', freight: '+$24', quality: '+10%', storage: '2%', risk: 'Low', riskColor: 'var(--game-positive)' },
  { id: 't2', name: 'Tier 2', who: 'Regional Wholesaler', tag: 'Recommended', disc: '5%', freight: '+$18', quality: '+5%', storage: '4%', risk: 'Medium', riskColor: 'var(--game-warning)' },
  { id: 't3', name: 'Tier 3', who: 'National Importer', tag: 'Lowest Cost', disc: '10%', freight: '+$15', quality: '0%', storage: '6%', risk: 'High', riskColor: 'var(--game-negative)' },
];

function StorageBar() {
  const tip = useTip();
  const total = MIX.reduce((s, m) => s + m.pct, 0);
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <CardTitle Icon={PieChart}>Storage Overview &amp; Product Mix</CardTitle>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <span style={{ fontFamily: F, fontWeight: 800, fontSize: 18, color: 'var(--game-cyan)', fontVariantNumeric: 'tabular-nums' }}>28%</span>
          <span style={{ fontFamily: F, fontWeight: 500, fontSize: 10.5, color: 'var(--game-text-secondary)', marginLeft: 6 }}>of storage used</span>
        </div>
      </div>
      <div style={{ height: 22, borderRadius: 6, overflow: 'hidden', display: 'flex', background: 'var(--muted)' }}>
        {MIX.map((m, i) => (
          <div key={m.label} className="md-seg" onMouseMove={(e) => tip.show(e, m.label, `${m.pct}%`)} onMouseLeave={tip.hide}
            style={{ width: `${(m.pct / total) * 100}%`, background: m.free ? 'var(--muted)' : rampFill(i) }} />
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', marginTop: 12 }}>
        {MIX.map((m, i) => (
          <span key={m.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: F, fontWeight: 500, fontSize: 11.5, color: 'var(--game-text-secondary)' }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: m.free ? 'var(--sv-border)' : rampFill(i) }} />
            {m.label} ({m.pct}%)
          </span>
        ))}
      </div>
      <Tooltip tip={tip.tip} />
    </div>
  );
}

const TIER_NUMBERS: Record<string, { disc: number; freight: number }> = {
  t1: { disc: 0, freight: 24 },
  t2: { disc: 0.05, freight: 18 },
  t3: { disc: 0.1, freight: 15 },
};

export function SupplyTab({ demo }: { demo?: MonthlyDecisionsDemo }) {
  const products = demo
    ? demo.catalog.map((p) => ({ id: p.id as string, name: p.name, cost: `Unit cost: $ ${p.unitCost.toFixed(2)} /unit`, Icon: PRODUCT_ICONS[p.id] ?? Box }))
    : PRODUCTS;
  const [selected, setSelected] = useState(products[0].id);
  const [localTier, setLocalTier] = useState('t2');
  const [localQty, setLocalQty] = useState(4);

  const purchase = demo?.value.purchases[selected as keyof typeof demo.value.purchases];
  const tier = demo ? (purchase?.tier ?? 't2') : localTier;
  const qty = demo ? (purchase?.qty ?? 0) : localQty;
  const setTier = (t: string) => {
    if (demo) demo.onChange({ purchases: { ...demo.value.purchases, [selected]: { qty, tier: t as SupplierTier } } });
    else setLocalTier(t);
  };
  const setQty = (q: number) => {
    if (demo) demo.onChange({ purchases: { ...demo.value.purchases, [selected]: { qty: q, tier: tier as SupplierTier } } });
    else setLocalQty(q);
  };

  const sel = products.find(p => p.id === selected)!;
  const selDef = demo?.catalog.find(p => p.id === selected);
  const tierNum = TIER_NUMBERS[tier] ?? TIER_NUMBERS.t2;
  const totalCost = selDef ? qty * selDef.unitCost * (1 - tierNum.disc) + (qty > 0 ? tierNum.freight : 0) : 1.6;

  // Order summary (Supply tab only): which supplies + quantities chosen, with Save.
  const qtyOf = (id: string) => demo ? (demo.value.purchases[id as keyof typeof demo.value.purchases]?.qty ?? 0) : (id === selected ? qty : 0);
  const tierOf = (id: string) => demo ? (demo.value.purchases[id as keyof typeof demo.value.purchases]?.tier ?? 't2') : (id === selected ? tier : 't2');
  const tierShort = (id: string) => TIERS.find((t) => t.id === id)?.name ?? id;
  const costOf = (id: string) => {
    const def = demo?.catalog.find((c) => c.id === id);
    const q = qtyOf(id);
    if (!def || q <= 0) return 0;
    const tn = TIER_NUMBERS[tierOf(id)] ?? TIER_NUMBERS.t2;
    return q * def.unitCost * (1 - tn.disc) + tn.freight;
  };
  const chosen = products.filter((p) => qtyOf(p.id) > 0);
  const orderUnits = chosen.reduce((s, p) => s + qtyOf(p.id), 0);
  const orderCost = chosen.reduce((s, p) => s + costOf(p.id), 0);
  const [saved, setSaved] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 1800); };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '700px minmax(0,1fr)', gap: 16, alignItems: 'start' }}>
      {/* LEFT — bento stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="md-lift" style={{ ...CARD, padding: 14 }}>
          <div style={{ marginBottom: 10 }}><Title>Supply Selection</Title></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {products.map(({ id, name, cost, Icon }) => {
              const on = selected === id;
              return (
                <button key={id} onClick={() => setSelected(id)} className="md-card-btn" data-on={on} style={{
                  ...SUBCARD, border: on ? '1.4px solid var(--game-cyan)' : '1px solid var(--sv-border)',
                  boxShadow: on ? 'var(--shadow-elev-3)' : 'none', background: on ? 'var(--cyan-tint)' : '#fff',
                  padding: 10, textAlign: 'left', cursor: 'pointer',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Icon size={18} color="var(--game-dark)" />
                    <span style={{ width: 14, height: 14, borderRadius: '50%', flexShrink: 0, border: on ? 'none' : '2px solid var(--sv-border)', background: on ? 'var(--game-cyan)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {on && <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#fff' }} />}
                    </span>
                  </div>
                  <div style={{ marginTop: 8, fontFamily: F, fontWeight: 700, fontSize: 11.5, color: 'var(--game-text)' }}>{name}</div>
                  <div style={{ marginTop: 1, fontFamily: F, fontWeight: 400, fontSize: 10, color: 'var(--game-text-secondary)' }}>{cost}</div>
                  {/* Chosen quantity + tier — fills the card's white space */}
                  <div style={{ marginTop: 9, paddingTop: 8, borderTop: '1px solid var(--sv-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                    {qtyOf(id) > 0 ? (
                      <>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: F, fontWeight: 600, fontSize: 9.5, color: 'var(--game-teal-mid)', background: '#fff', border: '1px solid var(--sv-border)', borderRadius: 999, padding: '2px 7px' }}>
                          {tierShort(tierOf(id))}
                        </span>
                        <span style={{ fontFamily: F, fontWeight: 800, fontSize: 13, color: 'var(--game-text)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                          {qtyOf(id).toLocaleString('en-US')}
                          <span style={{ fontWeight: 500, fontSize: 9.5, color: 'var(--game-text-secondary)', marginLeft: 2 }}>{demo ? 'units' : 'kg'}</span>
                        </span>
                      </>
                    ) : (
                      <span style={{ fontFamily: F, fontWeight: 600, fontSize: 9.5, color: 'var(--game-text-muted)' }}>Not added yet</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Order summary — which supplies + quantities chosen, with Save */}
          <div style={{ marginTop: 14, borderTop: '1px solid var(--sv-border)', paddingTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <CardTitle Icon={ShoppingBag}>Your Supply Order</CardTitle>
              <span style={{ fontFamily: F, fontWeight: 600, fontSize: 11, color: 'var(--game-text-secondary)' }}>
                {chosen.length} item{chosen.length === 1 ? '' : 's'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 4 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontFamily: F, fontWeight: 500, fontSize: 10.5, color: 'var(--game-text-secondary)' }}>
                  Total {orderUnits.toLocaleString('en-US')} {demo ? 'units' : 'kg'}
                </span>
                {demo && (
                  <span style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: 'var(--game-text)', fontVariantNumeric: 'tabular-nums' }}>
                    ${Math.round(orderCost).toLocaleString('en-US')}
                  </span>
                )}
              </div>
              <button onClick={handleSave} style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                fontFamily: F, fontSize: 13, fontWeight: 600, padding: '9px 18px', borderRadius: 30, cursor: 'pointer',
                border: 'none', background: saved ? 'var(--cyan-tint)' : 'var(--game-cta-gradient)',
                color: saved ? 'var(--game-cyan)' : '#fff', transition: 'all 0.15s', whiteSpace: 'nowrap',
              }}>
                {saved ? <Check size={14} /> : <Package size={14} />}
                {saved ? 'Saved' : 'Save order'}
              </button>
            </div>
          </div>
        </div>

        <div className="md-lift" style={{ ...CARD, padding: 14 }}>
          <StorageBar />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 12 }}>
            <MiniStat Icon={Box} label="Used Space" value="280" sub="/ 1,000 sq ft" />
            <MiniStat Icon={TrendingUp} label="Most Used" value="Eggs" sub="15%" />
            <MiniStat Icon={Package} label="Least Used" value="Burger" sub="6%" />
            <MiniStat Icon={Box} label="Free Space" value="720" sub="sq ft · 44%" />
          </div>
        </div>
      </div>

      {/* RIGHT — detail */}
      <div className="md-lift" style={{ ...CARD, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <sel.Icon size={30} color="var(--game-dark)" />
          <div>
            <div style={{ fontFamily: F, fontWeight: 700, fontSize: 17, color: 'var(--game-text)' }}>{sel.name}</div>
            <div style={{ fontFamily: F, fontWeight: 400, fontSize: 12.5, color: 'var(--game-text-secondary)' }}>{sel.cost}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginTop: 16 }}>
          <MiniStat Icon={DollarSign} label="Est. Cash Outflow" value={demo ? `$${Math.round(totalCost).toLocaleString('en-US')}` : '$1.60'} />
          <MiniStat Icon={Box} label="Est. Space Usage" value={demo ? `${Math.max(0.1, qty / 500).toFixed(1)}` : '0.8'} sub="sq ft" />
          <MiniStat Icon={AlertTriangle} label="Waste Risk" value={demo ? `${Math.round((selDef?.spoilBase ?? 0.04) * 100)}%` : '4%'} sub="(est.)" valueColor="var(--game-warning)" />
          <MiniStat Icon={Package} label="Stock After Purchase" value={demo ? qty.toLocaleString('en-US') : '24.0'} sub={demo ? 'units' : 'kg'} />
        </div>

        <div style={{ marginTop: 20 }}>
          <CardTitle Icon={Package}>Supplier Tiers</CardTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr repeat(4, 1fr) 1.2fr', gap: 10, marginTop: 10, alignItems: 'center', fontFamily: F, fontSize: 10.5, fontWeight: 600, color: 'var(--game-text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', padding: '0 12px' }}>
            <span>Supplier</span><span>Disc.</span><span>Freight</span><span>Quality</span><span>Storage</span><span>Phantom Risk</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}>
            {TIERS.map((t) => {
              const on = tier === t.id;
              return (
                <button key={t.id} onClick={() => setTier(t.id)} className="md-card-btn" data-on={on} style={{
                  display: 'grid', gridTemplateColumns: '2fr repeat(4, 1fr) 1.2fr', gap: 10, alignItems: 'center',
                  background: on ? 'var(--cyan-tint)' : '#fff', border: on ? '1.4px solid var(--game-cyan)' : '1px solid var(--sv-border)',
                  borderRadius: 12, padding: '10px 12px', cursor: 'pointer', textAlign: 'left',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ marginTop: 2, width: 16, height: 16, borderRadius: '50%', flexShrink: 0, border: on ? 'none' : '2px solid var(--sv-border)', background: on ? 'var(--game-cyan)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {on && <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />}
                    </span>
                    <div>
                      <div style={{ fontFamily: F, fontWeight: 700, fontSize: 12.5, color: 'var(--game-text)' }}>{t.name} · {t.who}</div>
                      <span style={{ display: 'inline-block', marginTop: 4 }}><MiniPill>{t.tag}</MiniPill></span>
                    </div>
                  </div>
                  {[t.disc, t.freight, t.quality, t.storage].map((v, i) => (
                    <span key={i} style={{ fontFamily: F, fontWeight: 600, fontSize: 12.5, color: 'var(--game-text)', fontVariantNumeric: 'tabular-nums' }}>{v}</span>
                  ))}
                  <span style={{ fontFamily: F, fontWeight: 700, fontSize: 12.5, color: t.riskColor }}>{t.risk}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ fontFamily: F, fontWeight: 600, fontSize: 11, color: 'var(--game-text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Quantity</div>
          <Stepper value={qty} suffix={demo ? 'units' : 'kg'} onChange={setQty} fullWidth />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
          <div style={{ fontFamily: F, fontWeight: 500, fontSize: 11, color: 'var(--game-text-secondary)' }}>Total cost</div>
          <div style={{ fontFamily: F, fontWeight: 800, fontSize: 18, color: 'var(--game-text)', fontVariantNumeric: 'tabular-nums' }}>
            {demo ? `$${Math.round(totalCost).toLocaleString('en-US')}` : '$1.60'}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════ PRICING ════════════════════════════════ */

type PriceItem = { id: string; name: string; cost: string; margin: number; price: number; Icon: IconCmp };

const PRICE_ITEMS: PriceItem[] = [
  { id: 'espresso', name: 'Espresso', cost: '$0.85', margin: 76, price: 3.5, Icon: Coffee },
  { id: 'latte', name: 'Latte', cost: '$1.50', margin: 70, price: 5.0, Icon: Milk },
  { id: 'cappuccino', name: 'Cappuccino', cost: '$1.75', margin: 68, price: 5.5, Icon: Tea },
  { id: 'americano', name: 'Americano', cost: '$1.00', margin: 72, price: 4.0, Icon: CoffeeBeans },
  { id: 'mocha', name: 'Mocha', cost: '$2.00', margin: 65, price: 6.0, Icon: Cupcake },
];

function PriceLadder({ items = PRICE_ITEMS }: { items?: PriceItem[] }) {
  const tip = useTip();
  const W = 460, H = 206, padX = 30, padTop = 26, padBot = 62;
  const prices = items.map(p => p.price);
  const max = Math.max(...prices) * 1.15;
  const x = (i: number) => padX + (i + 0.5) * ((W - padX * 2) / items.length);
  const y = (v: number) => padTop + (1 - v / max) * (H - padTop - padBot);
  const pts = items.map((p, i) => [x(i), y(p.price)] as [number, number]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <CardTitle Icon={Activity}>Price Ladder &amp; Margin Spread</CardTitle>
        <div style={{ display: 'flex', gap: 14 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: F, fontSize: 11, fontWeight: 600, color: 'var(--game-text-secondary)' }}><span style={{ width: 14, height: 2, background: PAT_CYAN }} />Price ($/unit)</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: F, fontSize: 11, fontWeight: 600, color: 'var(--game-text-secondary)' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-chart-2)' }} />Margin (%)</span>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: 'visible' }}>
        {[0, 0.5, 1].map((g) => {
          const yy = padTop + g * (H - padTop - padBot);
          return <line key={g} x1={padX} y1={yy} x2={W - padX} y2={yy} stroke="var(--sv-border)" strokeWidth="1" strokeDasharray="1,5" />;
        })}
        <path d={`${smoothPath(pts)} L${pts[pts.length - 1][0]},${H - padBot} L${pts[0][0]},${H - padBot} Z`} fill={PAT_CYAN} fillOpacity="0.12" />
        <path d={smoothPath(pts)} fill="none" stroke={PAT_CYAN} strokeWidth="2.5" strokeLinecap="round" />
        {items.map((p, i) => (
          <g key={p.id} className="md-seg" onMouseMove={(e) => tip.show(e, p.name, `$${p.price.toFixed(2)} · margin ${p.margin}%`)} onMouseLeave={tip.hide}>
            <line x1={x(i)} y1={y(p.price)} x2={x(i)} y2={H - padBot} stroke="var(--color-chart-2)" strokeWidth="1.5" strokeDasharray="2,3" opacity="0.5" />
            <circle cx={x(i)} cy={y(p.price)} r="5" fill={PAT_CYAN} stroke="#fff" strokeWidth="2" />
            <text x={x(i)} y={y(p.price) - 10} textAnchor="middle" fontFamily={F} fontSize="11" fontWeight="700" fill="var(--game-text)">${p.price.toFixed(2)}</text>
            <foreignObject x={x(i) - 10} y={H - padBot + 6} width="20" height="20">
              <div style={{ display: 'flex', justifyContent: 'center' }}><p.Icon size={18} color="var(--game-dark)" /></div>
            </foreignObject>
            <text x={x(i)} y={H - padBot + 38} textAnchor="middle" fontFamily={F} fontSize="10.5" fontWeight="600" fill="var(--game-text-secondary)">{p.name}</text>
            <text x={x(i)} y={H - padBot + 52} textAnchor="middle" fontFamily={F} fontSize="11" fontWeight="700" fill="var(--color-chart-2)">{p.margin}%</text>
          </g>
        ))}
      </svg>
      <Tooltip tip={tip.tip} />
    </div>
  );
}

function PriceRow({ p, price, onChange }: { p: PriceItem; price: number; onChange: (v: number) => void }) {
  return (
    <div style={{ ...SUBCARD, display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between', padding: '11px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
        <p.Icon size={22} color="var(--game-dark)" />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: 'var(--game-text)' }}>{p.name}</div>
          <div style={{ fontFamily: F, fontWeight: 400, fontSize: 11, color: 'var(--game-text-secondary)' }}>Unit cost: {p.cost} &nbsp;·&nbsp; Margin: {p.margin}%</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <RoundStep dir="dec" onClick={() => onChange(Math.max(0, +(price - 0.5).toFixed(2)))} />
        <div style={{ minWidth: 92, height: 34, borderRadius: 999, border: '1px solid var(--sv-border)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, fontFamily: F, fontWeight: 700, fontSize: 14, color: 'var(--game-text)', fontVariantNumeric: 'tabular-nums' }}>
          {price.toFixed(2)}<span style={{ fontWeight: 500, fontSize: 11, color: 'var(--game-text-secondary)' }}>$ /unit</span>
        </div>
        <RoundStep dir="inc" onClick={() => onChange(+(price + 0.5).toFixed(2))} />
      </div>
    </div>
  );
}

export function PricingTab({ demo }: { demo?: MonthlyDecisionsDemo }) {
  const [localPrices, setLocalPrices] = useState(() => Object.fromEntries(PRICE_ITEMS.map(p => [p.id, p.price])) as Record<string, number>);

  const items: PriceItem[] = demo
    ? demo.catalog.map((p) => {
        const price = demo.value.prices[p.id] ?? p.refPrice;
        return {
          id: p.id,
          name: p.name,
          cost: `$${p.unitCost.toFixed(2)}`,
          margin: Math.max(0, Math.round((1 - p.unitCost / Math.max(0.1, price)) * 100)),
          price,
          Icon: PRODUCT_ICONS[p.id] ?? Coffee,
        };
      })
    : PRICE_ITEMS;
  const prices = demo ? (demo.value.prices as Record<string, number>) : localPrices;
  const setPrice = (id: string, v: number) => {
    if (demo) demo.onChange({ prices: { ...demo.value.prices, [id]: v } });
    else setLocalPrices(s => ({ ...s, [id]: v }));
  };

  const avgMargin = Math.round(items.reduce((s, p) => s + p.margin, 0) / Math.max(1, items.length));
  const avgPriceRatio = demo
    ? demo.catalog.reduce((s, p) => s + (demo.value.prices[p.id] ?? p.refPrice) / p.refPrice, 0) / Math.max(1, demo.catalog.length)
    : 1;
  const position = avgPriceRatio < 0.95 ? 'low' : avgPriceRatio > 1.05 ? 'premium' : 'balanced';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 500px', gap: 18, alignItems: 'start' }}>
      <div className="md-lift" style={{ ...CARD, padding: 24 }}>
        <Title>Selling price per product</Title>
        <div style={{ marginTop: 4 }}><Sub>Set the selling price for each product. Prices influence demand and profit margins.</Sub></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
          {items.map((p) => (
            <PriceRow key={p.id} p={p} price={prices[p.id] ?? p.price} onChange={(v) => setPrice(p.id, v)} />
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="md-lift" style={{ ...CARD, padding: 22 }}>
          <CardTitle Icon={PieChart}>Pricing Snapshot</CardTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 16 }}>
            <KPI label="Average Margin" value={`${avgMargin}%`} sub="▲ 2pp vs last month" subColor="var(--game-positive)" />
            <KPI label="Price Position" value={position.charAt(0).toUpperCase() + position.slice(1)} sub="Middle 40%" />
            <KPI label="Avg Price Change" value={demo ? `${avgPriceRatio >= 1 ? '+' : ''}${((avgPriceRatio - 1) * 100).toFixed(1)}%` : '+1.2%'} sub={avgPriceRatio >= 1 ? 'Increase' : 'Decrease'} subColor="var(--game-positive)" />
          </div>
          <div style={{ marginTop: 18 }}>
            <div style={{ display: 'flex', gap: 6, fontFamily: F }}>
              {([
                { id: 'low', label: 'Low Price', sub: 'Competitive' },
                { id: 'balanced', label: 'Balanced', sub: 'Market Average' },
                { id: 'premium', label: 'Premium', sub: 'High Price' },
              ] as const).map(({ id, label, sub }) => {
                const active = id === position;
                return (
                  <div key={id} style={{
                    flex: 1, textAlign: 'center', padding: '8px 10px', borderRadius: 10,
                    background: active ? 'rgba(0,210,200,0.12)' : 'rgba(0,0,0,0.03)',
                    border: active ? '1.4px solid var(--game-cyan)' : '1.4px solid rgba(0,0,0,0.07)',
                    transition: 'all 0.15s',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                      {active && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--game-cyan)', flexShrink: 0 }} />}
                      <span style={{ fontSize: 12, fontWeight: 700, color: active ? 'var(--game-cyan)' : 'var(--game-text-secondary)' }}>{label}</span>
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 400, color: 'var(--game-text-secondary)', marginTop: 2 }}>{sub}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="md-lift" style={{ ...CARD, padding: 22 }}><PriceLadder items={items} /></div>

        {!demo && <GameButton>Save</GameButton>}
      </div>
    </div>
  );
}

/* ════════════════════════════════ MARKETING ════════════════════════════════ */

const SEGMENTS = [
  { id: 'value', name: 'Value Buyers', Icon: Users, desc: 'Price sensitive, value driven', spend: 8000, reach: 1200, share: 40 },
  { id: 'balanced', name: 'Balanced Buyers', Icon: Scale, desc: 'Quality conscious, compare options', spend: 7000, reach: 900, share: 35 },
  { id: 'premium', name: 'Premium Buyers', Icon: Diamond, desc: 'Experience driven, less price sensitive', spend: 5000, reach: 600, share: 25 },
];

const FUNNEL = [
  { Icon: Megaphone, label: 'Awareness', value: '20,000', unit: 'people', pct: '' },
  { Icon: Eye, label: 'Visits', value: '6,000', unit: 'visits', pct: '30%' },
  { Icon: Flask, label: 'Trials', value: '1,500', unit: 'trials', pct: '25%' },
  { Icon: ShoppingBag, label: 'Buyers', value: '900', unit: 'buyers', pct: '60%' },
  { Icon: Heart, label: 'Retained', value: '540', unit: 'retained', pct: '60%' },
];

function ReachBars() {
  const tip = useTip();
  const max = Math.max(...SEGMENTS.map(s => s.reach)) * 1.18;
  const maxH = 86;
  return (
    <div>
      <CardTitle Icon={Users}>Expected Reach</CardTitle>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 0, marginTop: 10, paddingBottom: 2, borderBottom: '1px solid var(--sv-border)' }}>
        {SEGMENTS.map((s, i) => {
          const h = Math.round((s.reach / max) * maxH);
          const barW = `${100 / SEGMENTS.length}%`;
          return (
            <div key={s.id} className="md-seg" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
              onMouseMove={(e) => tip.show(e, s.name, `${s.reach.toLocaleString('en-US')} buyers`)} onMouseLeave={tip.hide}>
              <div style={{ fontFamily: F, fontWeight: 800, fontSize: 13, color: 'var(--game-text)', fontVariantNumeric: 'tabular-nums' }}>{s.reach.toLocaleString('en-US')}</div>
              <div style={{ width: '46%', height: h, borderRadius: 7, background: rampBarCss(i) }} />
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', marginTop: 6 }}>
        {SEGMENTS.map((s) => (
          <div key={s.id} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontFamily: F, fontWeight: 600, fontSize: 10.5, color: 'var(--game-text-secondary)' }}>{s.name.replace(' Buyers', '')}</div>
            <div style={{ fontFamily: F, fontWeight: 500, fontSize: 9.5, color: 'var(--game-text-muted)' }}>buyers</div>
          </div>
        ))}
      </div>
      <Tooltip tip={tip.tip} />
    </div>
  );
}

function Funnel() {
  const tip = useTip();
  const vals = [20000, 6000, 1500, 900, 540];
  const W = 460, H = 110, maxH = 76, minH = 18, padX = 20;
  const xAt = (i: number) => padX + (i / (FUNNEL.length - 1)) * (W - padX * 2);
  const hAt = (v: number) => minH + (Math.sqrt(v) / Math.sqrt(vals[0])) * (maxH - minH);
  const topPts = FUNNEL.map((_, i) => [xAt(i), (H - hAt(vals[i])) / 2] as [number, number]);
  const botPts = FUNNEL.map((_, i) => [xAt(i), (H + hAt(vals[i])) / 2] as [number, number]);
  const band = [...topPts, ...[...botPts].reverse()].map((p) => p.join(',')).join(' ');
  return (
    <div>
      <CardTitle Icon={Target}>Acquisition Funnel <span style={{ fontWeight: 500, color: 'var(--game-text-secondary)', fontSize: 12 }}>(All Segments)</span></CardTitle>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ marginTop: 8 }}>
        <polygon points={band} fill={PAT_CYAN} fillOpacity="0.88" />
        {FUNNEL.map((f, i) => f.pct && (
          <g key={i} className="md-seg" onMouseMove={(e) => tip.show(e, f.label, `${f.value} ${f.unit}`)} onMouseLeave={tip.hide}>
            <rect x={xAt(i) - 16} y={H / 2 - 9} width="32" height="18" rx="9" fill="#fff" opacity="0.92" />
            <text x={xAt(i)} y={H / 2 + 4} textAnchor="middle" fontFamily={F} fontSize="10.5" fontWeight="700" fill="var(--game-teal-mid)">{f.pct}</text>
          </g>
        ))}
      </svg>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${FUNNEL.length}, 1fr)`, gap: 4, marginTop: 6 }}>
        {FUNNEL.map((f, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <f.Icon size={15} color="var(--game-teal-mid)" />
            <div style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: 'var(--game-text)', fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>{f.value}</div>
            <div style={{ fontFamily: F, fontWeight: 500, fontSize: 10, color: 'var(--game-text-secondary)' }}>{f.label}</div>
          </div>
        ))}
      </div>
      <Tooltip tip={tip.tip} />
    </div>
  );
}

function Donut() {
  const tip = useTip();
  const total = SEGMENTS.reduce((s, x) => s + x.share, 0);
  const R = 46, SW = 16, C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <div>
      <CardTitle Icon={PieChart}>Segment Targeting</CardTitle>
      <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 12 }}>
        <svg width="120" height="120" viewBox="0 0 120 120" style={{ flexShrink: 0 }}>
          <g transform="rotate(-90 60 60)">
            {SEGMENTS.map((s, i) => {
              const dash = (s.share / total) * C;
              const el = (
                <circle key={s.id} className="md-seg" cx="60" cy="60" r={R} fill="none"
                  stroke={rampFill(i)} strokeWidth={SW} strokeDasharray={`${dash} ${C - dash}`} strokeDashoffset={-acc}
                  onMouseMove={(e) => tip.show(e, s.name, `${s.share}%`)} onMouseLeave={tip.hide} />
              );
              acc += dash;
              return el;
            })}
          </g>
          <text x="60" y="56" textAnchor="middle" fontFamily={F} fontSize="20" fontWeight="800" fill="var(--game-text)">100%</text>
          <text x="60" y="72" textAnchor="middle" fontFamily={F} fontSize="9.5" fontWeight="500" fill="var(--game-text-secondary)">targeted</text>
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
          {SEGMENTS.map((s, i) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <LegendTick color={rampFill(i)} />
              <div style={{ flex: 1, fontFamily: F, fontWeight: 600, fontSize: 12, color: 'var(--game-text-secondary)' }}>{s.name}</div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: F, fontWeight: 800, fontSize: 14, color: 'var(--game-text)', fontVariantNumeric: 'tabular-nums' }}>{s.share}%</div>
                <div style={{ fontFamily: F, fontWeight: 500, fontSize: 10.5, color: 'var(--game-text-secondary)', fontVariantNumeric: 'tabular-nums' }}>$ {s.spend.toLocaleString('en-US')}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Tooltip tip={tip.tip} />
    </div>
  );
}

export function MarketingTab({ demo }: { demo?: MonthlyDecisionsDemo }) {
  const [localSpend, setLocalSpend] = useState(() => Object.fromEntries(SEGMENTS.map(s => [s.id, s.spend])) as Record<string, number>);
  const spend = demo ? (demo.value.marketingSpend as Record<string, number>) : localSpend;
  const setSpend = (id: string, v: number) => {
    if (demo) demo.onChange({ marketingSpend: { ...demo.value.marketingSpend, [id]: v } });
    else setLocalSpend(st => ({ ...st, [id]: v }));
  };
  const totalSpend = SEGMENTS.reduce((s, seg) => s + (spend[seg.id] ?? 0), 0);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 524px', gap: 18, alignItems: 'start' }}>
      <div className="md-lift" style={{ ...CARD, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div>
            <Title>Marketing Spend Decisions</Title>
            <div style={{ marginTop: 4 }}><Sub>Allocate your monthly marketing budget by customer segment.</Sub></div>
          </div>
          <HeaderPill Icon={Wallet}>{demo ? `Planned $ ${totalSpend.toLocaleString('en-US')}` : 'Budget $ 20,000'}</HeaderPill>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
          {SEGMENTS.map((s) => (
            <div key={s.id} style={{ ...SUBCARD, padding: 16, display: 'grid', gridTemplateColumns: '1fr 220px', gap: 16, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <span style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--cyan-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <s.Icon size={20} color="var(--game-teal-mid)" />
                </span>
                <div>
                  <div style={{ fontFamily: F, fontWeight: 700, fontSize: 15, color: 'var(--game-text)' }}>{s.name}</div>
                  <div style={{ fontFamily: F, fontWeight: 400, fontSize: 11.5, color: 'var(--game-text-secondary)' }}>{s.desc}</div>
                </div>
              </div>
              <SpinInput value={spend[s.id] ?? 0} onChange={(v) => setSpend(s.id, v)} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="md-lift" style={{ ...CARD, padding: 22 }}>
          <ReachBars />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
            <MiniStat Icon={Target} label="Total Planned Spend" value={`$ ${totalSpend.toLocaleString('en-US')}`} />
            <MiniStat Icon={Receipt} label="Recent CAC (All Segments)" value="$ 3.45" />
          </div>
        </div>

        <div className="md-lift" style={{ ...CARD, padding: 22 }}><Funnel /></div>
        <div className="md-lift" style={{ ...CARD, padding: 22 }}><Donut /></div>

        {!demo && <GameButton>Save</GameButton>}
      </div>
    </div>
  );
}

/* ════════════════════════════════ STAFFING ════════════════════════════════ */

const STAFF = [
  { id: 'service', name: 'Service', Icon: Users, desc: 'Front-of-house, serving and customer experience.', rec: 3, count: 2, cost: '$2,800 this month', below: true },
  { id: 'kitchen', name: 'Kitchen / Prep', Icon: Salad, desc: 'Food preparation, cooking and plating.', rec: 2, count: 2, cost: '$3,600 this month', below: false },
  { id: 'support', name: 'Support', Icon: Sparkle, desc: 'Cleaning, opening/closing and maintenance.', rec: 1, count: 1, cost: '$1,600 this month', below: false },
  { id: 'other', name: 'Other Support', Icon: Package, desc: 'Inventory, runners, dishwashing.', rec: 1, count: 2, cost: '$3,720 this month', below: false },
];

const CAPABILITY = [
  { name: 'Service', Icon: Users, ratio: '2 / 3', util: 67 },
  { name: 'Kitchen / Prep', Icon: Salad, ratio: '2 / 2', util: 100 },
  { name: 'Support', Icon: Sparkle, ratio: '1 / 1', util: 100 },
  { name: 'Other Support', Icon: Package, ratio: '2 / 1', util: 200 },
];

function utilColor(u: number) {
  if (u < 90) return 'var(--game-cyan)';
  if (u <= 110) return 'var(--game-positive)';
  if (u <= 130) return 'var(--game-warning)';
  return 'var(--game-negative)';
}

const STAFF_ROLE_COST: Record<string, number> = { service: 1400, kitchen: 1800, support: 1600, other: 1860 };

export function StaffingTab({ demo }: { demo?: MonthlyDecisionsDemo }) {
  const [localCounts, setLocalCounts] = useState(() => Object.fromEntries(STAFF.map(s => [s.id, s.count])) as Record<string, number>);
  const counts = demo ? (demo.value.staff as Record<string, number>) : localCounts;
  const setCount = (id: string, v: number) => {
    if (demo) demo.onChange({ staff: { ...demo.value.staff, [id]: v } });
    else setLocalCounts(c => ({ ...c, [id]: v }));
  };
  const totalPeople = STAFF.reduce((s, r) => s + (counts[r.id] ?? 0), 0);
  const totalPayroll = STAFF.reduce((s, r) => s + (counts[r.id] ?? 0) * STAFF_ROLE_COST[r.id], 0);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 524px', gap: 18, alignItems: 'start' }}>
      <div className="md-lift" style={{ ...CARD, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div>
            <Title>Allocate this month&apos;s staff</Title>
            <div style={{ marginTop: 4 }}><Sub>Below recommended in key roles hits service quality and increases burnout risk.</Sub></div>
          </div>
          <HeaderPill Icon={Users}>{totalPeople} people · ${totalPayroll.toLocaleString('en-US')}/mo</HeaderPill>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 16 }}>
          {STAFF.map((s) => (
            <div key={s.id} style={{ ...SUBCARD, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <s.Icon size={18} color="var(--game-dark)" />
                  <span style={{ fontFamily: F, fontWeight: 700, fontSize: 15, color: 'var(--game-text)' }}>{s.name}</span>
                </div>
                {(demo ? (counts[s.id] ?? 0) < s.rec : s.below) && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: F, fontWeight: 700, fontSize: 11, color: 'var(--game-warning)' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--game-warning)' }} />Below rec
                  </span>
                )}
              </div>
              <div style={{ fontFamily: F, fontWeight: 400, fontSize: 11.5, color: 'var(--game-text-secondary)', marginTop: 8, lineHeight: 1.4 }}>{s.desc}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 16 }}>
                <span style={{ fontFamily: F, fontWeight: 400, fontSize: 12, color: 'var(--game-text-secondary)' }}>Recommended <strong style={{ color: 'var(--game-text)', fontWeight: 700 }}>{s.rec}</strong></span>
                <Stepper value={counts[s.id] ?? 0} onChange={(v) => setCount(s.id, v)} />
              </div>
              <div style={{ fontFamily: F, fontWeight: 500, fontSize: 12, color: 'var(--game-text-secondary)', marginTop: 12, fontVariantNumeric: 'tabular-nums' }}>
                {demo ? `$${((counts[s.id] ?? 0) * STAFF_ROLE_COST[s.id]).toLocaleString('en-US')} this month` : s.cost}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="md-lift" style={{ ...CARD, padding: 22 }}>
          <CardTitle Icon={Activity}>Staffing Preview</CardTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 14 }}>
            <KPI label="Monthly Service Capacity" value="1,180" sub="covers" />
            <KPI label="Recent Demand Avg" value="980" sub="covers/mo" />
            <KPI label="Staff Utilization" value="83%" sub="of capacity" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
            <MiniStat Icon={Wallet} label="Payroll This Month" value={`$${totalPayroll.toLocaleString('en-US')}`} sub={`· ${totalPeople} people`} />
            <MiniStat Icon={AlertTriangle} label="Burnout Risk" value="Low" sub="· 3% risk" valueColor="var(--game-positive)" />
          </div>
        </div>

        <div className="md-lift" style={{ ...CARD, padding: 22 }}>
          <CardTitle Icon={Users}>Team Capability &amp; Workload</CardTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginTop: 14 }}>
            {CAPABILITY.map((c) => (
              <div key={c.name} style={{ ...SUBCARD, padding: '12px 10px', textAlign: 'center' }}>
                <c.Icon size={17} color="var(--game-teal-mid)" />
                <div style={{ fontFamily: F, fontWeight: 600, fontSize: 11, color: 'var(--game-text-secondary)', marginTop: 6 }}>{c.name}</div>
                <div style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: 'var(--game-text)', fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>{c.ratio}</div>
                <div style={{ height: 5, borderRadius: 999, background: 'var(--muted)', marginTop: 8, overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, c.util / 2)}%`, height: '100%', background: utilColor(c.util) }} />
                </div>
                <div style={{ fontFamily: F, fontWeight: 700, fontSize: 12, color: utilColor(c.util), marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>{c.util}%</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', marginTop: 14 }}>
            {[['Optimal (90–110%)', 'var(--game-positive)'], ['High (110–130%)', 'var(--game-warning)'], ['Overloaded (>130%)', 'var(--game-negative)'], ['Low (<90%)', 'var(--game-cyan)']].map(([l, c]) => (
              <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: F, fontWeight: 500, fontSize: 10.5, color: 'var(--game-text-secondary)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />{l}
              </span>
            ))}
          </div>
        </div>

        {!demo && <GameButton>Save</GameButton>}
      </div>
    </div>
  );
}

/* ════════════════════════════════ BANKING (demo only) ════════════════════════════════ */

const BANKING_OPTIONS: { id: BankingAction; name: string; desc: string; detail: string; risk: string; riskColor: string }[] = [
  { id: 'hold', name: 'Hold', desc: 'No banking action this month.', detail: 'Keep current cash position', risk: 'None', riskColor: 'var(--game-positive)' },
  { id: 'credit-line', name: 'Draw Credit Line', desc: 'Draw $50,000 against the working-capital line.', detail: '+$50,000 cash · 1.5%/mo interest on outstanding balance', risk: 'Interest cost', riskColor: 'var(--game-warning)' },
  { id: 'pay-30-day', name: 'Pay Suppliers in 30 Days', desc: 'Defer 30% of this month’s goods payment to next month.', detail: 'Improves this month’s cash timing, not profit', risk: 'Timing only', riskColor: 'var(--game-positive)' },
];

function BankingTab({ demo }: { demo: MonthlyDecisionsDemo }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 380px', gap: 18, alignItems: 'start' }}>
      <div className="md-lift" style={{ ...CARD, padding: 24 }}>
        <Title>Banking decision</Title>
        <div style={{ marginTop: 4 }}><Sub>Optional liquidity move for this month. Use it when cash pressure builds — financing is a tool, not free money.</Sub></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
          {BANKING_OPTIONS.map((opt) => {
            const on = demo.value.banking === opt.id;
            return (
              <button key={opt.id} onClick={() => demo.onChange({ banking: opt.id })} className="md-card-btn" data-on={on} style={{
                ...SUBCARD, border: on ? '1.4px solid var(--game-cyan)' : '1px solid var(--sv-border)',
                background: on ? 'var(--cyan-tint)' : '#fff', padding: '14px 16px', textAlign: 'left', cursor: 'pointer',
                display: 'grid', gridTemplateColumns: '20px 1fr auto', gap: 12, alignItems: 'start',
              }}>
                <span style={{ marginTop: 2, width: 16, height: 16, borderRadius: '50%', flexShrink: 0, border: on ? 'none' : '2px solid var(--sv-border)', background: on ? 'var(--game-cyan)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {on && <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />}
                </span>
                <div>
                  <div style={{ fontFamily: F, fontWeight: 700, fontSize: 13.5, color: 'var(--game-text)' }}>{opt.name}</div>
                  <div style={{ fontFamily: F, fontWeight: 400, fontSize: 11.5, color: 'var(--game-text-secondary)', marginTop: 2 }}>{opt.desc}</div>
                  <div style={{ fontFamily: F, fontWeight: 500, fontSize: 11, color: 'var(--game-teal-mid)', marginTop: 5 }}>{opt.detail}</div>
                </div>
                <span style={{ fontFamily: F, fontWeight: 700, fontSize: 11.5, color: opt.riskColor, whiteSpace: 'nowrap' }}>{opt.risk}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="md-lift" style={{ ...CARD, padding: 22 }}>
        <CardTitle Icon={Landmark}>Liquidity Snapshot</CardTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10, marginTop: 14 }}>
          <MiniStat Icon={Wallet} label="Cash Going Into This Month" value={`$${demo.cash.toLocaleString('en-US')}`} />
          <MiniStat
            Icon={TrendingUp}
            label="Cash After Banking Action"
            value={`$${(demo.cash + (demo.value.banking === 'credit-line' ? 50000 : 0)).toLocaleString('en-US')}`}
            valueColor={demo.value.banking === 'credit-line' ? 'var(--game-positive)' : undefined}
          />
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════ ROOT ════════════════════════════════ */

export const TABS = [
  { id: 'supply', label: 'Supply' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'staffing', label: 'Staffing' },
];

export function MonthlyDecisions({ demo }: { demo?: MonthlyDecisionsDemo } = {}) {
  const [tab, setTab] = useState('supply');

  React.useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('tab');
    if (t && (TABS.some(x => x.id === t) || t === 'banking')) {
      setTab(t);
    }
  }, []);

  const tabs = demo ? [...TABS, { id: 'banking', label: 'Banking' }] : TABS;

  // Month 1 lands on the Report (opening position) so players review onboarding first.
  const [mode, setMode] = useState<'report' | 'decisions'>(() => (demo && demo.month === 1 ? 'report' : 'decisions'));

  // DemoShell's "Visit the Bank" button jumps straight to the Banking tab (in Decisions mode).
  React.useEffect(() => {
    if (!demo) return;
    const onBank = () => { setMode('decisions'); setTab('banking'); };
    window.addEventListener('sv-demo-banking', onBank);
    return () => window.removeEventListener('sv-demo-banking', onBank);
  }, [demo]);

  const titleByMode = mode === 'report'
    ? (demo?.reportData?.monthLabel ?? 'Report')
    : (demo ? `Your Month ${demo.month} Decisions` : 'Your Monthly Decisions');

  // Per-tab locking (demo only). Each tab locks independently; the bottom
  // Send Decisions CTA unlocks once every tab is locked.
  const tabLocked = (id: string) => (demo ? demo.lockedTabs.includes(id) : false);
  const activeLocked = tabLocked(tab);
  const lockedCount = tabs.filter((t) => tabLocked(t.id)).length;

  return (
    <GridBackground>
      <style>{MD_CSS}</style>
      <PageTransition>
        <GameHeader />
        <div className="md-root" style={{ maxWidth: 'var(--max-w-page)', margin: '0 auto', padding: '8px 24px 48px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
            <div>
              <h1 style={{ fontFamily: F, fontWeight: 800, fontSize: 26, letterSpacing: '-0.5px', color: 'var(--game-text)' }}>
                {titleByMode}
              </h1>
              {mode === 'report' && demo?.reportData?.subtitle && (
                <div style={{ fontFamily: F, fontSize: 13, color: 'var(--game-text-secondary)', marginTop: 3 }}>{demo.reportData.subtitle}</div>
              )}
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2, background: 'rgba(255,255,255,0.6)', border: '1px solid white', borderRadius: 70, padding: '4px 6px', flexShrink: 0 }}>
              {(['report', 'decisions'] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)} style={{
                  fontFamily: F, fontSize: 13, fontWeight: mode === m ? 700 : 600, padding: '8px 18px', borderRadius: 30,
                  border: 'none', cursor: 'pointer', textTransform: 'capitalize',
                  background: mode === m ? 'var(--game-cta-gradient)' : 'transparent',
                  color: mode === m ? 'white' : 'var(--game-text-secondary)', transition: 'all 0.15s',
                }}>{m}</button>
              ))}
            </div>
          </div>

          {mode === 'report' ? (
            <MonthReviewContent data={demo?.reportData} embedded />
          ) : (
            <>
              {demo
                ? <DecisionTabBar tabs={tabs} activeTab={tab} onChange={setTab} isLocked={tabLocked} />
                : <TabBar tabs={tabs} activeTab={tab} onChange={setTab} className="mb-7" />}

              {demo && (
                <TabLockBar
                  tabLabel={tabs.find((t) => t.id === tab)?.label ?? ''}
                  locked={activeLocked}
                  lockedCount={lockedCount}
                  totalCount={tabs.length}
                  onToggle={() => demo.onTabLockChange(tab, !activeLocked)}
                />
              )}

              <div style={{ marginTop: 18, pointerEvents: activeLocked ? 'none' : 'auto', opacity: activeLocked ? 0.7 : 1, transition: 'opacity .2s ease' }}>
                {tab === 'supply' && <SupplyTab demo={demo} />}
                {tab === 'pricing' && <PricingTab demo={demo} />}
                {tab === 'marketing' && <MarketingTab demo={demo} />}
                {tab === 'staffing' && <StaffingTab demo={demo} />}
                {tab === 'banking' && demo && <BankingTab demo={demo} />}
              </div>
            </>
          )}
        </div>
      </PageTransition>
    </GridBackground>
  );
}

/* Glass pill tab bar with a per-tab lock pip (Decisions mode, demo flow). */
function DecisionTabBar({ tabs, activeTab, onChange, isLocked }: {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onChange: (id: string) => void;
  isLocked: (id: string) => boolean;
}) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 2,
      background: 'rgba(255,255,255,0.6)', border: '1px solid white', borderRadius: 70, padding: '4px 8px',
    }}>
      {tabs.map((t) => {
        const active = activeTab === t.id;
        const lk = isLocked(t.id);
        return (
          <button key={t.id} onClick={() => onChange(t.id)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: F, fontSize: 13, fontWeight: active ? 700 : 600,
            padding: '9px 18px', borderRadius: active ? 30 : 40, border: 'none', cursor: 'pointer',
            background: active ? 'var(--game-cta-gradient)' : 'transparent',
            color: active ? 'white' : (lk ? 'var(--game-cyan)' : '#606569'),
            transition: 'all 0.15s', whiteSpace: 'nowrap',
          }}>
            {t.label}
            {lk && <Lock size={12} color={active ? '#fff' : 'var(--game-cyan)'} />}
          </button>
        );
      })}
    </div>
  );
}

/* Per-tab lock gate. The active tab locks/unlocks independently; once all tabs
 * are locked, the bottom Send Decisions CTA enables. */
function TabLockBar({ tabLabel, locked, lockedCount, totalCount, onToggle }: {
  tabLabel: string;
  locked: boolean;
  lockedCount: number;
  totalCount: number;
  onToggle: () => void;
}) {
  const allDone = lockedCount === totalCount;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      marginTop: 14, padding: '10px 14px', borderRadius: 12,
      background: locked ? 'var(--cyan-tint)' : 'rgba(255,255,255,0.6)',
      border: locked ? '1.4px solid var(--game-cyan)' : '1.4px solid white',
      transition: 'background .2s ease, border-color .2s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
        <span style={{
          width: 30, height: 30, borderRadius: 9, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: locked ? 'var(--game-cta-gradient)' : 'var(--cyan-tint)',
        }}>
          {locked ? <Lock size={15} color="#fff" /> : <Unlock size={15} color="var(--game-teal-mid)" />}
        </span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: F, fontWeight: 700, fontSize: 13.5, color: 'var(--game-text)' }}>
            {locked ? `${tabLabel} locked` : `Lock ${tabLabel} when you're done`}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: F, fontWeight: 500, fontSize: 11.5, color: allDone ? 'var(--game-cyan)' : 'var(--game-text-secondary)', marginTop: 1 }}>
            {allDone && <Check size={12} color="var(--game-cyan)" />}
            {lockedCount} / {totalCount} tabs locked{allDone ? ' — Send Decisions enabled below' : ''}
          </div>
        </div>
      </div>
      <button onClick={onToggle} style={{
        display: 'inline-flex', alignItems: 'center', gap: 7, flexShrink: 0,
        fontFamily: F, fontSize: 13, fontWeight: 600, padding: '9px 18px', borderRadius: 30, cursor: 'pointer',
        border: locked ? '1.4px solid var(--game-cyan)' : 'none',
        background: locked ? 'transparent' : 'var(--game-cta-gradient)',
        color: locked ? 'var(--game-cyan)' : '#fff', transition: 'all 0.15s', whiteSpace: 'nowrap',
      }}>
        {locked ? <Unlock size={14} /> : <Lock size={14} />}
        {locked ? 'Unlock tab' : 'Lock tab'}
      </button>
    </div>
  );
}
