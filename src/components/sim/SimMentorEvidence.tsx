'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mic, FileText, Lightbulb, Flag, AlertTriangle, Download, Star, Plus, Check,
} from '../PixelIcons';
import { SimSidebarShell, MENTOR_NAV, PageHead, DeckCard, DeckStat, StatusPill } from './SimShell';
import { DataTable, Col, SelectInput, SearchInput } from './admin-ui';
import { CtaButton, OutlineButton, GhostButton, Eyebrow, Tag, DISPLAY, DATA, ink, body, muted, faint, cyan, tealMid, success, negative, warning, positive, cyanTint, whisper, surfaceSoft } from './sim-ui';

const TEACHER = { name: 'Mrs. Johnson', role: 'Science Teacher' };
type Cmp = React.ComponentType<{ size?: number; color?: string }>;

/* ════════════ 78 · Evidence Timeline ════════════ */
interface TLItem { icon: Cmp; title: string; time: string; tag?: string }
const TIMELINE: { round: string; date: string; items: TLItem[] }[] = [
  { round: 'Round 10', date: 'May 23', items: [
    { icon: Mic, title: 'Team Voice Reflection', time: '10:42 AM', tag: 'transcribed' },
    { icon: FileText, title: 'Decision D-34 · Pricing Adjustment', time: '10:15 AM' },
  ] },
  { round: 'Round 9', date: 'May 16', items: [
    { icon: Mic, title: 'Team Voice Reflection', time: '11:02 AM', tag: 'transcribed' },
    { icon: Lightbulb, title: 'Assumption A-21 · Price Sensitivity', time: '10:47 AM' },
  ] },
  { round: 'Round 8', date: 'May 9', items: [
    { icon: Mic, title: 'Student Voice Note (Alex J.)', time: '02:00 PM', tag: 'transcribed' },
    { icon: FileText, title: 'Decision D-28 · Marketing Spend', time: '01:55 PM' },
  ] },
];
export function SimMentorTimeline() {
  const router = useRouter();
  const [round, setRound] = useState('All Rounds');
  return (
    <SimSidebarShell nav={MENTOR_NAV} active="timeline" user={TEACHER}>
      <PageHead title="Evidence Timeline" subtitle="Blue Horizon" right={<div style={{ width: 180 }}><SelectInput value={round} onChange={setRound} options={['All Rounds', 'Round 10', 'Round 9', 'Round 8']} /></div>} />
      <DeckCard style={{ padding: 24, maxWidth: 760 }}>
        {TIMELINE.map((grp, gi) => (
          <div key={grp.round} style={{ display: 'flex', gap: 16 }}>
            {/* rail */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 64, flexShrink: 0 }}>
              <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 13, color: ink }}>{grp.round.replace('Round ', 'R')}</span>
              <span style={{ fontFamily: DATA, fontSize: 11, color: faint }}>{grp.date}</span>
              <span style={{ width: 1.5, flex: 1, background: 'var(--sv-border)', marginTop: 8, minHeight: 40 }} />
            </div>
            {/* items */}
            <div style={{ flex: 1, paddingBottom: gi < TIMELINE.length - 1 ? 14 : 0 }}>
              {grp.items.map((it) => {
                const Icon = it.icon;
                return (
                  <div key={it.title} style={{ display: 'flex', alignItems: 'center', gap: 12, background: surfaceSoft, border: '1px solid var(--sv-border)', borderRadius: 10, padding: '12px 14px', marginBottom: 10 }}>
                    <span style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--game-surface-solid)', color: tealMid, display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon size={15} /></span>
                    <span style={{ flex: 1, fontFamily: DATA, fontSize: 13.5, fontWeight: 600, color: ink }}>{it.title}</span>
                    {it.tag && <StatusPill status={it.tag} />}
                    <span style={{ fontFamily: DATA, fontSize: 12, color: faint, fontVariantNumeric: 'tabular-nums' }}>{it.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </DeckCard>
      <div style={{ marginTop: 14 }}><OutlineButton onClick={() => router.push('/sim/mentor/evidence')}>View full timeline</OutlineButton></div>
    </SimSidebarShell>
  );
}

/* ════════════ 79 · Mentor Summary View ════════════ */
export function SimMentorSummary() {
  const router = useRouter();
  const INSIGHTS = [
    'Clear link between pricing decision and market data.',
    'Strong focus on brand awareness and long-term growth.',
    'Consider scenario planning for competitor promotions.',
  ];
  const FLAGS = [
    { icon: Flag, color: negative, text: 'Assumption A-21 confidence is below 60%.' },
    { icon: AlertTriangle, color: warning, text: 'Margins have declined for 2 consecutive rounds.' },
  ];
  return (
    <SimSidebarShell nav={MENTOR_NAV} active="summary" user={TEACHER}>
      <PageHead title="Mentor Summary" subtitle="Blue Horizon · Round 10" right={<CtaButton onClick={() => router.push('/sim/mentor/feedback')}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Plus size={14} /> Add mentor note</span></CtaButton>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        <DeckStat label="Reflections this round" value="2" />
        <DeckStat label="Key themes detected" value="3" />
        <DeckStat label="Assumptions reviewed" value="4" />
        <DeckStat label="Coaching notes" value="1" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: 18, alignItems: 'start' }}>
        <DeckCard style={{ padding: 22 }}>
          <Eyebrow>Top insights</Eyebrow>
          <ul style={{ margin: '14px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 11 }}>
            {INSIGHTS.map((t) => (
              <li key={t} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontFamily: DATA, fontSize: 14, color: body }}>
                <Star size={15} color={tealMid} style={{ marginTop: 1, flexShrink: 0 }} /> {t}
              </li>
            ))}
          </ul>
        </DeckCard>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <DeckCard style={{ padding: 20 }}>
            <Eyebrow>Flags</Eyebrow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
              {FLAGS.map((f) => { const I = f.icon; return (
                <div key={f.text} style={{ display: 'flex', gap: 9, alignItems: 'flex-start', fontFamily: DATA, fontSize: 13, color: body }}>
                  <I size={15} color={f.color} style={{ marginTop: 1, flexShrink: 0 }} /> {f.text}
                </div>
              ); })}
            </div>
          </DeckCard>
          <DeckCard style={{ padding: 20, background: 'var(--cyan-tint)', border: '1.4px solid var(--game-cyan)' }}>
            <Eyebrow>Next coaching focus</Eyebrow>
            <p style={{ fontFamily: DISPLAY, fontSize: 14.5, lineHeight: 1.6, color: ink, marginTop: 10 }}>Help the team explore a premium tier and unit economics.</p>
          </DeckCard>
        </div>
      </div>
    </SimSidebarShell>
  );
}

/* ════════════ 80 · Learning Evidence Hub ════════════ */
interface Ev { type: string; icon: Cmp; title: string; team: string; round: string; date: string }
const EVID: Ev[] = [
  { type: 'Voice', icon: Mic, title: 'Team Voice Reflection', team: 'Blue Horizon', round: 'R10', date: 'May 23' },
  { type: 'Decision', icon: FileText, title: 'Decision D-34', team: 'Blue Horizon', round: 'R10', date: 'May 23' },
  { type: 'Assumption', icon: Lightbulb, title: 'Assumption A-21', team: 'Blue Horizon', round: 'R9', date: 'May 16' },
  { type: 'Voice', icon: Mic, title: 'Student Voice (Alex J.)', team: 'Blue Horizon', round: 'R8', date: 'May 9' },
  { type: 'Decision', icon: FileText, title: 'Decision D-28', team: 'Blue Horizon', round: 'R8', date: 'May 9' },
];
export function SimMentorEvidenceHub() {
  const [q, setQ] = useState('');
  const [type, setType] = useState('All Types');
  const [round, setRound] = useState('All Rounds');
  const [team, setTeam] = useState('All Teams');
  const cols: Col<Ev>[] = [
    { key: 'type', label: 'Type', render: (r) => { const I = r.icon; return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: tealMid }}><I size={14} /> {r.type}</span>; } },
    { key: 'title', label: 'Title', render: (r) => <span style={{ fontWeight: 600, color: ink }}>{r.title}</span> },
    { key: 'team', label: 'Team', render: (r) => <span style={{ color: body }}>{r.team}</span> },
    { key: 'round', label: 'Round', render: (r) => <span style={{ color: muted, fontVariantNumeric: 'tabular-nums' }}>{r.round}</span> },
    { key: 'date', label: 'Date', render: (r) => <span style={{ color: muted }}>{r.date}</span> },
    { key: 'dl', label: '', align: 'right', render: () => <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: tealMid, display: 'grid', placeItems: 'center' }}><Download size={15} /></button> },
  ];
  const rows = EVID.filter((e) => (type === 'All Types' || e.type === type.replace(/s$/, '')) && (q === '' || e.title.toLowerCase().includes(q.toLowerCase())));
  return (
    <SimSidebarShell nav={MENTOR_NAV} active="evidence" user={TEACHER}>
      <PageHead title="Learning Evidence Hub" subtitle="Search, filter, and export every captured artifact." />
      <DeckCard style={{ padding: 16, marginBottom: 16 }}>
        <SearchInput value={q} onChange={setQ} placeholder="Search evidence (keywords, tags, speakers…)" />
        <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ width: 150 }}><SelectInput value={type} onChange={setType} options={['All Types', 'Voices', 'Decisions', 'Assumptions']} /></div>
          <div style={{ width: 150 }}><SelectInput value={round} onChange={setRound} options={['All Rounds', 'R10', 'R9', 'R8']} /></div>
          <div style={{ width: 150 }}><SelectInput value={team} onChange={setTeam} options={['All Teams', 'Blue Horizon', 'Growth Gurus']} /></div>
          <GhostButton onClick={() => { setType('All Types'); setRound('All Rounds'); setTeam('All Teams'); setQ(''); }}>Clear</GhostButton>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 7 }}>{['Pricing', 'Marketing Spend', 'Brand Awareness'].map((t) => <Tag key={t}>{t}</Tag>)}<Tag tone="neutral">+2</Tag></div>
        </div>
      </DeckCard>
      <DataTable columns={cols} rows={rows} getKey={(r) => r.title + r.round} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
        <span style={{ fontFamily: DATA, fontSize: 12.5, color: faint }}>Showing 1–{rows.length} of 48</span>
        <div style={{ display: 'flex', gap: 10 }}>
          <OutlineButton>Export selected</OutlineButton>
          <CtaButton><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Download size={14} /> Download all</span></CtaButton>
        </div>
      </div>
    </SimSidebarShell>
  );
}
