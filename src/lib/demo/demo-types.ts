/* Startup Valley /demo — shared types for the light simulation + flow orchestration. */

export type ProductId = "bread" | "tea" | "butter" | "cheese" | "eggs" | "burger" | "croissant" | "juice" | "salad" | "wrap";

export type SegmentId = "value" | "balanced" | "premium";

export type SupplierTier = "t1" | "t2" | "t3";

export type BankingAction = "hold" | "credit-line" | "pay-30-day";

export type StaffRole = "service" | "kitchen" | "support" | "other";

export interface ProductDef {
  id: ProductId;
  name: string;
  unitCost: number;
  refPrice: number;
  /** Share of an average basket attributed to this product (active six sum to 1). */
  mixShare: number;
  /** Base monthly spoilage fraction of unsold stock. */
  spoilBase: number;
}

export interface TierDef {
  id: SupplierTier;
  name: string;
  discount: number;
  freight: number;
  qualityLift: number;
  spoilMult: number;
  phantomRate: number;
}

export interface MonthlyDecisionsInput {
  purchases: Record<ProductId, { qty: number; tier: SupplierTier }>;
  prices: Record<ProductId, number>;
  marketingSpend: Record<SegmentId, number>;
  targetAudience: SegmentId | "all";
  banking: BankingAction;
  staff: Record<StaffRole, number>;
}

export type QuarterlyInitiativeId =
  | "employeeInvestment"
  | "training"
  | "rnd"
  | "supplierRelationship"
  | "acquisitionPush"
  | "opsOptimization";

export type QuarterlyDecisionsInput = Record<QuarterlyInitiativeId, boolean>;

export interface AnnualDecisionsInput {
  extensionSqft: number;
  productSwap: { remove: ProductId; add: ProductId; stockDisposal: "clearance" | "discard" } | null;
  vc: { accept: boolean; dilutionPct: number };
}

export interface Multipliers {
  demand: number;
  retention: number;
  costEfficiency: number;
  quality: number;
  wasteReduction: number;
  capacity: number;
}

export interface MonthResult {
  month: number;
  revenue: number;
  cogs: number;
  opex: number;
  marketing: number;
  grossMarginPct: number;
  netProfit: number;
  unitsSold: number;
  unitsUnsold: number;
  unitsExpired: number;
  phantomLoss: number;
  footfall: number;
  customers: number;
  retentionPct: number;
  openingCash: number;
  inflow: number;
  outflow: number;
  closingCash: number;
  burn: number;
  runwayMonths: number;
  perProduct: Record<string, { sold: number; revenue: number; marginPct: number; wasted: number }>;
}

export interface QuarterResult {
  quarter: number;
  revenue: number;
  avgMarginPct: number;
  retentionPct: number;
  avgFootfall: number;
  initiativesCost: number;
}

export interface ValuationResult {
  annualRevenue: number;
  annualNetCash: number;
  avgMarginPct: number;
  growthPct: number;
  multiple: number;
  dcfValue: number;
  ownershipPct: number;
  ownerValue: number;
  finalScore: number;
  rank: number;
}

export type RentPayment = "monthly" | "quarterly" | "annually";

export type DemoPhase =
  | "landing"
  | "training"
  | "welcome"
  | "setup-basic"
  | "setup-location"
  | "setup-capacity"
  | "setup-employees"
  | "setup-marketing"
  | "setup-payment"
  | "setup-summary"
  | "setup-loading"
  | "month-decisions"
  | "month-review"
  | "quarter-decisions"
  | "quarter-review"
  | "annual-decisions"
  | "annual-review"
  | "final-evaluation"
  | "leaderboard"
  | "complete";

export interface DemoSetup {
  companyName: string;
  registrationNumber: string;
  domain: string;
  location: number | null;
  spaceOption: number | null;
  employeeCount: number | null;
  marketingBudget: number | null;
  rentPayment: RentPayment;
}

export interface DemoState {
  version: 1;
  phase: DemoPhase;
  /** Current month, 1..12. 0 until setup completes. */
  month: number;
  setup: DemoSetup;
  cash: number;
  loan: number;
  ownershipPct: number;
  extensionSqft: number;
  activeProducts: ProductId[];
  multipliers: Multipliers;
  draftMonthly: MonthlyDecisionsInput;
  draftQuarterly: QuarterlyDecisionsInput;
  draftAnnual: AnnualDecisionsInput;
  history: { decisions: MonthlyDecisionsInput; result: MonthResult }[];
  quarters: { decisions: QuarterlyDecisionsInput; result: QuarterResult }[];
  annual: { decisions: AnnualDecisionsInput; valuation: ValuationResult } | null;
  /** Ids of monthly-decision tabs the player has locked this month. Send Decisions
   * unlocks only when every tab is locked. Resets each new month. */
  lockedTabs: string[];
}

/** Monthly-decision tabs that must all be locked before decisions can be sent. */
export const MONTHLY_DECISION_TABS = ['supply', 'pricing', 'marketing', 'staffing', 'banking'] as const;

export const INITIAL_MULTIPLIERS: Multipliers = {
  demand: 1,
  retention: 1,
  costEfficiency: 1,
  quality: 1,
  wasteReduction: 1,
  capacity: 1,
};
