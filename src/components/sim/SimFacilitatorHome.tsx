'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Send, GraduationCap, Clock, Check as CheckCircle2, Play as PlayCircle, Layers, Monitor } from '../PixelIcons';
import { SimSidebarShell, TEACHER_NAV, DeckCard, DeckStat, PageHead, StatusPill } from './SimShell';
import { CtaButton, Eyebrow, DISPLAY, DATA, ink, body, muted, faint, cyan, tealMid, success } from './sim-ui';

const ACTIVITY = [
  { period: 'Period 2 · Environmental Science', what: 'Continued — Supply Chain Disruption', when: '2h ago', state: 'running' },
  { period: 'Period 4 · Biology', what: 'Completed — Pandemic Response', when: '5h ago', state: 'completed' },
  { period: 'Period 1 · Earth Science', what: 'Assigned — Renewable Energy Transition', when: '1d ago', state: 'ready' },
  { period: 'Period 3 · Chemistry', what: 'Launched — Plastic in Our Oceans', when: '2d ago', state: 'running' },
];

const QUICK = [
  { label: 'Browse scenarios', icon: BookOpen, to: '/sim/teacher/library' },
  { label: 'Assign scenario', icon: Send, to: '/sim/teacher/assign' },
  { label: 'Quick launch', icon: PlayCircle, to: '/sim/teacher/quick-launch' },
  { label: 'My simulations', icon: Layers, to: '/sim/teacher/assigned' },
  { label: 'Ready to launch', icon: Monitor, to: '/sim/teacher/launch-ready' },
  { label: 'Create class', icon: GraduationCap, to: '/sim/teacher/classes/new' },
];

export function SimFacilitatorHome() {
  const router = useRouter();
  return (
    <SimSidebarShell nav={TEACHER_NAV} active="home">
      <PageHead
        title="Welcome back, Mrs. Johnson"
        subtitle="Ready to inspire your students with impactful simulations."
        right={<CtaButton onClick={() => router.push('/sim/teacher/library')}>New scenario</CtaButton>}
      />

      {/* KPI tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
        <DeckStat label="Classes" value="12" />
        <DeckStat label="Assigned" value="18" delta="+3" tone="up" sub="this term" />
        <DeckStat label="In progress" value="7" />
        <DeckStat label="Avg. completion" value="85%" delta="+4%" tone="up" />
      </div>

      {/* Activity (dominant) + quick actions rail */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.7fr) minmax(0,1fr)', gap: 18 }}>
        <DeckCard style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #E7EEF1' }}>
            <Eyebrow>Recent activity</Eyebrow>
            <button onClick={() => {}} style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 13, color: tealMid, background: 'none', border: 'none', cursor: 'pointer' }}>View all</button>
          </div>
          {ACTIVITY.map((a, i) => {
            const Icon = a.state === 'completed' ? CheckCircle2 : a.state === 'ready' ? Clock : PlayCircle;
            const color = a.state === 'completed' ? success : a.state === 'ready' ? faint : cyan;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 20px', borderBottom: i < ACTIVITY.length - 1 ? '1px solid #EEF3F5' : 'none' }}>
                <span style={{ color, flexShrink: 0 }}><Icon size={18} /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: DATA, fontSize: 13.5, fontWeight: 600, color: body }}>{a.what}</div>
                  <div style={{ fontFamily: DATA, fontSize: 12, color: faint, marginTop: 1 }}>{a.period}</div>
                </div>
                <span style={{ fontFamily: DATA, fontSize: 12, color: faint, flexShrink: 0 }}>{a.when}</span>
              </div>
            );
          })}
        </DeckCard>

        <div>
          <Eyebrow>Quick actions</Eyebrow>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
            {QUICK.map((q) => {
              const Icon = q.icon;
              return (
                <button
                  key={q.label}
                  onClick={() => q.to && router.push(q.to)}
                  className="sim-quick"
                  style={{
                    background: 'rgba(255,255,255,0.6)', border: '1.4px solid #fff', borderRadius: 14, padding: 18,
                    textAlign: 'left', cursor: q.to ? 'pointer' : 'default', display: 'flex', flexDirection: 'column', gap: 12,
                    transition: 'transform .15s ease, border-color .15s ease',
                  }}
                >
                  <span style={{ width: 38, height: 38, borderRadius: 10, background: '#E0F7FF', color: tealMid, display: 'grid', placeItems: 'center' }}><Icon size={19} /></span>
                  <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 13.5, color: ink }}>{q.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`.sim-quick:hover{transform:translateY(-2px);border-color:rgba(0,193,235,0.45) !important;}`}</style>
    </SimSidebarShell>
  );
}
