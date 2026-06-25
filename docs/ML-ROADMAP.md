# PUMA Reality Match Engine — ML Roadmap

**Document:** Long-term ML evolution path
**Current State:** Phase 9 delivered a TypeScript feature-weight scorer (`feature-weight-v1`) with a clear XGBoost upgrade path. Phase 10 added weekly retraining + "users like you" explanations.

---

## Current Architecture (Phase 9–10)

```
User input (foot profile + context)
    ↓
Rule Engine (60%) + Feature-Weight ML (40%)
    ↓
Hybrid score → Primary recommendation
    ↓
"Users like you" explanation from feedback data
    ↓
Weekly retraining: new feedback → updated per-shoe success rates → model_versions table
```

**Model:** `mlClassifierService.ts` — feature-weight scorer using biomechanical attributes  
**Feature schema:** 32 features (9 foot profile + 2 context continuous + 6 use-case + 11 shoe model + 1 rule score) — defined in `mlDatasetService.ts FeatureVector`  
**Upgrade path:** Replace `predictSuccessProbability()` with a Python XGBoost API call using the same FeatureVector schema

---

## Evolution Path

### Stage 1: Real XGBoost Binary Classifier (6–12 months, ~500 labeled sessions)

**Trigger:** When `model_versions` table has ≥ 500 labeled rows with balanced class distribution

**What changes:**
- Add a Python FastAPI microservice: `ml-service/train.py` + `ml-service/predict.py`
- Train: `xgboost.XGBClassifier` on the 32-feature vectors from `normalized_recommendations`
- Replace `predictSuccessProbability()` in `mlClassifierService.ts` with:
  ```typescript
  const response = await fetch('http://ml-service/predict', {
    method: 'POST',
    body: JSON.stringify(features)
  });
  const { probability } = await response.json();
  ```
- The `model_versions` table gains a `model_artifact_path` column for pickle file storage
- Retraining pipeline in `retrainingService.ts` calls `http://ml-service/retrain` instead of computing feature weights directly

**Why XGBoost first:** Handles the mixed categorical + continuous features naturally. Built-in feature importance. No need for normalization (unlike neural nets). Fast training on small datasets.

---

### Stage 2: Multi-Class Ranking Model (12–18 months, ~2,000 sessions)

**What changes:**
- Replace binary success/fail labels with 5-class ordinal output:
  - Class 0: perfect fit
  - Class 1: slightly better than expected
  - Class 2: as expected
  - Class 3: slightly worse
  - Class 4: poor fit
- Model outputs a **ranking score** per shoe instead of binary success probability
- Hybrid formula changes: `hybrid_score = (rule_score × 0.5) + (ml_ranking_score × 0.5)`
- "Why We're Confident" UI shows ranking distribution, not just success rate

**Database change:** `feedback` table gains `fit_rating` integer column (1–5) for granular labels  
**New feature:** "X% of similar users ranked this shoe in their top 2" instead of binary success

**Why multi-class:** Binary feedback ("good/bad") loses nuance. Ranking captures partial satisfaction and enables better differentiation between candidate shoes at the top of the list.

---

### Stage 3: Collaborative Filtering (18–30 months, ~10,000 sessions)

**What changes:**
- User preference vectors: cluster users by foot profile + use case + feedback pattern
- Matrix factorization: `user_id × shoe_model` matrix → latent factor decomposition
- `GET /api/recommend` returns "users like you also liked" section with complementary models
- Cold start handling: new users get rule engine + XGBoost until 3+ feedback events

**New data:** Requires optional `user_id` (hashed device fingerprint or login) for session linking  
**Infrastructure:** Redis for user embedding cache; PostgreSQL `user_preferences` table  
**Python stack:** `surprise` library or `implicit` for collaborative filtering

**Why collaborative:** Pure biomechanical matching treats users as identical given same foot profile. Collaborative filtering discovers taste clusters: e.g., "wide-foot runners who prefer lifestyle-crossover shoes" vs "wide-foot runners who want max performance".

---

### Stage 4: Personalized Engine (30+ months, repeat users)

**What changes:**
- Per-user model: fine-tune base XGBoost weights using individual purchase/feedback history
- Dynamic per-shoe fit adjustment: if user reports "slightly too narrow" on shoe A, downrank all high-wideFootScore shoes for that user
- `user_preferences` table tracks: preferred_brands (PUMA sub-lines), avoided_categories, size adjustments, activity evolution
- "Your Profile Has Evolved" UI: "Based on 7 sessions, we know you prefer cushioning over speed"

**Privacy:** All user data is opt-in. Anonymous sessions default to cohort-based recommendations.  
**Model architecture:** Base XGBoost + user-specific feature offsets (Bayesian updating)

**Why personalized:** Repeat PUMA customers have evolving needs (training ramp-up, injury recovery, seasonal use). Personalization converts one-time recommendation into a loyalty engine — the more sessions, the better the fit.

---

## Feature Engineering Roadmap

| Feature | Current | Stage 1 | Stage 2 | Stage 3 | Stage 4 |
|---------|---------|---------|---------|---------|---------|
| Foot profile | ✓ One-hot | ✓ | ✓ | ✓ | ✓ personalized adjustments |
| Use case | ✓ One-hot | ✓ | ✓ | ✓ | ✓ |
| Rule score | ✓ Normalized | ✓ | ✓ | ✓ | ✓ |
| Session time features | — | — | ✓ | ✓ | ✓ |
| User cohort embeddings | — | — | — | ✓ | ✓ |
| Historical feedback | — | ✓ per-shoe rates | ✓ ordinal | ✓ matrix | ✓ per-user |
| Weather context | — | — | ✓ | ✓ | ✓ |

---

## Upgrade Checklist

When ready to move to Stage 1 (real XGBoost):

- [ ] `model_versions.labeled_rows >= 500` in Supabase
- [ ] `model_versions.class_balance` is roughly balanced (not >90% one class)
- [ ] Python FastAPI service scaffolded (`ml-service/` directory)
- [ ] `predictSuccessProbability()` replaced with HTTP call
- [ ] A/B test: feature-weight-v{N} vs xgboost-v1 on 20% of traffic
- [ ] Accuracy metrics: XGBoost must beat feature-weight baseline by >5% on held-out test set

---

*Document created: Phase 10 — ML Retraining, Explainability & Evolution*  
*Last updated: 2026-06-25*
