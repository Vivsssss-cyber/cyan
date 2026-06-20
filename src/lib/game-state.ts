export interface GameState {
  phase: "welcome" | "setup" | "playing" | "review";
  setupStage: number;
  currentWeek: number;
  teamName: string;
  location: number | null;
  spaceOption: number | null;
  employeeCount: number | null;
  marketingBudget: number | null;
  positioning: string | null;
  cashBalance: number;
  weeklyRevenue: number;
  runway: number;
  marketShare: number;
  decisionsLocked: boolean;
  showEventModal: boolean;
  activeEvent: unknown | null;
  facilitatorMode: boolean;
  weeklyDecisions: {
    marketingSpend: number;
    channelSplit: [number, number, number];
    avgPrice: number;
    discountLevel: number;
    salesMode: string;
    opsLevel: string;
    retentionActivity: string;
    hiringAction: string;
    workingCapital: string;
  };
}

export const LOCATIONS = [
  { id: 0, name: "Streets of Bagbazar", rent: 15, footfall: 500, premium: 30, regular: 70, competitorImpact: 10 },
  { id: 1, name: "Market Square", rent: 20, footfall: 600, premium: 25, regular: 75, competitorImpact: 15 },
  { id: 2, name: "Central Avenue", rent: 18, footfall: 700, premium: 35, regular: 65, competitorImpact: 5 },
  { id: 3, name: "Riverside Drive", rent: 22, footfall: 800, premium: 40, regular: 60, competitorImpact: 8 },
] as const;

export const SPACE_OPTIONS = [
  { id: 0, sqft: 2800, maxCustomers: 112 },
  { id: 1, sqft: 3200, maxCustomers: 128 },
  { id: 2, sqft: 3500, maxCustomers: 140 },
  { id: 3, sqft: 4000, maxCustomers: 160 },
] as const;

export const EMPLOYEE_OPTIONS = [3, 5, 7, 10] as const;
export const MARKETING_OPTIONS = [1, 2, 3, 5] as const;

export const defaultDecisions: GameState["weeklyDecisions"] = {
  marketingSpend: 3000,
  channelSplit: [40, 30, 30],
  avgPrice: 17,
  discountLevel: 10,
  salesMode: "Inside",
  opsLevel: "Standard",
  retentionActivity: "Customer Relationship",
  hiringAction: "None",
  workingCapital: "Pay 30-day",
};

export function getInitialGameState(): GameState {
  return {
    phase: "welcome",
    setupStage: 1,
    currentWeek: 7,
    teamName: "Team Alpha",
    location: null,
    spaceOption: null,
    employeeCount: null,
    marketingBudget: null,
    positioning: null,
    cashBalance: 412500,
    weeklyRevenue: 24800,
    runway: 18,
    marketShare: 28,
    decisionsLocked: false,
    showEventModal: false,
    activeEvent: null,
    facilitatorMode: false,
    weeklyDecisions: { ...defaultDecisions },
  };
}

export function getMonthlyRent(state: Pick<GameState, "location" | "spaceOption">) {
  if (state.location === null || state.spaceOption === null) return 0;
  return LOCATIONS[state.location].rent * SPACE_OPTIONS[state.spaceOption].sqft;
}

export function getWeeklyBurn(
  state: Pick<GameState, "location" | "spaceOption" | "employeeCount" | "marketingBudget">,
) {
  const rent = getMonthlyRent(state) / 4;
  const labour = (state.employeeCount || 0) * 800;
  const marketing = (state.marketingBudget || 0) * 1000;
  return rent + labour + marketing;
}

export function getRunway(
  state: Pick<GameState, "cashBalance" | "location" | "spaceOption" | "employeeCount" | "marketingBudget">,
) {
  const burn = getWeeklyBurn(state);
  if (burn === 0) return 999;
  return Math.floor(state.cashBalance / burn);
}

export function getMaxCustomers(state: Pick<GameState, "spaceOption">) {
  if (state.spaceOption === null) return 0;
  return SPACE_OPTIONS[state.spaceOption].maxCustomers;
}

export function getDerivedMetrics(state: GameState) {
  return {
    location: state.location === null ? null : LOCATIONS[state.location],
    space: state.spaceOption === null ? null : SPACE_OPTIONS[state.spaceOption],
    monthlyRent: getMonthlyRent(state),
    weeklyBurn: getWeeklyBurn(state),
    runway: getRunway(state),
    maxCustomers: getMaxCustomers(state),
  };
}

export function getReferenceData() {
  return {
    locations: LOCATIONS,
    spaceOptions: SPACE_OPTIONS,
    employeeOptions: EMPLOYEE_OPTIONS,
    marketingOptions: MARKETING_OPTIONS,
  };
}
