'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Upload, FileText, Users, Check, X, Plus, Minus, Trophy, Crown,
  AlertTriangle, Lock, Unlock, GraduationCap, Zap,
} from '../PixelIcons';
import { SimSidebarShell, TEACHER_NAV, DeckCard, DeckStat, PageHead, StatusPill } from './SimShell';
import { Toggle } from './admin-ui';
import { useSim } from '../../context/SimContext';
import {
  Eyebrow, Tag, CtaButton, OutlineButton, GhostButton, DISPLAY, DATA,
  ink, body, muted, faint, cyan, tealMid, success, negative, warning, cyanTint, whisper, surfaceSoft,
} from './sim-ui';

const TEACHER = { name: 'Mrs. Johnson', role: 'Science Teacher' };

/* ════════════ 38 · Roster Import ════════════ */
type ImportMethod = 'paste' | 'csv' | 'classroom' | 'lms';
const METHODS: { id: ImportMethod; label: string; sub: string; icon: React.ComponentType<{ size?: number; color?: string }> }[] = [
  { id: 'paste', label: 'Paste names', sub: 'One student per line', icon: FileText },
  { id: 'csv', label: 'Upload CSV', sub: 'name, email columns', icon: Upload },
  { id: 'classroom', label: 'Google Classroom', sub: 'Sync a course roster', icon: GraduationCap },
  { id: 'lms', label: 'LMS / Clever', sub: 'Canvas · Schoology · Clever', icon: Users },
];
const SAMPLE_PASTE = `Aanya Rao, aanya@school.edu
Bose Mensah, bose@school.edu
Chen Wei, chen@school.edu
Devi Patel
Ezra Cohen, ezra@school.edu
Farah Said, ezra@school.edu`;

function parseRoster(text: string) {
  const seen = new Set<string>();
  return text.split('\n').map((l) => l.trim()).filter(Boolean).map((line) => {
    const [name, email] = line.split(',').map((p) => p.trim());
    let status: 'new' | 'nomail' | 'dupe' = 'new';
    if (!email) status = 'nomail';
    else if (seen.has(email.toLowerCase())) status = 'dupe';
    if (email) seen.add(email.toLowerCase());
    return { name: name || '—', email: email || '', status };
  });
}

export function SimTeacherRosterImport() {
  const router = useRouter();
  const [method, setMethod] = useState<ImportMethod>('paste');
  const [text, setText] = useState(SAMPLE_PASTE);
  const rows = useMemo(() => parseRoster(text), [text]);
  const ok = rows.filter((r) => r.status === 'new').length;
  const warn = rows.filter((r) => r.status !== 'new').length;

  return (
    <SimSidebarShell nav={TEACHER_NAV} active="classes" user={TEACHER}>
      <PageHead
        title="Import Roster"
        subtitle="Bring students in from a list, a file, or your LMS — review, then import."
        right={<OutlineButton onClick={() => router.push('/sim/teacher/roster')}>Back to roster</OutlineButton>}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.2fr)', gap: 20, alignItems: 'start' }}>
        {/* methods + input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {METHODS.map((m) => { const I = m.icon; const on = method === m.id; return (
              <button key={m.id} onClick={() => setMethod(m.id)} style={{ textAlign: 'left', background: on ? cyanTint : 'var(--game-surface-solid)', border: '1.4px solid ' + (on ? cyan : whisper), borderRadius: 12, padding: 13, cursor: 'pointer', transition: 'border-color .12s ease' }}>
                <span style={{ width: 34, height: 34, borderRadius: 9, background: on ? cyan : surfaceSoft, color: on ? '#fff' : tealMid, display: 'grid', placeItems: 'center' }}><I size={17} /></span>
                <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 13.5, color: ink, marginTop: 9 }}>{m.label}</div>
                <div style={{ fontFamily: DATA, fontSize: 11.5, color: muted, marginTop: 1 }}>{m.sub}</div>
              </button>
            ); })}
          </div>

          <DeckCard style={{ padding: 16 }}>
            {method === 'paste' && (
              <>
                <Eyebrow>Paste student list</Eyebrow>
                <textarea value={text} onChange={(e) => setText(e.target.value)} style={{ width: '100%', minHeight: 200, marginTop: 12, fontFamily: DATA, fontSize: 13.5, color: ink, background: surfaceSoft, border: '1px solid ' + whisper, borderRadius: 8, padding: 12, resize: 'vertical', lineHeight: 1.6 }} />
                <div style={{ fontFamily: DATA, fontSize: 11.5, color: faint, marginTop: 8 }}>Format: <span style={{ color: muted }}>Full name, email</span> — one per line. Email optional.</div>
              </>
            )}
            {method !== 'paste' && (
              <div style={{ display: 'grid', placeItems: 'center', minHeight: 232, textAlign: 'center' }}>
                <div>
                  <span style={{ width: 52, height: 52, borderRadius: 14, background: cyanTint, color: tealMid, display: 'grid', placeItems: 'center', margin: '0 auto' }}>{method === 'csv' ? <Upload size={24} /> : <Users size={24} />}</span>
                  <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 15, color: ink, marginTop: 12 }}>{METHODS.find((m) => m.id === method)!.label}</div>
                  <p style={{ fontFamily: DATA, fontSize: 13, color: muted, marginTop: 6, maxWidth: '36ch' }}>Connect to pull a roster automatically. Preview loads the same demo students.</p>
                  <div style={{ marginTop: 14 }}><OutlineButton onClick={() => setText(SAMPLE_PASTE)}>Load demo roster</OutlineButton></div>
                </div>
              </div>
            )}
          </DeckCard>
        </div>

        {/* preview */}
        <DeckCard style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid ' + whisper }}>
            <Eyebrow>Preview · {rows.length} rows</Eyebrow>
            <div style={{ display: 'flex', gap: 8 }}>
              <Tag tone="success">{ok} ready</Tag>{warn > 0 && <Tag tone="warn">{warn} to review</Tag>}
            </div>
          </div>
          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: surfaceSoft }}>
                {['Name', 'Email', 'Status'].map((h) => <th key={h} style={{ textAlign: 'left', fontFamily: DATA, fontSize: 11, fontWeight: 700, color: faint, textTransform: 'uppercase', letterSpacing: '0.6px', padding: '10px 16px' }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} style={{ borderTop: '1px solid ' + whisper }}>
                    <td style={{ padding: '11px 16px', fontFamily: DATA, fontSize: 13.5, fontWeight: 600, color: ink }}>{r.name}</td>
                    <td style={{ padding: '11px 16px', fontFamily: DATA, fontSize: 13, color: r.email ? muted : faint }}>{r.email || 'no email'}</td>
                    <td style={{ padding: '11px 16px' }}>
                      {r.status === 'new' && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: DATA, fontSize: 12, fontWeight: 700, color: success }}><Check size={13} /> New</span>}
                      {r.status === 'nomail' && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: DATA, fontSize: 12, fontWeight: 700, color: warning }}><AlertTriangle size={13} /> No email</span>}
                      {r.status === 'dupe' && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: DATA, fontSize: 12, fontWeight: 700, color: negative }}><X size={13} /> Duplicate</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderTop: '1px solid ' + whisper }}>
            <GhostButton onClick={() => router.push('/sim/teacher/roster')}>Cancel</GhostButton>
            <CtaButton onClick={() => router.push('/sim/teacher/roster')}>Import {ok} students</CtaButton>
          </div>
        </DeckCard>
      </div>
    </SimSidebarShell>
  );
}

/* ════════════ 41 · Pre-Launch Checklist & Lobby ════════════ */
interface CheckItem { id: string; label: string; sub: string; done: boolean; to?: string }
const LOBBY = [
  { team: 'Team A', joined: 4, size: 4 }, { team: 'Team B', joined: 4, size: 4 },
  { team: 'Team C', joined: 3, size: 4 }, { team: 'Team D', joined: 4, size: 4 },
  { team: 'Team E', joined: 2, size: 4 }, { team: 'Team F', joined: 4, size: 4 },
];
export function SimTeacherChecklist() {
  const router = useRouter();
  const { scenario } = useSim();
  const [items, setItems] = useState<CheckItem[]>([
    { id: 'sc', label: 'Scenario selected', sub: scenario?.title ?? 'FMCG Competition', done: true, to: '/sim/teacher/library' },
    { id: 'teams', label: 'Teams formed', sub: '6 teams · balanced', done: true, to: '/sim/teacher/teams' },
    { id: 'roster', label: 'Roster placed', sub: '24 of 24 students assigned', done: true, to: '/sim/teacher/roster' },
    { id: 'roles', label: 'Roles assigned', sub: 'CEO · CFO · CMO · COO per team', done: true, to: '/sim/teacher/roles' },
    { id: 'sched', label: 'Schedule set', sub: '6 rounds · starts today', done: true, to: '/sim/teacher/setup' },
    { id: 'code', label: 'Join code shared', sub: 'Pending — share with class', done: false, to: '/sim/teacher/invite' },
  ]);
  const toggle = (id: string) => setItems((xs) => xs.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  const doneCount = items.filter((i) => i.done).length;
  const allDone = doneCount === items.length;
  const joined = LOBBY.reduce((a, t) => a + t.joined, 0);
  const cap = LOBBY.reduce((a, t) => a + t.size, 0);

  return (
    <SimSidebarShell nav={TEACHER_NAV} active="sessions" user={TEACHER}>
      <PageHead
        title="Pre-Launch Checklist"
        subtitle="Confirm everything's ready, watch students join the lobby, then go live."
        right={<span style={{ fontFamily: DATA, fontSize: 13, fontWeight: 700, color: allDone ? success : warning, fontVariantNumeric: 'tabular-nums' }}>{doneCount}/{items.length} ready</span>}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,1fr)', gap: 20, alignItems: 'start' }}>
        <DeckCard style={{ padding: 8 }}>
          {items.map((it, i) => (
            <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 14px', borderTop: i ? '1px solid ' + whisper : 'none' }}>
              <button onClick={() => toggle(it.id)} aria-label="toggle" style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, border: it.done ? 'none' : '1.6px solid ' + whisper, background: it.done ? success : '#fff', color: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>{it.done && <Check size={15} />}</button>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 14.5, color: ink }}>{it.label}</div>
                <div style={{ fontFamily: DATA, fontSize: 12.5, color: it.done ? muted : warning, marginTop: 1 }}>{it.sub}</div>
              </div>
              {it.to && <GhostButton onClick={() => router.push(it.to!)}>{it.done ? 'Edit' : 'Fix'}</GhostButton>}
            </div>
          ))}
        </DeckCard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <DeckCard style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Eyebrow>Student lobby</Eyebrow>
              <span style={{ fontFamily: DATA, fontSize: 12.5, fontWeight: 700, color: tealMid, fontVariantNumeric: 'tabular-nums' }}>{joined}/{cap} joined</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
              {LOBBY.map((t) => {
                const full = t.joined === t.size;
                return (
                  <div key={t.team} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: DATA, fontSize: 13, fontWeight: 600, color: ink, width: 64 }}>{t.team}</span>
                    <div style={{ flex: 1, height: 8, borderRadius: 999, background: surfaceSoft, overflow: 'hidden' }}>
                      <div style={{ width: `${(t.joined / t.size) * 100}%`, height: '100%', borderRadius: 999, background: full ? success : 'var(--game-cta-gradient)' }} />
                    </div>
                    <span style={{ fontFamily: DATA, fontSize: 12, fontWeight: 700, color: full ? success : muted, width: 30, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{t.joined}/{t.size}</span>
                  </div>
                );
              })}
            </div>
          </DeckCard>

          <DeckCard style={{ padding: 18 }}>
            {!allDone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontFamily: DATA, fontSize: 12.5, color: warning, marginBottom: 12 }}>
                <AlertTriangle size={15} /> Finish all checklist items to launch.
              </div>
            )}
            <CtaButton full disabled={!allDone} reason={allDone ? undefined : 'Checklist incomplete'} onClick={() => router.push('/sim/teacher/live')}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Zap size={15} /> Launch session</span>
            </CtaButton>
            <div style={{ marginTop: 10, textAlign: 'center' }}><GhostButton onClick={() => router.push('/sim/teacher/projector')}>Open projector view →</GhostButton></div>
          </DeckCard>
        </div>
      </div>
    </SimSidebarShell>
  );
}

/* ════════════ 43 · Pacing Board (all-rounds control) ════════════ */
interface RoundRow { n: number; label: string; mins: number; lock: string; state: 'done' | 'active' | 'upcoming' }
const initialRounds: RoundRow[] = [
  { n: 1, label: 'Market Entry', mins: 15, lock: 'Closed', state: 'done' },
  { n: 2, label: 'Scale-Up', mins: 15, lock: 'Closed', state: 'done' },
  { n: 3, label: 'Cost Shock', mins: 15, lock: 'Open', state: 'active' },
  { n: 4, label: 'New Entrant', mins: 15, lock: '—', state: 'upcoming' },
  { n: 5, label: 'Price War', mins: 20, lock: '—', state: 'upcoming' },
  { n: 6, label: 'Endgame', mins: 20, lock: '—', state: 'upcoming' },
];
export function SimTeacherPacing() {
  const router = useRouter();
  const [rounds, setRounds] = useState(initialRounds);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [speed, setSpeed] = useState('1×');
  const setMins = (n: number, d: number) => setRounds((rs) => rs.map((r) => (r.n === n ? { ...r, mins: Math.max(5, r.mins + d) } : r)));
  const total = rounds.reduce((a, r) => a + r.mins, 0);

  return (
    <SimSidebarShell nav={TEACHER_NAV} active="sessions" user={TEACHER}>
      <PageHead
        title="Pacing Board"
        subtitle="Tune the whole arc — per-round time, decision locks, and auto-advance."
        right={<OutlineButton onClick={() => router.push('/sim/teacher/live')}>Back to live monitor</OutlineButton>}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        <DeckStat label="Rounds" value={String(rounds.length)} />
        <DeckStat label="Total time" value={`${total}m`} sub="planned" />
        <DeckStat label="Current" value={`R${rounds.find((r) => r.state === 'active')?.n ?? '—'}`} tone="up" />
        <DeckStat label="Auto-advance" value={autoAdvance ? 'On' : 'Off'} tone={autoAdvance ? 'up' : 'flat'} />
      </div>

      <DeckCard style={{ padding: 18, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, color: ink }}>Auto-advance rounds</span>
          <Toggle on={autoAdvance} onChange={setAutoAdvance} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: DATA, fontSize: 13, color: muted }}>Sim speed</span>
          <div style={{ display: 'inline-flex', background: surfaceSoft, border: '1px solid ' + whisper, borderRadius: 999, padding: 3 }}>
            {['1×', '2×', '4×'].map((s) => <button key={s} onClick={() => setSpeed(s)} style={{ fontFamily: DATA, fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 999, border: 'none', cursor: 'pointer', background: speed === s ? cyan : 'transparent', color: speed === s ? '#fff' : muted }}>{s}</button>)}
          </div>
        </div>
      </DeckCard>

      <DeckCard style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: surfaceSoft }}>
            {['Round', 'Phase', 'Duration', 'Decisions', 'Status'].map((h, i) => <th key={h} style={{ textAlign: i > 1 && i < 4 ? 'center' : 'left', fontFamily: DATA, fontSize: 11, fontWeight: 700, color: faint, textTransform: 'uppercase', letterSpacing: '0.6px', padding: '11px 16px' }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {rounds.map((r) => (
              <tr key={r.n} style={{ borderTop: '1px solid ' + whisper, background: r.state === 'active' ? cyanTint : 'transparent' }}>
                <td style={{ padding: '12px 16px', fontFamily: DATA, fontSize: 14, fontWeight: 800, color: r.state === 'upcoming' ? faint : ink }}>R{r.n}</td>
                <td style={{ padding: '12px 16px', fontFamily: DISPLAY, fontSize: 13.5, fontWeight: 600, color: r.state === 'upcoming' ? muted : ink }}>{r.label}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <button onClick={() => setMins(r.n, -5)} disabled={r.state === 'done'} style={{ border: '1px solid ' + whisper, background: '#fff', borderRadius: 7, width: 24, height: 24, display: 'grid', placeItems: 'center', cursor: r.state === 'done' ? 'not-allowed' : 'pointer', color: muted, opacity: r.state === 'done' ? 0.4 : 1 }}><Minus size={13} /></button>
                    <span style={{ fontFamily: DATA, fontSize: 13.5, fontWeight: 700, color: ink, width: 42, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{r.mins}m</span>
                    <button onClick={() => setMins(r.n, 5)} disabled={r.state === 'done'} style={{ border: '1px solid ' + whisper, background: '#fff', borderRadius: 7, width: 24, height: 24, display: 'grid', placeItems: 'center', cursor: r.state === 'done' ? 'not-allowed' : 'pointer', color: muted, opacity: r.state === 'done' ? 0.4 : 1 }}><Plus size={13} /></button>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: DATA, fontSize: 12.5, fontWeight: 700, color: r.lock === 'Open' ? success : r.lock === 'Closed' ? faint : muted }}>
                    {r.lock === 'Open' ? <Unlock size={13} /> : r.lock === 'Closed' ? <Lock size={13} /> : null}{r.lock}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}><StatusPill status={r.state === 'done' ? 'completed' : r.state === 'active' ? 'running' : 'pending'} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </DeckCard>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
        <GhostButton onClick={() => setRounds(initialRounds)}>Reset</GhostButton>
        <CtaButton onClick={() => router.push('/sim/teacher/live')}>Apply &amp; return</CtaButton>
      </div>
    </SimSidebarShell>
  );
}

/* ════════════ 47 · Projector Mode (room display) ════════════ */
const STANDINGS = [
  { team: 'Alpha', score: 72, delta: '+6' },
  { team: 'Beta', score: 68, delta: '+3' },
  { team: 'Gamma', score: 64, delta: '+1' },
  { team: 'Delta', score: 59, delta: '+4' },
  { team: 'Epsilon', score: 55, delta: '-2' },
  { team: 'Zeta', score: 48, delta: '+0' },
];
export function SimTeacherProjector() {
  const router = useRouter();
  const { scenario } = useSim();
  const max = STANDINGS[0].score;
  return (
    <div style={{ minHeight: '100dvh', width: '100%', background: 'radial-gradient(120% 120% at 80% 0%, var(--game-teal-dark) 0%, #001D22 60%, #001216 100%)', color: '#fff', padding: '40px 56px', display: 'flex', flexDirection: 'column' }}>
      {/* top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 13, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--game-cyan)' }}>Live · Round 3 of 6</span>
          <h1 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 44, letterSpacing: '-1px', marginTop: 6, color: '#fff' }}>{scenario?.title ?? 'FMCG Competition'}</h1>
        </div>
        <button onClick={() => router.push('/sim/teacher/live')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: DISPLAY, fontWeight: 600, fontSize: 14, color: 'rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.16)', borderRadius: 999, padding: '10px 18px', cursor: 'pointer' }}><X size={16} /> Exit projector</button>
      </div>

      {/* big timer */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginTop: 28 }}>
        <span style={{ fontFamily: DATA, fontWeight: 800, fontSize: 96, lineHeight: 1, letterSpacing: '-3px', fontVariantNumeric: 'tabular-nums', color: '#fff' }}>07:12</span>
        <span style={{ fontFamily: DATA, fontSize: 22, color: 'rgba(255,255,255,0.55)' }}>remaining in Decide phase</span>
      </div>
      <div style={{ height: 10, borderRadius: 999, background: 'rgba(255,255,255,0.12)', marginTop: 18, overflow: 'hidden', maxWidth: 720 }}>
        <div style={{ width: '48%', height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, var(--game-cyan), #6FE3FF)' }} />
      </div>

      {/* leaderboard */}
      <div style={{ marginTop: 44, flex: 1 }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 15, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 18 }}>Live standings</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {STANDINGS.map((t, i) => {
            const down = t.delta.startsWith('-');
            return (
              <div key={t.team} style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
                <span style={{ width: 44, fontFamily: DATA, fontWeight: 800, fontSize: 28, color: i === 0 ? 'var(--game-cyan)' : 'rgba(255,255,255,0.45)', fontVariantNumeric: 'tabular-nums', display: 'flex', alignItems: 'center', gap: 6 }}>{i === 0 ? <Crown size={24} color="var(--game-cyan)" /> : i + 1}</span>
                <span style={{ width: 140, fontFamily: DISPLAY, fontWeight: 700, fontSize: 24, color: '#fff' }}>{t.team}</span>
                <div style={{ flex: 1, height: 26, borderRadius: 999, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <div style={{ width: `${(t.score / max) * 100}%`, height: '100%', borderRadius: 999, background: i === 0 ? 'linear-gradient(90deg, var(--game-cyan), #6FE3FF)' : 'rgba(0,193,235,0.45)' }} />
                </div>
                <span style={{ width: 70, textAlign: 'right', fontFamily: DATA, fontWeight: 800, fontSize: 28, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{t.score}</span>
                <span style={{ width: 52, textAlign: 'right', fontFamily: DATA, fontWeight: 700, fontSize: 18, color: down ? '#FF8A8A' : '#7EE6A8', fontVariantNumeric: 'tabular-nums' }}>{t.delta}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: DATA, fontSize: 16, color: 'rgba(255,255,255,0.7)' }}><Trophy size={18} color="var(--game-cyan)" /> Join at <span style={{ color: '#fff', fontWeight: 700 }}>cysim.com/join</span> · code <span style={{ color: 'var(--game-cyan)', fontWeight: 800, letterSpacing: '2px' }}>FMCG-7</span></span>
        <span style={{ fontFamily: DATA, fontSize: 16, color: 'rgba(255,255,255,0.7)' }}>6 teams · 24 players</span>
      </div>
    </div>
  );
}
