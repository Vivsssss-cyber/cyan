'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Play, Pencil, Truck, AlertTriangle, Check, X, Plus, Target, BarChart3, Users, Clock,
} from '../PixelIcons';
import { SimSidebarShell, PageHead, DeckStat, DeckCard, StatusPill } from './SimShell';
import { ADMIN_NAV, ADMIN_USER, DataTable, Col, FilterTabs, Field, SelectInput, TextArea, LineChart } from './admin-ui';
import { CtaButton, OutlineButton, Eyebrow, Tag, DISPLAY, DATA, ink, body, muted, faint, cyan, tealMid, success, negative, warning, positive, cyanTint, whisper, surfaceSoft } from './sim-ui';

function Impact({ level }: { level: string }) {
  const c = level === 'High' ? negative : level === 'Medium' ? warning : level === 'Low' ? positive : faint;
  return <span style={{ fontFamily: DATA, fontSize: 12, fontWeight: 700, color: c }}>{level}</span>;
}
function Hero({ h = 200, title, sub }: { h?: number; title?: string; sub?: string }) {
  return (
    <div style={{ height: h, borderRadius: 14, background: 'linear-gradient(135deg, #003D47, #006E85 70%, #00A0C2)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 22 }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.16, backgroundImage: 'radial-gradient(circle at 80% 15%, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      <Truck size={34} color="#9FD6E4" style={{ position: 'absolute', top: 18, left: 22, opacity: 0.85 }} />
      {title && <div style={{ position: 'relative', fontFamily: DISPLAY, fontWeight: 800, fontSize: 22, color: '#fff', letterSpacing: '-0.4px' }}>{title}</div>}
      {sub && <div style={{ position: 'relative', fontFamily: DATA, fontSize: 13, color: '#CDEAF2', marginTop: 6, maxWidth: '52ch', lineHeight: 1.5 }}>{sub}</div>}
    </div>
  );
}

/* ════════════ 16 · Scenario Preview – Teacher ════════════ */
const FLOW = [
  { round: 'Round 1', window: '0 – 30 min', events: [{ name: 'Supplier Delay', at: '10 min', impact: 'Medium' }, { name: 'Port Congestion', at: '20 min', impact: 'High' }] },
  { round: 'Round 2', window: '30 – 60 min', events: [{ name: 'Demand Spike', at: '35 min', impact: 'High' }, { name: 'Logistics Strike', at: '50 min', impact: 'Medium' }] },
  { round: 'Round 3', window: '60 – 90 min', events: [{ name: 'FX Volatility', at: '65 min', impact: 'Low' }, { name: 'Regulatory Change', at: '80 min', impact: 'High' }] },
];
export function SimAdminPreviewTeacher() {
  const router = useRouter();
  const [tab, setTab] = useState('timeline');
  return (
    <SimSidebarShell nav={ADMIN_NAV} active="scenarios" user={ADMIN_USER}>
      <PageHead title="Teacher Preview" subtitle="Review the full scenario as an instructor." right={<div style={{ display: 'flex', gap: 10 }}><OutlineButton onClick={() => router.push('/sim/admin/canvas')}>Edit scenario</OutlineButton><CtaButton onClick={() => router.push('/sim/admin/balance')}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Play size={14} /> Run simulation</span></CtaButton></div>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14, marginBottom: 20 }}>
        <DeckStat label="Rounds" value="3" /><DeckStat label="Events" value="6" /><DeckStat label="KPIs" value="5" /><DeckStat label="Est. minutes" value="90" /><DeckStat label="Difficulty" value="Medium" />
      </div>
      <div style={{ marginBottom: 16 }}><FilterTabs tabs={[{ id: 'timeline', label: 'Timeline' }, { id: 'flow', label: 'Event Flow' }, { id: 'kpi', label: 'KPI Impact' }, { id: 'materials', label: 'Materials' }]} active={tab} onChange={setTab} /></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {FLOW.map((r) => (
          <DeckCard key={r.round} style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: cyan }} />
              <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 16, color: ink }}>{r.round}</span>
              <span style={{ fontFamily: DATA, fontSize: 12.5, color: faint, fontVariantNumeric: 'tabular-nums' }}>{r.window}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {r.events.map((e) => (
                <div key={e.name} style={{ display: 'flex', alignItems: 'center', gap: 12, background: surfaceSoft, border: '1px solid var(--sv-border)', borderRadius: 10, padding: '11px 14px' }}>
                  <AlertTriangle size={15} color={e.impact === 'High' ? negative : e.impact === 'Medium' ? warning : positive} />
                  <span style={{ flex: 1, fontFamily: DATA, fontSize: 13.5, fontWeight: 600, color: ink }}>{e.name}</span>
                  <span style={{ fontFamily: DATA, fontSize: 12.5, color: muted, fontVariantNumeric: 'tabular-nums' }}>{e.at}</span>
                  <Impact level={`${e.impact} Impact`} />
                </div>
              ))}
            </div>
          </DeckCard>
        ))}
      </div>
    </SimSidebarShell>
  );
}

/* ════════════ 17 · Scenario Preview – Student ════════════ */
const HOW = [
  { n: 1, title: 'Make decisions', desc: 'Allocate budgets, set prices, manage inventory and more.' },
  { n: 2, title: 'Respond to events', desc: 'Adapt to real-world disruptions and market changes.' },
  { n: 3, title: 'Track performance', desc: 'Beat targets and outperform other teams.' },
];
export function SimAdminPreviewStudent() {
  const router = useRouter();
  return (
    <SimSidebarShell nav={ADMIN_NAV} active="scenarios" user={ADMIN_USER}>
      <PageHead title="Student Preview" subtitle="See what students will experience." right={<CtaButton onClick={() => router.push('/sim/play')}>Enter as student</CtaButton>} />
      <Hero title="Global Supply Chain Challenge" sub="Lead your company through disruption, demand shifts, and strategic decisions to maximize long-term value." />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '16px 0 24px' }}>
        <Tag>3 Rounds</Tag><Tag tone="neutral">90 Minutes</Tag><Tag tone="neutral">Team Based</Tag><Tag tone="neutral">Data Driven</Tag>
      </div>
      <Eyebrow>How it works</Eyebrow>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginTop: 14 }}>
        {HOW.map((h) => (
          <DeckCard key={h.n} style={{ padding: 20 }}>
            <span style={{ width: 30, height: 30, borderRadius: '50%', background: cyanTint, color: tealMid, display: 'grid', placeItems: 'center', fontFamily: DATA, fontWeight: 800, fontSize: 14 }}>{h.n}</span>
            <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 15, color: ink, marginTop: 12 }}>{h.title}</div>
            <div style={{ fontFamily: DATA, fontSize: 13, color: muted, marginTop: 5, lineHeight: 1.5 }}>{h.desc}</div>
          </DeckCard>
        ))}
      </div>
      <DeckCard style={{ padding: 16, marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Eyebrow>Preview: Round 1</Eyebrow>
          <span style={{ fontFamily: DATA, fontSize: 13, color: body }}>Getting Started · <span style={{ color: faint, fontVariantNumeric: 'tabular-nums' }}>30 min</span></span>
        </div>
        <OutlineButton onClick={() => router.push('/sim/play')}>View details</OutlineButton>
      </DeckCard>
    </SimSidebarShell>
  );
}

/* ════════════ 18 · Balance Testing Dashboard ════════════ */
interface Test { run: string; date: string; teams: number; win: string; avg: string; bal: number; status: string }
const TESTS: Test[] = [
  { run: 'Test 6', date: 'May 9, 2025', teams: 24, win: '83%', avg: '72.1', bal: 72, status: 'Good' },
  { run: 'Test 5', date: 'May 6, 2025', teams: 24, win: '79%', avg: '70.3', bal: 74, status: 'Good' },
  { run: 'Test 4', date: 'May 2, 2025', teams: 24, win: '75%', avg: '68.4', bal: 71, status: 'Good' },
];
export function SimAdminBalance() {
  const router = useRouter();
  const [tab, setTab] = useState('over');
  const cols: Col<Test>[] = [
    { key: 'run', label: 'Test run', render: (r) => <span style={{ fontWeight: 600, color: ink }}>{r.run}<div style={{ fontFamily: DATA, fontSize: 11.5, color: faint, fontWeight: 400 }}>{r.date}</div></span> },
    { key: 'teams', label: 'Teams', render: (r) => <span style={{ fontVariantNumeric: 'tabular-nums', color: body }}>{r.teams}</span> },
    { key: 'win', label: 'Win rate', render: (r) => <span style={{ fontVariantNumeric: 'tabular-nums', color: body }}>{r.win}</span> },
    { key: 'avg', label: 'Avg score', render: (r) => <span style={{ fontVariantNumeric: 'tabular-nums', color: body }}>{r.avg}</span> },
    { key: 'bal', label: 'Balance', render: (r) => <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: ink }}>{r.bal}</span> },
    { key: 'status', label: 'Status', align: 'right', render: (r) => <span style={{ fontFamily: DATA, fontSize: 12.5, fontWeight: 700, color: success }}>{r.status}</span> },
  ];
  return (
    <SimSidebarShell nav={ADMIN_NAV} active="simulations" user={ADMIN_USER}>
      <PageHead title="Balance Testing" subtitle="Analyze scenario balance and performance before publishing." right={<CtaButton onClick={() => router.push('/sim/admin/versions')}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Play size={14} /> Run test</span></CtaButton>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        <DeckStat label="Balance score" value="72 / 100" delta="Good" tone="up" />
        <DeckStat label="Difficulty" value="Medium" sub="target" />
        <DeckStat label="Completion rate" value="78%" sub="across tests" />
        <DeckStat label="Avg margin of victory" value="12.4%" delta="target 10–15%" tone="up" />
      </div>
      <DeckCard style={{ padding: 20, marginBottom: 18 }}>
        <div style={{ marginBottom: 12 }}><FilterTabs tabs={[{ id: 'over', label: 'Balance Score Over Time' }, { id: 'win', label: 'Win Rate Distribution' }]} active={tab} onChange={setTab} /></div>
        <LineChart values={[58, 62, 68, 71, 74, 72]} labels={['Test 1', 'Test 2', 'Test 3', 'Test 4', 'Test 5', 'Test 6']} height={180} />
      </DeckCard>
      <div style={{ marginBottom: 12 }}><Eyebrow>Recent test results</Eyebrow></div>
      <DataTable columns={cols} rows={TESTS} getKey={(r) => r.run} />
    </SimSidebarShell>
  );
}

/* ════════════ 19 · Version History ════════════ */
interface Ver { v: string; date: string; by: string; change: string; impact: string }
const VERS: Ver[] = [
  { v: 'v1.3', date: 'May 9, 2025', by: 'Alex Morgan', change: 'Adjusted Demand Spike', impact: 'Medium' },
  { v: 'v1.2', date: 'May 7, 2025', by: 'Priya Shah', change: 'Updated KPI targets', impact: 'Low' },
  { v: 'v1.1', date: 'May 2, 2025', by: 'Jordan Lee', change: 'Revised event timing', impact: 'Medium' },
  { v: 'v1.0', date: 'Apr 29, 2025', by: 'Alex Morgan', change: 'Initial version', impact: '—' },
];
export function SimAdminVersions() {
  const router = useRouter();
  const cols: Col<Ver>[] = [
    { key: 'v', label: 'Version', render: (r) => <span style={{ fontWeight: 700, color: ink, fontVariantNumeric: 'tabular-nums' }}>{r.v}</span> },
    { key: 'date', label: 'Date', render: (r) => <span style={{ color: muted, fontVariantNumeric: 'tabular-nums' }}>{r.date}</span> },
    { key: 'by', label: 'Changed by', render: (r) => <span style={{ color: body }}>{r.by}</span> },
    { key: 'change', label: 'Change', render: (r) => <span style={{ color: body }}>{r.change}</span> },
    { key: 'impact', label: 'Impact', align: 'right', render: (r) => <Impact level={r.impact} /> },
  ];
  return (
    <SimSidebarShell nav={ADMIN_NAV} active="scenarios" user={ADMIN_USER}>
      <PageHead title="Version History" subtitle="Track changes to your scenario." right={<OutlineButton>View diff</OutlineButton>} />
      <DataTable columns={cols} rows={VERS} getKey={(r) => r.v} />
      <DeckCard style={{ padding: 22, marginTop: 18 }}>
        <Eyebrow>Version details — v1.3</Eyebrow>
        <ul style={{ margin: '14px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
          {['Increased impact of Demand Spike event (+15%)', 'Adjusted inventory holding cost (-5%)', 'Updated debrief prompt timing', 'No changes to KPI targets'].map((t) => (
            <li key={t} style={{ display: 'flex', gap: 9, alignItems: 'center', fontFamily: DATA, fontSize: 13.5, color: body }}>
              <Check size={15} color={success} /> {t}
            </li>
          ))}
        </ul>
        <div style={{ fontFamily: DATA, fontSize: 12, color: faint, marginTop: 16 }}>Changed by Alex Morgan on May 9, 2025, 9:15 AM</div>
      </DeckCard>
    </SimSidebarShell>
  );
}

/* ════════════ 20 · Publish Scenario Template ════════════ */
export function SimAdminPublish() {
  const router = useRouter();
  const [vis, setVis] = useState('Organization');
  const [access, setAccess] = useState('All Instructors');
  const [cats, setCats] = useState(['Supply Chain', 'Strategy']);
  const [catDraft, setCatDraft] = useState('');
  const [desc, setDesc] = useState('A realistic supply chain scenario with disruptions, demand shifts, and strategic decisions across three rounds.');
  return (
    <SimSidebarShell nav={ADMIN_NAV} active="scenarios" user={ADMIN_USER}>
      <PageHead title="Publish Scenario" subtitle="Make this scenario available to others." right={<div style={{ display: 'flex', gap: 10 }}><OutlineButton>Save as draft</OutlineButton><CtaButton onClick={() => router.push('/sim/teacher/library')}>Publish template</CtaButton></div>} />
      <div style={{ display: 'grid', gridTemplateColumns: '320px minmax(0,1fr)', gap: 20, alignItems: 'start' }}>
        <DeckCard style={{ padding: 16 }}>
          <Eyebrow>Template preview</Eyebrow>
          <div style={{ marginTop: 12 }}><Hero h={150} /></div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 16, color: ink, marginTop: 14 }}>Global Supply Chain Challenge</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}><Tag tone="neutral">v1.3</Tag><Tag tone="neutral">Medium</Tag><Tag tone="neutral">90 min</Tag></div>
        </DeckCard>

        <DeckCard style={{ padding: 24 }}>
          <Eyebrow>Publishing options</Eyebrow>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 16 }}>
            <Field label="Visibility"><SelectInput value={vis} onChange={setVis} options={['Organization', 'Public', 'Private']} /></Field>
            <Field label="Access"><SelectInput value={access} onChange={setAccess} options={['All Instructors', 'Selected Instructors', 'Admins only']} /></Field>
            <Field label="Categories">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', background: surfaceSoft, border: '1px solid var(--sv-border)', borderRadius: 8, padding: '8px 10px' }}>
                {cats.map((c) => (
                  <span key={c} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: DATA, fontSize: 12.5, fontWeight: 600, color: tealMid, background: cyanTint, borderRadius: 999, padding: '4px 10px' }}>
                    {c}<button onClick={() => setCats(cats.filter((x) => x !== c))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: tealMid, display: 'grid' }}><X size={12} /></button>
                  </span>
                ))}
                <input value={catDraft} onChange={(e) => setCatDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && catDraft.trim()) { setCats([...cats, catDraft.trim()]); setCatDraft(''); } }} placeholder="Add…" style={{ flex: 1, minWidth: 80, border: 'none', outline: 'none', background: 'transparent', fontFamily: DATA, fontSize: 13, color: ink }} />
              </div>
            </Field>
            <Field label="Description"><TextArea value={desc} onChange={(e) => setDesc(e.target.value)} /></Field>
          </div>
        </DeckCard>
      </div>
    </SimSidebarShell>
  );
}
