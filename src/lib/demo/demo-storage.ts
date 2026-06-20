/* Startup Valley /demo — localStorage persistence with version guard. */

import { DemoState, INITIAL_MULTIPLIERS } from "./demo-types";
import { DEFAULT_ACTIVE_PRODUCTS, defaultMonthlyDecisions } from "./sim-engine";

export const DEMO_STORAGE_KEY = "sv-demo-v1";

export const OPENING_CASH = 412500;

export function getInitialDemoState(): DemoState {
  return {
    version: 1,
    phase: "landing",
    month: 0,
    setup: {
      companyName: '', registrationNumber: '', domain: 'Food Industry',
      location: null, spaceOption: null, employeeCount: null, marketingBudget: null,
      rentPayment: 'monthly',
    },
    cash: OPENING_CASH,
    loan: 0,
    ownershipPct: 100,
    extensionSqft: 0,
    activeProducts: [...DEFAULT_ACTIVE_PRODUCTS],
    multipliers: { ...INITIAL_MULTIPLIERS },
    draftMonthly: defaultMonthlyDecisions(DEFAULT_ACTIVE_PRODUCTS),
    draftQuarterly: {
      employeeInvestment: false,
      training: false,
      rnd: false,
      supplierRelationship: false,
      acquisitionPush: false,
      opsOptimization: false,
    },
    draftAnnual: {
      extensionSqft: 0,
      productSwap: null,
      vc: { accept: false, dilutionPct: 10 },
    },
    history: [],
    quarters: [],
    annual: null,
    lockedTabs: [],
  };
}

export function loadDemoState(): DemoState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DEMO_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DemoState;
    if (parsed?.version !== 1 || typeof parsed.phase !== "string") return null;
    // Migrate states saved before per-tab locks existed.
    if (!Array.isArray(parsed.lockedTabs)) parsed.lockedTabs = [];
    return parsed;
  } catch {
    return null;
  }
}

export function saveDemoState(state: DemoState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage full / private mode — demo continues in memory */
  }
}

export function clearDemoState() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(DEMO_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
