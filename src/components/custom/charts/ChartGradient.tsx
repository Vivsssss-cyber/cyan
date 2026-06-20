"use client";

/**
 * AreaGradient — token-driven vertical fill for Recharts <Area> series.
 *
 * Soft Efferd-style wash: series colour at low opacity up top, fading to
 * transparent. Colour comes from a project token (e.g. seriesColor(0)).
 *
 *   <defs>{null}</defs> is handled internally — just render inside the chart:
 *     <AreaGradient id="rev" color={seriesColor(0)} />
 *     <Area fill="url(#rev)" stroke={seriesColor(0)} … />
 */

export interface AreaGradientProps {
  id: string;
  color: string;
  /** Top stop opacity (default 0.18 — the Efferd-style faint wash). */
  topOpacity?: number;
}

export function AreaGradient({ id, color, topOpacity = 0.18 }: AreaGradientProps) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity={topOpacity} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}
