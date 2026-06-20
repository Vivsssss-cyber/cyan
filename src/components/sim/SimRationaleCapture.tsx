'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Check as CheckCircle2, Megaphone, Package, DollarSign, Settings, Truck, Landmark, Pencil, Mic, Type as Keyboard,
} from '../PixelIcons';
import { SimStudentShell, DeckCard } from './SimShell';
import { useSim, DECISION_AREAS, AreaId, areaSummary } from '../../context/SimContext';
import { VoiceRecorder } from './RationaleCapture';
import { Eyebrow, CtaButton, GhostButton, DISPLAY, DATA, ink, body, muted, faint, cyan, tealMid, success, warning, cyanTint, whisper } from './sim-ui';

const AREA_ICON: Record<AreaId, React.ComponentType<{ size?: number; color?: string }>> = {
  marketing: Megaphone, product: Package, pricing: DollarSign, operations: Settings, supply: Truck, finance: Landmark,
};

export function SimRationaleCapture() {
  const router = useRouter();
  const { decision, rationale, patchRationale, tabRationale, scenario } = useSim();

  if (rationale.submitted) return <Confirmation onDash={() => router.push('/sim/play')} />;

  const canSubmit = rationale.confidence > 0;
  const [voiceMode, setVoiceMode] = React.useState(true);

  return (
    <SimStudentShell>
      <h1 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 26, color: ink, letterSpacing: '-0.5px' }}>Review &amp; submit</h1>
      <p style={{ fontFamily: DISPLAY, fontSize: 14.5, color: muted, marginTop: 5, marginBottom: 20 }}>
        Round 2 · {scenario?.title ?? 'Cyan Global Challenge'} — check your decisions, capture the reasoning, then lock in.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.6fr) 320px', gap: 18, alignItems: 'start' }}>
        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* ① Review decisions */}
          <DeckCard style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #E7EEF1' }}>
              <Eyebrow>Your decisions</Eyebrow>
              <button onClick={() => router.push('/sim/play/decide')} style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 13, color: tealMid, background: 'none', border: 'none', cursor: 'pointer' }}>Edit all</button>
            </div>
            {DECISION_AREAS.map((a, i) => {
              const Icon = AREA_ICON[a.id];
              const r = tabRationale[a.id];
              const has = (r?.transcript ?? '').trim().length > 0;
              return (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 20px', borderBottom: i < DECISION_AREAS.length - 1 ? '1px solid #EEF3F5' : 'none' }}>
                  <span style={{ width: 34, height: 34, borderRadius: 9, background: cyanTint, color: tealMid, display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon size={17} /></span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, color: ink }}>{a.label}</div>
                    <div style={{ fontFamily: DATA, fontSize: 12.5, color: muted, fontVariantNumeric: 'tabular-nums' }}>{areaSummary(decision, a.id)}</div>
                  </div>
                  {has && <span style={{ fontFamily: DATA, fontSize: 11, fontWeight: 700, color: success, background: '#E5F2E8', borderRadius: 999, padding: '2px 9px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>{r!.method === 'voice' ? 'voice' : 'typed'}</span>}
                  <button onClick={() => router.push('/sim/play/decide')} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: DISPLAY, fontWeight: 600, fontSize: 12.5, color: tealMid, background: 'none', border: 'none', cursor: 'pointer' }}><Pencil size={13} /> Edit</button>
                </div>
              );
            })}
          </DeckCard>

          {/* ② Strategy rationale */}
          <DeckCard style={{ padding: 22 }}>
            <Eyebrow>Strategy rationale</Eyebrow>
            <p style={{ fontFamily: DATA, fontSize: 12.5, color: faint, marginTop: 4 }}>Explain the strategy behind your decisions.</p>
            <textarea
              value={rationale.transcript}
              onChange={(e) => patchRationale({ transcript: e.target.value.slice(0, 1000) })}
              placeholder="We increased marketing to build brand awareness and reduced price slightly to gain share in a price-sensitive segment…"
              style={{ width: '100%', minHeight: 110, marginTop: 12, fontFamily: DATA, fontSize: 14.5, lineHeight: 1.6, color: ink, background: '#F0F6FA', border: '1px solid ' + whisper, borderRadius: 8, padding: 14, resize: 'vertical' }}
            />
            <div style={{ fontFamily: DATA, fontSize: 11.5, color: faint, marginTop: 6, textAlign: 'right' }}>{rationale.transcript.length} / 1000 characters</div>
          </DeckCard>

          {/* ③ Voice rationale */}
          <DeckCard style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Eyebrow>Voice rationale</Eyebrow>
              <div style={{ display: 'inline-flex', background: '#F0F6FA', border: '1px solid ' + whisper, borderRadius: 999, padding: 3 }}>
                {([['voice', 'Voice', Mic], ['text', 'Type', Keyboard]] as const).map(([m, lbl, Ic]) => {
                  const on = (m === 'voice') === voiceMode;
                  return <button key={m} onClick={() => setVoiceMode(m === 'voice')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: DATA, fontSize: 12.5, fontWeight: 600, padding: '6px 13px', borderRadius: 999, border: 'none', cursor: 'pointer', background: on ? cyan : 'transparent', color: on ? '#fff' : muted }}><Ic size={13} />{lbl}</button>;
                })}
              </div>
            </div>
            {voiceMode ? (
              <VoiceRecorder transcript={rationale.voice} onTranscript={(t) => patchRationale({ voice: t })} />
            ) : (
              <textarea value={rationale.voice} onChange={(e) => patchRationale({ voice: e.target.value })} placeholder="Type your spoken rationale instead…"
                style={{ width: '100%', minHeight: 90, marginTop: 12, fontFamily: DATA, fontSize: 14.5, lineHeight: 1.6, color: ink, background: '#F0F6FA', border: '1px solid ' + whisper, borderRadius: 8, padding: 14, resize: 'vertical' }} />
            )}
          </DeckCard>

          {/* ④ Assumptions */}
          <DeckCard style={{ padding: 22 }}>
            <Eyebrow>Assumption log</Eyebrow>
            <p style={{ fontFamily: DATA, fontSize: 12.5, color: faint, marginTop: 4 }}>List the key assumptions that guided your decisions.</p>
            <textarea
              value={rationale.assumptions}
              onChange={(e) => patchRationale({ assumptions: e.target.value })}
              placeholder="e.g. lowering price increases trial without hurting margins; the target segment is highly price-sensitive…"
              style={{ width: '100%', minHeight: 90, marginTop: 12, fontFamily: DATA, fontSize: 14.5, lineHeight: 1.6, color: ink, background: '#F0F6FA', border: '1px solid ' + whisper, borderRadius: 8, padding: 14, resize: 'vertical' }}
            />
          </DeckCard>
        </div>

        {/* RIGHT */}
        <div style={{ position: 'sticky', top: 84, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <DeckCard style={{ padding: 22 }}>
            <Eyebrow>Confidence rating</Eyebrow>
            <p style={{ fontFamily: DATA, fontSize: 12.5, color: faint, marginTop: 4 }}>How confident are you this round?</p>
            <ConfidenceDial value={rationale.confidence} onChange={(v) => patchRationale({ confidence: v })} />
            {/* 1..10 chips */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10,1fr)', gap: 4, marginTop: 14 }}>
              {Array.from({ length: 10 }).map((_, i) => {
                const n = i + 1;
                const on = rationale.confidence === n;
                return <button key={n} onClick={() => patchRationale({ confidence: n })} style={{ fontFamily: DATA, fontSize: 12, fontWeight: 700, padding: '6px 0', borderRadius: 7, border: '1px solid ' + (on ? cyan : whisper), background: on ? cyan : '#fff', color: on ? '#fff' : muted, cursor: 'pointer' }}>{n}</button>;
              })}
            </div>
          </DeckCard>

          <DeckCard style={{ padding: 20 }}>
            <Eyebrow>Team confidence</Eyebrow>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
              <div style={{ display: 'flex' }}>
                {['AJ', 'MR', 'JT', 'TK'].map((a, i) => (
                  <span key={a} style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#00C1EB,#006E85)', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: DATA, fontWeight: 700, fontSize: 11, border: '2px solid #fff', marginLeft: i ? -8 : 0 }}>{a}</span>
                ))}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: DATA, fontWeight: 800, fontSize: 20, color: success, fontVariantNumeric: 'tabular-nums' }}>4.7</div>
                <div style={{ fontFamily: DATA, fontSize: 11, color: faint }}>Great</div>
              </div>
            </div>
          </DeckCard>

          <DeckCard style={{ padding: 18 }}>
            <CtaButton full disabled={!canSubmit} reason={!canSubmit ? 'Set your confidence to submit' : undefined} onClick={() => patchRationale({ submitted: true })}>Submit decisions</CtaButton>
          </DeckCard>
        </div>
      </div>
    </SimStudentShell>
  );
}

/* ── Confidence dial (circular slider 1–10) ──────────────────────────── */
function ConfidenceDial({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const SIZE = 164, R = 64, C = 2 * Math.PI * R;
  const pct = value / 10;

  const fromEvent = (clientX: number, clientY: number) => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    let ang = (Math.atan2(clientY - cy, clientX - cx) * 180) / Math.PI + 90;
    if (ang < 0) ang += 360;
    let v = Math.round((ang / 360) * 10);
    if (v < 1) v = 1; if (v > 10) v = 10;
    onChange(v);
  };

  useEffect(() => {
    const move = (e: PointerEvent) => { if (dragging.current) fromEvent(e.clientX, e.clientY); };
    const up = () => { dragging.current = false; };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  }, []); // eslint-disable-line

  const descriptor = value === 0 ? 'Not set' : value <= 3 ? 'Unsure' : value <= 6 ? 'Fairly sure' : value <= 8 ? 'Confident' : 'Very sure';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 10 }}>
      <div
        ref={ref} role="slider" tabIndex={0} aria-valuemin={1} aria-valuemax={10} aria-valuenow={value || undefined}
        aria-valuetext={value ? `${value} of 10, ${descriptor}` : 'not set'}
        onPointerDown={(e) => { dragging.current = true; fromEvent(e.clientX, e.clientY); }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowUp' || e.key === 'ArrowRight') { e.preventDefault(); onChange(Math.min(10, (value || 0) + 1)); }
          if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') { e.preventDefault(); onChange(Math.max(1, (value || 1) - 1)); }
        }}
        style={{ width: SIZE, height: SIZE, position: 'relative', cursor: 'pointer', touchAction: 'none', outlineOffset: 4 }}
      >
        <svg width={SIZE} height={SIZE} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="#E1EAEE" strokeWidth="10" />
          <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke={cyan} strokeWidth="10" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct)} style={{ transition: 'stroke-dashoffset .15s ease' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
          <div>
            <div style={{ fontFamily: DATA, fontWeight: 800, fontSize: 36, color: value ? ink : faint, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{value || '—'}<span style={{ fontSize: 15, color: faint, fontWeight: 600 }}>/10</span></div>
            <div style={{ fontFamily: DATA, fontSize: 12, color: value ? tealMid : faint, fontWeight: 600, marginTop: 4 }}>{descriptor}</div>
          </div>
        </div>
      </div>
      <div style={{ fontFamily: DATA, fontSize: 11.5, color: faint, marginTop: 8 }}>drag the ring, tap a number, or use arrow keys</div>
    </div>
  );
}

/* ── Submission success (#65) ────────────────────────────────────────── */
function Confirmation({ onDash }: { onDash: () => void }) {
  return (
    <SimStudentShell>
      <div style={{ minHeight: '58vh', display: 'grid', placeItems: 'center' }}>
        <DeckCard style={{ padding: 40, textAlign: 'center', maxWidth: 460, width: '100%' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#E5F2E8', display: 'grid', placeItems: 'center', margin: '0 auto 18px' }}>
            <CheckCircle2 size={38} color={success} />
          </div>
          <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 26, color: ink, letterSpacing: '-0.5px' }}>Decisions submitted</h2>
          <p style={{ fontFamily: DISPLAY, fontSize: 15, color: muted, marginTop: 8 }}>Your decisions and reasoning for Round 2 are saved as learning evidence.</p>
          <div style={{ background: '#F7FAFB', borderRadius: 12, padding: 16, marginTop: 20 }}>
            <div style={{ fontFamily: DATA, fontSize: 12.5, color: faint }}>Results released in</div>
            <div style={{ fontFamily: DATA, fontWeight: 800, fontSize: 24, color: ink, fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>23:45:12</div>
          </div>
          <div style={{ marginTop: 22 }}><CtaButton full onClick={onDash}>Go to dashboard</CtaButton></div>
        </DeckCard>
      </div>
    </SimStudentShell>
  );
}
