# Roadmap: PUMA Reality Match Engine

## Overview

Ten-phase execution plan to build a premium AI-powered shoe-matching engine for PUMA. Phases 1–6 deliver the v1.0 MVP demo (scaffolding, foot scan, context questions, recommendation engine, match result UI, ecosystem vision). Phases 7–10 extend into the Data Moat & ML Upgrade milestone — instrumenting the product to collect proprietary recommendation-outcome data, then replacing hand-written rules with a learned XGBoost model that improves with every session.

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
- [ ] **Phase 7: Data Moat – Event Instrumentation & Feedback System** — Session & interaction event tracking, structured user feedback collection, database schema for recommendation data pipeline
- [ ] **Phase 8: Data Normalization & Insight Pipeline** — Normalize raw events into structured dataset, automated weekly insight reports (success rates, problem models, foot-type clusters)
- [ ] **Phase 9: ML Classification & Hybrid Scoring** — XGBoost binary classifier for recommendation success prediction, hybrid scoring blending rule engine (60%) with ML (40%)
- [ ] **Phase 10: ML Retraining, Explainability & Evolution** — Weekly retraining pipeline, "users like you" confidence explanations, long-term ML roadmap

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
- [x] 02-01: Camera integration — getUserMedia, MediaPipe setup or simulation mode fallback
- [x] 02-02: Foot landmark analysis — extract width/arch/pronation/size from landmarks or deterministic mock
- [x] 02-03: Scan UI — animated overlay, progress indicator, result reveal animation

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
- [x] 03-01: Questionnaire framework — step engine, state management, progress indicator, transitions
- [x] 03-02: Individual question screens — use case cards, hours picker, activity cards, climate cards, priority slider

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
- [x] 04-01: Shoe Intelligence Database — extended schema, 11 PUMA models with biomechanical scores, backend API (Wave 1)
- [x] 04-02: Weighted Scoring Algorithm — 6-dimension scoring engine, frontend service + backend mirror (Wave 2)
- [x] 04-03: Explanation Generator — match reasons, elimination logic, integration into engines (Wave 3)

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
- [x] 05-01: Screen 4 — Match hero card, match percentage donut, reason chips, "why not others" section
- [x] 05-02: Screen 5 — Comparison table with attribute score bars, icons, winner indicators
- [x] 05-03: 3D shoe viewer — Three.js/R3F model or fallback rich product image card

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

### Phase 7: Data Moat – Event Instrumentation & Feedback System
**Goal**: Instrument the existing recommendation product to capture every session's data: foot profile, use case, recommended shoes, selected shoe, confidence score, and interaction behavior (clicks, time on screen, re-scans). Add a structured feedback system that collects fit result, use case result, and style preference after each recommendation. Design and implement the database schema (users, scan_profiles, recommendations, feedback, shoe_metadata) to persist all data. This creates the proprietary dataset foundation that competitors cannot replicate.
**Depends on**: Phase 6
**Requirements**: [DATA-01, DATA-02, DATA-03, DATA-06]
**Success Criteria** (what must be TRUE):
  1. Every recommendation session logs: session_id, scan profile, use case, top-3 models, selected model, confidence score
  2. Interaction events tracked: clicked_primary, opened_alternatives, time_spent, changed_use_case, re-ran_scan
  3. Structured feedback modal appears post-recommendation with fit/use-case/style questions
  4. Feedback responses persisted with recommendation_id reference
  5. Database tables (scan_profiles, recommendations, feedback) created and queryable
  6. At least one end-to-end flow produces a complete recommendation event record
**Plans**: 3 plans

Plans:
- [ ] 07-01: Database Schema & Event Service — Supabase tables, TypeScript event types, event logging service (Wave 1)
- [ ] 07-02: Backend Routes & Frontend Analytics Store — API endpoints, Zustand analytics slice, interaction buffering (Wave 2)
- [ ] 07-03: Feedback UI & End-to-End Integration — FeedbackModal component, interaction tracking wiring, full pipeline (Wave 3)

### Phase 8: Data Normalization & Insight Pipeline
**Goal**: Build data normalization layer that transforms raw recommendation events and feedback into a structured dataset where every row links foot profile + use case + shoe model + outcome. Build automated insight report generation: Model Success Report (per-shoe perfect-fit rate), Problem Model Report (failure patterns by foot type), Foot-Type Cluster Report (preference patterns). Store insights in weekly_insights table for trend analysis.
**Depends on**: Phase 7
**Requirements**: [DATA-04, DATA-05]
**Success Criteria** (what must be TRUE):
  1. Normalized dataset table exists with columns: width, arch, use_case, shoe_model, size, result
  2. Normalization job transforms raw events + feedback into normalized rows
  3. Report A (Most Successful Models) generates per-shoe success rates
  4. Report B (Problem Models) identifies failure patterns by foot type
  5. Report C (Foot-Type Clusters) groups user preference patterns
  6. Weekly insights stored in database with timestamp

### Phase 9: ML Classification & Hybrid Scoring
**Goal**: Train an XGBoost binary classifier that predicts "will this recommendation succeed?" using features: foot_width, arch_type, use_case, shoe_model, recommended_size, preferred_fit → output: success/fail probability. Prepare ML dataset from normalized recommendation outcomes (perfect fit/slightly tight/slightly loose = Success, too tight/too loose/wrong use case = Fail). Integrate predictions as hybrid scoring: final_score = (rule_engine_score × 0.6) + (ml_success_probability × 0.4). This is safer than fully replacing the rule engine while dataset is small.
**Depends on**: Phase 8
**Requirements**: [ML-01, ML-02, ML-03, ML-04]
**Success Criteria** (what must be TRUE):
  1. ML dataset generation pipeline converts normalized data to feature vectors with success/fail labels
  2. XGBoost classifier trains on dataset with cross-validation
  3. Model outputs per-shoe success probability (e.g., CA Pro → 87%, Palermo → 42%)
  4. Hybrid scoring formula blends rule engine (0.6) + ML prediction (0.4)
  5. Recommendation engine falls back to pure rule-based when ML confidence is below threshold
  6. Model artifacts (weights, feature config) are version-tracked

### Phase 10: ML Retraining, Explainability & Evolution
**Goal**: Add automated weekly retraining pipeline: collect new recommendation outcomes, append to dataset, retrain XGBoost, deploy updated model. Build confidence explanation UI: show users "Recommended because users with a similar foot profile preferred this model" with specific stats (e.g., "89% match — users with wide forefoot + office use had best results with CA Pro"). Document long-term ML roadmap: multi-class ranking model, collaborative filtering, personalized engine, dynamic per-shoe fit adjustment.
**Depends on**: Phase 9
**Requirements**: [ML-05, ML-06, ML-07]
**Success Criteria** (what must be TRUE):
  1. Retraining pipeline runs on schedule (configurable, default weekly)
  2. New outcomes are appended, not replacing, the training dataset
  3. Model version is tracked and previous versions preserved
  4. UI shows "users like you" explanation with specific stats
  5. Confidence explanation references foot profile attributes and use case context
  6. ML roadmap document exists with evolution path (multi-class → collab filtering → personalized)

## Progress

**Execution Order:**
Phases execute sequentially: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Design System | 3/3 | Complete | 2026-04-03 |
| 2. Foot Scan Module | 3/3 | Complete | 2026-04-03 |
| 3. Context Questionnaire | 2/2 | Complete | 2026-04-06 |
| 4. Shoe Intelligence DB & Engine | 3/3 | Complete | 2026-04-13 |
| 5. Match Result & Comparison UI | 3/3 | Complete | 2026-04-14 |
| 6. Ecosystem Vision & Polish | 0/2 | Not started | - |
| 7. Data Moat – Event Instrumentation & Feedback | 0/3 | Planned | - |
| 8. Data Normalization & Insight Pipeline | 0/0 | Not started | - |
| 9. ML Classification & Hybrid Scoring | 0/0 | Not started | - |
| 10. ML Retraining, Explainability & Evolution | 0/0 | Not started | - |

