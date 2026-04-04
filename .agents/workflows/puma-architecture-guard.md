---
description: Validate codebase architecture — file placement, import rules, layer separation, and naming conventions
---

# /puma-architecture-guard — Architecture Conformance Check

Ensure the PUMA Reality Match Engine codebase follows the established architecture. Validates file placement, import direction rules, and layer separation to prevent architectural drift.

## Architecture Definition

### Frontend Structure (`puma-frontend/src/`)

```
src/
├── main.tsx                  # App entry point — DO NOT add logic here
├── App.tsx                   # Router + layout shell
├── App.css                   # Global app styles
├── index.css                 # Tailwind directives + base styles
├── components/               # Reusable UI components
│   ├── index.ts              # Barrel export (all components)
│   ├── Button.tsx            # Example: generic button
│   ├── Card.tsx              # Example: generic card
│   └── ...
├── screens/                  # Route-level screens (one per route)
│   ├── Screen1Problem/       # Each screen in its own folder
│   │   ├── Screen1Problem.tsx
│   │   └── index.ts
│   ├── Screen2FootScan/
│   │   ├── Screen2FootScan.tsx
│   │   ├── components/       # Screen-specific sub-components (optional)
│   │   └── index.ts
│   └── ...
├── stores/                   # Zustand state stores
│   ├── index.ts              # Combined store + barrel exports
│   ├── footProfileStore.ts   # Foot scan domain
│   ├── questionnaireStore.ts # Questionnaire domain
│   └── recommendationStore.ts
├── hooks/                    # Custom React hooks
│   └── useScanStateMachine.ts
├── types/                    # Shared TypeScript types/interfaces
│   └── index.ts
├── design/                   # Design system tokens and constants
│   └── tokens.ts
└── assets/                   # Static assets (images, fonts, etc.)
```

### Backend Structure (`puma-backend/src/`)

```
src/
├── index.ts                  # Server entry point
├── routes/                   # Express route handlers
│   └── health.ts
└── db/                       # Database client + queries
    └── supabase.ts
```

## Steps

### 1. Validate File Placement

Scan all `.ts`/`.tsx` files and check placement rules:

| File Type | Required Location | Rule |
|-----------|------------------|------|
| React components (reusable) | `src/components/` | PascalCase filename, named export |
| Screen components | `src/screens/Screen{N}{Name}/` | Default export (for lazy loading) |
| Screen sub-components | `src/screens/Screen{N}{Name}/components/` | Only used by parent screen |
| Zustand stores | `src/stores/` | `{domain}Store.ts` naming |
| Custom hooks | `src/hooks/` | `use{Name}.ts` naming |
| Shared types | `src/types/` | Interfaces and type aliases only |
| Design tokens | `src/design/` | Constants and token objects |
| Static assets | `src/assets/` | Images, SVGs, fonts |

**Violations to flag:**
- Component file outside `src/components/` or screen-specific `components/`
- Store file outside `src/stores/`
- Hook file outside `src/hooks/`
- Type definitions scattered in component files (should be in `src/types/` if shared)
- Utility functions without a clear home

### 2. Validate Import Direction Rules

These import rules enforce proper layer separation:

#### ❌ FORBIDDEN Imports

| From | Cannot Import | Reason |
|------|--------------|--------|
| `components/*` | `stores/*` directly | Components should receive data via props; use hooks layer |
| `screens/ScreenX/*` | `screens/ScreenY/*` | Screens are independent; share via stores or components |
| `types/*` | Any runtime code | Types are pure declarations |
| `design/*` | Any runtime code | Design tokens are constants only |
| `puma-backend/*` | `puma-frontend/*` | Backend never imports frontend |
| `puma-frontend/*` | `puma-backend/*` | Frontend never imports backend (use API calls) |

#### ✅ ALLOWED Import Patterns

| From | Can Import | Notes |
|------|-----------|-------|
| `screens/*` | `components/*`, `stores/*`, `hooks/*`, `types/*`, `design/*` | Screens wire everything together |
| `components/*` | `types/*`, `design/*`, other `components/*` | Components are self-contained |
| `hooks/*` | `stores/*`, `types/*` | Hooks bridge stores to components |
| `stores/*` | `types/*` only | Stores are pure state |
| Any file | `@/` aliased imports | Prefer `@/` over deep relative paths |

#### ⚠️ RELATIVE IMPORT DEPTH

- Max relative import depth: 2 levels (`../` or `../../`)
- Beyond 2 levels: MUST use `@/` path alias
- Flag: `../../../` or deeper

### 3. Validate Naming Conventions

Scan all files and check:

| Entity | Convention | Example |
|--------|-----------|---------|
| Component files | `PascalCase.tsx` | `MetricCard.tsx` |
| Hook files | `use{Name}.ts` | `useScanStateMachine.ts` |
| Store files | `{domain}Store.ts` | `footProfileStore.ts` |
| Type files | `PascalCase.ts` or `index.ts` | `index.ts` |
| Utility files | `camelCase.ts` | `calculateScore.ts` |
| Screen folders | `Screen{N}{Name}` | `Screen2FootScan` |
| Constants | `UPPER_SNAKE_CASE` | `SCAN_DURATION_MS` |

### 4. Validate Barrel Exports

Check that barrel files (`index.ts`) are properly maintained:

- `src/components/index.ts` — exports all components
- `src/stores/index.ts` — exports all stores and the combined `useAppStore`
- Each `src/screens/Screen{N}{Name}/index.ts` — re-exports the screen

**Violations:**
- Component exists but isn't in barrel
- Store exists but isn't exported from barrel
- Barrel exports something that doesn't exist

### 5. Check for Anti-Patterns

Scan for common architectural violations:

1. **God components**: Files >300 lines → suggest extraction
2. **Business logic in components**: Complex calculations inside `.tsx` → should be in hooks/utils
3. **API calls in components**: Direct `fetch`/`axios` in component → should be in service layer
4. **Hardcoded strings**: User-facing text hardcoded → should be constants (prep for i18n)
5. **Mixed concerns**: File that mixes UI + data fetching + state management → separate
6. **Missing error handling**: `async` functions without try/catch or error boundary

### 6. Generate Architecture Report

```
═══════════════════════════════════════════
  PUMA-X Architecture Report
═══════════════════════════════════════════

  Files Scanned:      {N}
  Placement OK:       {N} ✅
  Placement Issues:   {N} ❌
  Import Violations:  {N} ❌
  Naming Issues:      {N} ⚠️
  Anti-Patterns:      {N} ⚠️

  ─── Placement Issues ───

  ❌ {filepath} — Component should be in src/components/
  ❌ {filepath} — Hook should be in src/hooks/
  ...

  ─── Import Violations ───

  ❌ {filepath}:{line} — Screen imports from another screen
     → Move shared code to src/components/ or src/hooks/
  ❌ {filepath}:{line} — Component directly imports store
     → Pass data via props or use a custom hook
  ...

  ─── Naming Issues ───

  ⚠️ {filepath} — Should be PascalCase: {suggestion}
  ⚠️ {filepath} — Store should follow {domain}Store.ts pattern
  ...

  ─── Anti-Patterns ───

  ⚠️ {filepath} — {N} lines (>300) — consider extracting sub-components
  ⚠️ {filepath}:{line} — Business logic in component — extract to hook
  ...

  ─── Barrel Export Status ───

  components/index.ts:  {N}/{N} components exported ✅|⚠️
  stores/index.ts:      {N}/{N} stores exported ✅|⚠️

═══════════════════════════════════════════
```

### 7. Fix Suggestions

For each violation, provide a specific actionable fix:

- **Placement**: "Move `{file}` to `{correct_location}` and update imports"
- **Import**: "Extract shared code into `src/{layer}/{name}.ts` and import from there"
- **Naming**: "Rename `{old}` to `{new}`"
- **Barrel**: "Add `export { {Name} } from './{Name}';` to `{barrel_file}`"

Ask user which fixes to apply.

## Rules

- **Scan ALL source files** — don't skip any `.ts`/`.tsx` files
- **Be strict on forbidden imports** — these are hard rules, not suggestions
- **Be lenient on screen sub-components** — screens CAN have `components/` subfolder for screen-specific pieces
- **Ignore node_modules and dist** — only scan source code
- **Ignore .planning directory** — that's GSD workflow, not source code
- **Consider the codebase's current stage** — some placeholders are expected before a phase is built
