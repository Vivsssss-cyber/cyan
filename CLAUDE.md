# Startup Valley — Project Guide for AI Assistants

## What This Project Is

A Next.js 15 simulation game interface (Startup Valley) where players run a startup through monthly decisions. The UI is a dense command-center dashboard with KPIs, charts, and decision surfaces. The design language is well-defined and must be followed exactly.

---

## Design System — Source of Truth

All design decisions live in `/design-rules/`. Read these before generating any screen:

| File | Purpose |
|------|---------|
| `design-rules/DESIGN.md` | Master reference — colors, typography, spacing, components, anti-patterns |
| `design-rules/tokens.css` | CSS custom properties (`--sv-*` prefix) — portable token layer |
| `design-rules/design-dna.md` | Condensed character brief — read this first |
| `design-rules/component-rules.md` | Card/button/form/layout rules |
| `design-rules/chart-theme.md` | Single-accent cyan chart language (shadcn-style) — reusable prompt + shared primitives for restyling graphs/infographics |

**Never hardcode hex values in components.** Use `--game-*` tokens (from `src/styles/theme.css`) or `--sv-*` tokens (from `design-rules/tokens.css`).

---

## How to Generate New Screens

1. Start with `GridBackground` as the root background component
2. Wrap content in `PageTransition` for enter animation
3. All cards: `background: rgba(255,255,255,0.6)`, `border: 1.4px solid white`, `border-radius: 16px`, `padding: 20px`
4. Use `SectionLabel` pattern for section headers (eyebrow chip + title)
5. KPI numbers: add `font-variant-numeric: tabular-nums` (or `.tabular` class)
6. Max container width: `1288px` (`--max-w-page`)
7. Layout: asymmetric CSS Grid. No 3-equal-column grids.

---

## Tech Stack

- **Framework:** Next.js 15 App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 + CSS custom properties
- **UI Components:** shadcn/ui (Radix UI based) in `src/app/components/ui/`
- **Animation:** `motion` library (Framer Motion API)
- **Charts:** Recharts
- **Icons:** Lucide React only — no emojis

---

## Route System

Routing uses a **catch-all pattern**:

1. `app/[[...slug]]/page.tsx` — single catch-all entry point
2. `src/lib/route-registry.ts` — maps URL paths to React components
3. Adding a new screen = add import + entry to `routeRegistry` object

Example:
```typescript
// route-registry.ts
import { MyScreen } from "../app/components/MyScreen";
"/my-screen": MyScreen,
```

---

## Component File Conventions

- Location: `src/app/components/ComponentName.tsx`
- Export: named export (`export function ComponentName`)
- Custom game components: `src/app/components/custom/`
- shadcn/ui components: `src/app/components/ui/` (do not modify)

---

## Anti-Patterns (Critical — Never Do These)

- No emojis — Lucide icons only
- No Inter, Georgia, or serif fonts — Outfit only
- No pure black `#000000` — use `#002C33` or `var(--sv-ink)`
- No purple (`#7C3AED`) in UI chrome — chart data series only
- No 3-equal-column card grids — use asymmetric splits
- No left-accent ribbon border on KPI/stat cards (anti-ribbon rule) — no `border-left: 4px solid <accent>`; KPI cards are flat glass, accent shown as a small label dot
- No floating labels — label always above the input field
- No hardcoded hex values in components
- No AI copywriting clichés ("Elevate", "Seamless", "Unleash", "Next-Gen")
- No circular loading spinners — use skeletal shimmer
- No centered hero layouts — left-align or asymmetric split
- No border-radius > 24px on interface components (pill buttons exempt)

---

## AI Design Generator

The `/design-generator` route is the main AI tool in this project. It:
1. Takes a text brief + optional image upload
2. Calls the Claude API with the full design-rules as system context
3. Returns self-contained HTML rendered in a sandboxed iframe
4. Strictly reinterprets the brief through the Cyan design language — does not copy the upload

API route: `app/api/design-generator/route.ts`  
Environment variable required: `ANTHROPIC_API_KEY` in `.env.local`
