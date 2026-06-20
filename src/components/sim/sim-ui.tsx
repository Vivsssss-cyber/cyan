'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from '../PixelIcons';

/* ── Type roles ──────────────────────────────────────────────────────────
   Outfit = display + UI body.  Inter = dense data / tables / KPI numbers. */
export const DISPLAY = "'Outfit', sans-serif";
export const DATA = "'Inter', sans-serif";

/* ── Color tokens (design.md / theme.css --game-*). No hardcoded brand hex. */
export const ink = 'var(--game-dark)';            // #002C33
export const body = 'var(--game-text)';           // #202326
export const muted = 'var(--game-text-secondary)';// #606569
export const faint = 'var(--game-text-muted)';    // #94A3B8
export const cyan = 'var(--game-cyan)';           // #00C1EB
export const cyanBright = 'var(--game-cyan-bright)';
export const cyanTint = 'var(--cyan-tint)';       // #E0F7FF
export const tealMid = 'var(--game-teal-mid)';    // #006E85
export const tealDark = 'var(--game-teal-dark)';  // #003C49
export const positive = 'var(--game-positive)';
export const success = 'var(--game-success)';
export const negative = 'var(--game-negative)';
export const warning = 'var(--game-warning)';
export const whisper = 'var(--sv-border)';         // #C8DDE6
export const surfaceSoft = 'var(--muted)';         // #F0F6FA — input / soft fills

/* shared card shells (mirror SV CARD/SUBCARD) */
export const CARD: React.CSSProperties = {
  background: 'var(--game-surface)', border: 'var(--game-card-border)', borderRadius: 16, boxShadow: 'var(--shadow-elev-1)',
};
export const SUBCARD: React.CSSProperties = {
  background: 'var(--game-surface-solid)', border: '1px solid var(--sv-border)', borderRadius: 12,
};

/* ── Section eyebrow ─────────────────────────────────────────────────── */
export function Eyebrow({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 11, letterSpacing: '1.8px', textTransform: 'uppercase', color: tealMid, ...style }}>
      {children}
    </span>
  );
}

export function SectionLabel({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 30, letterSpacing: '-0.5px', color: ink, lineHeight: 1.2, marginTop: 6 }}>{title}</h1>
      {sub && <p style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 15, color: muted, marginTop: 8, maxWidth: '62ch', lineHeight: 1.5 }}>{sub}</p>}
    </div>
  );
}

/* ── Glass card ──────────────────────────────────────────────────────── */
export function GlassCard({
  children, selected = false, className = '', style, ...rest
}: { children: React.ReactNode; selected?: boolean } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={className}
      style={{
        ...CARD,
        border: selected ? 'var(--game-card-selected-border)' : 'var(--game-card-border)',
        boxShadow: selected ? 'var(--shadow-elev-3)' : 'var(--shadow-elev-1)',
        padding: 20,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

/* ── Cyan-tint chip ──────────────────────────────────────────────────── */
export function Tag({ children, tone = 'cyan' }: { children: React.ReactNode; tone?: 'cyan' | 'neutral' | 'success' | 'warn' }) {
  const map = {
    cyan: { bg: 'var(--cyan-tint)', fg: tealMid },
    neutral: { bg: 'var(--muted)', fg: muted },
    success: { bg: 'color-mix(in srgb, var(--game-success) 14%, #fff)', fg: success },
    warn: { bg: 'color-mix(in srgb, var(--game-warning) 16%, #fff)', fg: warning },
  }[tone];
  return (
    <span style={{ fontFamily: DATA, fontSize: 12, fontWeight: 600, color: map.fg, background: map.bg, padding: '3px 10px', borderRadius: 999, whiteSpace: 'nowrap' }}>
      {children}
    </span>
  );
}

/* ── Secondary buttons ───────────────────────────────────────────────── */
export function OutlineButton({ children, onClick, disabled, style }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; style?: React.CSSProperties }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        fontFamily: DISPLAY, fontWeight: 600, fontSize: 14, color: ink, background: 'var(--game-surface-solid)',
        border: '1.4px solid var(--sv-border)', borderRadius: 999, padding: '11px 20px',
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1, transition: 'transform .15s ease', ...style,
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, onClick, style }: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: DISPLAY, fontWeight: 600, fontSize: 14, color: muted, background: 'transparent', border: 'none',
        borderRadius: 8, padding: '9px 14px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
        transition: 'background .15s ease, color .15s ease', ...style,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,44,51,0.05)'; e.currentTarget.style.color = ink; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = muted; }}
    >
      {children}
    </button>
  );
}

/* ── CTA — SV gradient pill (mirrors GameButton) ─────────────────────── */
export function CtaButton({
  children, onClick, disabled = false, reason, full = false, style,
}: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; reason?: string; full?: boolean; style?: React.CSSProperties }) {
  return (
    <div style={{ display: full ? 'block' : 'inline-flex', flexDirection: 'column', alignItems: full ? 'stretch' : 'flex-start', gap: 6 }}>
      <button
        onClick={onClick}
        disabled={disabled}
        style={{
          fontFamily: DISPLAY, fontWeight: 600, fontSize: 15, color: '#FFFFFF',
          background: 'var(--game-cta-gradient)', border: 'none', borderRadius: 'var(--game-cta-radius)',
          padding: '11px 12px 11px 22px', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1,
          display: 'inline-flex', alignItems: 'center', gap: 10, width: full ? '100%' : undefined, justifyContent: full ? 'center' : undefined,
          transition: 'transform .14s ease, filter .14s ease', ...style,
        }}
        onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.filter = 'brightness(1.07)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
        onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        <span>{children}</span>
        <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 999, width: 26, height: 26, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <svg width="11" height="10" viewBox="0 0 12 10" fill="none">
            <path d="M1 5H11M11 5L7 1M11 5L7 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      {disabled && reason && <span style={{ fontFamily: DATA, fontSize: 12, color: muted }}>{reason}</span>}
    </div>
  );
}

/* ── KPI tile (flat glass, label-dot accent — anti-ribbon) ───────────── */
export function StatTile({ label, value, delta, tone = 'flat' }: { label: string; value: string; delta?: string; tone?: 'up' | 'down' | 'warn' | 'flat' }) {
  const dot = tone === 'warn' ? warning : tone === 'down' ? negative : cyan;
  const deltaColor = tone === 'up' ? positive : tone === 'down' ? negative : tone === 'warn' ? warning : muted;
  return (
    <GlassCard style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, flexShrink: 0 }} />
        <span style={{ fontFamily: DATA, fontSize: 12, color: muted, fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontFamily: DATA, fontWeight: 700, fontSize: 24, color: ink, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.4px' }}>{value}</span>
        {delta && <span style={{ fontFamily: DATA, fontSize: 13, fontWeight: 600, color: deltaColor, fontVariantNumeric: 'tabular-nums' }}>{delta}</span>}
      </div>
    </GlassCard>
  );
}

/* ── Back link (ghost, pixel chevron) ────────────────────────────────── */
export function BackLink({ to, label }: { to: string; label: string }) {
  const router = useRouter();
  return (
    <GhostButton onClick={() => router.push(to)} style={{ paddingLeft: 8 }}>
      <ChevronLeft size={16} color="currentColor" /> {label}
    </GhostButton>
  );
}

/* ── Page shell: max-width centered column ───────────────────────────── */
export function SimPage({ children, maxWidth = 1288 }: { children: React.ReactNode; maxWidth?: number }) {
  return <div style={{ maxWidth, margin: '0 auto', padding: '28px 24px 80px', width: '100%' }}>{children}</div>;
}
