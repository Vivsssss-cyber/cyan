'use client';

import React, { useState } from 'react';
import { GridBackground } from './GridBackground';
import { PageTransition } from './PageTransition';
import { GameButton } from './GameButton';
import { useAppNavigate } from '../lib/use-app-navigate';
import {
  Star, Users, ThumbsUp,
  Check, Award, AlertTriangle, Package,
  ArrowUpRight, ArrowDownRight,
  Clock, Copy,
} from './PixelIcons';
import type { PixelIconProps } from './PixelIcons';

// ─── Constants ────────────────────────────────────────────────────────────────

const F = "'Outfit', sans-serif";

// ─── Data ─────────────────────────────────────────────────────────────────────

const impactKPIs = [
  {
    label: 'Product Quality',
    value: '+15%',
    delta: '+15%',
    context: 'vs last week',
    positive: true,
    Icon: Star,
  },
  {
    label: 'Team Health',
    value: '-5%',
    delta: '-5%',
    context: 'morale dropped',
    positive: false,
    Icon: Users,
  },
  {
    label: 'Stakeholder Satisfaction',
    value: '-5%',
    delta: '-5%',
    context: 'needs attention',
    positive: false,
    Icon: ThumbsUp,
  },
] as const;

const throughputMetrics = [
  {
    label: 'Tasks Completed',
    value: '8',
    Icon: Check,
    sentiment: 'positive' as const,
  },
  {
    label: 'Defects Fixed',
    value: '136',
    Icon: Award,
    sentiment: 'neutral' as const,
  },
  {
    label: 'Defects Created',
    value: '8',
    Icon: AlertTriangle,
    sentiment: 'negative' as const,
  },
  {
    label: 'Features Shipped',
    value: '12',
    Icon: Package,
    sentiment: 'positive' as const,
  },
] as const;

// ─── Copy text ───────────────────────────────────────────────────────────────

const SUMMARY_TEXT = `Decisions Summary — Week 12
Impact Overview:
  Product Quality: +15% (vs last week)
  Team Health: -5% (morale dropped)
  Stakeholder Satisfaction: -5% (needs attention)

Weekly Throughput:
  Tasks Completed: 8
  Defects Fixed: 136
  Defects Created: 8
  Features Shipped: 12`;

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionLabel({ tag, title }: { tag: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
      <span
        style={{
          fontFamily: F,
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase' as const,
          color: 'var(--game-teal-mid)',
          background: 'var(--game-cyan-tint)',
          padding: '3px 10px',
          borderRadius: 'var(--radius-sm)',
        }}
      >
        {tag}
      </span>
      <span
        style={{
          fontFamily: F,
          fontSize: '15px',
          fontWeight: 700,
          color: 'var(--game-text)',
        }}
      >
        {title}
      </span>
    </div>
  );
}

function IconChip({
  Icon,
  bg,
  color,
  size = 36,
  iconSize = 16,
}: {
  Icon: React.ComponentType<PixelIconProps>;
  bg: string;
  color: string;
  size?: number;
  iconSize?: number;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 'var(--radius-lg)',
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Icon size={iconSize} color={color} />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function DecisionsSummary() {
  const navigate = useAppNavigate();
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(SUMMARY_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <GridBackground>
      <PageTransition>
        <div style={{ minHeight: '100dvh', padding: '32px 24px 96px', fontFamily: F }}>
          <div style={{ maxWidth: 'var(--max-w-page)', margin: '0 auto' }}>

            {/* ── Page Header ─────────────────────────────────── */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: 32,
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: F,
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--game-teal-mid)',
                    margin: '0 0 4px',
                  }}
                >
                  End of Week
                </p>
                <h1
                  style={{
                    fontFamily: F,
                    fontSize: '32px',
                    fontWeight: 700,
                    color: 'var(--foreground)',
                    letterSpacing: '-0.32px',
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  Decisions Summary
                </h1>
              </div>

              {/* Right: copy button + week pill */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 4 }}>
                {/* Copy button */}
                <button
                  onClick={handleCopy}
                  title="Copy summary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: copied
                      ? 'rgba(21,97,98,0.08)'
                      : 'var(--game-surface)',
                    border: copied
                      ? '1px solid rgba(21,97,98,0.2)'
                      : '1px solid var(--border)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '7px 14px',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                    fontFamily: F,
                  }}
                >
                  {copied
                    ? <Check size={13} color="var(--game-positive)" />
                    : <Copy size={13} color="var(--game-text-secondary)" />
                  }
                  <span
                    style={{
                      fontFamily: F,
                      fontSize: '12px',
                      fontWeight: 600,
                      color: copied ? 'var(--game-positive)' : 'var(--game-text-secondary)',
                    }}
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </span>
                </button>

                {/* Week pill — GameHeader style */}
                <div
                  style={{
                    background: 'rgba(255,255,255,0.5)',
                    border: '1px solid rgba(221,223,225,0.6)',
                    borderRadius: 'var(--radius-pill)',
                    padding: 5,
                  }}
                >
                  <div
                    style={{
                      background: 'var(--game-surface-solid)',
                      border: '1px solid white',
                      borderRadius: 'var(--radius-pill)',
                      padding: '5px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      boxShadow: 'var(--shadow-elev-2)',
                    }}
                  >
                    {/* green dot */}
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: '#22C55E',
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: F,
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--game-text)',
                      }}
                    >
                      Week 12
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Impact KPI Cards ─────────────────────────────── */}
            <SectionLabel tag="Impact Overview" title="This Week's Outcomes" />

            {/* Asymmetric: hero (positive) wider, two negatives narrower */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.4fr 1fr 1fr',
                gap: 14,
                marginBottom: 32,
              }}
            >
              {impactKPIs.map((kpi, i) => {
                const DeltaIcon = kpi.positive ? ArrowUpRight : ArrowDownRight;
                const accentColor = kpi.positive
                  ? 'var(--game-positive)'
                  : 'var(--game-negative)';
                const iconBg = kpi.positive
                  ? 'rgba(21,97,98,0.10)'
                  : 'rgba(198,82,82,0.10)';
                const cardWash = kpi.positive
                  ? 'rgba(21,97,98,0.03)'
                  : 'rgba(198,82,82,0.03)';

                return (
                  <div
                    key={kpi.label}
                    style={{
                      background: 'var(--game-surface)',
                      border: 'var(--game-card-border)',
                      borderLeft: `4px solid ${accentColor}`,
                      borderRadius: 'var(--radius-2xl)',
                      padding: '20px',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-elev-1)',
                    }}
                  >
                    {/* tinted wash */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: cardWash,
                        pointerEvents: 'none',
                      }}
                    />

                    {/* Icon + label row */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 12,
                        position: 'relative',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <IconChip
                          Icon={kpi.Icon}
                          bg={iconBg}
                          color={accentColor}
                          size={34}
                          iconSize={16}
                        />
                        <span
                          style={{
                            fontFamily: F,
                            fontSize: '12px',
                            fontWeight: 600,
                            color: 'var(--game-text-secondary)',
                            letterSpacing: '0.01em',
                          }}
                        >
                          {kpi.label}
                        </span>
                      </div>

                      {/* Delta pill — ArrowUpRight/Down + colored text */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                          background: kpi.positive
                            ? 'rgba(21,97,98,0.08)'
                            : 'rgba(198,82,82,0.08)',
                          borderRadius: 'var(--radius-pill)',
                          padding: '3px 8px',
                        }}
                      >
                        <DeltaIcon size={11} color={accentColor} />
                        <span
                          style={{
                            fontFamily: F,
                            fontSize: '10px',
                            fontWeight: 600,
                            color: accentColor,
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {kpi.delta}
                        </span>
                      </div>
                    </div>

                    {/* KPI value — 26px ribbon size for standard, 32px hero */}
                    <div
                      style={{
                        fontFamily: F,
                        fontSize: i === 0 ? '40px' : '32px',
                        fontWeight: 700,
                        fontVariantNumeric: 'tabular-nums',
                        color: accentColor,
                        letterSpacing: '-0.02em',
                        lineHeight: 1,
                        position: 'relative',
                      }}
                    >
                      {kpi.value}
                    </div>

                    {/* Context sub-label */}
                    <p
                      style={{
                        fontFamily: F,
                        fontSize: '11px',
                        fontWeight: 500,
                        color: 'var(--game-text-muted)',
                        margin: '6px 0 0',
                        position: 'relative',
                      }}
                    >
                      {kpi.context}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* ── Pulse Strip — Weekly Throughput ──────────────── */}
            <SectionLabel tag="Weekly Throughput" title="Sprint Metrics" />

            {/* 4-card pulse strip — auto-fit, never equal 3-col */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: 12,
                marginBottom: 40,
              }}
            >
              {throughputMetrics.map((m) => {
                const valueColor =
                  m.sentiment === 'positive'
                    ? 'var(--game-positive)'
                    : m.sentiment === 'negative'
                    ? 'var(--game-negative)'
                    : 'var(--game-teal-mid)';

                const iconColor =
                  m.sentiment === 'positive'
                    ? 'var(--game-positive)'
                    : m.sentiment === 'negative'
                    ? 'var(--game-negative)'
                    : 'var(--game-teal-mid)';

                const iconBg =
                  m.sentiment === 'positive'
                    ? 'rgba(21,97,98,0.10)'
                    : m.sentiment === 'negative'
                    ? 'rgba(198,82,82,0.10)'
                    : 'rgba(0,110,133,0.10)';

                const DeltaIcon =
                  m.sentiment === 'positive'
                    ? ArrowUpRight
                    : m.sentiment === 'negative'
                    ? ArrowDownRight
                    : null;

                return (
                  <div
                    key={m.label}
                    style={{
                      /* Figma-verified Pulse Strip card anatomy */
                      background: 'var(--game-surface)',
                      border: 'var(--game-card-border)',
                      borderRadius: 'var(--radius-2xl)',
                      padding: '14px 16px',
                      boxShadow: 'var(--shadow-elev-1)',
                    }}
                  >
                    {/* Icon + label */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 10,
                      }}
                    >
                      <IconChip
                        Icon={m.Icon}
                        bg={iconBg}
                        color={iconColor}
                        size={28}
                        iconSize={13}
                      />
                      <span
                        style={{
                          fontFamily: F,
                          fontSize: '11px',
                          fontWeight: 500,
                          color: 'var(--game-text-secondary)',
                          lineHeight: 1.3,
                        }}
                      >
                        {m.label}
                      </span>
                    </div>

                    {/* Value + delta row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span
                        style={{
                          fontFamily: F,
                          fontSize: '20px',
                          fontWeight: 700,
                          fontVariantNumeric: 'tabular-nums',
                          color: valueColor,
                          letterSpacing: '-0.02em',
                          lineHeight: 1,
                        }}
                      >
                        {m.value}
                      </span>
                      {DeltaIcon && (
                        <DeltaIcon size={11} color={iconColor} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Action Bar ──────────────────────────────────── */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ width: 220 }}>
                <GameButton onClick={() => navigate('/ref/game/decisions-leaderboard')}>
                  View Leaderboard
                </GameButton>
              </div>
            </div>

          </div>
        </div>
      </PageTransition>
    </GridBackground>
  );
}

