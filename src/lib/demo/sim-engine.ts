/* Startup Valley /demo — pure simulation engine. No React.
 * Calibrated against game-state.ts setup economics (rent = $/sqft·mo, opening cash $412.5k)
 * so a default 12-month run starts slightly cash-negative and grows toward profitability. */

import { LOCATIONS, SPACE_OPTIONS, getMonthlyRent, getMaxCustomers } from "../game-state";
import {
  AnnualDecisionsInput,
  DemoSetup,
  DemoState,
  MonthlyDecisionsInput,
  MonthResult,
  Multipliers,
  ProductDef,
  ProductId,
  QuarterlyDecisionsInput,
  QuarterlyInitiativeId,
  QuarterResult,
  SegmentId,
  StaffRole,
  TierDef,
  ValuationResult,
} from "./demo-types";

/* ───────────────────────── catalog ───────────────────────── */

export const PRODUCT_CATALOG: ProductDef[] = [
  { id: "bread", name: "Bread", unitCost: 0.4, refPrice: 1.5, mixShare: 0.18, spoilBase: 0.05 },
  { id: "tea", name: "Tea", unitCost: 0.4, refPrice: 2.5, mixShare: 0.25, spoilBase: 0.02 },
  { id: "butter", name: "Butter", unitCost: 0.8, refPrice: 2.0, mixShare: 0.12, spoilBase: 0.03 },
  { id: "cheese", name: "Cheese", unitCost: 1.2, refPrice: 3.0, mixShare: 0.12, spoilBase: 0.04 },
  { id: "eggs", name: "Eggs", unitCost: 0.1, refPrice: 0.4, mixShare: 0.18, spoilBase: 0.06 },
  { id: "burger", name: "Burger", unitCost: 2.0, refPrice: 5.5, mixShare: 0.15, spoilBase: 0.08 },
  // Bench products — available at the annual product-swap gate.
  { id: "croissant", name: "Croissant", unitCost: 0.7, refPrice: 2.8, mixShare: 0.14, spoilBase: 0.07 },
  { id: "juice", name: "Fresh Juice", unitCost: 0.9, refPrice: 3.5, mixShare: 0.13, spoilBase: 0.09 },
  { id: "salad", name: "Salad Bowl", unitCost: 1.4, refPrice: 4.5, mixShare: 0.12, spoilBase: 0.1 },
  { id: "wrap", name: "Wrap", unitCost: 1.6, refPrice: 4.8, mixShare: 0.13, spoilBase: 0.07 },
];

export const DEFAULT_ACTIVE_PRODUCTS: ProductId[] = ["bread", "tea", "butter", "cheese", "eggs", "burger"];

export const TIER_TABLE: Record<string, TierDef> = {
  t1: { id: "t1", name: "Tier 1 · Local Roaster", discount: 0, freight: 24, qualityLift: 0.1, spoilMult: 0.6, phantomRate: 0.01 },
  t2: { id: "t2", name: "Tier 2 · Regional Wholesaler", discount: 0.05, freight: 18, qualityLift: 0.05, spoilMult: 1, phantomRate: 0.03 },
  t3: { id: "t3", name: "Tier 3 · National Importer", discount: 0.1, freight: 15, qualityLift: 0, spoilMult: 1.5, phantomRate: 0.06 },
};

export const STAFF_COST: Record<StaffRole, number> = { service: 1400, kitchen: 1800, support: 1600, other: 1860 };
export const STAFF_RECOMMENDED: Record<StaffRole, number> = { service: 3, kitchen: 2, support: 1, other: 1 };

const SEGMENT_SHARE: Record<SegmentId, number> = { value: 0.4, balanced: 0.35, premium: 0.25 };

const BASE_CONVERSION = 0.7;
const ITEMS_PER_BUYER = 12;
const FIXED_OPEX = 4000;
/* Setup screens quote headline rent; the demo economy applies half of it so a
 * default 12-month run dips early and recovers — playable, not punishing. */
const DEMO_RENT_FACTOR = 0.5;
/* Up-front rent payment mode buys a discount (chosen at setup stage 6). */
export const RENT_DISCOUNT: Record<string, number> = { monthly: 0, quarterly: 0.15, annually: 0.2 };
const WEEKS_PER_MONTH = 4.33;
const LOAN_DRAW = 50000;
const LOAN_INTEREST = 0.015;
export const EXTENSION_COST_PER_SQFT = 220;

export function productById(id: ProductId): ProductDef {
  return PRODUCT_CATALOG.find((p) => p.id === id)!;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

function normalizedMix(active: ProductId[]): Record<string, number> {
  const defs = active.map(productById);
  const total = defs.reduce((s, p) => s + p.mixShare, 0);
  return Object.fromEntries(defs.map((p) => [p.id, p.mixShare / total]));
}

/* ───────────────────────── defaults ───────────────────────── */

export function defaultMonthlyDecisions(active: ProductId[]): MonthlyDecisionsInput {
  return {
    purchases: Object.fromEntries(active.map((id) => [id, { qty: 0, tier: "t2" as const }])) as MonthlyDecisionsInput["purchases"],
    prices: Object.fromEntries(active.map((id) => [id, productById(id).refPrice])) as MonthlyDecisionsInput["prices"],
    marketingSpend: { value: 8000, balanced: 7000, premium: 5000 },
    targetAudience: "all",
    banking: "hold",
    staff: { service: 3, kitchen: 2, support: 1, other: 1 },
  };
}

/** Expected demand per product (units), used to pre-fill purchase quantities with a 10% buffer. */
export function recommendedPurchases(
  setup: DemoSetup,
  decisions: MonthlyDecisionsInput,
  multipliers: Multipliers,
  month: number,
  active: ProductId[],
): Record<string, number> {
  const { buyers } = computeTraffic(setup, decisions, multipliers, month);
  const mix = normalizedMix(active);
  const out: Record<string, number> = {};
  for (const id of active) {
    const p = productById(id);
    const elasticity = clamp(Math.pow(p.refPrice / Math.max(0.1, decisions.prices[id] ?? p.refPrice), 1.2), 0.5, 1.6);
    out[id] = Math.round(buyers * ITEMS_PER_BUYER * mix[id] * elasticity * 1.1);
  }
  return out;
}

/* ───────────────────────── monthly simulation ───────────────────────── */

function computeTraffic(setup: DemoSetup, d: MonthlyDecisionsInput, m: Multipliers, month: number) {
  const loc = setup.location !== null ? LOCATIONS[setup.location] : LOCATIONS[0];
  const totalSpend = d.marketingSpend.value + d.marketingSpend.balanced + d.marketingSpend.premium;
  const marketingLift = 0.35 * Math.log1p(totalSpend / 6000);
  const focusBoost = d.targetAudience === "all" ? 1 : 1 + 0.08 * SEGMENT_SHARE[d.targetAudience];
  const organicRamp = 1 + 0.025 * (month - 1);
  const footfall = Math.round(loc.footfall * WEEKS_PER_MONTH * (1 + marketingLift) * focusBoost * organicRamp * m.demand);

  const staffTotal = Object.values(d.staff).reduce((s, n) => s + n, 0);
  const staffRec = Object.values(STAFF_RECOMMENDED).reduce((s, n) => s + n, 0);
  const staffFactor = clamp(0.8 + 0.2 * (staffTotal / staffRec), 0.8, 1.15);
  const conversion = clamp(BASE_CONVERSION * staffFactor * (0.9 + 0.1 * m.quality), 0.4, 0.92);

  const capacity = Math.round(getMaxCustomers(setup) * 30 * m.capacity);
  const buyers = Math.min(Math.round(footfall * conversion), capacity);
  return { footfall, buyers, capacity, loc };
}

export function simulateMonth(
  setup: DemoSetup,
  d: MonthlyDecisionsInput,
  m: Multipliers,
  opts: { month: number; openingCash: number; loan: number; extensionSqft: number; active: ProductId[] },
): { result: MonthResult; loanAfter: number } {
  const { month, openingCash, extensionSqft, active } = opts;
  const { footfall, buyers, loc } = computeTraffic(setup, d, m, month);
  const mix = normalizedMix(active);

  let revenue = 0;
  let cogs = 0;
  let unitsSold = 0;
  let unitsUnsold = 0;
  let unitsExpired = 0;
  let phantomUnits = 0;
  const perProduct: MonthResult["perProduct"] = {};

  for (const id of active) {
    const p = productById(id);
    const purchase = d.purchases[id] ?? { qty: 0, tier: "t2" as const };
    const tier = TIER_TABLE[purchase.tier];
    const price = d.prices[id] ?? p.refPrice;

    const elasticity = clamp(Math.pow(p.refPrice / Math.max(0.1, price), 1.2), 0.5, 1.6);
    const demand = buyers * ITEMS_PER_BUYER * mix[id] * elasticity * (1 + tier.qualityLift * 0.5);

    const phantom = Math.round(purchase.qty * tier.phantomRate);
    const sellable = Math.max(0, purchase.qty - phantom);
    const sold = Math.min(Math.round(demand), sellable);
    const unsold = sellable - sold;
    const spoilRate = clamp(p.spoilBase * tier.spoilMult * (2 - m.wasteReduction), 0, 0.95);
    const expired = Math.round(unsold * spoilRate);

    const productRevenue = sold * price;
    const productCogs = purchase.qty * p.unitCost * (1 - tier.discount) + (purchase.qty > 0 ? tier.freight : 0);

    revenue += productRevenue;
    cogs += productCogs;
    unitsSold += sold;
    unitsUnsold += unsold;
    unitsExpired += expired;
    phantomUnits += phantom;
    perProduct[id] = {
      sold,
      revenue: Math.round(productRevenue),
      marginPct: productRevenue > 0 ? Math.round(((productRevenue - productCogs) / productRevenue) * 100) : 0,
      wasted: expired + phantom,
    };
  }

  const marketing = d.marketingSpend.value + d.marketingSpend.balanced + d.marketingSpend.premium;
  const rentDiscount = RENT_DISCOUNT[setup.rentPayment] ?? 0;
  const rent = (getMonthlyRent(setup) + loc.rent * extensionSqft) * DEMO_RENT_FACTOR * (1 - rentDiscount);
  const payroll = (Object.keys(d.staff) as StaffRole[]).reduce((s, role) => s + d.staff[role] * STAFF_COST[role] * 1.0, 0);

  let loan = opts.loan;
  let loanDraw = 0;
  if (d.banking === "credit-line") {
    loanDraw = LOAN_DRAW;
    loan += LOAN_DRAW;
  }
  const interest = loan * LOAN_INTEREST;
  const opex = (rent + payroll + FIXED_OPEX + interest) / m.costEfficiency;

  // pay-30-day defers 30% of COGS — modeled as a one-month cash timing benefit.
  const cogsCashOut = d.banking === "pay-30-day" ? cogs * 0.7 : cogs;

  const inflow = revenue + loanDraw;
  const outflow = cogsCashOut + opex + marketing;
  const closingCash = Math.round(openingCash + inflow - outflow);
  const burn = Math.max(0, Math.round(outflow - revenue));
  const netProfit = Math.round(revenue - cogs - opex - marketing);
  const retentionPct = Math.round(clamp(58 + (m.retention - 1) * 100 + (m.quality - 1) * 40 + 0.6 * (month - 1), 35, 92));

  const result: MonthResult = {
    month,
    revenue: Math.round(revenue),
    cogs: Math.round(cogs),
    opex: Math.round(opex),
    marketing,
    grossMarginPct: revenue > 0 ? Math.round(((revenue - cogs) / revenue) * 100) : 0,
    netProfit,
    unitsSold,
    unitsUnsold,
    unitsExpired,
    phantomLoss: phantomUnits,
    footfall,
    customers: buyers,
    retentionPct,
    openingCash: Math.round(openingCash),
    inflow: Math.round(inflow),
    outflow: Math.round(outflow),
    closingCash,
    burn,
    runwayMonths: burn > 0 ? Math.max(0, Math.round(closingCash / burn)) : 99,
    perProduct,
  };
  return { result, loanAfter: loan };
}

/* ───────────────────────── quarterly ───────────────────────── */

export interface InitiativeDef {
  id: QuarterlyInitiativeId;
  name: string;
  cost: number;
  effectLabel: string;
  apply: (m: Multipliers) => Multipliers;
}

export const QUARTERLY_INITIATIVES: InitiativeDef[] = [
  {
    id: "employeeInvestment", name: "Employee Investment", cost: 12000,
    effectLabel: "+6% retention · workforce stability",
    apply: (m) => ({ ...m, retention: m.retention + 0.06 }),
  },
  {
    id: "training", name: "Employee Training", cost: 9000,
    effectLabel: "+5% service quality",
    apply: (m) => ({ ...m, quality: m.quality + 0.05 }),
  },
  {
    id: "rnd", name: "R&D Investment", cost: 15000,
    effectLabel: "+4% demand · −2% COGS",
    apply: (m) => ({ ...m, demand: m.demand + 0.04, costEfficiency: m.costEfficiency + 0.02 }),
  },
  {
    id: "supplierRelationship", name: "Supplier Relationship", cost: 10000,
    effectLabel: "−8% waste · +3% cost efficiency",
    apply: (m) => ({ ...m, wasteReduction: m.wasteReduction + 0.08, costEfficiency: m.costEfficiency + 0.03 }),
  },
  {
    id: "acquisitionPush", name: "Customer Acquisition Push", cost: 14000,
    effectLabel: "+10% demand next quarter",
    apply: (m) => ({ ...m, demand: m.demand + 0.1 }),
  },
  {
    id: "opsOptimization", name: "Operations Optimization", cost: 11000,
    effectLabel: "+6% cost efficiency · less phantom loss",
    apply: (m) => ({ ...m, costEfficiency: m.costEfficiency + 0.06, wasteReduction: m.wasteReduction + 0.04 }),
  },
];

export const MAX_INITIATIVES_PER_QUARTER = 3;

export function applyQuarterlyDecisions(
  d: QuarterlyDecisionsInput,
  multipliers: Multipliers,
): { multipliers: Multipliers; cost: number } {
  let m = { ...multipliers };
  let cost = 0;
  for (const init of QUARTERLY_INITIATIVES) {
    if (d[init.id]) {
      m = init.apply(m);
      cost += init.cost;
    }
  }
  return { multipliers: m, cost };
}

export function summarizeQuarter(
  quarter: number,
  months: MonthResult[],
  initiativesCost: number,
): QuarterResult {
  const revenue = months.reduce((s, r) => s + r.revenue, 0);
  return {
    quarter,
    revenue: Math.round(revenue),
    avgMarginPct: Math.round(months.reduce((s, r) => s + r.grossMarginPct, 0) / Math.max(1, months.length)),
    retentionPct: months.length ? months[months.length - 1].retentionPct : 0,
    avgFootfall: Math.round(months.reduce((s, r) => s + r.footfall, 0) / Math.max(1, months.length)),
    initiativesCost,
  };
}

/* ───────────────────────── annual ───────────────────────── */

/** Provisional company value used for the VC offer before annual decisions are applied. */
export function provisionalValuation(history: DemoState["history"]): number {
  const results = history.map((h) => h.result);
  if (!results.length) return 400000;
  const annualRevenue = results.reduce((s, r) => s + r.revenue, 0);
  const q1 = results.slice(0, 3).reduce((s, r) => s + r.revenue, 0);
  const q4 = results.slice(-3).reduce((s, r) => s + r.revenue, 0);
  const growth = q1 > 0 ? (q4 - q1) / q1 : 0;
  const netMargin = annualRevenue > 0 ? results.reduce((s, r) => s + r.netProfit, 0) / annualRevenue : 0;
  return Math.round(annualRevenue * clamp(1 + 2 * growth, 0.6, 2.2) * clamp(0.6 + 3 * netMargin, 0.3, 1.8));
}

export function applyAnnualDecisions(
  d: AnnualDecisionsInput,
  state: Pick<DemoState, "cash" | "ownershipPct" | "extensionSqft" | "activeProducts" | "history">,
): { cash: number; ownershipPct: number; extensionSqft: number; activeProducts: ProductId[]; raiseAmount: number; swapCost: number; extensionCost: number } {
  let cash = state.cash;
  let ownershipPct = state.ownershipPct;
  let extensionSqft = state.extensionSqft;
  let activeProducts = [...state.activeProducts];

  const extensionCost = d.extensionSqft * EXTENSION_COST_PER_SQFT;
  if (d.extensionSqft > 0) {
    cash -= extensionCost;
    extensionSqft += d.extensionSqft;
  }

  let swapCost = 0;
  if (d.productSwap) {
    const { remove, add, stockDisposal } = d.productSwap;
    const lastMonth = state.history[state.history.length - 1];
    const unsold = lastMonth ? Math.max(0, (lastMonth.result.perProduct[remove]?.wasted ?? 0) + 40) : 40;
    const writeOff = unsold * productById(remove).unitCost;
    swapCost = Math.round(stockDisposal === "clearance" ? writeOff * 0.6 : writeOff);
    cash -= swapCost;
    activeProducts = activeProducts.map((p) => (p === remove ? add : p));
  }

  let raiseAmount = 0;
  if (d.vc.accept && d.vc.dilutionPct > 0) {
    raiseAmount = Math.round(provisionalValuation(state.history) * (d.vc.dilutionPct / 100));
    cash += raiseAmount;
    ownershipPct -= d.vc.dilutionPct;
  }

  return { cash: Math.round(cash), ownershipPct, extensionSqft, activeProducts, raiseAmount, swapCost, extensionCost };
}

/* ───────────────────────── valuation + leaderboard ───────────────────────── */

export interface RivalRow {
  team: string;
  founder: string;
  valuation: number;
  ownershipPct: number;
  cash: number;
  retentionPct: number;
  score: number;
}

export const RIVAL_TEAMS: Omit<RivalRow, "score">[] = [
  { team: "Mustang Beans", founder: "Asha Gurung", valuation: 1860000, ownershipPct: 82, cash: 310000, retentionPct: 78 },
  { team: "Pokhara Pour", founder: "Dev Shrestha", valuation: 1420000, ownershipPct: 90, cash: 240000, retentionPct: 71 },
  { team: "Dhaulagiri Spot", founder: "Mina Rai", valuation: 1100000, ownershipPct: 75, cash: 415000, retentionPct: 69 },
  { team: "Tilicho Trail", founder: "Kiran Thapa", valuation: 880000, ownershipPct: 100, cash: 150000, retentionPct: 62 },
  { team: "Machhapuchhre House", founder: "Sonam Lama", valuation: 640000, ownershipPct: 95, cash: 90000, retentionPct: 55 },
];

export function scoreRow(valuation: number, cash: number, retentionPct: number, netMarginPct: number): number {
  const v = clamp(valuation / 2500000, 0, 1) * 500;
  const c = clamp(cash / 500000, 0, 1) * 200;
  const r = clamp(retentionPct / 90, 0, 1) * 150;
  const m = clamp((netMarginPct + 20) / 40, 0, 1) * 150;
  return Math.round(v + c + r + m);
}

export function computeValuation(
  history: DemoState["history"],
  ownershipPct: number,
  closingCash: number,
): ValuationResult {
  const results = history.map((h) => h.result);
  const annualRevenue = results.reduce((s, r) => s + r.revenue, 0);
  const annualNetCash = results.reduce((s, r) => s + r.netProfit, 0);
  const avgMarginPct = Math.round(results.reduce((s, r) => s + r.grossMarginPct, 0) / Math.max(1, results.length));
  const q1 = results.slice(0, 3).reduce((s, r) => s + r.revenue, 0);
  const q4 = results.slice(-3).reduce((s, r) => s + r.revenue, 0);
  const growthPct = q1 > 0 ? Math.round(((q4 - q1) / q1) * 100) : 0;
  const netMarginPct = annualRevenue > 0 ? (annualNetCash / annualRevenue) * 100 : 0;

  const multiple = clamp(2 + 8 * (growthPct / 100) + 6 * (avgMarginPct / 100), 2, 12);
  const dcfValue = Math.round(
    annualRevenue * clamp(1 + 2 * (growthPct / 100), 0.6, 2.2) * clamp(0.6 + 3 * (netMarginPct / 100), 0.3, 1.8),
  );
  const ownerValue = Math.round(dcfValue * (ownershipPct / 100));
  const retention = results.length ? results[results.length - 1].retentionPct : 0;
  const finalScore = scoreRow(dcfValue, closingCash, retention, netMarginPct);

  const rivalScores = RIVAL_TEAMS.map((r) => scoreRow(r.valuation, r.cash, r.retentionPct, 5));
  const rank = 1 + rivalScores.filter((s) => s > finalScore).length;

  return {
    annualRevenue: Math.round(annualRevenue),
    annualNetCash: Math.round(annualNetCash),
    avgMarginPct,
    growthPct,
    multiple: Math.round(multiple * 10) / 10,
    dcfValue,
    ownershipPct,
    ownerValue,
    finalScore,
    rank,
  };
}
