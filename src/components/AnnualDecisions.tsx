'use client';

import React, { useState } from 'react';
import { GridBackground } from './GridBackground';
import { GameHeader } from './GameHeader';
import { PageTransition } from './PageTransition';
import { GameButton } from './GameButton';
import {
  Box, Package, Landmark, Wallet, TrendingUp, AlertTriangle, Users, Scale, Check,
} from './PixelIcons';
import type { AnnualDecisionsInput, ProductId } from '../lib/demo/demo-types';
import { PRODUCT_CATALOG, EXTENSION_COST_PER_SQFT, productById } from '../lib/demo/sim-engine';

const F = "'Outfit', sans-serif";

const CARD: React.CSSProperties = {
  background: 'var(--game-surface)', border: 'var(--game-card-border)', borderRadius: 16, boxShadow: 'var(--shadow-elev-1)',
};
const SUBCARD: React.CSSProperties = {
  background: 'var(--game-surface-solid)', border: '1px solid var(--sv-border)', borderRadius: 12,
};

const AD_CSS = `
.ad-card-btn{transition:border-color .15s ease, box-shadow .15s ease, background .15s ease, transform .1s ease;}
.ad-card-btn:not([data-on="true"]):hover{border-color:color-mix(in srgb, var(--game-cyan) 45%, var(--sv-border));background:color-mix(in srgb, var(--game-cyan) 5%, #fff);}
.ad-card-btn:active{transform:translateY(1px);}
.ad-lift{transition:transform .2s cubic-bezier(.22,1,.36,1), box-shadow .2s ease;}
.ad-lift:hover{transform:translateY(-3px);box-shadow:0 16px 36px rgba(0,44,51,0.13);}
`;

export interface AnnualProductStat {
  id: ProductId;
  name: string;
  revenue: number;
  marginPct: number;
  wasted: number;
}

export interface AnnualDecisionsDemo {
  value: AnnualDecisionsInput;
  onChange: (patch: Partial<AnnualDecisionsInput>) => void;
  cash: number;
  ownershipPct: number;
  activeProducts: ProductId[];
  productStats: AnnualProductStat[];
  provisionalValue: number;
  currentSqft: number;
  rentPerSqft: number;
}

const REF_STATS: AnnualProductStat[] = [
  { id: 'tea', name: 'Tea', revenue: 28400, marginPct: 72, wasted: 110 },
  { id: 'burger', name: 'Burger', revenue: 22100, marginPct: 58, wasted: 240 },
  { id: 'bread', name: 'Bread', revenue: 16800, marginPct: 66, wasted: 180 },
  { id: 'cheese', name: 'Cheese', revenue: 13200, marginPct: 61, wasted: 95 },
  { id: 'eggs', name: 'Eggs', revenue: 9400, marginPct: 70, wasted: 320 },
  { id: 'butter', name: 'Butter', revenue: 4300, marginPct: 54, wasted: 150 },
];

const REF_VALUE: AnnualDecisionsInput = { extensionSqft: 0, productSwap: null, vc: { accept: false, dilutionPct: 10 } };

function SectionHead({ n, title, sub }: { n: string; title: string; sub: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <span style={{ fontFamily: F, fontWeight: 700, fontSize: 10.5, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--game-teal-mid)' }}>{n}</span>
      <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 18, letterSpacing: '-0.3px', color: 'var(--game-text)', marginTop: 3 }}>{title}</h2>
      <p style={{ fontFamily: F, fontWeight: 400, fontSize: 12.5, color: 'var(--game-text-secondary)', marginTop: 3, maxWidth: 560 }}>{sub}</p>
    </div>
  );
}

function Stat({ label, value, valueColor }: { label: string; value: React.ReactNode; valueColor?: string }) {
  return (
    <div style={{ ...SUBCARD, padding: '12px 14px' }}>
      <div style={{ fontFamily: F, fontWeight: 500, fontSize: 11, color: 'var(--game-text-secondary)' }}>{label}</div>
      <div style={{ fontFamily: F, fontWeight: 800, fontSize: 17, color: valueColor ?? 'var(--game-text)', fontVariantNumeric: 'tabular-nums', marginTop: 4 }}>{value}</div>
    </div>
  );
}

function StepBtn({ dir, onClick, disabled }: { dir: 'inc' | 'dec'; onClick: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} aria-label={dir === 'inc' ? 'increase' : 'decrease'} style={{
      width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--sv-border)', background: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: disabled ? 'not-allowed' : 'pointer', flexShrink: 0,
      fontFamily: F, fontSize: 17, fontWeight: 600, color: 'var(--game-text-secondary)', lineHeight: 1, paddingBottom: 2,
      opacity: disabled ? 0.4 : 1,
    }}>{dir === 'inc' ? '+' : '−'}</button>
  );
}

export function AnnualDecisions({ demo }: { demo?: AnnualDecisionsDemo } = {}) {
  const [local, setLocal] = useState<AnnualDecisionsInput>(REF_VALUE);
  const value = demo?.value ?? local;
  const setValue = (patch: Partial<AnnualDecisionsInput>) => {
    if (demo) demo.onChange(patch);
    else setLocal((s) => ({ ...s, ...patch }));
  };

  const cash = demo?.cash ?? 340000;
  const ownershipPct = demo?.ownershipPct ?? 100;
  const stats = demo?.productStats ?? REF_STATS;
  const activeProducts = demo?.activeProducts ?? REF_STATS.map((s) => s.id);
  const provisionalValue = demo?.provisionalValue ?? 1400000;
  const currentSqft = demo?.currentSqft ?? 3200;
  const rentPerSqft = demo?.rentPerSqft ?? 20;

  const benchProducts = PRODUCT_CATALOG.filter((p) => !activeProducts.includes(p.id));
  const weakest = [...stats].sort((a, b) => a.revenue - b.revenue)[0];

  const extensionCost = value.extensionSqft * EXTENSION_COST_PER_SQFT;
  const extraRent = Math.round(value.extensionSqft * rentPerSqft * 0.5);
  const extraCapacity = Math.round(value.extensionSqft * 0.04 * 30); // covers/month, mirrors sqft→customers ratio

  const swap = value.productSwap;
  const swapWriteOff = swap ? Math.round(60 * productById(swap.remove).unitCost * (swap.stockDisposal === 'clearance' ? 0.6 : 1)) : 0;

  const raiseAmount = value.vc.accept ? Math.round(provisionalValue * (value.vc.dilutionPct / 100)) : 0;
  const cashAfter = cash - extensionCost - swapWriteOff + raiseAmount;
  const ownershipAfter = ownershipPct - (value.vc.accept ? value.vc.dilutionPct : 0);

  return (
    <GridBackground>
      <style>{AD_CSS}</style>
      <PageTransition>
        <GameHeader />
        <div style={{ maxWidth: 'var(--max-w-page)', margin: '0 auto', padding: '8px 24px 48px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
            <div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--cyan-tint)', color: 'var(--game-teal-mid)', borderRadius: 999, padding: '4px 11px', fontFamily: F, fontWeight: 700, fontSize: 11, letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                Annual Gate · Year 1
              </span>
              <h1 style={{ fontFamily: F, fontWeight: 800, fontSize: 26, letterSpacing: '-0.5px', color: 'var(--game-text)', marginTop: 10 }}>
                Reshape the Business
              </h1>
              <p style={{ fontFamily: F, fontWeight: 400, fontSize: 13.5, color: 'var(--game-text-secondary)', marginTop: 4, maxWidth: 600 }}>
                Annual decisions are structural: extend your footprint, rework the active product set, or trade ownership for capital. Fewer, larger, and more consequential than anything monthly.
              </p>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--cyan-tint)', color: 'var(--game-teal-mid)', borderRadius: 999, padding: '6px 12px', fontFamily: F, fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap', flexShrink: 0 }}>
              <Wallet size={13} color="var(--game-teal-mid)" />Cash $ {cash.toLocaleString('en-US')}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 400px', gap: 18, alignItems: 'start' }}>
            {/* Left column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* 1 — Extension */}
              <div className="ad-lift" style={{ ...CARD, padding: 22 }}>
                <SectionHead n="01 · Extension" title="Extend Your Footprint" sub={`Growth happens by extending the same business, not opening another store. Each marginal square foot costs $${EXTENSION_COST_PER_SQFT} up front and raises rent.`} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <StepBtn dir="dec" onClick={() => setValue({ extensionSqft: Math.max(0, value.extensionSqft - 100) })} disabled={value.extensionSqft === 0} />
                  <div style={{ minWidth: 150, height: 40, borderRadius: 999, border: '1px solid var(--sv-border)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F, fontWeight: 800, fontSize: 16, color: 'var(--game-text)', fontVariantNumeric: 'tabular-nums' }}>
                    +{value.extensionSqft.toLocaleString('en-US')}<span style={{ fontWeight: 500, fontSize: 12, color: 'var(--game-text-secondary)', marginLeft: 5 }}>sq ft</span>
                  </div>
                  <StepBtn dir="inc" onClick={() => setValue({ extensionSqft: value.extensionSqft + 100 })} disabled={cashAfter - EXTENSION_COST_PER_SQFT * 100 < 0} />
                  <span style={{ fontFamily: F, fontWeight: 500, fontSize: 12, color: 'var(--game-text-secondary)' }}>
                    Current footprint: {currentSqft.toLocaleString('en-US')} sq ft
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 16 }}>
                  <Stat label="Capex (one-time)" value={`$${extensionCost.toLocaleString('en-US')}`} valueColor={extensionCost > 0 ? 'var(--game-warning)' : undefined} />
                  <Stat label="Added Monthly Rent" value={`$${extraRent.toLocaleString('en-US')}`} />
                  <Stat label="Added Capacity" value={`~${extraCapacity.toLocaleString('en-US')} covers/mo`} valueColor={extraCapacity > 0 ? 'var(--game-positive)' : undefined} />
                </div>
              </div>

              {/* 2 — Product swap */}
              <div className="ad-lift" style={{ ...CARD, padding: 22 }}>
                <SectionHead n="02 · Product Swap" title="Rework the Active Six" sub="Ten products exist in the catalog; only six can be active. Swap one out for next year — leftover stock must be cleared or discarded first." />

                {/* current six */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 8, padding: '0 12px', fontFamily: F, fontSize: 10.5, fontWeight: 600, color: 'var(--game-text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  <span>Product (pick one to retire)</span><span style={{ textAlign: 'right' }}>Revenue/mo</span><span style={{ textAlign: 'right' }}>Margin</span><span style={{ textAlign: 'right' }}>Waste</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
                  {stats.map((p) => {
                    const on = swap?.remove === p.id;
                    const isWeakest = p.id === weakest.id;
                    return (
                      <button key={p.id} onClick={() => setValue({ productSwap: on ? null : { remove: p.id, add: swap?.add ?? benchProducts[0].id, stockDisposal: swap?.stockDisposal ?? 'clearance' } })}
                        className="ad-card-btn" data-on={on} style={{
                          display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 8, alignItems: 'center',
                          background: on ? 'var(--cyan-tint)' : '#fff', border: on ? '1.4px solid var(--game-cyan)' : '1px solid var(--sv-border)',
                          borderRadius: 12, padding: '9px 12px', cursor: 'pointer', textAlign: 'left',
                        }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ width: 15, height: 15, borderRadius: '50%', flexShrink: 0, border: on ? 'none' : '2px solid var(--sv-border)', background: on ? 'var(--game-cyan)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {on && <Check size={8} color="#fff" />}
                          </span>
                          <span style={{ fontFamily: F, fontWeight: 700, fontSize: 12.5, color: 'var(--game-text)' }}>{p.name}</span>
                          {isWeakest && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: F, fontWeight: 700, fontSize: 9.5, color: 'var(--game-warning)', background: 'color-mix(in srgb, var(--game-warning) 10%, transparent)', borderRadius: 999, padding: '2px 7px' }}>
                              <AlertTriangle size={9} color="var(--game-warning)" />WEAKEST
                            </span>
                          )}
                        </span>
                        <span style={{ textAlign: 'right', fontFamily: F, fontWeight: 600, fontSize: 12.5, color: 'var(--game-text)', fontVariantNumeric: 'tabular-nums' }}>${p.revenue.toLocaleString('en-US')}</span>
                        <span style={{ textAlign: 'right', fontFamily: F, fontWeight: 600, fontSize: 12.5, color: 'var(--game-text)', fontVariantNumeric: 'tabular-nums' }}>{p.marginPct}%</span>
                        <span style={{ textAlign: 'right', fontFamily: F, fontWeight: 600, fontSize: 12.5, color: p.wasted > 200 ? 'var(--game-warning)' : 'var(--game-text-secondary)', fontVariantNumeric: 'tabular-nums' }}>{p.wasted} u</span>
                      </button>
                    );
                  })}
                </div>

                {swap && (
                  <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {/* replacement picker */}
                    <div>
                      <div style={{ fontFamily: F, fontWeight: 600, fontSize: 11, color: 'var(--game-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 6 }}>Replace with</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {benchProducts.map((p) => {
                          const on = swap.add === p.id;
                          return (
                            <button key={p.id} onClick={() => setValue({ productSwap: { ...swap, add: p.id } })} className="ad-card-btn" data-on={on} style={{
                              display: 'flex', alignItems: 'center', gap: 9, background: on ? 'var(--cyan-tint)' : '#fff',
                              border: on ? '1.4px solid var(--game-cyan)' : '1px solid var(--sv-border)', borderRadius: 10, padding: '8px 11px', cursor: 'pointer', textAlign: 'left',
                            }}>
                              <Box size={14} color="var(--game-teal-mid)" />
                              <span style={{ flex: 1, fontFamily: F, fontWeight: 600, fontSize: 12.5, color: 'var(--game-text)' }}>{p.name}</span>
                              <span style={{ fontFamily: F, fontWeight: 500, fontSize: 11, color: 'var(--game-text-secondary)', fontVariantNumeric: 'tabular-nums' }}>ref ${p.refPrice.toFixed(2)}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    {/* disposal */}
                    <div>
                      <div style={{ fontFamily: F, fontWeight: 600, fontSize: 11, color: 'var(--game-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 6 }}>Leftover stock</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {([
                          { id: 'clearance' as const, name: 'Clearance Sale', desc: 'Recover ~40% of stock value before the swap.' },
                          { id: 'discard' as const, name: 'Discard', desc: 'Full write-off — fastest, most expensive.' },
                        ]).map((opt) => {
                          const on = swap.stockDisposal === opt.id;
                          return (
                            <button key={opt.id} onClick={() => setValue({ productSwap: { ...swap, stockDisposal: opt.id } })} className="ad-card-btn" data-on={on} style={{
                              display: 'flex', alignItems: 'flex-start', gap: 9, background: on ? 'var(--cyan-tint)' : '#fff',
                              border: on ? '1.4px solid var(--game-cyan)' : '1px solid var(--sv-border)', borderRadius: 10, padding: '9px 11px', cursor: 'pointer', textAlign: 'left',
                            }}>
                              <span style={{ marginTop: 2, width: 14, height: 14, borderRadius: '50%', flexShrink: 0, border: on ? 'none' : '2px solid var(--sv-border)', background: on ? 'var(--game-cyan)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {on && <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#fff' }} />}
                              </span>
                              <span>
                                <span style={{ display: 'block', fontFamily: F, fontWeight: 700, fontSize: 12.5, color: 'var(--game-text)' }}>{opt.name}</span>
                                <span style={{ display: 'block', fontFamily: F, fontWeight: 400, fontSize: 10.5, color: 'var(--game-text-secondary)', marginTop: 2 }}>{opt.desc}</span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <div style={{ ...SUBCARD, padding: '10px 12px', marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: F, fontWeight: 500, fontSize: 11, color: 'var(--game-text-secondary)' }}>Swap cost</span>
                        <span style={{ fontFamily: F, fontWeight: 800, fontSize: 14, color: 'var(--game-warning)', fontVariantNumeric: 'tabular-nums' }}>-${swapWriteOff.toLocaleString('en-US')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3 — VC offer */}
              <div className="ad-lift" style={{ ...CARD, padding: 22 }}>
                <SectionHead n="03 · Funding" title="VC Share Swap / Dilution" sub="Trade ownership for capital at this year's valuation. Cash arrives now; founder value and control shrink permanently." />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div style={{ ...SUBCARD, padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
                      <Landmark size={16} color="var(--game-teal-mid)" />
                      <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13.5, color: 'var(--game-text)' }}>Series A Offer</span>
                    </div>
                    <div style={{ fontFamily: F, fontWeight: 400, fontSize: 11.5, color: 'var(--game-text-secondary)', lineHeight: 1.5 }}>
                      Company valued at <strong style={{ color: 'var(--game-text)' }}>${provisionalValue.toLocaleString('en-US')}</strong> on this year&apos;s performance.
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
                      <StepBtn dir="dec" onClick={() => setValue({ vc: { ...value.vc, dilutionPct: Math.max(5, value.vc.dilutionPct - 5) } })} />
                      <div style={{ flex: 1, height: 38, borderRadius: 999, border: '1px solid var(--sv-border)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F, fontWeight: 800, fontSize: 15, color: 'var(--game-text)', fontVariantNumeric: 'tabular-nums' }}>
                        {value.vc.dilutionPct}%<span style={{ fontWeight: 500, fontSize: 11, color: 'var(--game-text-secondary)', marginLeft: 5 }}>dilution</span>
                      </div>
                      <StepBtn dir="inc" onClick={() => setValue({ vc: { ...value.vc, dilutionPct: Math.min(40, value.vc.dilutionPct + 5) } })} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                      <span style={{ fontFamily: F, fontWeight: 500, fontSize: 11.5, color: 'var(--game-text-secondary)' }}>Raise amount</span>
                      <span style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: 'var(--game-positive)', fontVariantNumeric: 'tabular-nums' }}>
                        +${Math.round(provisionalValue * (value.vc.dilutionPct / 100)).toLocaleString('en-US')}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                      {([{ accept: false, label: 'Decline' }, { accept: true, label: 'Accept Offer' }]).map((opt) => {
                        const on = value.vc.accept === opt.accept;
                        return (
                          <button key={opt.label} onClick={() => setValue({ vc: { ...value.vc, accept: opt.accept } })} className="ad-card-btn" data-on={on} style={{
                            flex: 1, padding: '9px 0', borderRadius: 999, cursor: 'pointer', fontFamily: F, fontWeight: 700, fontSize: 12.5,
                            border: on ? '1.4px solid var(--game-cyan)' : '1px solid var(--sv-border)',
                            background: on ? 'var(--cyan-tint)' : '#fff', color: on ? 'var(--game-teal-mid)' : 'var(--game-text-secondary)',
                          }}>{opt.label}</button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ownership preview */}
                  <div style={{ ...SUBCARD, padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
                      <Scale size={16} color="var(--game-teal-mid)" />
                      <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13.5, color: 'var(--game-text)' }}>Ownership Impact</span>
                    </div>
                    {[
                      { label: 'Founder today', pct: ownershipPct, color: 'var(--game-cyan)' },
                      { label: 'Founder after', pct: ownershipAfter, color: ownershipAfter < ownershipPct ? 'var(--game-warning)' : 'var(--game-cyan)' },
                    ].map((row) => (
                      <div key={row.label} style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: F, fontSize: 11.5, marginBottom: 5 }}>
                          <span style={{ fontWeight: 500, color: 'var(--game-text-secondary)' }}>{row.label}</span>
                          <span style={{ fontWeight: 800, color: 'var(--game-text)', fontVariantNumeric: 'tabular-nums' }}>{row.pct}%</span>
                        </div>
                        <div style={{ height: 8, borderRadius: 999, background: 'var(--muted)', overflow: 'hidden' }}>
                          <div style={{ width: `${row.pct}%`, height: '100%', borderRadius: 999, background: row.color }} />
                        </div>
                      </div>
                    ))}
                    <div style={{ fontFamily: F, fontWeight: 400, fontSize: 11, color: 'var(--game-text-secondary)', lineHeight: 1.5, marginTop: 4 }}>
                      Owner valuation = company valuation × ownership. Dilution only pays off if the cash grows the company faster than the share you gave up.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right rail — summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="ad-lift" style={{ ...CARD, padding: 22 }}>
                <h3 style={{ fontFamily: F, fontWeight: 700, fontSize: 15, color: 'var(--game-text)', display: 'flex', alignItems: 'center', gap: 7 }}>
                  <TrendingUp size={15} color="var(--game-teal-mid)" />Annual Summary
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
                  <Stat label="Cash After Decisions" value={`$${cashAfter.toLocaleString('en-US')}`} valueColor={cashAfter < 50000 ? 'var(--game-negative)' : undefined} />
                  <Stat label="Founder Ownership After" value={`${ownershipAfter}%`} valueColor={ownershipAfter < 60 ? 'var(--game-warning)' : undefined} />
                  <Stat label="Footprint After" value={`${(currentSqft + value.extensionSqft).toLocaleString('en-US')} sq ft`} />
                </div>
                <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { Icon: Box, text: value.extensionSqft > 0 ? `Extend +${value.extensionSqft} sq ft for $${extensionCost.toLocaleString('en-US')}` : 'No extension this year' },
                    { Icon: Package, text: swap ? `Swap ${productById(swap.remove).name} → ${productById(swap.add).name} (${swap.stockDisposal})` : 'Keep the current active six' },
                    { Icon: Users, text: value.vc.accept ? `Raise $${raiseAmount.toLocaleString('en-US')} for ${value.vc.dilutionPct}% equity` : 'Decline VC offer — keep full ownership' },
                  ].map(({ Icon, text }, i) => (
                    <div key={i} style={{ ...SUBCARD, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Icon size={14} color="var(--game-teal-mid)" />
                      <span style={{ fontFamily: F, fontWeight: 600, fontSize: 12, color: 'var(--game-text)', lineHeight: 1.4 }}>{text}</span>
                    </div>
                  ))}
                </div>
                {!demo && (
                  <div style={{ marginTop: 16 }}>
                    <GameButton>Submit Annual Decisions</GameButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </GridBackground>
  );
}
