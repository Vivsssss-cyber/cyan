# Prompt — Redesign CyanSim Student Entry (screens 51–56) for better UX

> Paste this whole file as the task. It carries the project context, design-system rules,
> the deck reference, and the UX bar. Build to it; don't restate it back.

---

## Role
You are a senior product designer + frontend engineer on **CyanSim**, a business-simulation
learning platform. You design for functional minimalism — low cognitive load, warm/breathable,
anti-generic. You ship real, token-clean React.

## Task
Redesign and build the **Student Entry** flow (deck Module 4, screens 51–56) as `/sim/play/*`
routes, raising the UX bar above a literal 1:1 of the mockups. Keep the deck's intent and content;
improve the interaction. Screen 53 (Student Home) already exists — align to it, don't rebuild.

Flow (chain forward, each step advances):
`Join (51) → Identity (52) → Home (53, exists) → Brief (54) → Team Lobby (55) → Readiness (56) → Decide`

---

## Project context (must follow exactly)

**Stack / wiring**
- Next.js 15 App Router, single catch-all `src/app/[[...slug]]/page.tsx` + `src/lib/route-registry.ts`.
  Add each screen = import + entry in `routeRegistry`. `/sim/*` is auto-wrapped in `SimProvider`.
- Components live in `src/components/sim/`, named exports, `'use client'`.
- Cross-screen state: `src/context/SimContext.tsx` (`useSim`) — scenario, decision, rationale already there.

**Design system — use, never reinvent**
- Tokens only (no hardcoded brand/semantic hex). Pull color consts from `src/components/sim/sim-ui.tsx`:
  `ink, body, muted, faint, cyan, tealMid, tealDark, success, negative, warning, positive, cyanTint, whisper, surfaceSoft`
  (these resolve to `--game-*` / `--sv-*` / `--cyan-tint`). Neutral fills via `surfaceSoft` / `var(--sv-border)`.
- Type: **Outfit** for display/headings/body, **Inter** for dense data/tables/numbers (`fontVariantNumeric: tabular-nums`). **No serif.**
- Icons: **Streamline Pixel only**, via `src/components/PixelIcons.tsx`. **No `lucide-react`, no emoji, no other icon packs.**
  If an icon is missing, wire an existing SVG from `src/components/icons/` into PixelIcons (don't add a package, don't hand-draw).
- Reuse primitives: `SimStudentShell`, `DeckCard`, `DeckStat`, `StatusPill`, `PageHead`, `CtaButton`, `OutlineButton`,
  `GhostButton`, `Eyebrow`, `Tag`, `VoiceRecorder`/`TabRationale` (from `RationaleCapture.tsx`). Cards = glass
  (`CARD`/`DeckCard`), 16px radius, 20px padding, `--game-card-border`, elevation ladder.
- Shell choice: **pre-auth** screens (51 Join, 52 Identity) = full-screen, no app chrome (focused gate — a
  centered card IS allowed here; it's the one exception to "no centered hero"). **In-app** screens
  (54 Brief, 55 Lobby, 56 Readiness) = wrap in `SimStudentShell` (top bar: brand, season·round, Level/XP).
- Motion: spring lifts + staggered reveal, `transform`/`opacity` only, honor `prefers-reduced-motion`. No spinners — skeletal shimmer.

**Anti-patterns (banned):** lucide/emoji icons; hardcoded brand hex; `Inter` for headings or serif anywhere;
3-equal-column card grids; pure black `#000`; floating input labels (label always above); circular spinners;
radius > 24px except pill buttons; AI-cliché copy ("Elevate/Seamless/Unleash/Next-Gen"); fake-round KPI numbers.

---

## Deck reference (content per screen)

- **51 Student Join** — split: left dark brand panel ("Make decisions. See the impact. Lead your company."),
  right join card: Join Code input, **Join Simulation** CTA, divider "or", **Log in with School Account**,
  footer "New here? Preview the experience".
- **52 Identity Confirmation** — "Confirm it's you", avatar + name (Alex Johnson) + email + school
  (Riverside High School), **Yes, that's me** / **Use a different account**, "Not you?" escape.
- **53 Student Home** — EXISTS (`SimTeamDashboard`, `/sim/play`). Match its style; link into it.
- **54 Simulation Brief** — "Round 2 Brief — Expanding Our Footprint", narrative paragraphs, supporting image,
  **Key Objectives** (Grow Market Share, Improve Customer Satisfaction, Maintain Strong Profitability),
  encouragement line, **Continue to Team Lobby**.
- **55 Team Lobby** — team card (Peak Performance, Rank #4 of 24), member avatars + roles (Alex—CEO,
  Maya—Marketing, Jordan—Operations, Taylor—Finance), a teammate chat message, **Team Activity** feed,
  **Enter Readiness Check**.
- **56 Readiness Check** — "Are you ready?" checklist (Read the brief, Review market & company data,
  Check team updates, Discuss as a team, Ready to decide), **Team Progress 3/5**, **Let's Go!** (unlocks the round).

---

## UX bar — make it better than the mockup

Raise the interaction quality on every screen. Concrete asks:

1. **Join (51):** segmented/auto-advancing code input (one box per char), autofocus, paste-to-fill, uppercase
   normalization; inline error state for bad codes (no modal); prefill code from `?code=` query (deep link from invite);
   loading uses shimmer on the CTA, not a spinner; "Preview the experience" enters a read-only sandbox. Keyboard: Enter submits.
2. **Identity (52):** one-glance reassurance, single primary confirm, low-friction escape; show *why* we ask
   (joining the right class) in one muted line; avatar from initials if no photo (no broken image).
3. **Brief (54):** narrative is the hero — Outfit body, ~65ch, generous leading; objectives as scannable rows with
   met/in-progress state; a quiet "time to decide" cue; exactly one forward CTA. Optionally collapse long brief with "read more".
4. **Lobby (55):** show **presence** (who has joined / is active now via status dots), roles as chips, a lightweight
   read-only chat preview + "I'm here" affordance; activity feed with pixel-icon event types; readiness entry is the one CTA.
5. **Readiness (56):** checklist that **gates** the CTA — each item links to the thing it checks (brief/data/updates),
   checking by doing where possible; positive framing (counter turns success-green at complete, never red-shames);
   show team progress as well as personal; `Let's Go!` disabled-with-reason until personal items complete.

**Component states to define** for any new interactive control (code input, checklist item, confirm):
default · focus/active · filled/checked · disabled (always say *why*) · error · success.

**Accessibility:** label above every field; full keyboard path join→readiness; `aria` on the code input and
checklist; focus-visible `2px solid var(--game-cyan)` offset 2; color never the only signal (pair icon/text).

---

## Deliverables
- New components in `src/components/sim/` (e.g. `SimJoin`, `SimIdentity`, `SimBrief`, `SimTeamLobby`, `SimReadiness`),
  routes `/sim/play/join`, `/sim/play/identity`, `/sim/play/brief`, `/sim/play/lobby`, `/sim/play/readiness`.
- Registry imports + entries added; navigation chained forward; sensible cross-links from `SimTeamDashboard`
  (e.g. "View brief" → `/sim/play/brief`, a "Team lobby" entry) and from Join → Identity → Home.
- Realistic mock data (no fake round numbers). Pixel icons + tokens throughout.
- **Verify before done:** `npx tsc --noEmit` = 0 errors; dev server returns 200/clean for every new route;
  grep changed files to confirm zero `lucide-react` / emoji.

## Acceptance check
- [ ] All 5 routes 200, no Next error overlay, 0 TS errors
- [ ] No `lucide-react`, no emoji, no hardcoded brand hex in changed files
- [ ] Join code input: segmented, autofocus, paste, error + success states, deep-link prefill
- [ ] Readiness `Let's Go!` gated + disabled-reason; progress turns success-green at complete
- [ ] Flow clicks straight through: Join → Identity → Home → Brief → Lobby → Readiness → `/sim/play/decide`
