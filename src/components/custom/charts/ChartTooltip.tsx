"use client";

/**
 * ThemedTooltip — Efferd-style chart tooltip rendered as a popover card.
 *
 * Surface = --color-popover, text = --color-popover-foreground / muted, border
 * = --color-border, elevation = --shadow-elev-2. Values are mono + tabular so
 * digits align. Each row carries a colour dot from the series token.
 *
 * Drop into any Recharts chart:
 *   <Tooltip cursor={tooltipCursor} content={<ThemedTooltip />} />
 */

import type { ReactNode } from "react";

type TooltipPayloadItem = {
  name?: string | number;
  value?: string | number;
  color?: string;
  dataKey?: string | number;
  payload?: Record<string, unknown>;
};

export interface ThemedTooltipProps {
  active?: boolean;
  label?: ReactNode;
  payload?: TooltipPayloadItem[];
  /** Optional per-value formatter (e.g. currency). */
  valueFormatter?: (value: number | string) => string;
  /** Hide the header row. */
  hideLabel?: boolean;
}

export function ThemedTooltip({
  active,
  label,
  payload,
  valueFormatter,
  hideLabel = false,
}: ThemedTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="tabular"
      style={{
        minWidth: "8rem",
        background: "var(--color-popover)",
        color: "var(--color-popover-foreground)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-elev-2)",
        padding: "8px 10px",
        fontFamily: "var(--font-ui)",
        fontSize: "12px",
        lineHeight: 1.35,
      }}
    >
      {!hideLabel && label != null && (
        <div
          style={{
            fontWeight: 600,
            marginBottom: 6,
            color: "var(--color-popover-foreground)",
          }}
        >
          {label}
        </div>
      )}

      <div style={{ display: "grid", gap: 4 }}>
        {payload.map((item, i) => {
          const v = item.value;
          const display =
            valueFormatter && v != null
              ? valueFormatter(v)
              : typeof v === "number"
                ? v.toLocaleString()
                : v;

          return (
            <div
              key={item.dataKey ?? item.name ?? i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  color: "var(--color-muted-foreground)",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    background: item.color ?? "var(--color-chart-1)",
                  }}
                />
                {item.name}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 500,
                  fontVariantNumeric: "tabular-nums",
                  color: "var(--color-foreground)",
                }}
              >
                {display}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
