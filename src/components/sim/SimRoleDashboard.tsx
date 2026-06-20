'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Crown, Target, Users, TrendingUp } from '../PixelIcons';
import { SimStudentShell, DeckCard, DeckStat } from './SimShell';
import { CtaButton, Eyebrow, DISPLAY, DATA, ink, body, muted, faint, tealMid, cyanTint } from './sim-ui';

type Cmp = React.ComponentType<{ size?: number; color?: string }>;
const FOCUS: { icon: Cmp; title: string; desc: string }[] = [
  { icon: TrendingUp, title: 'Company Strategy', desc: 'Set the direction for growth and value.' },
  { icon: Target, title: 'Performance Targets', desc: 'Balance growth, profit, and customer loyalty.' },
  { icon: Users, title: 'Team Alignment', desc: 'Make sure every decision works together.' },
];

export function SimRoleDashboard() {
  const router = useRouter();
  return (
    <SimStudentShell>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
        <span style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, var(--game-cyan), var(--game-teal-mid))', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Crown size={26} color="#fff" /></span>
        <div>
          <Eyebrow>Your role</Eyebrow>
          <h1 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 28, color: ink, letterSpacing: '-0.5px', lineHeight: 1.1 }}>CEO</h1>
        </div>
      </div>
      <p style={{ fontFamily: DISPLAY, fontSize: 15, color: muted, marginTop: 6, marginBottom: 22 }}>As CEO, you guide the big picture — strategy, targets, and keeping the team aligned.</p>

      <Eyebrow>Your focus areas</Eyebrow>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginTop: 14, marginBottom: 22 }}>
        {FOCUS.map((f) => { const I = f.icon; return (
          <DeckCard key={f.title} style={{ padding: 20 }}>
            <span style={{ width: 40, height: 40, borderRadius: 10, background: cyanTint, color: tealMid, display: 'grid', placeItems: 'center' }}><I size={20} /></span>
            <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 15, color: ink, marginTop: 12 }}>{f.title}</div>
            <div style={{ fontFamily: DATA, fontSize: 13, color: muted, marginTop: 5, lineHeight: 1.5 }}>{f.desc}</div>
          </DeckCard>
        ); })}
      </div>

      <Eyebrow>Your impact</Eyebrow>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginTop: 14 }}>
        <DeckStat label="Decisions Made" value="12" />
        <DeckStat label="Accuracy" value="87%" delta="▲ 4%" tone="up" />
        <DeckStat label="Team Rating" value="4.6 / 5" tone="up" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 22 }}>
        <CtaButton onClick={() => router.push('/sim/play/decide')}>View all decisions</CtaButton>
      </div>
    </SimStudentShell>
  );
}
