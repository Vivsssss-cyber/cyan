'use client';

import React, { useState } from 'react';
import { GridBackground } from './GridBackground';
import { PageTransition } from './PageTransition';
import { GameButton } from './GameButton';
import { useAppNavigate } from '../lib/use-app-navigate';
import {
  Crown, Trophy, DollarSign, Clock, Package, Stopwatch,
  Wallet, ChevronRight, ArrowUpRight, ArrowDownRight, Calendar,
  TrendingUp, Copy, Check,
} from './PixelIcons';
import type { PixelIconProps } from './PixelIcons';

// ─── Types ────────────────────────────────────────────────────────────────────

type MetricKey = 'cash' | 'workHours' | 'workUnits' | 'duration';

interface Team {
  id: number;
  name: string;
  facilitator: string;
  scores: Record<MetricKey, number>;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MY_TEAM_ID = 4;

const teams: Team[] = [
  { id: 1, name: 'Cyan Tech',    facilitator: 'Sita',   scores: { cash: 92400, workHours: 312, workUnits: 148, duration: 34 } },
  { id: 2, name: 'Design Dab',   facilitator: 'Ramesh', scores: { cash: 88100, workHours: 298, workUnits: 133, duration: 38 } },
  { id: 3, name: 'Kheti Pati',   facilitator: 'Hari',   scores: { cash: 85700, workHours: 285, workUnits: 127, duration: 41 } },
  { id: 4, name: 'Alpha Crew',   facilitator: 'Maya',   scores: { cash: 79300, workHours: 271, workUnits: 119, duration: 44 } },
  { id: 5, name: 'Beta Wave',    facilitator: 'Arjun',  scores: { cash: 74100, workHours: 259, workUnits: 112, duration: 47 } },
  { id: 6, name: 'Delta Force',  facilitator: 'Priya',  scores: { cash: 68800, workHours: 244, workUnits: 104, duration: 51 } },
  { id: 7, name: 'Gamma Rise',   facilitator: 'Sunil',  scores: { cash: 63200, workHours: 231, workUnits: 96,  duration: 55 } },
];

const METRICS: {
  key: MetricKey;
  label: string;
  unit: string;
  Icon: React.ComponentType<PixelIconProps>;
  higherIsBetter: boolean;
  format: (v: number) => string;
}[] = [
  {
    key: 'cash',
    label: 'Cash',
    unit: '$',
    Icon: Wallet,
    higherIsBetter: true,
    format: (v) => `$${(v / 1000).toFixed(1)}k`,
  },
  {
    key: 'workHours',
    label: 'Work Hours',
    unit: 'hrs',
    Icon: Clock,
    higherIsBetter: true,
    format: (v) => `${v} hrs`,
  },
  {
    key: 'workUnits',
    label: 'Work Units',
    unit: 'units',
    Icon: Package,
    higherIsBetter: true,
    format: (v) => `${v}`,
  },
  {
    key: 'duration',
    label: 'Duration',
    unit: 'days',
    Icon: Stopwatch,
    higherIsBetter: false,
    format: (v) => `${v}d`,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRanked(key: MetricKey): Team[] {
  const metric = METRICS.find((m) => m.key === key)!;
  return [...teams].sort((a, b) =>
    metric.higherIsBetter
      ? b.scores[key] - a.scores[key]
      : a.scores[key] - b.scores[key]
  );
}

function getMyRank(key: MetricKey): number {
  return getRanked(key).findIndex((t) => t.id === MY_TEAM_ID) + 1;
}

function rankSuffix(n: number) {
  if (n === 1) return 'st';
  if (n === 2) return 'nd';
  if (n === 3) return 'rd';
  return 'th';
}

// ─── Sub-components ──────────────────────────────────────────────────────────

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
        borderRadius: 10,
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

function MetricTab({
  metric,
  active,
  myRank,
  onClick,
}: {
  metric: typeof METRICS[number];
  active: boolean;
  myRank: number;
  onClick: () => void;
}) {
  const F = "'Outfit', sans-serif";
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        borderRadius: 8,
        background: active ? 'var(--game-teal-mid, #006E85)' : 'transparent',
        border: 'none',
        cursor: 'pointer',
        transition: 'background 150ms ease',
        fontFamily: F,
      }}
    >
      <metric.Icon
        size={14}
        color={active ? 'white' : 'var(--game-text-secondary, #606569)'}
      />
      <span
        style={{
          fontSize: '13px',
          fontWeight: 600,
          color: active ? 'white' : 'var(--game-text-secondary, #606569)',
          whiteSpace: 'nowrap',
        }}
      >
        {metric.label}
      </span>
      {active && (
        <span
          style={{
            fontSize: '10px',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.75)',
            background: 'rgba(255,255,255,0.15)',
            padding: '1px 6px',
            borderRadius: 9999,
          }}
        >
          #{myRank}
        </span>
      )}
    </button>
  );
}

// ─── Podium card ─────────────────────────────────────────────────────────────

function PodiumCard({
  team,
  rank,
  metric,
  isMe,
}: {
  team: Team;
  rank: number;
  metric: typeof METRICS[number];
  isMe: boolean;
}) {
  const F = "'Outfit', sans-serif";
  const isFirst = rank === 1;

  const rankColors: Record<number, { bg: string; text: string; accent: string }> = {
    1: { bg: 'linear-gradient(135deg, #006E85, #003D47)', text: 'white', accent: '#00C1EB' },
    2: { bg: 'rgba(255,255,255,0.7)',  text: 'var(--game-text, #202326)', accent: '#006E85' },
    3: { bg: 'rgba(255,255,255,0.55)', text: 'var(--game-text, #202326)', accent: '#006E85' },
  };

  const style = rankColors[rank] ?? rankColors[3];

  return (
    <div
      style={{
        background: style.bg,
        border: isMe ? '2px solid var(--game-cyan, #00C1EB)' : '1.4px solid white',
        borderRadius: 16,
        padding: isFirst ? '24px 20px' : '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        boxShadow: isFirst
          ? '0 4px 24px rgba(0,110,133,0.22)'
          : '0 2px 8px rgba(0,0,0,0.05)',
        position: 'relative',
        overflow: 'hidden',
        flex: isFirst ? '0 0 220px' : '0 0 180px',
      }}
    >
      {/* decorative circles on rank-1 */}
      {isFirst && (
        <>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
          <div style={{ position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        </>
      )}

      {/* crown for 1st */}
      {isFirst && (
        <Crown size={28} color="#F59E0B" title="Champion" />
      )}

      {/* rank badge */}
      {!isFirst && (
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: rank === 2 ? 'rgba(0,110,133,0.12)' : 'rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontFamily: F, fontSize: '13px', fontWeight: 800, color: 'var(--game-teal-mid, #006E85)' }}>
            {rank}
          </span>
        </div>
      )}

      {/* team name */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontFamily: F,
            fontSize: isFirst ? '16px' : '14px',
            fontWeight: 700,
            color: style.text,
            letterSpacing: '-0.01em',
          }}
        >
          {team.name}
        </div>
        <div
          style={{
            fontFamily: F,
            fontSize: '11px',
            fontWeight: 500,
            color: isFirst ? 'rgba(255,255,255,0.65)' : 'var(--game-text-muted, #94A3B8)',
            marginTop: 2,
          }}
        >
          {team.facilitator}
        </div>
      </div>

      {/* champion tag for 1st */}
      {isFirst && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: 'rgba(255,255,255,0.12)',
            borderRadius: 9999,
            padding: '3px 10px',
          }}
        >
          <Trophy size={10} color="rgba(255,255,255,0.8)" />
          <span style={{ fontFamily: F, fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.85)' }}>
            CHAMPION
          </span>
        </div>
      )}

      {/* score box */}
      <div
        style={{
          background: isFirst ? 'rgba(255,255,255,0.10)' : 'rgba(0,110,133,0.07)',
          borderRadius: 10,
          padding: '10px 20px',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            fontFamily: F,
            fontSize: isFirst ? '32px' : '26px',
            fontWeight: 800,
            fontVariantNumeric: 'tabular-nums',
            color: isFirst ? 'white' : 'var(--game-teal-mid, #006E85)',
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}
        >
          {metric.format(team.scores[metric.key])}
        </div>
        <div
          style={{
            fontFamily: F,
            fontSize: '10px',
            fontWeight: 600,
            color: isFirst ? 'rgba(255,255,255,0.55)' : 'var(--game-text-muted, #94A3B8)',
            marginTop: 4,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {metric.label}
        </div>
      </div>

      {/* "You" marker */}
      {isMe && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: 'var(--game-cyan, #00C1EB)',
            borderRadius: 9999,
            padding: '2px 8px',
          }}
        >
          <span style={{ fontFamily: F, fontSize: '9px', fontWeight: 700, color: 'white', letterSpacing: '0.06em' }}>
            YOU
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Row ─────────────────────────────────────────────────────────────────────

function RankRow({
  team,
  rank,
  metric,
  isMe,
  totalTeams,
}: {
  team: Team;
  rank: number;
  metric: typeof METRICS[number];
  isMe: boolean;
  totalTeams: number;
}) {
  const F = "'Outfit', sans-serif";
  const best = getRanked(metric.key)[0].scores[metric.key];
  const pct = metric.higherIsBetter
    ? (team.scores[metric.key] / best) * 100
    : (1 - (team.scores[metric.key] - best) / best) * 100;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '40px 1fr auto 180px auto',
        alignItems: 'center',
        gap: '16px',
        padding: '12px 20px',
        background: isMe ? 'rgba(0,193,235,0.06)' : 'transparent',
        borderRadius: 10,
        border: isMe ? '1px solid rgba(0,193,235,0.20)' : '1px solid transparent',
        transition: 'background 120ms',
      }}
    >
      {/* rank # */}
      <div style={{ textAlign: 'center' }}>
        <span
          style={{
            fontFamily: F,
            fontSize: rank <= 3 ? '15px' : '13px',
            fontWeight: rank <= 3 ? 800 : 600,
            color: rank === 1 ? 'var(--game-teal-mid, #006E85)'
              : rank === 2 ? 'var(--game-text, #202326)'
              : rank === 3 ? 'var(--game-text-secondary, #606569)'
              : 'var(--game-text-muted, #94A3B8)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {rank <= 3 ? `${rank}${rankSuffix(rank)}` : rank}
        </span>
      </div>

      {/* name + facilitator */}
      <div>
        <div style={{ fontFamily: F, fontSize: '14px', fontWeight: 600, color: 'var(--game-text, #202326)', display: 'flex', alignItems: 'center', gap: 6 }}>
          {team.name}
          {isMe && (
            <span style={{ fontFamily: F, fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', color: 'white', background: 'var(--game-cyan, #00C1EB)', borderRadius: 9999, padding: '1px 6px' }}>
              YOU
            </span>
          )}
        </div>
        <div style={{ fontFamily: F, fontSize: '11px', fontWeight: 500, color: 'var(--game-text-muted, #94A3B8)', marginTop: 1 }}>
          {team.facilitator}
        </div>
      </div>

      {/* score value */}
      <div
        style={{
          fontFamily: F,
          fontSize: '16px',
          fontWeight: 700,
          fontVariantNumeric: 'tabular-nums',
          color: 'var(--game-teal-mid, #006E85)',
          letterSpacing: '-0.02em',
          textAlign: 'right',
          minWidth: 70,
        }}
      >
        {metric.format(team.scores[metric.key])}
      </div>

      {/* progress bar */}
      <div>
        <div
          style={{
            height: 6,
            borderRadius: 3,
            background: '#f0f2f4',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              borderRadius: 3,
              width: `${Math.max(8, pct)}%`,
              background: isMe
                ? 'var(--game-cyan, #00C1EB)'
                : rank === 1
                ? 'var(--game-teal-mid, #006E85)'
                : 'var(--game-border, #C8DDE6)',
              transition: 'width 400ms ease',
            }}
          />
        </div>
      </div>

      {/* rank change arrow placeholder */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {rank <= 3
          ? <ArrowUpRight size={13} color="var(--game-positive, #156162)" />
          : rank > totalTeams - 2
          ? <ArrowDownRight size={13} color="var(--game-negative, #c65252)" />
          : <ChevronRight size={13} color="var(--game-text-muted, #94A3B8)" />
        }
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function DecisionsLeaderboard() {
  const navigate = useAppNavigate();
  const [activeMetric, setActiveMetric] = useState<MetricKey>('cash');
  const [copied, setCopied] = useState(false);
  const F = "'Outfit', sans-serif";

  function handleCopy() {
    const ranked = getRanked(activeMetric);
    const metric = METRICS.find((m) => m.key === activeMetric)!;
    const myRank = getMyRank(activeMetric);
    const lines = [
      `Round Leaderboard — Week 12 · ${metric.label} Rankings`,
      `Your rank: #${myRank}`,
      '',
      ...ranked.map((t, i) =>
        `${i + 1}. ${t.name} (${t.facilitator}) — ${metric.format(t.scores[metric.key])}${t.id === MY_TEAM_ID ? ' ← YOU' : ''}`
      ),
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const metric = METRICS.find((m) => m.key === activeMetric)!;
  const ranked = getRanked(activeMetric);
  const podium = ranked.slice(0, 3);
  const rest = ranked.slice(3);
  const myOverallRank = getMyRank(activeMetric);

  return (
    <GridBackground>
      <PageTransition>
        <div
          style={{
            minHeight: '100dvh',
            padding: '32px 24px 96px',
            fontFamily: F,
          }}
        >
          <div style={{ maxWidth: '1312px', margin: '0 auto' }}>

            {/* ── Strategic header card ──────────────────────── */}
            <div
              style={{
                background: 'linear-gradient(135deg, #006E85, #003D47)',
                borderRadius: 16,
                padding: '28px 32px',
                marginBottom: '28px',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* decorative circles */}
              <div style={{ position: 'absolute', top: -40, right: 200, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
              <div style={{ position: 'absolute', bottom: -30, right: 60, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

              <div style={{ position: 'relative' }}>
                {/* eyebrow */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Calendar size={12} color="rgba(255,255,255,0.6)" />
                  <span style={{ fontFamily: F, fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.04em' }}>
                    Mar 19, 2023 – Mar 26, 2023
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>·</span>
                  <TrendingUp size={12} color="rgba(255,255,255,0.6)" />
                  <span style={{ fontFamily: F, fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>
                    Week 12 of 48
                  </span>
                </div>

                <h1
                  style={{
                    fontFamily: F,
                    fontSize: '26px',
                    fontWeight: 800,
                    color: 'white',
                    letterSpacing: '-0.02em',
                    margin: '0 0 4px',
                    lineHeight: 1.15,
                  }}
                >
                  Round Leaderboard
                </h1>
                <p style={{ fontFamily: F, fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.55)', margin: 0 }}>
                  Rankings across all teams this round
                </p>
              </div>

              {/* Rank callout + copy */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '12px',
                  position: 'relative',
                }}
              >
                {/* Copy button */}
                <button
                  onClick={handleCopy}
                  title="Copy rankings"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: copied ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.10)',
                    border: copied ? '1px solid rgba(255,255,255,0.40)' : '1px solid rgba(255,255,255,0.20)',
                    borderRadius: 9999,
                    padding: '6px 14px',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                    fontFamily: F,
                  }}
                >
                  {copied
                    ? <Check size={12} color="rgba(255,255,255,0.9)" />
                    : <Copy size={12} color="rgba(255,255,255,0.7)" />
                  }
                  <span style={{ fontSize: '11px', fontWeight: 600, color: copied ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.7)' }}>
                    {copied ? 'Copied!' : 'Copy Rankings'}
                  </span>
                </button>
                <span style={{ fontFamily: F, fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>
                  Your Rank
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                  <span
                    style={{
                      fontFamily: F,
                      fontSize: '52px',
                      fontWeight: 800,
                      color: 'white',
                      letterSpacing: '-0.04em',
                      lineHeight: 1,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {myOverallRank}
                  </span>
                  <span style={{ fontFamily: F, fontSize: '22px', fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>
                    {rankSuffix(myOverallRank)}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Metric tabs ────────────────────────────────── */}
            <div
              style={{
                background: 'rgba(255,255,255,0.6)',
                border: '1.4px solid white',
                borderRadius: 12,
                padding: '4px',
                display: 'inline-flex',
                gap: '2px',
                marginBottom: '24px',
              }}
            >
              {METRICS.map((m) => (
                <MetricTab
                  key={m.key}
                  metric={m}
                  active={activeMetric === m.key}
                  myRank={getMyRank(m.key)}
                  onClick={() => setActiveMetric(m.key)}
                />
              ))}
            </div>

            {/* ── Main layout: podium (left) + all ranks (right) ── */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.6fr',
                gap: '20px',
                alignItems: 'start',
              }}
            >
              {/* ── Podium ──────────────────────────────────── */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.6)',
                  border: '1.4px solid white',
                  borderRadius: 16,
                  padding: '20px',
                }}
              >
                {/* section label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <span
                    style={{
                      fontFamily: F,
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      color: 'var(--game-teal-mid, #006E85)',
                      background: '#E0F7FF',
                      padding: '3px 10px',
                      borderRadius: 6,
                      textTransform: 'uppercase',
                    }}
                  >
                    Top 3
                  </span>
                  <span
                    style={{
                      fontFamily: F,
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--game-text-secondary, #606569)',
                    }}
                  >
                    {metric.label} Leaders
                  </span>
                </div>

                {/* podium layout: 2nd | 1st | 3rd */}
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                  }}
                >
                  <PodiumCard
                    team={podium[1]}
                    rank={2}
                    metric={metric}
                    isMe={podium[1].id === MY_TEAM_ID}
                  />
                  <PodiumCard
                    team={podium[0]}
                    rank={1}
                    metric={metric}
                    isMe={podium[0].id === MY_TEAM_ID}
                  />
                  <PodiumCard
                    team={podium[2]}
                    rank={3}
                    metric={metric}
                    isMe={podium[2].id === MY_TEAM_ID}
                  />
                </div>
              </div>

              {/* ── Full rankings ────────────────────────────── */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.6)',
                  border: '1.4px solid white',
                  borderRadius: 16,
                  padding: '20px',
                }}
              >
                {/* header row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        fontFamily: F,
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        color: 'var(--game-teal-mid, #006E85)',
                        background: '#E0F7FF',
                        padding: '3px 10px',
                        borderRadius: 6,
                        textTransform: 'uppercase',
                      }}
                    >
                      All Teams
                    </span>
                    <span style={{ fontFamily: F, fontSize: '13px', fontWeight: 600, color: 'var(--game-text-secondary, #606569)' }}>
                      {teams.length} teams · ranked by {metric.label}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <metric.Icon size={13} color="var(--game-text-muted, #94A3B8)" />
                    <span style={{ fontFamily: F, fontSize: '11px', fontWeight: 600, color: 'var(--game-text-muted, #94A3B8)' }}>
                      {metric.higherIsBetter ? 'Higher is better' : 'Lower is better'}
                    </span>
                  </div>
                </div>

                {/* col headers */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 1fr auto 180px auto',
                    gap: '16px',
                    padding: '4px 20px 10px',
                    borderBottom: '1px solid var(--game-border, #C8DDE6)',
                    marginBottom: 6,
                  }}
                >
                  {['#', 'Team', metric.unit, 'Progress', ''].map((h) => (
                    <span
                      key={h}
                      style={{
                        fontFamily: F,
                        fontSize: '10px',
                        fontWeight: 700,
                        color: 'var(--game-text-muted, #94A3B8)',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {h}
                    </span>
                  ))}
                </div>

                {/* rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {ranked.map((team, i) => (
                    <RankRow
                      key={team.id}
                      team={team}
                      rank={i + 1}
                      metric={metric}
                      isMe={team.id === MY_TEAM_ID}
                      totalTeams={teams.length}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* ── Action bar ─────────────────────────────────── */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '36px',
              }}
            >
              <div style={{ width: '180px' }}>
                <GameButton
                  variant="secondary"
                  onClick={() => navigate('/ref/game/decisions-summary')}
                >
                  Back to Summary
                </GameButton>
              </div>
              <div style={{ width: '200px' }}>
                <GameButton onClick={() => navigate('/ref/game/cockpit')}>
                  Continue
                </GameButton>
              </div>
            </div>

          </div>
        </div>
      </PageTransition>
    </GridBackground>
  );
}

