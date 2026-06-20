# Design System: Startup Valley

> Source of truth for all Stitch screen generation and component work.  
> All values verified against `/src/styles/theme.css` and live components at `/design-system`.

---

## 1. Visual Theme & Atmosphere

Futuristic command center. Dense, data-forward simulation game interface packed with live metrics, KPI ribbons, and decision surfaces. Cool navy foundations with a single vibrant cyan accent. UI density: medium-high — every screen earns its data without feeling claustrophobic. Movement is weighted, feedback instant. Asymmetric grids with deliberate breathing room. Mood: authoritative control room — every metric is a live feed, every button triggers real change. Glass-surface cards float over a muted grid-textured canvas.

**Density:** 7/10 | **Variance:** 7/10 | **Motion:** 5/10

---

## 2. Color Palette

### Brand — Cyan / Teal Scale
| Name | Hex | Token | Role |
|---|---|---|---|
| Cyan Bright | `#00D2FF` | `--game-cyan-bright` | Max brightness — hover accent only |
| Cyan Primary | `#00C1EB` | `--game-cyan` | Primary interactive accent, focus rings, Chart-1 |
| Cyan Deep | `#00A0C2` | `--game-teal-light` | Icon accents, hover states |
| Teal Mid | `#006E85` | `--game-teal-mid` | Active states, section labels, expand buttons |
| Teal | `#005F58` | `--game-teal` | CTA gradient start, hover of teal-mid |
| Teal Dark | `#003C49` | `--game-teal-dark` | CTA gradient end |
| Ink Dark | `#002C33` | `--game-dark` | Deep ink, sidebar bg, primary headings |
| Cyan Dark (Brand) | `#003D47` | `--cyan-dark` | Chart-2, GameButton inner gradient |

### Surfaces
| Name | Hex | Token | Role |
|---|---|---|---|
| Page Canvas | `#eff2f4` | `--game-canvas` / `--background` | GridBackground base |
| Surface Muted | `#F0F6FA` | `--muted` | Input bg, section tint |
| Cyan Tint | `#E0F7FF` | `--game-cyan-tint` | Tags, pills, hover bg, section headers |
| Border | `#C8DDE6` | `--border` | Dividers, input borders, structural lines |
| Surface Solid | `#FFFFFF` | `--card` / `--game-surface-solid` | Opaque card fill |
| Glass Surface | `rgba(255,255,255,0.6)` | `--game-surface` | ALL content cards globally |

### Text
| Name | Hex | Token | Role |
|---|---|---|---|
| Body Primary | `#202326` | `--game-text` | All body text, KPI values |
| Secondary | `#606569` | `--game-text-secondary` | Descriptions, labels |
| Muted | `#94A3B8` | `--game-text-muted` | Placeholders, timestamps, icons |
| Ink (headings) | `#002C33` | `--foreground` | Page titles, headings |

### Semantic States
| Name | Hex | Token | Role |
|---|---|---|---|
| Positive | `#156162` | `--game-positive` | Revenue up, retention gain, upward trends |
| Success | `#166534` | `--game-success` | Confirmed complete, affirmative |
| Negative | `#c65252` | `--game-negative` | Cost up, turnover, danger, downward trends |
| Destructive | `#C0392B` | `--destructive` | System-level errors, coral |
| Warning | `#B45309` | `--game-warning` | Phantom stock, unsold inventory, lag |

### Data Visualization
| Slot | Hex | Token | Role |
|---|---|---|---|
| Chart-1 | `#00C1EB` | `--chart-1` | Primary series (revenue, primary metrics) |
| Chart-2 | `#003D47` | `--chart-2` | Secondary series |
| Chart-3 | `#7C3AED` | `--chart-3` | Tertiary series — **purple, charts only** |
| Chart-4 | `#B45309` | `--chart-4` | Warning series (waste, phantom) |
| Chart-5 | `#C0392B` | `--chart-5` | Critical series |
| Chart-6 | `#4DB5B6` | `--chart-6` | Retention / soft teal |

> **Chart-3 exception:** Purple `#7C3AED` is used exclusively for chart tertiary series. It is banned from all UI chrome, buttons, and surface backgrounds.

### Gradients
| Name | Value | Usage |
|---|---|---|
| `--game-gradient-strategic` | `linear-gradient(135deg, #006E85, #003D47)` | Strategic Summary card, Decision Overlay header |
| `--game-gradient-report` | `linear-gradient(to right, #F0F9FC, #FFFFFF)` | Monthly reporting strip (15.11) |
| GameButton CTA | SVG radial: `#005F58 → #003C49` | GameButton primary — branded pill only |
| Glass card | `rgba(255,255,255,0.6)` + `1.4px solid white` | All content card surfaces |

---

## 3. Typography

**Single font family:** `'Outfit', system-ui, -apple-system, sans-serif` — token: `--font-ui`  
**Monospace (code/metadata only):** `'Courier New', 'Lucida Console', monospace` — token: `--font-mono`

**Critical:** All KPI values, financial figures, and numeric data use `font-variant-numeric: tabular-nums` — apply `.tabular` utility class or inline `fontVariantNumeric: 'tabular-nums'`.

### Type Scale
| Role | Size | Weight | Line-Height | Letter-Spacing | Usage |
|---|---|---|---|---|---|
| Page Display | 32px | 700 | 1.2 | -0.32px | `Month 3 Dashboard` |
| H1 Hero | clamp(1.5rem, 4vw, 2.5rem) | 800 | 1.2 | -0.5px | Page heroes |
| H2 Section | 20px | 800 | 1.3 | -0.5px | Section titles |
| H3 Sub-section | 18px | 700 | 1.4 | — | Card groups |
| H4 Card | 16px | 600 | 1.5 | — | Card titles, form labels |
| Body / Label | 14px | 500 | 1.5 | — | Descriptions, body copy |
| Section Tag | 15px | 700 | 1.4 | — | `Financial Performance` labels |
| Card Label | 12px | 600 | 1.4 | — | KPI labels, metadata |
| Eyebrow / Ref | 10–11px | 700 | 1.4 | 0.05em | `PULSE STRIP · 15.10` |
| Badge | 9–10px | 700 | 1 | 1.5px | `STANDARD`, `ACTIVE` |

**Banned:** Inter, Georgia, Times New Roman, any serif in dashboards, floating labels, placeholder-as-label.

---

## 4. Spacing

Base: **4px grid** (Tailwind default).

| Token | Value | Usage |
|---|---|---|
| `gap-3` | 12px | Card grids (Pulse strip, KPI ribbon) |
| `gap-4` | 16px | Section grids, quarterly view |
| `p-4` | 16px | Compact cards (Pulse strip, small tiles) |
| `p-5` | 20px | **Standard cards — ALL content cards** |
| `p-6` | 24px | Setup screens, input cards |
| `px-6` | 24px | Page horizontal padding |
| `pb-24` | 96px | Page bottom scroll buffer |
| `mb-3` | 12px | SectionLabel → first card gap |
| `mb-6` | 24px | Between section blocks |
| `space-y-2.5` | 10px | Product matrix row gap |
| Section gap | `clamp(2rem, 5vw, 4rem)` | Between major page sections |
| Max page width | `1312px` | `--max-w-page` — all screen containers |

---

## 5. Border Radius

| Token | Value | Tailwind | Usage |
|---|---|---|---|
| `--radius-sm` | 6px | — | Small pills, tight badges |
| `--radius-md` | 8px | — | Input fields, dropdowns |
| `--radius-lg` / `--radius` | 10px | `rounded-lg` | Default component radius |
| `--radius-xl` | 14px | — | Larger panels |
| `--radius-2xl` | 16px | `rounded-2xl` | **ALL content cards globally** |
| `rounded-xl` | 12px | `rounded-xl` | Toggle buttons, inner UI |
| `rounded-3xl` | 24px | `rounded-3xl` | Overlay / modal corners |
| `--radius-pill` | 9999px | `rounded-full` | GameButton, PrimaryCTA, nav pills |

---

## 6. Elevation System

4-step ladder. All shadows tinted toward the cyan/teal palette at higher elevations.

| Level | Token | Value | Usage |
|---|---|---|---|
| 0 | `--shadow-elev-0` | `none` | Flat surfaces, backgrounds |
| 1 | `--shadow-elev-1` | `0px 2px 4px rgba(0,0,0,0.04)` | Subtle lift — inactive state |
| 2 | `--shadow-elev-2` | `0px 3px 8px rgba(0,0,0,0.06)` | Default float — GameHeader pill, tooltips |
| 3 | `--shadow-elev-3` | `0px 2.5px 10px 0px rgba(77,181,182,0.29)` | Selected/active cards — cyan-tinted |

Additional:
- **CTA inset depth:** `inset 0px 0px 8px 1px rgba(20,20,20,0.50)` — GameButton inner shadow only
- **Tooltip:** `0 4px 12px rgba(0,0,0,0.10)`

---

## 7. Component Stylings

### Cards

**Universal card rule:** `background: rgba(255,255,255,0.6)` · `border-radius: 1rem (16px)` · `border: 1.4px solid white` · `padding: 1.25rem (p-5)`

| Variant | Border | Shadow | Background | Usage |
|---|---|---|---|---|
| Standard Glass | `1.4px solid white` | elev-0 | `rgba(255,255,255,0.6)` | All content cards |
| Selected | `1.4px solid rgba(21,97,98,0.33)` | elev-3 | `rgba(255,255,255,0.6)` | Active selection |
| ~~Accent Left~~ (BANNED) | — | — | — | Left-accent ribbon border on KPI cards is banned — anti-ribbon rule. Use flat glass + label dot. |
| Strategic | — | — | `linear-gradient(135deg, #006E85, #003D47)` | Strategic Summary |
| Danger Pulse | `1.4px solid #c65252` | — | `rgba(254,226,226,0.9)` + `animate-pulse` | Runway < 3mo |

### Buttons

| Variant | Background | Text | Border | Radius | Usage |
|---|---|---|---|---|---|
| GameButton Primary | `linear-gradient(180deg, #00B1D6 -180.36%, #0090AD 105.36%)` | white | none | `43px` | Primary game CTA |
| GameButton Secondary | `white` | `#202326` | `1px solid #d1d5db` | `9999px` | Secondary game action |
| PrimaryCTA (default) | `#00C1EB` | white | none | `9999px` | Cyan pill CTA |
| PrimaryCTA (dark bg) | `white` | `#002C33` | none | `9999px` | Inverted surface CTA |
| ToggleBtn (active) | `#006E85` | white | none | `0.75rem` | Mode switcher active |
| ToggleBtn (inactive) | transparent | `#606569` | none | `0.75rem` | Mode switcher inactive |
| Inline icon | `white` | `#006E85` | `#C8DDE6` | `0.5rem` | Download, expand |

**GameButton anatomy:** `padding: 1px 4px` outer · `py-3 px-5` inner · `borderRadius: 43px` · Outfit 600 15px · Arrow icon in `bg-white/20` 28px pill · `hover:shadow-lg` · `active:-translate-y-px`  
**Active state all buttons:** `-translate-y-px` (1px tactile press)

### Badges & Tags

| Type | Background | Text | Font | Usage |
|---|---|---|---|---|
| Badge PUBLIC | `#00A0C2` | white | 9.6px 700 ls:1.5px | Session type |
| Badge PRIVATE | `#003D47` | white | 9.6px 700 ls:1.5px | Session type |
| Badge FACILITATOR | `#D4590A` | white | 9.6px 700 ls:1.5px | Role indicator |
| Badge VALUE | `#475569` | white | 9.6px 700 ls:1.5px | Tier |
| Badge STANDARD | `#006E85` | white | 9.6px 700 ls:1.5px | Tier |
| Badge PREMIUM | `#1e293b` | white | 9.6px 700 ls:1.5px | Tier |
| Badge CUSTOM | `#005F58` | white | 9.6px 700 ls:1.5px | Tier (teal, not purple) |
| ImpactTag | `#E0F7FF` | `#006E85` | 10.4px 600 | Decision impact |
| TimingBadge (now) | `#E0F7FF` | `#006E85` | 10.4px 600 | Immediate effect |
| TimingBadge (lag) | `#FEF3C7` | `#B45309` | 10.4px 600 | Delayed effect |
| Danger tag | `#FEE2E2` | `#c65252` | 10px 700 | WEAKEST LINK |
| SegBadge (active) | `#006E85` | white | 9px 700 | Customer segment |
| SegBadge (inactive) | `#F0F6FA` | `#606569` | 9px 700 | Customer segment |

**SectionLabel anatomy:** Ref tag (10px 700 ls:0.05em `#E0F7FF`/`#006E85`) + Title (15px 700 `#202326`) + optional Info icon (13px `#94A3B8`)

### KPI Displays

All numeric values: `font-variant-numeric: tabular-nums` · Outfit font  
All delta indicators: `ArrowUpRight` (positive `#156162`) / `ArrowDownRight` (negative `#c65252`)

| Type | Value Size | Label Size | Border | Usage |
|---|---|---|---|---|
| Ribbon KPI | 26px 700 | 12px | none — flat glass, **no left-accent (banned)**; accent = label dot | Monthly 15.1–15.3 |
| SparkCard | 22px 700 | 12px | none | Quarterly 17.1–17.4 |
| Pulse Strip | 20px 700 | 11px | `1.4px solid white` | Weekly compact |
| Cash Bridge | 22px 700 | 11px | none | Cash movement 15.10 |

**Runway color thresholds:**
- ≥ 6 months → `#156162` (healthy)
- 3–6 months → `#B45309` (caution)
- < 3 months → `#c65252` + `animate-pulse` (bankruptcy risk)

### Inputs & Forms
- Background: `#F0F6FA` · border: `1px solid #C8DDE6` · radius: 8px
- Focus: `2px solid #00C1EB` ring
- Label: above input, Outfit 500 16px, `#002C33`
- Error: red text below + red left border accent
- No floating labels. Label always visible.

### Loading States
- Skeletal shimmer matching exact layout dimensions
- Background `#E0F7FF` → shimmer pulse 1.5s
- No circular spinners

### Modals & Overlays
- Overlay scrim: `rgba(0,0,0,0.4)` + `backdrop-blur-sm`
- Modal card: `rounded-2xl` · `shadow-2xl` · white bg
- Confirm (destructive): cancel ghost + confirm cyan, clear consequence statement

---

## 8. Layout Principles

- **Canvas:** `#eff2f4` + 63px grid texture (`#232323` lines, opacity 0.03)
- **Max-width:** `1312px` centered — ALL screen containers
- **Horizontal padding:** `px-6` (24px)
- **Grid-first:** CSS Grid over Flexbox. No `calc()` percentage hacks.
- **No overlapping:** every element occupies clean spatial zones
- **Card grids:** 2-col zig-zag or asymmetric 1+2 split. **No 3-equal-column card grids.**
- **Hero layout:** asymmetric — dominant panel (left 60%) + secondary panel (right 40%)
- **Full-height:** `min-h-[100dvh]` not `h-screen` (iOS Safari compatibility)
- **KPI ribbon:** `grid-cols-2 sm:grid-cols-3 lg:grid-cols-6` — never fixed 6-col

---

## 9. Motion & Interaction

- **Spring default:** stiffness 120, damping 25 — weighty, never linear
- **Button press:** `active:-translate-y-px` instant tactile feedback on all buttons
- **Hover elevations:**
  - `GameButton`: `hover:shadow-lg`
  - Clickable tiles: `hover:shadow-md`
  - Teal buttons: `hover:bg-[#005F58]`
  - Ghost buttons: `hover:bg-[#F0F9FC]`
- **Staggered reveals:** 50–75ms cascade delays between list items
- **Pulse animation:** `animate-pulse` for danger states (runway < 3mo, low stock)
- **Page transitions:** fade + translate-y 50px→0px, 300ms, `PageTransition` component
- **Transform-only:** never animate `top`, `left`, `width`, `height` — GPU-only

---

## 10. Background Effects

| Effect | Value | Usage |
|---|---|---|
| Grid texture | `63px × 63px` `#232323` lines at `opacity: 0.03` over `#eff2f4` | All pages via `GridBackground` |
| Glass card | `rgba(255,255,255,0.6)` + `1.4px solid white` | All content cards |
| Overlay scrim | `rgba(0,0,0,0.4)` + `backdrop-blur-sm` | Modals, decision overlays |
| Strategic gradient | `linear-gradient(135deg, #006E85, #003D47)` + decorative `bg-white/5` circles | Strategic summary cards |

---

## 11. Anti-Patterns (Banned)

- No emojis anywhere — use only approved SVG icons from `src/app/components/icons`
- No Inter, Georgia, Times New Roman, or system-ui as primary font
- No pure black `#000000` — use `#002C33`
- No purple (`#7C3AED`) in UI chrome, buttons, or backgrounds — charts only
- No neon outer glows or oversaturated cyan gradients
- No custom mouse cursors
- No 3-equal-column card grids — asymmetric splits only
- No left-accent ribbon border on KPI/stat/metric cards (anti-ribbon rule) — no `border-left: 4px solid <accent>` colored side bar. KPI cards stay flat glass; carry the accent as a small dot beside the label.
- No floating labels — label above input, always visible
- No placeholder text as substitute for labels
- No AI copywriting clichés ("Elevate", "Seamless", "Unleash", "Next-Gen", "Unlock Potential")
- No filler UI text ("Scroll to explore", bouncing chevrons, scroll arrows)
- No overlapping text on images or other text
- No generic names ("John Doe", "Acme Corp", "Nexus", "Synergy")
- No broken image links — icons must resolve through `src/app/components/icons` or a local wrapper around that folder
- No centered hero layouts — force asymmetric left-align or split screen
- No serif fonts in dashboards
- No border-radius > 1.5rem on interface components (pill = 9999px is exempt)
- No hardcoded hex strings in components — use CSS variable tokens

---

## 12. Open Design Flags

| ID | Severity | Issue | Fix |
|---|---|---|---|
| F-1 | HIGH | GameButton gradient is a base64 SVG data URI — not tokenized | Extract to CSS `radial-gradient()` using `--game-teal` / `--game-teal-dark` |
| F-3 | MED | `CommandCenter` max-w-[1312px] vs `GameHeader` max-w-[1286px] drift | Unify to `max-w-[--max-w-page]` token |
| F-6 | LOW | `font-variant-numeric: tabular-nums` applied inline everywhere | Use `.tabular` utility class (now defined in theme.css) |

---

---

## 13. Icon System

### Rule — Mandatory for all generated and hand-coded UI

> **Use icons from `src/app/components/icons` exclusively. No Lucide. No emoji. No other icon package.**

The approved source is the imported **Streamline Pixel** SVG set in `src/app/components/icons`. All design-system surfaces, generated UI, icon galleries, and icon registries must resolve icons from that folder through a local wrapper or registry such as `src/app/components/PixelIcons.tsx`.

If an exact icon is missing, choose the closest metaphor from the same folder. If no close metaphor exists, add a Streamline Pixel-style SVG to `src/app/components/icons` first, then expose it locally. Do not solve missing icons by importing `lucide-react`, Heroicons, Font Awesome, Material Icons, icon fonts, CDNs, emoji, or hand-drawn one-off SVG paths.

### Visual Theme

- Pixel-grid silhouette, compact 24-32px source geometry.
- Mostly solid, blocky shapes.
- No thin outline-only icon style in design-system surfaces.
- No mixed visual metaphors from rounded outline icon packs.
- Preserve crisp edges at 11-12px, 13-14px, 16px, 18px, 20px, and 24px UI sizes.
- Icons inherit semantic colors from the surrounding component.
- Any full icon gallery or design-system reference should include the whole `src/app/components/icons` set or a generated registry from that folder, not only the currently used icons.

### Size Scale

| Size | Usage |
|---|---|
| 11-12px | Inline delta arrows, badge icons |
| 13-14px | Card header labels, compact action rows |
| 16px | Standard UI icons, section header accents |
| 18px | Decision card icons (inside tinted `#E0F7FF` boxes) |
| 20px | Tab / nav icons, prominent action buttons |
| 24px | Hero or empty-state illustration icons |

### Color Rules

| Color | Token | Use |
|---|---|---|
| `#94A3B8` | `--game-text-muted` | Neutral / decorative (label icons, placeholder) |
| `#006E85` | `--game-teal-mid` | Interactive / active state |
| `#156162` | `--game-positive` | Positive delta and gain states |
| `#c65252` | `--game-negative` | Negative delta and danger states |
| `#B45309` | `--game-warning` | Caution, lag, and delayed-effect states |
| `white` | none | Icons on colored/dark backgrounds |

### Approved Icon Source By Category

**Interface Essentials:** files prefixed `interface-essential-*`

**Navigation:** files prefixed `map-navigation-*`, `internet-network-*`, and compatible `interface-essential-*` directional assets

**Business:** files prefixed `business-*`, `money-payments-*`, `real-estate-*`, and `building-real-eastate-*`

**Data:** chart/report icons from `business-products-data-*`, `interface-essential-pie-*`, and related dashboard metaphors

**Technology:** files prefixed `coding-*`, `computer-*`, `computers-devices-*`, and `technology-*`

**Food & Lifestyle:** files prefixed `food-*`, `weather-*`, `ecology-*`, `beauty-*`, `travel-*`, `pet-*`, and compatible lifestyle categories

### Enforcement

- Search changed design-system files for `lucide-react`, `@mui/icons-material`, `heroicons`, `fontawesome`, and emoji before accepting work.
- Confirm new icon usage resolves to `src/app/components/icons` or a wrapper/registry built from that folder.
- Confirm icon colors use semantic tokens, not arbitrary hardcoded icon-only colors.
- Confirm any new icon visually matches the Streamline Pixel set before it is committed.

See `design-rules/icon-system-rules.md` for the standalone rule file.

## 14. Component Updates (verified against Figma node 7060:3028, 2026-05-08)

### GameHeader — Updated Anatomy
Three right-side pills: `Team: <name>` · `<Role> + person icon` · `● Month N`  
All pills: `background: #fafafa` · `border: 1px solid #e8eef2` · `borderRadius: 20px` · `padding: 5px 12px` · `shadow: 0 2px 6px rgba(0,0,0,0.05)`  
Month pill: green dot `#22C55E` (7px circle) + Outfit 600 12px text  
Logo icon fill: `#002C33` (not `#000001`). Wordmark: Outfit 700 18px `#202326`.

### Page Header Button Pair
`Report` (primary) + `Decisions` (secondary/ghost) side-by-side  
Report: `background: #00C1EB` · white text · `borderRadius: 20px` · `padding: 8px 18px` · Outfit 600 13px  
Decisions: `background: white` · `#002C33` text · `border: 1.4px solid #C8DDE6` · same radius/padding

### KPI Strip Cards — Figma-verified
No icons. Label (Outfit 500 11px `#606569`) + optional badge pill (9px 700 `#E0F7FF`/`#006E85`).  
Value: Outfit 700 20px `#202326` tabular-nums.  
Delta: `ArrowUpRight`/`ArrowDownRight` (11px) + Outfit 600 10px colored text.  
Card: glass `rgba(255,255,255,0.6)` · `1.4px solid white` · `borderRadius: 16px` · `padding: 14px 16px`

### Tab Bar — Figma-verified
Container: glass card `rgba(255,255,255,0.6)` · `1.4px solid white` · `borderRadius: 12px` · `padding: 4px`  
Active tab: `background: #006E85` · white · Outfit 600 13px · `borderRadius: 8px` · `padding: 7px 18px`  
Inactive: transparent · `#606569` · same font/size  
No icons on tabs (not even active tab).

### Chart Style — Figma-verified
Area charts: `strokeWidth: 2` primary, `1.5` secondary. No dots (`dot={false}`).  
Grid: `strokeDasharray="3 3"` · `stroke="#e8eef2"` · `vertical={false}` (horizontal lines only).  
Axes: `axisLine={false}` · `tickLine={false}` · 10px Outfit `#94A3B8`.  
Tooltip: `borderRadius: 10px` · `border: none` · `boxShadow: 0 4px 12px rgba(0,0,0,0.08)` · Outfit 12px.

### Cash Flow Strip
Horizontal 4-step: Opening → Inflow → Outflow → Closing  
Separator: `ChevronRight` 16px `#C8DDE6`  
Grid: `gridTemplateColumns: '1fr auto 1fr auto 1fr auto 1fr'`  
Label: Outfit 11px `#94A3B8`. Value: Outfit 700 18px colored (closing: 20px `#006E85`).

### Waste Alert Cards
`AlertTriangle` icon (12px, category color) + label. Value: Outfit 700 32px `#202326`. Pct: 11px `#94A3B8`.  
Colors: Expiry `#F59E0B` · Phantom `#B45309` · Damaged `#c65252`

### Product Pill Selectors (Revenue by Product)
Active: filled with product's assigned data color · white text · `borderRadius: 20px` · Outfit 600 12px  
Inactive: `background: #f0f2f4` · `#606569` · same geometry

### Horizontal Progress Bars (Sold vs Unsold)
Height: 8px · `borderRadius: 4px` · Track: `#f0f2f4`  
Sold fill: `#006E85` · Unsold fill: `#F59E0B`  
Left label (80px fixed) · bar flex-1 · right label tabular-nums 11px `#94A3B8`

*Updated 2026-05-08 — source: Figma node 7060:3028*
