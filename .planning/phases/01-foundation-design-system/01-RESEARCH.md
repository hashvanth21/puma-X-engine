# Phase 1 Research: Foundation & Design System

## Stack Decisions

### Frontend (Locked — PRD)
- **React 18.3+** with TypeScript (strict mode)
- **Vite 5.x** — fastest HMR, minimal config, excellent TS support
- **Tailwind CSS 3.4.x** — utility-first, token-based design system via CSS variables
- **Framer Motion 11.x** — AnimatePresence + motion components for page transitions
- **Zustand 4.5.x** — slice pattern for multi-domain state (foot profile, questionnaire, recommendation)
- **React Router DOM 6.x** — client-side routing with `useLocation` for AnimatePresence key
- **Lucide React** — clean, consistent icon set (athletic-appropriate, MIT licensed)
- **Three.js / @react-three/fiber** — install now, use in Phase 5

### Backend (Locked — PRD)
- **Node.js 20 LTS** + **Express 4.x**
- **Supabase JS client** (@supabase/supabase-js) for PostgreSQL (Phase 4 needs it, set up now)
- **CORS** + **dotenv** for development

## Scaffold Setup

### Exact Commands

```bash
# Frontend
npm create vite@latest puma-frontend -- --template react-ts
cd puma-frontend
npm install framer-motion react-router-dom zustand lucide-react
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
npm install @react-three/fiber @react-three/drei three
npm install @types/three

# Backend
mkdir puma-backend && cd puma-backend
npm init -y
npm install express cors dotenv @supabase/supabase-js
npm install -D typescript @types/express @types/node ts-node nodemon
```

### Folder Structure (Feature-Based)

```
puma-frontend/
├── src/
│   ├── assets/           # Shoe images, PUMA logo
│   ├── components/       # Shared: Button, Card, Badge, Progress, NavBar
│   ├── screens/          # Screen1–6 (Screen1 in this phase)
│   │   ├── Screen1Problem/
│   │   ├── Screen2FootScan/    (placeholder)
│   │   ├── Screen3Questions/   (placeholder)
│   │   ├── Screen4Match/       (placeholder)
│   │   ├── Screen5Compare/     (placeholder)
│   │   └── Screen6Ecosystem/   (placeholder)
│   ├── stores/           # Zustand slices
│   │   ├── footProfileStore.ts
│   │   ├── questionnaireStore.ts
│   │   ├── recommendationStore.ts
│   │   └── index.ts       # Combined store
│   ├── design/           # Design tokens, animation variants
│   │   └── tokens.ts
│   ├── App.tsx           # Router + AnimatePresence
│   ├── main.tsx
│   └── index.css         # Tailwind directives + CSS variables

puma-backend/
├── src/
│   ├── routes/
│   │   ├── health.ts
│   │   ├── shoes.ts       (placeholder)
│   │   └── recommend.ts   (placeholder)
│   ├── db/
│   │   └── supabase.ts
│   └── index.ts
```

## Design System Approach

### Token Architecture (CSS Variables → Tailwind)

Define in `src/index.css`:
```css
:root {
  /* Core dark palette */
  --color-bg-primary: 20 20 20;         /* #141414 */
  --color-bg-secondary: 26 26 26;       /* #1a1a1a */
  --color-bg-elevated: 34 34 34;        /* #222222 */
  --color-bg-glass: 255 255 255;        /* used at 5% opacity */
  
  /* Text */
  --color-text-primary: 255 255 255;    /* #ffffff */
  --color-text-secondary: 180 180 180; /* #b4b4b4 */
  --color-text-muted: 100 100 100;      /* #646464 */
  
  /* Brand accent */
  --color-accent: 200 160 0;            /* PUMA gold — #c8a000 */
  --color-accent-glow: 255 200 0;       /* #ffc800 */
  --color-accent-red: 211 40 40;        /* PUMA red — #d32828 */
  
  /* Semantic */
  --color-success: 40 180 80;
  --color-border: 255 255 255;          /* used at 10% opacity */
  
  /* Spacing scale */
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-xl: 32px;
}
```

Wire into `tailwind.config.js`:
```js
colors: {
  bg: {
    primary: 'rgb(var(--color-bg-primary) / <alpha-value>)',
    secondary: 'rgb(var(--color-bg-secondary) / <alpha-value>)',
    elevated: 'rgb(var(--color-bg-elevated) / <alpha-value>)',
    glass: 'rgb(var(--color-bg-glass) / <alpha-value>)',
  },
  accent: {
    DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
    glow: 'rgb(var(--color-accent-glow) / <alpha-value>)',
    red: 'rgb(var(--color-accent-red) / <alpha-value>)',  
  },
  text: {
    primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
    secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
    muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
  }
}
```

### Typography
- Font: **Outfit** (athletic feel) for headings + **Inter** for body (Google Fonts CDN)
- Heading scale: `text-6xl font-black tracking-tight` (hero), `text-4xl font-bold` (section)
- Body: `text-base font-medium text-text-secondary`

### Glassmorphism Pattern (for cards)
```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
}
```

## Animation Architecture

### Framer Motion Page Transitions

```tsx
// App.tsx - Core pattern
const location = useLocation();

<AnimatePresence mode="wait">
  <Routes location={location} key={location.pathname}>
    <Route path="/" element={<PageWrapper><Screen1 /></PageWrapper>} />
    ...
  </Routes>
</AnimatePresence>

// PageWrapper.tsx
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
  >
    {children}
  </motion.div>
);
```

### Shared Animation Variants (`src/design/tokens.ts`)
```ts
export const fadeInUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };
export const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
export const springTransition = { type: 'spring', stiffness: 300, damping: 30 };
export const smoothTransition = { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] };
```

## State Management Structure

### Three-Slice Zustand Store

```ts
// footProfileStore.ts
export const createFootProfileSlice = (set) => ({
  footProfile: null as FootProfile | null,
  setFootProfile: (profile: FootProfile) => set({ footProfile: profile }),
  resetFootProfile: () => set({ footProfile: null }),
});

// questionnaireStore.ts
export const createQuestionnaireSlice = (set) => ({
  context: null as UserContext | null,
  setContext: (ctx: Partial<UserContext>) => set(state => ({ context: { ...state.context, ...ctx } })),
  resetContext: () => set({ context: null }),
});

// recommendationStore.ts
export const createRecommendationSlice = (set) => ({
  recommendation: null as Recommendation | null,
  setRecommendation: (rec: Recommendation) => set({ recommendation: rec }),
  resetRecommendation: () => set({ recommendation: null }),
});

// Combined store
export const useAppStore = create<AppStore>((...a) => ({
  ...createFootProfileSlice(...a),
  ...createQuestionnaireSlice(...a),
  ...createRecommendationSlice(...a),
  currentScreen: 1,
  advanceScreen: () => set(state => ({ currentScreen: state.currentScreen + 1 })),
  resetAll: () => set({ footProfile: null, context: null, recommendation: null, currentScreen: 1 }),
}));
```

## Backend Setup

### Express + Supabase

```ts
// src/index.ts
import express from 'express';
import cors from 'cors';
import { healthRouter } from './routes/health';
import { shoesRouter } from './routes/shoes';
import { recommendRouter } from './routes/recommend';

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api', healthRouter);       // GET /api/health
app.use('/api/shoes', shoesRouter);  // GET /api/shoes (Phase 4)
app.use('/api/recommend', recommendRouter); // POST /api/recommend (Phase 4)

// src/db/supabase.ts
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
```

## Key Findings & Gotchas

1. **AnimatePresence `mode="wait"` is critical** — without it, exit and enter animations overlap, looking broken
2. **`key={location.pathname}` on Routes** — Framer Motion needs this to detect page changes; forgetting it means no transitions
3. **Tailwind CSS variables with `<alpha-value>`** — this syntax (`rgb(var / <alpha-value>)`) enables `opacity-*` utilities to work with custom colors; must use this pattern
4. **Zustand selector memoization** — always use `useShallow` when selecting multiple values to prevent unnecessary re-renders
5. **Three.js in Vite** — may need `@vitejs/plugin-react` with specific config if using GLSL shaders; basic R3F works out of the box
6. **Supabase env vars** — never commit `.env` to git; add `.env.example` with placeholder values
7. **Tailwind `darkMode: 'class'`** — set this even though we're dark-first; allows future light mode support

## Validation Architecture

### Acceptance Tests for Phase 1 Completion

1. `npm run dev` starts without errors — check terminal for `VITE ready` message
2. `curl http://localhost:3001/api/health` returns `{"status":"ok"}`  
3. `http://localhost:5173` shows Screen 1 with shoe grid — visually verify premium dark aesthetic
4. Click "Find My Perfect Fit" CTA navigates to Screen 2 (placeholder with Framer Motion transition)
5. Browser console has zero React errors or Tailwind warnings
6. `src/stores/index.ts` exports `useAppStore` and all three slices are accessible
7. `src/design/tokens.ts` exports `fadeInUp`, `staggerContainer`, `springTransition`, `smoothTransition`
8. `tailwind.config.js` contains `bg.primary`, `accent.DEFAULT`, `text.primary` custom colors
9. All 6 screen routes are registered in `App.tsx` (verify by inspecting router config)
10. `.env.example` exists with `SUPABASE_URL=` and `SUPABASE_ANON_KEY=` placeholders
