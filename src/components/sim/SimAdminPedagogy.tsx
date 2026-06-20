'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Calendar, Target, MessageSquare, FileText, RefreshCw } from '../PixelIcons';
import { SimSidebarShell, PageHead, DeckCard } from './SimShell';
import { ADMIN_NAV, ADMIN_USER, DataTable, Col, FilterTabs, Toggle } from './admin-ui';
import { CtaButton, OutlineButton, Eyebrow, Tag, DISPLAY, DATA, ink, body, muted, faint, cyan, tealMid, negative, warning, positive, whisper, surfaceSoft } from './sim-ui';

function Impact({ level }: { level: 'High' | 'Medium' | 'Low' }) {
  const c = level === 'High' ? negative : level === 'Medium' ? warning : positive;
  return <span style={{ fontFamily: DATA, fontSize: 12, fontWeight: 700, color: c }}>{level}</span>;
}

/* ════════════ 11 · Event Setup ════════════ */
interface Ev { name: string; round: string; trigger: string; impact: 'High' | 'Medium' | 'Low' }
const EVENTS: Ev[] = [
  { name: 'Supplier Delay', round: 'Round 1', trigger: 'Time Elapsed', impact: 'Medium' },
  { name: 'Port Congestion', round: 'Round 1', trigger: 'Condition Match', impact: 'High' },
  { name: 'Demand Spike', round: 'Round 2', trigger: 'Time Elapsed', impact: 'High' },
  { name: 'Logistics Strike', round: 'Round 2', trigger: 'Condition Match', impact: 'Medium' },
  { name: 'FX Volatility', round: 'Round 3', trigger: 'Time Elapsed', impact: 'Low' },
  { name: 'Regulatory Change', round: 'Round 3', trigger: 'Condition Match', impact: 'High' },
];
export function SimAdminEvents() {
  const router = useRouter();
  const [tab, setTab] = useState('all');
  const cols: Col<Ev>[] = [
    { key: 'name', label: 'Event name', render: (r) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600, color: ink }}><Calendar size={14} color={tealMid} /> {r.name}</span> },
    { key: 'round', label: 'Round', render: (r) => <span style={{ color: muted }}>{r.round}</span> },
    { key: 'trigger', label: 'Trigger type', render: (r) => <Tag tone="neutral">{r.trigger}</Tag> },
    { key: 'impact', label: 'Impact', render: (r) => <Impact level={r.impact} /> },
    { key: 'actions', label: '', align: 'right', render: () => <span style={{ color: faint, fontSize: 18, fontWeight: 700 }}>···</span> },
  ];
  return (
    <SimSidebarShell nav={ADMIN_NAV} active="timelines" user={ADMIN_USER}>
      <PageHead title="Event Setup" subtitle="Define the key pre-defined events in this scenario." right={<CtaButton onClick={() => router.push('/sim/admin/objectives')}>Save</CtaButton>} />
      <div style={{ marginBottom: 16 }}><FilterTabs tabs={[{ id: 'all', label: 'All Events', count: 6 }, { id: 'round', label: 'By Round' }, { id: 'cond', label: 'Conditions' }]} active={tab} onChange={setTab} /></div>
      <DataTable columns={cols} rows={EVENTS} getKey={(r) => r.name} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
        <OutlineButton><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Plus size={15} /> Add event</span></OutlineButton>
        <OutlineButton onClick={() => router.push('/sim/admin/timeline')}>View timeline</OutlineButton>
      </div>
    </SimSidebarShell>
  );
}

/* ════════════ 12 · Learning Objective Setup ════════════ */
interface Obj { obj: string; cat: string; bloom: string; weight: string }
const OBJS: Obj[] = [
  { obj: 'Evaluate supplier risk and alternatives', cat: 'Risk Management', bloom: 'Analyze', weight: '25%' },
  { obj: 'Optimize inventory and working capital', cat: 'Operations', bloom: 'Apply', weight: '25%' },
  { obj: 'Make data-driven pricing decisions', cat: 'Finance', bloom: 'Analyze', weight: '20%' },
  { obj: 'Respond to external disruptions', cat: 'Strategy', bloom: 'Evaluate', weight: '20%' },
  { obj: 'Communicate decisions to stakeholders', cat: 'Communication', bloom: 'Apply', weight: '10%' },
];
export function SimAdminObjectives() {
  const router = useRouter();
  const [tab, setTab] = useState('obj');
  const cols: Col<Obj>[] = [
    { key: 'obj', label: 'Objective', render: (r) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600, color: ink }}><Target size={14} color={tealMid} /> {r.obj}</span> },
    { key: 'cat', label: 'Category', render: (r) => <Tag tone="neutral">{r.cat}</Tag> },
    { key: 'bloom', label: 'Bloom level', render: (r) => <Tag>{r.bloom}</Tag> },
    { key: 'weight', label: 'Weight', align: 'right', render: (r) => <span style={{ fontWeight: 700, color: ink, fontVariantNumeric: 'tabular-nums' }}>{r.weight}</span> },
  ];
  return (
    <SimSidebarShell nav={ADMIN_NAV} active="scenarios" user={ADMIN_USER}>
      <PageHead title="Learning Objective Setup" subtitle="Define what students should learn from this scenario." right={<CtaButton onClick={() => router.push('/sim/admin/reflection')}>Save</CtaButton>} />
      <div style={{ marginBottom: 16 }}><FilterTabs tabs={[{ id: 'obj', label: 'Objectives', count: 6 }, { id: 'cat', label: 'By Category' }, { id: 'tax', label: 'Taxonomy' }]} active={tab} onChange={setTab} /></div>
      <DataTable columns={cols} rows={OBJS} getKey={(r) => r.obj} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
        <OutlineButton><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Plus size={15} /> Add objective</span></OutlineButton>
        <OutlineButton>Align to rubric</OutlineButton>
      </div>
    </SimSidebarShell>
  );
}

/* ════════════ 13 · Reflection Prompt Setup ════════════ */
interface Pr { prompt: string; phase: string; timing: string; type: string }
const PROMPTS: Pr[] = [
  { prompt: 'What key assumptions shaped your decision?', phase: 'After Round', timing: 'End of Round 1', type: 'Open Ended' },
  { prompt: 'What data most influenced your strategy?', phase: 'After Round', timing: 'End of Round 2', type: 'Open Ended' },
  { prompt: 'How did your team manage risk and uncertainty?', phase: 'Debrief', timing: 'Debrief', type: 'Open Ended' },
  { prompt: 'What would you do differently next time?', phase: 'Debrief', timing: 'Debrief', type: 'Open Ended' },
  { prompt: 'Rate your team collaboration this round (1–5).', phase: 'After Round', timing: 'End of Round 3', type: 'Rating (1–5)' },
  { prompt: 'What surprised you most in this scenario?', phase: 'Debrief', timing: 'Debrief', type: 'Open Ended' },
];
export function SimAdminReflection() {
  const router = useRouter();
  const [tab, setTab] = useState('all');
  const cols: Col<Pr>[] = [
    { key: 'prompt', label: 'Prompt', render: (r) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600, color: ink }}><MessageSquare size={14} color={tealMid} /> {r.prompt}</span> },
    { key: 'phase', label: 'Phase', render: (r) => <span style={{ color: muted }}>{r.phase}</span> },
    { key: 'timing', label: 'Timing', render: (r) => <Tag tone="neutral">{r.timing}</Tag> },
    { key: 'type', label: 'Type', align: 'right', render: (r) => <Tag>{r.type}</Tag> },
  ];
  return (
    <SimSidebarShell nav={ADMIN_NAV} active="scenarios" user={ADMIN_USER}>
      <PageHead title="Reflection Prompt Setup" subtitle="Create reflection prompts students answer during debrief." right={<CtaButton onClick={() => router.push('/sim/admin/debrief')}>Save</CtaButton>} />
      <div style={{ marginBottom: 16 }}><FilterTabs tabs={[{ id: 'all', label: 'All Prompts', count: 6 }, { id: 'phase', label: 'By Phase' }, { id: 'timing', label: 'Timing' }]} active={tab} onChange={setTab} /></div>
      <DataTable columns={cols} rows={PROMPTS} getKey={(r) => r.prompt} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
        <OutlineButton><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Plus size={15} /> Add prompt</span></OutlineButton>
        <OutlineButton>Preview prompts</OutlineButton>
      </div>
    </SimSidebarShell>
  );
}

/* ════════════ 14 · Debrief Guide Setup ════════════ */
interface Sec { section: string; phase: string; time: string; method: string }
const SECS: Sec[] = [
  { section: 'Context Recap', phase: 'Debrief Start', time: '5 min', method: 'Presentation' },
  { section: 'Key Decisions Review', phase: 'Mid Debrief', time: '10 min', method: 'Discussion' },
  { section: 'Performance Analysis', phase: 'Mid Debrief', time: '10 min', method: 'Data Review' },
  { section: 'Learning Connections', phase: 'Late Debrief', time: '8 min', method: 'Discussion' },
  { section: 'Takeaways & Next Steps', phase: 'Debrief End', time: '5 min', method: 'Summary' },
];
export function SimAdminDebrief() {
  const router = useRouter();
  const [tab, setTab] = useState('sec');
  const cols: Col<Sec>[] = [
    { key: 'section', label: 'Section', render: (r) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600, color: ink }}><FileText size={14} color={tealMid} /> {r.section}</span> },
    { key: 'phase', label: 'Phase', render: (r) => <span style={{ color: muted }}>{r.phase}</span> },
    { key: 'time', label: 'Est. time', render: (r) => <span style={{ fontVariantNumeric: 'tabular-nums', color: body }}>{r.time}</span> },
    { key: 'method', label: 'Method', align: 'right', render: (r) => <Tag tone="neutral">{r.method}</Tag> },
  ];
  return (
    <SimSidebarShell nav={ADMIN_NAV} active="scenarios" user={ADMIN_USER}>
      <PageHead title="Debrief Guide Setup" subtitle="Build a structured debrief guide for instructors." right={<CtaButton onClick={() => router.push('/sim/admin/controls')}>Save</CtaButton>} />
      <div style={{ marginBottom: 16 }}><FilterTabs tabs={[{ id: 'sec', label: 'Guide Sections', count: 5 }, { id: 'phase', label: 'By Phase' }, { id: 'timing', label: 'Timing' }]} active={tab} onChange={setTab} /></div>
      <DataTable columns={cols} rows={SECS} getKey={(r) => r.section} />
      <div style={{ marginTop: 14 }}><OutlineButton><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Plus size={15} /> Add section</span></OutlineButton></div>
    </SimSidebarShell>
  );
}

/* ════════════ 15 · Teacher-Safe Controls ════════════ */
const CONTROL_GROUPS: { group: string; items: { label: string; on: boolean }[] }[] = [
  { group: 'Access & Visibility', items: [{ label: 'Hide student identities', on: true }, { label: 'Mask team performance', on: true }, { label: 'Delay scores until debrief', on: true }] },
  { group: 'Interventions', items: [{ label: 'Pause sessions for all teams', on: false }, { label: 'Push event to all teams', on: false }, { label: 'Adjust KPI targets', on: false }] },
  { group: 'Content Guardrails', items: [{ label: 'Prevent external research', on: true }, { label: 'Require decision rationale', on: true }, { label: 'Restrict chat between teams', on: false }] },
  { group: 'Audit & Logging', items: [{ label: 'Log all teacher actions', on: true }] },
];
export function SimAdminControls() {
  const router = useRouter();
  const [state, setState] = useState<Record<string, boolean>>(() => Object.fromEntries(CONTROL_GROUPS.flatMap((g) => g.items.map((i) => [i.label, i.on]))));
  return (
    <SimSidebarShell nav={ADMIN_NAV} active="settings" user={ADMIN_USER}>
      <PageHead title="Teacher-Safe Controls" subtitle="Configure tools and guardrails for teaching in a safe context." right={<CtaButton onClick={() => router.push('/sim/admin/preview/teacher')}>Save controls</CtaButton>} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 860 }}>
        {CONTROL_GROUPS.map((g) => (
          <DeckCard key={g.group} style={{ padding: 20 }}>
            <Eyebrow>{g.group}</Eyebrow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
              {g.items.map((it) => (
                <div key={it.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ fontFamily: DATA, fontSize: 13.5, color: body }}>{it.label}</span>
                  <Toggle on={state[it.label]} onChange={(v) => setState((s) => ({ ...s, [it.label]: v }))} />
                </div>
              ))}
            </div>
          </DeckCard>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
        <OutlineButton><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><RefreshCw size={15} /> Reset to defaults</span></OutlineButton>
      </div>
    </SimSidebarShell>
  );
}
