/* Startup Valley /demo — phase machine, route map, legacy-nav aliases. */

import { DemoPhase, DemoState } from "./demo-types";

export const TOTAL_MONTHS = 12;

export const PHASE_ROUTE: Record<DemoPhase, string> = {
  landing: "/demo",
  training: "/demo/training",
  welcome: "/demo/welcome",
  "setup-basic": "/demo/setup/basic",
  "setup-location": "/demo/setup/location",
  "setup-capacity": "/demo/setup/capacity",
  "setup-employees": "/demo/setup/employees",
  "setup-marketing": "/demo/setup/marketing",
  "setup-payment": "/demo/setup/payment",
  "setup-summary": "/demo/setup/summary",
  "setup-loading": "/demo/setup/loading",
  "month-decisions": "/demo/month/decisions",
  "month-review": "/demo/month/review",
  "quarter-decisions": "/demo/quarter/decisions",
  "quarter-review": "/demo/quarter/review",
  "annual-decisions": "/demo/annual/decisions",
  "annual-review": "/demo/annual/review",
  "final-evaluation": "/demo/final",
  leaderboard: "/demo/leaderboard",
  complete: "/demo/leaderboard",
};

export function routeForPhase(phase: DemoPhase): string {
  return PHASE_ROUTE[phase];
}

export function nextPhase(s: Pick<DemoState, "phase" | "month">): { phase: DemoPhase; month: number } {
  switch (s.phase) {
    case "landing": return { phase: "training", month: 0 };
    case "training": return { phase: "welcome", month: 0 };
    case "welcome": return { phase: "setup-basic", month: 0 };
    case "setup-basic": return { phase: "setup-location", month: 0 };
    case "setup-location": return { phase: "setup-capacity", month: 0 };
    case "setup-capacity": return { phase: "setup-employees", month: 0 };
    case "setup-employees": return { phase: "setup-marketing", month: 0 };
    case "setup-marketing": return { phase: "setup-payment", month: 0 };
    case "setup-payment": return { phase: "setup-summary", month: 0 };
    case "setup-summary": return { phase: "setup-loading", month: 0 };
    case "setup-loading": return { phase: "month-decisions", month: 1 };
    case "month-decisions": return { phase: "month-review", month: s.month };
    case "month-review":
      if (s.month >= TOTAL_MONTHS) return { phase: "annual-decisions", month: TOTAL_MONTHS };
      if (s.month % 3 === 0) return { phase: "quarter-decisions", month: s.month };
      return { phase: "month-decisions", month: s.month + 1 };
    case "quarter-decisions": return { phase: "quarter-review", month: s.month };
    case "quarter-review": return { phase: "month-decisions", month: s.month + 1 };
    case "annual-decisions": return { phase: "annual-review", month: TOTAL_MONTHS };
    case "annual-review": return { phase: "final-evaluation", month: TOTAL_MONTHS };
    case "final-evaluation": return { phase: "leaderboard", month: TOTAL_MONTHS };
    case "leaderboard": return { phase: "complete", month: TOTAL_MONTHS };
    case "complete": return { phase: "complete", month: TOTAL_MONTHS };
  }
}

export function prevPhase(s: Pick<DemoState, "phase" | "month">): { phase: DemoPhase; month: number } | null {
  switch (s.phase) {
    case "welcome": return { phase: "training", month: 0 };
    case "setup-basic": return { phase: "welcome", month: 0 };
    case "setup-location": return { phase: "setup-basic", month: 0 };
    case "setup-capacity": return { phase: "setup-location", month: 0 };
    case "setup-employees": return { phase: "setup-capacity", month: 0 };
    case "setup-marketing": return { phase: "setup-employees", month: 0 };
    case "setup-payment": return { phase: "setup-marketing", month: 0 };
    case "setup-summary": return { phase: "setup-payment", month: 0 };
    case "setup-loading": return null;
    case "month-decisions": return null; // submitted months are locked
    case "month-review": return { phase: "month-decisions", month: s.month };
    case "quarter-decisions": return null;
    case "quarter-review": return { phase: "quarter-decisions", month: s.month };
    case "annual-decisions": return null;
    case "annual-review": return { phase: "annual-decisions", month: s.month };
    default: return null;
  }
}

export function quarterOf(month: number): number {
  return Math.max(1, Math.ceil(month / 3));
}

export function progressLabel(s: Pick<DemoState, "phase" | "month">): string {
  switch (s.phase) {
    case "landing": case "training": case "welcome": return "Getting started";
    case "setup-basic": case "setup-location": case "setup-capacity": case "setup-employees":
    case "setup-marketing": case "setup-payment": case "setup-summary": case "setup-loading":
      return "Business setup";
    case "quarter-decisions": case "quarter-review": return `Quarter ${quarterOf(s.month)} checkpoint`;
    case "annual-decisions": case "annual-review": return "Annual gate · Year 1";
    case "final-evaluation": return "Final evaluation";
    case "leaderboard": case "complete": return "Leaderboard";
    default: return `Month ${s.month} of ${TOTAL_MONTHS} · Q${quarterOf(s.month)}`;
  }
}

/* Legacy in-screen navigate() targets remapped while inside /demo.
 * These screens were authored against the old SPA router; the alias layer lets
 * them participate in the demo flow with zero component edits.
 *
 * Resolution kinds:
 *  - "phase": free navigation within the pre-game flow (setup steps can go back/forward)
 *  - "advance": the screen's primary CTA — drive the phase machine forward
 *  - "path": plain push (possibly remapped to a /demo path)
 */
export type DemoNavResolution =
  | { kind: "path"; path: string }
  | { kind: "phase"; phase: DemoPhase }
  | { kind: "advance" };

const PHASE_ALIASES: Record<string, DemoPhase> = {
  "/training": "training",
  "/welcome": "welcome",
  "/setup/basic": "setup-basic",
  "/setup/location": "setup-location",
  "/setup/capacity": "setup-capacity",
  "/setup/employees": "setup-employees",
  "/setup/marketing": "setup-marketing",
  "/setup/payment": "setup-payment",
  "/setup/summary": "setup-summary",
  "/setup/loading": "setup-loading",
};

const ADVANCE_ALIASES = new Set([
  "/game/cockpit",
  "/game/results",
  "/game/month-review",
  "/ref/game/performance-report", // QuarterlyReport's "decisions" CTA
]);

const PATH_ALIASES: Record<string, string> = {
  "/game/monthly-decisions": "/demo/month/decisions",
  "/ref/game/monthly-decisions": "/demo/month/decisions",
  "/ref/game/month-review": "/demo/month/review",
  "/ref/game/command-center": "/demo/month/command-center",
  "/ref/game/quarterly-report": "/demo/quarter/review",
  "/ref/game/leaderboard": "/demo/leaderboard",
  "/ref/game/final-evaluation": "/demo/final",
  "/ref/game/final-report": "/demo/leaderboard",
};

export function resolveDemoTarget(target: string): DemoNavResolution {
  const [path, query] = target.split("?");
  if (PHASE_ALIASES[path]) return { kind: "phase", phase: PHASE_ALIASES[path] };
  if (ADVANCE_ALIASES.has(path)) return { kind: "advance" };
  const remapped = PATH_ALIASES[path];
  if (remapped) return { kind: "path", path: query ? `${remapped}?${query}` : remapped };
  return { kind: "path", path: target };
}
