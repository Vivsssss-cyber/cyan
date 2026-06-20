'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Check, GraduationCap, Users, Calendar, Settings, Copy } from '../PixelIcons';
import { SimSidebarShell, TEACHER_NAV, PageHead, DeckCard, DeckStat, StatusPill } from './SimShell';
import { Field, TextInput, TextArea, SelectInput } from './admin-ui';
import { CtaButton, OutlineButton, GhostButton, Eyebrow, Tag, DISPLAY, DATA, ink, body, muted, faint, cyan, tealMid, success, cyanTint, whisper, surfaceSoft } from './sim-ui';

const TEACHER = { name: 'Mrs. Johnson', role: 'Science Teacher' };

interface ClassRow { name: string; term: string; students: number; status: string; note: string }
const CLASSES: ClassRow[] = [
  { name: 'Global Supply Chain 101', term: 'Fall 2024', students: 24, status: 'active', note: '3 upcoming sessions' },
  { name: 'Operations Management', term: 'Fall 2024', students: 18, status: 'active', note: '1 upcoming session' },
  { name: 'Business Simulation Lab', term: 'Fall 2024', students: 32, status: 'draft', note: 'No upcoming sessions' },
  { name: 'SCM Capstone', term: 'Fall 2024', students: 12, status: 'completed', note: 'Ended Dec 2024' },
];

/* ════════════ 31 · My Classes ════════════ */
export function SimTeacherClasses() {
  const router = useRouter();
  return (
    <SimSidebarShell nav={TEACHER_NAV} active="classes" user={TEACHER}>
      <PageHead title="My Classes" subtitle="Create and manage your classes." right={<CtaButton onClick={() => router.push('/sim/teacher/classes/new')}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Plus size={15} /> Create class</span></CtaButton>} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {CLASSES.map((c) => (
          <DeckCard key={c.name} style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ width: 44, height: 44, borderRadius: 12, background: cyanTint, color: tealMid, display: 'grid', placeItems: 'center', flexShrink: 0 }}><GraduationCap size={22} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 17, color: ink }}>{c.name}</span>
                <StatusPill status={c.status} />
              </div>
              <div style={{ fontFamily: DATA, fontSize: 13, color: muted, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>{c.term} · {c.students} students · {c.note}</div>
            </div>
            <OutlineButton onClick={() => router.push('/sim/teacher/classes/detail')}>Open class</OutlineButton>
          </DeckCard>
        ))}
      </div>
      <div style={{ marginTop: 16, textAlign: 'center' }}><GhostButton>View archived classes</GhostButton></div>
    </SimSidebarShell>
  );
}

/* ════════════ 32 · Create Class ════════════ */
const CC_STEPS = [
  { label: 'Class Details', sub: 'Name & term' },
  { label: 'Team Settings', sub: 'Teams & size' },
  { label: 'Session Defaults', sub: 'Defaults' },
  { label: 'Review', sub: 'Confirm' },
];
export function SimTeacherCreateClass() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('Global Supply Chain Strategy');
  const [term, setTerm] = useState('Spring 2025');
  const [code, setCode] = useState('MGMT 455');
  const [desc, setDesc] = useState('Simulation-based course exploring global supply chain strategy, operations, and decision-making.');
  const [tz, setTz] = useState('(UTC-05:00) Eastern Time (US & Canada)');
  return (
    <SimSidebarShell nav={TEACHER_NAV} active="classes" user={TEACHER}>
      <PageHead title="Create Class" subtitle="Set up a new class in a few simple steps." />
      <div style={{ display: 'grid', gridTemplateColumns: '220px minmax(0,1fr)', gap: 22, alignItems: 'start' }}>
        <DeckCard style={{ padding: 16, position: 'sticky', top: 20 }}>
          {CC_STEPS.map((s, i) => {
            const state = i < step ? 'done' : i === step ? 'active' : 'pending';
            return (
              <button key={s.label} onClick={() => i <= step && setStep(i)} style={{ display: 'flex', gap: 12, width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: i <= step ? 'pointer' : 'default', padding: '8px 4px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ width: 28, height: 28, borderRadius: '50%', display: 'grid', placeItems: 'center', flexShrink: 0, background: state === 'done' ? success : state === 'active' ? cyan : 'var(--game-surface-solid)', border: state === 'pending' ? '1.4px solid var(--sv-border)' : 'none', color: state === 'pending' ? faint : '#fff', fontFamily: DATA, fontWeight: 700, fontSize: 13 }}>{state === 'done' ? <Check size={15} /> : i + 1}</span>
                  {i < CC_STEPS.length - 1 && <span style={{ width: 1.5, flex: 1, minHeight: 22, background: i < step ? success : 'var(--sv-border)', marginTop: 4 }} />}
                </div>
                <div style={{ paddingTop: 3 }}>
                  <div style={{ fontFamily: DISPLAY, fontWeight: state === 'active' ? 700 : 600, fontSize: 14, color: state === 'pending' ? faint : ink }}>{s.label}</div>
                  <div style={{ fontFamily: DATA, fontSize: 11.5, color: faint, marginTop: 1 }}>{s.sub}</div>
                </div>
              </button>
            );
          })}
        </DeckCard>

        <DeckCard style={{ padding: 24 }}>
          {step === 0 && (
            <>
              <Eyebrow>Class details</Eyebrow>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 16 }}>
                <Field label="Class name" required><TextInput value={name} onChange={(e) => setName(e.target.value)} /></Field>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Field label="Term"><SelectInput value={term} onChange={setTerm} options={['Spring 2025', 'Fall 2025', 'Summer 2025']} /></Field>
                  <Field label="Course code (optional)"><TextInput value={code} onChange={(e) => setCode(e.target.value)} /></Field>
                </div>
                <Field label="Description (optional)"><TextArea value={desc} onChange={(e) => setDesc(e.target.value)} /></Field>
                <Field label="Timezone"><SelectInput value={tz} onChange={setTz} options={['(UTC-05:00) Eastern Time (US & Canada)', '(UTC-08:00) Pacific Time', '(UTC+00:00) UTC']} /></Field>
              </div>
            </>
          )}
          {step > 0 && step < 3 && (
            <div style={{ minHeight: 200, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
              <div>
                <Eyebrow>{CC_STEPS[step].label}</Eyebrow>
                <p style={{ fontFamily: DATA, fontSize: 14, color: muted, marginTop: 10, maxWidth: '44ch' }}>Configure {CC_STEPS[step].label.toLowerCase()} — defaults applied; adjust later in class settings.</p>
              </div>
            </div>
          )}
          {step === 3 && (
            <>
              <Eyebrow>Review</Eyebrow>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, marginTop: 14, background: surfaceSoft, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--sv-border)' }}>
                {[['Class', name], ['Term', term], ['Course', code], ['Timezone', tz]].map(([k, v], i) => (
                  <div key={k} style={{ padding: '13px 16px', borderTop: i > 1 ? '1px solid var(--sv-border)' : 'none', borderLeft: i % 2 ? '1px solid var(--sv-border)' : 'none' }}>
                    <div style={{ fontFamily: DATA, fontSize: 11, color: faint, textTransform: 'uppercase', letterSpacing: '0.6px' }}>{k}</div>
                    <div style={{ fontFamily: DATA, fontSize: 13.5, fontWeight: 600, color: ink, marginTop: 2 }}>{v}</div>
                  </div>
                ))}
              </div>
            </>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
            <GhostButton onClick={() => (step === 0 ? router.push('/sim/teacher/classes') : setStep(step - 1))}>{step === 0 ? 'Cancel' : 'Back'}</GhostButton>
            {step < 3 ? <CtaButton onClick={() => setStep(step + 1)}>Next</CtaButton> : <CtaButton onClick={() => router.push('/sim/teacher/classes/detail')}>Create class</CtaButton>}
          </div>
        </DeckCard>
      </div>
    </SimSidebarShell>
  );
}

/* ════════════ 33 · Class Detail ════════════ */
export function SimTeacherClassDetail() {
  const router = useRouter();
  const [tab, setTab] = useState('Overview');
  const QUICK = [
    { label: 'Add students', icon: Users, to: '/sim/teacher/roster' },
    { label: 'Create session', icon: Calendar, to: '/sim/teacher/setup' },
    { label: 'Manage teams', icon: Users, to: '/sim/teacher/teams' },
    { label: 'Class settings', icon: Settings, to: '/sim/teacher/invite' },
  ];
  return (
    <SimSidebarShell nav={TEACHER_NAV} active="classes" user={TEACHER}>
      <PageHead title="Global Supply Chain Strategy" subtitle="Spring 2025 · MGMT 455" right={<div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><StatusPill status="active" /><OutlineButton>Edit class</OutlineButton></div>} />
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--sv-border)', marginBottom: 20 }}>
        {['Overview', 'Sessions', 'Roster', 'Teams', 'Settings'].map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ fontFamily: DISPLAY, fontWeight: tab === t ? 700 : 600, fontSize: 13.5, padding: '10px 14px', border: 'none', background: 'none', cursor: 'pointer', color: tab === t ? tealMid : muted, borderBottom: '2px solid ' + (tab === t ? cyan : 'transparent'), marginBottom: -1 }}>{t}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        <DeckStat label="Students" value="24" sub="enrolled" />
        <DeckStat label="Teams" value="6" sub="created" />
        <DeckStat label="Sessions" value="4" sub="planned" />
        <DeckStat label="Status" value="Active" tone="up" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)', gap: 18, alignItems: 'start' }}>
        <DeckCard style={{ padding: 22 }}>
          <Eyebrow>Class information</Eyebrow>
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column' }}>
            {[['Description', 'Simulation-based course exploring global supply chain strategy.'], ['Timezone', '(UTC-05:00) Eastern Time'], ['Default currency', 'USD — US Dollar'], ['Join code', 'GSC-STRAT-25'], ['Invite link', 'cysim.com/join/GSC-STRAT-25']].map(([k, v], i) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '11px 0', borderTop: i ? '1px solid var(--sv-border)' : 'none' }}>
                <span style={{ fontFamily: DATA, fontSize: 12.5, color: faint }}>{k}</span>
                <span style={{ fontFamily: DATA, fontSize: 13.5, fontWeight: 600, color: ink, textAlign: 'right' }}>{v}</span>
              </div>
            ))}
          </div>
        </DeckCard>
        <div>
          <Eyebrow>Quick actions</Eyebrow>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
            {QUICK.map((q) => { const I = q.icon; return (
              <DeckCard key={q.label} onClick={() => router.push(q.to)} className="sim-qa" style={{ padding: 16, cursor: 'pointer', transition: 'transform .15s ease' }}>
                <span style={{ width: 36, height: 36, borderRadius: 10, background: cyanTint, color: tealMid, display: 'grid', placeItems: 'center' }}><I size={18} /></span>
                <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 13.5, color: ink, marginTop: 10 }}>{q.label}</div>
              </DeckCard>
            ); })}
          </div>
        </div>
      </div>
      <style>{`.sim-qa:hover{transform:translateY(-2px);}`}</style>
    </SimSidebarShell>
  );
}
