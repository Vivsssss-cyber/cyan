/* Startup Valley /demo — onboarding option data (mirrors the Figma setup stages).
 * Option indices map back onto game-state constants (SPACE_OPTIONS, EMPLOYEE_OPTIONS,
 * MARKETING_OPTIONS) so the sim economics stay consistent. */

import { LOCATIONS, SPACE_OPTIONS, EMPLOYEE_OPTIONS, MARKETING_OPTIONS } from "../game-state";
import { RentPayment } from "./demo-types";

export const COMPANY_DOMAINS = [
  "Food Industry",
  "Retail & Grocery",
  "Cafe & Beverage",
  "Bakery",
  "Quick Service",
];

/* Per-location stats not held in game-state (sourcing + base wage), keyed by location index. */
export const LOCATION_EXTRA: Record<number, { sourcingDistance: number; baseWage: number }> = {
  0: { sourcingDistance: 10, baseWage: 10 },
  1: { sourcingDistance: 12, baseWage: 12 },
  2: { sourcingDistance: 8, baseWage: 11 },
  3: { sourcingDistance: 15, baseWage: 13 },
};

export function locationStats(i: number) {
  const l = LOCATIONS[i];
  const x = LOCATION_EXTRA[i];
  return [
    { label: "Rent per sq feet", value: `$${l.rent}`, lead: true },
    { label: "Premium Customers", value: `${l.premium}%` },
    { label: "Avg Footfall", value: `${l.footfall}` },
    { label: "Competitors Impact", value: `${l.competitorImpact}%` },
    { label: "Sourcing Distance in miles", value: `${x.sourcingDistance}` },
    { label: "Base Employment Cost", value: `$${x.baseWage}` },
  ];
}

/* Stage 3 — capacity. Display order + monthly rent per the design; spaceIndex maps to SPACE_OPTIONS. */
export const CAPACITY_OPTIONS: { sqft: number; monthlyRent: number; spaceIndex: number }[] = [
  { sqft: 3500, monthlyRent: 15000, spaceIndex: 2 },
  { sqft: 2800, monthlyRent: 12000, spaceIndex: 0 },
  { sqft: 3200, monthlyRent: 14000, spaceIndex: 1 },
  { sqft: 4000, monthlyRent: 18000, spaceIndex: 3 },
];

export function capacityRent(spaceIndex: number | null): number {
  if (spaceIndex === null) return 0;
  return CAPACITY_OPTIONS.find((o) => o.spaceIndex === spaceIndex)?.monthlyRent ?? 0;
}

/* Stage 4 — employee count. */
export const EMPLOYEE_OB: { count: number; laborHours: number }[] = [
  { count: EMPLOYEE_OPTIONS[0], laborHours: 90 },
  { count: EMPLOYEE_OPTIONS[1], laborHours: 100 },
  { count: EMPLOYEE_OPTIONS[2], laborHours: 150 },
  { count: EMPLOYEE_OPTIONS[3], laborHours: 210 },
];

export const PAYROLL_PER_EMPLOYEE = 3000;
export function payrollCost(count: number | null): number {
  return (count ?? 0) * PAYROLL_PER_EMPLOYEE;
}

/* Stage 5 — marketing % of capital. */
export const MARKETING_OB: { pct: number; budget: number }[] = [
  { pct: MARKETING_OPTIONS[0], budget: 1000 },
  { pct: MARKETING_OPTIONS[1], budget: 2000 },
  { pct: MARKETING_OPTIONS[2], budget: 3000 },
  { pct: MARKETING_OPTIONS[3], budget: 5000 },
];

export function marketingBudget(pct: number | null): number {
  return MARKETING_OB.find((o) => o.pct === pct)?.budget ?? (pct ?? 0) * 1000;
}

/* Stage 6 — rent payment mode. */
export const PAYMENT_OPTIONS: { mode: RentPayment; label: string; discount: number; sub: string }[] = [
  { mode: "monthly", label: "Monthly", discount: 0, sub: "No discount" },
  { mode: "quarterly", label: "Quarterly", discount: 0.15, sub: "15% discount" },
  { mode: "annually", label: "Annually", discount: 0.2, sub: "20% discount" },
];

/** Estimated opening monthly fixed cost across selections (rent after discount + payroll + marketing). */
export function estimatedMonthlyCost(setup: {
  spaceOption: number | null;
  employeeCount: number | null;
  marketingBudget: number | null;
  rentPayment: RentPayment;
}): number {
  const discount = PAYMENT_OPTIONS.find((p) => p.mode === setup.rentPayment)?.discount ?? 0;
  const rent = capacityRent(setup.spaceOption) * (1 - discount);
  return Math.round(rent + payrollCost(setup.employeeCount) + marketingBudget(setup.marketingBudget));
}
