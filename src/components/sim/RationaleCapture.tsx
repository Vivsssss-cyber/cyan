'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Mic, StopSign as Square, Type as Keyboard, RotateCcw, Check as CheckCircle2 } from '../PixelIcons';
import { DATA, ink, muted, faint, cyan, tealMid, success, warning, negative, whisper, surfaceSoft } from './sim-ui';

export const MAX_SECONDS = 90;
const CANNED =
  'We assumed demand is price-sensitive, so we leaned on this lever to defend share against the new value-segment entrant while keeping the cash balance positive.';

type RecState = 'idle' | 'recording' | 'processing' | 'done';

export function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

/* ── Voice recorder (idle → recording → processing → done) ───────────── */
export function VoiceRecorder({
  transcript, onTranscript, canned = CANNED,
}: { transcript: string; onTranscript: (t: string) => void; canned?: string }) {
  const [state, setState] = useState<RecState>(transcript ? 'done' : 'idle');
  const [secs, setSecs] = useState(0);
  const [bars, setBars] = useState<number[]>(Array(28).fill(0.2));
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = () => {
    if (tick.current) clearInterval(tick.current);
    tick.current = null;
    setState('processing');
    setTimeout(() => { onTranscript(canned); setState('done'); }, 1300);
  };
  const start = () => {
    setSecs(0);
    setState('recording');
    tick.current = setInterval(() => {
      setSecs((s) => { if (s + 1 >= MAX_SECONDS) { stop(); return MAX_SECONDS; } return s + 1; });
      setBars((b) => b.map(() => 0.2 + Math.random() * 0.8));
    }, 120);
  };
  useEffect(() => () => { if (tick.current) clearInterval(tick.current); }, []);

  const remaining = MAX_SECONDS - secs;
  const lowTime = remaining <= 10;
  const ringPct = remaining / MAX_SECONDS;

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: surfaceSoft, border: '1px solid ' + whisper, borderRadius: 12, padding: 14 }}>
        {state !== 'processing' && state !== 'done' && (
          <RecordButton recording={state === 'recording'} ringPct={ringPct} low={lowTime} onClick={state === 'recording' ? stop : start} />
        )}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2, height: 40 }}>
          {state === 'processing' ? (
            <div className="sim-shimmer" style={{ width: '100%', height: 12, borderRadius: 6 }} />
          ) : (
            bars.map((h, i) => (
              <span key={i} style={{
                flex: 1,
                height: `${(state === 'recording' ? h : state === 'done' ? 0.35 + ((i * 7) % 10) / 16 : 0.18) * 40}px`,
                background: state === 'recording' ? 'var(--game-cyan)' : state === 'done' ? 'var(--game-teal-light, #00A0C2)' : 'var(--sv-border)',
                borderRadius: 2, transition: 'height .1s linear', minHeight: 3,
              }} />
            ))
          )}
        </div>
        <span style={{ fontFamily: DATA, fontSize: 12.5, fontWeight: 700, color: lowTime && state === 'recording' ? warning : muted, fontVariantNumeric: 'tabular-nums', minWidth: 62, textAlign: 'right' }}>
          {state === 'processing' ? 'transcribing…' : `${fmtTime(state === 'idle' ? 0 : secs)} / 1:30`}
        </span>
      </div>

      {state === 'idle' && <div style={{ fontFamily: DATA, fontSize: 12.5, color: faint, marginTop: 8 }}>Tap to record — up to 90 seconds.</div>}
      {state === 'processing' && <div className="sim-shimmer" style={{ width: '100%', height: 44, borderRadius: 8, marginTop: 10 }} />}

      {state === 'done' && (
        <div style={{ marginTop: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
            <CheckCircle2 size={14} color={success} />
            <span style={{ fontFamily: DATA, fontSize: 12, fontWeight: 600, color: success }}>Captured · editable</span>
            <button onClick={() => { onTranscript(''); setState('idle'); setSecs(0); }} style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: DATA, fontWeight: 600, fontSize: 12, color: tealMid, background: 'none', border: 'none', cursor: 'pointer' }}>
              <RotateCcw size={12} /> Re-record
            </button>
          </div>
          <textarea value={transcript} onChange={(e) => onTranscript(e.target.value)}
            style={{ width: '100%', minHeight: 72, fontFamily: DATA, fontSize: 14, lineHeight: 1.6, color: ink, background: 'var(--game-surface-solid)', border: '1px solid ' + whisper, borderRadius: 8, padding: 12, resize: 'vertical' }} />
        </div>
      )}

      <style>{`
        .sim-shimmer{background:linear-gradient(90deg,var(--muted) 25%,#F4F8FA 37%,var(--muted) 63%);background-size:400% 100%;animation:simShimmer 1.3s ease infinite;}
        @keyframes simShimmer{0%{background-position:100% 0}100%{background-position:0 0}}
        @media (prefers-reduced-motion: reduce){.sim-shimmer{animation:none}}
      `}</style>
    </div>
  );
}

export function RecordButton({ recording, ringPct, low, onClick }: { recording: boolean; ringPct: number; low: boolean; onClick: () => void }) {
  const R = 22, C = 2 * Math.PI * R;
  return (
    <button onClick={onClick} style={{ position: 'relative', width: 56, height: 56, border: 'none', background: 'none', cursor: 'pointer', flexShrink: 0 }} aria-label={recording ? 'Stop recording' : 'Start recording'}>
      <svg width="56" height="56" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
        <circle cx="28" cy="28" r={R} fill="none" stroke="var(--sv-border)" strokeWidth="4" />
        {recording && (
          <circle cx="28" cy="28" r={R} fill="none" stroke={low ? 'var(--game-warning)' : 'var(--game-cyan)'} strokeWidth="4" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - ringPct)} style={{ transition: 'stroke-dashoffset .12s linear' }} />
        )}
      </svg>
      <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: recording ? negative : cyan }}>
        {recording ? <Square size={18} /> : <Mic size={20} />}
      </span>
    </button>
  );
}

/* ── Compact per-tab rationale (voice OR type) ───────────────────────── */
export function TabRationale({
  tabLabel, value, onChange,
}: { tabLabel: string; value: { method: 'voice' | 'text'; transcript: string } | undefined; onChange: (p: { method?: 'voice' | 'text'; transcript?: string }) => void }) {
  const method = value?.method ?? 'voice';
  const transcript = value?.transcript ?? '';
  const captured = transcript.trim().length > 0;
  return (
    <div style={{ marginTop: 16, background: 'var(--game-surface)', border: captured ? '1.4px solid var(--game-cyan)' : 'var(--game-card-border)', boxShadow: 'var(--shadow-elev-1)', borderRadius: 16, padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--cyan-tint)', color: tealMid, display: 'grid', placeItems: 'center', flexShrink: 0 }}><Mic size={15} /></span>
          <div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 13.5, color: ink }}>Why this {tabLabel.toLowerCase()} call?</div>
            <div style={{ fontFamily: DATA, fontSize: 11.5, color: captured ? success : faint, marginTop: 1 }}>{captured ? 'Rationale captured for this area' : 'Optional — record or type your reasoning'}</div>
          </div>
        </div>
        <div style={{ display: 'inline-flex', background: surfaceSoft, border: '1px solid ' + whisper, borderRadius: 999, padding: 3 }}>
          {(['voice', 'text'] as const).map((m) => {
            const on = method === m;
            return (
              <button key={m} onClick={() => onChange({ method: m })} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: DATA, fontSize: 12.5, fontWeight: 600, padding: '6px 14px', borderRadius: 999, border: 'none', cursor: 'pointer', background: on ? cyan : 'transparent', color: on ? '#fff' : muted }}>
                {m === 'voice' ? <Mic size={13} /> : <Keyboard size={13} />}{m === 'voice' ? 'Voice' : 'Type'}
              </button>
            );
          })}
        </div>
      </div>
      {method === 'voice' ? (
        <VoiceRecorder transcript={transcript} onTranscript={(t) => onChange({ transcript: t })} />
      ) : (
        <textarea value={transcript} onChange={(e) => onChange({ transcript: e.target.value })} placeholder={`Type your reasoning for the ${tabLabel.toLowerCase()} decision…`}
          style={{ width: '100%', minHeight: 80, marginTop: 12, fontFamily: DATA, fontSize: 14, lineHeight: 1.6, color: ink, background: surfaceSoft, border: '1px solid ' + whisper, borderRadius: 8, padding: 12, resize: 'vertical' }} />
      )}
    </div>
  );
}
