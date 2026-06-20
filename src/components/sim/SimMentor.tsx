'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RefreshCw, Mic, FileText, Plus, Pencil, Play, Check, Lightbulb, MessageSquare,
} from '../PixelIcons';
import { SimSidebarShell, MENTOR_NAV, PageHead, DeckCard, DeckStat, StatusPill } from './SimShell';
import { ADMIN_NAV } from './admin-ui';
import { DataTable, Col, FilterTabs, SelectInput, Field } from './admin-ui';
import { CtaButton, OutlineButton, GhostButton, Eyebrow, Tag, DISPLAY, DATA, ink, body, muted, faint, cyan, tealMid, success, negative, warning, positive, cyanTint, whisper, surfaceSoft } from './sim-ui';

const TEACHER = { name: 'Mrs. Johnson', role: 'Science Teacher' };

function TeamDot({ name }: { name: string }) {
  return <span style={{ width: 24, height: 24, borderRadius: 7, background: 'linear-gradient(135deg, var(--game-cyan), var(--game-teal-mid))', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: DATA, fontWeight: 700, fontSize: 10 }}>{name.split(' ').map((w) => w[0]).join('').slice(0, 2)}</span>;
}
function ConfDonut({ pct }: { pct: number }) {
  const R = 13, C = 2 * Math.PI * R;
  const col = pct >= 70 ? positive : pct >= 60 ? warning : negative;
  return (
    <span style={{ position: 'relative', width: 34, height: 34, display: 'inline-grid', placeItems: 'center' }}>
      <svg width="34" height="34" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="17" cy="17" r={R} fill="none" stroke="var(--sv-border)" strokeWidth="4" />
        <circle cx="17" cy="17" r={R} fill="none" stroke={col} strokeWidth="4" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)} />
      </svg>
      <span style={{ position: 'absolute', fontFamily: DATA, fontWeight: 700, fontSize: 9.5, color: ink, fontVariantNumeric: 'tabular-nums' }}>{pct}</span>
    </span>
  );
}

/* ════════════ 71 · Team Reflection Queue ════════════ */
interface Refl { team: string; round: string; type: string; status: string; captured: string }
const QUEUE: Refl[] = [
  { team: 'Blue Horizon', round: 'Round 10', type: 'Team Voice', status: 'pending', captured: '2m ago' },
  { team: 'Growth Gurus', round: 'Round 10', type: 'Team Voice', status: 'pending', captured: '15m ago' },
  { team: 'Market Movers', round: 'Round 9', type: 'Team Voice', status: 'transcribed', captured: '1h ago' },
  { team: 'Peak Performers', round: 'Round 9', type: 'Student Voice', status: 'reviewed', captured: '1h ago' },
  { team: 'Visionary Minds', round: 'Round 9', type: 'Team Voice', status: 'transcribed', captured: '3h ago' },
  { team: 'Alpha Achievers', round: 'Round 8', type: 'Student Voice', status: 'transcribed', captured: '5h ago' },
];
export function SimMentorQueue() {
  const router = useRouter();
  const [tab, setTab] = useState('all');
  const [cohort, setCohort] = useState('CYAN Internal — Cohort May 2025');
  const tabs = [
    { id: 'all', label: 'All', count: 14 },
    { id: 'pending', label: 'Pending', count: 6 },
    { id: 'transcribed', label: 'Transcribed', count: 7 },
    { id: 'reviewed', label: 'Reviewed', count: 1 },
  ];
  const rows = QUEUE.filter((r) => tab === 'all' || r.status === tab);
  const cols: Col<Refl>[] = [
    { key: 'team', label: 'Team', render: (r) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontWeight: 600, color: ink }}><TeamDot name={r.team} /> {r.team}</span> },
    { key: 'round', label: 'Round', render: (r) => <span style={{ color: muted, fontVariantNumeric: 'tabular-nums' }}>{r.round}</span> },
    { key: 'type', label: 'Type', render: (r) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Mic size={13} color={tealMid} /> {r.type}</span> },
    { key: 'status', label: 'Status', render: (r) => <StatusPill status={r.status} /> },
    { key: 'captured', label: 'Captured', align: 'right', render: (r) => <span style={{ color: faint }}>{r.captured}</span> },
  ];
  return (
    <SimSidebarShell nav={MENTOR_NAV} active="queue" user={TEACHER}>
      <PageHead title="Reflection Queue" subtitle="Review and coach student & team reflections." right={<OutlineButton><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><RefreshCw size={15} /> Refresh queue</span></OutlineButton>} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 16, flexWrap: 'wrap' }}>
        <FilterTabs tabs={tabs} active={tab} onChange={setTab} />
        <div style={{ width: 280 }}><SelectInput value={cohort} onChange={setCohort} options={['CYAN Internal — Cohort May 2025', 'CYAN Internal — Cohort Apr 2025']} /></div>
      </div>
      <DataTable columns={cols} rows={rows} getKey={(r) => r.team + r.round} onRow={() => router.push('/sim/mentor/transcript')} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
        <span style={{ fontFamily: DATA, fontSize: 12.5, color: faint }}>Showing 1–{rows.length} of 14</span>
        <div style={{ display: 'flex', gap: 6 }}>{['1', '2', '3'].map((p) => <button key={p} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid var(--sv-border)', background: p === '1' ? cyanTint : 'var(--game-surface-solid)', color: p === '1' ? tealMid : muted, fontFamily: DATA, fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}>{p}</button>)}</div>
      </div>
    </SimSidebarShell>
  );
}

/* ════════════ 74 · Auto-Transcription Review ════════════ */
export function SimMentorTranscript() {
  const router = useRouter();
  return (
    <SimSidebarShell nav={MENTOR_NAV} active="transcript" user={TEACHER}>
      <PageHead title="Auto-Transcription Review" subtitle="Blue Horizon · Round 10 · captured May 23, 2025 · 10:42 AM" right={<StatusPill status="transcribed" />} />
      <DeckCard style={{ padding: 24, maxWidth: 820 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid var(--sv-border)' }}>
          <button style={{ width: 38, height: 38, borderRadius: '50%', background: cyanTint, border: 'none', display: 'grid', placeItems: 'center', cursor: 'pointer', color: tealMid }}><Play size={16} /></button>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2, height: 28 }}>
            {Array.from({ length: 40 }).map((_, i) => <span key={i} style={{ flex: 1, height: `${(0.3 + ((i * 5) % 9) / 12) * 28}px`, background: 'var(--game-teal-light, #00A0C2)', opacity: 0.5, borderRadius: 2, minHeight: 3 }} />)}
          </div>
          <span style={{ fontFamily: DATA, fontSize: 13, fontWeight: 700, color: muted, fontVariantNumeric: 'tabular-nums' }}>01:12</span>
        </div>

        {[
          { t: '00:00', body: ['This round, our biggest decision was to ', { k: 'increase marketing spend' }, ' to build brand awareness. We believed this would help ', { k: 'drive trial signups' }, ' even though it would lower our short-term profits.'] },
          { t: '00:28', body: ['We also ', { k: 'adjusted our pricing' }, ' slightly downward to remain competitive in the target segment. The data showed high price sensitivity, so this felt like the right move.'] },
          { t: '00:52', body: ['Next round, we want to test a more premium positioning once brand awareness improves.'] },
        ].map((seg) => (
          <div key={seg.t} style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
            <span style={{ fontFamily: DATA, fontSize: 11.5, fontWeight: 700, color: faint, fontVariantNumeric: 'tabular-nums', flexShrink: 0, paddingTop: 2 }}>{seg.t}</span>
            <p style={{ fontFamily: DISPLAY, fontSize: 14.5, lineHeight: 1.7, color: body, margin: 0 }}>
              {seg.body.map((part, i) => typeof part === 'string' ? part : <mark key={i} style={{ background: cyanTint, color: tealMid, fontWeight: 600, padding: '1px 4px', borderRadius: 4 }}>{part.k}</mark>)}
            </p>
          </div>
        ))}

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--sv-border)', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: DATA, fontSize: 12, color: faint }}>Tags:</span>
          {['Marketing Spend', 'Pricing', 'Brand Awareness'].map((t) => <Tag key={t}>{t}</Tag>)}
          <button style={{ width: 24, height: 24, borderRadius: 999, border: '1px dashed var(--sv-border)', background: 'none', cursor: 'pointer', color: muted, display: 'grid', placeItems: 'center' }}><Plus size={12} /></button>
        </div>
      </DeckCard>
      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <OutlineButton><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Pencil size={14} /> Edit transcript</span></OutlineButton>
        <CtaButton onClick={() => router.push('/sim/mentor/assumptions')}>Link to decisions</CtaButton>
      </div>
    </SimSidebarShell>
  );
}

/* ════════════ 75 · Assumption Log ════════════ */
interface Asm { text: string; type: string; linked: string; conf: number; status: string }
const ASMS: Asm[] = [
  { text: 'Lowering price will increase trial volume without hurting margins.', type: 'Market', linked: 'D-34', conf: 70, status: 'active' },
  { text: 'Target segment is highly price-sensitive.', type: 'Market', linked: 'D-34', conf: 80, status: 'active' },
  { text: 'Increased awareness will convert to repeat purchases over time.', type: 'Strategy', linked: 'D-31', conf: 60, status: 'active' },
  { text: "Competitor 2's promo is short term.", type: 'Competitive', linked: 'D-33', conf: 50, status: 'atrisk' },
];
export function SimMentorAssumptions() {
  const cols: Col<Asm>[] = [
    { key: 'text', label: 'Assumption', width: '40%', render: (r) => <span style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 8, color: ink, fontWeight: 500 }}><Lightbulb size={14} color={tealMid} style={{ marginTop: 2, flexShrink: 0 }} /> {r.text}</span> },
    { key: 'type', label: 'Type', render: (r) => <Tag tone="neutral">{r.type}</Tag> },
    { key: 'linked', label: 'Linked to', render: (r) => <Tag>Decision {r.linked}</Tag> },
    { key: 'conf', label: 'Confidence', align: 'center', render: (r) => <ConfDonut pct={r.conf} /> },
    { key: 'status', label: 'Status', align: 'right', render: (r) => <StatusPill status={r.status} /> },
  ];
  return (
    <SimSidebarShell nav={MENTOR_NAV} active="assumptions" user={TEACHER}>
      <PageHead title="Assumption Log" subtitle="Blue Horizon · Round 10" right={<OutlineButton><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Plus size={15} /> Add assumption</span></OutlineButton>} />
      <DataTable columns={cols} rows={ASMS} getKey={(r) => r.text} />
      <div style={{ marginTop: 14, textAlign: 'right' }}><GhostButton>View all assumptions →</GhostButton></div>
    </SimSidebarShell>
  );
}

/* ════════════ 76 · Teacher Quick Feedback ════════════ */
const QUICK_TAGS = ['Great Insight', 'Think Deeper', 'Check Data', 'Good Adjustment', 'Watch This', 'Clarify Assumption'];
export function SimMentorFeedback() {
  const router = useRouter();
  const [picked, setPicked] = useState<string[]>(['Great Insight']);
  const [note, setNote] = useState('Great job connecting price sensitivity to your decision. Consider testing a premium tier next round as you mentioned.');
  const [vis, setVis] = useState<'team' | 'private'>('team');
  const toggle = (t: string) => setPicked((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));
  return (
    <SimSidebarShell nav={MENTOR_NAV} active="feedback" user={TEACHER}>
      <PageHead title="Teacher Quick Feedback" subtitle="Blue Horizon · Round 10" />
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: 18, alignItems: 'start' }}>
        <DeckCard style={{ padding: 24 }}>
          <Eyebrow>Reflection source</Eyebrow>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginTop: 12, marginBottom: 20, background: surfaceSoft, border: '1px solid var(--sv-border)', borderRadius: 10, padding: '12px 14px' }}>
            <span style={{ width: 34, height: 34, borderRadius: 9, background: cyanTint, color: tealMid, display: 'grid', placeItems: 'center', flexShrink: 0 }}><Mic size={16} /></span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 13.5, color: ink }}>Team Voice Note</div>
              <div style={{ fontFamily: DATA, fontSize: 11.5, color: faint }}>Captured May 23, 10:42 AM · 01:12</div>
            </div>
            <button onClick={() => router.push('/sim/mentor/transcript')} style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 12.5, color: tealMid, background: 'none', border: 'none', cursor: 'pointer' }}>View</button>
          </div>

          <Eyebrow>Quick feedback</Eyebrow>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginTop: 12 }}>
            {QUICK_TAGS.map((t) => {
              const on = picked.includes(t);
              return (
                <button key={t} onClick={() => toggle(t)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: DISPLAY, fontWeight: 600, fontSize: 13, color: on ? '#fff' : body, background: on ? cyan : 'var(--game-surface-solid)', border: '1.4px solid ' + (on ? cyan : 'var(--sv-border)'), borderRadius: 999, padding: '8px 15px', cursor: 'pointer' }}>
                  {on && <Check size={13} color="#fff" />}{t}
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: 20 }}>
            <Eyebrow>Feedback note</Eyebrow>
            <textarea value={note} onChange={(e) => setNote(e.target.value.slice(0, 300))} style={{ width: '100%', minHeight: 110, marginTop: 12, fontFamily: DATA, fontSize: 14, lineHeight: 1.6, color: ink, background: surfaceSoft, border: '1px solid var(--sv-border)', borderRadius: 8, padding: 14, resize: 'vertical' }} />
            <div style={{ fontFamily: DATA, fontSize: 11.5, color: faint, marginTop: 6, textAlign: 'right' }}>{note.length}/300 characters</div>
          </div>
        </DeckCard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <DeckCard>
            <Eyebrow>Visibility</Eyebrow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
              {([['team', 'Team only'], ['private', 'Private (teacher only)']] as const).map(([id, lbl]) => (
                <button key={id} onClick={() => setVis(id)} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}>
                  <span style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid ' + (vis === id ? cyan : 'var(--sv-border)'), display: 'grid', placeItems: 'center', flexShrink: 0 }}>{vis === id && <span style={{ width: 8, height: 8, borderRadius: '50%', background: cyan }} />}</span>
                  <span style={{ fontFamily: DATA, fontSize: 13.5, color: body }}>{lbl}</span>
                </button>
              ))}
            </div>
          </DeckCard>
          <DeckCard style={{ padding: 18 }}>
            <CtaButton full onClick={() => router.push('/sim/mentor/summary')}>Send feedback</CtaButton>
            <div style={{ marginTop: 10, textAlign: 'center' }}><GhostButton onClick={() => router.push('/sim/mentor')}>Cancel</GhostButton></div>
          </DeckCard>
        </div>
      </div>
    </SimSidebarShell>
  );
}
