'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, RefreshCw as Shuffle, Calendar, Activity as Gauge, Users, Minus, Plus, Check as CheckCircle2, Zap as Rocket } from '../PixelIcons';
import { SimSidebarShell, TEACHER_NAV, DeckCard, PageHead } from './SimShell';
import { useSim } from '../../context/SimContext';
import {
  Eyebrow, Tag, CtaButton, OutlineButton, GhostButton, DISPLAY, DATA,
  ink, body, muted, faint, cyan, tealMid, success, cyanTint, whisper,
} from './sim-ui';

const STUDENTS = ['Aanya', 'Bose', 'Chen', 'Devi', 'Ezra', 'Farah', 'Goh', 'Hana', 'Ibrahim', 'Jia', 'Kabir', 'Lena'];
const STEPS = [
  { label: 'Scenario', sub: 'Pick the simulation' },
  { label: 'Teams', sub: 'Roster & teams' },
  { label: 'Schedule', sub: 'Timeline & rounds' },
  { label: 'Review', sub: 'Confirm & launch' },
];
const LENGTHS = [45, 90, 180];
const MILESTONES = [
  { name: 'Checkpoint 1', round: 2 },
  { name: 'Checkpoint 2', round: 4 },
  { name: 'Final Presentation', round: 8 },
];

export function SimSessionSetup() {
  const router = useRouter();
  const { scenario } = useSim();
  const [step, setStep] = useState(1); // 0=Scenario(done) ; start on Teams
  const [teamCount, setTeamCount] = useState(4);
  const [assign, setAssign] = useState<Record<string, number | null>>(() => Object.fromEntries(STUDENTS.map((s) => [s, null])));
  const [length, setLength] = useState(90);
  const [speed, setSpeed] = useState<'1×' | '2×'>('1×');
  const [start, setStart] = useState('2026-06-24');
  const [dragging, setDragging] = useState<string | null>(null);

  const unassigned = STUDENTS.filter((s) => assign[s] === null);
  const teamMembers = (t: number) => STUDENTS.filter((s) => assign[s] === t);
  const rounds = Math.max(3, Math.round(length / 15));
  const autoBalance = () => setAssign(Object.fromEntries(STUDENTS.map((s, i) => [s, i % teamCount])));
  const clickAssign = (name: string) => {
    if (assign[name] !== null) { setAssign((a) => ({ ...a, [name]: null })); return; }
    const sizes = Array.from({ length: teamCount }, (_, t) => teamMembers(t).length);
    setAssign((a) => ({ ...a, [name]: sizes.indexOf(Math.min(...sizes)) }));
  };
  const next = () => setStep((s) => Math.min(3, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <SimSidebarShell nav={TEACHER_NAV} active="sessions">
      <PageHead title="Session Setup" subtitle="Create a session in four steps — no game mechanics to configure." />

      <div style={{ display: 'grid', gridTemplateColumns: '220px minmax(0,1fr)', gap: 22, alignItems: 'start' }}>
        {/* Left vertical stepper */}
        <DeckCard style={{ padding: 16, position: 'sticky', top: 20 }}>
          {STEPS.map((s, i) => {
            const state = i < step ? 'done' : i === step ? 'active' : 'pending';
            return (
              <button key={s.label} onClick={() => i <= step && setStep(i)} style={{ display: 'flex', gap: 12, width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: i <= step ? 'pointer' : 'default', padding: '8px 4px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: '50%', display: 'grid', placeItems: 'center', flexShrink: 0,
                    background: state === 'done' ? success : state === 'active' ? cyan : '#fff',
                    border: state === 'pending' ? '1.4px solid ' + whisper : 'none',
                    color: state === 'pending' ? faint : '#fff', fontFamily: DATA, fontWeight: 700, fontSize: 13,
                  }}>{state === 'done' ? <Check size={15} /> : i + 1}</span>
                  {i < STEPS.length - 1 && <span style={{ width: 1.5, flex: 1, minHeight: 22, background: i < step ? success : whisper, marginTop: 4 }} />}
                </div>
                <div style={{ paddingTop: 3 }}>
                  <div style={{ fontFamily: DISPLAY, fontWeight: state === 'active' ? 700 : 600, fontSize: 14, color: state === 'pending' ? faint : ink }}>{s.label}</div>
                  <div style={{ fontFamily: DATA, fontSize: 11.5, color: faint, marginTop: 1 }}>{s.sub}</div>
                </div>
              </button>
            );
          })}
        </DeckCard>

        {/* Right content */}
        <div>
          {step === 0 && (
            <DeckCard style={{ padding: 24 }}>
              <Eyebrow>Step 1 · Selected scenario</Eyebrow>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 22, color: ink, letterSpacing: '-0.5px', marginTop: 8 }}>{scenario?.title ?? 'No scenario selected'}</h2>
              <p style={{ fontFamily: DISPLAY, fontSize: 14.5, color: body, lineHeight: 1.6, marginTop: 8, maxWidth: '60ch' }}>{scenario?.summary}</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>{scenario?.modules.map((m) => <Tag key={m} tone="neutral">{m}</Tag>)}</div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 22 }}><CtaButton onClick={next}>Next</CtaButton></div>
            </DeckCard>
          )}

          {step === 1 && (
            <DeckCard style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
                <Eyebrow>Step 2 · Roster &amp; teams</Eyebrow>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1.4px solid ' + whisper, borderRadius: 999, padding: '4px 6px' }}>
                    <button onClick={() => setTeamCount((t) => Math.max(2, t - 1))} style={{ border: 'none', background: 'none', cursor: 'pointer', color: muted, display: 'grid', placeItems: 'center' }}><Minus size={15} /></button>
                    <span style={{ fontFamily: DATA, fontWeight: 700, fontSize: 14, color: ink, width: 30, textAlign: 'center' }}>{teamCount} <span style={{ fontWeight: 500, color: faint, fontSize: 11 }}></span></span>
                    <button onClick={() => setTeamCount((t) => Math.min(6, t + 1))} style={{ border: 'none', background: 'none', cursor: 'pointer', color: muted, display: 'grid', placeItems: 'center' }}><Plus size={15} /></button>
                  </div>
                  <OutlineButton onClick={autoBalance}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Shuffle size={15} /> Auto-assign</span></OutlineButton>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '220px minmax(0,1fr)', gap: 16 }}>
                <div onDragOver={(e) => e.preventDefault()} onDrop={() => dragging && setAssign((a) => ({ ...a, [dragging]: null }))} style={{ background: '#F7FAFB', border: '1px solid ' + whisper, borderRadius: 12, padding: 14, alignSelf: 'start' }}>
                  <div style={{ fontFamily: DATA, fontSize: 12, fontWeight: 700, color: unassigned.length === 0 ? success : tealMid, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    Unassigned ({unassigned.length}) {unassigned.length === 0 && <Check size={14} />}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {unassigned.length === 0 && <span style={{ fontFamily: DATA, fontSize: 12.5, color: faint }}>All placed.</span>}
                    {unassigned.map((s) => <Chip key={s} name={s} onDragStart={() => setDragging(s)} onClick={() => clickAssign(s)} />)}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(teamCount, 3)}, 1fr)`, gap: 12 }}>
                  {Array.from({ length: teamCount }).map((_, t) => (
                    <div key={t} onDragOver={(e) => e.preventDefault()} onDrop={() => dragging && setAssign((a) => ({ ...a, [dragging]: t }))} style={{ background: '#fff', border: '1px solid ' + whisper, borderRadius: 12, padding: 14, minHeight: 116 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, color: ink }}>Team {String.fromCharCode(65 + t)}</span>
                        <span style={{ fontFamily: DATA, fontSize: 12, color: muted }}>{teamMembers(t).length}</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {teamMembers(t).length === 0 && <span style={{ fontFamily: DATA, fontSize: 11.5, color: faint }}>Drop here</span>}
                        {teamMembers(t).map((s) => <Chip key={s} name={s} onDragStart={() => setDragging(s)} onClick={() => clickAssign(s)} placed />)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Footer leftNote={`unassigned: ${unassigned.length}${unassigned.length === 0 ? ' ✓' : ''}`} onBack={back} onNext={next} nextDisabled={unassigned.length !== 0} nextReason="Place all students" />
            </DeckCard>
          )}

          {step === 2 && (
            <DeckCard style={{ padding: 24 }}>
              <Eyebrow>Step 3 · Schedule &amp; timeline</Eyebrow>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginTop: 18 }}>
                <Field label="Start date" icon={<Calendar size={14} />}>
                  <input type="date" value={start} onChange={(e) => setStart(e.target.value)} style={inputStyle} />
                </Field>
                <Field label="Simulation speed" icon={<Gauge size={14} />}>
                  <Segmented options={['1×', '2×']} value={speed} onChange={(v) => setSpeed(v as '1×' | '2×')} />
                </Field>
                <Field label="Session length" icon={<Users size={14} />}>
                  <Segmented options={LENGTHS.map((l) => `${l} min`)} value={`${length} min`} onChange={(v) => setLength(parseInt(v))} />
                </Field>
                <Field label="Rounds (auto)">
                  <div style={{ fontFamily: DATA, fontSize: 14, color: muted, padding: '11px 0' }}><span style={{ color: ink, fontWeight: 700 }}>{rounds}</span> rounds · every 2 days</div>
                </Field>
              </div>

              {/* Timeline ribbon */}
              <div style={{ marginTop: 18 }}>
                <div style={{ fontFamily: DATA, fontSize: 12, color: muted, marginBottom: 8 }}>Timeline preview</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {Array.from({ length: rounds }).map((_, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: '100%', height: 8, borderRadius: 4, background: i === 0 ? cyan : cyanTint }} />
                      <span style={{ fontFamily: DATA, fontSize: 10, color: faint }}>R{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key deadlines */}
              <div style={{ marginTop: 20 }}>
                <div style={{ fontFamily: DATA, fontSize: 12, fontWeight: 700, color: tealMid, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>Key deadlines</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {MILESTONES.map((m) => (
                    <div key={m.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F7FAFB', border: '1px solid ' + whisper, borderRadius: 10, padding: '10px 14px' }}>
                      <span style={{ fontFamily: DATA, fontSize: 13.5, color: body }}>{m.name}</span>
                      <span style={{ fontFamily: DATA, fontSize: 12.5, color: muted }}>Round {m.round}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Footer onBack={back} onNext={next} />
            </DeckCard>
          )}

          {step === 3 && (
            <DeckCard style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#E5F2E8', borderRadius: 12, padding: '14px 16px', marginBottom: 18 }}>
                <CheckCircle2 size={22} color={success} />
                <div>
                  <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 15, color: success }}>Ready to launch</div>
                  <div style={{ fontFamily: DATA, fontSize: 12.5, color: '#3f7a52' }}>Your session is ready for students.</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, background: '#F7FAFB', borderRadius: 12, overflow: 'hidden', border: '1px solid #E7EEF1' }}>
                <Row label="Scenario" value={scenario?.title ?? '—'} onEdit={() => setStep(0)} />
                <Row label="Teams" value={`${teamCount} teams`} onEdit={() => setStep(1)} />
                <Row label="Students" value={`${STUDENTS.length} placed`} onEdit={() => setStep(1)} />
                <Row label="Duration" value={`${length} min · ${rounds} rounds`} onEdit={() => setStep(2)} />
                <Row label="Start" value={start} onEdit={() => setStep(2)} />
                <Row label="Speed" value={speed} onEdit={() => setStep(2)} />
              </div>

              <div style={{ marginTop: 18 }}>
                <div style={{ fontFamily: DATA, fontSize: 12, fontWeight: 700, color: tealMid, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>What happens next</div>
                {['Students join with the class code / invite link.', 'Teams are created and roles assigned.', `The session begins on ${start}.`].map((t) => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8, fontFamily: DATA, fontSize: 13.5, color: body }}>
                    <CheckCircle2 size={15} color={success} /> {t}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 22 }}>
                <GhostButton onClick={back}>Back</GhostButton>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <OutlineButton onClick={() => router.push('/sim/teacher/session/checklist')}>Pre-launch checklist</OutlineButton>
                  <CtaButton onClick={() => router.push('/sim/teacher/live')}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Rocket size={15} /> Launch session</span></CtaButton>
                </div>
              </div>
            </DeckCard>
          )}
        </div>
      </div>
    </SimSidebarShell>
  );
}

const inputStyle: React.CSSProperties = { width: '100%', fontFamily: DATA, fontSize: 14, color: ink, background: '#F0F6FA', border: '1px solid ' + whisper, borderRadius: 8, padding: '11px 12px' };

function Footer({ leftNote, onBack, onNext, nextDisabled, nextReason }: { leftNote?: string; onBack: () => void; onNext: () => void; nextDisabled?: boolean; nextReason?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 22 }}>
      <span style={{ fontFamily: DATA, fontSize: 13, fontWeight: 600, color: leftNote?.includes('✓') ? success : muted }}>{leftNote}</span>
      <div style={{ display: 'flex', gap: 10, marginLeft: 'auto' }}>
        <GhostButton onClick={onBack}>Back</GhostButton>
        <CtaButton onClick={onNext} disabled={nextDisabled} reason={nextDisabled ? nextReason : undefined}>Next</CtaButton>
      </div>
    </div>
  );
}

function Chip({ name, onDragStart, onClick, placed }: { name: string; onDragStart: () => void; onClick: () => void; placed?: boolean }) {
  return (
    <span draggable onDragStart={onDragStart} onClick={onClick} title={placed ? 'Click to unassign' : 'Click to place / drag to a team'}
      style={{ fontFamily: DATA, fontSize: 13, fontWeight: 500, color: placed ? tealMid : body, background: placed ? cyanTint : '#fff', border: '1px solid ' + (placed ? 'transparent' : whisper), borderRadius: 999, padding: '5px 12px', cursor: 'grab', userSelect: 'none' }}>
      {name}
    </span>
  );
}

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: DATA, fontSize: 13, fontWeight: 600, color: muted, marginBottom: 8 }}>{icon} {label}</label>
      {children}
    </div>
  );
}

function Segmented({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'inline-flex', background: '#F0F6FA', border: '1px solid ' + whisper, borderRadius: 999, padding: 3 }}>
      {options.map((o) => {
        const on = o === value;
        return <button key={o} onClick={() => onChange(o)} style={{ fontFamily: DATA, fontSize: 13, fontWeight: 600, padding: '7px 16px', borderRadius: 999, border: 'none', cursor: 'pointer', background: on ? cyan : 'transparent', color: on ? '#fff' : muted }}>{o}</button>;
      })}
    </div>
  );
}

function Row({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <div style={{ padding: '14px 16px', borderBottom: '1px solid #E7EEF1', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontFamily: DATA, fontSize: 11, color: faint, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{label}</div>
        <div style={{ fontFamily: DATA, fontSize: 14.5, fontWeight: 600, color: ink, marginTop: 2 }}>{value}</div>
      </div>
      <button onClick={onEdit} style={{ fontFamily: DISPLAY, fontSize: 12, fontWeight: 600, color: tealMid, background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
    </div>
  );
}
