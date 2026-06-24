# Phase 08 Summary: Data Normalization & Insight Pipeline

**Completed:** 2026-06-24
**Plans:** 3 (08-01, 08-02, 08-03)
**Requirements covered:** DATA-04, DATA-05

## What Was Built

### Database Layer (2 new migration files)

| File | Table | Purpose |
|------|-------|---------|
| `002_normalized_dataset.sql` | `normalized_recommendations` | ML-ready flat table: 1 row per session with foot profile + context + shoe + outcome + `ml_success` boolean label. UNIQUE on `session_id` for idempotent upserts. 6 indexes. |
| `003_weekly_insights.sql` | `weekly_insights` | Stores per-week JSON snapshots of all 3 insight reports. CHECK constraint enforces `report_type` enum. |

### Service Layer (3 new services)

| Service | Key Function | Output |
|---------|--------------|--------|
| `normalizationService.ts` | `runNormalizationJob()` | Joins recommendations + scan_profiles + feedback → upserts normalized rows. Derives `ml_success` boolean. Returns `{ processed, skipped, errors }`. |
| `insightService.ts` | `generateModelSuccessReport()` `generateProblemModelsReport()` `generateFootTypeClusterReport()` | 3 typed report generators. Report A: per-shoe success rates. Report B: failure patterns by (model, width, arch). Report C: preferred model by foot profile. |
| `weeklyPipelineService.ts` | `runWeeklyPipeline()` `getLatestInsights()` `getInsightHistory()` | Orchestrates normalize → 3 reports → persist. Fetch helpers for API routes. |

### API Routes (2 new route files)

| Route | Method | Behavior |
|-------|--------|----------|
| `/api/normalize/run` | POST | Triggers ETL job. Returns `{ processed, skipped, errors, message }`. |
| `/api/insights/latest` | GET | Fetches most recent snapshot of all 3 reports. 404 if none. |
| `/api/insights/generate` | POST | Triggers full weekly pipeline. Returns week_start + report summary. |
| `/api/insights/history` | GET | Returns historical snapshots for `?type=model_success\|problem_models\|foot_type_clusters`. |

### Other Changes

- `puma-backend/src/index.ts`: Registered `/api/normalize` and `/api/insights` routes
- `puma-backend/tsconfig.json`: Added `skipLibCheck: true` (suppresses Supabase library type noise)

## Architecture Decisions

- **ml_success label**: Derived at normalization time from `fit_outcome` and `use_case_outcome`. `true` = perfect/slightly off fit + good use case. `false` = too tight/loose or not ideal use case. `null` = no feedback yet. Stored on the row for Phase 9 ML training.
- **Upsert on session_id**: `normalized_recommendations` uses `UNIQUE(session_id)` so the normalization job can be run repeatedly without creating duplicates.
- **Parallel report generation**: `runWeeklyPipeline()` uses `Promise.all()` to generate all 3 reports concurrently.
- **Typed report interfaces**: All report types (`ModelSuccessReport`, `ProblemModelsReport`, `FootTypeClusterReport`) are fully typed TypeScript interfaces — no `any`.

## How to Use

1. **Run Supabase migrations**: Execute `002_normalized_dataset.sql` and `003_weekly_insights.sql` in Supabase dashboard SQL editor
2. **Trigger normalization**: `POST /api/normalize/run`
3. **Generate insight reports**: `POST /api/insights/generate` (normalizes + generates + persists)
4. **View latest reports**: `GET /api/insights/latest`
5. **View history**: `GET /api/insights/history?type=model_success`

## Phase 9 Handoff

The `normalized_recommendations` table provides the ML dataset:
- Feature columns: `width`, `arch`, `pronation`, `use_case`, `activity`, `climate`, `priority_score`, `hours_per_day`, `primary_model`, `primary_score`
- Label column: `ml_success` (boolean)
- Phase 9 (ML Engine) trains a binary classifier on this data
