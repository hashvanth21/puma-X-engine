# Requirements: PUMA Reality Match Engine

**Defined:** 2026-04-03
**Core Value:** Make PUMA sell certainty — bridge the gap between online browsing and real-world fit through explainable, biomechanical shoe matching

## v1 Requirements

Requirements for demo/POC release. Each maps to roadmap phases.

### Foot Scan

- [ ] **SCAN-01**: User can initiate foot scan via phone camera with animated outline guide
- [ ] **SCAN-02**: System detects and outputs foot width profile (narrow / standard / wide)
- [ ] **SCAN-03**: System estimates arch type (low / medium / high)
- [ ] **SCAN-04**: System estimates pronation pattern (neutral / overpronation / supination)
- [ ] **SCAN-05**: System outputs estimated shoe size from scan

### Context Questionnaire

- [ ] **CTX-01**: User answers "Where will you use it?" (commute / office / gym / running / rainy)
- [ ] **CTX-02**: User answers "How many hours per day?"
- [ ] **CTX-03**: User answers "Activity type" (running / walking / standing / gym+casual)
- [ ] **CTX-04**: User answers "Climate" (rainy / dry)
- [ ] **CTX-05**: User sets comfort vs performance priority via slider

### Recommendation Engine

- [ ] **REC-01**: Engine combines foot profile + context inputs to produce ranked shoe matches
- [ ] **REC-02**: Output includes primary recommended shoe with match percentage
- [ ] **REC-03**: Output includes alternate shoe recommendation
- [ ] **REC-04**: Output includes human-readable explanation of why the match is correct
- [ ] **REC-05**: Output includes "why not the others" section for eliminated options
- [ ] **REC-06**: Engine uses rule-based matching with PUMA shoe metadata attributes

### Shoe Intelligence Database

- [ ] **DB-01**: Database contains at least 10 PUMA models (running + lifestyle category)
- [ ] **DB-02**: Each model has: wide-foot score, wet-grip score, daily-commute score, race-use score, arch suitability, pronation support, long-wear comfort score, weight, ideal environment
- [ ] **DB-03**: Database is queryable by recommendation engine via structured API
- [ ] **DB-04**: Shoe metadata is rich enough to produce differentiating explanations

### Demo UI

- [ ] **UI-01**: Screen 1 — "Your Current Problem" (generic shoe grid, user confusion framing)
- [ ] **UI-02**: Screen 2 — Foot scan with animated camera overlay and result display
- [ ] **UI-03**: Screen 3 — Reality questions (visual cards, smooth transitions)
- [ ] **UI-04**: Screen 4 — Match result hero card (shoe, %, reasons, "why not others")
- [ ] **UI-05**: Screen 5 — Dynamic comparison table (side-by-side model attributes)
- [ ] **UI-06**: Screen 6 — Ecosystem vision screen (future expansion: apparel, loyalty, reminders)
- [ ] **UI-07**: UI feels premium and Apple-like — not a hackathon prototype
- [ ] **UI-08**: Smooth animations and transitions throughout (Framer Motion)
- [ ] **UI-09**: 3D shoe visualization or rich product photography integration

### Tech Foundation

- [ ] **TECH-01**: Frontend built with React + Vite
- [ ] **TECH-02**: Styling with Tailwind CSS
- [ ] **TECH-03**: Foot scan simulation using MediaPipe or mock overlay (camera-based)
- [ ] **TECH-04**: State management with Zustand
- [ ] **TECH-05**: Demo backend: Node.js + Express with PostgreSQL or Supabase

### Data Moat

- [ ] **DATA-01**: System tracks all recommendation sessions with complete event data (session_id, scan profile, use case, top-3 models, selected model, confidence score)
- [ ] **DATA-02**: System captures structured user feedback post-recommendation (fit result, use case result, style preference)
- [ ] **DATA-03**: Interaction behavior events tracked (clicked_primary, opened_alternatives, time_spent, changed_use_case, re-ran_scan)
- [ ] **DATA-04**: Raw recommendation events normalized into structured dataset (width + arch + use_case + shoe_model + outcome per row)
- [ ] **DATA-05**: Automated weekly insight reports generated (model success rates, problem models by foot type, foot-type preference clusters)
- [ ] **DATA-06**: Database schema supports users, scan_profiles, recommendations, feedback, shoe_metadata, weekly_insights collections

### ML Engine

- [ ] **ML-01**: Binary classification model predicts recommendation success probability per shoe
- [ ] **ML-02**: ML dataset prepared with proper feature engineering and label conversion (perfect fit/slightly tight/loose = Success; too tight/too loose = Fail)
- [ ] **ML-03**: XGBoost classifier trained on collected recommendation outcomes with cross-validation
- [ ] **ML-04**: Hybrid scoring blends rule engine score (60%) with ML success probability (40%)
- [ ] **ML-05**: Weekly retraining pipeline appends new outcomes and retrains model
- [ ] **ML-06**: Confidence explanation UI shows "users like you" reasoning with specific stats
- [ ] **ML-07**: Long-term ML roadmap documented (multi-class ranking → collaborative filtering → personalized engine)

## v2 Requirements

Deferred to future release (PRD Phases 2–4).

### Apparel

- **APP-01**: Apparel recommendation based on body type and weather
- **APP-02**: "Today's Fit" daily combo recommendation (shoe + apparel)

### Loyalty & Retention

- **LOY-01**: Replacement prediction ("your shoes have 80% wear after 400km")
- **LOY-02**: Loyalty system integration with repeat purchase loop
- **LOY-03**: Push notifications for replacement reminders

### Ecosystem Integrations

- **ECO-01**: Real Apple Health / Google Fit integration
- **ECO-02**: Real weather API driving daily recommendations
- **ECO-03**: Training plan suggestions based on activity history

## Out of Scope

| Feature | Reason |
|---------|--------|
| Real user accounts / auth | Demo scope — no persistent users needed |
| Full ecommerce / checkout | PUMA demo, not a storefront |
| Real-time foot scan AI (production-grade) | Demo simulation sufficient; MediaPipe if feasible |
| Non-footwear categories in v1 | PRD explicitly defers to Phase 2+ |
| Mobile native app | Web demo first; mobile if time permits |
| Multi-language support | English-only for demo |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SCAN-01 | Phase 2 | Pending |
| SCAN-02 | Phase 2 | Pending |
| SCAN-03 | Phase 2 | Pending |
| SCAN-04 | Phase 2 | Pending |
| SCAN-05 | Phase 2 | Pending |
| CTX-01 | Phase 3 | Pending |
| CTX-02 | Phase 3 | Pending |
| CTX-03 | Phase 3 | Pending |
| CTX-04 | Phase 3 | Pending |
| CTX-05 | Phase 3 | Pending |
| REC-01 | Phase 4 | Pending |
| REC-02 | Phase 4 | Pending |
| REC-03 | Phase 4 | Pending |
| REC-04 | Phase 4 | Pending |
| REC-05 | Phase 4 | Pending |
| REC-06 | Phase 4 | Pending |
| DB-01 | Phase 4 | Pending |
| DB-02 | Phase 4 | Pending |
| DB-03 | Phase 4 | Pending |
| DB-04 | Phase 4 | Pending |
| UI-01 | Phase 1 | Pending |
| UI-02 | Phase 2 | Pending |
| UI-03 | Phase 3 | Pending |
| UI-04 | Phase 5 | Pending |
| UI-05 | Phase 5 | Pending |
| UI-06 | Phase 6 | Pending |
| UI-07 | Phase 1 | Pending |
| UI-08 | Phase 1 | Pending |
| UI-09 | Phase 5 | Pending |
| TECH-01 | Phase 1 | Pending |
| TECH-02 | Phase 1 | Pending |
| TECH-03 | Phase 2 | Pending |
| TECH-04 | Phase 1 | Pending |
| TECH-05 | Phase 1 | Pending |
| DATA-01 | Phase 7 | Pending |
| DATA-02 | Phase 7 | Pending |
| DATA-03 | Phase 7 | Pending |
| DATA-04 | Phase 8 | Pending |
| DATA-05 | Phase 8 | Pending |
| DATA-06 | Phase 7 | Pending |
| ML-01 | Phase 9 | Pending |
| ML-02 | Phase 9 | Pending |
| ML-03 | Phase 9 | Pending |
| ML-04 | Phase 9 | Pending |
| ML-05 | Phase 10 | Pending |
| ML-06 | Phase 10 | Pending |
| ML-07 | Phase 10 | Pending |

**Coverage:**
- v1 requirements: 34 total
- Data Moat requirements: 6 total
- ML Engine requirements: 7 total
- Grand total: 47
- Mapped to phases: 47
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-03*
*Last updated: 2026-04-18 after Data Moat & ML Upgrade execution plan*
