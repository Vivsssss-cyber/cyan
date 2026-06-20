'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Stopwatch as Pause, Play, Plus, ChevronRight as SkipForward, StopSign as Square, AlertTriangle, Megaphone, MessageSquare as MessageSquareText,
  HelpCircle, Flag, MessageSquare as MessageCircle, Check as CheckCircle2, Stopwatch as Timer,
} from '../PixelIcons';
import { SimSidebarShell, TEACHER_NAV, DeckCard, DeckStat, PageHead, StatusPill } from './SimShell';
import { useSim } from '../../context/SimContext';
import {
  Eyebrow, OutlineButton, GhostButton, DISPLAY, DATA,
  ink, body, muted, faint, cyan, tealMid, success, negative, warning, cyanTint, whisper,
} from './sim-ui';

interface Team { name: string; submitted: string; score: number; engage: 'High' | 'Medium' | 'Low'; status: 'active' | 'nodecision' }
const TEAMS: Team[] = [
  { name: 'Alpha', submitted: '10:30 AM', score: 72, engage: 'High', status: 'active' },
  { name: 'Beta', submitted: '10:32 AM', score: 68, engage: 'High', status: 'active' },
  { name: 'Gamma', submitted: '10:29 AM', score: 64, engage: 'Medium', status: 'active' },
  { name: 'Delta', submitted: '10:31 AM', score: 59, engage: 'High', status: 'active' },
  { name: 'Epsilon', submitted: '10:30 AM', score: 55, engage: 'Medium', status: 'active' },
  { name: 'Zeta', submitted: '10:30 AM', score: 48, engage: 'Low', status: 'active' },
  { name: 'Eta', submitted: '—', score: 0, engage: 'Low', status: 'nodecision' },
];

const ROUND_PHASES = ['Setup', 'Decide', 'Analyze', 'Results', 'Debrief'];

const QUEUE = [
  { kind: 'Help', team: 'Delta', msg: 'Need guidance on inventory strategy trade-offs.', priority: 'High', time: '10:31 AM' },
  { kind: 'Help', team: 'Eta', msg: 'Confused about demand forecast assumptions.', priority: 'Medium', time: '10:30 AM' },
  { kind: 'Flagged', team: 'Zeta', msg: 'Unusual spike in marketing spend.', priority: 'Medium', time: '10:29 AM' },
  { kind: 'Chat', team: 'Gamma', msg: 'Question about supplier reliability data.', priority: 'Low', time: '10:28 AM' },
];

const engageColor = (e: string) => (e === 'High' ? success : e === 'Medium' ? warning : negative);

export function SimLiveMonitor() {
  const router = useRouter();
  const { scenario } = useSim();
  const [paused, setPaused] = useState(false);
  const [resolved, setResolved] = useState<number[]>([]);

  return (
    <SimSidebarShell nav={TEACHER_NAV} active="sessions">
      <PageHead
        title="Live Session Monitor"
        subtitle={`${scenario?.title ?? 'Supply Chain Disruption'} · Round 3 of 5 · 28 students · 7 teams`}
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: DATA, fontSize: 12.5, fontWeight: 700, color: paused ? warning : success, textTransform: 'uppercase', letterSpacing: '1px' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: paused ? warning : success }} /> {paused ? 'Paused' : 'In progress'}
            </span>
            <span style={{ fontFamily: DATA, fontSize: 15, fontWeight: 800, color: ink, fontVariantNumeric: 'tabular-nums' }}>00:32:47</span>
          </div>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.55fr) minmax(0,1fr)', gap: 18, alignItems: 'start' }}>
        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Classroom overview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
            <DeckStat label="Teams" value="7" />
            <DeckStat label="Students" value="28" />
            <DeckStat label="Observers" value="3" />
            <DeckStat label="Engagement" value="96%" delta="active" tone="up" />
          </div>

          {/* Round control */}
          <DeckCard style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Eyebrow>Round 3 of 5 — control</Eyebrow>
              <span style={{ fontFamily: DATA, fontSize: 12, color: faint }}>Auto-advance: off</span>
            </div>

            {/* phase timeline */}
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 16 }}>
              {ROUND_PHASES.map((p, i) => {
                const active = i === 2;
                const done = i < 2;
                return (
                  <React.Fragment key={p}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 26, height: 26, borderRadius: '50%', display: 'grid', placeItems: 'center', background: done ? success : active ? cyan : '#fff', border: !done && !active ? '1.4px solid ' + whisper : 'none', color: done || active ? '#fff' : faint, fontFamily: DATA, fontWeight: 700, fontSize: 12 }}>{done ? <CheckCircle2 size={14} /> : i + 1}</span>
                      <span style={{ fontFamily: DATA, fontSize: 11, fontWeight: active ? 700 : 500, color: active ? ink : faint }}>{p}</span>
                    </div>
                    {i < ROUND_PHASES.length - 1 && <span style={{ flex: 1, height: 1.5, background: i < 2 ? success : whisper, margin: '0 6px', marginBottom: 18 }} />}
                  </React.Fragment>
                );
              })}
            </div>

            {/* time remaining */}
            <div style={{ marginTop: 18 }}>
              <div style={{ fontFamily: DATA, fontSize: 12, color: muted, marginBottom: 4 }}>Time remaining</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontFamily: DATA, fontWeight: 800, fontSize: 32, color: ink, fontVariantNumeric: 'tabular-nums', letterSpacing: '-1px' }}>07:12</span>
                <span style={{ fontFamily: DATA, fontSize: 13, color: faint }}>of 15:00</span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: '#E7EEF1', marginTop: 8, overflow: 'hidden' }}>
                <div style={{ width: '48%', height: '100%', borderRadius: 4, background: cyan }} />
              </div>
            </div>

            {/* controls */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 16 }}>
              <Ctrl icon={paused ? <Play size={16} /> : <Pause size={16} />} label={paused ? 'Resume' : 'Pause'} onClick={() => setPaused((p) => !p)} active={paused} />
              <Ctrl icon={<Plus size={16} />} label="Extend +5m" onClick={() => {}} />
              <Ctrl icon={<SkipForward size={16} />} label="Skip to results" onClick={() => {}} />
            </div>
            <button style={{ width: '100%', marginTop: 10, fontFamily: DISPLAY, fontWeight: 600, fontSize: 14, color: negative, background: '#FCF3F3', border: '1.4px solid #F2D9D9', borderRadius: 10, padding: '11px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Square size={15} /> End round early
            </button>

            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <OutlineButton><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Megaphone size={15} /> Broadcast</span></OutlineButton>
              <OutlineButton><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><MessageSquareText size={15} /> Push question</span></OutlineButton>
            </div>
          </DeckCard>
        </div>

        {/* RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Team status */}
          <DeckCard style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 18px', borderBottom: '1px solid #E7EEF1' }}><Eyebrow>Team status</Eyebrow></div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#F7FAFB' }}>
                {['Team', 'Submitted', 'Score', 'Engage', ''].map((h, i) => (
                  <th key={h + i} style={{ textAlign: i === 2 ? 'right' : 'left', fontFamily: DATA, fontSize: 11, fontWeight: 700, color: faint, textTransform: 'uppercase', letterSpacing: '0.6px', padding: '9px 14px' }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {TEAMS.map((t, i) => (
                  <tr key={t.name} style={{ borderBottom: i < TEAMS.length - 1 ? '1px solid #EEF3F5' : 'none' }}>
                    <td style={{ padding: '11px 14px', fontFamily: DATA, fontSize: 13.5, fontWeight: 600, color: ink }}>{t.name}</td>
                    <td style={{ padding: '11px 14px', fontFamily: DATA, fontSize: 12.5, color: t.status === 'nodecision' ? faint : muted }}>{t.submitted}</td>
                    <td style={{ padding: '11px 14px', textAlign: 'right', fontFamily: DATA, fontSize: 13.5, fontWeight: 600, color: t.status === 'nodecision' ? faint : ink, fontVariantNumeric: 'tabular-nums' }}>{t.status === 'nodecision' ? '—' : t.score}</td>
                    <td style={{ padding: '11px 14px' }}><span style={{ fontFamily: DATA, fontSize: 12, fontWeight: 700, color: engageColor(t.engage) }}>{t.engage}</span></td>
                    <td style={{ padding: '11px 14px' }}>{t.status === 'nodecision' ? <span style={{ fontFamily: DATA, fontSize: 11.5, fontWeight: 700, color: warning }}>No decision</span> : <span style={{ width: 8, height: 8, borderRadius: '50%', background: success, display: 'inline-block' }} />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DeckCard>

          {/* Intervention queue */}
          <DeckCard style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <Eyebrow>Intervention queue</Eyebrow>
              <span style={{ fontFamily: DATA, fontSize: 12, color: faint }}>{QUEUE.length - resolved.length} open</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {QUEUE.map((item, idx) => {
                if (resolved.includes(idx)) return null;
                const KindIcon = item.kind === 'Help' ? HelpCircle : item.kind === 'Flagged' ? Flag : MessageCircle;
                const kindColor = item.kind === 'Help' ? warning : item.kind === 'Flagged' ? negative : tealMid;
                return (
                  <div key={idx} style={{ border: '1px solid ' + whisper, borderRadius: 12, padding: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: DATA, fontSize: 11.5, fontWeight: 700, color: kindColor }}><KindIcon size={13} /> {item.kind}</span>
                      <span style={{ fontFamily: DATA, fontSize: 13, fontWeight: 700, color: ink }}>Team {item.team}</span>
                      <span style={{ marginLeft: 'auto', fontFamily: DATA, fontSize: 11.5, color: faint }}>{item.time}</span>
                    </div>
                    <div style={{ fontFamily: DATA, fontSize: 13, color: body, lineHeight: 1.45 }}>{item.msg}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                      <span style={{ fontFamily: DATA, fontSize: 11.5, color: faint }}>Priority: <span style={{ color: item.priority === 'High' ? negative : item.priority === 'Medium' ? warning : muted, fontWeight: 700 }}>{item.priority}</span></span>
                      <button onClick={() => setResolved((r) => [...r, idx])} style={{ marginLeft: 'auto', fontFamily: DISPLAY, fontWeight: 600, fontSize: 12.5, color: '#fff', background: tealMid, border: 'none', borderRadius: 999, padding: '7px 16px', cursor: 'pointer' }}>Join</button>
                    </div>
                  </div>
                );
              })}
              {resolved.length === QUEUE.length && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: DATA, fontSize: 13, color: success, padding: '6px 2px' }}>
                  <CheckCircle2 size={16} /> All interventions resolved.
                </div>
              )}
            </div>
          </DeckCard>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <GhostButton onClick={() => router.push('/sim/teacher/session/pacing')}>Pacing board →</GhostButton>
            <GhostButton onClick={() => router.push('/sim/teacher/projector')}>Projector mode →</GhostButton>
            <GhostButton onClick={() => router.push('/sim/mentor')}>Open mentor loop →</GhostButton>
            <GhostButton onClick={() => router.push('/sim/play')}>See the student side →</GhostButton>
          </div>
        </div>
      </div>
    </SimSidebarShell>
  );
}

function Ctrl({ icon, label, onClick, active }: { icon: React.ReactNode; label: string; onClick: () => void; active?: boolean }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontFamily: DISPLAY, fontWeight: 600, fontSize: 12.5,
      color: active ? cyan : ink, background: active ? '#E0F7FF' : '#fff', border: '1.4px solid ' + (active ? cyan : '#E7EEF1'),
      borderRadius: 12, padding: '12px 8px', cursor: 'pointer',
    }}>{icon}{label}</button>
  );
}
