'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Home, BookOpen, Monitor, GraduationCap, FileText, BarChart3, FolderOpen, Mail,
  HelpCircle, Trophy, ChevronRight, MessageSquare, Lightbulb, ThumbsUp, Clock, Star,
} from '../PixelIcons';
import { GridBackground } from '../GridBackground';
import { PageTransition } from '../PageTransition';
import {
  CARD, DISPLAY, DATA, ink, body, muted, faint, cyan, tealMid, success, negative, warning, cyanTint, whisper,
} from './sim-ui';

/* ── Brand mark ──────────────────────────────────────────────────────── */
export function SimLogo({ small }: { small?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img src="/demo/cyan-logo.png" alt="CyanSim Logo" style={{ height: small ? 24 : 28, width: 'auto' }} />
    </div>
  );
}

/* ── Nav config ──────────────────────────────────────────────────────── */
export interface NavItem { key: string; label: string; icon: React.ComponentType<{ size?: number; color?: string }>; to?: string; badge?: number }

export const TEACHER_NAV: NavItem[] = [
  { key: 'home', label: 'Home', icon: Home, to: '/sim/teacher' },
  { key: 'library', label: 'Scenario Library', icon: BookOpen, to: '/sim/teacher/library' },
  { key: 'sessions', label: 'My Sessions', icon: Monitor, to: '/sim/teacher/live' },
  { key: 'classes', label: 'Classes', icon: GraduationCap, to: '/sim/teacher/classes' },
  { key: 'assignments', label: 'Assignments', icon: FileText, to: '/sim/teacher/assigned' },
  { key: 'reports', label: 'Reports', icon: BarChart3 },
  { key: 'resources', label: 'Resources', icon: FolderOpen },
  { key: 'inbox', label: 'Inbox', icon: Mail, badge: 1 },
];

export const MENTOR_NAV: NavItem[] = [
  { key: 'queue', label: 'Reflection Queue', icon: MessageSquare, to: '/sim/mentor', badge: 6 },
  { key: 'transcript', label: 'Transcriptions', icon: FileText, to: '/sim/mentor/transcript' },
  { key: 'assumptions', label: 'Assumptions', icon: Lightbulb, to: '/sim/mentor/assumptions' },
  { key: 'feedback', label: 'Feedback', icon: ThumbsUp, to: '/sim/mentor/feedback' },
  { key: 'timeline', label: 'Evidence Timeline', icon: Clock, to: '/sim/mentor/timeline' },
  { key: 'summary', label: 'Mentor Summary', icon: Star, to: '/sim/mentor/summary' },
  { key: 'evidence', label: 'Evidence Hub', icon: FolderOpen, to: '/sim/mentor/evidence' },
];

/* ── Sidebar shell (teacher / admin) ─────────────────────────────────── */
export function SimSidebarShell({
  nav, active, user = { name: 'Mrs. Johnson', role: 'Science Teacher' }, children,
}: { nav: NavItem[]; active: string; user?: { name: string; role: string }; children: React.ReactNode }) {
  const router = useRouter();
  return (
    <GridBackground>
      <div style={{ display: 'flex', minHeight: '100dvh', width: '100%' }}>
        <aside style={{ width: 232, flexShrink: 0, background: 'var(--game-surface-solid)', borderRight: '1px solid var(--sv-border)', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100dvh' }}>
          <div style={{ padding: '20px 18px 14px' }}>
            <button onClick={() => router.push('/sim')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><SimLogo /></button>
          </div>

          <nav style={{ flex: 1, padding: '6px 12px', display: 'flex', flexDirection: 'column', gap: 3, overflowY: 'auto' }}>
            {nav.map((item) => {
              const on = item.key === active;
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => item.to && router.push(item.to)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 11, width: '100%', textAlign: 'left',
                    fontFamily: DISPLAY, fontWeight: on ? 700 : 500, fontSize: 14,
                    color: on ? tealMid : (item.to ? body : faint),
                    background: on ? cyanTint : 'transparent', border: 'none', borderRadius: 9, padding: '9px 12px',
                    cursor: item.to ? 'pointer' : 'default', transition: 'background .12s ease, color .12s ease',
                  }}
                  onMouseEnter={(e) => { if (!on && item.to) e.currentTarget.style.background = 'rgba(0,44,51,0.04)'; }}
                  onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = 'transparent'; }}
                >
                  <Icon size={17} color={on ? tealMid : faint} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge ? (
                    <span style={{ fontFamily: DATA, fontSize: 11, fontWeight: 700, color: '#fff', background: cyan, borderRadius: 999, minWidth: 18, height: 18, display: 'grid', placeItems: 'center', padding: '0 5px' }}>{item.badge}</span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          <div style={{ padding: 12, borderTop: '1px solid var(--sv-border)' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', fontFamily: DISPLAY, fontWeight: 500, fontSize: 13.5, color: muted, background: 'none', border: 'none', borderRadius: 9, padding: '8px 12px', cursor: 'pointer' }}>
              <HelpCircle size={16} color={faint} /> Help
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px' }}>
              <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--game-cyan), var(--game-teal-mid))', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: DATA, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                {user.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
              </span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 13, color: ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
                <div style={{ fontFamily: DATA, fontSize: 11.5, color: faint }}>{user.role}</div>
              </div>
            </div>
          </div>
        </aside>

        <main style={{ flex: 1, minWidth: 0 }}>
          <PageTransition>
            <div style={{ maxWidth: 1180, margin: '0 auto', padding: '26px 30px 64px', width: '100%' }}>{children}</div>
          </PageTransition>
        </main>
      </div>
    </GridBackground>
  );
}

/* ── Student top-bar shell ───────────────────────────────────────────── */
export function SimStudentShell({
  children, season = 'Cyan Global Challenge — Season 7', round = 'Round 2 of 6', level = 3, xp = 1250,
}: { children: React.ReactNode; season?: string; round?: string; level?: number; xp?: number }) {
  const router = useRouter();
  return (
    <GridBackground>
      <div style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--sv-border)', borderTop: `4px solid ${ink}` }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <button onClick={() => router.push('/sim')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><SimLogo small /></button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="sim-hide-sm" style={{ fontFamily: DATA, fontSize: 12.5, color: muted, whiteSpace: 'nowrap' }}>{season} · <span style={{ color: ink, fontWeight: 600 }}>{round}</span></span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: cyanTint, borderRadius: 999, padding: '5px 12px' }}>
              <Trophy size={13} color={tealMid} />
              <span style={{ fontFamily: DATA, fontSize: 12, fontWeight: 700, color: tealMid, fontVariantNumeric: 'tabular-nums' }}>Lvl {level} · {xp.toLocaleString()} XP</span>
            </span>
          </div>
        </div>
      </div>
      <PageTransition>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '24px 24px 72px', width: '100%' }}>{children}</div>
      </PageTransition>
      <style>{`@media (max-width:720px){.sim-hide-sm{display:none !important;}}`}</style>
    </GridBackground>
  );
}

/* ── Deck primitives ─────────────────────────────────────────────────── */
export function DeckCard({ children, style, ...rest }: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return <div style={{ ...CARD, padding: 20, ...style }} {...rest}>{children}</div>;
}

export function DeckStat({ label, value, delta, tone = 'flat', sub }: { label: string; value: string; delta?: string; tone?: 'up' | 'down' | 'warn' | 'flat'; sub?: string }) {
  const dc = tone === 'up' ? success : tone === 'down' ? negative : tone === 'warn' ? warning : muted;
  return (
    <div style={{ ...CARD, padding: 16 }}>
      <div style={{ fontFamily: DATA, fontSize: 12, color: muted, fontWeight: 500 }}>{label}</div>
      <div style={{ fontFamily: DATA, fontWeight: 800, fontSize: 26, color: ink, letterSpacing: '-0.6px', fontVariantNumeric: 'tabular-nums', marginTop: 6 }}>{value}</div>
      {(delta || sub) && (
        <div style={{ fontFamily: DATA, fontSize: 12.5, fontWeight: 600, color: dc, marginTop: 3, fontVariantNumeric: 'tabular-nums' }}>
          {delta}{sub && <span style={{ color: faint, fontWeight: 500, marginLeft: delta ? 6 : 0 }}>{sub}</span>}
        </div>
      )}
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, { bg: string; fg: string; dot?: boolean }> = {
    active: { bg: 'color-mix(in srgb, var(--game-success) 14%, #fff)', fg: success, dot: true },
    ready: { bg: cyanTint, fg: tealMid, dot: true },
    running: { bg: cyanTint, fg: tealMid, dot: true },
    live: { bg: 'color-mix(in srgb, var(--game-success) 14%, #fff)', fg: success, dot: true },
    completed: { bg: 'var(--muted)', fg: muted },
    draft: { bg: 'color-mix(in srgb, var(--game-warning) 16%, #fff)', fg: warning },
    archived: { bg: 'var(--muted)', fg: faint },
    inactive: { bg: 'color-mix(in srgb, var(--game-negative) 14%, #fff)', fg: negative },
    pending: { bg: 'color-mix(in srgb, var(--game-warning) 16%, #fff)', fg: warning, dot: true },
    transcribed: { bg: cyanTint, fg: tealMid, dot: true },
    reviewed: { bg: 'color-mix(in srgb, var(--game-success) 14%, #fff)', fg: success, dot: true },
    atrisk: { bg: 'color-mix(in srgb, var(--game-negative) 14%, #fff)', fg: negative, dot: true },
  };
  const m = map[status] ?? map.draft;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: DATA, fontSize: 11.5, fontWeight: 700, color: m.fg, background: m.bg, padding: '3px 10px', borderRadius: 999, textTransform: 'capitalize' }}>
      {m.dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: m.fg }} />}
      {status}
    </span>
  );
}

export function PageHead({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 22 }}>
      <div>
        <h1 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 26, letterSpacing: '-0.5px', color: ink, lineHeight: 1.2 }}>{title}</h1>
        {subtitle && <p style={{ fontFamily: DISPLAY, fontSize: 14, color: muted, marginTop: 5 }}>{subtitle}</p>}
      </div>
      {right && <div style={{ flexShrink: 0 }}>{right}</div>}
    </div>
  );
}

export { ChevronRight };
