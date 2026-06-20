# Cyan Design Migrate Bundle

Portable Cyan / Startup Valley design theme. Drop into any Next.js 15 + Tailwind v4 project to inherit the full visual language: tokens, icon system, core components, and a live showcase page.

---

## Contents

```
design-migrate/
├── styles/
│   ├── tokens.css       # --sv-* CSS custom properties (portable token layer)
│   ├── theme.css        # --game-* full theme (mirrors tokens + Tailwind v4 @theme)
│   ├── fonts.css        # Outfit + Courier New @font-face / @import
│   ├── tailwind.css     # Tailwind v4 entry (@import "tailwindcss")
│   └── index.css        # Aggregator
├── docs/
│   ├── DESIGN.md              # Master design reference
│   ├── component-rules.md     # Card/button/form/layout rules
│   ├── icon-system-rules.md   # Icon source-of-truth rules
│   ├── Descrptive-design.md   # Long-form character brief
│   └── README.md
├── components/
│   ├── PixelIcons.tsx         # Streamline Pixel icon wrapper (lucide-compatible names)
│   ├── GridBackground.tsx     # Page canvas + 63px grid texture
│   ├── PageTransition.tsx     # Fade + translate-y enter animation
│   ├── CyanLogo.tsx           # Brand mark
│   ├── GameButton.tsx         # Primary CTA pill (gradient + arrow)
│   ├── GameHeader.tsx         # Top app header with status pills
│   ├── TabBar.tsx             # Tab control
│   ├── SetupHeader.tsx        # Alternate header for setup flows
│   ├── PageActionBar.tsx      # Sticky action row
│   ├── shared.tsx             # PrimaryCTA, SectionLabel, ImpactTag, etc.
│   ├── DesignSystem.tsx       # Living showcase page (mount as a route)
│   └── icons/                 # 663 Streamline Pixel SVG assets
└── package.json
```

---

## Install in target project

### 1. Copy folder
Copy `design-migrate/` into the target repo. Suggested locations:

| Source | Target |
|---|---|
| `design-migrate/styles/*` | `src/styles/` |
| `design-migrate/docs/*` | `design-rules/` (project root) |
| `design-migrate/components/*` | `src/app/components/` |
| `design-migrate/components/icons/*` | `src/app/components/icons/` |

### 2. Install dependencies

```bash
npm install motion recharts
npm install -D tailwindcss @tailwindcss/postcss
```

Tailwind v4 PostCSS config (`postcss.config.mjs`):

```js
export default { plugins: { "@tailwindcss/postcss": {} } };
```

### 3. Wire styles
In `src/app/layout.tsx` (or root `_app`):

```tsx
import "../styles/fonts.css";
import "../styles/tailwind.css";
import "../styles/theme.css";
import "../styles/tokens.css";
```

Order matters: fonts → tailwind → theme → tokens.

### 4. Outfit font
`fonts.css` references Outfit. Self-host or use Google Fonts:

```tsx
// app/layout.tsx
import { Outfit } from "next/font/google";
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
```

### 5. Mount showcase (optional)
Verify everything works by exposing the showcase:

```tsx
// app/design-system/page.tsx
"use client";
import { DesignSystemPage } from "@/components/DesignSystem";
export default function Page() { return <DesignSystemPage />; }
```

---

## Usage primitives

```tsx
import { GridBackground } from "@/components/GridBackground";
import { PageTransition } from "@/components/PageTransition";
import { GameButton } from "@/components/GameButton";
import { ArrowUpRight, TrendingUp } from "@/components/PixelIcons";

export default function MyScreen() {
  return (
    <GridBackground>
      <PageTransition>
        <main className="max-w-[1288px] mx-auto px-6 py-8">
          {/* glass card */}
          <div style={{
            background: "var(--sv-card)",
            border: "1.4px solid white",
            borderRadius: "var(--sv-radius-2xl)",
            padding: 20,
          }}>
            <TrendingUp size={16} color="var(--sv-positive)" />
            <GameButton onClick={() => {}}>Continue</GameButton>
          </div>
        </main>
      </PageTransition>
    </GridBackground>
  );
}
```

---

## Token reference (quick)

- Cards: `background: var(--sv-card)`, `border: 1.4px solid white`, `border-radius: var(--sv-radius-2xl)`, `padding: 20px`
- Primary accent: `var(--sv-cyan)` (#00C1EB)
- Active/interactive teal: `var(--sv-teal-mid)` (#006E85)
- Positive delta: `var(--sv-positive)` (#156162)
- Negative delta: `var(--sv-negative)` (#c65252)
- Warning: `var(--sv-warning)` (#B45309)
- Max page width: `var(--sv-max-page-width)` (1288px)
- Grid texture: `var(--sv-grid-size)` (63px)

Full token list: `styles/tokens.css` and `docs/DESIGN.md`.

---

## Icon system

- Source of truth: `components/icons/` (663 Streamline Pixel SVGs)
- Consume via `PixelIcons.tsx` — exports lucide-compatible names (`ChevronRight`, `AlertTriangle`, `Users`, ...)
- API: `<Icon size={20} color="var(--sv-teal-mid)" />`
- **Banned:** `lucide-react`, Heroicons, Font Awesome, Material Icons, emoji, hand-drawn one-off SVG paths
- See `docs/icon-system-rules.md` for full enforcement rules

To add icons: drop SVG into `components/icons/`, add import + export in `PixelIcons.tsx`.

---

## What this bundle does NOT include

- `lucide-react` — replaced by PixelIcons
- shadcn/ui primitives (`button`, `card`, etc.) — none of the core components depend on them
- Game logic (GameContext, route-registry, game-state)
- App routes / pages

Add any of these in the target project as needed.

---

## Anti-patterns (banned — see docs/DESIGN.md §11)

- No emojis — PixelIcons only
- No Inter, Georgia, serif fonts — Outfit only
- No pure black `#000000` — use `var(--sv-ink)` (#002C33)
- No purple in UI chrome — charts only
- No 3-equal-column card grids — asymmetric splits
- No hardcoded hex in components — `var(--sv-*)` tokens only
- No floating labels — label above input always
- No border-radius > 24px on interface components (pill 9999px exempt)

---

## Verify install

After wiring, mount `DesignSystem.tsx` as a route. You should see:

- Outfit font everywhere
- Cyan canvas with grid texture
- Glass cards with white 1.4px borders
- Pixel icons rendering crisp at 12-24px
- Token swatches matching `docs/DESIGN.md` color table
