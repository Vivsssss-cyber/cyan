'use client';

import React, { createContext, useContext, useEffect, useMemo, useReducer, ReactNode } from 'react';
import {
  AnnualDecisionsInput,
  DemoPhase,
  DemoSetup,
  DemoState,
  MonthlyDecisionsInput,
  QuarterlyDecisionsInput,
} from '../lib/demo/demo-types';
import { nextPhase, prevPhase, quarterOf } from '../lib/demo/demo-flow';
import {
  applyAnnualDecisions,
  applyQuarterlyDecisions,
  computeValuation,
  defaultMonthlyDecisions,
  recommendedPurchases,
  simulateMonth,
  summarizeQuarter,
} from '../lib/demo/sim-engine';
import { clearDemoState, getInitialDemoState, loadDemoState, saveDemoState } from '../lib/demo/demo-storage';

type DemoAction =
  | { type: 'START_GAME' }
  | { type: 'SET_SETUP'; patch: Partial<DemoSetup> }
  | { type: 'SETUP_COMPLETE' }
  | { type: 'UPDATE_MONTH_DRAFT'; patch: Partial<MonthlyDecisionsInput> }
  | { type: 'SUBMIT_MONTH' }
  | { type: 'UPDATE_QUARTER_DRAFT'; patch: Partial<QuarterlyDecisionsInput> }
  | { type: 'SUBMIT_QUARTER' }
  | { type: 'UPDATE_ANNUAL_DRAFT'; patch: Partial<AnnualDecisionsInput> }
  | { type: 'SUBMIT_ANNUAL' }
  | { type: 'ADVANCE' }
  | { type: 'BACK' }
  | { type: 'SET_TAB_LOCK'; tab: string; locked: boolean }
  | { type: 'GOTO_PHASE'; phase: DemoPhase }
  | { type: 'RESET' };

const PRE_GAME_PHASES: DemoPhase[] = [
  'landing', 'training', 'welcome',
  'setup-basic', 'setup-location', 'setup-capacity', 'setup-employees',
  'setup-marketing', 'setup-payment', 'setup-summary', 'setup-loading',
];

function advance(state: DemoState): DemoState {
  const next = nextPhase(state);
  let draftMonthly = state.draftMonthly;
  // Entering a fresh month: re-seed the draft with recommended purchases so the
  // player starts from a sensible baseline instead of zeros.
  if (next.phase === 'month-decisions' && next.month !== state.month) {
    draftMonthly = { ...state.draftMonthly, purchases: { ...state.draftMonthly.purchases } };
    const rec = recommendedPurchases(state.setup, draftMonthly, state.multipliers, next.month, state.activeProducts);
    for (const id of state.activeProducts) {
      draftMonthly.purchases[id] = { qty: rec[id], tier: draftMonthly.purchases[id]?.tier ?? 't2' };
    }
  }
  // Every fresh round of monthly decisions starts with all tabs unlocked.
  return { ...state, phase: next.phase, month: next.month, draftMonthly, lockedTabs: [] };
}

function reducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'START_GAME':
      return { ...getInitialDemoState(), phase: 'training' };

    case 'SET_SETUP':
      return { ...state, setup: { ...state.setup, ...action.patch } };

    case 'SETUP_COMPLETE': {
      const draftMonthly = defaultMonthlyDecisions(state.activeProducts);
      const rec = recommendedPurchases(state.setup, draftMonthly, state.multipliers, 1, state.activeProducts);
      for (const id of state.activeProducts) draftMonthly.purchases[id] = { qty: rec[id], tier: 't2' };
      return { ...state, phase: 'month-decisions', month: 1, draftMonthly, lockedTabs: [] };
    }

    case 'UPDATE_MONTH_DRAFT':
      return { ...state, draftMonthly: { ...state.draftMonthly, ...action.patch } };

    case 'SUBMIT_MONTH': {
      const { result, loanAfter } = simulateMonth(state.setup, state.draftMonthly, state.multipliers, {
        month: state.month,
        openingCash: state.cash,
        loan: state.loan,
        extensionSqft: state.extensionSqft,
        active: state.activeProducts,
      });
      return advance({
        ...state,
        cash: result.closingCash,
        loan: loanAfter,
        // banking actions are one-shot; reset to hold for the next month
        draftMonthly: { ...state.draftMonthly, banking: 'hold' },
        history: [...state.history, { decisions: state.draftMonthly, result }],
      });
    }

    case 'UPDATE_QUARTER_DRAFT':
      return { ...state, draftQuarterly: { ...state.draftQuarterly, ...action.patch } };

    case 'SUBMIT_QUARTER': {
      const { multipliers, cost } = applyQuarterlyDecisions(state.draftQuarterly, state.multipliers);
      const months = state.history.slice(-3).map((h) => h.result);
      const result = summarizeQuarter(quarterOf(state.month), months, cost);
      return advance({
        ...state,
        cash: state.cash - cost,
        multipliers,
        quarters: [...state.quarters, { decisions: state.draftQuarterly, result }],
        draftQuarterly: {
          employeeInvestment: false, training: false, rnd: false,
          supplierRelationship: false, acquisitionPush: false, opsOptimization: false,
        },
      });
    }

    case 'UPDATE_ANNUAL_DRAFT':
      return { ...state, draftAnnual: { ...state.draftAnnual, ...action.patch } };

    case 'SUBMIT_ANNUAL': {
      const applied = applyAnnualDecisions(state.draftAnnual, state);
      const valuation = computeValuation(state.history, applied.ownershipPct, applied.cash);
      return advance({
        ...state,
        cash: applied.cash,
        ownershipPct: applied.ownershipPct,
        extensionSqft: applied.extensionSqft,
        activeProducts: applied.activeProducts,
        annual: { decisions: state.draftAnnual, valuation },
      });
    }

    case 'SET_TAB_LOCK': {
      const set = new Set(state.lockedTabs);
      if (action.locked) set.add(action.tab); else set.delete(action.tab);
      return { ...state, lockedTabs: [...set] };
    }

    case 'ADVANCE':
      return advance(state);

    case 'BACK': {
      const prev = prevPhase(state);
      if (!prev) return state;
      return { ...state, phase: prev.phase, month: prev.month };
    }

    case 'GOTO_PHASE':
      // Free movement only within the pre-game flow (e.g. "Edit Setup").
      if (!PRE_GAME_PHASES.includes(action.phase) || !PRE_GAME_PHASES.includes(state.phase)) return state;
      return { ...state, phase: action.phase };

    case 'RESET':
      return getInitialDemoState();

    default:
      return state;
  }
}

interface DemoContextType {
  state: DemoState;
  dispatch: React.Dispatch<DemoAction>;
}

const DemoContext = createContext<DemoContextType | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => loadDemoState() ?? getInitialDemoState());

  useEffect(() => {
    if (state.phase === 'landing' && state.history.length === 0 && state.month === 0 && state.setup.location === null) {
      // Fresh initial state — only persist once the player actually starts.
      return;
    }
    saveDemoState(state);
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  const [mounted, setMounted] = React.useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoContextType {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used within a DemoProvider');
  return ctx;
}

/** Null outside the /demo provider — lets shared utilities stay inert on /ref routes. */
export function useDemoOptional(): DemoContextType | null {
  return useContext(DemoContext);
}

export function resetDemo() {
  clearDemoState();
}
