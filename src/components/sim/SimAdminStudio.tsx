'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Check } from '../PixelIcons';
import { SimSidebarShell, PageHead, DeckStat, DeckCard, StatusPill, ChevronRight } from './SimShell';
import {
  ADMIN_NAV, ADMIN_USER, DataTable, Col, SearchInput, FilterTabs, Field, TextInput, TextArea, SelectInput, Toggle,
  LineChart, HealthBadge,
} from './admin-ui';
import { CtaButton, OutlineButton, Eyebrow, Tag, DISPLAY, DATA, ink, body, muted, faint, cyan, tealMid, success, cyanTint, whisper, surfaceSoft } from './sim-ui';

interface ScenarioRow { name: string; owner: string; status: string; updated: string; health: number }
const RECENT: ScenarioRow[] = [
  { name: 'Q3 Growth Outlook', owner: 'MV', status: 'ready', updated: 'May 06, 2025', health: 92 },
  { name: 'Supply Chain Stress Test', owner: 'AK', status: 'running', updated: 'May 05, 2025', health: 88 },
  { name: 'Pricing Impact Analysis', owner: 'JS', status: 'draft', updated: 'May 05, 2025', health: 61 },
  { name: 'New Market Entry', owner: 'SL', status: 'ready', updated: 'May 04, 2025', health: 95 },
  { name: 'Cost Optimization Plan', owner: 'RP', status: 'draft', updated: 'May 03, 2025', health: 70 },
];
const ALL_SCENARIOS: ScenarioRow[] = [
  ...RECENT,
  { name: 'Demand Forecast', owner: 'AK', status: 'ready', updated: 'May 02, 2025', health: 84 },
  { name: 'Product Launch Scenario', owner: 'MV', status: 'archived', updated: 'Apr 30, 2025', health: 64 },
  { name: 'FX Impact Analysis', owner: 'AK', status: 'draft', updated: 'Apr 27, 2025', health: 55 },
];

const scenarioCols = (router: ReturnType<typeof useRouter>): Col<ScenarioRow>[] => [
  { key: 'name', label: 'Scenario', render: (r) => <span style={{ fontWeight: 600, color: ink }}>{r.name}</span> },
  { key: 'owner', label: 'Owner', render: (r) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><Avatar t={r.owner} /> {r.owner}</span> },
  { key: 'status', label: 'Status', render: (r) => <StatusPill status={r.status} /> },
  { key: 'updated', label: 'Last updated', render: (r) => <span style={{ color: muted, fontVariantNumeric: 'tabular-nums' }}>{r.updated}</span> },
  { key: 'health', label: 'Health', align: 'right', render: (r) => <HealthBadge pct={r.health} /> },
];

function Avatar({ t }: { t: string }) {
  return <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg, var(--game-cyan), var(--game-teal-mid))', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: DATA, fontWeight: 700, fontSize: 9.5 }}>{t}</span>;
}

/* ════════════ 1 · Studio Dashboard ════════════ */
export function SimAdminDashboard() {
  const router = useRouter();
  return (
    <SimSidebarShell nav={ADMIN_NAV} active="dashboard" user={ADMIN_USER}>
      <PageHead title="Welcome back, Daria" subtitle="Here's what's happening in your workspace today." right={<CtaButton onClick={() => router.push('/sim/admin/scenarios/new')}>New scenario</CtaButton>} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
        <DeckStat label="Active scenarios" value="24" delta="+2" tone="up" sub="vs last week" />
        <DeckStat label="Simulations run" value="156" delta="+12%" tone="up" />
        <DeckStat label="Recipes" value="18" delta="+2" tone="up" />
        <DeckStat label="KPIs tracked" value="53" delta="+5" tone="up" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.7fr) minmax(0,1fr)', gap: 18 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <Eyebrow>Recent scenarios</Eyebrow>
            <button onClick={() => router.push('/sim/admin/scenarios')} style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 13, color: tealMid, background: 'none', border: 'none', cursor: 'pointer' }}>View all</button>
          </div>
          <DataTable columns={scenarioCols(router)} rows={RECENT} getKey={(r) => r.name} onRow={() => router.push('/sim/admin/scenarios')} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <DeckCard>
            <Eyebrow>Simulation runs · last 7 days</Eyebrow>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '8px 0 6px' }}>
              <span style={{ fontFamily: DATA, fontWeight: 800, fontSize: 28, color: ink, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.6px' }}>42</span>
              <span style={{ fontFamily: DATA, fontSize: 13, fontWeight: 600, color: success }}>+16% vs prior</span>
            </div>
            <LineChart values={[18, 22, 19, 28, 24, 33, 42]} labels={['M', 'T', 'W', 'T', 'F', 'S', 'S']} height={130} />
          </DeckCard>
          <DeckCard>
            <Eyebrow>System health</Eyebrow>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 12 }}>
              <span style={{ fontFamily: DATA, fontWeight: 800, fontSize: 36, color: success, fontVariantNumeric: 'tabular-nums', letterSpacing: '-1px' }}>98%</span>
              <div>
                <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, color: ink }}>All systems operational</div>
                <div style={{ fontFamily: DATA, fontSize: 12, color: faint, marginTop: 2 }}>Engine, scoring, and event services healthy.</div>
              </div>
            </div>
          </DeckCard>
        </div>
      </div>
    </SimSidebarShell>
  );
}

/* ════════════ 2 · Scenario Library Manager ════════════ */
export function SimAdminScenarios() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [tab, setTab] = useState('all');
  const tabs = [
    { id: 'all', label: 'All', count: ALL_SCENARIOS.length },
    { id: 'mine', label: 'My Scenarios', count: 8 },
    { id: 'team', label: 'Team', count: 12 },
    { id: 'archived', label: 'Archived', count: 4 },
  ];
  const rows = ALL_SCENARIOS.filter((s) => (tab === 'archived' ? s.status === 'archived' : tab === 'all' ? true : s.status !== 'archived'))
    .filter((s) => q === '' || s.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <SimSidebarShell nav={ADMIN_NAV} active="scenarios" user={ADMIN_USER}>
      <PageHead title="Scenario Library" subtitle="Manage, organize, and access all scenarios." right={<CtaButton onClick={() => router.push('/sim/admin/scenarios/new')}>New scenario</CtaButton>} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 16, flexWrap: 'wrap' }}>
        <FilterTabs tabs={tabs} active={tab} onChange={setTab} />
        <SearchInput value={q} onChange={setQ} placeholder="Search scenarios…" width={280} />
      </div>
      <DataTable columns={scenarioCols(router)} rows={rows} getKey={(r) => r.name} onRow={() => router.push('/sim/admin/canvas')} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
        <span style={{ fontFamily: DATA, fontSize: 12.5, color: faint }}>1–{rows.length} of {ALL_SCENARIOS.length}</span>
        <div style={{ display: 'flex', gap: 6 }}>
          {['1', '2', '3'].map((p) => <button key={p} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid var(--sv-border)', background: p === '1' ? cyanTint : 'var(--game-surface-solid)', color: p === '1' ? tealMid : muted, fontFamily: DATA, fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}>{p}</button>)}
        </div>
      </div>
    </SimSidebarShell>
  );
}

/* ════════════ 3 · Create New Scenario ════════════ */
const CREATE_STEPS = ['Basics', 'Scope', 'Settings', 'Review'];
export function SimAdminCreateScenario() {
  const router = useRouter();
  const [name, setName] = useState('Q4 Demand Surge');
  const [desc, setDesc] = useState('Evaluate demand surge impact during Q4 holiday season across supply chain and commercial vectors.');
  const [type, setType] = useState('What-If Analysis');
  const [area, setArea] = useState('Supply Chain');
  const [owner, setOwner] = useState('Daria Sokolova');
  const [tags, setTags] = useState(['demand', 'seasonality', 'q4-2025']);
  const [tagDraft, setTagDraft] = useState('');
  const [blank, setBlank] = useState(true);

  return (
    <SimSidebarShell nav={ADMIN_NAV} active="scenarios" user={ADMIN_USER}>
      <PageHead title="Create New Scenario" subtitle="Define the foundation for your new scenario." />

      {/* steps */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 22 }}>
        {CREATE_STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ width: 26, height: 26, borderRadius: '50%', display: 'grid', placeItems: 'center', background: i === 0 ? cyan : 'var(--game-surface-solid)', border: i === 0 ? 'none' : '1.4px solid var(--sv-border)', color: i === 0 ? '#fff' : faint, fontFamily: DATA, fontWeight: 700, fontSize: 12.5 }}>{i + 1}</span>
              <span style={{ fontFamily: DISPLAY, fontWeight: i === 0 ? 700 : 500, fontSize: 14, color: i === 0 ? ink : faint }}>{s}</span>
            </div>
            {i < CREATE_STEPS.length - 1 && <span style={{ flex: 1, height: 1.5, background: 'var(--sv-border)', margin: '0 14px', maxWidth: 90 }} />}
          </React.Fragment>
        ))}
      </div>

      <DeckCard style={{ padding: 26, maxWidth: 720 }}>
        <Eyebrow>Basics</Eyebrow>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 16 }}>
          <Field label="Scenario name" required><TextInput value={name} onChange={(e) => setName(e.target.value)} /></Field>
          <Field label="Description"><TextArea value={desc} onChange={(e) => setDesc(e.target.value)} /></Field>
          <Field label="Scenario type"><SelectInput value={type} onChange={setType} options={['What-If Analysis', 'Competition', 'Course Module', 'Workshop']} /></Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Business area" required><SelectInput value={area} onChange={setArea} options={['Supply Chain', 'Marketing', 'Finance', 'Retail', 'Operations']} /></Field>
            <Field label="Owner" required><SelectInput value={owner} onChange={setOwner} options={['Daria Sokolova', 'Alex Morgan', 'Priya Shah']} /></Field>
          </div>
          <Field label="Tags">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', background: surfaceSoft, border: '1px solid var(--sv-border)', borderRadius: 8, padding: '8px 10px' }}>
              {tags.map((t) => (
                <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: DATA, fontSize: 12.5, fontWeight: 600, color: tealMid, background: cyanTint, borderRadius: 999, padding: '4px 10px' }}>
                  {t}<button onClick={() => setTags(tags.filter((x) => x !== t))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: tealMid, display: 'grid' }}><X size={12} /></button>
                </span>
              ))}
              <input value={tagDraft} onChange={(e) => setTagDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && tagDraft.trim()) { setTags([...tags, tagDraft.trim()]); setTagDraft(''); } }} placeholder="Add tag…" style={{ flex: 1, minWidth: 90, border: 'none', outline: 'none', background: 'transparent', fontFamily: DATA, fontSize: 13, color: ink }} />
            </div>
          </Field>
          <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
            <Toggle on={blank} onChange={setBlank} />
            <span style={{ fontFamily: DATA, fontSize: 13.5, color: body }}>Start with a blank scenario</span>
          </label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
          <CtaButton onClick={() => router.push('/sim/admin/canvas')}>Next: Scope</CtaButton>
        </div>
      </DeckCard>
    </SimSidebarShell>
  );
}
