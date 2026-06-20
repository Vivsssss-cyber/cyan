'use client';

import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';

/* ──────────────────────────────────────────────────────────────────────
   CyanSim — flow state for the /sim screens.
   Carries cross-screen selections so each click path feels real
   (scenario persists Library→Wizard→Live; decision + rationale persist
   Decide→Review→Submit). Not the full sim engine.
   ──────────────────────────────────────────────────────────────────── */

export interface Scenario {
  id: string;
  title: string;
  subject: string;
  durationLabel: string;
  durationMin: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tier: 1 | 2 | 3;
  objectives: string[];
  modules: string[];
  teamsDefault: number;
  summary: string;
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'intro-supply-chain',
    title: 'Intro to Supply Chain',
    subject: 'Supply Chain',
    durationLabel: '90 min',
    durationMin: 90,
    level: 'Beginner',
    tier: 2,
    objectives: ['Cash-flow basics', 'Demand sensing', 'Inventory trade-offs'],
    modules: ['Procurement', 'Warehouse', 'Finance'],
    teamsDefault: 6,
    summary:
      'A single-product retailer must balance ordering, storage cost, and cash as demand shifts week to week. Built for first-time players — no prior exposure needed.',
  },
  {
    id: 'fmcg-competition',
    title: 'FMCG Competition',
    subject: 'Marketing',
    durationLabel: '3 weeks',
    durationMin: 270,
    level: 'Intermediate',
    tier: 3,
    objectives: ['Pricing power', 'Market share', 'Margin discipline'],
    modules: ['Marketing', 'Retail', 'Operations', 'Finance'],
    teamsDefault: 6,
    summary:
      'Teams run competing FMCG brands in a shared market. A new value-segment entrant and a 6% input-cost shock force pricing and spend discipline across three rounds.',
  },
  {
    id: 'finance-fundamentals',
    title: 'Finance Fundamentals',
    subject: 'Finance',
    durationLabel: 'Semester',
    durationMin: 600,
    level: 'Advanced',
    tier: 3,
    objectives: ['Working capital', 'Financing mix', 'Valuation'],
    modules: ['Finance', 'Procurement', 'Operations'],
    teamsDefault: 5,
    summary:
      'A semester-length arc covering working capital, financing decisions, and end-of-year valuation. Designed for cohorts that meet weekly.',
  },
  {
    id: 'retail-launch-sprint',
    title: 'Retail Launch Sprint',
    subject: 'Retail',
    durationLabel: 'Half-day',
    durationMin: 240,
    level: 'Beginner',
    tier: 1,
    objectives: ['Assortment', 'Footfall to sales', 'Promo timing'],
    modules: ['Retail', 'Marketing'],
    teamsDefault: 4,
    summary:
      'Open a pop-up retail store and turn footfall into sales over a compressed half-day. The fastest scenario to run with a brand-new class.',
  },
];

/* ── Decision model (deck Module 4: six decision areas) ──────────────── */
export type AreaId = 'marketing' | 'product' | 'pricing' | 'operations' | 'supply' | 'finance';
export const DECISION_AREAS: { id: AreaId; label: string }[] = [
  { id: 'marketing', label: 'Marketing' },
  { id: 'product', label: 'Product' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'operations', label: 'Operations' },
  { id: 'supply', label: 'Supply Chain' },
  { id: 'finance', label: 'Finance' },
];

export interface DecisionDraft {
  adSpend: number;
  channels: { digital: number; social: number; tv: number; events: number };
  productTier: 'Value' | 'Core' | 'Premium Eco';
  price: number;
  operations: 'Balanced' | 'High Efficiency' | 'Max Output';
  supply: 'Lean' | 'Balanced' | 'Resilient';
  finance: 'Conservative' | 'Balanced' | 'Aggressive';
}

export const TOTAL_BUDGET = 1_000_000;

const defaultDecision: DecisionDraft = {
  adSpend: 620_000,
  channels: { digital: 40, social: 30, tv: 20, events: 10 },
  productTier: 'Premium Eco',
  price: 59.99,
  operations: 'High Efficiency',
  supply: 'Balanced',
  finance: 'Conservative',
};

/** One-line summary of an area's current value, for the review screen. */
export function areaSummary(d: DecisionDraft, id: AreaId): string {
  switch (id) {
    case 'marketing': return `$${d.adSpend.toLocaleString()} ad spend`;
    case 'product': return `${d.productTier} line`;
    case 'pricing': return `$${d.price.toFixed(2)}`;
    case 'operations': return d.operations;
    case 'supply': return d.supply;
    case 'finance': return d.finance;
  }
}

/* ── Per-area + overall rationale ────────────────────────────────────── */
export interface TabRationale {
  method: 'voice' | 'text';
  transcript: string;
}

export interface RationaleState {
  transcript: string;  // typed strategy rationale (#61)
  voice: string;       // voice-note transcript (#62)
  assumptions: string; // assumption capture (#63)
  confidence: number;  // 0 = unset, 1..10 (#64)
  submitted: boolean;
}

const defaultRationale: RationaleState = { transcript: '', voice: '', assumptions: '', confidence: 0, submitted: false };

interface SimContextType {
  scenario: Scenario | null;
  setScenario: (s: Scenario) => void;
  decision: DecisionDraft;
  patchDecision: (p: Partial<DecisionDraft>) => void;
  rationale: RationaleState;
  patchRationale: (p: Partial<RationaleState>) => void;
  tabRationale: Record<string, TabRationale>;
  patchTabRationale: (tab: string, p: Partial<TabRationale>) => void;
  reset: () => void;
}

const SimContext = createContext<SimContextType | null>(null);

export function SimProvider({ children }: { children: ReactNode }) {
  const [scenario, setScenarioState] = useState<Scenario | null>(SCENARIOS[1]);
  const [decision, setDecision] = useState<DecisionDraft>(defaultDecision);
  const [rationale, setRationale] = useState<RationaleState>(defaultRationale);
  const [tabRationale, setTabRationale] = useState<Record<string, TabRationale>>({});

  const value = useMemo<SimContextType>(
    () => ({
      scenario,
      setScenario: (s) => setScenarioState(s),
      decision,
      patchDecision: (p) => setDecision((d) => ({ ...d, ...p, channels: { ...d.channels, ...(p.channels ?? {}) } })),
      rationale,
      patchRationale: (p) => setRationale((r) => ({ ...r, ...p })),
      tabRationale,
      patchTabRationale: (tab, p) =>
        setTabRationale((t) => ({ ...t, [tab]: { method: 'voice', transcript: '', ...t[tab], ...p } })),
      reset: () => {
        setScenarioState(SCENARIOS[1]);
        setDecision(defaultDecision);
        setRationale(defaultRationale);
        setTabRationale({});
      },
    }),
    [scenario, decision, rationale, tabRationale],
  );

  return <SimContext.Provider value={value}>{children}</SimContext.Provider>;
}

export function useSim(): SimContextType {
  const ctx = useContext(SimContext);
  if (!ctx) throw new Error('useSim must be used within a SimProvider');
  return ctx;
}
