'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SimStudentShell, DeckCard, PageHead } from './SimShell';
import {
  FileText, BarChart3, MessageSquare, Users, Check, ChevronRight, Flag, ExternalLink,
} from '../PixelIcons';
import {
  Eyebrow, CtaButton, DISPLAY, DATA, ink, body, muted, faint, cyan, tealMid, success, warning, cyanTint, whisper, surfaceSoft,
} from './sim-ui';

/* ──────────────────────────────────────────────────────────────────────
   56 · Readiness Check — a checklist that *gates* the round. Each item
   links to the thing it checks; checking by doing where possible. Positive
   framing only (counter turns success-green at complete, never red-shames).
   Personal progress + team progress. "Let's Go!" disabled-with-reason
   until personal items are complete.
   ──────────────────────────────────────────────────────────────────── */

interface Item {
  id: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  detail: string;
  link?: { label: string; to: string };
}

const ITEMS: Item[] = [
  { id: 'brief', icon: FileText, label: 'Read the brief', detail: 'Round 2 — Expanding Our Footprint', link: { label: 'Open brief', to: '/sim/play/brief' } },
  { id: 'data', icon: BarChart3, label: 'Review market & company data', detail: 'KPIs, competitors, and cash position', link: { label: 'Open dashboard', to: '/sim/play' } },
  { id: 'updates', icon: MessageSquare, label: 'Check team updates', detail: 'Latest messages and lobby activity', link: { label: 'Open lobby', to: '/sim/play/lobby' } },
  { id: 'discuss', icon: Users, label: 'Discuss as a team', detail: 'Align on direction before you commit', link: { label: 'Open lobby', to: '/sim/play/lobby' } },
  { id: 'ready', icon: Flag, label: 'Ready to decide', detail: 'Confirm you’re set to make this round’s calls' },
];

/* Mock team-wide readiness — 3 of 5 teammates have finished their checklist. */
const TEAM = [
  { name: 'Maya', done: true },
  { name: 'Jordan', done: true },
  { name: 'Alex', done: false, you: true },
  { name: 'Taylor', done: true },
  { name: 'Sam', done: false },
];

export function SimReadiness() {
  const router = useRouter();
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setChecked((c) => ({ ...c, [id]: !c[id] }));
  /* "checking by doing" — visiting the linked surface marks the item done. */
  const visit = (item: Item) => {
    if (item.link) {
      setChecked((c) => ({ ...c, [item.id]: true }));
      router.push(item.link.to);
    }
  };

  const doneCount = ITEMS.filter((i) => checked[i.id]).length;
  const allDone = doneCount === ITEMS.length;
  const pct = Math.round((doneCount / ITEMS.length) * 100);
  const remaining = ITEMS.length - doneCount;

  const teamDone = TEAM.filter((t) => t.done).length;

  return (
    <SimStudentShell>
      <PageHead
        title="Are you ready?"
        subtitle="Run through your checklist. Each step opens what it checks — finish them to unlock the round."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)', gap: 20, alignItems: 'start' }} className="sim-ready-grid">
        {/* ── Checklist ── */}
        <div>
          {/* Personal progress header — success-green at complete, never red */}
          <DeckCard style={{ padding: 20, marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <Eyebrow>Your readiness</Eyebrow>
              <span style={{ fontFamily: DATA, fontWeight: 800, fontSize: 14, color: allDone ? success : tealMid, fontVariantNumeric: 'tabular-nums' }}>
                {doneCount} / {ITEMS.length} done
              </span>
            </div>
            <div role="progressbar" aria-valuenow={doneCount} aria-valuemin={0} aria-valuemax={ITEMS.length} aria-label="Personal readiness progress"
              style={{ height: 9, borderRadius: 5, background: surfaceSoft, marginTop: 12, overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', borderRadius: 5, background: allDone ? success : 'var(--game-cta-gradient)', transition: 'width .35s ease' }} />
            </div>
            <div style={{ fontFamily: DATA, fontSize: 12.5, color: allDone ? success : muted, marginTop: 9, display: 'flex', alignItems: 'center', gap: 6 }}>
              {allDone ? <><Check size={14} color={success} /> All set — you’re ready to decide.</> : `${remaining} step${remaining === 1 ? '' : 's'} to go. You’ve got this.`}
            </div>
          </DeckCard>

          {/* Items */}
          <ul role="group" aria-label="Readiness checklist" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
            {ITEMS.map((item) => {
              const on = !!checked[item.id];
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <DeckCard style={{ padding: 0, overflow: 'hidden', border: on ? '1.4px solid var(--game-cyan)' : 'var(--game-card-border)', transition: 'border-color .18s ease' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: 15 }}>
                      {/* Checkbox toggle */}
                      <button
                        role="checkbox"
                        aria-checked={on}
                        aria-label={`${item.label}${on ? ' — done' : ''}`}
                        onClick={() => toggle(item.id)}
                        className="sim-check"
                        style={{
                          width: 26, height: 26, flexShrink: 0, borderRadius: 8, cursor: 'pointer',
                          display: 'grid', placeItems: 'center', transition: 'background .15s ease, border-color .15s ease',
                          background: on ? success : 'var(--game-surface-solid)',
                          border: `1.6px solid ${on ? success : whisper}`,
                        }}
                      >
                        {on && <Check size={15} color="#fff" />}
                      </button>

                      <span style={{ width: 36, height: 36, borderRadius: 10, background: on ? 'color-mix(in srgb, var(--game-success) 13%, #fff)' : cyanTint, color: on ? success : tealMid, display: 'grid', placeItems: 'center', flexShrink: 0, transition: 'background .15s ease' }}>
                        <Icon size={17} color={on ? success : tealMid} />
                      </span>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 15, color: ink, textDecoration: on ? 'none' : 'none' }}>{item.label}</div>
                        <div style={{ fontFamily: DATA, fontSize: 12.5, color: muted, marginTop: 2 }}>{item.detail}</div>
                      </div>

                      {item.link ? (
                        <button
                          onClick={() => visit(item)}
                          className="sim-open"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: DISPLAY, fontWeight: 700, fontSize: 12.5, color: tealMid, background: surfaceSoft, border: `1px solid ${whisper}`, borderRadius: 999, padding: '7px 13px', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, transition: 'background .14s ease' }}
                        >
                          {item.link.label} <ChevronRight size={13} color={tealMid} />
                        </button>
                      ) : (
                        <span style={{ fontFamily: DATA, fontSize: 11.5, color: faint, flexShrink: 0 }}>{on ? 'Confirmed' : 'Tap to confirm'}</span>
                      )}
                    </div>
                  </DeckCard>
                </li>
              );
            })}
          </ul>

          {/* Gated CTA */}
          <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <CtaButton
              onClick={() => router.push('/sim/play/decide')}
              disabled={!allDone}
              reason={allDone ? undefined : `Finish ${remaining} more step${remaining === 1 ? '' : 's'} to unlock the round.`}
            >
              Let&apos;s Go!
            </CtaButton>
            {allDone && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: DATA, fontSize: 13, color: success }}>
                <Check size={15} color={success} /> Round unlocked — make your decisions.
              </span>
            )}
          </div>
        </div>

        {/* ── Team progress ── */}
        <div style={{ position: 'sticky', top: 92 }}>
          <DeckCard style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <Eyebrow>Team progress</Eyebrow>
              <span style={{ fontFamily: DATA, fontWeight: 800, fontSize: 14, color: teamDone === TEAM.length ? success : tealMid, fontVariantNumeric: 'tabular-nums' }}>
                {teamDone} / {TEAM.length} ready
              </span>
            </div>
            <p style={{ fontFamily: DATA, fontSize: 12.5, color: muted, marginTop: 8, lineHeight: 1.5 }}>
              The round opens for everyone once the team is set. No rush — finish your own list first.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 16 }}>
              {TEAM.map((t) => (
                <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 11px', borderRadius: 10, background: t.you ? cyanTint : surfaceSoft, border: `1px solid ${t.you ? 'transparent' : whisper}` }}>
                  <span style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, var(--game-cyan), var(--game-teal-mid))', color: '#fff', fontFamily: DATA, fontWeight: 700, fontSize: 11 }}>
                    {t.name.slice(0, 2).toUpperCase()}
                  </span>
                  <span style={{ flex: 1, fontFamily: DISPLAY, fontWeight: 600, fontSize: 13.5, color: ink }}>
                    {t.name}{t.you && <span style={{ color: faint, fontWeight: 500 }}> · you</span>}
                  </span>
                  {t.done ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: DATA, fontSize: 11.5, fontWeight: 700, color: success }}>
                      <Check size={13} color={success} /> Ready
                    </span>
                  ) : (
                    <span style={{ fontFamily: DATA, fontSize: 11.5, fontWeight: 600, color: faint }}>Preparing…</span>
                  )}
                </div>
              ))}
            </div>
          </DeckCard>
        </div>
      </div>

      <style>{`
        .sim-check:focus-visible,.sim-open:focus-visible{outline:2px solid var(--game-cyan);outline-offset:2px;}
        .sim-open:hover{background:var(--cyan-tint);}
        @media (max-width:840px){.sim-ready-grid{grid-template-columns:1fr !important;}.sim-ready-grid > div:last-child{position:static !important;}}
      `}</style>
    </SimStudentShell>
  );
}
