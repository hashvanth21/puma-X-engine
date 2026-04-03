# Roadmap: PUMA Reality Match Engine

## Overview

Six-phase execution plan to build a premium AI-powered shoe-matching demo for PUMA — from project scaffolding and design system through foot scan, context questions, recommendation engine, match result UI, and final ecosystem vision screen. Each phase delivers a shippable, demoable increment. Phases 1–6 constitute the v1.0 MVP demo milestone.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Foundation & Design System** — Project scaffold, design tokens, navigation shell, and premium UI foundation
- [ ] **Phase 2: Foot Scan Module** — Camera-based foot scan simulation with landmark detection, animated overlay, and profile output
- [ ] **Phase 3: Context Questionnaire** — 5-step visual questionnaire (use case, hours, activity, climate, priority slider)
- [ ] **Phase 4: Shoe Intelligence Database & Recommendation Engine** — Structured shoe metadata DB + rule-based matching engine with explainable output
- [ ] **Phase 5: Match Result & Comparison UI** — Hero result card, "why not others" section, dynamic side-by-side comparison table, 3D shoe visualization
- [ ] **Phase 6: Ecosystem Vision & Polish** — Future ecosystem screen, end-to-end demo flow, animations polish, demo mode / kiosk toggle

## Phase Details

### Phase 1: Foundation & Design System
**Goal**: Scaffold the React+Vite project with Tailwind, Framer Motion, Zustand, and a premium design system. Build the demo shell: navigation, screen routing, and "Screen 1 — Your Current Problem" (generic shoe grid showing user confusion). Establish all design tokens, typography, color palette, and animation primitives that all subsequent screens share.
**Depends on**: Nothing (first phase)
**Requirements**: [UI-01, UI-07, UI-08, TECH-01, TECH-02, TECH-04, TECH-05]
**Success Criteria** (what must be TRUE):
  1. `npm run dev` starts the app without errors
  2. Screen 1 (generic shoe grid / "Your Current Problem") is visible and styled premium
  3. Design system tokens (colors, fonts, spacing, animation) are defined and reusable
  4. Navigation shell with route placeholders for all 6 screens is in place
  5. Framer Motion page transitions work between screens
**Plans**: 3 plans

Plans:
- [x] 01-01: Project scaffold — Vite+React+TS+Tailwind+Framer Motion+Zustand+ESLint setup
- [x] 01-02: Design system — tokens, typography, color palette, animation primitives, shared components
- [x] 01-03: Demo shell — navigation, routing (React Router), Screen 1 "Your Current Problem" implementation

### Phase 2: Foot Scan Module
**Goal**: Build Screen 2 — the foot scan experience. Use MediaPipe Hands/Pose or a simulated camera overlay with animated foot outline. On "scan complete", generate a foot profile (width, arch type, pronation estimate, size) either from real landmark detection or deterministic simulation. The profile is stored in Zustand state for downstream use.
**Depends on**: Phase 1
**Requirements**: [SCAN-01, SCAN-02, SCAN-03, SCAN-04, SCAN-05, UI-02, TECH-03]
**Success Criteria** (what must be TRUE):
  1. Screen 2 shows animated camera overlay with foot outline guide
  2. "Scan" completes and outputs foot profile: width (narrow/standard/wide), arch (low/medium/high), pronation (neutral/overpronation/supination), size estimate
  3. Foot profile is stored in Zustand state and accessible to later screens
  4. Scan result is displayed on-screen with animated reveal
  5. Works in demo mode (simulation) if real camera unavailable
**Plans**: 3 plans

Plans:
- [ ] 02-01: Camera integration — getUserMedia, MediaPipe setup or simulation mode fallback
- [ ] 02-02: Foot landmark analysis — extract width/arch/pronation/size from landmarks or deterministic mock
- [ ] 02-03: Scan UI — animated overlay, progress indicator, result reveal animation

### Phase 3: Context Questionnaire
**Goal**: Build Screen 3 — 5-step visual questionnaire. Each step is a full-screen card with icon-based options. Steps: (1) Use case, (2) Daily hours, (3) Activity type, (4) Climate, (5) Comfort vs Performance slider. Answers accumulate in Zustand. Include progress indicator and smooth step transitions.
**Depends on**: Phase 2
**Requirements**: [CTX-01, CTX-02, CTX-03, CTX-04, CTX-05, UI-03]
**Success Criteria** (what must be TRUE):
  1. All 5 questionnaire steps are implemented with visual cards/icons
  2. Comfort vs Performance step uses an interactive slider
  3. User selections persist in Zustand across all steps
  4. Progress indicator (e.g., step 3/5) is visible throughout
  5. Smooth Framer Motion transitions between steps
  6. "Back" navigation works between steps without losing answers
**Plans**: 2 plans

Plans:
- [ ] 03-01: Questionnaire framework — step engine, state management, progress indicator, transitions
- [ ] 03-02: Individual question screens — use case cards, hours picker, activity cards, climate cards, priority slider

### Phase 4: Shoe Intelligence Database & Recommendation Engine
**Goal**: Build the shoe catalog database (10+ PUMA models with full biomechanical metadata) and the recommendation engine. Engine takes foot profile + context inputs, scores all models, returns ranked results with primary + alternate recommendations and structured explanation text. Expose as a clean API/service callable from the frontend.
**Depends on**: Phase 3
**Requirements**: [REC-01, REC-02, REC-03, REC-04, REC-05, REC-06, DB-01, DB-02, DB-03, DB-04]
**Success Criteria** (what must be TRUE):
  1. At least 10 PUMA shoes are in the database with all required metadata fields
  2. Each shoe has: wide-foot score, wet-grip score, daily-commute score, race-use score, arch suitability, pronation support, long-wear comfort score, weight, ideal environment
  3. Engine produces primary + alternate recommendation for any valid input combination
  4. Explanation text is specific: references foot profile attributes and context (e.g., "wider forefoot + wet roads → Velocity Nitro 3")
  5. "Why not the others" section lists at least 2 eliminated models with reasons
  6. Engine is exposed as a TypeScript service / Node.js API endpoint
**Plans**: 3 plans

Plans:
- [ ] 04-01: Shoe catalog DB — define schema, populate 10+ PUMA models with full metadata
- [ ] 04-02: Scoring algorithm — weighted attribute matching, foot profile × context × shoe metadata
- [ ] 04-03: Explanation generator — rule-based natural language output for match + elimination reasons

### Phase 5: Match Result & Comparison UI
**Goal**: Build Screens 4 and 5 — the payoff of the entire demo. Screen 4: hero match card with shoe image, match percentage, key reasons, "why not others" section. Screen 5: dynamic side-by-side comparison table with attribute scores, icons, and visual differentiators. Include 3D shoe visualization or rich product imagery. This is the screen PUMA leadership will remember.
**Depends on**: Phase 4
**Requirements**: [UI-04, UI-05, UI-09, REC-02, REC-03, REC-04, REC-05]
**Success Criteria** (what must be TRUE):
  1. Screen 4 shows recommended shoe with hero image, match %, and 3+ match reasons
  2. "Why not the others" section lists 2+ eliminated alternatives with specific attribute reasoning
  3. Screen 5 shows side-by-side attribute comparison for primary vs alternate vs eliminated shoe
  4. 3D model viewer OR rich product card with shoe imagery is implemented
  5. All animations feel premium (spring physics, staggered reveals)
  6. "Add to cart" CTA placeholder exists (non-functional, demo only)
**Plans**: 3 plans

Plans:
- [ ] 05-01: Screen 4 — Match hero card, match percentage donut, reason chips, "why not others" section
- [ ] 05-02: Screen 5 — Comparison table with attribute score bars, icons, winner indicators
- [ ] 05-03: 3D shoe viewer — Three.js/R3F model or fallback rich product image card

### Phase 6: Ecosystem Vision & Demo Polish
**Goal**: Build Screen 6 — the future ecosystem vision (apparel, training, replacement, loyalty). Then complete end-to-end demo flow polish: ensure all 6 screens flow seamlessly, add demo kiosk mode (auto-advance / reset), performance optimization, and final visual polish pass. Prepare for PUMA presentation.
**Depends on**: Phase 5
**Requirements**: [UI-06]
**Success Criteria** (what must be TRUE):
  1. Screen 6 shows ecosystem vision with 4 expansion areas (apparel, training, replacement, loyalty)
  2. End-to-end demo runs from Screen 1 → 6 without errors or layout breaks
  3. Demo kiosk/presentation mode available (auto-advance or manual clicker)
  4. All 6 screens pass visual inspection on 1440px desktop and 390px mobile
  5. Lighthouse performance score ≥ 80 on demo build
  6. Demo can be reset to Screen 1 in one click
**Plans**: 2 plans

Plans:
- [ ] 06-01: Screen 6 — Ecosystem vision with expansion cards, animated reveal
- [ ] 06-02: Demo polish — end-to-end flow testing, kiosk mode, responsive fixes, performance pass

## Progress

**Execution Order:**
Phases execute sequentially: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Design System | 0/3 | Not started | - |
| 2. Foot Scan Module | 0/3 | Not started | - |
| 3. Context Questionnaire | 0/2 | Not started | - |
| 4. Shoe Intelligence DB & Engine | 0/3 | Not started | - |
| 5. Match Result & Comparison UI | 0/3 | Not started | - |
| 6. Ecosystem Vision & Polish | 0/2 | Not started | - |
