'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Megaphone, Package, DollarSign, Settings, Truck, Landmark, Check, ChevronRight, BarChart3 } from '../PixelIcons';
import { SimStudentShell, DeckCard } from './SimShell';
import { useSim, DECISION_AREAS, AreaId, TOTAL_BUDGET, DecisionDraft } from '../../context/SimContext';
import { TabRationale } from './RationaleCapture';
import { Eyebrow, CtaButton, OutlineButton, DISPLAY, DATA, ink, body, muted, faint, cyan, tealMid, success, warning, cyanTint, whisper } from './sim-ui';

const AREA_ICON: Record<AreaId, React.ComponentType<{ size?: number; color?: string }>> = {
  marketing: Megaphone, product: Package, pricing: DollarSign, operations: Settings, supply: Truck, finance: Landmark,
};

export function SimDecisionModules() {
  const router = useRouter();
  const { decision, patchDecision, tabRationale, patchTabRationale } = useSim();
  const [area, setArea] = useState<AreaId>('marketing');

  const remaining = TOTAL_BUDGET - decision.adSpend;
  const idx = DECISION_AREAS.findIndex((a) => a.id === area);
  const capturedCount = DECISION_AREAS.filter((a) => (tabRationale[a.id]?.transcript ?? '').trim().length > 0).length;
  const areaLabel = DECISION_AREAS[idx].label;
  const nextArea = () => setArea(DECISION_AREAS[(idx + 1) % DECISION_AREAS.length].id);

  return (
    <SimStudentShell>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 26, color: ink, letterSpacing: '-0.5px' }}>Decision Input</h1>
          <p style={{ fontFamily: DISPLAY, fontSize: 14, color: muted, marginTop: 5 }}>Set your strategy for Round 2 — record or type your reasoning on each area.</p>
        </div>
        <DeckCard style={{ padding: '12px 18px' }}>
          <div style={{ fontFamily: DATA, fontSize: 11.5, color: faint }}>Budget available</div>
          <div style={{ fontFamily: DATA, fontWeight: 800, fontSize: 22, color: remaining < 0 ? warning : ink, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.5px' }}>${Math.abs(remaining).toLocaleString()}{remaining < 0 && ' over'}</div>
        </DeckCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px minmax(0,1fr)', gap: 18, alignItems: 'start' }}>
        {/* Area list */}
        <DeckCard style={{ padding: 10, position: 'sticky', top: 84 }}>
          {DECISION_AREAS.map((a) => {
            const on = a.id === area;
            const Icon = AREA_ICON[a.id];
            const has = (tabRationale[a.id]?.transcript ?? '').trim().length > 0;
            return (
              <button key={a.id} onClick={() => setArea(a.id)} style={{
                display: 'flex', alignItems: 'center', gap: 11, width: '100%', textAlign: 'left', padding: '11px 12px',
                fontFamily: DISPLAY, fontWeight: on ? 700 : 500, fontSize: 14, color: on ? tealMid : body,
                background: on ? cyanTint : 'transparent', border: 'none', borderRadius: 10, cursor: 'pointer', marginBottom: 2,
              }}>
                <Icon size={17} color={on ? tealMid : faint} />
                <span style={{ flex: 1 }}>{a.label}</span>
                {has && <Check size={15} color={success} />}
              </button>
            );
          })}
        </DeckCard>

        {/* Active area editor */}
        <div>
          <DeckCard style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              {React.createElement(AREA_ICON[area], { size: 20, color: tealMid })}
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 20, color: ink, letterSpacing: '-0.4px' }}>Decision area: {areaLabel}</h2>
            </div>

            <AreaEditor area={area} decision={decision} patch={patchDecision} />
          </DeckCard>

          {/* Per-area voice/type rationale */}
          <TabRationale tabLabel={areaLabel} value={tabRationale[area]} onChange={(p) => patchTabRationale(area, p)} />

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginTop: 18, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: DATA, fontSize: 13, color: muted, display: 'inline-flex', alignItems: 'center', gap: 7 }}>
              <Check size={15} color={capturedCount > 0 ? success : faint} /> {capturedCount} / {DECISION_AREAS.length} areas explained
            </span>
            <div style={{ display: 'flex', gap: 10 }}>
              <OutlineButton onClick={nextArea}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>Save &amp; next area <ChevronRight size={15} /></span></OutlineButton>
              <CtaButton onClick={() => router.push('/sim/play/rationale')}>Review &amp; submit</CtaButton>
            </div>
          </div>
        </div>
      </div>
    </SimStudentShell>
  );
}

function AreaEditor({ area, decision, patch }: { area: AreaId; decision: DecisionDraft; patch: (p: Partial<DecisionDraft>) => void }) {
  if (area === 'marketing') {
    const channels = decision.channels;
    const total = channels.digital + channels.social + channels.tv + channels.events;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Slider label="Advertising spend" value={decision.adSpend} min={0} max={1_000_000} step={10_000} display={`$${decision.adSpend.toLocaleString()}`} onChange={(v) => patch({ adSpend: v })} note="Choose how much to invest in advertising this round." />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <FieldLabel>Campaign focus</FieldLabel>
            <span style={{ fontFamily: DATA, fontSize: 12.5, fontWeight: 700, color: total === 100 ? success : warning }}>Total {total}%</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
            {(['digital', 'social', 'tv', 'events'] as const).map((k) => (
              <div key={k} style={{ background: '#F7FAFB', border: '1px solid ' + whisper, borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontFamily: DATA, fontSize: 13, color: body, textTransform: 'capitalize' }}>{k === 'tv' ? 'TV / Streaming' : k}</span>
                  <span style={{ fontFamily: DATA, fontWeight: 700, fontSize: 14, color: ink, fontVariantNumeric: 'tabular-nums' }}>{channels[k]}%</span>
                </div>
                <input type="range" min={0} max={100} step={5} value={channels[k]} onChange={(e) => patch({ channels: { ...channels, [k]: Number(e.target.value) } })} style={{ width: '100%', accentColor: cyan }} />
              </div>
            ))}
          </div>
        </div>
        <OutlineButton><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><BarChart3 size={15} /> View market data</span></OutlineButton>
      </div>
    );
  }
  if (area === 'product') return <Options label="Product line focus" options={['Value', 'Core', 'Premium Eco']} value={decision.productTier} onChange={(v) => patch({ productTier: v as DecisionDraft['productTier'] })} subs={{ Value: 'Lowest cost, price-led', Core: 'Balanced quality + margin', 'Premium Eco': 'Sustainable, higher margin' }} />;
  if (area === 'pricing') return <Slider label="Unit price" value={decision.price} min={19.99} max={119.99} step={1} display={`$${decision.price.toFixed(2)}`} onChange={(v) => patch({ price: v })} note="Price influences demand and margin." />;
  if (area === 'operations') return <Options label="Operations mode" options={['Balanced', 'High Efficiency', 'Max Output']} value={decision.operations} onChange={(v) => patch({ operations: v as DecisionDraft['operations'] })} subs={{ Balanced: 'Steady cost + capacity', 'High Efficiency': 'Lower cost per unit', 'Max Output': 'Highest capacity, higher cost' }} />;
  if (area === 'supply') return <Options label="Supply chain stance" options={['Lean', 'Balanced', 'Resilient']} value={decision.supply} onChange={(v) => patch({ supply: v as DecisionDraft['supply'] })} subs={{ Lean: 'Minimal inventory, more risk', Balanced: 'Moderate buffer', Resilient: 'High buffer, more cost' }} />;
  return <Options label="Finance stance" options={['Conservative', 'Balanced', 'Aggressive']} value={decision.finance} onChange={(v) => patch({ finance: v as DecisionDraft['finance'] })} subs={{ Conservative: 'Low leverage, safe', Balanced: 'Moderate financing', Aggressive: 'High leverage for growth' }} />;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontFamily: DATA, fontSize: 13, fontWeight: 600, color: muted }}>{children}</div>;
}

function Slider({ label, value, min, max, step, display, onChange, note }: { label: string; value: number; min: number; max: number; step: number; display: string; onChange: (v: number) => void; note?: string }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <FieldLabel>{label}</FieldLabel>
        <span style={{ fontFamily: DATA, fontSize: 18, fontWeight: 800, color: ink, fontVariantNumeric: 'tabular-nums' }}>{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ width: '100%', accentColor: cyan, height: 6 }} />
      {note && <div style={{ fontFamily: DATA, fontSize: 12, color: faint, marginTop: 6 }}>{note}</div>}
    </div>
  );
}

function Options({ label, options, value, onChange, subs }: { label: string; options: string[]; value: string; onChange: (v: string) => void; subs: Record<string, string> }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${options.length}, 1fr)`, gap: 12, marginTop: 12 }}>
        {options.map((o) => {
          const on = o === value;
          return (
            <button key={o} onClick={() => onChange(o)} style={{ textAlign: 'left', background: on ? cyanTint : '#fff', border: '1.4px solid ' + (on ? cyan : whisper), borderRadius: 12, padding: 16, cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                {on && <span style={{ width: 7, height: 7, borderRadius: '50%', background: cyan }} />}
                <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 14.5, color: ink }}>{o}</span>
              </div>
              <div style={{ fontFamily: DATA, fontSize: 12, color: muted, marginTop: 5, lineHeight: 1.4 }}>{subs[o]}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
