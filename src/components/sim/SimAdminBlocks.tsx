'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, Plus, Check, Star, TrendingUp, Truck, Box, ShoppingCart, Settings, DollarSign, Users, Landmark,
  Wallet, Droplets, Layers, Cpu, FileText, BarChart3, Play, ChevronRight as Chev,
} from '../PixelIcons';
import { SimSidebarShell, PageHead, DeckCard, StatusPill } from './SimShell';
import { ADMIN_NAV, ADMIN_USER, SearchInput, FilterTabs, SelectInput, IconTile } from './admin-ui';
import { CtaButton, OutlineButton, GhostButton, Eyebrow, Tag, DISPLAY, DATA, ink, body, muted, faint, cyan, tealMid, success, positive, cyanTint, whisper, surfaceSoft } from './sim-ui';

type Cmp = React.ComponentType<{ size?: number; color?: string }>;
interface Block { name: string; count: number; icon: Cmp; cat: string }
const BLOCKS: Block[] = [
  { name: 'Demand Forecasting', count: 12, icon: TrendingUp, cat: 'Supply Chain' },
  { name: 'Supply Planning', count: 9, icon: Truck, cat: 'Supply Chain' },
  { name: 'Inventory Management', count: 8, icon: Box, cat: 'Supply Chain' },
  { name: 'Procurement', count: 8, icon: ShoppingCart, cat: 'Supply Chain' },
  { name: 'Manufacturing', count: 7, icon: Settings, cat: 'Operations' },
  { name: 'Logistics & Transport', count: 6, icon: Truck, cat: 'Operations' },
  { name: 'Pricing & Revenue', count: 8, icon: DollarSign, cat: 'Commercial' },
  { name: 'Market & Customer', count: 4, icon: Users, cat: 'Commercial' },
  { name: 'Finance', count: 10, icon: Landmark, cat: 'Finance' },
  { name: 'Cost Management', count: 5, icon: Wallet, cat: 'Finance' },
  { name: 'Workforce', count: 5, icon: Users, cat: 'Operations' },
  { name: 'Sustainability', count: 4, icon: Droplets, cat: 'Other' },
];

/* ════════════ 4 · Business Block Catalog ════════════ */
export function SimAdminBlockCatalog() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [tab, setTab] = useState('all');
  const [cat, setCat] = useState('All Categories');
  const cats = ['All', 'Supply Chain', 'Commercial', 'Finance', 'Operations', 'Other'];
  const tabs = cats.map((c) => ({ id: c.toLowerCase().replace(/\s/g, ''), label: c === 'All' ? 'All' : c, count: c === 'All' ? BLOCKS.length : BLOCKS.filter((b) => b.cat === c).length }));
  const rows = BLOCKS.filter((b) => (tab === 'all' || b.cat.toLowerCase().replace(/\s/g, '') === tab) && (q === '' || b.name.toLowerCase().includes(q.toLowerCase())));

  return (
    <SimSidebarShell nav={ADMIN_NAV} active="blocks" user={ADMIN_USER}>
      <PageHead title="Business Block Catalog" subtitle="Browse and reuse building blocks." />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <SearchInput value={q} onChange={setQ} placeholder="Search blocks…" width={260} />
        <div style={{ width: 180 }}><SelectInput value={cat} onChange={setCat} options={['All Categories', 'Supply Chain', 'Commercial', 'Finance', 'Operations']} /></div>
      </div>
      <div style={{ marginBottom: 18 }}><FilterTabs tabs={tabs} active={tab} onChange={setTab} /></div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        {rows.map((b) => {
          const Icon = b.icon;
          return (
            <DeckCard key={b.name} className="sim-block" style={{ padding: 18, cursor: 'pointer', transition: 'transform .15s ease, border-color .15s ease' }} onClick={() => router.push('/sim/admin/blocks/detail')}>
              <IconTile icon={<Icon size={20} />} />
              <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 14.5, color: ink, marginTop: 12 }}>{b.name}</div>
              <div style={{ fontFamily: DATA, fontSize: 12, color: faint, marginTop: 3, fontVariantNumeric: 'tabular-nums' }}>{b.count} blocks</div>
            </DeckCard>
          );
        })}
      </div>

      <DeckCard style={{ padding: 18, marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ fontFamily: DATA, fontSize: 13.5, color: muted }}>Can&apos;t find what you need?</span>
        <OutlineButton><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Plus size={15} /> Request a new block</span></OutlineButton>
      </DeckCard>

      <style>{`.sim-block:hover{transform:translateY(-3px);border-color:color-mix(in srgb,var(--game-cyan) 45%,#fff) !important;}`}</style>
    </SimSidebarShell>
  );
}

/* ════════════ 5 · Business Block Detail ════════════ */
const IN_PORTS = ['Historical Sales', 'Price Index', 'Promotions', 'Economic Indicators', 'Seasonality Factors'];
const OUT_PORTS = ['Forecast Volume', 'Forecast Value', 'Confidence Score'];
export function SimAdminBlockDetail() {
  const router = useRouter();
  const [tab, setTab] = useState('Overview');
  return (
    <SimSidebarShell nav={ADMIN_NAV} active="blocks" user={ADMIN_USER}>
      <PageHead
        title="Demand Forecasting"
        subtitle="Generates baseline demand forecast using historical data, seasonality, and external inputs."
        right={<div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><Tag tone="neutral">v1.3</Tag><CtaButton onClick={() => router.push('/sim/admin/canvas')}>Add to scenario</CtaButton></div>}
      />
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}><Tag>Supply Chain</Tag><Tag tone="neutral">Planning</Tag></div>

      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--sv-border)', marginBottom: 20 }}>
        {['Overview', 'Parameters', 'Outputs', 'Dependencies', 'Versions', 'Usage'].map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ fontFamily: DISPLAY, fontWeight: tab === t ? 700 : 600, fontSize: 13.5, padding: '10px 14px', border: 'none', background: 'none', cursor: 'pointer', color: tab === t ? tealMid : muted, borderBottom: '2px solid ' + (tab === t ? cyan : 'transparent'), marginBottom: -1 }}>{t}</button>
        ))}
      </div>

      {/* I/O diagram */}
      <DeckCard style={{ padding: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 24, alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: DATA, fontSize: 12, fontWeight: 700, color: tealMid, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 12 }}>Inputs ({IN_PORTS.length})</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {IN_PORTS.map((p) => <Port key={p} label={p} />)}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 120, height: 120, borderRadius: 16, background: cyanTint, border: '1.4px solid var(--game-cyan)', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
              <span><TrendingUp size={30} color={tealMid} /><div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 12.5, color: ink, marginTop: 6, padding: '0 8px' }}>Demand Forecasting</div></span>
            </span>
          </div>
          <div>
            <div style={{ fontFamily: DATA, fontSize: 12, fontWeight: 700, color: tealMid, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 12, textAlign: 'right' }}>Outputs ({OUT_PORTS.length})</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, alignItems: 'flex-end' }}>
              {OUT_PORTS.map((p) => <Port key={p} label={p} right />)}
            </div>
          </div>
        </div>
      </DeckCard>

      {/* meta */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0, marginTop: 16, background: surfaceSoft, border: '1px solid var(--sv-border)', borderRadius: 12, overflow: 'hidden' }}>
        {[['Category', 'Supply Chain'], ['Sub-category', 'Planning'], ['Block ID', 'DF-001'], ['Created by', 'Modelling Team'], ['Last updated', 'Apr 28, 2025'], ['Usage', '24 scenarios'], ['Complexity', 'Medium'], ['Rating', '4.6 / 5']].map(([k, v], i) => (
          <div key={k} style={{ padding: '13px 16px', borderTop: i > 3 ? '1px solid var(--sv-border)' : 'none', borderLeft: i % 4 ? '1px solid var(--sv-border)' : 'none' }}>
            <div style={{ fontFamily: DATA, fontSize: 11, color: faint, textTransform: 'uppercase', letterSpacing: '0.6px' }}>{k}</div>
            <div style={{ fontFamily: DATA, fontSize: 13.5, fontWeight: 600, color: ink, marginTop: 3, display: 'inline-flex', alignItems: 'center', gap: 5 }}>{k === 'Rating' && <Star size={13} color={positive} />}{v}</div>
          </div>
        ))}
      </div>
    </SimSidebarShell>
  );
}
function Port({ label, right }: { label: string; right?: boolean }) {
  return (
    <div style={{ ...{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--game-surface-solid)', border: '1px solid var(--sv-border)', borderRadius: 999, padding: '7px 14px', flexDirection: right ? 'row-reverse' : 'row' } }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: cyan }} />
      <span style={{ fontFamily: DATA, fontSize: 12.5, color: body }}>{label}</span>
    </div>
  );
}

/* ════════════ 6 · Block Connection Canvas ════════════ */
interface Node { id: string; label: string; icon: Cmp; x: number; y: number; tone: string }
const NW = 150, NH = 50;
const NODES: Node[] = [
  { id: 'df', label: 'Demand Forecasting', icon: TrendingUp, x: 200, y: 30, tone: 'var(--game-positive)' },
  { id: 'mc', label: 'Market & Customer', icon: Users, x: 30, y: 150, tone: 'var(--game-teal-mid)' },
  { id: 'sp', label: 'Supply Planning', icon: Truck, x: 330, y: 150, tone: 'var(--game-cyan)' },
  { id: 'im', label: 'Inventory Management', icon: Box, x: 590, y: 150, tone: 'var(--game-teal-mid)' },
  { id: 'lt', label: 'Logistics & Transport', icon: Truck, x: 110, y: 270, tone: 'var(--game-warning)' },
  { id: 'mf', label: 'Manufacturing', icon: Settings, x: 440, y: 270, tone: 'var(--game-warning)' },
  { id: 'kpi', label: 'KPI Aggregator', icon: BarChart3, x: 320, y: 380, tone: 'var(--game-cyan)' },
];
const EDGES: [string, string][] = [['df', 'sp'], ['mc', 'sp'], ['sp', 'im'], ['sp', 'mf'], ['lt', 'sp'], ['im', 'kpi'], ['mf', 'kpi'], ['sp', 'kpi']];
const center = (id: string) => { const n = NODES.find((x) => x.id === id)!; return { x: n.x + NW / 2, y: n.y + NH / 2 }; };

export function SimAdminCanvas() {
  const router = useRouter();
  return (
    <SimSidebarShell nav={ADMIN_NAV} active="blocks" user={ADMIN_USER}>
      <PageHead
        title="Q4 Demand Surge"
        subtitle="Auto-saved 2 min ago"
        right={<div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><StatusPill status="draft" /><OutlineButton onClick={() => router.push('/sim/admin/recipe')}>Validate</OutlineButton><CtaButton onClick={() => router.push('/sim/admin/recipe')}>Save</CtaButton></div>}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '210px minmax(0,1fr)', gap: 16, alignItems: 'start' }}>
        {/* catalog rail */}
        <DeckCard style={{ padding: 12 }}>
          <div style={{ fontFamily: DATA, fontSize: 11, fontWeight: 700, color: faint, textTransform: 'uppercase', letterSpacing: '0.6px', padding: '4px 8px 10px' }}>Blocks</div>
          {BLOCKS.slice(0, 8).map((b) => { const I = b.icon; return (
            <div key={b.name} draggable style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 8px', borderRadius: 8, cursor: 'grab' }}>
              <IconTile icon={<I size={15} />} size={28} /><span style={{ fontFamily: DATA, fontSize: 12.5, color: body }}>{b.name}</span>
            </div>
          ); })}
        </DeckCard>

        {/* canvas */}
        <DeckCard style={{ padding: 0, position: 'relative', overflow: 'hidden', minHeight: 470, background: 'linear-gradient(0deg, var(--game-surface), var(--game-surface))' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.5, backgroundImage: 'radial-gradient(var(--sv-border) 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
          <div style={{ position: 'relative', width: 760, height: 460, margin: '0 auto' }}>
            <svg width="760" height="460" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              <defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="var(--game-cyan)" /></marker></defs>
              {EDGES.map(([a, b], i) => { const p = center(a), q = center(b); return <path key={i} d={`M${p.x},${p.y} C${(p.x + q.x) / 2},${p.y} ${(p.x + q.x) / 2},${q.y} ${q.x},${q.y}`} fill="none" stroke="var(--game-cyan)" strokeWidth="1.8" markerEnd="url(#arrow)" opacity="0.7" />; })}
            </svg>
            {NODES.map((n) => { const I = n.icon; return (
              <div key={n.id} style={{ position: 'absolute', left: n.x, top: n.y, width: NW, height: NH, background: 'var(--game-surface-solid)', border: '1.4px solid ' + n.tone, borderRadius: 12, boxShadow: 'var(--shadow-elev-1)', display: 'flex', alignItems: 'center', gap: 9, padding: '0 12px' }}>
                <I size={17} color={n.tone} /><span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 12, color: ink, lineHeight: 1.15 }}>{n.label}</span>
              </div>
            ); })}
          </div>
          <div style={{ position: 'absolute', right: 16, bottom: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['+', '−', '⤢'].map((z) => <button key={z} style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid var(--sv-border)', background: 'var(--game-surface-solid)', cursor: 'pointer', fontFamily: DATA, fontSize: 16, color: muted }}>{z}</button>)}
          </div>
        </DeckCard>
      </div>
      <div style={{ display: 'flex', gap: 18, marginTop: 14, fontFamily: DATA, fontSize: 12.5, color: muted }}>
        <span>6 blocks</span><span>·</span><span>11 connections</span><span style={{ color: success, display: 'inline-flex', alignItems: 'center', gap: 5 }}><Check size={13} color={success} /> No validation issues</span>
      </div>
    </SimSidebarShell>
  );
}

/* ════════════ 7 · Scenario Recipe Builder ════════════ */
interface Step { n: number; title: string; tag: string; icon: Cmp }
const STEPS: Step[] = [
  { n: 1, title: 'Refresh Data', tag: 'Data Hub', icon: Cpu },
  { n: 2, title: 'Run Demand Forecasting', tag: 'Business Block', icon: TrendingUp },
  { n: 3, title: 'Run Supply Planning', tag: 'Business Block', icon: Truck },
  { n: 4, title: 'Run Inventory Simulation', tag: 'Business Block', icon: Box },
  { n: 5, title: 'Run KPI Analysis', tag: 'Business Block', icon: BarChart3 },
  { n: 6, title: 'Generate Report', tag: 'Report', icon: FileText },
];
export function SimAdminRecipe() {
  const router = useRouter();
  const [tab, setTab] = useState('Recipe');
  return (
    <SimSidebarShell nav={ADMIN_NAV} active="recipes" user={ADMIN_USER}>
      <PageHead title="Q4 Demand Surge Recipe" subtitle="Define steps to run this scenario end to end." right={<div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><StatusPill status="draft" /><CtaButton onClick={() => router.push('/sim/admin/decisions')}>Save recipe</CtaButton></div>} />
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--sv-border)', marginBottom: 18 }}>
        {['Recipe', 'Settings'].map((t) => <button key={t} onClick={() => setTab(t)} style={{ fontFamily: DISPLAY, fontWeight: tab === t ? 700 : 600, fontSize: 13.5, padding: '10px 14px', border: 'none', background: 'none', cursor: 'pointer', color: tab === t ? tealMid : muted, borderBottom: '2px solid ' + (tab === t ? cyan : 'transparent'), marginBottom: -1 }}>{t}</button>)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 280px', gap: 18, alignItems: 'start' }}>
        <div>
          <Eyebrow>Steps</Eyebrow>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
            {STEPS.map((s) => { const I = s.icon; return (
              <DeckCard key={s.n} style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 13 }}>
                <span style={{ width: 26, height: 26, borderRadius: '50%', background: cyanTint, color: tealMid, display: 'grid', placeItems: 'center', fontFamily: DATA, fontWeight: 700, fontSize: 12.5, flexShrink: 0 }}>{s.n}</span>
                <I size={17} color={tealMid} />
                <span style={{ flex: 1, fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, color: ink }}>{s.title}</span>
                <Tag tone="neutral">{s.tag}</Tag>
              </DeckCard>
            ); })}
          </div>
          <div style={{ marginTop: 12 }}><OutlineButton><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Plus size={15} /> Add step</span></OutlineButton></div>
        </div>

        <DeckCard>
          <Eyebrow>Recipe summary</Eyebrow>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
            {[['Steps', '6'], ['Est. runtime', '~12 min'], ['Last edited', 'May 06, 2025'], ['Editor', 'Daria Sokolova']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: DATA }}>
                <span style={{ fontSize: 12.5, color: muted }}>{k}</span>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: ink, fontVariantNumeric: 'tabular-nums' }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16 }}><CtaButton full onClick={() => router.push('/sim/admin/balance')}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Play size={14} /> Run test</span></CtaButton></div>
        </DeckCard>
      </div>
    </SimSidebarShell>
  );
}
