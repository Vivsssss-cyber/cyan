'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import {
  ShoppingCart, Receipt, Megaphone, Users,
  TrendingUp, TrendingDown, AlertTriangle, Wallet, RefreshCw,
} from '../PixelIcons';
import { MonthResult, MonthlyDecisionsInput } from '../../lib/demo/demo-types';
import { GridBackground } from '../GridBackground';
import { GameHeader } from '../GameHeader';

const F = "'Outfit', sans-serif";

/* Count-up: 0 → value, ease-out, ~750ms. Respects prefers-reduced-motion. */
function useCountUp(target: number, start: boolean) {
  const [value, setValue] = useState(0);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    if (!start) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }
    const t0 = performance.now();
    const dur = 750;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, start]);
  return value;
}

function money(n: number) {
  const sign = n < 0 ? '-' : '';
  return `${sign}$${Math.abs(Math.round(n)).toLocaleString('en-US')}`;
}

export function roundVerdict(result: MonthResult): { title: string; line: string; positive: boolean } {
  if (result.netProfit >= 0) {
    return { title: 'Profitable month — nice.', line: `You cleared ${money(result.netProfit)} after all costs.`, positive: true };
  }
  if (result.netProfit > -15000) {
    return { title: 'Almost there.', line: `${money(-result.netProfit)} burned — footfall is building, margins are close.`, positive: false };
  }
  return { title: 'Still building.', line: `${money(-result.netProfit)} burned this month. Watch the runway.`, positive: false };
}

const ordinal = (n: number) => {
  if (n === 1) return 'first';
  if (n === 2) return 'second';
  if (n === 3) return 'third';
  return `${n}th`;
};

/* ── derive the two columns from sim state ──────────────────────────────── */

interface RecapItem { icon: React.ReactNode; tint: string; title: string; desc: string }

function decisionItems(d: MonthlyDecisionsInput | undefined): RecapItem[] {
  if (!d) return [];
  const productIds = Object.keys(d.purchases);
  const totalUnits = productIds.reduce((s, id) => s + (d.purchases[id]?.qty ?? 0), 0);
  const priceVals = Object.values(d.prices);
  const avgPrice = priceVals.length ? priceVals.reduce((s, p) => s + p, 0) / priceVals.length : 0;
  const marketing = d.marketingSpend.value + d.marketingSpend.balanced + d.marketingSpend.premium;
  const audience = d.targetAudience === 'all' ? 'all segments' : `${d.targetAudience} buyers`;
  const staffTotal = Object.values(d.staff).reduce((s, n) => s + n, 0);

  return [
    {
      icon: <ShoppingCart size={18} />, tint: 'var(--game-teal-mid)',
      title: 'Supply', desc: `Ordered ${totalUnits.toLocaleString('en-US')} units across ${productIds.length} products`,
    },
    {
      icon: <Receipt size={18} />, tint: 'var(--game-teal-mid)',
      title: 'Pricing', desc: `Avg menu price $${avgPrice.toFixed(2)}`,
    },
    {
      icon: <Megaphone size={18} />, tint: 'var(--game-teal-mid)',
      title: 'Marketing', desc: `Spent ${money(marketing)} targeting ${audience}`,
    },
    {
      icon: <Users size={18} />, tint: 'var(--game-teal-mid)',
      title: 'Staffing', desc: `Team of ${staffTotal} ${d.banking !== 'hold' ? '· banking action taken' : ''}`.trim(),
    },
  ];
}

function outcomeItems(result: MonthResult, prev?: MonthResult): RecapItem[] {
  const revUp = !prev || result.revenue >= prev.revenue;
  const revDelta = prev ? result.revenue - prev.revenue : result.revenue;

  const totalUnits = result.unitsSold + result.unitsUnsold;
  const wastePct = totalUnits > 0 ? Math.round(((result.unitsExpired + result.phantomLoss) / totalUnits) * 100) : 0;
  const wasteHigh = wastePct >= 12;

  const retUp = !prev || result.retentionPct >= (prev?.retentionPct ?? 0);
  const retDelta = prev ? result.retentionPct - prev.retentionPct : 0;

  const cashTight = result.runwayMonths < 6;

  return [
    {
      icon: revUp ? <TrendingUp size={18} /> : <TrendingDown size={18} />,
      tint: revUp ? 'var(--game-positive)' : 'var(--game-negative)',
      title: revUp ? 'Revenue Up' : 'Revenue Down',
      desc: `${prev ? (revDelta >= 0 ? '+' : '−') : ''}${money(Math.abs(revDelta))} ${prev ? 'vs last month' : 'this month'}`,
    },
    {
      icon: <AlertTriangle size={18} />,
      tint: wasteHigh ? 'var(--game-negative)' : 'var(--game-warning)',
      title: wasteHigh ? 'Waste High' : 'Waste Low',
      desc: `${wastePct}% spoilage rate${wasteHigh ? ' — reduce orders' : ' — well managed'}`,
    },
    {
      icon: <Wallet size={18} />,
      tint: cashTight ? 'var(--game-warning)' : 'var(--game-teal-mid)',
      title: cashTight ? 'Cash Tight' : 'Cash Stable',
      desc: `Balance: ${money(result.closingCash)}${cashTight ? ' — watch runway' : ' — on track'}`,
    },
    {
      icon: <RefreshCw size={18} />,
      tint: retUp ? 'var(--game-positive)' : 'var(--game-negative)',
      title: retUp ? 'Retention Improved' : 'Retention Dropped',
      desc: `${result.retentionPct}% returning customers${prev ? ` (${retDelta >= 0 ? '+' : ''}${retDelta}%)` : ''}`,
    },
  ];
}

/* ── recap card ─────────────────────────────────────────────────────────── */

function RecapCard({ item, from, delay }: { item: RecapItem; from: number; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: from }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex', alignItems: 'center', gap: 13, padding: 14,
        background: 'var(--game-surface)', border: '1.4px solid white', borderRadius: 16,
        boxShadow: 'var(--shadow-elev-1)',
      }}
    >
      <span style={{
        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
        background: `color-mix(in srgb, ${item.tint} 12%, #fff)`, color: item.tint,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {item.icon}
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: 'var(--game-text)' }}>{item.title}</div>
        <div style={{ fontFamily: F, fontWeight: 400, fontSize: 11.5, color: 'var(--game-text-secondary)', marginTop: 2, lineHeight: 1.4 }}>{item.desc}</div>
      </div>
    </motion.div>
  );
}

/* ── flow chip (count-up money in/out of the business) ──────────────────── */

function FlowChip({ amount, positive, start }: { amount: number; positive: boolean; start: boolean }) {
  const v = useCountUp(amount, start);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 999,
      background: positive ? 'color-mix(in srgb, var(--game-positive) 12%, #fff)' : 'color-mix(in srgb, var(--game-negative) 12%, #fff)',
      border: `1px solid ${positive ? 'color-mix(in srgb, var(--game-positive) 30%, transparent)' : 'color-mix(in srgb, var(--game-negative) 30%, transparent)'}`,
      fontFamily: F, fontWeight: 800, fontSize: 14, fontVariantNumeric: 'tabular-nums',
      color: positive ? 'var(--game-positive)' : 'var(--game-negative)', whiteSpace: 'nowrap',
    }}>
      {positive ? '+' : '−'}{money(v).replace('-', '')}
    </span>
  );
}

export function RoundSummaryModal({
  month,
  result,
  decisions,
  prevResult,
  quarterAhead,
  onClose,
}: {
  month: number;
  result: MonthResult;
  decisions?: MonthlyDecisionsInput;
  prevResult?: MonthResult;
  quarterAhead: number | null;
  onClose: () => void;
}) {
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 450);
    return () => clearTimeout(t);
  }, []);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const decisionsList = decisionItems(decisions);
  const outcomes = outcomeItems(result, prevResult);
  const outflow = result.cogs + result.opex + result.marketing;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{ position: 'fixed', inset: 0, zIndex: 80, overflowY: 'auto' }}
        role="dialog"
        aria-modal="true"
        aria-label={`Month ${month} complete`}
      >
        <GridBackground className="flex flex-col min-h-screen">
          <GameHeader />

          <div style={{ maxWidth: 'var(--max-w-page)', width: '100%', margin: '0 auto', padding: '8px 24px 40px', flex: 1 }}>
            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{ textAlign: 'center', marginTop: 8, marginBottom: 28 }}
            >
              <h1 style={{ fontFamily: F, fontWeight: 800, fontSize: 30, letterSpacing: '-0.6px', color: 'var(--game-text)' }}>
                Congratulations — you completed your {ordinal(month)} month
              </h1>
              <p style={{ fontFamily: F, fontWeight: 400, fontSize: 14, color: 'var(--game-text-secondary)', marginTop: 6 }}>
                Here&apos;s how your decisions played out across Month {month}.
              </p>
            </motion.div>

            {/* Decisions · Business · Outcomes */}
            <div style={{ display: 'grid', gridTemplateColumns: '280px minmax(0,1fr) 280px', gap: 24, alignItems: 'start' }}>
              {/* LEFT — Your Decisions */}
              <div>
                <div style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: 'var(--game-text)', marginBottom: 14 }}>Your Decisions</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {decisionsList.map((it, i) => (
                    <RecapCard key={it.title} item={it} from={-24} delay={0.1 + i * 0.08} />
                  ))}
                </div>
              </div>

              {/* CENTER — the business + money flow */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, width: '100%' }}>
                  {/* inflow */}
                  <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}
                  >
                    <FlowChip amount={result.revenue} positive start={started} />
                    <svg width="74" height="14" viewBox="0 0 74 14" fill="none">
                      <path d="M0 7H66M66 7L60 2M66 7L60 12" stroke="var(--game-positive)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>

                  {/* café */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 240, damping: 22, delay: 0.2 }}
                    style={{ flex: 1, maxWidth: 440, display: 'flex', justifyContent: 'center' }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <motion.img
                      src="/demo/cafe-scene.png"
                      alt="Your café"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ width: '100%', maxWidth: 420, height: 'auto', filter: 'drop-shadow(0 16px 30px rgba(0,44,51,0.14))' }}
                    />
                  </motion.div>

                  {/* outflow */}
                  <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}
                  >
                    <FlowChip amount={outflow} positive={false} start={started} />
                    <svg width="74" height="14" viewBox="0 0 74 14" fill="none">
                      <path d="M0 7H66M66 7L60 2M66 7L60 12" stroke="var(--game-negative)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                </div>

                {/* net verdict */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                  style={{ fontFamily: F, fontWeight: 600, fontSize: 13, color: 'var(--game-text-secondary)', marginTop: 18, textAlign: 'center' }}
                >
                  Net this month{' '}
                  <span style={{ fontWeight: 800, color: result.netProfit >= 0 ? 'var(--game-positive)' : 'var(--game-negative)' }}>
                    {result.netProfit >= 0 ? '+' : '−'}{money(result.netProfit).replace('-', '')}
                  </span>
                  {quarterAhead && <span> · Quarter {quarterAhead} checkpoint ahead</span>}
                </motion.div>

                {/* CTA */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  onClick={onClose}
                  autoFocus
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9, marginTop: 22,
                    padding: '13px 26px', borderRadius: 'var(--game-cta-radius)', border: 'none', cursor: 'pointer',
                    background: 'var(--game-cta-gradient)', color: '#fff', fontFamily: F, fontWeight: 600, fontSize: 14.5,
                    boxShadow: '0 6px 16px rgba(0,144,173,0.3)',
                  }}
                >
                  View Monthly Dashboard
                  <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ArrowRight size={14} />
                  </span>
                </motion.button>
              </div>

              {/* RIGHT — What Happened */}
              <div>
                <div style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: 'var(--game-text)', marginBottom: 14, textAlign: 'right' }}>What Happened</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {outcomes.map((it, i) => (
                    <RecapCard key={it.title} item={it} from={24} delay={0.1 + i * 0.08} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </GridBackground>
      </motion.div>
    </AnimatePresence>
  );
}
