'use client';

import React, { useState } from 'react';
import { GridBackground } from './GridBackground';
import { GameHeader } from './GameHeader';
import { PageTransition } from './PageTransition';
import { GameButton } from './GameButton';
import {
  Heart, Star, Flask, Package, Megaphone, Settings, Wallet, Activity, TrendingUp, Check,
} from './PixelIcons';
import type { QuarterlyDecisionsInput, QuarterlyInitiativeId } from '../lib/demo/demo-types';
import { QUARTERLY_INITIATIVES, MAX_INITIATIVES_PER_QUARTER } from '../lib/demo/sim-engine';

const F = "'Outfit', sans-serif";

const CARD: React.CSSProperties = {
  background: 'var(--game-surface)', border: 'var(--game-card-border)', borderRadius: 16, boxShadow: 'var(--shadow-elev-1)',
};
const SUBCARD: React.CSSProperties = {
  background: 'var(--game-surface-solid)', border: '1px solid var(--sv-border)', borderRadius: 12,
};

const QD_CSS = `
.qd-card-btn{transition:border-color .15s ease, box-shadow .15s ease, background .15s ease, transform .1s ease;}
.qd-card-btn:not([data-on="true"]):hover{border-color:color-mix(in srgb, var(--game-cyan) 45%, var(--sv-border));background:color-mix(in srgb, var(--game-cyan) 5%, #fff);}
.qd-card-btn:active{transform:translateY(1px);}
.qd-lift{transition:transform .2s cubic-bezier(.22,1,.36,1), box-shadow .2s ease;}
.qd-lift:hover{transform:translateY(-3px);box-shadow:0 16px 36px rgba(0,44,51,0.13);}
`;

type IconCmp = React.ComponentType<{ size?: number; color?: string }>;

const INITIATIVE_META: Record<QuarterlyInitiativeId, { Icon: IconCmp; desc: string; area: string }> = {
  employeeInvestment: { Icon: Heart, desc: 'Raise compensation and working conditions. Stabilizes the workforce and lifts retention over the coming months.', area: 'People' },
  training: { Icon: Star, desc: 'Structured training program. Improves service consistency and customer experience quality.', area: 'People' },
  rnd: { Icon: Flask, desc: 'Long-term business learning. Lifts demand and trims product cost through better decisions.', area: 'Growth' },
  supplierRelationship: { Icon: Package, desc: 'Invest in supplier terms. Less waste and phantom loss, smoother purchasing.', area: 'Efficiency' },
  acquisitionPush: { Icon: Megaphone, desc: 'A stronger-than-normal commercial drive, above regular monthly marketing.', area: 'Growth' },
  opsOptimization: { Icon: Settings, desc: 'Backend discipline: process fixes that reduce shadow loss and avoidable inefficiency.', area: 'Efficiency' },
};

export interface QuarterlyDecisionsDemo {
  value: QuarterlyDecisionsInput;
  onChange: (patch: Partial<QuarterlyDecisionsInput>) => void;
  cash: number;
  quarter: number;
}

const EMPTY_SELECTION: QuarterlyDecisionsInput = {
  employeeInvestment: false, training: false, rnd: false,
  supplierRelationship: false, acquisitionPush: false, opsOptimization: false,
};

export function QuarterlyDecisions({ demo }: { demo?: QuarterlyDecisionsDemo } = {}) {
  const [local, setLocal] = useState<QuarterlyDecisionsInput>({ ...EMPTY_SELECTION, training: true, acquisitionPush: true });
  const value = demo?.value ?? local;
  const cash = demo?.cash ?? 412500;
  const quarter = demo?.quarter ?? 1;

  const selected = QUARTERLY_INITIATIVES.filter((i) => value[i.id]);
  const totalCost = selected.reduce((s, i) => s + i.cost, 0);
  const cashAfter = cash - totalCost;

  function toggle(id: QuarterlyInitiativeId) {
    const turningOn = !value[id];
    if (turningOn && selected.length >= MAX_INITIATIVES_PER_QUARTER) return;
    const init = QUARTERLY_INITIATIVES.find((i) => i.id === id)!;
    if (turningOn && cashAfter - init.cost < 0) return;
    const patch = { [id]: turningOn } as Partial<QuarterlyDecisionsInput>;
    if (demo) demo.onChange(patch);
    else setLocal((s) => ({ ...s, ...patch }));
  }

  return (
    <GridBackground>
      <style>{QD_CSS}</style>
      <PageTransition>
        <GameHeader />
        <div style={{ maxWidth: 'var(--max-w-page)', margin: '0 auto', padding: '8px 24px 48px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
            <div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--cyan-tint)', color: 'var(--game-teal-mid)', borderRadius: 999, padding: '4px 11px', fontFamily: F, fontWeight: 700, fontSize: 11, letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                Quarter {quarter} · Strategic Decisions
              </span>
              <h1 style={{ fontFamily: F, fontWeight: 800, fontSize: 26, letterSpacing: '-0.5px', color: 'var(--game-text)', marginTop: 10 }}>
                Strengthen the Business Engine
              </h1>
              <p style={{ fontFamily: F, fontWeight: 400, fontSize: 13.5, color: 'var(--game-text-secondary)', marginTop: 4, maxWidth: 560 }}>
                Quarterly moves are fewer than monthly decisions but heavier in effect — they bend the next three months, not just this one. Pick up to {MAX_INITIATIVES_PER_QUARTER}.
              </p>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--cyan-tint)', color: 'var(--game-teal-mid)', borderRadius: 999, padding: '6px 12px', fontFamily: F, fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap', flexShrink: 0 }}>
              <Wallet size={13} color="var(--game-teal-mid)" />Cash $ {cash.toLocaleString('en-US')}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 400px', gap: 18, alignItems: 'start' }}>
            {/* Left — initiative cards */}
            <div className="qd-lift" style={{ ...CARD, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 18, letterSpacing: '-0.3px', color: 'var(--game-text)' }}>Quarterly Initiatives</h2>
                <span style={{ fontFamily: F, fontWeight: 700, fontSize: 12, color: selected.length >= MAX_INITIATIVES_PER_QUARTER ? 'var(--game-warning)' : 'var(--game-text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                  {selected.length} / {MAX_INITIATIVES_PER_QUARTER} selected
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                {QUARTERLY_INITIATIVES.map((init) => {
                  const meta = INITIATIVE_META[init.id];
                  const on = value[init.id];
                  const blocked = !on && (selected.length >= MAX_INITIATIVES_PER_QUARTER || cashAfter - init.cost < 0);
                  return (
                    <button key={init.id} onClick={() => toggle(init.id)} className="qd-card-btn" data-on={on} style={{
                      ...SUBCARD, border: on ? '1.4px solid var(--game-cyan)' : '1px solid var(--sv-border)',
                      boxShadow: on ? 'var(--shadow-elev-3)' : 'none', background: on ? 'var(--cyan-tint)' : '#fff',
                      padding: 16, textAlign: 'left', cursor: blocked ? 'not-allowed' : 'pointer', opacity: blocked ? 0.55 : 1,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                        <span style={{ width: 36, height: 36, borderRadius: 10, background: on ? '#fff' : 'var(--cyan-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <meta.Icon size={18} color="var(--game-teal-mid)" />
                        </span>
                        <span style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0, border: on ? 'none' : '2px solid var(--sv-border)', background: on ? 'var(--game-cyan)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {on && <Check size={9} color="#fff" />}
                        </span>
                      </div>
                      <div style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: 'var(--game-text)', marginTop: 10 }}>{init.name}</div>
                      <div style={{ fontFamily: F, fontWeight: 400, fontSize: 11.5, color: 'var(--game-text-secondary)', marginTop: 4, lineHeight: 1.45, minHeight: 48 }}>{meta.desc}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 12 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'var(--cyan-tint)', color: 'var(--game-teal-mid)', borderRadius: 999, padding: '3px 9px', fontFamily: F, fontWeight: 600, fontSize: 10.5 }}>
                          {init.effectLabel}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                        <span style={{ fontFamily: F, fontWeight: 500, fontSize: 11, color: 'var(--game-text-muted)' }}>{meta.area}</span>
                        <span style={{ fontFamily: F, fontWeight: 800, fontSize: 14, color: 'var(--game-text)', fontVariantNumeric: 'tabular-nums' }}>${init.cost.toLocaleString('en-US')}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right — preview rail */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="qd-lift" style={{ ...CARD, padding: 22 }}>
                <h3 style={{ fontFamily: F, fontWeight: 700, fontSize: 15, color: 'var(--game-text)', display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Activity size={15} color="var(--game-teal-mid)" />Quarter Preview
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
                  <div style={{ ...SUBCARD, padding: '12px 14px' }}>
                    <div style={{ fontFamily: F, fontWeight: 500, fontSize: 11, color: 'var(--game-text-secondary)' }}>Total Cost</div>
                    <div style={{ fontFamily: F, fontWeight: 800, fontSize: 18, color: 'var(--game-text)', fontVariantNumeric: 'tabular-nums', marginTop: 4 }}>${totalCost.toLocaleString('en-US')}</div>
                  </div>
                  <div style={{ ...SUBCARD, padding: '12px 14px' }}>
                    <div style={{ fontFamily: F, fontWeight: 500, fontSize: 11, color: 'var(--game-text-secondary)' }}>Cash After</div>
                    <div style={{ fontFamily: F, fontWeight: 800, fontSize: 18, color: cashAfter < 50000 ? 'var(--game-warning)' : 'var(--game-text)', fontVariantNumeric: 'tabular-nums', marginTop: 4 }}>${cashAfter.toLocaleString('en-US')}</div>
                  </div>
                </div>
                <p style={{ fontFamily: F, fontWeight: 400, fontSize: 11.5, color: 'var(--game-text-secondary)', marginTop: 12, lineHeight: 1.5 }}>
                  Effects apply from next month and compound through the rest of the year.
                </p>
              </div>

              <div className="qd-lift" style={{ ...CARD, padding: 22 }}>
                <h3 style={{ fontFamily: F, fontWeight: 700, fontSize: 15, color: 'var(--game-text)', display: 'flex', alignItems: 'center', gap: 7 }}>
                  <TrendingUp size={15} color="var(--game-teal-mid)" />Review &amp; Submit
                </h3>
                {selected.length === 0 ? (
                  <p style={{ fontFamily: F, fontWeight: 400, fontSize: 12.5, color: 'var(--game-text-secondary)', marginTop: 12, lineHeight: 1.5 }}>
                    No initiatives selected. Skipping a quarter conserves cash — but rivals keep building.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                    {selected.map((init) => {
                      const meta = INITIATIVE_META[init.id];
                      return (
                        <div key={init.id} style={{ ...SUBCARD, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                          <meta.Icon size={15} color="var(--game-teal-mid)" />
                          <span style={{ flex: 1, fontFamily: F, fontWeight: 600, fontSize: 12.5, color: 'var(--game-text)' }}>{init.name}</span>
                          <span style={{ fontFamily: F, fontWeight: 700, fontSize: 12.5, color: 'var(--game-text)', fontVariantNumeric: 'tabular-nums' }}>${init.cost.toLocaleString('en-US')}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                {!demo && (
                  <div style={{ marginTop: 16 }}>
                    <GameButton>Lock Quarterly Decisions</GameButton>
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
