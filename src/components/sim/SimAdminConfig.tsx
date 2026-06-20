'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Check, Star, DollarSign, BarChart3, Calendar } from '../PixelIcons';
import { SimSidebarShell, PageHead, DeckStat, DeckCard, StatusPill } from './SimShell';
import { ADMIN_NAV, ADMIN_USER, DataTable, Col, FilterTabs, Field, TextInput, SelectInput } from './admin-ui';
import { CtaButton, Eyebrow, Tag, DISPLAY, DATA, ink, body, muted, faint, cyan, tealMid, success, negative, warning, positive, cyanTint, whisper, surfaceSoft } from './sim-ui';

function Impact({ level }: { level: 'High' | 'Medium' | 'Low' }) {
  const c = level === 'High' ? negative : level === 'Medium' ? warning : positive;
  return <span style={{ fontFamily: DATA, fontSize: 12, fontWeight: 700, color: c }}>{level}</span>;
}
function Avatar({ t }: { t: string }) {
  return <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg, var(--game-cyan), var(--game-teal-mid))', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: DATA, fontWeight: 700, fontSize: 9.5 }}>{t}</span>;
}

/* ════════════ 8 · Decision Setup ════════════ */
interface Dec { name: string; type: string; owner: string; status: string; impact: 'High' | 'Medium' | 'Low' }
const DECS: Dec[] = [
  { name: 'Holiday Promo Lift', type: 'Input', owner: 'DS', status: 'active', impact: 'High' },
  { name: 'Price Adjustment', type: 'Input', owner: 'DS', status: 'active', impact: 'High' },
  { name: 'Marketing Spend', type: 'Input', owner: 'AK', status: 'active', impact: 'Medium' },
  { name: 'Capacity Overtime', type: 'Input', owner: 'RP', status: 'active', impact: 'Medium' },
  { name: 'Supplier Lead Time', type: 'Input', owner: 'SL', status: 'active', impact: 'Low' },
  { name: 'New SKU Launch', type: 'Toggle', owner: 'DS', status: 'draft', impact: 'Medium' },
];
export function SimAdminDecisions() {
  const router = useRouter();
  const cols: Col<Dec>[] = [
    { key: 'name', label: 'Decision', render: (r) => <span style={{ fontWeight: 600, color: ink }}>{r.name}</span> },
    { key: 'type', label: 'Type', render: (r) => <Tag tone="neutral">{r.type}</Tag> },
    { key: 'owner', label: 'Owner', render: (r) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><Avatar t={r.owner} /></span> },
    { key: 'status', label: 'Status', render: (r) => <StatusPill status={r.status} /> },
    { key: 'impact', label: 'Impact', align: 'right', render: (r) => <Impact level={r.impact} /> },
  ];
  return (
    <SimSidebarShell nav={ADMIN_NAV} active="decisions" user={ADMIN_USER}>
      <PageHead title="Q4 Demand Surge — Decisions" subtitle="Add and configure decisions for this scenario." right={<CtaButton onClick={() => router.push('/sim/admin/kpis')}>Add decision</CtaButton>} />
      <DataTable columns={cols} rows={DECS} getKey={(r) => r.name} />
      <div style={{ marginTop: 18 }}><Eyebrow>Decision summary</Eyebrow></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14, marginTop: 12 }}>
        <DeckStat label="Total decisions" value="6" />
        <DeckStat label="Active" value="5" tone="up" />
        <DeckStat label="Input decisions" value="5" />
        <DeckStat label="Toggle decisions" value="1" />
        <DeckStat label="High impact" value="2" delta="review" tone="warn" />
      </div>
    </SimSidebarShell>
  );
}

/* ════════════ 9 · KPI Setup ════════════ */
interface Kpi { name: string; cat: string; freq: string; owner: string; status: string; on: boolean }
const KPIS: Kpi[] = [
  { name: 'Revenue', cat: 'Financial', freq: 'Monthly', owner: 'DS', status: 'active', on: true },
  { name: 'Gross Margin %', cat: 'Financial', freq: 'Monthly', owner: 'DS', status: 'active', on: true },
  { name: 'Forecast Accuracy', cat: 'Customer', freq: 'Monthly', owner: 'AK', status: 'active', on: true },
  { name: 'Fill Rate', cat: 'Supply Chain', freq: 'Weekly', owner: 'RP', status: 'active', on: true },
  { name: 'Inventory Turns', cat: 'Supply Chain', freq: 'Monthly', owner: 'RP', status: 'active', on: true },
  { name: 'Days of Inventory', cat: 'Supply Chain', freq: 'Weekly', owner: 'SL', status: 'inactive', on: false },
  { name: 'On-Time Delivery %', cat: 'Supply Chain', freq: 'Weekly', owner: 'SL', status: 'inactive', on: false },
  { name: 'COGS', cat: 'Financial', freq: 'Monthly', owner: 'DS', status: 'active', on: true },
];
export function SimAdminKpis() {
  const router = useRouter();
  const [sel, setSel] = useState<Record<string, boolean>>(Object.fromEntries(KPIS.map((k) => [k.name, k.on])));
  const [tab, setTab] = useState('all');
  const count = Object.values(sel).filter(Boolean).length;
  const cols: Col<Kpi>[] = [
    { key: 'sel', label: '', width: '40px', render: (r) => (
      <button onClick={() => setSel((s) => ({ ...s, [r.name]: !s[r.name] }))} style={{ width: 18, height: 18, borderRadius: 5, border: sel[r.name] ? 'none' : '1.4px solid var(--sv-border)', background: sel[r.name] ? cyan : '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
        {sel[r.name] && <Check size={12} color="#fff" />}
      </button>
    ) },
    { key: 'name', label: 'KPI', render: (r) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600, color: ink }}><Star size={13} color={faint} /> {r.name}</span> },
    { key: 'cat', label: 'Category', render: (r) => <Tag tone="neutral">{r.cat}</Tag> },
    { key: 'freq', label: 'Frequency', render: (r) => <span style={{ color: muted }}>{r.freq}</span> },
    { key: 'owner', label: 'Owner', render: (r) => <Avatar t={r.owner} /> },
    { key: 'status', label: 'Status', align: 'right', render: (r) => <StatusPill status={sel[r.name] ? 'active' : 'inactive'} /> },
  ];
  return (
    <SimSidebarShell nav={ADMIN_NAV} active="kpis" user={ADMIN_USER}>
      <PageHead title="Q4 Demand Surge — KPIs" subtitle="Select and configure KPIs to track." right={<CtaButton onClick={() => router.push('/sim/admin/timeline')}>Add KPI</CtaButton>} />
      <div style={{ marginBottom: 16 }}>
        <FilterTabs tabs={[{ id: 'all', label: 'All KPIs', count: 53 }, { id: 'sel', label: 'Selected', count: count }, { id: 'fav', label: 'Favorites', count: 12 }]} active={tab} onChange={setTab} />
      </div>
      <DataTable columns={cols} rows={tab === 'sel' ? KPIS.filter((k) => sel[k.name]) : KPIS} getKey={(r) => r.name} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
        <span style={{ fontFamily: DATA, fontSize: 13, color: muted, fontVariantNumeric: 'tabular-nums' }}>{count} of 53 selected</span>
        <CtaButton onClick={() => router.push('/sim/admin/timeline')}>Save selection</CtaButton>
      </div>
    </SimSidebarShell>
  );
}

/* ════════════ 10 · Timeline Setup ════════════ */
interface Milestone { name: string; type: string; date: string; impact: 'High' | 'Medium' | 'Low' }
const MILES: Milestone[] = [
  { name: 'Independence Day', type: 'Event', date: 'Jul 04, 2025', impact: 'Low' },
  { name: 'Back to School', type: 'Event', date: 'Aug 18, 2025', impact: 'Medium' },
  { name: 'Labor Day', type: 'Event', date: 'Sep 01, 2025', impact: 'Low' },
  { name: 'Black Friday', type: 'Event', date: 'Nov 28, 2025', impact: 'High' },
  { name: 'Christmas', type: 'Event', date: 'Dec 25, 2025', impact: 'High' },
];
export function SimAdminTimeline() {
  const router = useRouter();
  const [start, setStart] = useState('2025-07-01');
  const [end, setEnd] = useState('2025-12-31');
  const [gran, setGran] = useState('Weekly');
  const cols: Col<Milestone>[] = [
    { key: 'name', label: 'Milestone', render: (r) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600, color: ink }}><Calendar size={14} color={tealMid} /> {r.name}</span> },
    { key: 'type', label: 'Type', render: (r) => <Tag tone="neutral">{r.type}</Tag> },
    { key: 'date', label: 'Date', render: (r) => <span style={{ color: muted, fontVariantNumeric: 'tabular-nums' }}>{r.date}</span> },
    { key: 'impact', label: 'Impact', align: 'right', render: (r) => <Impact level={r.impact} /> },
  ];
  return (
    <SimSidebarShell nav={ADMIN_NAV} active="timelines" user={ADMIN_USER}>
      <PageHead title="Q4 Demand Surge — Timeline" subtitle="Define time horizon and key events." right={<CtaButton onClick={() => router.push('/sim/admin/events')}>Add milestone</CtaButton>} />
      <DeckCard style={{ padding: 22, marginBottom: 18 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
          <Field label="Start date"><TextInput type="date" value={start} onChange={(e) => setStart(e.target.value)} /></Field>
          <Field label="End date"><TextInput type="date" value={end} onChange={(e) => setEnd(e.target.value)} /></Field>
          <Field label="Granularity"><SelectInput value={gran} onChange={setGran} options={['Daily', 'Weekly', 'Monthly']} /></Field>
        </div>
      </DeckCard>
      <div style={{ marginBottom: 12 }}><Eyebrow>Milestones</Eyebrow></div>
      <DataTable columns={cols} rows={MILES} getKey={(r) => r.name} />
      <div style={{ marginTop: 18 }}><Eyebrow>Horizon summary</Eyebrow></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginTop: 12 }}>
        <DeckStat label="Weeks" value="26" />
        <DeckStat label="Days" value="182" />
        <DeckStat label="Milestones" value="5" />
        <DeckStat label="Granularity" value="Weekly" />
      </div>
    </SimSidebarShell>
  );
}
