# CyanSim — Frontend UX Architecture & Component Plan

> Masterclass UX plan for the CyanSim simulation-based learning platform.
> Philosophy: functional minimalism — precision over volume, impact over complexity.
> Built on the Cyan design system (`design.md`). Long-form, breathable, anti-AI, low cognitive load.

---

## 0. Design System Lock (resolved)

These two choices govern every screen below.

| Axis | Decision | Notes |
|------|----------|-------|
| **Color** | Cyan single-accent (`design.md`) | One cyan accent marks *only* what is interactive/active. Lime-green is **reserved** for semantic success + critical alerts — never decoration. |
| **Type** | Outfit display + **Inter for dense data**, no serif | Outfit = headings/display/UI body. Inter = tables, KPI grids, dashboards (max legibility at density). Serif banned everywhere, including long-form briefs (those use Outfit body). |

**Token quick-reference (from `design.md`)**

```
SURFACES   canvas #EFF2F4 (grid texture) · glass rgba(255,255,255,.6) · solid #FFFFFF
BORDERS    whisper #C8DDE6 (1px) · card edge 1.4px solid #FFFFFF
INK        deep teal #002C33 (the "black") · body #202326 · muted #606569 · faint #94A3B8
ACCENT     cyan primary #00C1EB · bright #00D2FF · tint #E0F7FF · CTA grad #00B1D6→#0090AD
DEEP TEAL  mid #006E85 (eyebrows) · dark #003D47 (sidebar/dark panels)
SEMANTIC   positive #156162 · success #166534 · negative #C65252 · warning #B45309
TYPE       Outfit (display/UI) · Inter (dense data/tables) · tabular-nums on all numbers
RADIUS     16px cards · 8px inputs/ghost · 43px pill (exempt from 24px cap)
MOTION     spring (stiffness~100 damping~20) · staggered reveal · transform+opacity only
ICONS      Lucide line icons only · no emoji
LOADERS    skeletal shimmer (never spinners)
GRID       asymmetric · max 1312px · 20px+ panel padding · no 3-equal columns
```

**Global guardrails applied to all screens:** root = `GridBackground`; content wrapped in `PageTransition`; `SectionLabel` (eyebrow chip + title) for every section header; no left-ribbon on stat cards (label-dot only); no centered hero; `min-h-[100dvh]` for full-height regions.

---

## 1. Experience Map & Information Architecture

Five role-gated surfaces. A user only ever sees the surface(s) their role unlocks — this is the core friction cut: teachers never meet a configurator, students never meet analytics chrome.

```
                       ┌──────────────────────────────────────────┐
                       │              CyanSim shell                  │
                       │   GridBackground · top role-switcher rail   │
                       └──────────────────────────────────────────┘
   ADMIN (/sim/admin)      TEACHER (/sim/teacher)     STUDENT (/sim/play)
   ─────────────────       ──────────────────────     ──────────────────
   Studio Dashboard        Facilitator Home           Join & Readiness
   Block Canvas            Scenario Library           Team Dashboard + Brief
   Economy & Rules         Session Setup Wizard       Decision Modules
   Balance Sandbox         Live Facilitation Monitor  Rationale & Evidence  ◀ crucial
                           Mentor Loop / Feedback     Round Results + Reflect

         ANALYTICS (/sim/analytics)            EVENTS (/sim/events)
         ───────────────────────              ────────────────────
         Auto-Debrief Pack (teacher)          Event Control Center
         Learner Growth Profile (student)
```

**Routing** (catch-all per project convention): each screen registered in `route-registry.ts` under its `/sim/*` path. Role determines which registry entries resolve; unauthorized paths fall to a composed empty-state, not a 404 wall.

**Density gradient by surface** (deliberate, matches cognitive load of each role):
- Admin = 8/10 cockpit-dense (power users, deep config).
- Teacher = 5/10 calm command-center (facilitation, not configuration).
- Student = 4/10 focused & guided (one decision at a time; never overwhelm a learner).
- Analytics = 6/10 (read + present).
- Events = 9/10 high-contrast live display (room-scale legibility).

---

## 2. Core User Flows (Deliverable 1)

### 2A. Teacher launches a scenario — exact click-path

**Goal/North-star:** scenario selection → playable class in **under 5 minutes**, zero game-design knowledge.

```
[Facilitator Home /sim/teacher]
  │ click "Quick Launch" (primary CTA, top-right of greeting band)
  ▼
[Scenario Library Browser /sim/teacher/library]
  │ left filter rail → check {Duration: 90min} {Subject: Supply Chain}
  │ results restyle live (no Apply button — instant filter, skeletal shimmer on swap)
  │ hover a Scenario Card → spring lift + "Preview" / "Assign to Class" reveal
  │ (optional) click "Preview" → side drawer: objectives, modules, sample round  ─┐
  │ click "Assign to Class" (CTA gradient pill)                                    │ drawer closes,
  ▼                                                                                ◀─┘ carries selection
[Session Setup Wizard — step 1/4 · Select Scenario  ✓ pre-filled]
  │ scenario already chosen from prior screen → "Next" enabled by default
  ▼
[step 2/4 · Roster & Teams]
  │ drag students from roster column → team lanes (or "Auto-balance" ghost button)
  │ team count stepper; live "unassigned: 0" validator turns success-green at 0
  │ "Next"
  ▼
[step 3/4 · Schedule & Timeline]
  │ pick start (calendar input, label above) · session length · sim speed (safe knob)
  │ rounds auto-derive from length → shown as read-only timeline ribbon preview
  │ "Next"
  ▼
[step 4/4 · Launch Confirmation]
  │ one-glance summary card: scenario · N teams · M students · duration · start time
  │ inline edit chips (jump back to any step without losing state)
  │ click "Launch Class" (CTA gradient pill, + lime success pulse on press)
  ▼
[Live Facilitation Monitor /sim/teacher/live/:sessionId]
  → empty-but-ready state: teams listed "Waiting to join", join code shown large,
    Round Controls disabled until ≥1 team joins (disabled = clear, not greyed-dead)
```

**Friction cuts baked into the path:**
- Quick Launch → Library → Wizard is a *forward-only corridor*; selection persists, never re-asked.
- No simulation parameters surface anywhere (admin pre-whitelisted the safe knobs).
- Wizard step 1 arrives pre-satisfied, so the 4-step bar visually starts 25% done — momentum signal.
- Launch button is the only CTA-gradient element per screen — eye always knows the exit.

---

### 2B. Student submits a decision with voice rationale — exact click-path

**Goal:** capture *what* and *why* with near-zero added friction over a plain form submit.

```
[Team Dashboard /sim/play]  (round is OPEN, brief read)
  │ click "Make Decisions" (CTA)
  ▼
[Decision Modules — tabbed: Marketing · Product · Operations · Finance]
  │ adjust inputs (sliders/steppers/toggles)
  │ persistent "Budget Available" tracker decrements live; goes warning-amber if <0
  │ each tab shows a small ✓ dot once touched (progress without nagging)
  │ click "Review & Submit" (enabled once budget ≥ 0)
  ▼
[Decision Rationale & Evidence Capture]  ◀ dedicated screen, pre-final
  │ ① drafted-decisions summary (read-only recap, grouped by function)
  │ ② Voice Note Recorder
  │     click ● Record → live waveform + 90s countdown ring
  │     speak → click ■ Stop → auto-transcription streams in below (editable)
  │     (or) click "Type instead" → textarea fallback (accessibility / quiet room)
  │ ③ Assumption Log textarea ("demand is price-sensitive…")
  │ ④ Confidence Rating — circular slider 1–10 (cyan arc fills as dragged)
  │ click "Submit Decision" (CTA gradient; requires confidence set; rationale optional but nudged)
  ▼
[Confirmation state]
  → success-green check seal + "Locked in for Round 3" + countdown to results
  → decision now read-only; "View my submission" link → replay card
```

**Why this order works:** decisions are *drafted* in the module (low commitment), then rationale is captured at the moment of strongest conviction (right before lock-in), then a single irreversible submit. Voice is the default fast path; typing is an equal-status fallback, never a penalty.

**Confirmation copy is human, not clichéd:** "Locked in for Round 3" — not "Submission successful!" / "Seamless!".

---

## 3. Screen-by-Screen Layouts (Deliverable 2)

Depth priority per the brief: **Teacher Console** and **Student App** in full; Admin / Analytics / Events condensed.

### 3.1 — Teacher Console

#### 2.1 Facilitator Home & My Classes  `/sim/teacher`
Calm card dashboard. Asymmetric: dominant class column + narrow cadence rail.

```
┌───────────────────────────────────────────────────────────────────────┐
│  eyebrow: GOOD MORNING                              [ Quick Launch ▸ ]  │ ← greeting band, CTA right
│  Welcome back, Dr. Rao                                                  │   Outfit 800 display
├──────────────────────────────────────────┬────────────────────────────┤
│  ACTIVE CLASSES (dominant col ~62%)       │  RECENT ACTIVITY (rail ~38%)│
│  ┌────────────────────────────────────┐  │  ┌──────────────────────┐  │
│  │ ● live  FMCG Competition  · Rnd 3  │  │  │ Sat · Intro to SC     │  │
│  │ 6 teams · 24 students · 12m left   │  │  │ ended · debrief ready │  │
│  │ [ Open Monitor ▸ ]   2 alerts ◀────┼──┼──│ ...                   │  │
│  └────────────────────────────────────┘  │  └──────────────────────┘  │
│  ┌────────────────────────────────────┐  │  small, Inter, timestamps   │
│  │ ○ scheduled  Finance Fundamentals  │  │  faint-steel                │
│  │ starts Mon 10:00 · 5 teams set     │  │                             │
│  └────────────────────────────────────┘  │                             │
└──────────────────────────────────────────┴────────────────────────────┘
```
- **Hierarchy:** live class card sits first, carries a cyan live-dot + the only inline alert badge (count in negative-red only if struggle alerts exist).
- **Components:** `ClassCard` (status dot, KPIs in Inter tabular-nums, primary "Open Monitor"), `QuickLaunchButton` (CTA), `ActivityFeedItem`, composed empty-state ("No classes yet — pick a scenario to begin" + illustration) when zero classes.
- **Anti-clutter:** no graphs here. Home is orientation, not analysis.

#### 2.2 Scenario Library Browser  `/sim/teacher/library`
E-commerce catalog cadence; filter rail + card grid (2-up, never 3-equal).

```
┌──────────────┬────────────────────────────────────────────────────────┐
│ FILTERS rail │  eyebrow: SCENARIO CATALOG                               │
│ ── Duration  │  ┌───────────────────────┐ ┌───────────────────────┐    │
│ □ 90 min     │  │ Intro to Supply Chain │ │ FMCG Competition       │    │
│ □ Half-day   │  │ 90 min · Beginner      │ │ 3 weeks · Intermediate │    │
│ □ Semester   │  │ obj: cash flow, demand │ │ obj: pricing, share    │    │
│ ── Complexity│  │ ●●○ modules            │ │ ●●●● modules           │    │
│ □ Beginner   │  │ [Preview] [Assign ▸]   │ │ [Preview] [Assign ▸]   │    │
│ ── Subject   │  └───────────────────────┘ └───────────────────────┘    │
│ □ Finance    │  (instant filter, skeletal shimmer on result swap)       │
│ □ Marketing  │                                                          │
└──────────────┴────────────────────────────────────────────────────────┘
```
- **Discovery by learning goal, not parameters:** cards lead with objectives + pedagogy tags; complexity shown as filled-dot tier glyph (not numbers).
- **Components:** `FilterRail` (checkbox groups, label above), `ScenarioCard` (title Outfit, meta Inter, objective chips cyan-tint, dual action), `PreviewDrawer` (right side-sheet: sample round, expected duration, reflection checkpoints).
- **Selected card state:** border → `1.4px rgba(21,97,98,.33)` + cyan-tint elev — per design.md, edge+tint not ribbon.

#### 2.3 Session Setup Wizard  `/sim/teacher/setup`
4-step horizontal progress. One decision per step; state persists across back-nav.

```
┌───────────────────────────────────────────────────────────────────────┐
│  ①─Scenario ✓ ──── ②─Teams ● ──── ③─Schedule ○ ──── ④─Launch ○          │ ← progress rail
├───────────────────────────────────────────────────────────────────────┤
│  STEP 2 · Roster & Teams                          [ Auto-balance ]      │
│  ┌────────────────┐   drag →   ┌────────┐ ┌────────┐ ┌────────┐         │
│  │ Unassigned (0) │            │ Team A │ │ Team B │ │ Team C │         │
│  │ · Aanya        │            │ 4 ●●●● │ │ 4 ●●●● │ │ 4 ●●●● │         │
│  │ · Bose ...     │            └────────┘ └────────┘ └────────┘         │
│  └────────────────┘   validator: "unassigned: 0" ✓ (success-green)      │
│                                                  [ Back ]  [ Next ▸ ]    │
└───────────────────────────────────────────────────────────────────────┘
```
- **Hierarchy:** progress rail is persistent orientation; current step title Outfit-bold; one primary "Next" CTA bottom-right, ghost "Back" left.
- **Components:** `WizardProgress` (step states: done ✓ / active ● / pending ○), `DragRoster` + `TeamLane` (drag-drop), `Stepper`, `CalendarInput`, `TimelineRibbon` (read-only round preview), `LaunchSummaryCard` with inline edit chips.
- **Validation is positive-framed:** the "unassigned: 0" counter turns success-green rather than throwing an error.

#### 2.4 Live Facilitation Monitor  `/sim/teacher/live/:id`
Real-time command center. Dominant leaderboard + right control/alert rail. This is the teacher's cockpit during play.

```
┌───────────────────────────────────────────────────────────────────────┐
│  FMCG Competition · Round 3 of 6      ● LIVE   join: 4QК9   12:04 left   │ ← session band (Inter tabular)
├──────────────────────────────────────────────┬────────────────────────┤
│  LIVE LEADERBOARD (dominant)                   │  ROUND CONTROLS         │
│  #  Team       Net Profit   Share   Cash       │  [ ⏸ Pause ]            │
│  1  Team B     $182,400     31.2%   $74k  ▲    │  [ ＋ Extend +5m ]      │
│  2  Team A     $171,050     28.7%   $61k  ▲    │  [ ⏹ End Early ]        │
│  3  Team D     $ 98,200     19.4%   $12k  ▽    │  ── speed ── 1× 2×      │
│  4  Team C    -$ 14,800      8.1%  -$3k  ⚠ ◀───┼─ INTERVENTION QUEUE    │
│  (rows = Inter tabular-nums; ⚠ = negative red) │  ┌──────────────────┐  │
│                                                │  │ ⚠ Team C neg cash │  │
│  [ Broadcast ▾ ] [ Push question ▾ ]           │  │ suggested: "What  │  │
│                                                │  │ drove the spend?" │  │
│                                                │  │ [ Open thread ▸ ] │  │
│                                                │  └──────────────────┘  │
└────────────────────────────────────────────────┴────────────────────────┘
```
- **Hierarchy:** leaderboard reads first; struggling team is visually pulled out by negative-red value + ⚠, *not* a row ribbon. Intervention Queue rail is the action surface.
- **Components:** `SessionStatusBand`, `LiveLeaderboard` (sortable, delta arrows positive/negative tokens), `RoundControlsWidget`, `SpeedToggle` (safe knob), `InterventionCard` (alert reason + one suggested teacher question + jump-to-thread), `BroadcastMenu`, `PushQuestionMenu`, `SpotlightAction` (promote a team dashboard to projector).
- **Motion restraint:** value changes tween, no flashing. Live-dot is the only animated loop, slow pulse, respects reduced-motion.
- **Alerts are help, not surveillance:** every alert ships a suggested intervention — framing from the product doc's "learner-support signals, not surveillance".

#### 2.5 Mentor Loop & Feedback Panel  `/sim/teacher/mentor/:id`
Inbox split-view. Incoming rationale/questions left, feedback editor right. (Full friction analysis in §4.)

```
┌──────────────────────────────┬────────────────────────────────────────┐
│  INBOX (rationale · questions)│  CONTEXT + FEEDBACK EDITOR              │
│  ┌──────────────────────────┐ │  Team C · Round 3 · Marketing decision  │
│  │ ● Team C  "I'm stuck"     │ │  ── decision recap ──                   │
│  │   cut price 18%   2m ago  │◀┼─ Price ↓18% · Ad spend ↑$20k           │
│  ├──────────────────────────┤ │  ── their rationale (voice 0:42) ──     │
│  │ ○ Team A  rationale 🎙     │ │  ▶▮▮▮▮▯▯ transcript: "we assumed       │
│  │   confidence 8/10         │ │  demand is price-sensitive so…"         │
│  ├──────────────────────────┤ │  assumptions · confidence 4/10          │
│  │ ○ Team D  reflection      │ │  ── your reply ──                       │
│  └──────────────────────────┘ │  [Think Deeper][Check Data][Good call]  │ ← quick-tags
│  filter: unread · flagged     │  [ type… ] or [ 🎙 record reply ]        │
│                               │                       [ Send feedback ▸ ]│
└──────────────────────────────┴────────────────────────────────────────┘
```
- **Components:** `InboxList` (item = source type icon, team, snippet, age, unread dot), `DecisionRecapBlock`, `VoicePlayer` (waveform scrubber + synced transcript highlight), `AssumptionConfidenceReadout`, `QuickTagBar`, `ReplyComposer` (text/voice toggle), `SendFeedbackButton`.
- **Context never lost:** selecting an inbox item loads the *full* decision + rationale beside the editor, so the teacher replies in context (the doc's "contextual feedback" requirement).

---

### 3.2 — Student App

Calmer density (4/10). One thing asked at a time. Guidance over chrome.

#### 3.1 Join & Readiness Check  `/sim/play`
Centered modal card on a dynamic grid background — *the one place a centered card is allowed* (it's a focused gate, not a hero).

```
            ┌────────────────────────────────┐
            │   eyebrow: JOIN YOUR CLASS       │
            │   Enter class code               │
            │   ┌──────────────────────────┐   │
            │   │  4 Q К 9  _ _            │   │ ← segmented code input, label above
            │   └──────────────────────────┘   │
            │           [ Join ▸ ]             │
            └────────────────────────────────┘
   after auth → morphs (not new page) into:
            ┌────────────────────────────────┐
            │  READINESS CHECK · Team C        │
            │  ☑ Read the round brief          │
            │  ☑ Review market data            │
            │  ☐ Check team updates            │
            │  ── round unlocks when complete ─│
            │           [ Enter round ▸ ]      │  ← disabled until all ☑
            └────────────────────────────────┘
```
- **Components:** `JoinCodeInput` (segmented), `ReadinessChecklist` (each item links to the thing it asks for; checking is by *doing*, not self-attest where possible), `EnterRoundButton` (unlocks lime-tinged success when ready).
- **Why a gate:** the readiness check front-loads context so students arrive at decisions informed — cuts mid-round confusion friction.

#### 3.2 Team Dashboard & Brief  `/sim/play/dashboard`
Top summary banner + asymmetric split: KPI strip + brief column / team activity rail.

```
┌───────────────────────────────────────────────────────────────────────┐
│  Team C · FMCG Competition · Round 3 OPEN · 11:48 to decide              │ ← summary banner
├───────────────────────────────────────────────────────────────────────┤
│  KPI strip (flat glass tiles, label-dot accent, Inter tabular-nums)     │
│  ┌─────────┐ ┌─────────┐ ┌──────────────┐ ┌──────────┐                  │
│  │Market   │ │Net      │ │Customer Sat. │ │Cash      │                  │
│  │Share    │ │Profit   │ │              │ │Balance   │                  │
│  │ 19.4% ▽ │ │ $98.2k ▲│ │  72 / 100    │ │ $12.0k ⚠ │                  │
│  └─────────┘ └─────────┘ └──────────────┘ └──────────┘                  │
├──────────────────────────────────────────┬────────────────────────────┤
│  ROUND BRIEF (dominant, Outfit body)      │  TEAM ACTIVITY (rail)       │
│  "A new competitor entered the value       │  · Bose set ad budget       │
│   segment. Input costs rose 6%. Your       │  · Teacher: "Watch cash"    │
│   board expects margin discipline…"        │  · You: rationale pending   │
│                                            │                            │
│         [ Make Decisions ▸ ]               │                            │
└──────────────────────────────────────────┴────────────────────────────┘
```
- **Hierarchy:** banner (where/when) → KPIs (state) → brief (why) → CTA (act). Cash tile carries the only warning token when low.
- **Components:** `SummaryBanner` (round state + countdown), `KpiTile` (flat glass, label dot, delta token — **no left ribbon**), `RoundBrief` (Outfit long-form, ~65ch, NOT serif), `TeamActivityFeed`, `MakeDecisionsButton` (CTA).
- **Brief is narrative but legible:** generous leading, single column, breathable — the doc's "market situation" lives here.

#### 3.3 Decision Input Modules  `/sim/play/decide`
Tabbed by business function. Persistent budget tracker. Inputs are forgiving.

```
┌───────────────────────────────────────────────────────────────────────┐
│  [ Marketing ✓ ] [ Product ✓ ] [ Operations ] [ Finance ]   ← tabs      │
│  ───────────────────────────────────────────────────────────────────── │
│  MARKETING                                  ┌─────────────────────────┐ │
│  Ad spend         ── ●──────  $20,000       │ BUDGET AVAILABLE         │ │ ← sticky tracker
│  Price change     ──────●──   −18%          │ $50,000 → $30,000        │ │
│  Channel mix      [TV][Social●][Search●]    │ ▓▓▓▓▓▓░░░░ 60% used       │ │
│  Promo            ◯ off  ●  on              │ (amber if < 0)           │ │
│                                             └─────────────────────────┘ │
│                                       [ Review & Submit ▸ ]              │
└───────────────────────────────────────────────────────────────────────┘
```
- **Components:** `FunctionTabs` (touched = ✓ dot), `Slider`, `Stepper`, `SegmentToggle`, `Switch`, `BudgetTracker` (sticky, live decrement, amber on overspend, blocks submit at <0).
- **Forgiving by design:** values are reversible until final submit; no destructive confirmations mid-draft. Overspend is shown calmly (amber + disabled submit), not an alarm.

#### 3.4 Decision Rationale & Evidence Capture  `/sim/play/rationale`  ◀ crucial
The product's core differentiator. Dedicated screen between draft and final submit. (Component states in §5.)

```
┌───────────────────────────────────────────────────────────────────────┐
│  eyebrow: BEFORE YOU LOCK IN                                             │
│  Why this strategy?                                                      │
├──────────────────────────────────────────┬────────────────────────────┤
│  ① DRAFTED DECISIONS (recap, read-only)   │  ④ CONFIDENCE               │
│  Marketing · Price −18% · Ad +$20k        │      ╭───────╮              │
│  Product   · SKU mix shifted to value     │      │  7    │  circular    │
│  Finance   · short-term loan $10k         │      │ /10   │  slider      │
│  ───────────────────────────────────────  │      ╰───────╯  (cyan arc) │
│  ② VOICE RATIONALE                         │  "fairly sure"             │
│   ╭─────────────────────────────────────╮ │                            │
│   │  ▮▮▮▮▯▯▯  ● Record   0:00 / 1:30     │ │  [ Type instead ]          │
│   ╰─────────────────────────────────────╯ │                            │
│   transcript preview (editable) appears…   │                            │
│  ③ ASSUMPTION LOG                          │                            │
│   [ "demand is price-sensitive; cash      │                            │
│      covers one round of promo…"        ] │                            │
├──────────────────────────────────────────┴────────────────────────────┤
│                                            [ Submit Decision ▸ ]         │
└───────────────────────────────────────────────────────────────────────┘
```
- **Hierarchy:** recap (commit context) → voice (the "why", fast path) → assumptions (explicit) → confidence (calibration). Submit is the single exit.
- **Components:** `DecisionRecap`, `VoiceRecorder` (waveform visualizer, record/stop, 90s ring, auto-transcription preview), `TranscriptEditor`, `AssumptionTextarea`, `ConfidenceDial` (circular 1–10), `SubmitDecisionButton`.
- **Voice ≤ 90s** hard cap with a countdown ring that goes amber in the last 10s; transcription streams live so the student sees it working (no spinner — shimmer on the transcript line).

#### 3.5 Round Results & Reflection  `/sim/play/results`
Data-heavy review, unlocks at round end. Cause→effect first, then reflection.

```
┌───────────────────────────────────────────────────────────────────────┐
│  eyebrow: ROUND 3 RESULTS                                               │
│  Cause & Effect                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │ Decision               →  Effect                    Metric        │  │ Inter
│  │ Price −18%             →  +2.1 pp market share      Share ▲      │  │ tabular
│  │ Ad spend +$20k         →  +6% awareness             Sat. ▲       │  │
│  │ Short-term loan $10k   →  −$0.4k interest           Cash ▽       │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│  ── assumption check ──  "price-sensitive" ✓ confirmed by result        │
├───────────────────────────────────────────────────────────────────────┤
│  REFLECTION                                                              │
│  What worked well?            [                                       ]  │
│  What will you do differently?[                                       ]  │
│                                            [ Save reflection ▸ ]         │
└───────────────────────────────────────────────────────────────────────┘
```
- **Components:** `CauseEffectTable` (decision → effect → metric delta, positive/negative tokens; cyan-themed delta charts per `/cyan-graphs` if visualized), `AssumptionCheckRow` (compares logged assumption vs outcome — closes the doc's "compare assumptions against outcomes" loop), `ReflectionForm` (two-prompt, Outfit).
- **Learning payoff is visible:** the cause→effect table is the moment the sim becomes a *lesson*, not a score — give it the dominant zone.

---

### 3.3 — Admin Game Studio (condensed)

| Screen | Layout | Key components |
|--------|--------|----------------|
| **1.1 Studio Dashboard** | Asymmetric metric grid + scenario library list | `MetricTile` (Total Scenarios / Active Teachers / Playthroughs, Inter tabular), `ScenarioListRow` (draft vs published status pill), `CreateScenarioButton` (CTA), quick-filter tabs, activity feed rail |
| **1.2 Block Connection Canvas** | Full-screen drag-drop infinite canvas | Left `BlockCatalogPanel` (Marketing/Supply/Finance blocks), `NodeBlock` (connected), directional `DependencyEdge` arrows (cyan = active data flow), zoom/pan, minimap |
| **1.3 Economy & Rules Editor** | Split-screen: no-code formula builder ‖ live preview chart | `FormulaBuilder` (visual rule blocks), `ElasticitySlider`, `DemandCurveInput`, `ShockEventTimeline`, `PreviewChart` (cyan single-accent per `/cyan-graphs`) |
| **1.4 Balance Testing Sandbox** | Pre-publish test dashboard | `StrategyCompareBar` (Alpha vs Beta projected profit — purple permitted *only* here as a data series), `DominantStrategyFlag`, `PublishButton` (gated on balance pass) |

Admin keeps cockpit-density (8/10); it is the one surface where complexity is the point — but still glass cards, Outfit headings, Inter data, no ribbons.

### 3.4 — Analytics & Growth (condensed)

| Screen | Layout | Key components |
|--------|--------|----------------|
| **4.1 Auto-Debrief Pack** (teacher) | Presentation/slide view for screen-share | `DebriefSlide` (large type for projection), `HighlightCard`, `CommonMistakesList`, `TopImpactChart` (cyan), `TalkingPointCard` linked to learning objectives. Big-type, low-density for room legibility. |
| **4.2 Learner Growth Profile** (student) | Personal portfolio dashboard | `CompetencyRadar` (Financial Acumen / Strategic Thinking / Collaboration — cyan fill per `/cyan-graphs`), `ScoreTrendLine` across sims, `AchievementBadge` row, `EvidenceTimeline` (decisions + rationale + feedback trail) |

### 3.5 — Events & Competitions (condensed)

| Screen | Layout | Key components |
|--------|--------|----------------|
| **5.1 Event Control Center** | Massive high-contrast live display (9/10 density, room-scale) | `InstitutionGroupedLeaderboard` (scrolling), `AnnouncerFeed`, `EventBrandingWrapper` (custom wrapper around fixed Cyan core), `ObserverReadView`. Largest type scale in the system; deep-teal dark panels for projector contrast. |

---

## 4. Friction Reduction — Mentor Loop (Deliverable 3)

The Mentor Loop is where the product's thesis lives (teacher-student relationship as first-class) — and where friction kills adoption. North-star: **≥3 teacher feedback touches per session.** Bottlenecks and UI fixes:

| # | Bottleneck | Why it hurts | UI solution |
|---|-----------|--------------|-------------|
| **B1** | **Context-switching cost** — teacher leaves the monitor to find a student's decision, loses live view. | Feedback gets skipped under time pressure. | **In-place split view + jump-to-thread.** Intervention cards on the Live Monitor link straight into the Mentor panel with the decision + rationale pre-loaded beside the editor. No hunting, no lost context. |
| **B2** | **Voice notes are slow to consume** — teacher must listen to a full 90s clip to grasp it. | A leaderboard is faster to scan than audio; voice gets ignored. | **Transcript-first playback.** Show the auto-transcript immediately; waveform scrubber syncs/highlights as it plays. Teacher reads in ~5s, listens only if needed. Confidence + assumptions surfaced as chips above the clip. |
| **B3** | **Composing feedback is effortful** — typing thoughtful replies for N teams doesn't scale. | Teacher writes nothing or one-word replies. | **Quick-tag feedback** ("Think Deeper", "Check Data", "Good call") as one-tap presets, each expandable into a templated sentence. Optional voice reply for nuance. 80% of feedback becomes one click. |
| **B4** | **No triage** — which student needs me *now*? | Teacher reacts randomly or misses the struggling team. | **Prioritized inbox** sorted by signal severity (negative cash / "I'm stuck" flag / low confidence on a big decision float to top). Unread + flagged filters. The queue *tells* the teacher where to spend the next 60 seconds. |
| **B5** | **Feedback feels one-way** — student may never see/act on it. | Mentoring loop never closes; no learning. | **Visible two-way thread + read/acted receipts.** Student sees feedback in-context on their decision, can reply or re-flag; teacher sees a "seen / responded" state. The loop is observably closed. |
| **B6** | **Cold-start blank editor** — teacher doesn't know what to say. | Hesitation → no feedback. | **Suggested question per alert.** Each intervention ships an admin/pedagogy-tagged prompt ("What drove the spend?") the teacher can send as-is or edit. Removes the blank-page moment. |
| **B7** | **Interrupting live flow** — replying mid-round breaks facilitation. | Teacher defers feedback, then forgets. | **Async-safe queue.** Items persist; teacher batches feedback during a pause or at round-end debrief. Nothing expires; the queue is a to-do, not a stream that scrolls away. |

**Net interaction principle for the loop:** *read in seconds, respond in one tap, never lose context.* Every fix removes keystrokes or removes a context switch.

---

## 5. Component State Definitions (Deliverable 4)

States for the **Decision Rationale & Evidence Capture** components (screen 3.4). All transitions use spring/`.12–.2s`, transform+opacity only, and respect `prefers-reduced-motion`.

### 5.1 `VoiceRecorder`

| State | Visual | Behavior |
|-------|--------|----------|
| **Default (idle)** | Glass card, flat waveform baseline, cyan ● Record button, `0:00 / 1:30`, muted-steel hint "Tap to record your reasoning". | Tappable. Mic permission requested on first press only. |
| **Active (recording)** | Button → ■ Stop (cyan-bright); live waveform animates to amplitude; countdown ring depletes; timer counts up. | Ring turns **warning-amber at 0:10 left**; auto-stops at 1:30. Live region announces "recording" for SR. |
| **Processing (transcribing)** | Waveform freezes to recorded shape; transcript line shows **skeletal shimmer** (never a spinner). | Transcription streams token-by-token into editable field below. |
| **Success (captured)** | Success-green check seal on the clip; playback ▶ scrubber; editable transcript shown. | Re-record (replaces) or edit transcript inline. |
| **Disabled** | Reduced-opacity card, no ● ; tooltip "Recording unavailable — use Type instead". | Mic denied/unsupported → auto-fallback surfaces the textarea path. |
| **Error** | Whisper border → negative-red; message below "Couldn't capture audio — try again or type". | Non-blocking; typing path stays available. |

### 5.2 `TranscriptEditor` (paired with recorder)

| State | Visual / behavior |
|-------|-------------------|
| **Default** | Empty until a clip exists; placeholder "Your spoken rationale appears here, editable." |
| **Active (editing)** | Cyan focus ring; edits don't alter the stored audio (audio + transcript both retained as evidence). |
| **Disabled** | Read-only after final submit (becomes part of the evidence record). |

### 5.3 `AssumptionTextarea`

| State | Visual / behavior |
|-------|-------------------|
| **Default** | `#F0F6FA` fill, whisper border, label **above** ("Your assumptions"), 8px radius, example placeholder. |
| **Active (focus)** | Cyan focus ring, 2px offset; subtle auto-grow. |
| **Filled** | Persists across back-nav to modules. |
| **Disabled** | Locked + muted after submit. |

### 5.4 `ConfidenceDial` (circular slider 1–10)

| State | Visual | Behavior |
|-------|--------|----------|
| **Default (unset)** | Empty arc track (whisper), centered "—/10", muted prompt "How sure are you?". | Submit **blocked** until set (the one required rationale field). |
| **Active (dragging)** | Cyan arc fills to value; numeral updates (Inter tabular); descriptor changes ("unsure → fairly sure → very sure"). | Keyboard accessible (↑/↓ steps); ARIA slider role + valuetext. |
| **Set** | Filled cyan arc holds value; descriptor caption below. | Re-draggable until submit. |
| **Disabled** | Greyed arc, value frozen; shown read-only on results screen for assumption-vs-confidence comparison. |

### 5.5 `SubmitDecisionButton` (the gate)

| State | Visual | Behavior |
|-------|--------|----------|
| **Default (enabled)** | CTA gradient pill `#00B1D6→#0090AD`, white text + arrow chip, no shadow. | Enabled once confidence set + budget ≥ 0. |
| **Active (press)** | `brightness(1.07)` + `translateY(0)` settle, then **lime success pulse** on confirm. | Single irreversible submit; locks the round. |
| **Disabled** | Reduced-opacity gradient + inline reason ("Set your confidence to submit"). | Never silently dead — always says *why*. |
| **Success (submitted)** | Replaced by success-green seal "Locked in for Round 3" + read-only recap link. | Decision becomes evidence record; entry point to replay. |

**Cross-component rule:** rationale capture is *encouraged, not coerced* — voice/assumptions are optional (with a gentle nudge if skipped), confidence is the only hard requirement. This protects the North-star (≥70% rationale capture) without making submission feel like a tax.

---

## 6. Cross-Cutting Micro-Interactions & Motion

- **Card-list mount:** staggered waterfall reveal (spring), not pop-in — Home cards, scenario cards, inbox items.
- **Hover on interactive cards:** `translateY(-2px)` spring lift + subtle tint; no shadow bloom.
- **Live value changes:** number tween (counter roll) on KPIs/leaderboard; no flashing.
- **Filter swaps / data loads:** skeletal shimmer matching exact panel dimensions — *never* a circular spinner.
- **Tab/step transitions:** crossfade + slight slide, transform+opacity only.
- **Success moments:** brief lime pulse + check seal (launch, submit, save reflection) — the only place lime appears as motion.
- **Reduced motion:** all transitions killed under `prefers-reduced-motion: reduce`; states still distinct via color/shape.

## 7. Accessibility & Responsive Notes

- **Contrast:** deep-teal ink on glass/canvas meets AA; never `#000`. Semantic colors paired with icon/text, never color-alone (delta arrows + sign, alert icon + label).
- **Keyboard:** full path Teacher launch + Student submit operable by keyboard; circular ConfidenceDial has arrow-key stepping + ARIA slider semantics; drag-roster has a keyboard "assign to team" menu fallback.
- **Voice fallback:** every voice affordance has an equal-status text path (recorder ↔ "Type instead") — accessibility *and* quiet-room use.
- **Responsive:** Student App is web-first but tablet/mobile-graceful (decision modules stack, budget tracker docks to bottom). Teacher Monitor + Admin Studio target laptop/desktop; Event Center targets large/projector displays. Asymmetric grids collapse dominant-column-first.
- **Focus visible everywhere:** `2px solid #00C1EB`, 2px offset, on all interactive elements.

---

## Build Order (suggested, maps to MVP Phase 1)

1. **Student core loop** — 3.2 Dashboard → 3.3 Modules → 3.4 Rationale → 3.5 Results (the differentiator; build first, evidence model from day one).
2. **Teacher launch + monitor** — 2.2 Library → 2.3 Wizard → 2.4 Live Monitor (gets a class playable in <5 min).
3. **Mentor Loop** — 2.5 + friction fixes B1–B7 (the relationship layer).
4. **Auto-Debrief + Growth Profile** — 4.1 / 4.2 (closes the learning-evidence loop).
5. **Admin Studio + Events** — Phase 2 surfaces, designed-for but deferred per the product doc.
```
