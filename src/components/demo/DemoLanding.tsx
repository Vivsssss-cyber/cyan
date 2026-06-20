'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, BarChart3, Landmark, Trophy, Play, RotateCcw } from 'lucide-react';
import { GridBackground } from '../GridBackground';
import { PageTransition } from '../PageTransition';
import { GameHeader } from '../GameHeader';
import { useDemo, resetDemo } from '../../context/DemoContext';
import { routeForPhase, progressLabel, TOTAL_MONTHS } from '../../lib/demo/demo-flow';

const F = "'Outfit', sans-serif";

const LANDING_CSS = `
.sv-land-card { transition: transform .2s cubic-bezier(.22,1,.36,1); }
.sv-land-card:hover { transform: translateY(-2px); }
@media (prefers-reduced-motion: reduce) {
  .sv-land-card { transition: none !important; }
}
`;

const CARD: React.CSSProperties = {
  background: 'rgba(255,255,255,0.6)', border: '1.4px solid white', borderRadius: 16, padding: 20,
};

const STAGES = [
  { Icon: CalendarDays, title: 'Monthly decisions', desc: 'Buy goods, pick supplier tiers, set prices, spend on marketing, manage staff — then submit the month and read the results.' },
  { Icon: BarChart3, title: 'Quarterly checkpoints', desc: 'Every 3 months, invest in the business engine: people, training, R&D, suppliers, acquisition, operations.' },
  { Icon: Landmark, title: 'Annual gate', desc: 'At month 12: extend your footprint, swap products, and decide whether to take VC money — at the cost of ownership.' },
  { Icon: Trophy, title: 'Final evaluation', desc: 'A DCF-style valuation converts your year of operations into company value, owner value, and a leaderboard rank.' },
];

export function DemoLanding() {
  const { state, dispatch } = useDemo();
  const router = useRouter();

  const hasProgress = state.phase !== 'landing' || state.history.length > 0;

  function startNew() {
    resetDemo();
    dispatch({ type: 'START_GAME' });
    router.push(routeForPhase('training'));
  }

  function resume() {
    router.push(routeForPhase(state.phase === 'landing' ? 'training' : state.phase));
  }

  return (
    <GridBackground>
      <style>{LANDING_CSS}</style>
      <PageTransition>
        <GameHeader />
        <div style={{ maxWidth: 'var(--max-w-page)', margin: '0 auto', padding: '24px 24px 64px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: 20, alignItems: 'start' }}>
            {/* Left — intro + actions */}
            <div style={{ ...CARD, padding: 32 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--cyan-tint)', color: 'var(--game-teal-mid)',
                borderRadius: 999, padding: '5px 12px', fontFamily: F, fontWeight: 700, fontSize: 11.5, letterSpacing: '0.6px', textTransform: 'uppercase',
              }}>
                Startup Valley · Year 1
              </span>
              <h1 style={{ fontFamily: F, fontWeight: 800, fontSize: 34, letterSpacing: '-0.7px', color: 'var(--game-text)', marginTop: 14, lineHeight: 1.15 }}>
                Run a retail business<br />for {TOTAL_MONTHS} months.
              </h1>
              <p style={{ fontFamily: F, fontWeight: 400, fontSize: 15, color: 'var(--game-text-secondary)', marginTop: 12, maxWidth: 480, lineHeight: 1.55 }}>
                Startup Valley is a business system, not a point-scoring game. Monthly operating decisions
                compound into quarterly patterns and an annual valuation that has to feel earned.
                Set up your business, survive the early burn, and convert operations into company value.
              </p>

              <div style={{ display: 'flex', gap: 12, marginTop: 28, maxWidth: 460 }}>
                <button onClick={startNew} className="sv-btn-cta" style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '13px 22px', borderRadius: 'var(--game-cta-radius)', border: 'none', cursor: 'pointer',
                  background: 'var(--game-cta-gradient)',
                  fontFamily: F, fontWeight: 600, fontSize: 15, color: '#fff',
                }}>
                  <Play size={15} />{hasProgress ? 'Start New Game' : 'Start Demo'}
                </button>
                {hasProgress && (
                  <button onClick={resume} className="sv-btn-outline" style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '13px 22px', borderRadius: 'var(--game-cta-radius)', border: '1.4px solid var(--sv-border)', cursor: 'pointer',
                    background: '#fff', fontFamily: F, fontWeight: 600, fontSize: 15, color: 'var(--game-text)',
                  }}>
                    <RotateCcw size={15} />Resume — {progressLabel(state)}
                  </button>
                )}
              </div>
            </div>

            {/* Right — cadence */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {STAGES.map(({ Icon, title, desc }, i) => (
                <div key={title} className="sv-land-card" style={{ ...CARD, position: 'relative', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--cyan-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} color="var(--game-teal-mid)" />
                  </span>
                  <div style={{ paddingRight: 24 }}>
                    <div style={{ fontFamily: F, fontWeight: 700, fontSize: 14.5, color: 'var(--game-text)' }}>{title}</div>
                    <div style={{ fontFamily: F, fontWeight: 400, fontSize: 12.5, color: 'var(--game-text-secondary)', marginTop: 3, lineHeight: 1.5 }}>{desc}</div>
                  </div>
                  <span style={{
                    position: 'absolute', top: 14, right: 16, fontFamily: F, fontWeight: 800, fontSize: 13,
                    letterSpacing: '0.5px', color: 'var(--game-text-muted)', fontVariantNumeric: 'tabular-nums',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageTransition>
    </GridBackground>
  );
}
