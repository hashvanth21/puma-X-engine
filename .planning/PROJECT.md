# PUMA Reality Match Engine

## What This Is

An AI-powered pre-purchase reality simulation system built for PUMA. Instead of generic recommendations, it matches each customer's exact foot morphology, movement patterns, weather context, and lifestyle to the precise PUMA product most likely to deliver the best real-world outcome. This is a decision layer — not another recommendation engine.

## Core Value

**Make PUMA sell certainty, not products** — the system bridges the gap between what customers see online and what they experience in real life, reducing returns and building trust through explainable, biomechanically-grounded shoe matching.

## Requirements

### Validated

- [x] Camera-based 3D foot scan (width, arch type, estimated size) via phone — *Validated in Phase 2: Foot Scan Module*
- [x] Premium demo UI scan screen with cinematic animations — *Validated in Phase 2: Foot Scan Module*

### Active


- [ ] 5-question contextual questionnaire (use case, hours/day, activity, climate, priority)
- [ ] AI recommendation engine matching foot profile + context to PUMA shoe catalog
- [ ] Explainable match result: best shoe + alternate + reasons + "why not others"
- [ ] PUMA shoe intelligence database with biomechanical metadata per model
- [ ] Premium demo UI (Apple-style, not hackathon prototype)
- [ ] Dynamic comparison view (side-by-side model attributes)
- [ ] Business KPI tracking scaffolding (returns, conversion, AOV)
- [ ] Ecosystem vision screen (apparel, loyalty, replacement reminders)

### Out of Scope

- Apparel recommendation (Phase 2+ per PRD — deferred)
- "Today's Fit" daily recommendation (Phase 3 per PRD)
- Loyalty + replacement prediction (Phase 4 per PRD)
- Real fitness device integration (Apple Health / Google Fit — demo mock only)
- Production backend with real user accounts (demo/POC scope)

## Context

**Why this exists:** PUMA loses conversion and trust because customers buy online without knowing if a shoe truly fits their body, movement style, and real-world context. This creates high return rates, abandoned carts, and weak repeat purchase loops.

**Business targets from PRD:**
- Return reduction: 15–25%
- Conversion increase: 10–18%
- AOV increase: +12%
- Repeat purchase: +20%
- Quiz completion: 60%+

**Target demo audience:** PUMA strategic/product leadership. The demo must feel like a premium Apple-style product reveal.

**Tech stack (from PRD):**
- Frontend: React + Vite, Tailwind CSS, Framer Motion, Three.js / React Three Fiber, Zustand
- AI layer: OpenAI API or local rule engine, TensorFlow.js or MediaPipe for foot landmarks
- Demo backend: Node.js + Express, PostgreSQL or Supabase
- Optional: Weather API, camera-based foot scan overlay

## Constraints

- **Demo scope**: This is a proof-of-concept demo for PUMA pitch, not production software
- **MVP category**: Running + daily lifestyle footwear only
- **Foot scan**: Camera simulation acceptable for demo (real MediaPipe if feasible)
- **AI**: OpenAI API or deterministic rule engine both acceptable for MVP
- **Premium polish**: The design MUST feel like Apple — no hackathon aesthetics

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Standard granularity (5–8 phases) | Project has clear UI + data + AI layers that need sequential buildup | — Pending |
| Quality model profile | This is high-stakes pitch material; plan quality >> speed | — Pending |
| React + Vite frontend | PRD-specified; Vite gives fastest dev iteration | — Pending |
| Demo scope (not production) | PUMA pitch needs working demo, not full product | — Pending |

---

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

## Current State

Phase 09 complete — ML classifier and hybrid scoring engine integrated.

Next up: Phase 10 (ML Retraining & Explainability Evolution)

*Last updated: 2026-06-25*
