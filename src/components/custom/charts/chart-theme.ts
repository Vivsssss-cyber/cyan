/**
 * chart-theme — Efferd-inspired chart styling, fully native to the Startup Valley theme.
 *
 * Encodes the *structure / density / typography* of a premium analytics dashboard
 * (thin dashed horizontal grid, axis lines off, muted micro labels, soft gradient
 * area fills) — but every colour is a project token. No hex literals.
 *
 * Colours resolve to the tokens defined in `src/styles/theme.css`:
 *   --color-chart-1..6, --color-muted-foreground, --color-border, --color-popover…
 *
 * Use with the existing shadcn Recharts primitives in `../ui/chart`.
 */

import type { CSSProperties } from "react";

/* ── Series palette (token-driven) ──────────────────────────────────────────
 * Order matches the design system's chart ladder. Reference these instead of
 * hardcoding stroke/fill colours on <Line>/<Area>/<Bar>.
 *   1 cyan (primary) · 2 deep teal · 3 purple (data-viz only) ·
 *   4 amber (warning) · 5 coral (critical) · 6 soft teal (retention)
 */
export const CHART_SERIES = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  "var(--color-chart-6)",
] as const;

/** Semantic series tokens for success / warning / error data states. */
export const CHART_SEMANTIC = {
  positive: "var(--game-positive)",
  success: "var(--game-success)",
  warning: "var(--game-warning)",
  negative: "var(--game-negative)",
} as const;

/** Pick a series colour by index (wraps around the palette). */
export const seriesColor = (i: number): string =>
  CHART_SERIES[i % CHART_SERIES.length];

/* ── Density / spacing ──────────────────────────────────────────────────────
 * Tight Efferd-style insets — chart hugs the card, axis labels sit close.
 */
export const CHART_MARGIN = { top: 8, right: 8, left: -8, bottom: 0 } as const;
export const CHART_MARGIN_COMPACT = {
  top: 4,
  right: 4,
  left: -24,
  bottom: 0,
} as const;

/** Default plotting height for a card-framed chart. */
export const CHART_HEIGHT = 200;

/* ── Grid ───────────────────────────────────────────────────────────────────
 * Horizontal-only, thin dashed lines on the border token at low opacity.
 * Spread onto <CartesianGrid {...chartGrid} />.
 */
export const chartGrid = {
  strokeDasharray: "3 3",
  stroke: "var(--color-border)",
  strokeOpacity: 0.5,
  vertical: false,
} as const;

/* ── Axes ───────────────────────────────────────────────────────────────────
 * No axis line, no tick line, muted micro labels in the UI font.
 * Spread onto <XAxis {...chartAxis} /> / <YAxis {...chartAxis} />.
 */
const axisTick: CSSProperties = {
  fontSize: 10,
  fontFamily: "var(--font-ui)",
  fill: "var(--color-muted-foreground)",
};

export const chartAxis = {
  tick: axisTick as object,
  axisLine: false,
  tickLine: false,
  tickMargin: 8,
  minTickGap: 16,
} as const;

/* ── Series stroke weights ──────────────────────────────────────────────────
 * Primary series reads heavier; comparison/reference series stay thin.
 */
export const STROKE = { primary: 2, secondary: 1.5, reference: 1.25 } as const;

/* ── Hover dot ──────────────────────────────────────────────────────────────
 * Filled with the surface token, ringed in the series colour — the dot only
 * appears on hover (activeDot), matching the Efferd reveal-on-hover behaviour.
 */
export const activeDot = (color: string) =>
  ({
    r: 4,
    strokeWidth: 2,
    stroke: color,
    fill: "var(--color-card)",
  }) as const;

/* ── Tooltip cursor ─────────────────────────────────────────────────────────
 * Faint vertical guide on the border token (for line/area charts).
 */
export const tooltipCursor = {
  stroke: "var(--color-border)",
  strokeWidth: 1,
  strokeDasharray: "3 3",
} as const;

/** Rounded bar caps for bar series. */
export const BAR_RADIUS: [number, number, number, number] = [4, 4, 0, 0];
