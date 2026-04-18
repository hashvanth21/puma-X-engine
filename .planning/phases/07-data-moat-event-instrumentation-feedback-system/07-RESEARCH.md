# Phase 7 Research: Data Moat – Event Instrumentation & Feedback System

**Researched:** 2026-04-18
**Mode:** ecosystem
**Confidence:** High (well-understood patterns, existing Supabase infrastructure)

## Standard Stack

Use the **existing stack** — no new major dependencies needed:

| Layer | Technology | Already In Project | Notes |
|-------|-----------|-------------------|-------|
| Database | Supabase (PostgreSQL) | ✅ `@supabase/supabase-js` | All new tables go here |
| Backend | Express + TypeScript | ✅ | New routes + service layer |
| Frontend State | Zustand | ✅ | New analytics middleware + feedback store slice |
| Frontend UI | React + Framer Motion + Tailwind | ✅ | Feedback modal component |
| UUID generation | `crypto.randomUUID()` | ✅ (native) | Session IDs — no library needed |

**New dependency (backend only):** None. Supabase client already handles all DB operations.

**New dependency (frontend only):** None. Existing stack sufficient.

## Architecture Patterns

### 1. Event Tracking Architecture

Use a **dual-layer tracking pattern**:

```
Frontend (Zustand middleware)          Backend (Express service layer)
├── Interaction events (client-side)   ├── Recommendation events (server-side)
│   • clicked_primary                  │   • session_id, foot_profile, use_case
│   • opened_alternatives             │   • top-3 models, selected model
│   • time_spent_on_result             │   • confidence_score
│   • changed_use_case                 │   • timestamp
│   • re_ran_scan                      └── Written to `recommendations` table
└── Sent via POST /api/events
    Written to `interaction_events` table
```

**Why dual-layer:** Interaction events (clicks, time-on-screen) are only observable on the client. Recommendation events (scoring, ranking) are computed server-side. Don't try to force one layer to observe both.

### 2. Session ID Pattern

Generate `session_id` on the **frontend at app initialization** using `crypto.randomUUID()`. Store in Zustand state. Pass to backend on every recommendation request and interaction event batch. This ties the entire user journey together.

```typescript
// In Zustand store
sessionId: crypto.randomUUID(),
```

### 3. Interaction Event Collection Pattern

Use **Zustand middleware** to intercept specific state changes and buffer interaction events client-side. Flush the buffer:
- When the user navigates away from the result screen
- When the user submits feedback
- On `beforeunload` (best-effort via `navigator.sendBeacon`)

```typescript
// analyticsMiddleware pattern
const analyticsMiddleware = (config) => (set, get, api) => {
  const customSet = (args, replace) => {
    // Detect screen transitions, recommendation views, etc.
    // Buffer events locally
    set(args, replace);
  };
  return config(customSet, get, api);
};
```

### 4. Feedback Collection UX Pattern

Use **progressive disclosure** feedback — don't interrupt the user immediately:

1. After recommendation is shown, wait 3-5 seconds
2. Show a subtle inline prompt: "How did this recommendation work?"
3. If user engages → expand into structured feedback with 3 quick questions
4. Questions use **fixed options only** (radio buttons / chips) — no free text in v1
5. Fire-and-forget POST to `/api/feedback`

**Feedback questions (from execution plan):**
- Fit Result: `perfect_fit | slightly_tight | too_tight | slightly_loose | too_loose`
- Use Case Result: `good_for_purpose | not_ideal`
- Style Preference: `liked_style | disliked_style`

### 5. Backend Event Service Pattern

Create a dedicated `eventService.ts` (not mixed into the scoring engine):

```typescript
// puma-backend/src/services/eventService.ts
export async function logRecommendationEvent(event: RecommendationEvent): Promise<void>
export async function logInteractionEvents(events: InteractionEvent[]): Promise<void>
export async function logFeedback(feedback: FeedbackRecord): Promise<void>
```

Each function wraps a Supabase `.insert()` call. Use `async` fire-and-forget so tracking never blocks the recommendation response.

## Database Schema

### Tables (Supabase/PostgreSQL)

```sql
-- 1. Scan profiles (links to a session)
CREATE TABLE scan_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  width TEXT NOT NULL CHECK (width IN ('narrow', 'standard', 'wide')),
  arch TEXT NOT NULL CHECK (arch IN ('low', 'medium', 'high')),
  pronation TEXT NOT NULL CHECK (pronation IN ('neutral', 'overpronation', 'supination')),
  foot_length NUMERIC,
  fit_preference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_scan_profiles_session ON scan_profiles(session_id);

-- 2. Recommendations (one per session, stores the engine output)
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  profile_id UUID REFERENCES scan_profiles(id),
  use_case TEXT NOT NULL,
  activity TEXT NOT NULL,
  climate TEXT NOT NULL,
  priority_score INTEGER,
  hours_per_day INTEGER,
  recommended_top3 JSONB NOT NULL,  -- [{model, score}]
  primary_model TEXT NOT NULL,
  primary_score INTEGER NOT NULL,
  alternate_model TEXT,
  alternate_score INTEGER,
  selected_model TEXT,              -- populated when user selects
  confidence_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_recommendations_session ON recommendations(session_id);
CREATE INDEX idx_recommendations_primary ON recommendations(primary_model);

-- 3. Interaction events (batched from frontend)
CREATE TABLE interaction_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id UUID NOT NULL,
  recommendation_id UUID REFERENCES recommendations(id),
  event_type TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_interactions_session ON interaction_events(session_id);
CREATE INDEX idx_interactions_type ON interaction_events(event_type);

-- 4. Feedback (structured post-recommendation)
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recommendation_id UUID NOT NULL REFERENCES recommendations(id),
  session_id UUID NOT NULL,
  fit_feedback TEXT CHECK (fit_feedback IN (
    'perfect_fit', 'slightly_tight', 'too_tight', 'slightly_loose', 'too_loose'
  )),
  use_case_feedback TEXT CHECK (use_case_feedback IN (
    'good_for_purpose', 'not_ideal'
  )),
  style_feedback TEXT CHECK (style_feedback IN (
    'liked_style', 'disliked_style'
  )),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_feedback_recommendation ON feedback(recommendation_id);

-- 5. Shoe metadata (already exists as in-memory catalog, persist to DB)
CREATE TABLE shoe_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  attributes JSONB NOT NULL,
  tech_features TEXT[],
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Why This Schema

- **Normalized** — not event-sourced. Each table represents a clear entity. This aligns with the execution plan's Stage 3 requirement for a table where every row = foot profile + use case + shoe + outcome.
- **JSONB for flexibility** — `recommended_top3` and `event_data` use JSONB to avoid schema changes when adding new attributes.
- **CHECK constraints** — enforce valid enum values at the database level, preventing garbage data.
- **Session-centric** — `session_id` is the join key across all tables, enabling full session reconstruction.

## Don't Hand-Roll

| Problem | Use Instead |
|---------|-------------|
| UUID generation | `crypto.randomUUID()` (frontend) + `gen_random_uuid()` (Supabase) |
| Event buffering queue | Simple array + `setInterval`/`beforeunload` flush — no need for a message queue library |
| Database migrations | Supabase dashboard SQL editor or `supabase migration` CLI |
| Form validation | CHECK constraints in PostgreSQL + TypeScript type guards — no form library needed for 3 radio groups |
| Analytics dashboards | Phase 8 scope — don't build reporting now |
| RLS policies | Not needed yet — this is a demo app with no auth |

## Common Pitfalls

### 1. Blocking the recommendation response with tracking
**Risk:** Adding `await supabase.insert()` to the recommend route handler slows the response.
**Fix:** Use fire-and-forget: `logRecommendationEvent(event).catch(console.error)` — don't await it.

### 2. Missing session_id linkage
**Risk:** Interaction events and feedback can't be joined to recommendations.
**Fix:** Generate session_id once in Zustand on app init. Pass it everywhere. It's the primary join key.

### 3. Over-engineering event types
**Risk:** Creating dozens of event types that are never queried.
**Fix:** Start with exactly 5 interaction event types from the execution plan: `clicked_primary`, `opened_alternatives`, `time_spent`, `changed_use_case`, `re_ran_scan`. Add more only when analysis needs them.

### 4. Feedback modal timing
**Risk:** Showing feedback immediately after recommendation ruins the demo experience.
**Fix:** Use a delay (3-5 seconds) and non-blocking inline prompt, not a forced modal. The user should feel the recommendation landed before being asked about it.

### 5. Not tracking the "selected_model"
**Risk:** Only tracking what was recommended, not what the user actually chose.
**Fix:** The `selected_model` field on the recommendations table should be updated via a separate `PATCH /api/recommend/:id/select` endpoint when the user clicks a shoe.

## API Endpoints

### New Routes

```
POST   /api/events              — Batch insert interaction events
POST   /api/feedback             — Submit structured feedback
PATCH  /api/recommend/:id/select — Record which shoe the user selected
```

### Modified Routes

```
POST   /api/recommend            — Existing. Add session_id to request, 
                                   fire-and-forget log to recommendations table
```

## Code Examples

### Backend: Event Service

```typescript
// puma-backend/src/services/eventService.ts
import { supabase } from '../db/supabase';

export interface RecommendationEvent {
  session_id: string;
  profile_id?: string;
  use_case: string;
  activity: string;
  climate: string;
  priority_score: number;
  hours_per_day: number;
  recommended_top3: Array<{ model: string; score: number }>;
  primary_model: string;
  primary_score: number;
  alternate_model?: string;
  alternate_score?: number;
  confidence_score?: number;
}

export async function logRecommendationEvent(event: RecommendationEvent): Promise<string | null> {
  const { data, error } = await supabase
    .from('recommendations')
    .insert([event])
    .select('id')
    .single();
  
  if (error) { console.error('Failed to log recommendation:', error); return null; }
  return data?.id ?? null;
}
```

### Frontend: Zustand Analytics Slice

```typescript
// puma-frontend/src/stores/analyticsStore.ts
export interface AnalyticsSlice {
  sessionId: string;
  interactionBuffer: InteractionEvent[];
  trackInteraction: (type: string, data?: Record<string, unknown>) => void;
  flushEvents: () => Promise<void>;
}
```

### Frontend: Feedback Modal Component

```tsx
// puma-frontend/src/components/FeedbackModal.tsx
// 3 questions: fit_feedback, use_case_feedback, style_feedback
// Each uses chip/radio selection
// Submit POSTs to /api/feedback
// Shows thank-you toast on completion
```

## Files Impact Summary

### Backend (puma-backend/src/)
| File | Action | Purpose |
|------|--------|---------|
| `services/eventService.ts` | NEW | Event logging, feedback storage, recommendation tracking |
| `routes/events.ts` | NEW | POST /api/events endpoint |
| `routes/feedback.ts` | NEW | POST /api/feedback endpoint |
| `routes/recommend.ts` | MODIFY | Add session_id param, fire-and-forget logging, PATCH select |
| `index.ts` | MODIFY | Register new routes |

### Frontend (puma-frontend/src/)
| File | Action | Purpose |
|------|--------|---------|
| `stores/analyticsStore.ts` | NEW | Analytics slice with session_id, event buffer, flush |
| `stores/index.ts` | MODIFY | Add analytics slice to AppStore |
| `components/FeedbackModal.tsx` | NEW | Structured feedback collection UI |
| `screens/Screen4Match.tsx` (or similar) | MODIFY | Wire up interaction tracking + feedback trigger |

### Database (Supabase)
| Table | Action | Purpose |
|-------|--------|---------|
| `scan_profiles` | NEW | Persisted foot profiles |
| `recommendations` | NEW | Recommendation events with scoring data |
| `interaction_events` | NEW | Client-side interaction tracking |
| `feedback` | NEW | Structured user feedback |
| `shoe_metadata` | NEW | Persisted shoe catalog (mirrors in-memory data) |

## Validation Architecture

### Dimension 1: Schema Integrity
- All 5 tables created with correct constraints
- CHECK constraints enforce valid enum values
- Indexes on session_id and recommendation_id

### Dimension 2: Event Pipeline Completeness
- Recommendation event logged on every POST /api/recommend
- Interaction events buffered and flushed
- Feedback linked to recommendation_id

### Dimension 3: Data Linkage
- session_id joins scan_profiles → recommendations → interaction_events → feedback
- No orphaned records possible (foreign key constraints)

### Dimension 4: Non-Blocking Performance
- Tracking calls don't block recommendation response
- Event buffer prevents excessive API calls
- sendBeacon fallback for page unload

---

## RESEARCH COMPLETE

**Key insight:** The existing stack (Supabase + Express + Zustand) already has everything needed. No new libraries required. The main engineering work is (1) designing the schema, (2) building the event service layer, (3) adding the frontend analytics middleware, and (4) building the feedback UI.

**Confidence:** High — all patterns are well-established, Supabase handles the heavy lifting, and the project already has the infrastructure in place.
