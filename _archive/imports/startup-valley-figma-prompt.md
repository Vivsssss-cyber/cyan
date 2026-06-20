# Startup Valley — One-Shot Figma Make Prompt
> Based on PRD v3.0 · Optimised for single-pass generation

---

## HOW TO USE THIS PROMPT
Copy everything below the horizontal rule and paste it as a single prompt into Figma Make. Do not split it across multiple messages.

---

---

# PROMPT START

You are building a high-fidelity interactive prototype for **Startup Valley** — a multiplayer business simulation game used in educational and professional training settings. Teams of players manage a restaurant startup over a simulated 5-year run, making weekly, monthly, and semi-annual decisions that affect revenue, retention, capacity, and ultimately their company's valuation.

This is not a simple dashboard. It is a structured, screen-by-screen game interface with distinct phases, decision cadences, and live feedback loops. Build every screen as if it belongs to the same design system — not bolted on later.

---

## BRAND IDENTITY — CYAN INNOVATIONS

Startup Valley is a product of **Cyan Innovations**. The entire UI must reflect the Cyan Innovations brand identity. The logo is an isometric 3D "C" mark — use it on the splash screen, nav header, and facilitator dashboard. The wordmark is **CYAN** in heavy uppercase geometric sans-serif, with "Innovations" in regular weight below.

Two official logo variants exist:
- **Light version**: Full-colour isometric C (cyan-to-dark-teal gradient) on white/light background with hexagon texture
- **Dark version**: Monochrome white/silver isometric C on `#002C33` dark background

Use the light version for player-facing screens. Use the dark version for the Facilitator Dashboard and the Semi-Annual Board Review (elevated formal screens).

---

## DESIGN SYSTEM — APPLY TO EVERY SCREEN

### Colour Tokens
| Token | Hex | Use |
|---|---|---|
| `--cyan-primary` | `#00D2FF` | Primary Electric Cyan — brand hero colour, key CTAs, active state highlights, progress indicators |
| `--cyan-mid` | `#00C1EB` | Secondary cyan — icon fills, link colours, hover states |
| `--cyan-deep` | `#00A0C2` | Mid-depth — chart fills, secondary accents, selected card borders |
| `--cyan-teal` | `#006E85` | Darker teal — section headers, timing badges, "this week" indicators |
| `--cyan-dark` | `#003D47` | Deep teal — elevated panel backgrounds, board review header bands |
| `--dark-bg` | `#002C33` | Darkest — dark mode screen backgrounds (facilitator, board review) |
| `--background` | `#F0F6FA` | Light page background — all standard player screens |
| `--surface` | `#FFFFFF` | Card and panel fills |
| `--text-primary` | `#002C33` | Headings and bold labels (use brand darkest for text on light backgrounds) |
| `--text-body` | `#334155` | Body text, descriptions |
| `--text-muted` | `#64748B` | Labels, secondary info, placeholders |
| `--border` | `#C8DDE6` | Card borders and dividers — slightly cyan-tinted grey |
| `--coral` | `#C0392B` | Cost figures, danger states, <30s timer, hard blocks |
| `--amber` | `#B45309` | Soft warnings, 60s timer, "next round" timing badges |
| `--positive` | `#166534` | Positive KPI deltas, healthy runway, success states |
| `--cyan-tint` | `#E0F7FF` | Light cyan wash — selected card fill, tinted backgrounds |

### Background Texture
Every main game screen uses a **subtle hexagon tile pattern** on the `--background` colour. This is the Cyan Innovations brand texture — the same hex grid shown on the brand identity sheets. The hexagons are very light: hex stroke colour at `#00C1EB` opacity 8–12%, no fill. Hexagon tile size approximately 60–80px. This is a non-negotiable visual signature. Do not substitute a dot grid or plain background.

On dark screens (Facilitator Dashboard, Board Review), use the same hex pattern at white stroke opacity 4–6% over `#002C33`.

### Typography
- **All UI text**: Inter or geometric sans-serif (same weight class as the Cyan wordmark — clean, modern, no serifs)
- **Headings / screen titles**: 800 weight, tight letter-spacing (−0.5px to −1px) — matches the heavy CYAN wordmark style
- **All numeric values** (cash balance, AOV, capacity, KPI deltas, timer): Monospace / JetBrains Mono
- **Labels above inputs**: 9–10px, uppercase, letter-spacing 2–3px, `--text-muted` colour

### Spacing & Shape
- **Large cards** (location cards, decision summary): `border-radius: 16px`
- **Standard elements** (panels, modals, input rows): `border-radius: 10px`
- **Small tags and badges**: `border-radius: 4–6px`
- Card padding: `20–24px`
- Screen padding: `24px` horizontal on mobile, `48–72px` on desktop

### CTAs
- **Primary CTA (light screens)**: full-width pill, `background: #00C1EB`, white text, `border-radius: 100px`, bold uppercase
- **Primary CTA hover**: `background: #0090AD`
- **Primary CTA (dark screens)**: white pill, `color: #002C33`
- Disabled: 40% opacity, no pointer events
- Examples: "Select the Location", "Set the Capacity", "Submit Decisions"

### Illustrations
All character and location art uses a **pencil-sketch / ink-wash style, monochrome**. Do not use photographic assets or flat colour illustrations. Sketchy, hand-drawn line art with light wash fills is the established aesthetic. On dark-background screens, illustrations use white-on-dark ink treatment.

### Badges
- `PUBLIC` badge: `background: #00A0C2`, white text
- `PRIVATE` badge: `background: #003D47`, white text
- `FACILITATOR` badge: `background: #D4590A`, white text
- All badges: uppercase, 9–10px, `border-radius: 4px`, `padding: 2px 8px`

### Cyan Innovations Logo Placement
- **All screen top-left nav**: Cyan Innovations isometric C mark (small, 28–32px) + "CYAN" wordmark
- **Welcome carousel splash (full screen)**: Large centred isometric C logo, full-colour version, on light hex-pattern background
- **Board Review + Facilitator screens**: Monochrome white version on `--dark-bg`

---

## SCREENS TO BUILD

Build the following 12 screens in order. Each screen specification describes what must appear and how it must behave. Do not skip or merge screens.

---

### SCREEN 1 — Welcome Carousel (Pre-Brief)
**Audience:** All players · **Phase:** Pre-game

A 5-slide full-screen carousel before any setup choices. Style: clean, immersive. Use the **light version** of the Cyan Innovations brand — white background with the cyan hexagon tile pattern, electric cyan accents, `--dark-bg` text. The Cyan Innovations full-colour isometric C logo is large and centred on Slide 1 — this is the brand splash moment.

**Slide content:**
- Slide 1: Game title "STARTUP VALLEY", subtitle "You are the founder-management team of a restaurant startup. Your decisions will determine whether your company survives, thrives, or fails." Pencil-sketch founder character illustration. Teal "Let's Begin →" pill.
- Slide 2: "How the market works" — explain Premium vs Regular customers, footfall, demand pool. Simple illustrated diagram.
- Slide 3: "What is capacity?" — explain that floor space determines how many customers you can serve simultaneously.
- Slide 4: "How do competitors affect you?" — explain shared market pool, anonymised market share.
- Slide 5: Glossary card — AOV, runway, capacity per customer, positioning, retention rate. Two-column layout, each term with a one-line definition.

**Interaction:** Dot-navigation at bottom. "Next →" and "← Back" arrows. Final slide shows "Enter Setup →" CTA. Players cannot skip slides 1–4 unless facilitator has enabled skip mode. Show a greyed lock icon on the skip button when locked.

---

### SCREEN 2 — Founder Setup Wizard: Stage 1 — Choose Your Location
**Audience:** Private (per team) · **Phase:** Pre-game setup

Header: "STARTUP VALLEY" wordmark top-left. Progress stepper at top showing 5 stages: Location → Capacity → Team → Marketing → Positioning. Stage 1 is active.

**Main content:** 4 location cards in a 2×2 grid. Each card contains:
- Pencil-sketch location illustration (full card background, overlay gradient for readability)
- Location name (e.g., "Streets of Bagbazar", "Market Square", "Central Avenue", "Riverside Drive")
- Rent per sq ft shown in `--coral`: e.g., "$15 / sq ft / mo"
- Stat row: Avg Footfall/wk · Premium Customers % · Regular Customers %
- Competitor impact tag (e.g., "10% competitor impact")
- Sourcing distance in small muted text

**Data to display:**
| Location | Rent/sqft | Footfall/wk | Premium % | Regular % | Competitor Impact |
|---|---|---|---|---|---|
| A — Streets of Bagbazar | $15 | 500 | 30% | 70% | 10% |
| B — Market Square | $20 | 600 | 25% | 75% | 15% |
| C — Central Avenue | $18 | 700 | 35% | 65% | 5% |
| D — Riverside Drive | $22 | 800 | 40% | 60% | 8% |

**Selected state:** Card border changes to `--primary` (3px), teal checkmark badge appears top-right, card background tinted `--primary-light`.

**Bottom bar (sticky):** Shows "Running Cost Estimate: $—" updating live as choices are made. Primary CTA: "Select this Location →" (disabled until selection made).

---

### SCREEN 3 — Founder Setup Wizard: Stage 2 — Set Area Capacity
**Audience:** Private · **Phase:** Pre-game setup

Progress stepper: Stage 2 active.

**Main content:** 4 space option cards in a row or 2×2 grid.

Each card shows:
- Space size in large monospace type (e.g., "3,500 sq ft")
- Max simultaneous customers (formula: sq_ft ÷ 25) in teal
- Monthly rent cost in `--coral` (calculated from chosen location's rent/sqft × space)
- Small note: "Customer pool: [sq_ft × 10 ÷ 25] customers/day"

**Data:**
| Option | Space | Max Customers | Monthly Rent (Location A) | Monthly Rent (Location D) |
|---|---|---|---|---|
| 1 | 2,800 sq ft | 112 | $42,000 | $61,600 |
| 2 | 3,200 sq ft | 128 | $48,000 | $70,400 |
| 3 | 3,500 sq ft | 140 | $52,500 | $77,000 |
| 4 | 4,000 sq ft | 160 | $60,000 | $88,000 |

**Running cost bar** at bottom updates: shows Rent component of weekly burn estimate.

---

### SCREEN 4 — Founder Setup Wizard: Stages 3, 4, 5 (Combined)
**Audience:** Private · **Phase:** Pre-game setup

This single screen handles 3 remaining stages, displayed as sequential panels or a scrollable vertical flow within the same screen.

**Stage 3 — Employee Count:**
4 option tiles in a row: 3 / 5 / 7 / 10 employees. Each tile shows weekly labour cost estimate in coral. Note in muted text: "First productive week: Week 5 (4-week hiring delay applies)."

**Stage 4 — Marketing Budget:**
4 option tiles: 1% / 2% / 3% / 5% of revenue. Show estimated weekly budget in teal monospace: ~$1,000 / ~$2,000 / ~$3,000 / ~$5,000/wk. Muted note: "Split across acquisition, retention, and repurchase each week."

**Stage 5 — Positioning (critical — not yet in Figma, must be built):**
3 large option cards horizontal layout:

| Positioning | Price Band | Min Ops Level | Premium Affinity |
|---|---|---|---|
| VALUE | $5–$12 AOV | Basic | Low |
| STANDARD | $12–$22 AOV | Standard | Moderate |
| PREMIUM | $22–$40 AOV | High | High |

Each card: Large positioning label, price band in teal monospace, one-line customer expectation quote in italic muted text, min ops badge. Warning note below the 3 cards: "Your ops level must stay consistent with your positioning. Pricing premium with basic service triggers customer churn."

---

### SCREEN 5 — Setup Summary (Confirmation Modal / Screen)
**Audience:** Private · **Phase:** Pre-game

Full-screen summary or large centred modal with location illustration as background (blurred). Shows all 5 choices as a summary card:

- Location name + pencil sketch thumbnail
- Space (sq ft) + max customers
- Employee count
- Marketing budget
- Positioning tier badge (colour-coded: VALUE = slate, STANDARD = teal, PREMIUM = navy)

**Engine estimates panel** (3 tiles in a row):
- **Estimated Weekly Capacity**: calculated from space and employee count (in teal)
- **Estimated Weekly Burn**: rent + labour + marketing baseline (in coral)
- **Estimated Runway**: starting cash ($500,000) ÷ weekly burn, shown in weeks (colour: green if >26 wks, amber if 8–26 wks, red if <8 wks)

Primary CTA: "Begin Week 1 →" · Secondary link: "← Edit Setup"

---

### SCREEN 6 — Weekly Cockpit (Decision Screen)
**Audience:** Private · **Phase:** Gameplay (every week)

This is the primary gameplay screen. It must be information-dense but scannable.

**Top bar (sticky):**
- Left: Team name + Week number (e.g., "TEAM ALPHA · WEEK 7")
- Centre: Countdown timer — large, monospace. Green above 90s → Amber below 60s → Coral/Red below 30s. Pulsing animation under 30s.
- Right: "X of 4 teams submitted" indicator

**Bottom bar (sticky):**
- Cash Balance (monospace, `--positive` if positive, `--coral` if low)
- Runway in weeks (colour-coded: green/amber/red)
- Capacity utilisation % (progress ring or bar)

**Main content:** 8 decision blocks in a 2-column grid. Each block is a white card with:
- Icon + decision name as card header
- Input control (slider, segmented control, or number input depending on the decision)
- **Impact preview tag**: small pill showing what this decision affects (e.g., "affects: demand", "affects: retention", "affects: cash")
- **Timing badge**: "⚡ Effect: This Week" (teal) OR "🕐 Effect: Week +4" (amber)
- Small italic warning: "Once submitted, you cannot change this decision"

**The 8 weekly decisions:**
1. 📣 Marketing Spend + Channel Split — budget input + 3-way allocation slider (Acquisition / Retention / Repurchase) · This week · affects demand
2. 💰 Average Price per Product — number input within positioning band · This week · affects revenue + demand
3. 🏷️ Discount & Promotion Level — slider 0–30% · This week · affects volume + ARPU · warn if >20%
4. 🤝 Sales Effort Mode — segmented: None / Inside / Hybrid · This week · affects conversion rate
5. 🍳 Operations & Service Level — segmented: Basic / Standard / High · This week · affects satisfaction + retention. Show soft warning if inconsistent with positioning.
6. 💎 Retention Activity — segmented: Customer Relationship / Onboarding / Service Recovery · This week · affects retention + repurchase
7. 👤 Hiring / Firing (Light) — segmented: None / Post Job / Initiate Firing · Week +4 · amber timing badge
8. 🏦 Working Capital Lever — segmented: Pay Now (discount) / Pay 30-day (at cost) · This week · affects cash

**Submit CTA:** Large full-width teal pill at bottom of scroll area: "Submit Week 7 Decisions". On tap → confirmation modal → locked state. After lock: card overlay shows "Decisions Locked ✓".

---

### SCREEN 7 — Weekly Results Screen
**Audience:** Private · **Phase:** Gameplay (after each week resolves)

Header: "WEEK 7 RESULTS" in large navy. Sub: Team name.

**Why Tags row** (at the very top of results, before metrics): 3–5 coloured explanation tags that surface the causal story. Examples:
- `MARKETING ↑` (teal)
- `CAPACITY HIT` (amber)
- `RETENTION DROP` (coral)
- `PRICING CONSISTENT` (positive green)
- `EVENT: FESTIVAL WEEK` (purple)

These are the primary teaching mechanism. They must appear prominently — not buried at the bottom.

**8 output metrics** in a 2×4 or 4×2 grid. Each metric tile:
- Metric name (small uppercase label)
- Value in large monospace
- Delta arrow (▲ green or ▼ coral vs prior week) + delta value

**Metrics:**
1. Actual Customers Served
2. Customers Lost (churn)
3. Cost of Materials
4. Labour Cost
5. Fixed Cost
6. Revenue & ARPU
7. Sales Quantity
8. Cash Balance (running total)

**Event notice** (if fired): Teal or amber banner below metrics. Shows event name, type badge, duration badge (e.g., "4-week effect"), and "Why it happened" text for threshold events.

**Bottom CTA:** "→ Next Week" teal pill.

---

### SCREEN 8 — Month Review Screen
**Audience:** Private · **Phase:** Triggers automatically every 4 weeks

This screen replaces the weekly cockpit on the 4th week of each month. Players cannot skip it.

**Header:** "MONTH [X] REVIEW" · formal, elevated. Subtitle: "Review your month performance and make strategic investments."

**Month summary section:** Aggregate of the 4 weeks just completed.
- Revenue, Costs, Net Cash Change — as 3 stat tiles
- Cash flow waterfall chart (visual, horizontal bars showing inflows and outflows by category)
- Market share and category health summary (simple bar or gauge)

**Monthly decisions panel:** 8 cards in a 2×4 grid. Each card:
- Decision name
- Cost: "$25,000" in coral (except Loan and Hiring which show variable)
- Impact preview: e.g., "+10% satisfaction boost", "+2.5% productivity"
- Toggle or "Activate" button
- Muted note: "Cost deducted from cash balance immediately"

**Monthly decisions:**
1. Employee Capacity, Bonus & Training — $25,000 → +2.5% productivity
2. Customer Satisfaction & Relationship Push — $25,000 → +10% satisfaction
3. Operation Optimization — $25,000 → +2% efficiency
4. Customer R&D / Product Improvement — $25,000 → +3% demand
5. Supplier Relation to Cost & Credit — $25,000 → +5% COGS reduction
6. Loan Adjustments / Refinancing — Variable → lowers interest burden
7. Hiring / Firing Strategic Adjustment — Variable → expands/contracts labour
8. Financial View: Burn & Runway Check — $0 → unlocks warning flags

**Bottom CTA:** "Proceed to Week [X+1] →" — monthly decisions are optional; can proceed with none selected.

---

### SCREEN 9 — Semi-Annual Board Review
**Audience:** Private · **Phase:** Every 26 weeks

Visual elevation: This is the most formal screen in the product. Use the **dark Cyan Innovations brand treatment** — `#002C33` background, white/silver isometric C logo variant, white hex pattern texture at low opacity. The header band reads "BOARD REVIEW · YEAR [X] · H[1/2]" in the Cyan wordmark style — heavy uppercase, light letter-spacing.

**Deep KPI panel:** All 10 semi-annual outputs in a grid. Include delta vs prior semi-annual period.

**DCF Valuation Card** (non-negotiable — must appear at full fidelity, not as a placeholder):
- Card header: "DCF Valuation"
- Enterprise Value: large monospace teal figure
- Founder Value: slightly smaller monospace positive figure
- Three driver gauges (horizontal progress bars): Revenue Growth Rate / Retention Health / Margin Quality

**Strategic decisions panel:**
Two large option cards side by side:
- **Extension**: "Increase space at current location". Cost: "2× original setup cost ($X)". Impact: "↑ Capacity ceiling. Same location parameters."
- **Expansion**: "Open a second location". Cost: "Original setup cost ($X)". Impact: "2× theoretical capacity. 2× fixed costs. TAM grows +10%." · Locked unless cash surplus > threshold.

**Strategic narrative text field:** "What is your company becoming?" — multi-line text input for reflection. Subtitle: "Your facilitator may ask you to share this in debrief."

**Fundraising eligibility status:** If eligible, show a banner: "You are eligible for fundraising at the next Annual Review."

---

### SCREEN 10 — Weekly Results: Event Modal
**Audience:** All · **Phase:** Appears over results when an event fires

A centred modal overlay (blurred background). Four visual treatments based on event type:

- **Scheduled event**: Teal header, calendar icon. Duration badge: yellow "This week only" or orange "4-week effect" or red "26-week effect"
- **Random global event**: Amber header, dice icon. "Affects all teams simultaneously."
- **Threshold event**: Coral header, warning triangle. Always includes "Why it happened: [causal text]". Duration badge. Cooldown note: "This trigger has an 8-week cooldown."
- **Notification-only**: Slate header, speech bubble icon. Clear label: "No KPI impact — informational only."

Every event modal shows: Event title, event description, KPI(s) affected, duration badge, type badge.

Dismiss CTA: "Got it →"

---

### SCREEN 11 — Market View Screen
**Audience:** Public (all teams can see) · **Phase:** Accessible anytime during gameplay

Header badge: `PUBLIC` in blue. Title: "MARKET VIEW — WEEK [X]"

**Sections:**
- **Category growth rate**: Large teal number + "per semi-annual period". Growth trend sparkline.
- **Total market pool size**: Aggregate customer pool (no per-team breakdown). Large monospace figure.
- **Market health index**: Composite gauge (semicircle). Green/amber/red zones.
- **Market share bar**: Full-width stacked horizontal bar. Each team = a colour. Teams labelled by colour only (e.g., "Team A (Teal)", "Team B (Navy)") — names/financials hidden unless facilitator reveals.
- **Positioning badges for all teams**: Row of badges showing Value / Standard / Premium for each team's colour. These reveal strategy signal without revealing KPIs.
- **Benchmark metrics**: Market average ARPU band. Average churn rate. Both anonymised.

**Hard rule displayed in the UI footer of this screen:** "Individual team financials, decisions, and KPIs are never shown here."

---

### SCREEN 12 — Facilitator Dashboard
**Audience:** Facilitator only · **Phase:** Accessible at all times (separate login/role)

Use the **dark Cyan Innovations brand treatment** — `#002C33` background, white monochrome logo, hex tile texture at low opacity. `FACILITATOR` badge in orange. This screen should feel like a mission control panel, not a regular player screen.

**Sections:**
- **All-team KPI telemetry table**: One row per team. Columns: Cash Balance / Runway / Weekly Revenue / Customers Served / Market Share / Satisfaction. All live, auto-updating.
- **Reveal toggles**: Per-team or global reveal toggle that enables/disables showing team names on the Market View screen. Default: hidden.
- **Event injection panel**: "Inject a custom event this week" — one event injection permitted per full game run. Dropdown of event types. Confirmation before firing.
- **CSV export button**: "Export all-team KPI history as CSV" — downloads session data.
- **Session controls**: Pause timer / Resume / Skip week / Force batch mode.

---

## INTERACTION STATES TO BUILD FOR ALL SCREENS

| State | Visual treatment |
|---|---|
| Default | Normal card, `--border` border |
| Hover | Slight shadow lift, border tightens to `--primary-light` |
| Selected | `--primary` 2–3px border, teal checkmark badge, `--primary-light` fill |
| Disabled | 40% opacity, `cursor: not-allowed` |
| Warning (soft) | `--amber` left border on card, amber icon |
| Error / Hard block | `--coral` border + red icon + text block prevents proceeding |
| Locked (post-submit) | Greyed overlay on decision cards, "Locked ✓" label |
| Timer: Green | >90s, normal green display |
| Timer: Amber | 60–90s, amber colour |
| Timer: Red/Coral | <30s, coral colour, pulsing animation |
| Distress mode | Full screen subtle red tint overlay, "DISTRESS SIGNAL" banner |

---

## NON-NEGOTIABLES (must not be skipped or simplified)

1. **Hexagon tile background** on all main game screens — this is the Cyan Innovations brand texture. Do not use a dot grid, plain background, or any other pattern. Light cyan hex on light screens, white hex on dark screens.
2. **Cyan Innovations logo** (isometric C mark) present on every screen in the top-left nav. Full-colour on light screens, monochrome white on dark screens.
3. **Monospace font** on all numeric values: cash balance, AOV, capacity numbers, KPI figures, timer.
3. **Why Tags** on the Weekly Results screen — 3–5 causal tags appearing at the top of the results before metrics. These are the primary teaching tool. They must be prominent, coloured, and labelled with causal language.
4. **DCF Valuation Card** on the Semi-Annual Board Review — must show Enterprise Value, Founder Value, and 3 driver gauges. Not a placeholder.
5. **Monthly decisions must not appear on the Weekly Cockpit**. They appear only on the Month Review screen.
6. **Market View screen must show zero per-team financials or decisions**. Only anonymised aggregate data and positioning badges.
7. **Timer must be visible on all weekly cockpit states** — green, amber, and red stages must be visually distinct.
8. **Setup Wizard has 5 stages** — Location, Capacity, Employees, Marketing, Positioning. Stage 5 (Positioning) is new and not yet in Figma. It must be built.
9. **Pencil-sketch illustration style** for all location and character art. Not flat icon style, not photographic.
10. **"Once submitted, you cannot change your decision"** note must appear on every weekly decision input field.

---

## SCREENS NOT REQUIRED IN THIS PASS (build these next)

- Batch Mode screens (4-week, 13-week, until-next-review)
- Annual Board Review full P&L screen
- Final Results + Leaderboard
- Fundraising Modal (term sheet cards)
- Onboarding / Lobby / Team join screens

---

## SAMPLE DATA TO USE IN THE PROTOTYPE

Use the following sample data to populate all screens realistically:

- **Team name:** Team Alpha
- **Location:** Central Avenue (Location C)
- **Space:** 3,500 sq ft · Max 140 customers
- **Employees:** 7
- **Marketing budget:** 3% (~$3,000/wk)
- **Positioning:** Standard
- **Current week:** Week 7
- **Cash balance:** $412,500
- **Weekly revenue:** $24,800
- **Runway:** 18 weeks
- **Market share:** 28% (Team Alpha teal)
- **Competing teams:** 3 others (navy, purple, amber)
- **Active event:** None this week
- **Previous Why Tags:** MARKETING ↑ · CAPACITY HIT · RETENTION DROP

All monetary values: USD. All numeric outputs: monospace.

---

Build these 12 screens in sequence. Apply the design system consistently to every screen. The dot-grid, the teal CTAs, the coral cost figures, the monospace numbers, the pencil-sketch illustrations, and the Why Tags are the five most important visual signatures. Every screen should look like it was designed at the same time by the same team.

# PROMPT END