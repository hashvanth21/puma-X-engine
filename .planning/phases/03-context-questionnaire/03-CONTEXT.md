# Phase 3: Context Questionnaire — Context

**Gathered:** 2026-04-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Build Screen 3 — a 5-step visual questionnaire that collects the user's real-world context (use case, daily hours, activity type, climate, comfort vs performance priority). Each step is a full-screen card with icon-based options. Answers persist in Zustand and feed the recommendation engine in Phase 4.

</domain>

<decisions>
## Implementation Decisions

### Step Layout & Interaction
- **D-01:** Each question step is a full-screen card with large tappable icon options (like Apple Health onboarding)
- **D-02:** Use Framer Motion `AnimatePresence` with `slideInRight` animation for step transitions (already exists in design system)
- **D-03:** Selecting an option auto-advances to next step after a brief 400ms delay — no separate "Next" button needed

### Progress & Navigation
- **D-04:** Step progress shown as dot indicator (filled/unfilled circles) at the top — not the NavBar progress bar, which tracks screen-level flow
- **D-05:** "Back" button on each step returns to the previous question without losing data
- **D-06:** Final step (priority slider) has an explicit "See Your Match →" CTA that navigates to /match

### Priority Slider (Step 5)
- **D-07:** Custom CSS range slider styled to match the gold accent theme. Left = Comfort, Right = Performance, center = Balanced
- **D-08:** Slider maps to `priorityScore` (0–100) and derives `priority` label ('comfort' | 'balanced' | 'performance')

### Visual Design
- **D-09:** Each option card uses the existing `Card` component with `hoverable` prop + `selected` border highlight
- **D-10:** Each option has a lucide-react icon + label + optional micro-description
- **D-11:** Dark theme consistent with Phase 1/2 design system — glass cards, gold accent highlights

### Agent's Discretion
- Icon selection for each option (lucide-react icons appropriate to each use case/activity)
- Exact micro-copy for option descriptions
- Step header phrasing

</decisions>

<canonical_refs>
## Canonical References

### Existing Components
- `puma-frontend/src/components/Card.tsx` — Reusable glass card with hoverable state and selection border
- `puma-frontend/src/components/ProgressBar.tsx` — Can be adapted for step progress
- `puma-frontend/src/design/animations.ts` — `slideInRight`, `staggerContainer`, `fadeInUp` variants

### State Management
- `puma-frontend/src/stores/questionnaireStore.ts` — `setContextField` per-key updater, `resetContext`
- `puma-frontend/src/types/index.ts` — `UserContext`, `UseCase`, `ActivityType`, `Climate`, `Priority` types

### Prior Context
- `.planning/phases/02-foot-scan-module/02-CONTEXT.md` — Demo-first, deterministic approach

</canonical_refs>
