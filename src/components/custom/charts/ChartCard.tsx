"use client";

/**
 * ChartCard — card framing around a chart, in the Startup Valley glass style.
 *
 * Efferd-inspired header density (eyebrow + title + optional KPI value on the
 * right), then the plotted chart, then an optional legend row. Every surface,
 * border, radius and text colour is a project token — no hex, no new palette.
 *
 *   <ChartCard title="Revenue & Costs" subtitle="12-month trend"
 *              value="$148k" trend={{ dir: "up", label: "+12%" }}>
 *     <ResponsiveContainer height={CHART_HEIGHT}>…</ResponsiveContainer>
 *     <ChartLegend items={[{ color: seriesColor(0), label: "Revenue" }]} />
 *   </ChartCard>
 */

import type { ReactNode } from "react";

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  /** Eyebrow chip text above the title (SectionLabel pattern). */
  eyebrow?: string;
  /** Optional KPI value shown top-right, rendered tabular. */
  value?: ReactNode;
  /** Optional delta indicator next to the value. */
  trend?: { dir: "up" | "down" | "flat"; label: string };
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const trendColor: Record<NonNullable<ChartCardProps["trend"]>["dir"], string> = {
  up: "var(--game-positive)",
  down: "var(--game-negative)",
  flat: "var(--color-muted-foreground)",
};

export function ChartCard({
  title,
  subtitle,
  eyebrow,
  value,
  trend,
  children,
  className,
  style,
}: ChartCardProps) {
  return (
    <div
      className={className}
      style={{
        background: "var(--color-card)",
        border: "var(--game-card-border)",
        borderRadius: "var(--radius-2xl)",
        boxShadow: "var(--shadow-elev-1)",
        padding: 20,
        ...style,
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <div>
          {eyebrow && (
            <span
              style={{
                display: "inline-block",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: 0.6,
                textTransform: "uppercase",
                color: "var(--game-teal-mid)",
                background: "var(--color-secondary)",
                borderRadius: "var(--radius-sm)",
                padding: "2px 8px",
                marginBottom: 8,
              }}
            >
              {eyebrow}
            </span>
          )}
          <h4
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--color-card-foreground)",
              margin: 0,
            }}
          >
            {title}
          </h4>
          {subtitle && (
            <p
              style={{
                fontSize: 12,
                color: "var(--color-muted-foreground)",
                margin: "2px 0 0",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {value != null && (
          <div style={{ textAlign: "right" }}>
            <div
              className="tabular"
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "var(--color-foreground)",
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1.1,
              }}
            >
              {value}
            </div>
            {trend && (
              <div
                className="tabular"
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: trendColor[trend.dir],
                  marginTop: 2,
                }}
              >
                {trend.label}
              </div>
            )}
          </div>
        )}
      </header>

      {children}
    </div>
  );
}

/* ── Legend ──────────────────────────────────────────────────────────────── */

export interface ChartLegendItem {
  color: string;
  label: string;
}

export function ChartLegend({
  items,
  className,
}: {
  items: ChartLegendItem[];
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 16,
        marginTop: 12,
      }}
    >
      {items.map((it) => (
        <LegendDot key={it.label} color={it.color} label={it.label} />
      ))}
    </div>
  );
}

export function LegendDot({ color, label }: ChartLegendItem) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        color: "var(--color-muted-foreground)",
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: 2,
          background: color,
        }}
      />
      {label}
    </span>
  );
}
