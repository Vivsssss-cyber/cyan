# Design System: Startup Valley (Stitch Generation Brief)

> Single source of truth for generating new Startup Valley screens in Google Stitch.
> Derived from the live `/demo` implementation (`src/components/demo/` + setup/report screens).
> A dense, command-center simulation-game dashboard. Glass surfaces over a textured cyan canvas.
> Read this fully before generating any screen. The bans matter as much as the rules.

---

## 1. Visual Theme & Atmosphere

A **cockpit-dense command center** for running a startup month by month. The mood is
clinical-but-warm: a well-lit operations room, not a neon trading terminal. Frosted-glass
panels float over a faint grid-textured cyan-gray canvas. Everything reads as instrument
panel — KPIs, charts, decision surfaces — packed tight but breathing through generous
internal padding and asymmetric layout.

- **Density: 8/10** — Cockpit dense. Many panels, tight rows, tabular numbers everywhere.
- **Variance: 6/10** — Offset asymmetric. No 3-equal-column grids. Splits favor a dominant
  reading column plus a narrower rail.
- **Motion: 4/10** — Fluid but restrained. Spring-physics lift on hover, staggered card
  reveals on mount. No perpetual flashing, no cinematic choreography. Calm under data load.

The accent is a single confident cyan. It marks what is interactive or active — nothing else.

---

## 2. Color Palette & Roles

**Neutrals & surfaces**
- **Grid Canvas** (`#EFF2F4`) — Page background. Carries a faint engineering-grid texture.
- **Glass Surface** (`rgba(255,255,255,0.6)`) — Default card/panel fill. Frosted, semi-opaque.
- **Solid Surface** (`#FFFFFF`) — Opaque panels, modals, popovers.
- **Whisper Border** (`#C8DDE6`) — Structural 1px borders, dividers, input outlines.
- **Card Edge** (`1.4px solid #FFFFFF`) — Signature glass-card border (bright white, not gray).

**Ink / text**
- **Deep Teal Ink** (`#002C33`) — Headlines, primary numbers. This is the "black" — never `#000`.
- **Body Ink** (`#202326`) — Primary body text.
- **Muted Steel** (`#606569`) — Secondary text, descriptions, labels.
- **Faint Steel** (`#94A3B8`) — Placeholders, timestamps, disabled metadata.

**Accent (single, cyan)**
- **Cyan Bright** (`#00D2FF`) — Hover-peak accent, brightest highlights.
- **Cyan Primary** (`#00C1EB`) — Primary interactive accent: focus rings, active states, links.
- **Cyan Tint** (`#E0F7FF`) — Subtle fills: tags, chips, hover backgrounds, selected tints.
- **CTA Gradient** (`linear-gradient(180deg, #00B1D6, #0090AD)`) — The ONE filled-button surface.

**Deep teals (structure, dark zones)**
- **Teal Mid** (`#006E85`) — Section eyebrow labels, active deep states.
- **Teal Dark** (`#003D47`) — Sidebar, dark panels, strategic gradient end.

**Semantic states**
- **Positive** (`#156162`) — Revenue up, retention gain.
- **Success** (`#166534`) — Confirmed/complete.
- **Negative** (`#C65252`) — Cost up, turnover, danger.
- **Warning** (`#B45309`) — Phantom stock, lag, unsold.

**Rules:** One accent (cyan), saturation under 80%. Purple (`#7C3AED`) is permitted ONLY in
chart data series, never in UI chrome. No neon glows. No `#000000`. Single palette throughout —
no warm/cool gray drift.

---

## 3. Typography Rules

- **Display / Headlines:** `Outfit` — weights 800, track-tight (`letter-spacing: -0.5px`),
  line-height 1.2–1.3. Hierarchy comes from weight + color, not screaming size.
- **Body:** `Outfit` — weights 400–600, line-height 1.5, max ~65ch per line. Muted Steel for
  secondary copy.
- **Numbers (mandatory at this density):** all KPIs, currency, counts use
  `font-variant-numeric: tabular-nums` so columns align. This is non-negotiable in cockpit-dense UI.
- **Section eyebrow pattern:** small uppercase label (`letter-spacing: 1.5–2px`, weight 700,
  Teal Mid) sitting above a bold title. The signature section header.
- **Mono:** reserved for code/raw config only (`Courier New` fallback) — prefer tabular Outfit
  for displayed numbers.

**Banned:** `Inter`, generic system sans for primary UI, ALL serif fonts (this is a dashboard),
emojis as iconography.

---

## 4. Component Stylings

**Unified button system (4 variants — no shadows, no glow on any state):**
- **CTA (primary):** Cyan `CTA Gradient` fill, pill radius `43px`, white text + small white
  arrow chip. Hover: `brightness(1.07)` + `translateY(-1px)`. Active: settles to `translateY(0)`.
  No box-shadow, ever.
- **Outline (secondary):** White fill, `1.4px solid` whisper border, pill radius. Hover:
  `translateY(-1px)` only. No shadow.
- **Ghost (nav/icon):** Transparent, 8px radius, Muted Steel text. Hover: text darkens +
  `rgba(0,44,51,0.05)` background tint. For Back/Reset/inline nav.
- **Bank/solid pill:** Solid dark radial-fill pill for special secondary actions. Hover:
  `brightness(1.14)`. No shadow.
- Focus-visible on all: `2px solid #00C1EB` outline, `2px` offset.

**Cards / panels:**
- Glass Surface fill, `1.4px solid #FFFFFF` border, radius `16px`, padding `20px`.
- Elevation via the ladder only when hierarchy demands it:
  `elev-1: 0 2px 4px rgba(0,0,0,.04)` → `elev-2: 0 3px 8px rgba(0,0,0,.06)`.
- **Selected state:** border shifts to `1.4px solid rgba(21,97,98,0.33)` + cyan-tinted
  `elev-3: 0 2.5px 10px rgba(77,181,182,.29)`. Accent shown as edge + tint, NOT a left ribbon.
- Hover lift on interactive cards: `translateY(-2px)` spring — no shadow bloom.

**Inputs:** Label always ABOVE field (never floating). `#F0F6FA` fill, whisper border, radius
8px. Focus ring cyan. Error text below.

**Loaders:** Skeletal shimmer matching exact panel dimensions. NO circular spinners.

**Empty states:** Composed mini-compositions showing how to populate, not bare "No data".

---

## 5. Layout Principles

- **Asymmetric CSS Grid.** A dominant content column + a narrower rail/cadence column.
  Never 3 equal columns.
- Max page width `1312px`, centered. Generous internal panel padding (`20px`+).
- Every element owns its spatial zone — no overlapping, no absolute-stacked content.
- Grid over flexbox percentage math. No `calc()` width hacks.
- KPI rows: tight horizontal strips of glass tiles, accent shown as a small label dot
  (anti-ribbon rule — no `border-left: 4px solid accent` on stat cards).
- Full-height regions use `min-h-[100dvh]`, never `h-screen`.

---

## 6. Motion & Interaction

- **Spring physics** for lifts and reveals (`stiffness ~100, damping ~20`) — weighty, calm.
- **Staggered cascade** on card-list mount (waterfall reveal), not instant pop-in.
- **Hover feedback** = `translateY` lift + subtle `brightness`/tint. Transitions `.12–.2s`.
- Animate `transform` + `opacity` only. Never `top/left/width/height`.
- Respect `prefers-reduced-motion: reduce` — kill all transitions.
- No perpetual loops, no flashing dashboards, no neon pulse.

---

## 7. Anti-Patterns (Banned)

- No box-shadow glow / outer glow on ANY button, any state.
- No `border-left: 4px solid <accent>` ribbon on KPI/stat cards (flat glass + label dot only).
- No emojis — Lucide-style line icons only.
- No `Inter`, no serif fonts (dashboard context).
- No pure black `#000000` — use `#002C33`.
- No purple `#7C3AED` in UI chrome (chart data series only).
- No 3-equal-column card grids.
- No floating input labels.
- No circular loading spinners — skeletal shimmer only.
- No centered hero layouts — left-aligned / asymmetric split.
- No border-radius > 24px on interface components (pill buttons exempt).
- No AI copy clichés ("Elevate", "Seamless", "Unleash", "Next-Gen").
- No oversaturated accents, no gradient text on headers.
- No fake round numbers in KPIs — use realistic simulated values.
- No broken image links — SVG/placeholder assets only.
