'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { GridBackground } from '../GridBackground';
import { PageTransition } from '../PageTransition';
import { SimLogo } from './SimShell';
import { Check, Mail, GraduationCap, Info } from '../PixelIcons';
import {
  DISPLAY, DATA, ink, body, muted, faint, tealMid, success, cyanTint, whisper, surfaceSoft,
  OutlineButton,
} from './sim-ui';

/* ──────────────────────────────────────────────────────────────────────
   52 · Identity Confirmation — pre-auth. One-glance reassurance, a single
   primary confirm, and a low-friction escape. Says *why* we ask (so you
   land in the right class) in one muted line.
   ──────────────────────────────────────────────────────────────────── */

const STUDENT = {
  name: 'Alex Johnson',
  email: 'alex.johnson@riverside.k12.edu',
  school: 'Riverside High School',
  photo: '' as string, // empty -> initials avatar, never a broken image
};

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

export function SimIdentity() {
  const router = useRouter();

  return (
    <GridBackground>
      <PageTransition>
        <div style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', padding: '40px 24px' }}>
          <div style={{ width: '100%', maxWidth: 420 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 26 }}><SimLogo /></div>

            <div style={{ background: 'var(--game-surface)', border: 'var(--game-card-border)', boxShadow: 'var(--shadow-elev-3)', borderRadius: 16, padding: 28 }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: DATA, fontSize: 11.5, fontWeight: 700, letterSpacing: '1.4px', textTransform: 'uppercase', color: tealMid, background: cyanTint, padding: '4px 11px', borderRadius: 999 }}>
                  <GraduationCap size={13} color={tealMid} /> Riverside · Period 4
                </span>
                <h1 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 24, letterSpacing: '-0.4px', color: ink, marginTop: 16 }}>Confirm it&apos;s you</h1>
                <p style={{ fontFamily: DISPLAY, fontSize: 14, color: muted, marginTop: 6, lineHeight: 1.5 }}>
                  We match your account to the class so your decisions count for the right team.
                </p>
              </div>

              {/* Identity card */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginTop: 22, padding: 16, background: surfaceSoft, border: `1px solid ${whisper}`, borderRadius: 13 }}>
                <Avatar name={STUDENT.name} photo={STUDENT.photo} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 17, color: ink }}>{STUDENT.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: DATA, fontSize: 12.5, color: muted, marginTop: 3, overflow: 'hidden' }}>
                    <Mail size={13} color={faint} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{STUDENT.email}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: DATA, fontSize: 12.5, color: muted, marginTop: 3 }}>
                    <GraduationCap size={13} color={faint} /> {STUDENT.school}
                  </div>
                </div>
              </div>

              {/* Primary confirm */}
              <button
                onClick={() => router.push('/sim/play')}
                className="sim-confirm"
                style={{
                  width: '100%', marginTop: 20, fontFamily: DISPLAY, fontWeight: 700, fontSize: 15, color: '#fff',
                  background: 'var(--game-cta-gradient)', border: 'none', borderRadius: 'var(--game-cta-radius)',
                  padding: '14px 20px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9,
                  transition: 'filter .14s ease, transform .14s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.07)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <Check size={17} color="#fff" /> Yes, that&apos;s me
              </button>

              <OutlineButton onClick={() => router.push('/sim/play/join')} style={{ width: '100%', marginTop: 11, justifyContent: 'center', display: 'inline-flex' }}>
                Use a different account
              </OutlineButton>
            </div>

            {/* Low-friction escape */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 18, fontFamily: DATA, fontSize: 12.5, color: faint }}>
              <Info size={14} color={faint} />
              Not you?
              <button onClick={() => router.push('/sim/play/join')} style={{ fontFamily: DATA, fontWeight: 700, fontSize: 12.5, color: tealMid, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                Sign out and switch accounts
              </button>
            </div>
          </div>
        </div>
      </PageTransition>

      <style>{`.sim-confirm:focus-visible,.sim-identity-link:focus-visible{outline:2px solid var(--game-cyan);outline-offset:2px;}`}</style>
    </GridBackground>
  );
}

function Avatar({ name, photo }: { name: string; photo: string }) {
  const [broken, setBroken] = React.useState(false);
  const showImg = photo && !broken;
  return (
    <span style={{ width: 56, height: 56, borderRadius: '50%', flexShrink: 0, display: 'grid', placeItems: 'center', overflow: 'hidden', background: 'linear-gradient(135deg, var(--game-cyan), var(--game-teal-mid))', color: '#fff', fontFamily: DATA, fontWeight: 800, fontSize: 19, fontVariantNumeric: 'tabular-nums' }}>
      {showImg ? (
        <img src={photo} alt={name} onError={() => setBroken(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        initials(name)
      )}
    </span>
  );
}
