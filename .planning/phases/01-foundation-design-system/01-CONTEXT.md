# Phase 1: Foundation & Design System — Context

**Gathered:** 2026-04-03
**Status:** Ready for planning
**Source:** PRD Express Path (puma_reality_match_engine_prd_and_demo_foundation.md)

<domain>
## Phase Boundary

Phase 1 delivers the complete project foundation that all subsequent phases build upon:
- React + Vite + TypeScript project scaffold with all dependencies installed
- Tailwind CSS design system with PUMA-aligned premium tokens (colors, fonts, spacing, shadows, animations)
- Framer Motion animation primitives and page transition system
- Zustand store structure (initialized with all state slices, even if empty)
- React Router v6 navigation with all 6 screen routes defined
- Screen 1 fully implemented: "Your Current Problem" — generic shoe grid showing buyer confusion
- Shared component library: Button, Card, Badge, ProgressBar, NavBar shells
- Demo backend skeleton: Node.js + Express server + Supabase/PostgreSQL connection

This phase does NOT implement: foot scan, questionnaire logic, recommendation engine, or match result UI. It only provides the skeleton and design system that those phases populate.

</domain>

<decisions>
## Implementation Decisions

### Tech Stack (Locked — from PRD)
- React 18 + TypeScript + Vite 5 as the frontend framework
- Tailwind CSS v3 for all styling (no CSS-in-JS, no styled-components)
- Framer Motion v11 for all animations and page transitions
- Zustand v4 for global state management (foot profile, questionnaire answers, recommendation)
- React Router v6 for client-side routing
- Node.js + Express for demo backend
- Supabase (PostgreSQL) OR in-memory JSON for shoe catalog (decide in Phase 4)

### Design System Requirements (Locked — from PRD)
- Must feel "Apple-like premium" — not a hackathon prototype
- Dark mode first (PUMA brand leans dark, high contrast)
- Use a curated color palette: deep black/charcoal background, PUMA brand accent (#FFD700 gold or define from PUMA brand guidelines equivalent), clean white text
- Typography: Inter or Outfit from Google Fonts (modern, athletic feel)
- Smooth spring animations throughout — no linear easing
- All cards should use glassmorphism or subtle gradient borders

### Screen 1 Requirements (Locked — from PRD Section 5)
- Shows a grid of generic shoes without personalization
- Frames the "confusion" problem: "Too many choices. No confidence."
- This is the "before state" — the problem PUMA currently has
- Must have a clear CTA to start the scan ("Find My Perfect Fit")

### Project Structure (Agent's Discretion)
- Monorepo or separate frontend/backend (choose based on demo simplicity — single repo preferred)
- File structure conventions: feature-based or route-based (route-based preferred for demo clarity)
- CSS architecture: Tailwind utility classes + design tokens in tailwind.config.js

### Demo Backend Skeleton (Locked — from PRD)
- Node.js + Express server
- Health check endpoint: GET /api/health
- Placeholder routes for: POST /api/scan (Phase 2), GET /api/shoes (Phase 4), POST /api/recommend (Phase 4)
- Database connection setup (Supabase or local PostgreSQL)

### the Agent's Discretion
- Exact folder structure within src/
- Choice of icon library (Lucide React or Heroicons — agent picks)
- Whether to use TypeScript strict mode (recommended: yes)
- ESLint + Prettier configuration details
- Whether to use React Query for API state (allowed if agent deems appropriate)
- Exact PUMA color palette values (must feel premium — reference PUMA.com aesthetics)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Planning
- `.planning/PROJECT.md` — Project context, constraints, and key decisions
- `.planning/REQUIREMENTS.md` — Full requirement IDs with descriptions (UI-01, UI-07, UI-08, TECH-01–05)
- `.planning/ROADMAP.md` — Phase structure and success criteria

### PRD Source
- `c:/Users/Hashvanth/Downloads/puma_reality_match_engine_prd_and_demo_foundation.md` — Original PRD with tech stack specification (Section 7), demo architecture (Section 9), and screen-by-screen requirements (Section 5)

No external specs — requirements fully captured in decisions above.

</canonical_refs>

<specifics>
## Specific Ideas

From PRD Section 5 (Demo Experience):
- Screen 1 must show "A generic shoe grid. User confusion. Too many choices. No confidence."
- The CTA leads into the foot scan flow

From PRD Section 7 (Tech Stack):
- Three.js or React Three Fiber for 3D visualization (Phase 5, but set up Three.js dependency now)
- Zustand for local state — foot profile, questionnaire answers, recommendation result

From PRD Section 11 (What Would Impress PUMA):
- "A premium demo that makes the consumer feel understood"
- The design should feel like a product reveal, not a prototype

Design inspiration reference: PUMA.com — dark athletic aesthetic, bold typography, high-contrast CTAs

</specifics>

<deferred>
## Deferred Ideas

- Apparel recommendation (PRD Phase 2 — after v1 demo)
- "Today's Fit" daily recommendations (PRD Phase 3)
- Loyalty + replacement prediction (PRD Phase 4)
- Real Apple Health / Google Fit integration (Phase 1 sets up mock only)
- Weather API (optional premium add-on, not in Phase 1)
- Mobile native app (web-first)

</deferred>

---

*Phase: 01-foundation-design-system*
*Context gathered: 2026-04-03 via PRD Express Path*
