'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Upload, Users, RefreshCw, Copy, Mail, Trash2, Minus, Check, Sliders } from '../PixelIcons';
import { SimSidebarShell, TEACHER_NAV, PageHead, DeckCard, DeckStat, StatusPill } from './SimShell';
import { DataTable, Col, SearchInput, SelectInput, Toggle } from './admin-ui';
import { CtaButton, OutlineButton, GhostButton, Eyebrow, Tag, DISPLAY, DATA, ink, body, muted, faint, cyan, tealMid, success, cyanTint, whisper, surfaceSoft } from './sim-ui';

const TEACHER = { name: 'Mrs. Johnson', role: 'Science Teacher' };
function Avatar({ name }: { name: string }) {
  return <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, var(--game-cyan), var(--game-teal-mid))', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: DATA, fontWeight: 700, fontSize: 11, flexShrink: 0 }}>{name.split(' ').map((w) => w[0]).join('').slice(0, 2)}</span>;
}

/* ════════════ 34 · Student Roster ════════════ */
interface Stu { name: string; email: string; team: string; status: string; last: string }
const STUDENTS: Stu[] = [
  { name: 'Ava Johnson', email: 'ava@email.com', team: 'Team 1', status: 'active', last: '2h ago' },
  { name: 'Liam Chen', email: 'liam@email.com', team: 'Team 1', status: 'active', last: '1d ago' },
  { name: 'Maya Patel', email: 'maya@email.com', team: 'Team 2', status: 'active', last: '3h ago' },
  { name: 'Noah Kim', email: 'noah@email.com', team: 'Team 2', status: 'active', last: '5h ago' },
  { name: 'Emma Davis', email: 'emma@email.com', team: 'Team 3', status: 'active', last: '1d ago' },
  { name: 'Ethan Brown', email: 'ethan@email.com', team: 'Team 3', status: 'active', last: '2d ago' },
  { name: 'Isabella Martinez', email: 'isabella@email.com', team: 'Team 4', status: 'inactive', last: '7d ago' },
  { name: 'James Wilson', email: 'james@email.com', team: 'Team 4', status: 'active', last: '1d ago' },
];
export function SimTeacherRoster() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const cols: Col<Stu>[] = [
    { key: 'name', label: 'Student', render: (r) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontWeight: 600, color: ink }}><Avatar name={r.name} /> {r.name}</span> },
    { key: 'email', label: 'Email', render: (r) => <span style={{ color: muted }}>{r.email}</span> },
    { key: 'team', label: 'Team', render: (r) => <Tag tone="neutral">{r.team}</Tag> },
    { key: 'status', label: 'Status', render: (r) => <StatusPill status={r.status} /> },
    { key: 'last', label: 'Last active', align: 'right', render: (r) => <span style={{ color: faint }}>{r.last}</span> },
  ];
  const rows = STUDENTS.filter((s) => q === '' || s.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <SimSidebarShell nav={TEACHER_NAV} active="classes" user={TEACHER}>
      <PageHead title="Student Roster" subtitle="24 students" right={<div style={{ display: 'flex', gap: 10 }}><OutlineButton onClick={() => router.push('/sim/teacher/session/roster-import')}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Upload size={15} /> Import</span></OutlineButton><CtaButton><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Plus size={15} /> Add students</span></CtaButton></div>} />
      <div style={{ marginBottom: 16, maxWidth: 320 }}><SearchInput value={q} onChange={setQ} placeholder="Search students…" /></div>
      <DataTable columns={cols} rows={rows} getKey={(r) => r.email} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
        <span style={{ fontFamily: DATA, fontSize: 12.5, color: faint }}>Drag and drop students to reassign teams · 1–{rows.length} of 24</span>
        <div style={{ display: 'flex', gap: 6 }}>{['1', '2', '3'].map((p) => <button key={p} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid var(--sv-border)', background: p === '1' ? cyanTint : 'var(--game-surface-solid)', color: p === '1' ? tealMid : muted, fontFamily: DATA, fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}>{p}</button>)}</div>
      </div>
    </SimSidebarShell>
  );
}

/* ════════════ 35 · Team Setup ════════════ */
const TEAMS = [
  { name: 'Team 1 — Northwind', members: ['AJ', 'LC', 'NW', 'MR'] },
  { name: 'Team 2 — BluePeak', members: ['ED', 'EB', 'IM', 'JW'] },
  { name: 'Team 3 — Apex Logistics', members: ['SR', 'YL', 'DC', 'MH'] },
  { name: 'Team 4 — ClearPath', members: ['AT', 'JS', 'KW', 'BR'] },
  { name: 'Team 5 — Summit', members: ['LP', 'AW', 'SM', 'JR'] },
  { name: 'Team 6 — Horizon', members: ['TC', 'NK', 'VM', 'PT'] },
];
export function SimTeacherTeams() {
  const router = useRouter();
  return (
    <SimSidebarShell nav={TEACHER_NAV} active="classes" user={TEACHER}>
      <PageHead title="Team Setup" subtitle="Organize students into teams." right={<OutlineButton onClick={() => router.push('/sim/teacher/roles')}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><RefreshCw size={15} /> Auto-assign</span></OutlineButton>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        <DeckStat label="Teams created" value="6" /><DeckStat label="Students assigned" value="24" /><DeckStat label="Avg per team" value="4" /><DeckStat label="Unassigned" value="0" tone="up" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {TEAMS.map((t) => (
          <DeckCard key={t.name} style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, color: ink }}>{t.name}</span>
              <span style={{ color: faint, fontSize: 18, fontWeight: 700, cursor: 'pointer' }}>···</span>
            </div>
            <div style={{ fontFamily: DATA, fontSize: 11.5, color: faint, margin: '4px 0 12px' }}>{t.members.length} students</div>
            <div style={{ display: 'flex', gap: -6 }}>
              {t.members.map((m, i) => <span key={m + i} style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, var(--game-cyan), var(--game-teal-mid))', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: DATA, fontWeight: 700, fontSize: 10.5, border: '2px solid var(--game-surface-solid)', marginLeft: i ? -8 : 0 }}>{m}</span>)}
            </div>
          </DeckCard>
        ))}
      </div>
      <div style={{ fontFamily: DATA, fontSize: 12.5, color: faint, marginTop: 16 }}>Drag and drop students between teams to reassign.</div>
    </SimSidebarShell>
  );
}

/* ════════════ 36 · Role Assignment ════════════ */
const ROLES = [
  { role: 'CEO', desc: 'Leads overall strategy and decisions.' },
  { role: 'COO', desc: 'Oversees operations and execution.' },
  { role: 'CFO', desc: 'Manages finances and budgeting.' },
  { role: 'CLO', desc: 'Manages logistics and distribution.' },
  { role: 'CMO', desc: 'Leads marketing and customer strategy.' },
  { role: 'Analytics Lead', desc: 'Analyses data and recommends insights.' },
];
export function SimTeacherRoles() {
  const router = useRouter();
  const [useTemplate, setUseTemplate] = useState(true);
  const [template, setTemplate] = useState('Supply Chain Leadership');
  const [perTeam, setPerTeam] = useState(6);
  const [roles, setRoles] = useState(ROLES);
  return (
    <SimSidebarShell nav={TEACHER_NAV} active="classes" user={TEACHER}>
      <PageHead title="Role Assignment" subtitle="Define roles and responsibilities for each team." right={<CtaButton onClick={() => router.push('/sim/teacher/invite')}>Save roles</CtaButton>} />
      <DeckCard style={{ padding: 22, maxWidth: 760 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid var(--sv-border)' }}>
          <div>
            <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 14.5, color: ink }}>Use role templates</div>
            <div style={{ fontFamily: DATA, fontSize: 12.5, color: muted, marginTop: 2 }}>Apply recommended role sets for this scenario.</div>
          </div>
          <Toggle on={useTemplate} onChange={setUseTemplate} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'end', marginTop: 16 }}>
          <div>
            <label style={{ display: 'block', fontFamily: DATA, fontSize: 13, fontWeight: 600, color: body, marginBottom: 7 }}>Role template</label>
            <SelectInput value={template} onChange={setTemplate} options={['Supply Chain Leadership', 'Marketing Pod', 'Finance Track', 'Custom']} />
          </div>
          <GhostButton>Preview roles</GhostButton>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, color: ink }}>Roles per team</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--game-surface-solid)', border: '1.4px solid var(--sv-border)', borderRadius: 999, padding: '4px 6px' }}>
            <button onClick={() => setPerTeam((p) => Math.max(1, p - 1))} style={{ border: 'none', background: 'none', cursor: 'pointer', color: muted, display: 'grid' }}><Minus size={15} /></button>
            <span style={{ fontFamily: DATA, fontWeight: 700, fontSize: 14, color: ink, width: 20, textAlign: 'center' }}>{perTeam}</span>
            <button onClick={() => setPerTeam((p) => p + 1)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: muted, display: 'grid' }}><Plus size={15} /></button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
          {roles.map((r) => (
            <div key={r.role} style={{ display: 'flex', alignItems: 'center', gap: 12, background: surfaceSoft, border: '1px solid var(--sv-border)', borderRadius: 10, padding: '12px 14px' }}>
              <Sliders size={15} color={faint} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 13.5, color: ink }}>{r.role}</div>
                <div style={{ fontFamily: DATA, fontSize: 12.5, color: muted }}>{r.desc}</div>
              </div>
              <button onClick={() => setRoles(roles.filter((x) => x.role !== r.role))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: faint, display: 'grid' }}><Trash2 size={15} /></button>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14 }}><OutlineButton><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Plus size={15} /> Add custom role</span></OutlineButton></div>
      </DeckCard>
    </SimSidebarShell>
  );
}

/* ════════════ 37 · Class Join Code / Invite ════════════ */
const SHARE = ['Email', 'Google Classroom', 'Microsoft Teams', 'LMS (Canvas)', 'More'];
export function SimTeacherInvite() {
  const [opts, setOpts] = useState<Record<string, boolean>>({
    'Allow students to join with code': true,
    'Require approval before joining': false,
    'Restrict to institution email domains': true,
    'Send welcome email upon joining': true,
  });
  return (
    <SimSidebarShell nav={TEACHER_NAV} active="classes" user={TEACHER}>
      <PageHead title="Class Join Code / Invite" subtitle="Share the join code or invite link with your class." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
        <DeckCard style={{ padding: 22, textAlign: 'center' }}>
          <Eyebrow>Class join code</Eyebrow>
          <div style={{ fontFamily: DATA, fontWeight: 800, fontSize: 30, color: ink, letterSpacing: '3px', margin: '14px 0 6px' }}>GSC-STRAT-25</div>
          <div style={{ fontFamily: DATA, fontSize: 12, color: faint, marginBottom: 14 }}>Expires May 30, 2025</div>
          <CtaButton full><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Copy size={14} /> Copy code</span></CtaButton>
        </DeckCard>
        <DeckCard style={{ padding: 22, textAlign: 'center' }}>
          <Eyebrow>Invite link</Eyebrow>
          <div style={{ fontFamily: DATA, fontSize: 14, color: ink, background: surfaceSoft, border: '1px solid var(--sv-border)', borderRadius: 8, padding: '12px 14px', margin: '14px 0', wordBreak: 'break-all' }}>https://cysim.com/join/GSC-STRAT-25</div>
          <CtaButton full><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Copy size={14} /> Copy link</span></CtaButton>
        </DeckCard>
      </div>

      <DeckCard style={{ padding: 22, marginBottom: 18 }}>
        <Eyebrow>Invitation options</Eyebrow>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
          {Object.keys(opts).map((k) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: DATA, fontSize: 13.5, color: body }}>{k}</span>
              <Toggle on={opts[k]} onChange={(v) => setOpts((s) => ({ ...s, [k]: v }))} />
            </div>
          ))}
        </div>
      </DeckCard>

      <Eyebrow>Share via</Eyebrow>
      <div style={{ display: 'flex', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
        {SHARE.map((s) => (
          <button key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: DISPLAY, fontWeight: 600, fontSize: 13.5, color: ink, background: 'var(--game-surface-solid)', border: '1.4px solid var(--sv-border)', borderRadius: 10, padding: '11px 16px', cursor: 'pointer' }}>
            <Mail size={15} color={tealMid} /> {s}
          </button>
        ))}
      </div>
    </SimSidebarShell>
  );
}
