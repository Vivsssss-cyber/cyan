'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, X, Clock, Layers, Target, Truck, Megaphone, Landmark, ShoppingBag, GraduationCap, Check as CheckCircle2,
} from '../PixelIcons';
import { SimSidebarShell, TEACHER_NAV, DeckCard, PageHead, StatusPill } from './SimShell';
import { useSim, SCENARIOS, Scenario } from '../../context/SimContext';
import {
  Eyebrow, Tag, CtaButton, OutlineButton, DISPLAY, DATA,
  ink, body, muted, faint, cyan, tealMid, success, cyanTint, whisper,
} from './sim-ui';

const SUBJECT_META: Record<string, { icon: React.ComponentType<{ size?: number; color?: string }>; grad: string }> = {
  'Supply Chain': { icon: Truck, grad: 'linear-gradient(135deg,#006E85,#00A0C2)' },
  Marketing: { icon: Megaphone, grad: 'linear-gradient(135deg,#00A0C2,#00C1EB)' },
  Finance: { icon: Landmark, grad: 'linear-gradient(135deg,#003D47,#006E85)' },
  Retail: { icon: ShoppingBag, grad: 'linear-gradient(135deg,#00B1D6,#4DB5B6)' },
};
const TOPICS = ['All', 'Supply Chain', 'Marketing', 'Finance', 'Retail'];
const DURATIONS = ['Any duration', '90 min', 'Half-day', '3 weeks', 'Semester'];
const LEVELS = ['Any level', 'Beginner', 'Intermediate', 'Advanced'];

function Thumb({ subject, h = 130 }: { subject: string; h?: number }) {
  const m = SUBJECT_META[subject] ?? SUBJECT_META.Marketing;
  const Icon = m.icon;
  return (
    <div style={{ height: h, borderRadius: 12, background: m.grad, position: 'relative', overflow: 'hidden', display: 'grid', placeItems: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.18, backgroundImage: 'radial-gradient(circle at 20% 20%, #fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
      <Icon size={h > 90 ? 40 : 26} color="#ffffff" />
    </div>
  );
}

function Chip({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: DISPLAY, fontWeight: 600, fontSize: 13, color: on ? '#fff' : body,
      background: on ? cyan : '#fff', border: '1.4px solid ' + (on ? cyan : whisper), borderRadius: 999, padding: '7px 15px', cursor: 'pointer',
      transition: 'background .12s ease',
    }}>{label}</button>
  );
}

export function SimScenarioLibrary() {
  const router = useRouter();
  const { setScenario } = useSim();
  const [q, setQ] = useState('');
  const [topic, setTopic] = useState('All');
  const [dur, setDur] = useState('Any duration');
  const [lvl, setLvl] = useState('Any level');
  const [preview, setPreview] = useState<Scenario | null>(null);

  const results = useMemo(
    () =>
      SCENARIOS.filter(
        (s) =>
          (topic === 'All' || s.subject === topic) &&
          (dur === 'Any duration' || s.durationLabel === dur) &&
          (lvl === 'Any level' || s.level === lvl) &&
          (q === '' || s.title.toLowerCase().includes(q.toLowerCase())),
      ),
    [topic, dur, lvl, q],
  );
  const featured = results.slice(0, 3);

  const assign = (s: Scenario) => { setScenario(s); router.push('/sim/teacher/setup'); };

  return (
    <SimSidebarShell nav={TEACHER_NAV} active="library">
      <PageHead
        title="Scenario Library"
        subtitle="Real-world challenges built for student learning — centrally balanced, ready to assign."
        right={(
          <div style={{ display: 'flex', gap: 10 }}>
            <OutlineButton onClick={() => router.push('/sim/teacher/scenarios/compare')}>Compare</OutlineButton>
            <OutlineButton onClick={() => router.push('/sim/teacher/launch-ready')}>Ready to launch</OutlineButton>
          </div>
        )}
      />

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: '1.4px solid ' + whisper, borderRadius: 12, padding: '11px 14px', marginBottom: 14 }}>
        <Search size={17} color={faint} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search scenarios, topics, or keywords…"
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: DATA, fontSize: 14, color: ink }} />
      </div>

      {/* Topic chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
        {TOPICS.map((t) => <Chip key={t} label={t} on={topic === t} onClick={() => setTopic(t)} />)}
      </div>
      {/* Secondary filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        {DURATIONS.map((d) => <Chip key={d} label={d} on={dur === d} onClick={() => setDur(d)} />)}
        <span style={{ width: 1, background: whisper, margin: '0 4px' }} />
        {LEVELS.map((l) => <Chip key={l} label={l} on={lvl === l} onClick={() => setLvl(l)} />)}
      </div>

      {/* Featured */}
      {featured.length > 0 && (
        <>
          <Eyebrow>Featured scenarios</Eyebrow>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, margin: '14px 0 28px' }}>
            {featured.map((s) => (
              <DeckCard key={s.id} className="sim-feat" style={{ padding: 14, cursor: 'pointer', transition: 'transform .15s ease' }} onClick={() => setPreview(s)}>
                <Thumb subject={s.subject} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 12 }}>
                  <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 16, color: ink, letterSpacing: '-0.3px' }}>{s.title}</div>
                  <Tag>{s.subject}</Tag>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, fontFamily: DATA, fontSize: 12.5, color: muted }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Clock size={13} /> {s.durationLabel}</span>
                  <span>·</span><span>{s.level}</span>
                </div>
              </DeckCard>
            ))}
          </div>
        </>
      )}

      {/* All scenarios list */}
      <Eyebrow>All scenarios · {results.length}</Eyebrow>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
        {results.length === 0 && (
          <DeckCard style={{ padding: 36, textAlign: 'center' }}>
            <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 17, color: ink }}>No scenarios match those filters</div>
            <div style={{ fontFamily: DATA, fontSize: 13.5, color: muted, marginTop: 6 }}>Loosen a filter to see the catalog.</div>
          </DeckCard>
        )}
        {results.map((s) => (
          <DeckCard key={s.id} style={{ padding: 14, display: 'grid', gridTemplateColumns: '120px minmax(0,1fr) auto', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 120 }}><Thumb subject={s.subject} h={72} /></div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 16, color: ink }}>{s.title}</span>
                <Tag>{s.subject}</Tag>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6, fontFamily: DATA, fontSize: 12.5, color: muted }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Clock size={13} /> {s.durationLabel}</span>
                <span>·</span><span>{s.level}</span>
                <span>·</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><GraduationCap size={13} /> Grades 9–12</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
              <OutlineButton onClick={() => setPreview(s)}>Preview</OutlineButton>
              <CtaButton onClick={() => assign(s)}>Assign to class</CtaButton>
            </div>
          </DeckCard>
        ))}
      </div>

      {/* Detail drawer (#24) */}
      {preview && <DetailDrawer s={preview} onClose={() => setPreview(null)} onAssign={() => assign(preview)} />}

      <style>{`.sim-feat:hover{transform:translateY(-3px);}`}</style>
    </SimSidebarShell>
  );
}

function DetailDrawer({ s, onClose, onAssign }: { s: Scenario; onClose: () => void; onAssign: () => void }) {
  const [tab, setTab] = useState<'Overview' | 'Learning Goals' | 'Modules'>('Overview');
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 80, display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,44,51,0.28)', backdropFilter: 'blur(2px)' }} />
      <div style={{ position: 'relative', width: 460, maxWidth: '94vw', height: '100%', background: '#fff', padding: 24, overflowY: 'auto', boxShadow: '-8px 0 30px rgba(0,0,0,0.08)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: muted, zIndex: 2 }}><X size={20} /></button>
        <Thumb subject={s.subject} h={150} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
          <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 22, color: ink, letterSpacing: '-0.5px' }}>{s.title}</h2>
          <Tag>{s.subject}</Tag>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
          <Tag tone="neutral">{s.durationLabel}</Tag><Tag tone="neutral">{s.level}</Tag><Tag tone="neutral">Grades 9–12</Tag>
        </div>

        {/* tabs */}
        <div style={{ display: 'flex', gap: 4, marginTop: 18, borderBottom: '1px solid ' + whisper }}>
          {(['Overview', 'Learning Goals', 'Modules'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{
              fontFamily: DISPLAY, fontWeight: tab === t ? 700 : 600, fontSize: 13, padding: '9px 12px', border: 'none', background: 'none', cursor: 'pointer',
              color: tab === t ? tealMid : muted, borderBottom: '2px solid ' + (tab === t ? cyan : 'transparent'), marginBottom: -1,
            }}>{t}</button>
          ))}
        </div>

        <div style={{ marginTop: 16 }}>
          {tab === 'Overview' && <p style={{ fontFamily: DISPLAY, fontSize: 14.5, lineHeight: 1.65, color: body }}>{s.summary}</p>}
          {tab === 'Learning Goals' && (
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {s.objectives.map((o) => (
                <li key={o} style={{ display: 'flex', gap: 9, alignItems: 'flex-start', fontFamily: DATA, fontSize: 14, color: body }}>
                  <CheckCircle2 size={16} color={success} style={{ marginTop: 1, flexShrink: 0 }} /> {o}
                </li>
              ))}
            </ul>
          )}
          {tab === 'Modules' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {s.modules.map((m) => <Tag key={m} tone="neutral">{m}</Tag>)}
            </div>
          )}
        </div>

        <div style={{ marginTop: 26 }}><CtaButton full onClick={onAssign}>Assign to class</CtaButton></div>
      </div>
    </div>
  );
}
