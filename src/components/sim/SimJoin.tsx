'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { GridBackground } from '../GridBackground';
import { PageTransition } from '../PageTransition';
import { SimLogo } from './SimShell';
import { AlertCircle, Check, GraduationCap, Eye, TrendingUp, Users, Target } from '../PixelIcons';
import {
  DISPLAY, DATA, ink, body, muted, faint, cyan, tealMid, success, negative, cyanTint, whisper, surfaceSoft,
  OutlineButton,
} from './sim-ui';

/* ──────────────────────────────────────────────────────────────────────
   51 · Student Join — pre-auth gate. Full-screen split: dark brand panel
   (left) + focused join card (right). Centered card is the sanctioned
   exception to "no centered hero" for a focused gate.
   ──────────────────────────────────────────────────────────────────── */

const CODE_LEN = 6;
/** Mock roster of live class codes (a real server check stands in here). */
const VALID_CODES = ['PEAK24', 'CYAN24', 'RIVR24'];

const PROMISES = [
  { icon: Target, text: 'Make decisions across six business areas.' },
  { icon: TrendingUp, text: 'See the impact play out, round by round.' },
  { icon: Users, text: 'Lead your company with your team.' },
];

function normalize(raw: string) {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, CODE_LEN);
}

export function SimJoin() {
  const router = useRouter();
  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  /* Deep-link prefill: /sim/play/join?code=PEAK24 (read window to avoid
     a Suspense boundary on useSearchParams inside the catch-all page). */
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('code');
    if (q) setCode(normalize(q));
    // autofocus first empty box
    const t = setTimeout(() => {
      const next = inputs.current.findIndex((el) => el && !el.value);
      (inputs.current[next === -1 ? 0 : next] ?? inputs.current[0])?.focus();
    }, 60);
    return () => clearTimeout(t);
  }, []);

  const setChar = useCallback((i: number, ch: string) => {
    setError('');
    setCode((prev) => {
      const arr = prev.padEnd(CODE_LEN, ' ').split('');
      arr[i] = ch;
      return arr.join('').replace(/ /g, '').slice(0, CODE_LEN);
    });
  }, []);

  const handleChange = (i: number, value: string) => {
    const v = normalize(value);
    if (!v) { setChar(i, ''); return; }
    // typed one char -> fill + advance; multi-char (autofill) -> spread
    if (v.length === 1) {
      setChar(i, v);
      inputs.current[Math.min(i + 1, CODE_LEN - 1)]?.focus();
    } else {
      const arr = code.padEnd(CODE_LEN, ' ').split('');
      for (let k = 0; k < v.length && i + k < CODE_LEN; k++) arr[i + k] = v[k];
      const joined = arr.join('').replace(/ /g, '').slice(0, CODE_LEN);
      setError('');
      setCode(joined);
      inputs.current[Math.min(i + v.length, CODE_LEN - 1)]?.focus();
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const arr = code.padEnd(CODE_LEN, ' ').split('');
      if (arr[i] && arr[i] !== ' ') {
        arr[i] = ' ';
        setCode(arr.join('').replace(/ /g, ''));
      } else if (i > 0) {
        arr[i - 1] = ' ';
        setCode(arr.join('').replace(/ /g, ''));
        inputs.current[i - 1]?.focus();
      }
      setError('');
    } else if (e.key === 'ArrowLeft' && i > 0) {
      e.preventDefault(); inputs.current[i - 1]?.focus();
    } else if (e.key === 'ArrowRight' && i < CODE_LEN - 1) {
      e.preventDefault(); inputs.current[i + 1]?.focus();
    } else if (e.key === 'Enter') {
      submit();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const v = normalize(e.clipboardData.getData('text'));
    if (!v) return;
    setError('');
    setCode(v);
    inputs.current[Math.min(v.length, CODE_LEN - 1)]?.focus();
  };

  const filled = code.length === CODE_LEN;

  const submit = () => {
    if (loading) return;
    if (!filled) {
      setError('Enter all six characters of your class code.');
      inputs.current[code.length]?.focus();
      return;
    }
    setLoading(true);
    // Simulated roster lookup — shimmer on the CTA, never a spinner.
    setTimeout(() => {
      if (VALID_CODES.includes(code)) {
        router.push('/sim/play/identity');
      } else {
        setLoading(false);
        setError("We couldn't find a class with that code. Check with your teacher and try again.");
        inputs.current[0]?.focus();
      }
    }, 900);
  };

  return (
    <GridBackground>
      <PageTransition>
        <div style={{ minHeight: '100dvh', display: 'grid', gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 0.95fr)', alignItems: 'stretch' }} className="sim-join-grid">
          {/* ── Left: dark brand panel ── */}
          <div className="sim-join-brand" style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(155deg, var(--game-dark) 0%, var(--game-teal-dark) 52%, var(--game-teal-mid) 130%)', color: '#fff', padding: '56px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <BrandTexture />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ filter: 'brightness(0) invert(1)' }}><SimLogo /></div>
            </div>
            <div style={{ position: 'relative', zIndex: 1, maxWidth: 460 }}>
              <div style={{ fontFamily: DATA, fontSize: 12.5, fontWeight: 700, letterSpacing: '1.8px', textTransform: 'uppercase', color: 'color-mix(in srgb, var(--game-cyan) 50%, #fff)' }}>Business Simulation</div>
              <h1 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 40, lineHeight: 1.12, letterSpacing: '-1px', marginTop: 14 }}>
                Make decisions.<br />See the impact.<br /><span style={{ color: 'color-mix(in srgb, var(--game-cyan) 62%, #fff)' }}>Lead your company.</span>
              </h1>
              <ul style={{ listStyle: 'none', margin: '30px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {PROMISES.map(({ icon: Icon, text }) => (
                  <li key={text} style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: DATA, fontSize: 15, color: 'rgba(255,255,255,0.88)' }}>
                    <span style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(127,212,230,0.16)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                      <Icon size={17} color="color-mix(in srgb, var(--game-cyan) 55%, #fff)" />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ position: 'relative', zIndex: 1, fontFamily: DATA, fontSize: 12.5, color: 'rgba(255,255,255,0.5)' }}>
              Cyan Global Challenge · Season 7
            </div>
          </div>

          {/* ── Right: join card ── */}
          <div style={{ display: 'grid', placeItems: 'center', padding: '48px 32px' }}>
            <div style={{ width: '100%', maxWidth: 400 }}>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 27, letterSpacing: '-0.5px', color: ink }}>Join your simulation</h2>
              <p style={{ fontFamily: DISPLAY, fontSize: 14.5, color: muted, marginTop: 7, lineHeight: 1.5 }}>
                Enter the class code your teacher shared to join this round.
              </p>

              {/* Segmented code input */}
              <label htmlFor="join-code-0" style={{ display: 'block', fontFamily: DISPLAY, fontWeight: 600, fontSize: 13, color: body, margin: '26px 0 9px' }}>
                Join code
              </label>
              <div
                role="group"
                aria-label="Six character class join code"
                aria-describedby={error ? 'join-code-error' : undefined}
                style={{ display: 'flex', gap: 9 }}
              >
                {Array.from({ length: CODE_LEN }).map((_, i) => {
                  const ch = code[i] ?? '';
                  return (
                    <input
                      key={i}
                      id={`join-code-${i}`}
                      ref={(el) => { inputs.current[i] = el; }}
                      type="text"
                      inputMode="text"
                      autoCapitalize="characters"
                      autoComplete={i === 0 ? 'one-time-code' : 'off'}
                      maxLength={i === 0 ? CODE_LEN : 1}
                      value={ch}
                      aria-label={`Character ${i + 1} of ${CODE_LEN}`}
                      aria-invalid={!!error}
                      onChange={(e) => handleChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      onPaste={handlePaste}
                      onFocus={(e) => e.target.select()}
                      className="sim-code-box"
                      style={{
                        width: '100%', aspectRatio: '1 / 1.12', minWidth: 0,
                        fontFamily: DATA, fontWeight: 700, fontSize: 22, textAlign: 'center',
                        color: ink, textTransform: 'uppercase', caretColor: cyan,
                        background: ch ? '#fff' : surfaceSoft,
                        border: `1.6px solid ${error ? negative : ch ? cyan : whisper}`,
                        borderRadius: 11, outline: 'none', transition: 'border-color .14s ease, background .14s ease',
                      }}
                    />
                  );
                })}
              </div>

              {/* Error / success line — icon + text (color never the only signal) */}
              <div aria-live="polite" style={{ minHeight: 20, marginTop: 10 }}>
                {error ? (
                  <div id="join-code-error" style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: DATA, fontSize: 12.5, color: negative }}>
                    <AlertCircle size={14} color={negative} /> {error}
                  </div>
                ) : filled ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: DATA, fontSize: 12.5, color: success }}>
                    <Check size={14} color={success} /> Code complete — press Join to continue.
                  </div>
                ) : (
                  <div style={{ fontFamily: DATA, fontSize: 12.5, color: faint }}>Six characters · letters and numbers · paste works too.</div>
                )}
              </div>

              {/* Primary CTA — shimmer on load, not a spinner */}
              <button
                onClick={submit}
                disabled={loading}
                className={loading ? 'sim-cta-load' : ''}
                style={{
                  width: '100%', marginTop: 18, fontFamily: DISPLAY, fontWeight: 700, fontSize: 15, color: '#fff',
                  background: 'var(--game-cta-gradient)', border: 'none', borderRadius: 'var(--game-cta-radius)',
                  padding: '14px 20px', cursor: loading ? 'progress' : 'pointer',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9,
                  transition: 'filter .14s ease, transform .14s ease', position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.filter = 'brightness(1.07)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
                onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {loading ? 'Joining…' : 'Join Simulation'}
              </button>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
                <span style={{ flex: 1, height: 1, background: whisper }} />
                <span style={{ fontFamily: DATA, fontSize: 12, color: faint }}>or</span>
                <span style={{ flex: 1, height: 1, background: whisper }} />
              </div>

              <OutlineButton onClick={() => router.push('/sim/play/identity')} style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9 }}>
                <GraduationCap size={17} color={tealMid} /> Log in with School Account
              </OutlineButton>

              {/* Footer — read-only sandbox */}
              <div style={{ marginTop: 26, paddingTop: 18, borderTop: `1px solid ${whisper}`, fontFamily: DATA, fontSize: 13, color: muted, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                New here?
                <button onClick={() => router.push('/sim/play?preview=1')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: DATA, fontWeight: 700, fontSize: 13, color: tealMid, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <Eye size={14} color={tealMid} /> Preview the experience
                </button>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>

      <style>{`
        .sim-code-box:focus-visible{outline:2px solid var(--game-cyan);outline-offset:2px;}
        .sim-cta-load{position:relative;}
        .sim-cta-load::after{content:'';position:absolute;inset:0;background:linear-gradient(100deg,transparent 30%,rgba(255,255,255,0.35) 50%,transparent 70%);background-size:240% 100%;animation:simCtaSweep 1.1s linear infinite;}
        @keyframes simCtaSweep{0%{background-position:140% 0}100%{background-position:-40% 0}}
        @media (max-width:860px){
          .sim-join-grid{grid-template-columns:1fr !important;}
          .sim-join-brand{display:none !important;}
        }
        @media (prefers-reduced-motion: reduce){.sim-cta-load::after{animation:none;}}
      `}</style>
    </GridBackground>
  );
}

/* Soft dotted texture for the brand panel (transform/opacity only). */
function BrandTexture() {
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle at 18% 22%, rgba(95,208,232,0.18), transparent 42%), radial-gradient(circle at 84% 78%, rgba(0,193,235,0.14), transparent 46%)' }} />
  );
}
