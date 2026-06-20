'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MessageSquare, Megaphone, ThumbsUp, FileText, Download, Pencil, Eye, Plus, Check, BarChart3, Copy,
} from '../PixelIcons';
import { SimSidebarShell, TEACHER_NAV, PageHead, DeckCard, DeckStat, StatusPill } from './SimShell';
import { DataTable, Col, SelectInput, FilterTabs, BarChart, Segmented } from './admin-ui';
import { CtaButton, OutlineButton, GhostButton, Eyebrow, Tag, DISPLAY, DATA, ink, body, muted, faint, cyan, tealMid, success, negative, warning, positive, cyanTint, whisper, surfaceSoft } from './sim-ui';

const TEACHER = { name: 'Mrs. Johnson', role: 'Science Teacher' };

/* ════════════ 44 · Team Detail View ════════════ */
export function SimTeacherTeamDetail() {
  const router = useRouter();
  const [team, setTeam] = useState('Beta');
  const [tab, setTab] = useState('Overview');
  const GLANCE: [string, string, string, 'up' | 'down' | 'warn' | 'flat'][] = [
    ['Cash Balance', '$1,250,000', '+8%', 'up'],
    ['Inventory Health', '78%', '+5%', 'up'],
    ['Customer Satisfaction', '82%', '-2%', 'down'],
    ['Risk Exposure', 'Medium', '', 'warn'],
  ];
  return (
    <SimSidebarShell nav={TEACHER_NAV} active="sessions" user={TEACHER}>
      <PageHead title={`Team ${team}`} subtitle="Supply Chain Disruption · Round 3 of 5" right={<div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><div style={{ width: 130 }}><SelectInput value={team} onChange={setTeam} options={['Alpha', 'Beta', 'Gamma', 'Delta']} /></div><OutlineButton>Open team view</OutlineButton></div>} />
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--sv-border)', marginBottom: 20 }}>
        {['Overview', 'Decisions', 'Financials', 'People', 'Notes'].map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ fontFamily: DISPLAY, fontWeight: tab === t ? 700 : 600, fontSize: 13.5, padding: '10px 14px', border: 'none', background: 'none', cursor: 'pointer', color: tab === t ? tealMid : muted, borderBottom: '2px solid ' + (tab === t ? cyan : 'transparent'), marginBottom: -1 }}>{t}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 16 }}>
        <DeckStat label="Decision submitted" value="10:32 AM" />
        <DeckStat label="Current score" value="68 / 100" delta="+6 vs R2" tone="up" />
        <DeckStat label="Rank" value="2 / 7" delta="▲ 1" tone="up" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 18 }}>
        <DeckStat label="Engagement" value="High" tone="up" />
        <DeckStat label="Participation" value="6 / 7" sub="members active" />
        <DeckStat label="Help requests" value="1" sub="open" tone="warn" />
      </div>
      <DeckCard style={{ padding: 22 }}>
        <Eyebrow>At a glance</Eyebrow>
        <div style={{ marginTop: 12 }}>
          {GLANCE.map(([k, v, d, tone], i) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderTop: i ? '1px solid var(--sv-border)' : 'none' }}>
              <span style={{ fontFamily: DATA, fontSize: 13.5, color: body }}>{k}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: DATA, fontWeight: 700, fontSize: 14, color: ink, fontVariantNumeric: 'tabular-nums' }}>{v}</span>
                {d && <span style={{ fontFamily: DATA, fontSize: 12.5, fontWeight: 700, color: tone === 'up' ? positive : tone === 'down' ? negative : warning }}>{d}</span>}
                {!d && <Tag tone="warn">Medium</Tag>}
              </span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 18 }}><CtaButton full onClick={() => router.push('/sim/teacher/feedback')}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><MessageSquare size={14} /> Send message to team</span></CtaButton></div>
      </DeckCard>
    </SimSidebarShell>
  );
}

/* ════════════ 45 · Decision Comparison ════════════ */
interface Driver { driver: string; top: string; low: string; spread: string }
const DRIVERS: Driver[] = [
  { driver: 'Pricing Strategy', top: 'High Value (Alpha)', low: 'Discount (Eta)', spread: '$220K' },
  { driver: 'Inventory Investment', top: 'Aggressive (Alpha)', low: 'Conservative (Eta)', spread: '$180K' },
  { driver: 'Marketing Spend', top: 'Targeted (Beta)', low: 'Minimal (Eta)', spread: '$140K' },
  { driver: 'Supplier Diversification', top: 'High (Alpha)', low: 'Low (Zeta)', spread: '$100K' },
];
export function SimTeacherCompare() {
  const [round, setRound] = useState('Round 3 Decisions');
  const [metric, setMetric] = useState('Profit Impact');
  const cols: Col<Driver>[] = [
    { key: 'driver', label: 'Driver', render: (r) => <span style={{ fontWeight: 600, color: ink }}>{r.driver}</span> },
    { key: 'top', label: 'Top performing', render: (r) => <span style={{ color: positive, fontWeight: 600 }}>{r.top}</span> },
    { key: 'low', label: 'Lowest', render: (r) => <span style={{ color: negative, fontWeight: 600 }}>{r.low}</span> },
    { key: 'spread', label: 'Spread', align: 'right', render: (r) => <span style={{ fontWeight: 700, color: ink, fontVariantNumeric: 'tabular-nums' }}>{r.spread}</span> },
  ];
  return (
    <SimSidebarShell nav={TEACHER_NAV} active="sessions" user={TEACHER}>
      <PageHead title="Decision Comparison" subtitle="Compare team decisions and projected impact." right={<OutlineButton><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Download size={15} /> Export comparison</span></OutlineButton>} />
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div style={{ width: 210 }}><SelectInput value={round} onChange={setRound} options={['Round 3 Decisions', 'Round 2 Decisions', 'Round 1 Decisions']} /></div>
        <div style={{ width: 180 }}><SelectInput value={metric} onChange={setMetric} options={['Profit Impact', 'Market Share', 'ROI']} /></div>
      </div>
      <DeckCard style={{ padding: 22, marginBottom: 18 }}>
        <Eyebrow>Projected profit impact ($)</Eyebrow>
        <div style={{ marginTop: 12 }}>
          <BarChart data={[{ label: 'Alpha', value: 520000 }, { label: 'Beta', value: 410000 }, { label: 'Gamma', value: 280000 }, { label: 'Delta', value: 150000 }, { label: 'Epsilon', value: 60000 }, { label: 'Zeta', value: -40000 }, { label: 'Eta', value: -120000 }]} height={210} />
        </div>
      </DeckCard>
      <div style={{ marginBottom: 12 }}><Eyebrow>Key drivers</Eyebrow></div>
      <DataTable columns={cols} rows={DRIVERS} getKey={(r) => r.driver} />
    </SimSidebarShell>
  );
}

/* ════════════ 46 · Broadcast / Announcement ════════════ */
export function SimTeacherBroadcast() {
  const router = useRouter();
  const [tab, setTab] = useState('broadcast');
  const [target, setTarget] = useState<'all' | 'selected' | 'observers'>('all');
  const [type, setType] = useState('Announcement');
  const [msg, setMsg] = useState('');
  return (
    <SimSidebarShell nav={TEACHER_NAV} active="sessions" user={TEACHER}>
      <PageHead title="Broadcast" subtitle="Send announcements and prompts to your class." />
      <div style={{ marginBottom: 16 }}><FilterTabs tabs={[{ id: 'broadcast', label: 'Broadcast' }, { id: 'history', label: 'History' }]} active={tab} onChange={setTab} /></div>
      <DeckCard style={{ padding: 24, maxWidth: 760 }}>
        <Eyebrow>Send to</Eyebrow>
        <div style={{ display: 'flex', gap: 18, marginTop: 12, marginBottom: 20 }}>
          {([['all', 'All teams'], ['selected', 'Selected teams'], ['observers', 'Observers']] as const).map(([id, lbl]) => (
            <button key={id} onClick={() => setTarget(id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <span style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid ' + (target === id ? cyan : 'var(--sv-border)'), display: 'grid', placeItems: 'center', flexShrink: 0 }}>{target === id && <span style={{ width: 8, height: 8, borderRadius: '50%', background: cyan }} />}</span>
              <span style={{ fontFamily: DATA, fontSize: 13.5, color: body }}>{lbl}</span>
            </button>
          ))}
        </div>
        <Eyebrow>Message type</Eyebrow>
        <div style={{ marginTop: 12, marginBottom: 20 }}><Segmented options={['Announcement', 'Hint', 'Alert', 'Info']} value={type} onChange={setType} /></div>
        <Eyebrow>Message</Eyebrow>
        <textarea value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Type your message here…" style={{ width: '100%', minHeight: 120, marginTop: 12, fontFamily: DATA, fontSize: 14, lineHeight: 1.6, color: ink, background: surfaceSoft, border: '1px solid var(--sv-border)', borderRadius: 8, padding: 14, resize: 'vertical' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Resource', 'Template', 'File'].map((a) => <button key={a} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: DATA, fontSize: 12.5, fontWeight: 600, color: muted, background: surfaceSoft, border: '1px solid var(--sv-border)', borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }}><Plus size={13} /> {a}</button>)}
          </div>
          <CtaButton disabled={msg.trim().length === 0} reason={msg.trim().length === 0 ? 'Write a message' : undefined} onClick={() => { setMsg(''); router.push('/sim/teacher/live'); }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Megaphone size={14} /> Send broadcast</span></CtaButton>
        </div>
      </DeckCard>
    </SimSidebarShell>
  );
}

/* ════════════ 48 · Reflection Review ════════════ */
interface Refl { letter: string; team: string; time: string; text: string; tag: 'Insightful' | 'Actionable' }
const REFLS: Refl[] = [
  { letter: 'A', team: 'Team Alpha', time: '10:15 AM', text: "We underestimated lead time risk. Next round we'll increase safety stock.", tag: 'Insightful' },
  { letter: 'B', team: 'Team Beta', time: '10:16 AM', text: 'We focused too much on price. Need better balance with quality.', tag: 'Insightful' },
  { letter: 'D', team: 'Team Delta', time: '10:17 AM', text: 'Cash flow got tight in the round. Should have managed receivables better.', tag: 'Actionable' },
];
export function SimTeacherReflections() {
  const [round, setRound] = useState('Round 2 Reflection');
  const [team, setTeam] = useState('All Teams');
  return (
    <SimSidebarShell nav={TEACHER_NAV} active="sessions" user={TEACHER}>
      <PageHead title="Reflection Review" subtitle="Read team reflections and tag for debrief." right={<OutlineButton><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Download size={15} /> Export reflections</span></OutlineButton>} />
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div style={{ width: 210 }}><SelectInput value={round} onChange={setRound} options={['Round 2 Reflection', 'Round 1 Reflection']} /></div>
        <div style={{ width: 160 }}><SelectInput value={team} onChange={setTeam} options={['All Teams', 'Team Alpha', 'Team Beta']} /></div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {REFLS.map((r) => (
          <DeckCard key={r.team} style={{ padding: 18, display: 'flex', gap: 14 }}>
            <span style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--game-cyan), var(--game-teal-mid))', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: DATA, fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{r.letter}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, color: ink }}>{r.team}</span>
                <span style={{ fontFamily: DATA, fontSize: 11.5, color: faint }}>{r.time}</span>
              </div>
              <p style={{ fontFamily: DATA, fontSize: 13.5, lineHeight: 1.55, color: body, margin: '6px 0 10px' }}>{r.text}</p>
              <Tag tone={r.tag === 'Actionable' ? 'warn' : 'cyan'}>{r.tag}</Tag>
            </div>
          </DeckCard>
        ))}
      </div>
    </SimSidebarShell>
  );
}

/* ════════════ 49 · Teacher Feedback Panel ════════════ */
const FB_TYPES = ['Praise', 'Coaching', 'Alert', 'Note'];
export function SimTeacherFeedback() {
  const router = useRouter();
  const [team, setTeam] = useState('Team Beta');
  const [type, setType] = useState('Praise');
  const [note, setNote] = useState('');
  const [vis, setVis] = useState<'team' | 'private'>('team');
  const typeColor = (t: string) => t === 'Praise' ? positive : t === 'Coaching' ? tealMid : t === 'Alert' ? negative : muted;
  return (
    <SimSidebarShell nav={TEACHER_NAV} active="sessions" user={TEACHER}>
      <PageHead title="Teacher Feedback" subtitle="Send contextual feedback to a team." />
      <DeckCard style={{ padding: 24, maxWidth: 700 }}>
        <Eyebrow>Provide feedback to</Eyebrow>
        <div style={{ marginTop: 12, marginBottom: 20 }}><SelectInput value={team} onChange={setTeam} options={['Team Alpha', 'Team Beta', 'Team Gamma', 'Team Delta']} /></div>
        <Eyebrow>Feedback type</Eyebrow>
        <div style={{ display: 'flex', gap: 9, marginTop: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          {FB_TYPES.map((t) => {
            const on = type === t;
            return <button key={t} onClick={() => setType(t)} style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 13, color: on ? '#fff' : typeColor(t), background: on ? typeColor(t) : 'var(--game-surface-solid)', border: '1.4px solid ' + (on ? typeColor(t) : 'var(--sv-border)'), borderRadius: 999, padding: '8px 16px', cursor: 'pointer' }}>{t}</button>;
          })}
        </div>
        <Eyebrow>Feedback</Eyebrow>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Write your feedback here…" style={{ width: '100%', minHeight: 110, marginTop: 12, fontFamily: DATA, fontSize: 14, lineHeight: 1.6, color: ink, background: surfaceSoft, border: '1px solid var(--sv-border)', borderRadius: 8, padding: 14, resize: 'vertical' }} />
        <div style={{ display: 'flex', gap: 18, marginTop: 16 }}>
          {([['team', 'Team only'], ['private', 'Private (teacher only)']] as const).map(([id, lbl]) => (
            <button key={id} onClick={() => setVis(id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <span style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid ' + (vis === id ? cyan : 'var(--sv-border)'), display: 'grid', placeItems: 'center', flexShrink: 0 }}>{vis === id && <span style={{ width: 8, height: 8, borderRadius: '50%', background: cyan }} />}</span>
              <span style={{ fontFamily: DATA, fontSize: 13.5, color: body }}>{lbl}</span>
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}><CtaButton disabled={note.trim().length === 0} reason={note.trim().length === 0 ? 'Write feedback first' : undefined} onClick={() => { setNote(''); router.push('/sim/teacher/live'); }}>Send feedback</CtaButton></div>
      </DeckCard>
    </SimSidebarShell>
  );
}

/* ════════════ 50 · Debrief Pack Overview ════════════ */
interface Doc { title: string; fmt: string; desc: string; action: 'View' | 'Edit' | 'Download' }
const DOCS: Doc[] = [
  { title: 'Session Summary', fmt: 'PDF', desc: 'Overview, timeline, key metrics', action: 'View' },
  { title: 'Team Scorecard', fmt: 'PDF', desc: 'Scores, ranks, decision quality', action: 'View' },
  { title: 'Decision Analysis', fmt: 'PDF', desc: 'Comparisons, drivers, insights', action: 'View' },
  { title: 'Reflection Summary', fmt: 'PDF', desc: 'Themes, takeaways, quotes', action: 'View' },
  { title: 'Teaching Notes', fmt: 'DOCX', desc: 'Suggested debrief talking points', action: 'Edit' },
  { title: 'Student Artifacts', fmt: 'ZIP', desc: 'Decisions, reflections, work', action: 'Download' },
];
export function SimTeacherDebrief() {
  const actionIcon = (a: string) => a === 'Edit' ? Pencil : a === 'Download' ? Download : Eye;
  return (
    <SimSidebarShell nav={TEACHER_NAV} active="sessions" user={TEACHER}>
      <PageHead title="Debrief Pack" subtitle="Supply Chain Disruption · auto-generated" right={<OutlineButton>Preview pack</OutlineButton>} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {DOCS.map((d) => { const I = actionIcon(d.action); return (
          <DeckCard key={d.title} style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ width: 40, height: 40, borderRadius: 10, background: cyanTint, color: tealMid, display: 'grid', placeItems: 'center', flexShrink: 0 }}><FileText size={18} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 14.5, color: ink }}>{d.title}</span>
                <Tag tone="neutral">{d.fmt}</Tag>
              </div>
              <div style={{ fontFamily: DATA, fontSize: 12.5, color: muted, marginTop: 3 }}>{d.desc}</div>
            </div>
            <OutlineButton><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><I size={14} /> {d.action}</span></OutlineButton>
          </DeckCard>
        ); })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
        <CtaButton><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Download size={14} /> Download all pack (ZIP)</span></CtaButton>
      </div>
    </SimSidebarShell>
  );
}
