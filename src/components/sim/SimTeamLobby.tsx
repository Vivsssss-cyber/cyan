'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SimStudentShell, DeckCard, PageHead } from './SimShell';
import {
  Trophy, Send, Check, MessageSquare, FileText, BarChart3, TrendingUp, Users, Megaphone, DollarSign, Settings,
} from '../PixelIcons';
import {
  Eyebrow, CtaButton, DISPLAY, DATA, ink, body, muted, faint, cyan, tealMid, success, warning, cyanTint, whisper, surfaceSoft,
} from './sim-ui';

/* ──────────────────────────────────────────────────────────────────────
   55 · Team Lobby — regroup before deciding. Live presence (joined / active
   now), roles as chips, a read-only chat preview with an "I'm here"
   affordance, and an activity feed. Readiness is the single forward CTA.
   ──────────────────────────────────────────────────────────────────── */

type Presence = 'active' | 'online' | 'away';
interface Member { name: string; role: string; roleIcon: React.ComponentType<{ size?: number; color?: string }>; presence: Presence; you?: boolean }

const MEMBERS: Member[] = [
  { name: 'Alex Johnson', role: 'CEO', roleIcon: Trophy, presence: 'active', you: true },
  { name: 'Maya Patel', role: 'Marketing', roleIcon: Megaphone, presence: 'active' },
  { name: 'Jordan Lee', role: 'Operations', roleIcon: Settings, presence: 'online' },
  { name: 'Taylor Kim', role: 'Finance', roleIcon: DollarSign, presence: 'away' },
];

const PRESENCE_META: Record<Presence, { color: string; label: string }> = {
  active: { color: 'var(--game-success)', label: 'Active now' },
  online: { color: 'var(--game-cyan)', label: 'Joined' },
  away: { color: 'var(--game-text-muted)', label: 'Not here yet' },
};

const CHAT = [
  { from: 'Maya Patel', text: 'I pulled the Eastvale demand data — looks promising but margins are tight. Let’s not overspend on launch.', time: '2:41 PM', initials: 'MP' },
  { from: 'Jordan Lee', text: 'Agreed. I can keep operations balanced if we hold price steady.', time: '2:43 PM', initials: 'JL' },
];

const ACTIVITY = [
  { icon: FileText, text: 'Maya opened the Round 2 brief', time: '12m ago' },
  { icon: BarChart3, text: 'Jordan reviewed market & company data', time: '18m ago' },
  { icon: Users, text: 'Taylor joined the team lobby', time: '34m ago' },
  { icon: TrendingUp, text: 'Round 2 results published — you’re #4 of 24', time: '1h ago' },
];

function avatarInitials(name: string) {
  return name.split(/\s+/).filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

export function SimTeamLobby() {
  const router = useRouter();
  const [hereSaid, setHereSaid] = useState(false);
  const activeCount = MEMBERS.filter((m) => m.presence !== 'away').length;

  return (
    <SimStudentShell>
      <PageHead
        title="Team Lobby"
        subtitle="Regroup with your team, then head into the readiness check together."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)', gap: 20, alignItems: 'start' }} className="sim-lobby-grid">
        {/* ── Left column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Team header card */}
          <DeckCard style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ width: 50, height: 50, borderRadius: 13, background: 'linear-gradient(135deg, var(--game-cyan), var(--game-teal-mid))', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Trophy size={24} color="#fff" />
                </span>
                <div>
                  <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 20, color: ink, letterSpacing: '-0.3px' }}>Peak Performance</div>
                  <div style={{ fontFamily: DATA, fontSize: 13, color: muted, marginTop: 2 }}>Sportswear &amp; Apparel · Cyan Global Challenge</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: DATA, fontSize: 11.5, color: faint }}>Team Rank</div>
                <div style={{ fontFamily: DATA, fontWeight: 800, fontSize: 22, color: ink, fontVariantNumeric: 'tabular-nums' }}>#4 <span style={{ fontSize: 13, fontWeight: 500, color: faint }}>of 24</span></div>
              </div>
            </div>

            {/* Presence summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 18, paddingTop: 16, borderTop: `1px solid ${whisper}`, fontFamily: DATA, fontSize: 13, color: muted }}>
              <span style={{ display: 'inline-flex', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: success }} />
              </span>
              <strong style={{ color: ink, fontVariantNumeric: 'tabular-nums' }}>{activeCount} of {MEMBERS.length}</strong> teammates here now
            </div>

            {/* Members with presence + role chips */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }} className="sim-members">
              {MEMBERS.map((m) => {
                const meta = PRESENCE_META[m.presence];
                const RoleIcon = m.roleIcon;
                return (
                  <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: 11, background: m.you ? cyanTint : surfaceSoft, border: `1px solid ${m.you ? 'transparent' : whisper}`, borderRadius: 12 }}>
                    <span style={{ position: 'relative', flexShrink: 0 }}>
                      <span style={{ width: 38, height: 38, borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, var(--game-cyan), var(--game-teal-mid))', color: '#fff', fontFamily: DATA, fontWeight: 800, fontSize: 13 }}>
                        {avatarInitials(m.name)}
                      </span>
                      <span title={meta.label} style={{ position: 'absolute', right: -1, bottom: -1, width: 12, height: 12, borderRadius: '50%', background: meta.color, border: '2px solid #fff' }} />
                    </span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 13.5, color: ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {m.name.split(' ')[0]}{m.you && <span style={{ color: faint, fontWeight: 500 }}> · you</span>}
                      </div>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 3, fontFamily: DATA, fontSize: 11, fontWeight: 600, color: tealMid, background: 'var(--game-surface-solid)', padding: '2px 7px', borderRadius: 999, border: `1px solid ${whisper}` }}>
                        <RoleIcon size={11} color={tealMid} /> {m.role}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </DeckCard>

          {/* Read-only chat preview + "I'm here" */}
          <DeckCard style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 20px', borderBottom: `1px solid ${whisper}` }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <MessageSquare size={16} color={tealMid} />
                <Eyebrow>Team chat</Eyebrow>
              </span>
              <span style={{ fontFamily: DATA, fontSize: 11.5, color: faint }}>Preview · open chat to reply</span>
            </div>
            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {CHAT.map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: 11 }}>
                  <span style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, var(--game-teal-mid), var(--game-teal-dark))', color: '#fff', fontFamily: DATA, fontWeight: 700, fontSize: 11 }}>{c.initials}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 13, color: ink }}>{c.from.split(' ')[0]}</span>
                      <span style={{ fontFamily: DATA, fontSize: 11, color: faint }}>{c.time}</span>
                    </div>
                    <p style={{ fontFamily: DATA, fontSize: 13.5, color: body, lineHeight: 1.55, marginTop: 3 }}>{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* "I'm here" affordance — read-only lobby, lightweight presence ping */}
            <div style={{ padding: '12px 20px 16px', borderTop: `1px solid ${whisper}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => setHereSaid(true)}
                disabled={hereSaid}
                className="sim-here"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: DISPLAY, fontWeight: 700, fontSize: 13.5,
                  color: hereSaid ? success : tealMid, background: hereSaid ? 'color-mix(in srgb, var(--game-success) 12%, #fff)' : cyanTint,
                  border: 'none', borderRadius: 999, padding: '9px 16px', cursor: hereSaid ? 'default' : 'pointer', transition: 'transform .14s ease',
                }}
              >
                {hereSaid ? <><Check size={15} color={success} /> You let the team know you’re here</> : <><Send size={15} color={tealMid} /> I’m here</>}
              </button>
              {!hereSaid && <span style={{ fontFamily: DATA, fontSize: 12, color: faint }}>Ping your team that you’ve joined the lobby.</span>}
            </div>
          </DeckCard>
        </div>

        {/* ── Right column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'sticky', top: 92 }}>
          {/* Activity feed */}
          <DeckCard style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '15px 20px', borderBottom: `1px solid ${whisper}` }}>
              <Eyebrow>Team activity</Eyebrow>
            </div>
            <div style={{ padding: '6px 0' }}>
              {ACTIVITY.map((a, i) => {
                const Icon = a.icon;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px' }}>
                    <span style={{ width: 32, height: 32, borderRadius: 9, background: surfaceSoft, color: tealMid, display: 'grid', placeItems: 'center', flexShrink: 0, border: `1px solid ${whisper}` }}>
                      <Icon size={15} color={tealMid} />
                    </span>
                    <span style={{ flex: 1, fontFamily: DATA, fontSize: 13, color: body, lineHeight: 1.45 }}>{a.text}</span>
                    <span style={{ fontFamily: DATA, fontSize: 11.5, color: faint, whiteSpace: 'nowrap' }}>{a.time}</span>
                  </div>
                );
              })}
            </div>
          </DeckCard>

          {/* Forward CTA */}
          <DeckCard style={{ padding: 20 }}>
            <Eyebrow>When the team is ready</Eyebrow>
            <p style={{ fontFamily: DISPLAY, fontSize: 14.5, color: body, lineHeight: 1.55, marginTop: 10 }}>
              Run the readiness check together — it confirms everyone&apos;s prepped before the round unlocks.
            </p>
            <div style={{ marginTop: 16 }}>
              <CtaButton full onClick={() => router.push('/sim/play/readiness')}>Enter Readiness Check</CtaButton>
            </div>
          </DeckCard>
        </div>
      </div>

      <style>{`
        .sim-here:focus-visible{outline:2px solid var(--game-cyan);outline-offset:2px;}
        .sim-here:hover:not(:disabled){transform:translateY(-1px);}
        @media (max-width:840px){.sim-lobby-grid{grid-template-columns:1fr !important;}.sim-lobby-grid > div:last-child{position:static !important;}}
        @media (max-width:520px){.sim-members{grid-template-columns:1fr !important;}}
      `}</style>
    </SimStudentShell>
  );
}
