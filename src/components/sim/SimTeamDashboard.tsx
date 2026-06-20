'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Users, Mic, History, Trophy, Clock, ChevronRight } from '../PixelIcons';
import { SimStudentShell, DeckCard, DeckStat } from './SimShell';
import { useSim } from '../../context/SimContext';
import { Eyebrow, CtaButton, DISPLAY, DATA, ink, body, muted, faint, cyan, tealMid, cyanTint } from './sim-ui';

const WHATS_HAPPENING = [
  'A new competitor entered your primary market.',
  'Raw material costs have increased by 6%.',
  'Demand is shifting toward sustainable products.',
  'You have 6 decision areas to manage.',
];
const QUICK = [
  { label: 'View brief', icon: FileText, to: '/sim/play/brief' },
  { label: 'Team lobby', icon: Users, to: '/sim/play/lobby' },
  { label: 'Voice reflection', icon: Mic, to: '/sim/play/voice' },
  { label: 'Round results', icon: History, to: '/sim/play/results' },
];
const LEADERS = [
  { rank: 1, name: 'Vertex Ventures', pts: 1680 },
  { rank: 2, name: 'NextGen Co.', pts: 1412 },
  { rank: 3, name: 'Summit Strategies', pts: 1301 },
  { rank: 4, name: 'Peak Performance (you)', pts: 1285, you: true },
];

export function SimTeamDashboard() {
  const router = useRouter();
  const { scenario } = useSim();

  return (
    <SimStudentShell>
      <h1 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 28, color: ink, letterSpacing: '-0.5px' }}>Welcome back, Alex</h1>
      <p style={{ fontFamily: DISPLAY, fontSize: 15, color: muted, marginTop: 5, marginBottom: 20 }}>Ready to lead your company to victory?</p>

      {/* Progress banner */}
      <div style={{ background: 'linear-gradient(135deg, #003D47, #006E85)', borderRadius: 16, padding: 22, marginBottom: 18, color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontFamily: DATA, fontSize: 12.5, color: '#9FD6E4', fontWeight: 600 }}>{scenario?.title ?? 'Cyan Global Challenge'} · Season 7</div>
            <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 20, marginTop: 3 }}>Round 2 of 6</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: DATA, fontSize: 12, color: '#9FD6E4' }}>Next round opens in</div>
            <div style={{ fontFamily: DATA, fontWeight: 800, fontSize: 18, fontVariantNumeric: 'tabular-nums' }}>2d 14h 32m</div>
          </div>
        </div>
        <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.18)', marginTop: 14, overflow: 'hidden' }}>
          <div style={{ width: '33%', height: '100%', borderRadius: 4, background: cyan }} />
        </div>
      </div>

      {/* Round overview KPIs */}
      <div style={{ marginBottom: 10 }}><Eyebrow>Round 2 overview</Eyebrow></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 18 }}>
        <DeckStat label="Market Share" value="18.6%" delta="▲ 2.4%" tone="up" />
        <DeckStat label="Net Profit" value="$1.24M" delta="▲ 8.3%" tone="up" />
        <DeckStat label="Customer Sat." value="82%" delta="▲ 6%" tone="up" />
        <DeckStat label="Cash Balance" value="$2.8M" delta="→ 0%" tone="flat" />
      </div>

      {/* What's happening + company */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1fr)', gap: 18, marginBottom: 18 }}>
        <DeckCard style={{ padding: 22 }}>
          <Eyebrow>What&apos;s happening this round</Eyebrow>
          <ul style={{ margin: '14px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 11 }}>
            {WHATS_HAPPENING.map((t) => (
              <li key={t} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontFamily: DATA, fontSize: 14, color: body }}>
                <ChevronRight size={16} color={tealMid} style={{ marginTop: 1, flexShrink: 0 }} /> {t}
              </li>
            ))}
          </ul>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, paddingTop: 16, borderTop: '1px solid #E7EEF1' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: DATA, fontSize: 13.5, color: muted }}>
              <Clock size={15} color={faint} /> Time to decide <span style={{ color: ink, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>2d 14h 32m</span>
            </span>
            <CtaButton onClick={() => router.push('/sim/play/decide')}>Make decisions</CtaButton>
          </div>
        </DeckCard>

        <DeckCard style={{ padding: 20 }}>
          <Eyebrow>Your company</Eyebrow>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
            <span style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#00C1EB,#006E85)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <Trophy size={22} color="#fff" />
            </span>
            <div>
              <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 16, color: ink }}>Peak Performance</div>
              <div style={{ fontFamily: DATA, fontSize: 12.5, color: muted }}>Sportswear &amp; Apparel</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
            <div style={{ background: '#F7FAFB', borderRadius: 10, padding: 12 }}>
              <div style={{ fontFamily: DATA, fontSize: 11.5, color: faint }}>Team Rank</div>
              <div style={{ fontFamily: DATA, fontWeight: 800, fontSize: 18, color: ink, fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>#4 <span style={{ fontSize: 12, fontWeight: 500, color: faint }}>of 24</span></div>
            </div>
            <div style={{ background: '#F7FAFB', borderRadius: 10, padding: 12 }}>
              <div style={{ fontFamily: DATA, fontSize: 11.5, color: faint }}>Overall Score</div>
              <div style={{ fontFamily: DATA, fontWeight: 800, fontSize: 18, color: ink, fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>1,285 <span style={{ fontSize: 12, fontWeight: 500, color: faint }}>pts</span></div>
            </div>
          </div>
        </DeckCard>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 18 }}>
        {QUICK.map((q) => {
          const Icon = q.icon;
          return (
            <DeckCard key={q.label} className="sim-qa" onClick={() => router.push(q.to)} style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 11, cursor: 'pointer', transition: 'transform .15s ease' }}>
              <span style={{ width: 36, height: 36, borderRadius: 10, background: cyanTint, color: tealMid, display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon size={18} /></span>
              <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 13.5, color: ink }}>{q.label}</span>
            </DeckCard>
          );
        })}
      </div>

      {/* Global leaderboard */}
      <DeckCard style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #E7EEF1' }}>
          <Eyebrow>Global leaderboard</Eyebrow>
          <button style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 13, color: tealMid, background: 'none', border: 'none', cursor: 'pointer' }}>View full</button>
        </div>
        {LEADERS.map((l, i) => (
          <div key={l.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px', borderBottom: i < LEADERS.length - 1 ? '1px solid #EEF3F5' : 'none', background: l.you ? cyanTint : 'transparent' }}>
            <span style={{ fontFamily: DATA, fontWeight: 800, fontSize: 14, color: l.rank <= 3 ? tealMid : muted, width: 22, fontVariantNumeric: 'tabular-nums' }}>{l.rank}</span>
            <span style={{ flex: 1, fontFamily: DATA, fontSize: 14, fontWeight: l.you ? 700 : 500, color: ink }}>{l.name}</span>
            <span style={{ fontFamily: DATA, fontWeight: 700, fontSize: 14, color: ink, fontVariantNumeric: 'tabular-nums' }}>{l.pts.toLocaleString()} <span style={{ fontWeight: 500, fontSize: 12, color: faint }}>pts</span></span>
          </div>
        ))}
      </DeckCard>

      <style>{`.sim-qa:hover{transform:translateY(-2px);}`}</style>
    </SimStudentShell>
  );
}
