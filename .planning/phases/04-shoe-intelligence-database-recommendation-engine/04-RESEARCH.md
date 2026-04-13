# Phase 4: Shoe Intelligence Database & Recommendation Engine — Research

## RESEARCH COMPLETE

**Researched:** 2026-04-13
**Domain:** Shoe catalog data modeling + rule-based recommendation scoring

---

## 1. Shoe Catalog Architecture

### Data Model Alignment
The existing `types/index.ts` defines `Shoe` and `ShoeAttribute` interfaces that are well-structured for the scoring engine. Key observations:

- `ShoeAttribute` has 10 scoring dimensions (0-10 scale) + 3 categorical fields — sufficient for differentiated ranking
- The `Shoe` interface has `imageUrl` (string) — can use placeholder URLs for now, real assets in Phase 5
- Missing from current types but needed: `techFeatures: string[]` (PUMA tech like "NITRO Foam", "PUMAGRIP"), `tagline: string`, and `modelYear: number` — these enrich explanation output

### PUMA Shoe Models to Include (10+ real models)

**Running — Distance/Daily:**
1. **Velocity NITRO 3** — Versatile daily trainer. NITRO foam, 10mm drop, ~283g. Good all-rounder.
2. **ForeverRun NITRO 2** — Stability shoe with RUNGUIDE system. Best for overpronation. ~295g.
3. **Magnify NITRO 3** — Max cushion daily trainer. Highest comfort, 40mm stack. ~264g.

**Running — Speed/Race:**
4. **Deviate NITRO 3** — Carbon-plated speed trainer. PWRPLATE for propulsion. ~280g.
5. **Fast-R 2 NITRO Elite** — Ultra-light race day shoe. Carbon plate, minimal weight. ~195g.

**Running — Recovery/Easy:**
6. **Electrify NITRO 3** — Budget-friendly daily trainer. NITRO foam, good value. ~272g.

**Lifestyle:**
7. **Suede XL** — Chunky heritage lifestyle sneaker. Suede upper, no wet-grip. ~350g.
8. **RS-X** — Retro "Running System" lifestyle shoe. Bold chunky styling, EVA foam. ~370g.
9. **Rider FV** — Future-retro casual sneaker. Nylon/mesh, heritage look. ~310g.

**Training/Cross:**
10. **PWR XX NITRO** — Cross-training shoe. Stable platform, good for gym. ~290g.
11. **Fuse 3.0** — Gym/casual hybrid. Wide base for lifting, comfortable for walking. ~320g.

### Scoring Attribute Schema Per Shoe

Each shoe gets 0-10 scores for all `ShoeAttribute` fields. Scores should be:
- **Differentiating**: No two shoes should have identical score profiles
- **Realistic**: A race shoe (Fast-R 2) should score 10 on raceUseScore but 3 on longWearComfort
- **Consistent**: A lifestyle shoe (Suede XL) should score 0-1 on runningScore, high on dailyCommute

---

## 2. Recommendation Engine Design

### Scoring Algorithm

**Input:** `FootProfile` (width, arch, pronation, estimatedSize, scanConfidence) + `UserContext` (useCase, hoursPerDay, activity, climate, priority, priorityScore)

**Output:** Ranked list of shoes with scores + explanation text

**Algorithm Overview:**

```
totalScore = Σ (dimensionScore × dimensionWeight)
```

**Scoring Dimensions (6 categories):**

1. **Foot Profile Match (weight: 30%)**
   - Width compatibility: wide foot → favor shoes with high wideFootScore
   - Arch support: shoe.archSuitability includes user.arch → +bonus
   - Pronation match: shoe.pronationSupport includes user.pronation → +bonus

2. **Use Case Alignment (weight: 25%)**
   - Map useCase → relevant shoe score:
     - `daily-commute` → dailyCommuteScore
     - `running` → runningScore
     - `long-standing` → longWearComfortScore
     - `gym-casual` → avg(dailyCommuteScore, longWearComfortScore)
     - `office-wear` → dailyCommuteScore × 0.8
     - `rainy-conditions` → wetGripScore

3. **Activity Match (weight: 20%)**
   - `running` → runningScore
   - `walking` → avg(dailyCommuteScore, longWearComfortScore)
   - `standing` → longWearComfortScore
   - `gym-casual` → avg(runningScore, dailyCommuteScore)

4. **Climate Suitability (weight: 10%)**
   - If climate = 'rainy': wetGripScore × 1.5 (penalty for low wet grip)
   - If climate = 'dry': minor bonus for breathability

5. **Comfort vs Performance Priority (weight: 10%)**
   - If priority = 'comfort': weight longWearComfortScore higher
   - If priority = 'performance': weight raceUseScore + runningScore higher
   - If priority = 'balanced': equal weighting

6. **Wear Duration Match (weight: 5%)**
   - More hours/day → higher weight on longWearComfortScore
   - 8+ hours → penalty for heavy shoes

### Score Normalization
- Each dimension yields a 0-10 subscore
- Weights sum to 1.0 (100%)
- Final score: `round((totalWeightedScore / 10) × 100)` → 0-100 match percentage

### Tiebreaker Logic
When two shoes score within 2 points: prefer the shoe with:
1. Better primary use case alignment
2. Better foot profile match
3. Lower weight (lighter is generally preferred)

---

## 3. Explanation Generator

### Match Reasons (3+ per recommendation)
Each reason references specific user attributes → shoe features:

**Templates:**
- "Your {width} foot width is ideal for the {shoe}'s {feature}" 
- "With {hours}+ hours of daily wear, the {foam_tech} cushioning in the {shoe} won't compress"
- "For {climate} conditions, the {shoe}'s {grip_feature} keeps you steady"
- "The {plate_tech} in the {shoe} converts your {activity} energy into forward propulsion"

### Elimination Reasons (2+ per result)
Each eliminated shoe gets a specific disqualifier:

**Templates:**
- "{shoe}: No pronation support — risky for your {pronation} pattern"
- "{shoe}: Low wet-grip score ({score}/10) — not safe for your rainy commute"
- "{shoe}: A lifestyle sneaker — insufficient support for {hours}+ hours of {activity}"
- "{shoe}: Too heavy at {weight}g for your performance-focused needs"

---

## 4. Integration Architecture

### Frontend Service
Create `puma-frontend/src/services/recommendationEngine.ts`:
- Pure function: `generateRecommendation(footProfile, context, shoes) → Recommendation`
- No side effects, no store dependency
- Returns full `Recommendation` type (primary, alternate, eliminated, reasons)

### Shoe Data
Create `puma-frontend/src/data/shoesCatalog.ts`:
- Static array of `Shoe` objects
- Importable by both the recommendation engine and any component

### Backend API
Update `puma-backend/src/routes/shoes.ts`:
- GET `/api/shoes` — return full catalog
- GET `/api/shoes/:id` — return single shoe

Update `puma-backend/src/routes/recommend.ts`:
- POST `/api/recommend` — accept `{ footProfile, context }`, return `Recommendation`

### Backend Data
Create `puma-backend/src/data/shoes.ts`:
- Mirror of frontend catalog (or shared via symlink/import)
- Backend scoring module: `puma-backend/src/services/scoringEngine.ts`

### Store Integration
The `useAppStore.setRecommendation(rec)` action already exists — frontend service calls this after computing results.

---

## 5. Technical Decisions

| Decision | Rationale |
|----------|-----------|
| Frontend-first engine | Demo runs faster without network latency; backend mirrors for API completeness |
| Static shoe data | 10 shoes don't need a database; eliminates Supabase setup blocker |
| Weighted scoring | Transparent, deterministic, explainable — matches PRD requirement for "rule-based" |
| Real PUMA model names | Makes demo credible for PUMA leadership audience |
| Template-based explanations | Consistent quality, avoids LLM hallucination risk |

---

## 6. Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| All shoes score similarly | Design attribute scores with wide variance; ensure some shoes are clearly better for specific profiles |
| Explanations feel generic | Use 6+ templates per category; reference specific attributes by name |
| Backend/frontend desync | Keep shoe data in one canonical file, import from both |
| Scoring feels arbitrary | Document weight rationale; make weights tunable in a config object |
