'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, X, Check, Clock, Layers, Target, GraduationCap, Truck, Megaphone, Landmark, ShoppingBag,
  Users, Play, Monitor, Eye, ExternalLink, FileText, BookOpen, Flag,
} from '../PixelIcons';
import { SimSidebarShell, TEACHER_NAV, PageHead, DeckCard, StatusPill } from './SimShell';
import { Field, TextInput, TextArea, SelectInput, Toggle } from './admin-ui';
import { SCENARIOS, Scenario } from '../../context/SimContext';
import {
  CtaButton, OutlineButton, GhostButton, Eyebrow, Tag, DISPLAY, DATA,
  ink, body, muted, faint, cyan, tealMid, success, cyanTint, whisper, surfaceSoft,
} from './sim-ui';

const TEACHER = { name: 'Mrs. Johnson', role: 'Science Teacher' };

const SUBJECT_META: Record<string, { icon: React.ComponentType<{ size?: number; color?: string }>; grad: string }> = {
  'Supply Chain': { icon: Truck, grad: 'linear-gradient(135deg,#006E85,#00A0C2)' },
  Marketing: { icon: Megaphone, grad: 'linear-gradient(135deg,#00A0C2,#00C1EB)' },
  Finance: { icon: Landmark, grad: 'linear-gradient(135deg,#003D47,#006E85)' },
  Retail: { icon: ShoppingBag, grad: 'linear-gradient(135deg,#00B1D6,#4DB5B6)' },
};

function Thumb({ subject, h = 120 }: { subject: string; h?: number }) {
  const m = SUBJECT_META[subject] ?? SUBJECT_META.Marketing;
  const Icon = m.icon;
  return (
    <div style={{ height: h, borderRadius: 12, background: m.grad, position: 'relative', overflow: 'hidden', display: 'grid', placeItems: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.18, backgroundImage: 'radial-gradient(circle at 20% 20%, #fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
      <Icon size={h > 90 ? 38 : 24} color="#ffffff" />
    </div>
  );
}

const GRADE = 'Grades 9–12';
const STANDARDS: Record<string, string> = {
  'Supply Chain': 'CCSS.MATH · NBEA Operations',
  Marketing: 'NBEA Marketing · C3 Economics',
  Finance: 'NBEA Finance · CCSS.MATH',
  Retail: 'NBEA Marketing · DECA',
};

/* ════════════ 25 · Scenario Comparison ════════════ */
const CMP_ROWS: { key: string; label: string; icon: React.ComponentType<{ size?: number; color?: string }>; get: (s: Scenario) => React.ReactNode }[] = [
  { key: 'grade', label: 'Grade level', icon: GraduationCap, get: () => GRADE },
  { key: 'dur', label: 'Duration', icon: Clock, get: (s) => s.durationLabel },
  { key: 'cx', label: 'Complexity', icon: Layers, get: (s) => s.level },
  { key: 'focus', label: 'Focus', icon: Target, get: (s) => s.subject },
  { key: 'mods', label: 'Modules', icon: Layers, get: (s) => s.modules.join(' · ') },
  { key: 'teams', label: 'Default teams', icon: Users, get: (s) => `${s.teamsDefault} teams` },
  { key: 'obj', label: 'Objectives', icon: Flag, get: (s) => `${s.objectives.length} learning goals` },
  { key: 'std', label: 'Standards', icon: FileText, get: (s) => STANDARDS[s.subject] ?? '—' },
];

export function SimTeacherScenarioCompare() {
  const router = useRouter();
  const [ids, setIds] = useState<string[]>([SCENARIOS[0].id, SCENARIOS[1].id]);
  const cols = ids.map((id) => SCENARIOS.find((s) => s.id === id)!).filter(Boolean);
  const remaining = SCENARIOS.filter((s) => !ids.includes(s.id));
  const canAdd = ids.length < 3 && remaining.length > 0;
  const removeCol = (id: string) => ids.length > 2 && setIds(ids.filter((x) => x !== id));
  const addCol = () => canAdd && setIds([...ids, remaining[0].id]);

  // grid: label column + N scenario columns (+ add column when room)
  const gridCols = `170px repeat(${cols.length}, minmax(0,1fr))${canAdd ? ' 150px' : ''}`;

  return (
    <SimSidebarShell nav={TEACHER_NAV} active="library" user={TEACHER}>
      <PageHead
        title="Compare Scenarios"
        subtitle="Line up two or three scenarios side-by-side before you assign."
        right={<OutlineButton onClick={() => router.push('/sim/teacher/library')}>Back to library</OutlineButton>}
      />

      <DeckCard style={{ padding: 0, overflow: 'hidden' }}>
        {/* Header row: scenario cards */}
        <div style={{ display: 'grid', gridTemplateColumns: gridCols, alignItems: 'stretch' }}>
          <div style={{ background: surfaceSoft, borderBottom: '1px solid ' + whisper }} />
          {cols.map((s) => (
            <div key={s.id} style={{ padding: 16, borderLeft: '1px solid ' + whisper, borderBottom: '1px solid ' + whisper, position: 'relative' }}>
              {ids.length > 2 && (
                <button onClick={() => removeCol(s.id)} aria-label="Remove" style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', cursor: 'pointer', color: faint }}><X size={16} /></button>
              )}
              <Thumb subject={s.subject} h={78} />
              <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 16, color: ink, marginTop: 11, letterSpacing: '-0.3px' }}>{s.title}</div>
              <div style={{ marginTop: 6 }}><Tag>{s.subject}</Tag></div>
            </div>
          ))}
          {canAdd && (
            <button onClick={addCol} style={{ borderLeft: '1px solid ' + whisper, borderBottom: '1px solid ' + whisper, background: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center', padding: 16 }}>
              <span style={{ display: 'grid', placeItems: 'center', gap: 8 }}>
                <span style={{ width: 40, height: 40, borderRadius: 12, border: '1.4px dashed ' + whisper, display: 'grid', placeItems: 'center', color: tealMid }}><Plus size={20} /></span>
                <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 13, color: muted }}>Add scenario</span>
              </span>
            </button>
          )}
        </div>

        {/* Attribute rows */}
        {CMP_ROWS.map((row, ri) => {
          const Icon = row.icon;
          return (
            <div key={row.key} style={{ display: 'grid', gridTemplateColumns: gridCols, background: ri % 2 ? 'transparent' : surfaceSoft }}>
              <div style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 9, borderBottom: '1px solid ' + whisper }}>
                <Icon size={15} color={faint} />
                <span style={{ fontFamily: DATA, fontSize: 12.5, fontWeight: 600, color: muted }}>{row.label}</span>
              </div>
              {cols.map((s) => (
                <div key={s.id} style={{ padding: '13px 16px', borderLeft: '1px solid ' + whisper, borderBottom: '1px solid ' + whisper, fontFamily: DATA, fontSize: 13.5, color: ink, fontWeight: 500 }}>{row.get(s)}</div>
              ))}
              {canAdd && <div style={{ borderLeft: '1px solid ' + whisper, borderBottom: '1px solid ' + whisper }} />}
            </div>
          );
        })}

        {/* Action row */}
        <div style={{ display: 'grid', gridTemplateColumns: gridCols }}>
          <div />
          {cols.map((s) => (
            <div key={s.id} style={{ padding: 16, borderLeft: '1px solid ' + whisper }}>
              <CtaButton full onClick={() => router.push('/sim/teacher/assign')}>Assign</CtaButton>
            </div>
          ))}
          {canAdd && <div style={{ borderLeft: '1px solid ' + whisper }} />}
        </div>
      </DeckCard>
    </SimSidebarShell>
  );
}

/* ════════════ 26 · Assign Scenario to Class ════════════ */
const ASSIGN_CLASSES = [
  { name: 'Global Supply Chain 101', term: 'Spring 2025', students: 24 },
  { name: 'Operations Management', term: 'Spring 2025', students: 18 },
  { name: 'Business Simulation Lab', term: 'Spring 2025', students: 32 },
  { name: 'SCM Capstone', term: 'Spring 2025', students: 12 },
];
const AS_STEPS = ['Select classes', 'Details', 'Confirm'];

export function SimTeacherAssign() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string[]>(['Global Supply Chain 101']);
  const [due, setDue] = useState('2025-04-18');
  const [open, setOpen] = useState('2025-04-04');
  const [rounds, setRounds] = useState('6 rounds');
  const [notify, setNotify] = useState(true);
  const [instr, setInstr] = useState('Read the scenario brief before your first session. Decisions lock each Friday at 5pm.');

  const scenario = SCENARIOS[1];
  const toggle = (n: string) => setPicked((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]));
  const totalStudents = ASSIGN_CLASSES.filter((c) => picked.includes(c.name)).reduce((a, c) => a + c.students, 0);
  const canNext = step !== 0 || picked.length > 0;

  return (
    <SimSidebarShell nav={TEACHER_NAV} active="assignments" user={TEACHER}>
      <PageHead title="Assign Scenario" subtitle={`${scenario.title} → choose classes, set the schedule, confirm.`} />

      {/* horizontal stepper */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 22 }}>
        {AS_STEPS.map((s, i) => {
          const state = i < step ? 'done' : i === step ? 'active' : 'pending';
          return (
            <React.Fragment key={s}>
              <button onClick={() => i < step && setStep(i)} style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'none', border: 'none', cursor: i < step ? 'pointer' : 'default', padding: 0 }}>
                <span style={{ width: 26, height: 26, borderRadius: '50%', display: 'grid', placeItems: 'center', flexShrink: 0, background: state === 'done' ? success : state === 'active' ? cyan : 'var(--game-surface-solid)', border: state === 'pending' ? '1.4px solid ' + whisper : 'none', color: state === 'pending' ? faint : '#fff', fontFamily: DATA, fontWeight: 700, fontSize: 12.5 }}>{state === 'done' ? <Check size={14} /> : i + 1}</span>
                <span style={{ fontFamily: DISPLAY, fontWeight: state === 'active' ? 700 : 600, fontSize: 13.5, color: state === 'pending' ? faint : ink }}>{s}</span>
              </button>
              {i < AS_STEPS.length - 1 && <span style={{ flex: 1, height: 1.5, background: i < step ? success : whisper, margin: '0 14px' }} />}
            </React.Fragment>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1fr)', gap: 20, alignItems: 'start' }}>
        <DeckCard style={{ padding: 24 }}>
          {step === 0 && (
            <>
              <Eyebrow>Select classes</Eyebrow>
              <p style={{ fontFamily: DATA, fontSize: 13, color: muted, margin: '8px 0 16px' }}>Pick one or more classes to receive this scenario.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {ASSIGN_CLASSES.map((c) => {
                  const on = picked.includes(c.name);
                  return (
                    <button key={c.name} onClick={() => toggle(c.name)} style={{ display: 'flex', alignItems: 'center', gap: 13, textAlign: 'left', background: on ? cyanTint : 'var(--game-surface-solid)', border: '1.4px solid ' + (on ? cyan : whisper), borderRadius: 12, padding: '13px 15px', cursor: 'pointer', transition: 'border-color .12s ease, background .12s ease' }}>
                      <span style={{ width: 22, height: 22, borderRadius: 6, border: '1.6px solid ' + (on ? cyan : whisper), background: on ? cyan : '#fff', display: 'grid', placeItems: 'center', flexShrink: 0 }}>{on && <Check size={14} color="#fff" />}</span>
                      <span style={{ width: 38, height: 38, borderRadius: 10, background: cyanTint, color: tealMid, display: 'grid', placeItems: 'center', flexShrink: 0 }}><GraduationCap size={19} /></span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: 'block', fontFamily: DISPLAY, fontWeight: 700, fontSize: 15, color: ink }}>{c.name}</span>
                        <span style={{ display: 'block', fontFamily: DATA, fontSize: 12.5, color: muted, marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>{c.term} · {c.students} students</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <Eyebrow>Assignment details</Eyebrow>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Field label="Opens"><TextInput type="date" value={open} onChange={(e) => setOpen(e.target.value)} /></Field>
                  <Field label="Due"><TextInput type="date" value={due} onChange={(e) => setDue(e.target.value)} /></Field>
                </div>
                <Field label="Rounds"><SelectInput value={rounds} onChange={setRounds} options={['4 rounds', '6 rounds', '8 rounds', '12 rounds']} /></Field>
                <Field label="Instructions for students"><TextArea value={instr} onChange={(e) => setInstr(e.target.value)} /></Field>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '12px 14px', background: surfaceSoft, borderRadius: 10, border: '1px solid ' + whisper }}>
                  <div>
                    <div style={{ fontFamily: DATA, fontSize: 13.5, fontWeight: 600, color: ink }}>Notify students</div>
                    <div style={{ fontFamily: DATA, fontSize: 12, color: muted, marginTop: 1 }}>Email + in-app on open date</div>
                  </div>
                  <Toggle on={notify} onChange={setNotify} />
                </div>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <Eyebrow>Confirm assignment</Eyebrow>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginTop: 16, padding: 14, background: surfaceSoft, borderRadius: 12, border: '1px solid ' + whisper }}>
                <div style={{ width: 90, flexShrink: 0 }}><Thumb subject={scenario.subject} h={60} /></div>
                <div>
                  <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 17, color: ink }}>{scenario.title}</div>
                  <div style={{ fontFamily: DATA, fontSize: 12.5, color: muted, marginTop: 3 }}>{scenario.durationLabel} · {scenario.level} · {rounds}</div>
                </div>
              </div>
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column' }}>
                {[['Classes', picked.join(', ') || '—'], ['Students', `${totalStudents} total`], ['Opens', open], ['Due', due], ['Notify', notify ? 'On' : 'Off']].map(([k, v], i) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '11px 0', borderTop: i ? '1px solid ' + whisper : 'none' }}>
                    <span style={{ fontFamily: DATA, fontSize: 12.5, color: faint }}>{k}</span>
                    <span style={{ fontFamily: DATA, fontSize: 13.5, fontWeight: 600, color: ink, textAlign: 'right' }}>{v}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
            <GhostButton onClick={() => (step === 0 ? router.push('/sim/teacher/library') : setStep(step - 1))}>{step === 0 ? 'Cancel' : 'Back'}</GhostButton>
            {step < 2
              ? <CtaButton disabled={!canNext} reason={canNext ? undefined : 'Select at least one class'} onClick={() => canNext && setStep(step + 1)}>Next</CtaButton>
              : <CtaButton onClick={() => router.push('/sim/teacher/assigned')}>Assign to {picked.length} {picked.length === 1 ? 'class' : 'classes'}</CtaButton>}
          </div>
        </DeckCard>

        {/* Summary rail */}
        <DeckCard style={{ padding: 20, position: 'sticky', top: 20 }}>
          <Eyebrow>Assignment summary</Eyebrow>
          <div style={{ marginTop: 14 }}><Thumb subject={scenario.subject} h={96} /></div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 16, color: ink, marginTop: 12 }}>{scenario.title}</div>
          <div style={{ display: 'flex', gap: 7, marginTop: 8, flexWrap: 'wrap' }}>
            <Tag tone="neutral">{scenario.durationLabel}</Tag><Tag tone="neutral">{scenario.level}</Tag>
          </div>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[['Classes', String(picked.length)], ['Students', String(totalStudents)], ['Rounds', rounds], ['Schedule', `${open} → ${due}`]].map(([k, v], i) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 0', borderTop: i ? '1px solid ' + whisper : 'none' }}>
                <span style={{ fontFamily: DATA, fontSize: 12.5, color: faint }}>{k}</span>
                <span style={{ fontFamily: DATA, fontSize: 13, fontWeight: 600, color: ink, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{v}</span>
              </div>
            ))}
          </div>
        </DeckCard>
      </div>
    </SimSidebarShell>
  );
}

/* ════════════ 27 · Scenario Preview Modal ════════════ */
export function SimTeacherScenarioPreview() {
  const router = useRouter();
  const [tab, setTab] = useState<'Overview' | 'Teacher guide'>('Overview');
  const s = SCENARIOS[1];
  const m = SUBJECT_META[s.subject] ?? SUBJECT_META.Marketing;
  const close = () => router.push('/sim/teacher/library');

  return (
    <SimSidebarShell nav={TEACHER_NAV} active="library" user={TEACHER}>
      <PageHead title="Scenario Library" subtitle="Previewing a scenario." right={<OutlineButton onClick={close}>Close preview</OutlineButton>} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 80, display: 'grid', placeItems: 'center', padding: 24 }}>
        <div onClick={close} style={{ position: 'absolute', inset: 0, background: 'rgba(0,44,51,0.30)', backdropFilter: 'blur(3px)' }} />
        <div style={{ position: 'relative', width: 720, maxWidth: '96vw', maxHeight: '92vh', overflowY: 'auto', background: '#fff', borderRadius: 16, boxShadow: '0 24px 70px rgba(0,44,51,0.28)' }}>
          {/* hero */}
          <div style={{ height: 170, background: m.grad, position: 'relative', overflow: 'hidden', borderRadius: '16px 16px 0 0', display: 'flex', alignItems: 'flex-end', padding: 22 }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.18, backgroundImage: 'radial-gradient(circle at 18% 20%, #fff 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
            <button onClick={close} aria-label="Close" style={{ position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: 999, background: 'rgba(255,255,255,0.22)', border: 'none', cursor: 'pointer', color: '#fff', display: 'grid', placeItems: 'center' }}><X size={18} /></button>
            <div style={{ position: 'relative' }}>
              <span style={{ fontFamily: DATA, fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '1px', textTransform: 'uppercase' }}>{s.subject}</span>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 28, color: '#fff', letterSpacing: '-0.6px', marginTop: 4 }}>{s.title}</h2>
            </div>
          </div>

          <div style={{ padding: 24 }}>
            {/* meta */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Tag tone="neutral">{s.durationLabel}</Tag><Tag tone="neutral">{s.level}</Tag>
              <Tag tone="neutral">{GRADE}</Tag><Tag tone="neutral">{s.teamsDefault} teams</Tag>
            </div>

            {/* tabs */}
            <div style={{ display: 'flex', gap: 4, marginTop: 18, borderBottom: '1px solid ' + whisper }}>
              {(['Overview', 'Teacher guide'] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)} style={{ fontFamily: DISPLAY, fontWeight: tab === t ? 700 : 600, fontSize: 13.5, padding: '10px 14px', border: 'none', background: 'none', cursor: 'pointer', color: tab === t ? tealMid : muted, borderBottom: '2px solid ' + (tab === t ? cyan : 'transparent'), marginBottom: -1 }}>{t}</button>
              ))}
            </div>

            <div style={{ marginTop: 18 }}>
              {tab === 'Overview' && (
                <>
                  <p style={{ fontFamily: DISPLAY, fontSize: 15, lineHeight: 1.65, color: body }}>{s.summary}</p>
                  <div style={{ marginTop: 18 }}>
                    <Eyebrow>Learning objectives</Eyebrow>
                    <ul style={{ margin: '12px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
                      {s.objectives.map((o) => (
                        <li key={o} style={{ display: 'flex', gap: 9, alignItems: 'flex-start', fontFamily: DATA, fontSize: 14, color: body }}>
                          <Check size={16} color={success} style={{ marginTop: 1, flexShrink: 0 }} /> {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ marginTop: 18 }}>
                    <Eyebrow>Modules</Eyebrow>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                      {s.modules.map((md) => <Tag key={md} tone="neutral">{md}</Tag>)}
                    </div>
                  </div>
                </>
              )}
              {tab === 'Teacher guide' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[
                    { h: 'Facilitation arc', icon: BookOpen, b: 'Open with the brief, run decision rounds with a debrief between each, and close with the reflection prompt. Plan ~15 min per round plus debrief.' },
                    { h: 'Discussion prompts', icon: Target, b: 'What signal did your team weight most? Where did the cost shock change your plan? How did pricing and spend trade off?' },
                    { h: 'Standards alignment', icon: FileText, b: STANDARDS[s.subject] ?? '—' },
                  ].map((g) => { const I = g.icon; return (
                    <div key={g.h} style={{ display: 'flex', gap: 12 }}>
                      <span style={{ width: 36, height: 36, borderRadius: 10, background: cyanTint, color: tealMid, display: 'grid', placeItems: 'center', flexShrink: 0 }}><I size={18} /></span>
                      <div>
                        <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 14.5, color: ink }}>{g.h}</div>
                        <div style={{ fontFamily: DATA, fontSize: 13.5, color: body, marginTop: 3, lineHeight: 1.55 }}>{g.b}</div>
                      </div>
                    </div>
                  ); })}
                </div>
              )}
            </div>

            {/* footer */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24, paddingTop: 18, borderTop: '1px solid ' + whisper }}>
              <OutlineButton onClick={() => router.push('/sim/teacher/scenarios/compare')}>Compare</OutlineButton>
              <CtaButton onClick={() => router.push('/sim/teacher/assign')}>Assign to class</CtaButton>
            </div>
          </div>
        </div>
      </div>
    </SimSidebarShell>
  );
}

/* ════════════ 28 · Launch-Ready Card View ════════════ */
export function SimTeacherLaunchReady() {
  const router = useRouter();
  const cards = [...SCENARIOS, ...SCENARIOS.slice(0, 2)];
  return (
    <SimSidebarShell nav={TEACHER_NAV} active="library" user={TEACHER}>
      <PageHead
        title="Ready to Launch"
        subtitle="Scenarios configured, balanced, and assigned — one click to go live."
        right={<OutlineButton onClick={() => router.push('/sim/teacher/quick-launch')}>Quick launch panel</OutlineButton>}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {cards.map((s, i) => (
          <DeckCard key={s.id + i} className="sim-lr" style={{ padding: 14, cursor: 'pointer', transition: 'transform .15s ease', position: 'relative' }} onClick={() => router.push('/sim/teacher/quick-launch')}>
            <div style={{ position: 'relative' }}>
              <Thumb subject={s.subject} h={128} />
              <span style={{ position: 'absolute', top: 10, left: 10, display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: DATA, fontSize: 11, fontWeight: 700, color: success, background: 'rgba(255,255,255,0.92)', padding: '4px 10px', borderRadius: 999 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: success }} /> Ready to launch
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 12 }}>
              <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 16, color: ink, letterSpacing: '-0.3px' }}>{s.title}</div>
              <Tag>{s.subject}</Tag>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, fontFamily: DATA, fontSize: 12.5, color: muted }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Clock size={13} /> {s.durationLabel}</span>
              <span>·</span><span>{s.level}</span>
              <span>·</span><span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Users size={13} /> {s.teamsDefault}</span>
            </div>
            <div style={{ marginTop: 14 }}>
              <CtaButton full onClick={() => router.push('/sim/teacher/quick-launch')}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><Play size={14} /> Launch now</span></CtaButton>
            </div>
          </DeckCard>
        ))}
      </div>
      <style>{`.sim-lr:hover{transform:translateY(-3px);}`}</style>
    </SimSidebarShell>
  );
}

/* ════════════ 29 · My Simulations / Assigned ════════════ */
interface SimRow { scenario: string; subject: string; cls: string; schedule: string; progress: number; status: string; kind: 'assigned' | 'created' }
const SIM_ROWS: SimRow[] = [
  { scenario: 'FMCG Competition', subject: 'Marketing', cls: 'Global Supply Chain 101', schedule: 'Apr 4 → Apr 18', progress: 62, status: 'running', kind: 'assigned' },
  { scenario: 'Intro to Supply Chain', subject: 'Supply Chain', cls: 'Operations Management', schedule: 'Apr 2 → Apr 9', progress: 100, status: 'completed', kind: 'assigned' },
  { scenario: 'Retail Launch Sprint', subject: 'Retail', cls: 'Business Simulation Lab', schedule: 'Apr 21 (scheduled)', progress: 0, status: 'pending', kind: 'assigned' },
  { scenario: 'Finance Fundamentals', subject: 'Finance', cls: 'SCM Capstone', schedule: 'Draft', progress: 0, status: 'draft', kind: 'created' },
  { scenario: 'FMCG Competition — Custom', subject: 'Marketing', cls: 'Operations Management', schedule: 'Mar 28 → Apr 4', progress: 100, status: 'completed', kind: 'created' },
  { scenario: 'Supply Chain Shock', subject: 'Supply Chain', cls: 'Global Supply Chain 101', schedule: 'Draft', progress: 0, status: 'draft', kind: 'created' },
];
const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'running', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
  { id: 'draft', label: 'Draft' },
  { id: 'pending', label: 'Scheduled' },
];

export function SimTeacherAssigned() {
  const router = useRouter();
  const [kind, setKind] = useState<'assigned' | 'created'>('assigned');
  const [filter, setFilter] = useState('all');
  const rows = SIM_ROWS.filter((r) => r.kind === kind && (filter === 'all' || r.status === filter));

  return (
    <SimSidebarShell nav={TEACHER_NAV} active="assignments" user={TEACHER}>
      <PageHead
        title="My Simulations"
        subtitle="Everything you've assigned or created — track progress at a glance."
        right={<CtaButton onClick={() => router.push('/sim/teacher/library')}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Plus size={15} /> New assignment</span></CtaButton>}
      />

      {/* primary tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid ' + whisper, marginBottom: 16 }}>
        {(['assigned', 'created'] as const).map((t) => (
          <button key={t} onClick={() => setKind(t)} style={{ fontFamily: DISPLAY, fontWeight: kind === t ? 700 : 600, fontSize: 14, padding: '10px 16px', border: 'none', background: 'none', cursor: 'pointer', color: kind === t ? tealMid : muted, borderBottom: '2px solid ' + (kind === t ? cyan : 'transparent'), marginBottom: -1, textTransform: 'capitalize' }}>{t}</button>
        ))}
      </div>

      {/* status filter chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
        {STATUS_FILTERS.map((f) => {
          const on = filter === f.id;
          return <button key={f.id} onClick={() => setFilter(f.id)} style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 13, color: on ? '#fff' : body, background: on ? cyan : '#fff', border: '1.4px solid ' + (on ? cyan : whisper), borderRadius: 999, padding: '7px 15px', cursor: 'pointer' }}>{f.label}</button>;
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {rows.length === 0 && (
          <DeckCard style={{ padding: 34, textAlign: 'center' }}>
            <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 16, color: ink }}>Nothing here yet</div>
            <div style={{ fontFamily: DATA, fontSize: 13.5, color: muted, marginTop: 6 }}>No {kind} simulations match this filter.</div>
          </DeckCard>
        )}
        {rows.map((r, i) => (
          <DeckCard key={r.scenario + i} style={{ padding: 16, display: 'grid', gridTemplateColumns: '90px minmax(0,1.6fr) minmax(0,1fr) auto', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 90 }}><Thumb subject={r.subject} h={56} /></div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 15.5, color: ink }}>{r.scenario}</span>
                <StatusPill status={r.status} />
              </div>
              <div style={{ fontFamily: DATA, fontSize: 12.5, color: muted, marginTop: 4 }}>{r.cls} · {r.schedule}</div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: DATA, fontSize: 11.5, color: faint, marginBottom: 5 }}>
                <span>Progress</span><span style={{ fontWeight: 700, color: r.progress === 100 ? success : tealMid, fontVariantNumeric: 'tabular-nums' }}>{r.progress}%</span>
              </div>
              <div style={{ height: 7, borderRadius: 999, background: surfaceSoft, overflow: 'hidden' }}>
                <div style={{ width: `${r.progress}%`, height: '100%', borderRadius: 999, background: r.progress === 100 ? success : 'var(--game-cta-gradient)' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 9, flexShrink: 0 }}>
              {r.status === 'running' ? <CtaButton onClick={() => router.push('/sim/teacher/live')}>Monitor</CtaButton>
                : r.status === 'draft' ? <OutlineButton onClick={() => router.push('/sim/teacher/assign')}>Edit</OutlineButton>
                : <OutlineButton onClick={() => router.push('/sim/teacher/debrief')}>Open</OutlineButton>}
            </div>
          </DeckCard>
        ))}
      </div>
    </SimSidebarShell>
  );
}

/* ════════════ 30 · Quick Launch Panel ════════════ */
export function SimTeacherQuickLaunch() {
  const router = useRouter();
  const [sel, setSel] = useState(SCENARIOS[1].id);
  const [cls, setCls] = useState('Global Supply Chain 101');
  const s = SCENARIOS.find((x) => x.id === sel)!;

  const TOOLS = [
    { label: 'Start Session', sub: 'Open the live facilitation console', icon: Play, to: '/sim/teacher/live', primary: true },
    { label: 'Open Student View', sub: 'See what students see right now', icon: Eye, to: '/sim/play' },
    { label: 'Projector Mode', sub: 'Full-screen leaderboard for the room', icon: Monitor, to: '/sim/teacher/projector' },
  ];

  return (
    <SimSidebarShell nav={TEACHER_NAV} active="sessions" user={TEACHER}>
      <PageHead title="Quick Launch" subtitle="Pick a scenario, launch the session, and open your facilitation tools." />
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.1fr)', gap: 20, alignItems: 'start' }}>
        {/* picker */}
        <DeckCard style={{ padding: 18 }}>
          <Eyebrow>Choose a scenario</Eyebrow>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
            {SCENARIOS.map((sc) => {
              const on = sc.id === sel;
              return (
                <button key={sc.id} onClick={() => setSel(sc.id)} style={{ display: 'flex', alignItems: 'center', gap: 13, textAlign: 'left', background: on ? cyanTint : 'var(--game-surface-solid)', border: '1.4px solid ' + (on ? cyan : whisper), borderRadius: 12, padding: 11, cursor: 'pointer', transition: 'border-color .12s ease, background .12s ease' }}>
                  <div style={{ width: 64, flexShrink: 0 }}><Thumb subject={sc.subject} h={48} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 15, color: ink }}>{sc.title}</div>
                    <div style={{ fontFamily: DATA, fontSize: 12, color: muted, marginTop: 2 }}>{sc.durationLabel} · {sc.level}</div>
                  </div>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', border: '1.6px solid ' + (on ? cyan : whisper), background: on ? cyan : '#fff', display: 'grid', placeItems: 'center', flexShrink: 0 }}>{on && <Check size={13} color="#fff" />}</span>
                </button>
              );
            })}
          </div>
        </DeckCard>

        {/* launch panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <DeckCard style={{ padding: 0, overflow: 'hidden' }}>
            <Thumb subject={s.subject} h={120} />
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 21, color: ink, letterSpacing: '-0.4px' }}>{s.title}</h2>
                <Tag>{s.subject}</Tag>
              </div>
              <div style={{ display: 'flex', gap: 7, marginTop: 10, flexWrap: 'wrap' }}>
                <Tag tone="neutral">{s.durationLabel}</Tag><Tag tone="neutral">{s.level}</Tag><Tag tone="neutral">{s.teamsDefault} teams</Tag>
              </div>
              <div style={{ marginTop: 16, maxWidth: 360 }}>
                <Field label="Launch for class"><SelectInput value={cls} onChange={setCls} options={ASSIGN_CLASSES.map((c) => c.name)} /></Field>
              </div>
              <div style={{ marginTop: 16 }}>
                <CtaButton full onClick={() => router.push('/sim/teacher/live')}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Play size={15} /> Launch now</span></CtaButton>
              </div>
            </div>
          </DeckCard>

          <div>
            <Eyebrow>Live facilitation tools</Eyebrow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
              {TOOLS.map((t) => { const I = t.icon; return (
                <DeckCard key={t.label} onClick={() => router.push(t.to)} className="sim-tool" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 13, cursor: 'pointer', transition: 'transform .14s ease', border: t.primary ? '1.4px solid ' + cyan : undefined }}>
                  <span style={{ width: 40, height: 40, borderRadius: 11, background: t.primary ? 'var(--game-cta-gradient)' : cyanTint, color: t.primary ? '#fff' : tealMid, display: 'grid', placeItems: 'center', flexShrink: 0 }}><I size={20} /></span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 14.5, color: ink }}>{t.label}</div>
                    <div style={{ fontFamily: DATA, fontSize: 12.5, color: muted, marginTop: 1 }}>{t.sub}</div>
                  </div>
                  <ExternalLink size={16} color={faint} />
                </DeckCard>
              ); })}
            </div>
          </div>
        </div>
      </div>
      <style>{`.sim-tool:hover{transform:translateY(-2px);}`}</style>
    </SimSidebarShell>
  );
}
