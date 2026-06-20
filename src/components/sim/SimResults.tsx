'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Trophy, ArrowUpRight, ArrowDownRight, Check, X, Star, Lightbulb, Target, Crown, Wallet, Lock,
  Megaphone, DollarSign, TrendingUp, Receipt,
} from '../PixelIcons';
import { SimStudentShell, DeckCard, DeckStat } from './SimShell';
import { FilterTabs } from './admin-ui';
import { CtaButton, OutlineButton, GhostButton, Eyebrow, Tag, DISPLAY, DATA, ink, body, muted, faint, cyan, tealMid, success, negative, warning, positive, cyanTint, whisper, surfaceSoft } from './sim-ui';

type Cmp = React.ComponentType<{ size?: number; color?: string }>;

/* ── grouped bars: You (cyan) vs Class Avg (muted) ──────────────────── */
function GroupedBars({ data }: { data: { label: string; you: number; avg: number }[] }) {
  const W = 560, H = 200, padX = 20, padBot = 40, padTop = 16, maxH = H - padTop - padBot;
  const gw = (W - padX * 2) / data.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: 'visible' }}>
      <defs><linearGradient id="resYou" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00C1EB" /><stop offset="100%" stopColor="#00C1EB" stopOpacity="0.5" /></linearGradient></defs>
      <line x1={padX} y1={H - padBot} x2={W - padX} y2={H - padBot} stroke="var(--sv-border)" strokeWidth="1" />
      {data.map((d, i) => {
        const cx = padX + i * gw + gw / 2;
        const bw = 26;
        const yH = (d.you / 100) * maxH, aH = (d.avg / 100) * maxH;
        return (
          <g key={d.label}>
            <rect x={cx - bw - 3} y={H - padBot - yH} width={bw} height={Math.max(2, yH)} rx="5" fill="url(#resYou)" />
            <rect x={cx + 3} y={H - padBot - aH} width={bw} height={Math.max(2, aH)} rx="5" fill="var(--game-text-muted)" opacity="0.4" />
            <text x={cx} y={H - padBot + 16} textAnchor="middle" fontFamily={DATA} fontSize="10.5" fill="var(--game-text-muted)">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── dual line: Your Score (cyan) vs Class Avg (muted dashed) ───────── */
function smooth(pts: [number, number][]) {
  if (pts.length < 2) return pts.length ? `M${pts[0][0]},${pts[0][1]}` : '';
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
  }
  return d;
}
function DualLine({ you, avg, labels }: { you: number[]; avg: number[]; labels: string[] }) {
  const W = 560, H = 210, padX = 16, padTop = 14, padBot = 26;
  const max = Math.max(...you, ...avg) * 1.12;
  const x = (i: number) => padX + (i / (labels.length - 1)) * (W - padX * 2);
  const y = (v: number) => padTop + (1 - v / max) * (H - padTop - padBot);
  const youPts = you.map((v, i) => [x(i), y(v)] as [number, number]);
  const avgPts = avg.map((v, i) => [x(i), y(v)] as [number, number]);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: 'visible' }}>
      {[0, 0.5, 1].map((g) => { const yy = padTop + g * (H - padTop - padBot); return <line key={g} x1={padX} y1={yy} x2={W - padX} y2={yy} stroke="var(--sv-border)" strokeWidth="1" strokeDasharray="1,5" />; })}
      <path d={smooth(avgPts)} fill="none" stroke="var(--game-text-muted)" strokeWidth="2" strokeDasharray="5,4" opacity="0.6" />
      <path d={smooth(youPts)} fill="none" stroke="var(--game-cyan)" strokeWidth="2.6" strokeLinecap="round" />
      {youPts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3.6" fill="var(--game-cyan)" stroke="#fff" strokeWidth="2" />)}
      {labels.map((l, i) => <text key={l} x={x(i)} y={H - 7} textAnchor="middle" fontFamily={DATA} fontSize="10.5" fill="var(--game-text-muted)">{l}</text>)}
    </svg>
  );
}
function Legend({ items }: { items: { label: string; color: string; dash?: boolean }[] }) {
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      {items.map((it) => (
        <span key={it.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: DATA, fontSize: 11.5, fontWeight: 600, color: muted }}>
          <span style={{ width: 14, height: it.dash ? 0 : 3, borderRadius: 3, background: it.dash ? 'transparent' : it.color, borderTop: it.dash ? `2px dashed ${it.color}` : 'none' }} />{it.label}
        </span>
      ))}
    </div>
  );
}

/* ════════════ 66 · Round Result Screen ════════════ */
export function SimRoundResult() {
  const router = useRouter();
  return (
    <SimStudentShell>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 26, color: ink, letterSpacing: '-0.5px' }}>Round 2 Results</h1>
          <p style={{ fontFamily: DISPLAY, fontSize: 14, color: muted, marginTop: 5 }}>Apr 26 – Apr 30, 2025</p>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'color-mix(in srgb, var(--game-success) 14%, #fff)', color: success, borderRadius: 999, padding: '8px 16px', fontFamily: DISPLAY, fontWeight: 700, fontSize: 14 }}><Trophy size={16} color={success} /> You outperformed!</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 18 }}>
        <DeckStat label="Market Share" value="23.6%" delta="▲ 3.2 pp" tone="up" />
        <DeckStat label="Net Profit" value="$812,400" delta="▲ 18.4%" tone="up" />
        <DeckStat label="ROI" value="17.6%" delta="▲ 2.8 pp" tone="up" />
        <DeckStat label="Overall Rank" value="2 / 8" delta="▲ 2" tone="up" />
      </div>

      <DeckCard style={{ padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Eyebrow>Performance vs. class</Eyebrow>
          <Legend items={[{ label: 'You', color: 'var(--game-cyan)' }, { label: 'Class avg', color: 'var(--game-text-muted)' }]} />
        </div>
        <div style={{ marginTop: 12 }}>
          <GroupedBars data={[{ label: 'Market Share', you: 78, avg: 62 }, { label: 'Net Profit', you: 85, avg: 68 }, { label: 'ROI', you: 74, avg: 60 }, { label: 'Customer Sat.', you: 82, avg: 76 }]} />
        </div>
      </DeckCard>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
        <OutlineButton onClick={() => router.push('/sim/play/progress')}>View detailed results</OutlineButton>
        <CtaButton onClick={() => router.push('/sim/play/cause-effect')}>Next: analysis</CtaButton>
      </div>
    </SimStudentShell>
  );
}

/* ════════════ 67 · Cause-and-Effect Explanation ════════════ */
interface Driver { icon: Cmp; name: string; effect: string; metric: string; up: boolean }
const DRIVERS: Driver[] = [
  { icon: Megaphone, name: 'Marketing Spend Increase', effect: '+3.6 pp', metric: 'Market Share', up: true },
  { icon: DollarSign, name: 'Price Reduction', effect: '+2.1 pp', metric: 'Market Share', up: true },
  { icon: TrendingUp, name: 'Brand Awareness', effect: '+1.4 pp', metric: 'Market Share', up: true },
  { icon: DollarSign, name: 'Unit Price Change', effect: '-1.2 pp', metric: 'Net Profit', up: false },
  { icon: Receipt, name: 'COGS Increase', effect: '-0.8 pp', metric: 'Net Profit', up: false },
];
export function SimCauseEffect() {
  const router = useRouter();
  const [tab, setTab] = useState('key');
  return (
    <SimStudentShell>
      <h1 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 26, color: ink, letterSpacing: '-0.5px' }}>Cause &amp; Effect</h1>
      <p style={{ fontFamily: DISPLAY, fontSize: 14.5, color: muted, marginTop: 5, marginBottom: 18 }}>Understand how your decisions drove outcomes.</p>
      <div style={{ marginBottom: 16 }}><FilterTabs tabs={[{ id: 'key', label: 'Key Drivers' }, { id: 'all', label: 'All Drivers' }]} active={tab} onChange={setTab} /></div>
      <DeckCard style={{ padding: 0, overflow: 'hidden' }}>
        {DRIVERS.map((d, i) => {
          const I = d.icon;
          return (
            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 20px', borderTop: i ? '1px solid var(--sv-border)' : 'none' }}>
              <span style={{ width: 34, height: 34, borderRadius: 9, background: cyanTint, color: tealMid, display: 'grid', placeItems: 'center', flexShrink: 0 }}><I size={16} /></span>
              <span style={{ flex: 1, fontFamily: DISPLAY, fontWeight: 700, fontSize: 14.5, color: ink }}>{d.name}</span>
              <span style={{ fontFamily: DATA, fontWeight: 700, fontSize: 14, color: d.up ? positive : negative, fontVariantNumeric: 'tabular-nums' }}>{d.effect}</span>
              <span style={{ fontFamily: DATA, fontSize: 12.5, color: muted, width: 110, textAlign: 'right' }}>{d.metric}</span>
              {d.up ? <ArrowUpRight size={16} color={positive} /> : <ArrowDownRight size={16} color={negative} />}
            </div>
          );
        })}
      </DeckCard>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
        <GhostButton>View full driver report</GhostButton>
        <CtaButton onClick={() => router.push('/sim/play/reflection')}>Next: reflection</CtaButton>
      </div>
    </SimStudentShell>
  );
}

/* ════════════ 68 · Reflection Screen ════════════ */
function ReflectField({ label, value, onChange, ph }: { label: string; value: string; onChange: (v: string) => void; ph: string }) {
  return (
    <div>
      <label style={{ display: 'block', fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, color: ink, marginBottom: 8 }}>{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value.slice(0, 300))} placeholder={ph} style={{ width: '100%', minHeight: 90, fontFamily: DATA, fontSize: 14, lineHeight: 1.6, color: ink, background: surfaceSoft, border: '1px solid var(--sv-border)', borderRadius: 8, padding: 14, resize: 'vertical' }} />
      <div style={{ fontFamily: DATA, fontSize: 11.5, color: faint, marginTop: 6, textAlign: 'right' }}>{value.length}/300</div>
    </div>
  );
}
export function SimReflection() {
  const router = useRouter();
  const [a, setA] = useState('Our marketing investment and price move drove strong trial and share gains.');
  const [b, setB] = useState('Profit was lower than expected due to higher COGS and promo costs.');
  const [c, setC] = useState('Optimize spend mix and look for efficiency in COGS to protect margins.');
  return (
    <SimStudentShell>
      <h1 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 26, color: ink, letterSpacing: '-0.5px' }}>Reflection</h1>
      <p style={{ fontFamily: DISPLAY, fontSize: 14.5, color: muted, marginTop: 5, marginBottom: 18 }}>Reflect on what happened this round.</p>
      <DeckCard style={{ padding: 24, maxWidth: 760 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <ReflectField label="What worked well?" value={a} onChange={setA} ph="What drove your gains this round?" />
          <ReflectField label="What didn't work as expected?" value={b} onChange={setB} ph="Where did results miss?" />
          <ReflectField label="What will you do differently next time?" value={c} onChange={setC} ph="Your plan for next round." />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 22 }}>
          <CtaButton onClick={() => router.push('/sim/play/commitment')}>Save reflection</CtaButton>
        </div>
      </DeckCard>
    </SimStudentShell>
  );
}

/* ════════════ 69 · Next Round Commitment ════════════ */
export function SimCommitment() {
  const router = useRouter();
  const [priorities, setPriorities] = useState(['Improve operating margin', 'Invest in brand equity', 'Grow in target segment']);
  const [commit, setCommit] = useState('I will test efficiency improvements and refine our positioning to build loyalty and sustain growth.');
  return (
    <SimStudentShell>
      <h1 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 26, color: ink, letterSpacing: '-0.5px' }}>Next Round Commitment</h1>
      <p style={{ fontFamily: DISPLAY, fontSize: 14.5, color: muted, marginTop: 5, marginBottom: 18 }}>Set your focus for the upcoming round.</p>
      <DeckCard style={{ padding: 24, maxWidth: 760 }}>
        <Eyebrow>My top 3 priorities</Eyebrow>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
          {priorities.map((p, i) => (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 12, background: surfaceSoft, border: '1px solid var(--sv-border)', borderRadius: 10, padding: '12px 14px' }}>
              <span style={{ width: 26, height: 26, borderRadius: '50%', background: cyanTint, color: tealMid, display: 'grid', placeItems: 'center', fontFamily: DATA, fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{i + 1}</span>
              <span style={{ flex: 1, fontFamily: DATA, fontSize: 14, color: ink }}>{p}</span>
              <button onClick={() => setPriorities(priorities.filter((x) => x !== p))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: faint, display: 'grid' }}><X size={15} /></button>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20 }}>
          <Eyebrow>Personal commitment</Eyebrow>
          <textarea value={commit} onChange={(e) => setCommit(e.target.value.slice(0, 300))} style={{ width: '100%', minHeight: 100, marginTop: 12, fontFamily: DATA, fontSize: 14, lineHeight: 1.6, color: ink, background: surfaceSoft, border: '1px solid var(--sv-border)', borderRadius: 8, padding: 14, resize: 'vertical' }} />
          <div style={{ fontFamily: DATA, fontSize: 11.5, color: faint, marginTop: 6, textAlign: 'right' }}>{commit.length}/300</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 22 }}>
          <CtaButton onClick={() => router.push('/sim/play/progress')}>Commit &amp; continue</CtaButton>
        </div>
      </DeckCard>
    </SimStudentShell>
  );
}

/* ════════════ 70 · Student Progress Summary ════════════ */
interface Badge { name: string; icon: Cmp; earned: boolean }
const BADGES: Badge[] = [
  { name: 'Quick Learner', icon: Lightbulb, earned: true },
  { name: 'Strategic Thinker', icon: Target, earned: true },
  { name: 'Market Master', icon: Crown, earned: true },
  { name: 'Profit Builder', icon: Wallet, earned: false },
];
export function SimProgress() {
  const router = useRouter();
  return (
    <SimStudentShell>
      <h1 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 26, color: ink, letterSpacing: '-0.5px' }}>Progress Summary</h1>
      <p style={{ fontFamily: DISPLAY, fontSize: 14.5, color: muted, marginTop: 5, marginBottom: 18 }}>Your overall performance so far.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 18 }}>
        <DeckStat label="Rounds Completed" value="2 / 6" />
        <DeckStat label="Current Rank" value="2 / 8" delta="▲ 2" tone="up" />
        <DeckStat label="Total Score" value="842 / 1000" />
        <DeckStat label="Learning Points" value="+125" tone="up" />
      </div>

      <DeckCard style={{ padding: 22, marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Eyebrow>Performance trend</Eyebrow>
          <Legend items={[{ label: 'Your score', color: 'var(--game-cyan)' }, { label: 'Class average', color: 'var(--game-text-muted)', dash: true }]} />
        </div>
        <div style={{ marginTop: 12 }}>
          <DualLine you={[480, 650, 842]} avg={[470, 560, 640, 700, 745, 770]} labels={['R1', 'R2', 'R3', 'R4', 'R5', 'R6']} />
        </div>
      </DeckCard>

      <Eyebrow>Badges earned</Eyebrow>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginTop: 14 }}>
        {BADGES.map((b) => {
          const I = b.icon;
          return (
            <DeckCard key={b.name} style={{ padding: 18, textAlign: 'center', opacity: b.earned ? 1 : 0.55 }}>
              <span style={{ width: 48, height: 48, borderRadius: 12, margin: '0 auto', background: b.earned ? cyanTint : 'var(--muted)', color: b.earned ? tealMid : faint, display: 'grid', placeItems: 'center' }}>
                {b.earned ? <I size={24} /> : <Lock size={20} />}
              </span>
              <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 13.5, color: b.earned ? ink : muted, marginTop: 10 }}>{b.name}</div>
              <div style={{ fontFamily: DATA, fontSize: 11.5, color: faint, marginTop: 2 }}>{b.earned ? 'Earned' : 'Locked'}</div>
            </DeckCard>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 22 }}>
        <GhostButton onClick={() => router.push('/sim/play')}>Back to dashboard</GhostButton>
        <CtaButton onClick={() => router.push('/sim/play')}>View learning path</CtaButton>
      </div>
    </SimStudentShell>
  );
}
