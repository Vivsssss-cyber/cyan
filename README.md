# Cyan Design Generator

AI-powered design tool that turns briefs into screens in the Cyan visual language.

## What it does

1. Write a design brief (or upload a PNG/JPG reference)
2. AI generates a new screen strictly in the Cyan design language
3. Preview the output live in-browser
4. Copy the HTML — paste anywhere

Every generation is saved locally so you can browse past screens.

---

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Home — history of all generated designs |
| `/design-generator` | AI design tool — write brief, upload reference, generate |
| `/design-system` | Interactive design language reference |

---

## Setup

```bash
npm install
```

Add your Anthropic API key to `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Then run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Design System

All design rules live in `/design-rules/`:

| File | Purpose |
|------|---------|
| `DESIGN.md` | Master reference — colors, typography, spacing, components |
| `tokens.css` | CSS custom properties (`--sv-*`) injected into every generated design |
| `design-dna.md` | Condensed character brief |
| `component-rules.md` | Card/button/form rules |

**Never hardcode hex values.** Always use `--sv-*` tokens.

---

## Tech Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS 4 + CSS custom properties
- shadcn/ui (Radix UI)
- `motion` (Framer Motion API)
- Anthropic SDK (`claude-sonnet-4-6`)

---

## Archived

Original simulation game screens are in `_archive/` — not used by the app but kept for reference.
