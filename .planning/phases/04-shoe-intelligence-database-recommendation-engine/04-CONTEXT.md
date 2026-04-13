# Phase 4: Shoe Intelligence Database & Recommendation Engine — Context

**Gathered:** 2026-04-13
**Status:** Ready for planning
**Source:** Auto-generated from ROADMAP.md + REQUIREMENTS.md + codebase analysis

<domain>
## Phase Boundary

Build the PUMA shoe catalog database (10+ models with full biomechanical metadata) and the rule-based recommendation engine. The engine takes the foot profile (from Phase 2 scan) + the user context (from Phase 3 questionnaire), scores all models, and returns ranked results with primary + alternate recommendations and structured explanation text. Expose as both a frontend TypeScript service and a Node.js API endpoint.

This is a **data + logic** phase — no new screens. Screens 4 and 5 consume the output in Phase 5.

</domain>

<decisions>
## Implementation Decisions

### Shoe Catalog
- **D-01:** Catalog stored as a static TypeScript array on the frontend (JSON-like) AND mirrored as a backend API endpoint. No Supabase DB dependency for the demo — use in-memory data.
- **D-02:** Minimum 10 PUMA shoes across running + lifestyle categories. Use real PUMA model names (Velocity Nitro 3, Deviate Elite 2, ForeverRun Nitro, Magnify Nitro 2, Fast-R 2, Electrify Nitro 3, Deviate Nitro 3, Rider FV, Suede XL, RS-X).
- **D-03:** Each shoe has all `ShoeAttribute` fields as defined in `types/index.ts`: wideFootScore, wetGripScore, dailyCommuteScore, raceUseScore, longWearComfortScore, runningScore, archSuitability[], pronationSupport[], weight, idealEnvironment[].
- **D-04:** Add modelYear, techFeatures (string array of PUMA tech like "NITRO Foam", "PUMAGRIP"), and a tagline to enrich explanation output.

### Recommendation Engine
- **D-05:** Pure rule-based weighted scoring — no AI/ML. Deterministic for demo reproducibility.
- **D-06:** Engine lives in a dedicated `services/` directory on the frontend (`puma-frontend/src/services/recommendationEngine.ts`) for direct invocation without network round-trip during demo.
- **D-07:** Backend `/api/recommend` endpoint mirrors the same logic for API consumers — imports from a shared scoring module.
- **D-08:** Scoring algorithm: compute per-shoe score (0–100) by summing weighted attribute matches against foot profile + context:
  - Foot width match: wide foot + high wideFootScore → bonus
  - Arch compatibility: shoe archSuitability includes user's arch → bonus
  - Pronation support: shoe pronationSupport includes user's pronation → bonus
  - Use case alignment: map useCase to relevant scores (commute → dailyCommuteScore, running → runningScore, etc.)
  - Climate match: rainy climate + high wetGripScore → bonus
  - Hours/comfort: high hoursPerDay + high longWearComfortScore → bonus
  - Priority weighting: comfort priority → weight comfort scores higher; performance → weight race/running scores higher

### Explanation Generator
- **D-09:** Each recommendation includes 3+ `MatchReason` objects with human-readable explanations referencing specific foot/context attributes.
- **D-10:** "Why not others" section: for each eliminated shoe (at least 2), generate a specific reason referencing the attribute that caused elimination (e.g., "Suede XL: No wet-grip rating — risky for your rainy commute").
- **D-11:** Explanations must feel natural and PUMA-branded — not generic "Score: 7.5" but "Your wider forefoot gets room to breathe in the Velocity Nitro 3's expanded toe box".

### Agent's Discretion
- Exact per-shoe attribute scores (must be realistic and differentiating)
- Weight coefficients for the scoring formula
- Tiebreaker logic when scores are close
- Backend API request/response shape details
- Image URL placeholder values for shoes

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Types (Source of Truth)
- `puma-frontend/src/types/index.ts` — `Shoe`, `ShoeAttribute`, `Recommendation`, `MatchReason`, `FootProfile`, `UserContext` type definitions

### State Management
- `puma-frontend/src/stores/index.ts` — `useAppStore` with `setRecommendation` action
- `puma-frontend/src/stores/recommendationStore.ts` — `RecommendationSlice` interface

### Backend Stubs
- `puma-backend/src/routes/shoes.ts` — Stub route returning placeholder (to be replaced)
- `puma-backend/src/routes/recommend.ts` — Stub route returning placeholder (to be replaced)
- `puma-backend/src/db/supabase.ts` — Supabase client (available but not required for in-memory demo data)
- `puma-backend/src/index.ts` — Express app with routes already wired

### Design System
- `puma-frontend/src/design/animations.ts` — Animation primitives (for any animated result display)

</canonical_refs>

<specifics>
## Specific Ideas

- PUMA shoe names should be real and recognizable to PUMA leadership during the demo
- Include at least 2 shoes from each category: running (distance), running (speed), lifestyle, training
- The scoring formula should produce noticeably different results for different user profiles (e.g., a wide-foot rainy-commute user gets a very different top pick than a narrow-foot gym user)
- Ensure at least one "trap" scenario where the obvious choice (e.g., a running shoe for a runner) is outranked by a better-fitting alternative due to foot profile specifics

</specifics>

<deferred>
## Deferred Ideas

- OpenAI/LLM-powered explanation generation (rule-based is sufficient for demo)
- Supabase-backed shoe catalog (in-memory data adequate for 10 models)
- Real shoe images / 3D models (Phase 5 handles visualization)
- User feedback loop on recommendations (v2 feature)

</deferred>

---

*Phase: 04-shoe-intelligence-database-recommendation-engine*
*Context gathered: 2026-04-13 via codebase analysis + ROADMAP/REQUIREMENTS*
