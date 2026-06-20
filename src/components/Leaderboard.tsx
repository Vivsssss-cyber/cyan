import React, { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAppNavigate } from '../lib/use-app-navigate';
import { GridBackground } from './GridBackground';
import { GameHeader } from './GameHeader';
import { PageTransition } from './PageTransition';
import { TabBar } from './TabBar';
import awardIcon from './icons/social-rewards-certified-ribbon--Streamline-Pixel.svg';
import badgeIcon from './icons/business-product-check--Streamline-Pixel.svg';
import fileIcon from './icons/content-files-pdf--Streamline-Pixel.svg';
import medalIcon from './icons/social-rewards-certified-diploma--Streamline-Pixel.svg';
import moneyIcon from './icons/business-money-coin-currency--Streamline-Pixel.svg';
import pieIcon from './icons/business-product-scale--Streamline-Pixel.svg';
import reportChartIcon from './icons/business-product-report-present-grahp--Streamline-Pixel.svg';
import shieldIcon from './icons/business-products-cash-shield--Streamline-Pixel.svg';
import trophyIcon from './icons/social-rewards-vip-crown-king--Streamline-Pixel.svg';
import usersIcon from './icons/multiple-user--Streamline-Pixel.svg';

const FO = "'Outfit', sans-serif";
const INK = 'var(--game-text)';
const TEXT = 'var(--game-text-secondary)';
const BORDER = 'var(--color-border)';
const SURFACE = 'rgba(255,255,255,0.72)';
const TEAL = 'var(--game-teal-mid)';
const CYAN = 'var(--color-chart-1)';
const DEEP = 'var(--color-chart-2)';
const AMBER = 'var(--color-chart-4)';
const RED = 'var(--color-chart-5)';
const POSITIVE = 'var(--game-positive)';
const CTA_BG = 'var(--game-cta-gradient)';

const tabs = [
  { id: 'standings', label: 'Standings' },
  { id: 'comparison', label: 'Comparison' },
  { id: 'scoring', label: 'Scoring' },
];

const standings = [
  {
    rank: 1,
    team: 'Mustang Beans',
    founder: 'Team Tilicho',
    tag: 'Balanced Builder',
    valuation: 9820000,
    founderPct: 71,
    retained: 6972200,
    profit: 1140000,
    retention: 76.4,
    debtRatio: 0.22,
    score: 912,
    color: TEAL,
  },
  {
    rank: 2,
    team: 'Pokhara Pour',
    founder: 'Team Machhapuchhre',
    tag: 'Growth Engine',
    valuation: 11200000,
    founderPct: 52,
    retained: 5824000,
    profit: 1310000,
    retention: 68.2,
    debtRatio: 0.41,
    score: 876,
    color: CYAN,
  },
  {
    rank: 3,
    team: 'Dhaulagiri Cafe',
    founder: 'Team Annapurna',
    tag: 'Capital Discipline',
    valuation: 8450000,
    founderPct: 64,
    retained: 5408000,
    profit: 864000,
    retention: 71.0,
    debtRatio: 0.28,
    score: 847,
    color: DEEP,
    isYou: true,
  },
  {
    rank: 4,
    team: 'Lukla Coffee Co.',
    founder: 'Team Khumbu',
    tag: 'Bold Operator',
    valuation: 12900000,
    founderPct: 38,
    retained: 4902000,
    profit: 1420000,
    retention: 64.7,
    debtRatio: 0.54,
    score: 812,
    color: AMBER,
  },
  {
    rank: 5,
    team: 'Thamel Toast',
    founder: 'Team Ganesh',
    tag: 'Customer First',
    valuation: 6720000,
    founderPct: 82,
    retained: 5510400,
    profit: 702000,
    retention: 79.1,
    debtRatio: 0.19,
    score: 798,
    color: POSITIVE,
  },
  {
    rank: 6,
    team: 'Bhaktapur Brews',
    founder: 'Team Langtang',
    tag: 'Steady Scale',
    valuation: 7140000,
    founderPct: 59,
    retained: 4212600,
    profit: 648000,
    retention: 66.5,
    debtRatio: 0.34,
    score: 764,
    color: 'var(--color-chart-6)',
  },
  {
    rank: 7,
    team: 'Solu Sip House',
    founder: 'Team Makalu',
    tag: 'High Leverage',
    valuation: 14300000,
    founderPct: 22,
    retained: 3146000,
    profit: 1580000,
    retention: 61.3,
    debtRatio: 0.71,
    score: 721,
    color: RED,
  },
  {
    rank: 8,
    team: 'Manaslu Mornings',
    founder: 'Team Dhampus',
    tag: 'Lean Operator',
    valuation: 5310000,
    founderPct: 68,
    retained: 3610800,
    profit: 494000,
    retention: 62.8,
    debtRatio: 0.31,
    score: 689,
    color: 'var(--sv-muted-700)',
  },
];

const scoreWeights = [
  { label: 'Founder Retained Value', weight: 30, yourScore: 81, color: TEAL },
  { label: 'Company Valuation', weight: 20, yourScore: 68, color: DEEP },
  { label: 'Net Profit', weight: 15, yourScore: 74, color: POSITIVE },
  { label: 'Customer Retention', weight: 15, yourScore: 86, color: CYAN },
  { label: 'Debt Discipline', weight: 10, yourScore: 91, color: AMBER },
  { label: 'Growth Consistency', weight: 10, yourScore: 77, color: 'var(--color-chart-6)' },
];

const trajectory = [
  { year: 'Y1', Mustang: 188, Pokhara: 176, Dhaulagiri: 164, Lukla: 171 },
  { year: 'Y2', Mustang: 352, Pokhara: 331, Dhaulagiri: 309, Lukla: 365 },
  { year: 'Y3', Mustang: 561, Pokhara: 548, Dhaulagiri: 502, Lukla: 611 },
  { year: 'Y4', Mustang: 744, Pokhara: 718, Dhaulagiri: 693, Lukla: 742 },
  { year: 'Y5', Mustang: 912, Pokhara: 876, Dhaulagiri: 847, Lukla: 812 },
];

const radarData = [
  { metric: 'Retained Value', Mustang: 97, Pokhara: 82, Dhaulagiri: 76, Lukla: 68 },
  { metric: 'Valuation', Mustang: 76, Pokhara: 86, Dhaulagiri: 65, Lukla: 100 },
  { metric: 'Profit', Mustang: 72, Pokhara: 83, Dhaulagiri: 55, Lukla: 90 },
  { metric: 'Retention', Mustang: 76, Pokhara: 68, Dhaulagiri: 71, Lukla: 65 },
  { metric: 'Debt Discipline', Mustang: 91, Pokhara: 72, Dhaulagiri: 86, Lukla: 49 },
  { metric: 'Consistency', Mustang: 88, Pokhara: 84, Dhaulagiri: 79, Lukla: 67 },
];

function money(value: number) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M`;
  return `$${(value / 1000).toFixed(0)}K`;
}

function fullMoney(value: number) {
  return `$${value.toLocaleString()}`;
}

/* Optional injected player outcome (demo flow) — replaces the "you" row and re-ranks. */
export interface LeaderboardPlayerRow {
  valuation: number;
  founderPct: number;
  retained: number;
  profit: number;
  retention: number;
  score: number;
}

/* Full cohort replacement (demo flow) — all rows on the same scale as the player. */
export interface LeaderboardRowInput {
  rank: number;
  team: string;
  founder: string;
  tag: string;
  valuation: number;
  founderPct: number;
  retained: number;
  profit: number;
  retention: number;
  debtRatio: number;
  score: number;
  color: string;
  isYou?: boolean;
}

export function Leaderboard({ playerRow, cohortRows }: { playerRow?: LeaderboardPlayerRow; cohortRows?: LeaderboardRowInput[] } = {}) {
  const navigate = useAppNavigate();
  const [activeTab, setActiveTab] = useState('standings');
  const [selectedTeam, setSelectedTeam] = useState('Dhaulagiri Cafe');
  const rows = useMemo(() => {
    if (cohortRows) {
      const sorted = [...cohortRows].sort((a, b) => b.score - a.score);
      return sorted.map((team, i) => ({ ...team, rank: i + 1 }));
    }
    if (!playerRow) return standings;
    const merged = standings.map((team) => (team.isYou ? { ...team, ...playerRow } : team));
    merged.sort((a, b) => b.score - a.score);
    return merged.map((team, i) => ({ ...team, rank: i + 1 }));
  }, [playerRow, cohortRows]);
  const cohortSize = playerRow || cohortRows ? rows.length : 16;
  const selected = useMemo(
    () => rows.find((team) => team.team === selectedTeam) ?? rows[2],
    [selectedTeam, rows]
  );
  const you = rows.find((team) => team.isYou) ?? rows[2];

  return (
    <PageTransition>
      <GridBackground className="flex min-h-screen flex-col">
        <GameHeader />

        <main className="mx-auto w-full max-w-[1312px] px-6 pb-16">
          <header className="mb-6 flex flex-col gap-5 border-b border-[#C8DDE6] pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span style={styles.eyebrow}>Cohort 24 · Final Rankings</span>
              <h1 style={styles.h1}>Leaderboard</h1>
              <p style={styles.sub}>
                Now that you understand your business outcome, see how your team compares. Ranked by retained founder value, valuation quality, profit, customer health, debt discipline, and five-year consistency.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <ActionButton icon={<DsIcon icon={fileIcon} size={16} />} onClick={() => navigate('/ref/game/final-report')}>
                View final report
              </ActionButton>
              <ActionButton icon={<DsIcon icon={trophyIcon} size={16} />} primary onClick={() => {}}>
                Finish game
              </ActionButton>
            </div>
          </header>

          {/* Player hero highlight card */}
          <section className="mb-6">
            <div
              className="rounded-2xl p-6"
              style={{
                background: 'linear-gradient(135deg, #006E85 0%, #003D47 100%)',
                border: '1.4px solid rgba(255,255,255,0.18)',
              }}
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-5">
                  <div
                    className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl"
                    style={{ background: 'rgba(255,255,255,0.12)', border: '1.4px solid rgba(255,255,255,0.2)' }}
                  >
                    <DsIcon icon={trophyIcon} size={28} />
                  </div>
                  <div>
                    <span style={{ color: 'rgba(255,255,255,0.65)', fontFamily: FO, fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      Your result · Team Annapurna
                    </span>
                    <div style={{ color: '#FFFFFF', fontFamily: FO, fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 4 }}>
                      Dhaulagiri Cafe
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontFamily: FO, fontSize: 13, fontWeight: 600, marginTop: 2 }}>
                      Rank #{you.rank} of {cohortSize} teams · {you.tag}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 md:gap-8">
                  {[
                    { label: 'Final Score', value: String(you.score) },
                    { label: 'Founder Retained', value: money(you.retained) },
                    { label: 'Founder Ownership', value: `${you.founderPct}%` },
                    { label: 'Company Valuation', value: money(you.valuation) },
                  ].map((kpi) => (
                    <div key={kpi.label} className="text-right">
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontFamily: FO, fontSize: 11, fontWeight: 700 }}>{kpi.label}</div>
                      <div style={{ color: '#FFFFFF', fontFamily: FO, fontSize: 22, fontWeight: 800, fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>{kpi.value}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  { label: 'Capital Discipline', color: 'var(--color-chart-1)' },
                  { label: 'Top 3 Retention', color: 'var(--color-chart-6)' },
                  { label: 'Consistent Grower', color: 'color-mix(in srgb, var(--color-chart-6) 55%, white)' },
                ].map((badge) => (
                  <span
                    key={badge.label}
                    style={{
                      background: 'rgba(255,255,255,0.12)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 9999,
                      color: badge.color,
                      fontFamily: FO,
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: '0.06em',
                      padding: '5px 12px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Kpi icon={<DsIcon icon={trophyIcon} size={19} />} label="Your Rank" value={`#${you.rank} of ${cohortSize}`} detail={`Top ${Math.max(1, Math.round((you.rank / cohortSize) * 100))}% of cohort`} />
            <Kpi icon={<DsIcon icon={badgeIcon} size={19} />} label="Final Score" value={String(you.score)} detail="+83 vs cohort median" />
            <Kpi icon={<DsIcon icon={shieldIcon} size={19} />} label="Founder Retained" value={money(you.retained)} detail={`${you.founderPct}% of ${money(you.valuation)}`} />
            <Kpi icon={<DsIcon icon={usersIcon} size={19} />} label="Retention" value={`${you.retention.toFixed(1)}%`} detail="Top 3 customer health" />
          </section>

          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
            <div className="flex flex-wrap items-center gap-2">
              {rows.slice(0, 4).map((team) => (
                <button
                  key={team.team}
                  type="button"
                  onClick={() => setSelectedTeam(team.team)}
                  style={{
                    ...styles.teamFilter,
                    background: selectedTeam === team.team ? '#E0F7FF' : 'rgba(255,255,255,0.65)',
                    borderColor: selectedTeam === team.team ? TEAL : BORDER,
                    color: selectedTeam === team.team ? TEAL : TEXT,
                  }}
                >
                  {team.team.replace(' Coffee Co.', '').replace('Dhaulagiri ', 'D. ')}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'standings' && <StandingsTab rows={rows} cohortSize={cohortSize} selectedTeam={selectedTeam} onSelectTeam={setSelectedTeam} />}
          {activeTab === 'comparison' && <ComparisonTab selected={selected} />}
          {activeTab === 'scoring' && <ScoringTab />}
        </main>
      </GridBackground>
    </PageTransition>
  );
}

function StandingsTab({
  rows = standings,
  cohortSize = 16,
  selectedTeam,
  onSelectTeam,
}: {
  rows?: LeaderboardRowInput[];
  cohortSize?: number;
  selectedTeam: string;
  onSelectTeam: (team: string) => void;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)]">
      <Panel className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-[#C8DDE6] px-5 py-4">
          <div>
            <span style={styles.eyebrow}>All Teams</span>
            <h2 style={styles.h2}>Final standings</h2>
          </div>
          <span style={styles.metaPill}>{cohortSize} teams ranked</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]" style={{ borderCollapse: 'collapse', fontFamily: FO }}>
            <thead>
              <tr>
                {['Rank', 'Team', 'Valuation', 'Founder %', 'Retained', 'Net Profit', 'Retention', 'Debt', 'Score'].map((head, index) => (
                  <th key={head} style={{ ...styles.th, textAlign: index < 2 ? 'left' : 'right' }}>
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((team) => (
                <tr
                  key={team.team}
                  onClick={() => onSelectTeam(team.team)}
                  style={{
                    background: team.team === selectedTeam ? '#F0F9FC' : team.isYou ? '#E0F7FF' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <td style={styles.td}>
                    <RankMark rank={team.rank} />
                  </td>
                  <td style={styles.td}>
                    <div className="flex items-center gap-2">
                      <div>
                        <div style={{ color: team.isYou ? TEAL : INK, fontWeight: 800 }}>
                          {team.team}
                          {team.isYou && <span style={styles.youBadge}>YOU</span>}
                        </div>
                        <div style={{ color: TEXT, fontSize: 11 }}>{team.founder} · {team.tag}</div>
                      </div>
                    </div>
                  </td>
                  <MetricCell value={money(team.valuation)} />
                  <MetricCell value={`${team.founderPct}%`} strong={team.isYou} />
                  <MetricCell value={money(team.retained)} accent />
                  <MetricCell value={money(team.profit)} />
                  <MetricCell value={`${team.retention.toFixed(1)}%`} />
                  <MetricCell value={team.debtRatio.toFixed(2)} />
                  <MetricCell value={String(team.score)} accent strong />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid gap-4">
        <Panel>
          <span style={styles.eyebrow}>Selected Team</span>
          <h2 style={styles.h2}>{selectedTeam}</h2>
          <p style={{ ...styles.sub, marginTop: 4 }}>
            Click any row to inspect its rank drivers against the cohort.
          </p>
          <div className="mt-4 space-y-3">
            {scoreWeights.map((item) => (
              <ScoreBar key={item.label} label={item.label} value={item.yourScore} color={item.color} />
            ))}
          </div>
        </Panel>
        <Panel>
          <span style={styles.eyebrow}>Awards</span>
          <div className="mt-3 grid gap-3">
            {[
              { icon: trophyIcon, label: 'Best Retained Value', team: 'Mustang Beans' },
              { icon: awardIcon, label: 'Highest Valuation', team: 'Solu Sip House' },
              { icon: medalIcon, label: 'Best Retention', team: 'Thamel Toast' },
            ].map((award) => {
              return (
                <div key={award.label} className="flex items-center gap-3 rounded-lg border border-[#C8DDE6] bg-white px-3 py-3">
                  <DsIcon icon={award.icon} size={18} />
                  <div>
                    <div style={{ color: INK, fontSize: 13, fontWeight: 800 }}>{award.label}</div>
                    <div style={{ color: TEXT, fontSize: 12 }}>{award.team}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function ComparisonTab({ selected }: { selected: LeaderboardRowInput }) {
  const retainedData = standings.slice(0, 7).map((team) => ({
    name: team.team.replace('Dhaulagiri Cafe', 'Dhaulagiri').replace(' Coffee Co.', ''),
    retained: team.retained,
    valuation: team.valuation,
    color: team.color,
  }));

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Panel>
          <ChartTitle icon={<DsIcon icon={reportChartIcon} size={17} />} title="Retained value vs company valuation" subtitle="Bars use design-system chart tokens and flat fills." />
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={retainedData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: TEXT, fontFamily: FO }} />
                <YAxis tick={{ fontSize: 11, fill: TEXT, fontFamily: FO }} tickFormatter={(v) => money(Number(v))} width={58} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontFamily: FO, fontSize: 12, color: TEXT }} />
                <Bar dataKey="valuation" name="Company valuation" fill="var(--color-border)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="retained" name="Founder retained" radius={[4, 4, 0, 0]}>
                  {retainedData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <ChartTitle icon={<DsIcon icon={pieIcon} size={17} />} title="Six-factor health profile" subtitle={`Focused on ${selected.team}.`} />
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="70%">
                <PolarGrid stroke={BORDER} />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: TEXT, fontFamily: FO }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Mustang" dataKey="Mustang" stroke={TEAL} fill={TEAL} fillOpacity={0.12} strokeWidth={2.2} />
                <Radar name="Pokhara" dataKey="Pokhara" stroke={CYAN} fill={CYAN} fillOpacity={0.07} strokeWidth={1.8} />
                <Radar name="Dhaulagiri" dataKey="Dhaulagiri" stroke={DEEP} fill={DEEP} fillOpacity={0.10} strokeWidth={2.2} />
                <Tooltip content={<ChartTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel>
        <ChartTitle icon={<DsIcon icon={reportChartIcon} size={17} />} title="Score trajectory" subtitle="Five-year rank movement across the leading teams." />
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trajectory} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: TEXT, fontFamily: FO }} />
              <YAxis tick={{ fontSize: 11, fill: TEXT, fontFamily: FO }} width={42} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontFamily: FO, fontSize: 12, color: TEXT }} />
              <Line type="monotone" dataKey="Mustang" stroke={TEAL} strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Pokhara" stroke={CYAN} strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Dhaulagiri" stroke={DEEP} strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Lukla" stroke={AMBER} strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}

function ScoringTab() {
  return (
    <div className="grid gap-4">
      {/* Reflection panel */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: 'linear-gradient(135deg, #003C49 0%, #002C33 100%)',
          border: '1.4px solid rgba(255,255,255,0.12)',
        }}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
          <div className="flex-shrink-0">
            <div style={{ color: 'rgba(255,255,255,0.6)', fontFamily: FO, fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Final reflection
            </div>
            <div style={{ color: '#FFFFFF', fontFamily: FO, fontSize: 22, fontWeight: 800, letterSpacing: '-0.015em', marginTop: 6, maxWidth: 280 }}>
              Bigger is not always better.
            </div>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.72)', fontFamily: FO, fontSize: 14, fontWeight: 500, lineHeight: 1.65, maxWidth: 680 }}>
            Winning is not only about building the biggest company. It is about building a valuable, resilient business while retaining meaningful ownership. A founder who raised less, diluted less, and kept debt under control may have created more personal value than one who chased the highest valuation at any cost.
          </div>
        </div>
      </div>

    <div className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <Panel>
        <span style={styles.eyebrow}>Transparent Math</span>
        <h2 style={styles.h2}>Final score formula</h2>
        <p style={{ ...styles.sub, marginTop: 4 }}>
          A bigger valuation helps, but ownership and debt discipline prevent over-leveraged teams from winning on size alone.
        </p>
        <div style={styles.formula}>final_score = sum(weight x normalized_metric) x 1000</div>
        <div className="space-y-4">
          {scoreWeights.map((item) => (
            <div key={item.label}>
              <div className="mb-1 flex items-center justify-between">
                <span style={{ color: INK, fontSize: 13, fontWeight: 800 }}>{item.label}</span>
                <span style={{ color: TEAL, fontSize: 13, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{item.weight}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#F0F6FA]">
                <div className="h-full rounded-full" style={{ width: `${item.weight * 2.8}%`, background: item.color }} />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <span style={styles.eyebrow}>Worked Example</span>
        <h2 style={styles.h2}>Why rank does not equal valuation rank</h2>
        <div className="mt-4 grid gap-3">
          {[
            { team: 'Solu Sip House', valuation: '$14.3M', ownership: '22%', retained: '$3.15M', note: 'Biggest company, low retained value.' },
            { team: 'Mustang Beans', valuation: '$9.82M', ownership: '71%', retained: '$6.97M', note: 'Smaller company, stronger founder outcome.' },
            { team: 'Dhaulagiri Cafe', valuation: '$8.45M', ownership: '64%', retained: '$5.41M', note: 'Top-three because debt and ownership stayed healthy.' },
          ].map((row) => (
            <div key={row.team} className="grid gap-3 rounded-lg border border-[#C8DDE6] bg-white p-4 md:grid-cols-[1fr_86px_86px_98px] md:items-center">
              <div>
                <div style={{ color: INK, fontWeight: 800 }}>{row.team}</div>
                <div style={{ color: TEXT, fontSize: 12 }}>{row.note}</div>
              </div>
              <MiniMetric label="Valuation" value={row.valuation} />
              <MiniMetric label="Own" value={row.ownership} />
              <MiniMetric label="Retained" value={row.retained} accent />
            </div>
          ))}
        </div>
      </Panel>
    </div>
    </div>
  );
}

function Kpi({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) {
  return (
    <Panel>
      <div className="flex items-start gap-3">
        <div style={styles.iconShell}>{icon}</div>
        <div>
          <div style={styles.kpiLabel}>{label}</div>
          <div style={styles.kpiValue}>{value}</div>
          <div style={styles.kpiDetail}>{detail}</div>
        </div>
      </div>
    </Panel>
  );
}

function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-2xl ${className}`}
      style={{
        background: SURFACE,
        border: '1.4px solid white',
        boxShadow: 'none',
        padding: className.includes('p-0') ? undefined : 20,
      }}
    >
      {children}
    </section>
  );
}

// Inline SVGR component — captures into Figma as vectors; `currentColor` recolors.
function DsIcon({ icon: Icon, size = 18 }: { icon: React.FC<React.SVGProps<SVGSVGElement>>; size?: number }) {
  return (
    <Icon
      width={size}
      height={size}
      aria-hidden="true"
      style={{ display: 'block', color: 'currentColor' }}
    />
  );
}

function RankMark({ rank }: { rank: number }) {
  const icon = rank === 1 ? trophyIcon : rank === 2 ? medalIcon : rank === 3 ? awardIcon : null;
  const color = rank === 1 ? TEAL : rank === 2 ? DEEP : rank === 3 ? AMBER : TEXT;
  return (
    <div style={{ ...styles.rank, color, borderColor: rank <= 3 ? color : BORDER, background: rank <= 3 ? '#F0F9FC' : '#FFFFFF' }}>
      {icon ? <DsIcon icon={icon} size={16} /> : rank}
    </div>
  );
}

function MetricCell({ value, accent = false, strong = false }: { value: string; accent?: boolean; strong?: boolean }) {
  return (
    <td style={{ ...styles.td, textAlign: 'right', color: accent ? TEAL : INK, fontWeight: strong ? 800 : 700, fontVariantNumeric: 'tabular-nums' }}>
      {value}
    </td>
  );
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span style={{ color: TEXT, fontSize: 12, fontWeight: 700 }}>{label}</span>
        <span style={{ color: INK, fontSize: 12, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      </div>
      <div className="h-2 rounded-full bg-[#F0F6FA]">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

function ActionButton({
  children,
  icon,
  primary = false,
  onClick,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  primary?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 transition-transform active:-translate-y-px"
      style={{
        border: primary ? 'none' : `1px solid ${BORDER}`,
        borderRadius: 'var(--game-cta-radius)',
        background: primary ? CTA_BG : '#FFFFFF',
        boxShadow: primary ? 'inset 0 -1px 0 rgba(0,0,0,0.15)' : 'none',
        color: primary ? '#FFFFFF' : INK,
        fontFamily: FO,
        fontSize: 13,
        fontWeight: 700,
        minHeight: 52,
        padding: primary ? '14px 24px' : '13px 22px',
      }}
    >
      {icon}
      {children}
    </button>
  );
}

function ChartTitle({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <div style={styles.iconShell}>{icon}</div>
      <div>
        <h2 style={styles.h2}>{title}</h2>
        <p style={{ ...styles.sub, marginTop: 2 }}>{subtitle}</p>
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color?: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={styles.tooltip}>
      <div style={{ color: INK, fontSize: 12, fontWeight: 800, marginBottom: 6 }}>{label}</div>
      {payload.map((item) => (
        <div key={item.name} className="flex items-center justify-between gap-5" style={{ color: TEXT, fontSize: 12 }}>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: item.color ?? TEAL }} />
            {item.name}
          </span>
          <span style={{ color: INK, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
            {item.value > 10000 ? fullMoney(item.value) : item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function MiniMetric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div style={{ color: TEXT, fontSize: 10, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ color: accent ? TEAL : INK, fontSize: 14, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  eyebrow: {
    color: TEAL,
    fontFamily: FO,
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '0.11em',
    textTransform: 'uppercase',
  },
  h1: {
    color: INK,
    fontFamily: FO,
    fontSize: 38,
    fontWeight: 800,
    letterSpacing: '-0.02em',
    margin: '8px 0 0',
  },
  h2: {
    color: INK,
    fontFamily: FO,
    fontSize: 17,
    fontWeight: 800,
    letterSpacing: '-0.01em',
    margin: 0,
  },
  sub: {
    color: TEXT,
    fontFamily: FO,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 1.55,
    margin: '6px 0 0',
    maxWidth: 720,
  },
  iconShell: {
    alignItems: 'center',
    background: '#E0F7FF',
    border: `1px solid ${BORDER}`,
    borderRadius: 10,
    color: TEAL,
    display: 'flex',
    flexShrink: 0,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  kpiLabel: {
    color: TEXT,
    fontFamily: FO,
    fontSize: 12,
    fontWeight: 700,
  },
  kpiValue: {
    color: INK,
    fontFamily: FO,
    fontSize: 25,
    fontWeight: 800,
    fontVariantNumeric: 'tabular-nums',
    lineHeight: 1.15,
    marginTop: 3,
  },
  kpiDetail: {
    color: TEXT,
    fontFamily: FO,
    fontSize: 12,
    fontWeight: 600,
    marginTop: 4,
  },
  teamFilter: {
    border: `1px solid ${BORDER}`,
    borderRadius: 9999,
    cursor: 'pointer',
    fontFamily: FO,
    fontSize: 12,
    fontWeight: 700,
    padding: '7px 11px',
  },
  th: {
    borderBottom: `1px solid ${BORDER}`,
    color: TEXT,
    fontFamily: FO,
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: '0.08em',
    padding: '12px 14px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },
  td: {
    borderBottom: `1px solid rgba(200,221,230,0.55)`,
    color: INK,
    fontFamily: FO,
    fontSize: 13,
    padding: '13px 14px',
    verticalAlign: 'middle',
  },
  rank: {
    alignItems: 'center',
    border: `1px solid ${BORDER}`,
    borderRadius: 9999,
    display: 'flex',
    fontFamily: FO,
    fontSize: 13,
    fontWeight: 800,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  youBadge: {
    background: '#E0F7FF',
    borderRadius: 4,
    color: TEAL,
    display: 'inline-block',
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: '0.06em',
    marginLeft: 7,
    padding: '2px 6px',
  },
  metaPill: {
    background: '#FFFFFF',
    border: `1px solid ${BORDER}`,
    borderRadius: 9999,
    color: TEXT,
    fontFamily: FO,
    fontSize: 12,
    fontWeight: 700,
    padding: '7px 11px',
  },
  formula: {
    background: '#F0F6FA',
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    color: TEAL,
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    fontWeight: 700,
    margin: '16px 0 18px',
    padding: '11px 13px',
  },
  tooltip: {
    background: '#FFFFFF',
    border: `1px solid ${BORDER}`,
    borderRadius: 12,
    boxShadow: 'none',
    fontFamily: FO,
    minWidth: 190,
    padding: 12,
  },
};

