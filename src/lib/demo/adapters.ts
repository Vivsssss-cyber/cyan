/* Startup Valley /demo — maps sim results onto the reused screens' optional data props. */

import { LOCATIONS } from "../game-state";
import { DemoState, MonthResult, ValuationResult } from "./demo-types";
import { quarterOf } from "./demo-flow";
import { computeValuation, productById, RIVAL_TEAMS, scoreRow } from "./sim-engine";
import type { MonthReviewData, KpiItem } from "../../components/MonthReview";
import type { CommandCenterMonthly } from "../../components/CommandCenter";
import type { QuarterlyReportData } from "../../components/QuarterlyReport";
import type { AnnualProductStat } from "../../components/AnnualDecisions";
import type { FinalEvaluationOutcome } from "../../components/FinalEvaluation";
import type { LeaderboardRowInput } from "../../components/Leaderboard";

const fmtMoney = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

function pctDelta(curr: number, prev: number | undefined): string {
  if (prev === undefined || prev === 0) return "first month";
  const d = ((curr - prev) / Math.abs(prev)) * 100;
  return `${d >= 0 ? "+" : ""}${d.toFixed(1)}% vs last month`;
}

export function locationName(state: DemoState): string {
  return state.setup.location !== null ? LOCATIONS[state.setup.location].name : "Your Location";
}

function lastTwo(state: DemoState): { curr: MonthResult; prev?: MonthResult } | null {
  const n = state.history.length;
  if (!n) return null;
  return { curr: state.history[n - 1].result, prev: state.history[n - 2]?.result };
}

export function toMonthReviewData(state: DemoState): MonthReviewData | undefined {
  const pair = lastTwo(state);
  if (!pair) return undefined;
  const { curr, prev } = pair;

  const overviewKpis: KpiItem[] = [
    { label: "Revenue", value: fmtMoney(curr.revenue), delta: pctDelta(curr.revenue, prev?.revenue), positive: !prev || curr.revenue >= prev.revenue, dot: "var(--color-chart-1)" },
    { label: "Footfall", value: curr.footfall.toLocaleString("en-US"), delta: pctDelta(curr.footfall, prev?.footfall), positive: !prev || curr.footfall >= prev.footfall, dot: "var(--game-teal-mid)" },
    { label: "Retention %", value: `${curr.retentionPct}%`, delta: prev ? `${curr.retentionPct - prev.retentionPct >= 0 ? "+" : ""}${curr.retentionPct - prev.retentionPct}pp vs last month` : "first month", positive: !prev || curr.retentionPct >= prev.retentionPct, dot: "var(--cyan-deep)" },
    { label: "Runway", value: curr.runwayMonths >= 99 ? "∞" : `${curr.runwayMonths} mo`, delta: curr.burn > 0 ? `burn ${fmtMoney(curr.burn)}/mo` : "cash-flow positive", positive: curr.burn === 0, neutral: curr.burn > 0, dot: "var(--color-chart-6)" },
  ];

  const totalUnits = curr.unitsSold + curr.unitsUnsold;
  const soldPct = totalUnits > 0 ? Math.round((curr.unitsSold / totalUnits) * 100) : 0;

  const insights: string[] = [];
  if (prev) {
    insights.push(curr.revenue >= prev.revenue
      ? `Revenue grew ${(((curr.revenue - prev.revenue) / Math.max(1, prev.revenue)) * 100).toFixed(1)}% on last month.`
      : `Revenue slipped ${(((prev.revenue - curr.revenue) / Math.max(1, prev.revenue)) * 100).toFixed(1)}% — check pricing and marketing.`);
  } else {
    insights.push("First month of trading — the early burn is normal while footfall builds.");
  }
  const topProduct = Object.entries(curr.perProduct).sort((a, b) => b[1].revenue - a[1].revenue)[0];
  if (topProduct) insights.push(`${topProduct[0].charAt(0).toUpperCase() + topProduct[0].slice(1)} is your top performer this month (${fmtMoney(topProduct[1].revenue)}).`);
  if (curr.unitsExpired + curr.phantomLoss > 0) insights.push(`${(curr.unitsExpired + curr.phantomLoss).toLocaleString("en-US")} units lost to expiry and phantom stock — supplier tier and ops investment reduce this.`);
  if (curr.netProfit < 0) insights.push(`This month burned ${fmtMoney(-curr.netProfit)}. Runway is the number to watch.`);

  return {
    monthLabel: `Month ${curr.month} Dashboard`,
    subtitle: `${locationName(state)} — Restaurant Performance`,
    overviewKpis,
    soldUnsold: { sold: curr.unitsSold, total: totalUnits, unsold: curr.unitsUnsold, soldPct },
    cash: { opening: curr.openingCash, inflow: curr.inflow, outflow: curr.outflow, closing: curr.closingCash },
    insights: insights.slice(0, 3),
  };
}

/**
 * Round-1 report: no month has been simulated yet, so the report reflects the
 * opening position established during onboarding (cash, location, planned staff
 * and marketing). Used as the Report-tab fallback when history is empty.
 */
export function toOpeningReportData(state: DemoState): MonthReviewData {
  const staff = state.draftMonthly.staff;
  const plannedStaff = Object.values(staff).reduce((s, n) => s + (n || 0), 0);
  const marketing = state.setup.marketingBudget ?? 0;

  const overviewKpis: KpiItem[] = [
    { label: "Opening Cash", value: fmtMoney(state.cash), delta: "from onboarding", neutral: true, dot: "var(--color-chart-1)" },
    { label: "Active Products", value: `${state.activeProducts.length}`, delta: "in catalog", neutral: true, dot: "var(--game-teal-mid)" },
    { label: "Planned Staff", value: `${plannedStaff}`, delta: "headcount", neutral: true, dot: "var(--cyan-deep)" },
    { label: "Marketing Budget", value: fmtMoney(marketing), delta: "planned / mo", neutral: true, dot: "var(--color-chart-6)" },
  ];

  return {
    monthLabel: "Opening Position",
    subtitle: `${locationName(state)} — ready to trade · based on your onboarding setup`,
    overviewKpis,
    soldUnsold: { sold: 0, total: 0, unsold: 0, soldPct: 0 },
    cash: { opening: state.cash, inflow: 0, outflow: 0, closing: state.cash },
    insights: [
      "This is your opening position from onboarding — no month has traded yet.",
      `Starting cash ${fmtMoney(state.cash)} at ${locationName(state)}.`,
      "Make your Month 1 decisions, lock them, then send to simulate your first month.",
    ],
  };
}

export function toCommandCenterMonthly(state: DemoState): CommandCenterMonthly | undefined {
  const pair = lastTwo(state);
  if (!pair) return undefined;
  const { curr, prev } = pair;
  const cost = curr.cogs + curr.opex + curr.marketing;
  const prevCost = prev ? prev.cogs + prev.opex + prev.marketing : undefined;
  const margin = curr.revenue > 0 ? Math.round(((curr.revenue - cost) / curr.revenue) * 1000) / 10 : 0;
  const prevMargin = prev && prev.revenue > 0 ? ((prev.revenue - (prev.cogs + prev.opex + prev.marketing)) / prev.revenue) * 100 : undefined;

  // Damaged stock isn't modeled separately — split phantom loss for display.
  const damaged = Math.round(curr.phantomLoss * 0.4);

  return {
    financials: {
      revenue: curr.revenue,
      cost: Math.round(cost),
      margin,
      revenueDelta: pctDelta(curr.revenue, prev?.revenue).replace(" vs last month", ""),
      costDelta: pctDelta(cost, prevCost).replace(" vs last month", ""),
      marginDelta: prevMargin !== undefined ? `${margin - prevMargin >= 0 ? "+" : ""}${(margin - prevMargin).toFixed(1)}pts` : "—",
    },
    stock: {
      sold: curr.unitsSold,
      unsold: curr.unitsUnsold,
      expiry: curr.unitsExpired,
      phantom: curr.phantomLoss - damaged,
      damaged,
    },
    market: {
      marketing: curr.marketing,
      footfall: curr.footfall,
      costPerVisit: curr.footfall > 0 ? Math.round((curr.marketing / curr.footfall) * 100) / 100 : 0,
    },
    cash: { opening: curr.openingCash, inflow: curr.inflow, outflow: curr.outflow, closing: curr.closingCash },
    baseBurn: Math.max(1000, curr.burn),
  };
}

export function toAnnualProductStats(state: DemoState): AnnualProductStat[] {
  const last = state.history[state.history.length - 1]?.result;
  return state.activeProducts.map((id) => {
    const p = last?.perProduct[id];
    return {
      id,
      name: productById(id).name,
      revenue: p?.revenue ?? 0,
      marginPct: p?.marginPct ?? 0,
      wasted: p?.wasted ?? 0,
    };
  });
}

/** Final valuation — uses the submitted annual result, or computes on the fly as fallback. */
export function finalValuation(state: DemoState): ValuationResult {
  return state.annual?.valuation ?? computeValuation(state.history, state.ownershipPct, state.cash);
}

const fmtCompact = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${Math.round(n / 1000)}K`;

export function toFinalEvaluationOutcome(state: DemoState): FinalEvaluationOutcome | undefined {
  if (!state.history.length) return undefined;
  const v = finalValuation(state);
  return {
    companyValuation: fmtCompact(v.dcfValue),
    companyTrend: `${v.growthPct >= 0 ? "+" : ""}${v.growthPct}% Q1→Q4`,
    ownerValuation: fmtCompact(v.ownerValue),
    ownerTrend: `${v.ownershipPct}% owned`,
    founderEquity: `${v.ownershipPct.toFixed(1)}%`,
    equityTrend: state.annual?.decisions.vc.accept ? `-${state.annual.decisions.vc.dilutionPct}pp dilution` : "no dilution",
    finalScore: `${v.finalScore} / 1000`,
    scoreTrend: `Rank #${v.rank}`,
    yearLabel: "Year 1",
  };
}

const RIVAL_TAGS = ["Balanced Builder", "Growth Engine", "Capital Discipline", "Bold Operator", "Customer First"];
const RIVAL_COLORS = ["var(--game-teal-mid)", "var(--color-chart-1)", "var(--color-chart-4)", "var(--game-positive)", "var(--color-chart-6)"];

/** Year-1 cohort: sim-seeded rivals + the player, all on the same scale. */
export function toLeaderboardCohort(state: DemoState): LeaderboardRowInput[] | undefined {
  if (!state.history.length) return undefined;
  const v = finalValuation(state);
  const last = state.history[state.history.length - 1].result;

  const playerRow: LeaderboardRowInput = {
    rank: 0,
    team: "Dhaulagiri Cafe",
    founder: "Team Annapurna",
    tag: state.ownershipPct < 100 ? "Funded Growth" : "Capital Discipline",
    valuation: v.dcfValue,
    founderPct: Math.round(v.ownershipPct),
    retained: v.ownerValue,
    profit: v.annualNetCash,
    retention: last.retentionPct,
    debtRatio: v.dcfValue > 0 ? Math.round((state.loan / v.dcfValue) * 100) / 100 : 0,
    score: v.finalScore,
    color: "var(--color-chart-2)",
    isYou: true,
  };

  const rivals: LeaderboardRowInput[] = RIVAL_TEAMS.map((r, i) => ({
    rank: 0,
    team: r.team,
    founder: r.founder,
    tag: RIVAL_TAGS[i % RIVAL_TAGS.length],
    valuation: r.valuation,
    founderPct: r.ownershipPct,
    retained: Math.round(r.valuation * (r.ownershipPct / 100)),
    profit: Math.round(r.valuation * 0.08),
    retention: r.retentionPct,
    debtRatio: Math.round((0.18 + i * 0.07) * 100) / 100,
    score: scoreRow(r.valuation, r.cash, r.retentionPct, 5),
    color: RIVAL_COLORS[i % RIVAL_COLORS.length],
  }));

  return [playerRow, ...rivals];
}

export function toQuarterlyReportData(state: DemoState): QuarterlyReportData | undefined {
  if (state.history.length < 3) return undefined;
  const months = state.history.slice(-3).map((h) => h.result);
  const q = quarterOf(months[months.length - 1].month);
  const labels = months.map((r) => `M${r.month}`);

  const totalRevenue = months.reduce((s, r) => s + r.revenue, 0);
  const totalUnits = months.reduce((s, r) => s + r.unitsSold, 0);
  const totalProfit = months.reduce((s, r) => s + r.netProfit, 0);
  const last = months[months.length - 1];
  const operatingMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  const toK = (n: number) => Math.round(n / 1000);

  return {
    quarter: q,
    monthsLabel: `Months ${months[0].month}–${last.month} · Quarter ${q} · Year 1`,
    kpiOverrides: {
      "Total Revenue": { value: fmtMoney(totalRevenue), delta: `Q${q}`, pos: true },
      "Total Customers": { value: last.customers.toLocaleString("en-US"), delta: "monthly buyers", pos: true },
      "Avg Order Value": { value: `$${(totalRevenue / Math.max(1, totalUnits)).toFixed(2)}`, delta: "per unit", pos: true },
      "Unit Sales": { value: totalUnits.toLocaleString("en-US"), delta: `Q${q} total`, pos: true },
      "Cash Balance": { value: fmtMoney(last.closingCash), delta: `${totalProfit >= 0 ? "+" : ""}${fmtMoney(totalProfit).replace("$-", "-$")} net`, pos: totalProfit >= 0 },
      "Operating Margin": { value: `${operatingMargin.toFixed(1)}%`, delta: `Q${q}`, pos: operatingMargin >= 0 },
    },
    trend: {
      months: labels,
      revenue: months.map((r) => toK(r.revenue)),
      costs: months.map((r) => toK(r.cogs + r.opex + r.marketing)),
      profit: months.map((r) => toK(r.netProfit)),
      cac: months.map((r) => (r.customers > 0 ? Math.round((r.marketing / r.customers) * 100) / 100 : 0)),
    },
    finLog: {
      rows: ["Opening Cash", "Revenue", "COGS", "Operating Costs", "Marketing", "Profit", "Closing Cash"],
      cols: months.map((r) => ({
        head: `M${r.month} · Year 1`,
        profit: `${r.netProfit >= 0 ? "+" : "-"}${fmtMoney(Math.abs(r.netProfit))}`,
        vals: [
          fmtMoney(r.openingCash),
          fmtMoney(r.revenue),
          `-${fmtMoney(r.cogs)}`,
          `-${fmtMoney(r.opex)}`,
          `-${fmtMoney(r.marketing)}`,
          r.netProfit >= 0 ? fmtMoney(r.netProfit) : `-${fmtMoney(Math.abs(r.netProfit))}`,
          fmtMoney(r.closingCash),
        ],
      })),
    },
  };
}
