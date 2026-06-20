# Cyan shadcn Chart Theme — Reusable Prompt

Apply this to restyle any charts/infographics into our single-accent cyan chart
language. Reference implementation: `src/app/components/QuarterlyReport.tsx`.

---

## Prompt (copy-paste, swap in the target)

Redesign the charts/infographics in `<FILE or ROUTE>` into our single-accent cyan
chart language. Keep the project design system intact (light glass cards,
`--game-*` / `--sv-*` tokens, Outfit font, 16px card radius, `1312px` max width).
**Do not change any data — numbers, values, titles, labels, or copy stay exactly
as-is.** Only restyle form, color, spacing, and interaction.

### Color
- One cyan focus + a cohesive ramp: `--color-chart-1` (brand cyan) → `--cyan-deep`
  → `--color-chart-2` (teal) → `--color-chart-6` (soft teal) →
  `--color-muted-foreground` (grey). Use this ramp for categorical series; idx 0 is
  the cyan focus.
- No multi-hue rainbow, no greyscale hatching/stippling/textures.
- Keep semantic colors ONLY where meaning is intrinsic: P&L red burn
  (`--game-negative` / `--color-chart-5`), green profit (`--game-positive`).
  Everything categorical → cyan ramp.

### Shapes & fills
- **Lines:** smooth monotone curves (Catmull-Rom→bézier), not jagged polylines.
  Cyan focus line + soft gradient area fill to baseline; supporting lines in the
  cyan family; dotted gridlines (`stroke-dasharray 1,5`).
- **Bars:** vertical fade gradient (top `0.95` → bottom `0.5` opacity), rounded
  tops (rx 6–8), narrower than default (~0.42 of slot), real X baseline + Y-axis
  ticks with units.
- **Donuts:** clean ring on the cyan ramp, side legend with a rounded vertical
  accent **tick** in the series color (no dots), card-colored slice strokes.
- **Funnels:** one smooth tapering cyan gradient band, centered % pill per stage,
  value above + label below.
- **Radar / gauge:** filled cyan polygon w/ vertex dots; gauges as radiating tick
  rings (cyan fills to value, grey beyond).

### Interaction
- Hover lifts the card (`translateY(-3px)` + soft shadow).
- Hovered chart element: cyan glow (`drop-shadow`), dim siblings to ~0.5, grow
  node/marker.
- Cursor-following tooltip: semi-transparent ink card
  (`color-mix(in srgb, var(--game-dark) 90%, transparent)`), white text, label +
  bold value.

### Layout / spacing
- Prefer asymmetric **bento** rows (e.g. `1fr / 1.5fr`, offset wide cells on
  diagonals) over equal columns. No 3-equal-column grids.
- Generous, even padding; no cramped clusters; no large empty dead space — size
  cells to content.
- Strip wordy chart captions/insights at the lower end; keep numbers as compact
  key/value rows.

### Anti-patterns
No hardcoded hex in components, no emojis (Lucide only), no left-accent ribbon on
stat cards, no circular spinners, no `var()+"14"` string concat for tints (use
`color-mix`).

Build shared primitives once (`smoothPath`, gradient defs, cursor `Tooltip` +
`useTip`, hover-lift CSS) and reuse across every chart.

---

## Shared primitives (from QuarterlyReport.tsx)

- `smoothPath(pts)` — Catmull-Rom → cubic bézier for line/area/sparkline curves.
- `CYAN_RAMP` / `rampFill(i)` — categorical color ramp.
- `BarGradients` — vertical fade `<defs>` (`qr-bar-cyan|rose|emerald|teal`).
- `LegendTick` — rounded vertical accent swatch.
- `useTip` + `Tooltip` — cursor-following popover.
- `QR_CSS` — `.qr-lift` hover, `.qr-seg` / `.qr-shape` transitions.
