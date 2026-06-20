'use client';

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { RotateCcw, ChevronLeft } from 'lucide-react';
import { useDemo, resetDemo } from '../../context/DemoContext';
import { useGame } from '../../context/GameContext';
import { nextPhase, prevPhase, quarterOf, routeForPhase, TOTAL_MONTHS } from '../../lib/demo/demo-flow';
import { DemoPhase, MONTHLY_DECISION_TABS } from '../../lib/demo/demo-types';
import { Landmark } from '../PixelIcons';
import { RoundSummaryModal } from './RoundSummaryModal';

const ROUND_FLAG = 'sv-demo-round-toast';
const Q_FLAG = 'sv-demo-q-toast';

const SHELL_CSS = `
@keyframes sv-mascot-hop {
  0% { transform: translateY(0); }
  18% { transform: translateY(-8px); }
  36% { transform: translateY(0); }
  52% { transform: translateY(-5px); }
  68% { transform: translateY(0); }
  84% { transform: translateY(-2px); }
  100% { transform: translateY(0); }
}
@keyframes sv-bubble-in {
  0% { opacity: 0; transform: translate(-50%, 6px) scale(0.92); }
  12% { opacity: 1; transform: translate(-50%, 0) scale(1); }
  85% { opacity: 1; transform: translate(-50%, 0) scale(1); }
  100% { opacity: 0; transform: translate(-50%, -4px) scale(0.97); }
}
@media (prefers-reduced-motion: reduce) {
  .sv-mascot-inner { animation: none !important; }
  .sv-bubble { animation-duration: 0.01s !important; }
}
/* ── Unified Button System ─────────────────────────────────── */
/* CTA: cyan filled primary action */
.sv-btn-cta { transition: filter .15s ease, transform .12s ease, opacity .2s ease, background .2s ease; }
.sv-btn-cta:not(:disabled):hover { filter: brightness(1.07); transform: translateY(-1px); }
.sv-btn-cta:not(:disabled):active { transform: translateY(0); }
.sv-btn-cta:focus-visible { outline: 2px solid var(--game-cyan); outline-offset: 2px; }
/* Outline: bordered secondary action */
.sv-btn-outline { transition: transform .12s ease; }
.sv-btn-outline:hover { transform: translateY(-1px); }
.sv-btn-outline:active { transform: translateY(0); }
.sv-btn-outline:focus-visible { outline: 2px solid var(--game-cyan); outline-offset: 2px; }
/* Ghost: text/icon nav button */
.sv-btn-ghost { transition: color .15s ease, background .15s ease, transform .1s ease; border-radius: 8px; color: var(--game-text-secondary); background: transparent; }
.sv-btn-ghost:not(:disabled):hover { color: var(--game-text); background: rgba(0,44,51,0.05); }
.sv-btn-ghost:not(:disabled):active { transform: translateY(1px); }
/* Bank: solid-color pill action */
.sv-btn-bank { transition: filter .15s ease, transform .1s ease; }
.sv-btn-bank:hover { filter: brightness(1.14); }
.sv-btn-bank:active { transform: translateY(1px); }
.sv-shell-btn:focus-visible { outline: 2px solid var(--game-cyan); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
  .sv-btn-cta, .sv-btn-outline, .sv-btn-ghost, .sv-btn-bank { transition: none !important; }
}
`;

const F = "'Outfit', sans-serif";

const PRE_GAME: DemoPhase[] = [
  'landing', 'training', 'welcome',
  'setup-basic', 'setup-location', 'setup-capacity', 'setup-employees',
  'setup-marketing', 'setup-payment', 'setup-summary', 'setup-loading',
];

/* Routes that are reachable while in another phase (optional deep-dives). */
const PHASE_EXTRA_ROUTES: Partial<Record<DemoPhase, string[]>> = {
  'month-review': ['/demo/month/command-center'],
};

function ctaLabel(phase: DemoPhase, month: number): string {
  switch (phase) {
    case 'month-decisions': return 'Send Decisions';
    case 'month-review':
      if (month >= TOTAL_MONTHS) return 'Go to Annual Decisions';
      if (month % 3 === 0) return `Go to Quarter ${month / 3} Decisions`;
      return `Start Month ${month + 1}`;
    case 'quarter-decisions': return 'Lock Quarterly Decisions';
    case 'quarter-review': return `Start Month ${month + 1}`;
    case 'annual-decisions': return 'Submit Annual Decisions';
    case 'annual-review': return 'View Final Evaluation';
    case 'final-evaluation': return 'View Leaderboard';
    case 'leaderboard':
    case 'complete': return 'Play Again';
    default: return 'Continue';
  }
}

/* Marker label under the progress fill end. */
function markerLabel(phase: DemoPhase, month: number): string {
  switch (phase) {
    case 'quarter-decisions': case 'quarter-review': return `Q${Math.ceil(month / 3)} Review`;
    case 'annual-decisions': case 'annual-review': return 'Annual Gate';
    case 'final-evaluation': case 'leaderboard': case 'complete': return 'Final';
    default: return `Month ${month}`;
  }
}

export function DemoShell({ children }: { children: ReactNode }) {
  const { state, dispatch } = useDemo();
  const game = useGame();
  const router = useRouter();
  const pathname = usePathname();

  // Keep the GameHeader month pill in sync with the demo month.
  useEffect(() => {
    const week = (Math.max(1, state.month) - 1) * 4 + 1;
    if (game.state.currentWeek !== week) game.setCurrentWeek(week);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.month]);

  // Route guard — deep links snap back to the current phase route.
  useEffect(() => {
    if (!pathname) return;
    const expected = routeForPhase(state.phase);
    const extras = PHASE_EXTRA_ROUTES[state.phase] ?? [];
    if (pathname !== expected && !extras.includes(pathname)) {
      router.replace(expected);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, state.phase]);

  const inGame = !PRE_GAME.includes(state.phase);
  const prev = prevPhase(state);
  // Send Decisions is gated until every monthly-decision tab is locked.
  const allTabsLocked = MONTHLY_DECISION_TABS.every((t) => state.lockedTabs.includes(t));
  const ctaDisabled = state.phase === 'month-decisions' && !allTabsLocked;

  // Progress: fill reaches the month currently in play (capped at 12).
  const progressMonth = Math.min(TOTAL_MONTHS, Math.max(1, state.month));
  const donePhase = state.phase === 'final-evaluation' || state.phase === 'leaderboard' || state.phase === 'complete';
  const pct = donePhase ? 100 : (progressMonth / TOTAL_MONTHS) * 100;

  // ── Round-completion juice: mascot hop, speech bubble, summary modal ──
  const [hop, setHop] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const prevPctRef = useRef<number | null>(null);

  // Hop whenever the mascot travels to a new position.
  useEffect(() => {
    const moved = prevPctRef.current !== null && prevPctRef.current !== pct;
    prevPctRef.current = pct;
    if (moved) {
      setHop(true);
      const t = setTimeout(() => setHop(false), 1300);
      return () => clearTimeout(t);
    }
  }, [pct]);

  const lastResult = state.history[state.history.length - 1]?.result;
  const lastDecisions = state.history[state.history.length - 1]?.decisions;
  const prevResult = state.history[state.history.length - 2]?.result;

  function popBubble(text: string) {
    setBubble(text);
    window.setTimeout(() => setBubble(null), 5000);
  }

  // Month submitted -> celebration modal once, then bubble on dismiss.
  // Gate on pathname so the flag is consumed by the freshly mounted review
  // page, not by the outgoing shell while the route push is still in flight.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (state.phase === 'month-review' && pathname === '/demo/month/review' && lastResult
        && sessionStorage.getItem(ROUND_FLAG) === String(lastResult.month)) {
      sessionStorage.removeItem(ROUND_FLAG);
      setShowSummary(true);
    }
    if (state.phase === 'quarter-review' && pathname === '/demo/quarter/review' && sessionStorage.getItem(Q_FLAG)) {
      const q = sessionStorage.getItem(Q_FLAG);
      sessionStorage.removeItem(Q_FLAG);
      popBubble(`Quarter ${q} initiatives locked in!`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, pathname]);

  function closeSummary() {
    setShowSummary(false);
    if (lastResult) {
      popBubble(lastResult.netProfit >= 0
        ? `Month ${lastResult.month}: +$${Math.round(lastResult.netProfit / 1000)}k profit!`
        : `Month ${lastResult.month}: -$${Math.round(-lastResult.netProfit / 1000)}k burn`);
    }
  }

  function handlePrimary() {
    // Monthly decisions can only be sent once every tab is locked.
    if (ctaDisabled) return;
    if (state.phase === 'leaderboard' || state.phase === 'complete') {
      resetDemo();
      dispatch({ type: 'RESET' });
      router.push('/demo');
      return;
    }
    const next = nextPhase(state);
    if (state.phase === 'month-decisions') {
      if (typeof window !== 'undefined') sessionStorage.setItem(ROUND_FLAG, String(state.month));
      dispatch({ type: 'SUBMIT_MONTH' });
    }
    else if (state.phase === 'quarter-decisions') {
      if (typeof window !== 'undefined') sessionStorage.setItem(Q_FLAG, String(quarterOf(state.month)));
      dispatch({ type: 'SUBMIT_QUARTER' });
    }
    else if (state.phase === 'annual-decisions') dispatch({ type: 'SUBMIT_ANNUAL' });
    else dispatch({ type: 'ADVANCE' });
    router.push(routeForPhase(next.phase));
  }

  function handleBack() {
    if (!prev) return;
    dispatch({ type: 'BACK' });
    router.push(routeForPhase(prev.phase));
  }

  function handleReset() {
    if (typeof window !== 'undefined' && !window.confirm('Reset the demo game? All progress will be lost.')) return;
    resetDemo();
    dispatch({ type: 'RESET' });
    router.push('/demo');
  }

  function handleBank() {
    // MonthlyDecisions listens for this and switches to its Banking tab.
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('sv-demo-banking'));
  }

  return (
    <div style={{ paddingBottom: inGame ? 84 : 0 }}>
      {children}

      {inGame && (
        <div style={{
          position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 50,
          background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
          borderTop: '1px solid var(--sv-border)',
        }}>
          <style>{SHELL_CSS}</style>
          <div style={{
            maxWidth: 'var(--max-w-page)', margin: '0 auto', padding: '10px 24px',
            display: 'flex', alignItems: 'center', gap: 28,
          }}>
            {/* ── Progress zone ───────────────────────────────────────── */}
            <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
              {/* Mascot standing at the fill end (cropped per Figma frame) */}
              <div style={{
                position: 'absolute', left: `${pct}%`, bottom: 22, transform: 'translateX(-60%)',
                width: 52, height: 83, pointerEvents: 'none', zIndex: 1,
                transition: 'left .45s cubic-bezier(.22,1,.36,1)',
              }}>
                <div
                  className="sv-mascot-inner"
                  style={{
                    width: '100%', height: '100%', overflow: 'hidden', position: 'relative',
                    animation: hop ? 'sv-mascot-hop 1.1s ease-out' : 'none',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/demo/progress-mascot.png"
                    alt=""
                    style={{ position: 'absolute', width: '232.48%', height: '109.52%', left: '-61.52%', top: '-9.52%', maxWidth: 'none' }}
                  />
                </div>
              </div>

              {/* Speech bubble — one-line round verdict above the mascot */}
              {bubble && (
                <div
                  className="sv-bubble"
                  style={{
                    position: 'absolute', left: `${pct}%`, bottom: 108, transform: 'translateX(-50%)',
                    background: '#fff', border: '1.4px solid var(--sv-border)', borderRadius: 12,
                    padding: '7px 13px', fontFamily: F, fontWeight: 700, fontSize: 12.5,
                    color: 'var(--game-text)', whiteSpace: 'nowrap', zIndex: 2, pointerEvents: 'none',
                    boxShadow: '0 8px 22px rgba(0,44,51,0.16)',
                    animation: 'sv-bubble-in 5s ease forwards',
                  }}
                >
                  {bubble}
                  <span style={{
                    position: 'absolute', left: '50%', bottom: -5, transform: 'translateX(-50%) rotate(45deg)',
                    width: 9, height: 9, background: '#fff',
                    borderRight: '1.4px solid var(--sv-border)', borderBottom: '1.4px solid var(--sv-border)',
                  }} />
                </div>
              )}

              {/* Track */}
              <div style={{
                height: 18, borderRadius: 15, background: 'rgba(255,255,255,0.6)',
                border: '1.4px solid white', display: 'flex', alignItems: 'center',
                padding: '0 3px', position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  width: `${pct}%`, height: 11, borderRadius: 15,
                  background: 'linear-gradient(90deg, #4EB4C9 0%, #05687C 100%)',
                  border: '1.4px solid #4EB4C9',
                  transition: 'width .45s cubic-bezier(.22,1,.36,1)',
                }} />
                {/* Month segment ticks */}
                {Array.from({ length: TOTAL_MONTHS - 1 }, (_, i) => (
                  <span key={i} style={{
                    position: 'absolute', left: `${((i + 1) / TOTAL_MONTHS) * 100}%`, top: '50%',
                    transform: 'translate(-50%, -50%)', width: 2, height: 11, borderRadius: 1,
                    background: 'rgba(255,255,255,0.85)',
                  }} />
                ))}
              </div>

              {/* Labels */}
              <div style={{ position: 'relative', height: 16, marginTop: 4 }}>
                <span style={{ position: 'absolute', left: 0, fontFamily: F, fontWeight: 500, fontSize: 12, color: 'var(--game-text-secondary)' }}>
                  Start
                </span>
                {pct > 4 && (
                  <span style={{
                    position: 'absolute', left: `${pct}%`, transform: 'translateX(-60%)',
                    fontFamily: F, fontWeight: 500, fontSize: 12, color: 'var(--game-text-secondary)', whiteSpace: 'nowrap',
                  }}>
                    {markerLabel(state.phase, state.month)}
                  </span>
                )}
              </div>
            </div>

            {/* ── Actions ─────────────────────────────────────────────── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              {/* Back */}
              <button
                onClick={handleBack}
                disabled={!prev}
                className="sv-shell-btn sv-btn-ghost"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: F, fontWeight: 600, fontSize: 12.5,
                  border: 'none',
                  cursor: prev ? 'pointer' : 'default', opacity: prev ? 1 : 0.4, padding: '8px 8px',
                }}
              >
                <ChevronLeft size={14} />Back
              </button>

              {/* Reset */}
              <button
                onClick={handleReset}
                title="Reset demo"
                className="sv-shell-btn sv-btn-ghost"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: F, fontWeight: 600, fontSize: 12.5,
                  border: 'none', cursor: 'pointer',
                  padding: '8px 8px',
                }}
              >
                <RotateCcw size={12} />Reset
              </button>

              {/* Visit the Bank — banking is a monthly decision */}
              {state.phase === 'month-decisions' && (
                <button
                  onClick={handleBank}
                  className="sv-shell-btn sv-btn-bank"
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '9px 14px 9px 16px', borderRadius: 31, cursor: 'pointer',
                    border: '0.7px solid #616161',
                    background: 'radial-gradient(120% 160% at 50% -40%, #575757 0%, #3E3E3E 50%, #262626 100%)',
                    fontFamily: F, fontWeight: 600, fontSize: 12, color: '#fff', whiteSpace: 'nowrap',
                  }}
                >
                  Visit the Bank
                  <span style={{ width: 21, height: 21, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Landmark size={12} color="#fff" />
                  </span>
                </button>
              )}

              {/* Primary CTA (GameButton style) */}
              <button
                onClick={handlePrimary}
                disabled={ctaDisabled}
                title={ctaDisabled ? 'Lock all decision tabs first' : undefined}
                className="sv-shell-btn sv-btn-cta"
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '9px 14px 9px 16px', borderRadius: 'var(--game-cta-radius)', border: 'none',
                  cursor: ctaDisabled ? 'not-allowed' : 'pointer',
                  background: ctaDisabled ? 'var(--sv-border)' : 'var(--game-cta-gradient)',
                  fontFamily: F, fontWeight: 600, fontSize: 12, color: '#fff', whiteSpace: 'nowrap',
                  opacity: ctaDisabled ? 0.55 : 1,
                }}
              >
                {ctaLabel(state.phase, state.month)}
                <span style={{ width: 21, height: 21, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="11" height="11" viewBox="0 0 12 10" fill="none">
                    <path d="M1 5H11M11 5L7 1M11 5L7 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showSummary && lastResult && (
        <RoundSummaryModal
          month={lastResult.month}
          result={lastResult}
          decisions={lastDecisions}
          prevResult={prevResult}
          quarterAhead={lastResult.month < TOTAL_MONTHS && lastResult.month % 3 === 0 ? lastResult.month / 3 : null}
          onClose={closeSummary}
        />
      )}
    </div>
  );
}
