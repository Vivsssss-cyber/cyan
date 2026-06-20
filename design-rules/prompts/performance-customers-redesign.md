# Redesign Prompt — Performance & Customers Report

Use this prompt with the `/design-generator` route, or as a brief when building the
screen by hand. It reinterprets a generic "Performance & Customers" analytics page
through the Cyan command-center design language — it does **not** copy the source layout.

---

## Brief

Redesign the **Performance & Customers** page of Startup Valley: a single-screen,
print-ready report (page 2 of 3) that tells the story of how a café startup
("Dhaulagiri Cafe") won its market over five years. Dense data, calm surfaces,
editorial rhythm. One screen, no scroll-jank — it reads top to bottom like a
well-set magazine spread.

## Sections (top → bottom)

1. **Header band** — eyebrow chip "Performance & Customers" + title. A thin
   ink-line illustration strip of a café interior runs along the top edge
   (hand-drawn, single-weight stroke, no fill — matches the tactile/editorial pillar).

2. **KPI row (4 cards)** — flat glass cards, each a label + big tabular number +
   delta chip + a tiny sparkline:
   - Market Share **32.4%** · #1 out of 4 teams
   - Total Customers **86,420** · +58.6% vs Year 4
   - Customer Retention **71.0%** · +9.8 pp vs Year 4
   - Avg. Order Value **$18.40** · +6.1% vs Year 4
   No left-accent ribbon. Accent shown as a small label dot only.

3. **Competitive Landscape** (wide, ~1.5fr) — multi-line chart, market share
   evolution over 5 years for 5 teams. Your team (Dhaulagiri) is the only series
   in the cyan accent and is bolder; competitors are muted teal/green/grey.
   Insight banner below: "You grew market share every year and finished #1 with a 4.3 pp lead."

4. **Acquisition & Loyalty Funnel** (~1fr, beside #3) — 5-stage funnel:
   Awareness 520,000 (100%) → Visits 201,760 (38.8%) → Purchases 62,120 (30.8%)
   → Repeat 39,110 (63.0%) → Loyal 20,920 (53.5%). Step-to-step conversion labels
   between bands. Banner: "20,920 loyal customers drove 46.8% of total revenue."

5. **Customer Segment Snapshot** (3 persona cards) — Value Seekers 42%,
   Balanced Buyers 37%, Premium Loyalists 21% (of revenue). Each card: an ink-line
   persona illustration, % of revenue, Avg Spend/Visit, Retention Rate, Growth vs Year 4.
   Banner: "Premium Loyalists are your most loyal and highest spending segment."

6. **Product & Sales Mix** — asymmetric bento (not 3-equal grid). Beverages get the
   larger tiles. 6 products with revenue share + units: Espresso 28.6% / 24,580,
   Cappuccino 23.4% / 20,120, Cold Brew 16.8% / 14,520, Croissant 15.2% / 12,480,
   Muffin 9.8% / 8,040, Whole Bean 6.2% / 3,920. Filled teal tiles for beverages,
   soft tiles for food. Banner: "Beverages drove 68.8% of revenue."

7. **Market Pulse** (wide) — composed chart over Q1Y1…Q4Y5: stacked area for
   customer-mix (Value Seekers / Balanced / Premium) + a footfall line on a second
   axis. Banner: "Footfall grew 2.4x from Year 1 to Year 5, shift toward higher-value customers."

8. **How You Won Customers** (beside #7) — 3 levers as a list: Smart Pricing
   (+2.6 pp conversion uplift), Better Retention (+9.8 pp retention lift),
   Stronger Segment Fit (+4.3 pp share advantage). Lucide icon + delta chip each.
   Banner: "Execution clarity, customer focus, and consistency won the game."

9. **Footer** — "Strong choices. Steady execution. Sustainable success." + "Page 2 of 3".

## Design rules (hard constraints)

- Root `GridBackground` → `PageTransition`. Max width 1312px.
- Cards: `rgba(255,255,255,0.6)`, `1.4px solid white`, radius 16px, padding 20px.
- All big numbers: `font-variant-numeric: tabular-nums`.
- Colors via `--game-*` tokens only. No hardcoded hex in markup.
- Asymmetric grids — never 3 equal columns.
- Cyan accent reserved for *your* data series + chips. Competitors are neutral.
- Lucide icons + ink-line SVG illustrations only. No emojis, no stock photos.
- Insight banners: soft-success tinted, rounded 12px, small icon + one sentence.
- No purple in chrome (chart series only), no pure black, Outfit font only.
