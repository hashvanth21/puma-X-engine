---
description: Find and remove dead code, unused imports, orphaned files, and circular dependencies across the codebase
---

# /puma-clean — Dead Code & Import Cleanup

Systematically find and remove dead code from the PUMA Reality Match Engine codebase. This includes unused imports, unused exports, orphaned files, and circular dependency chains.

## Steps

### 1. TypeScript Unused Code Detection

// turbo
Run the TypeScript compiler to detect unused locals and parameters:

```
cd c:\Users\Hashvanth\Puma-X\puma-frontend && npx tsc --noEmit --noUnusedLocals --noUnusedParameters 2>&1
```

Capture all `TS6133` (declared but never read) and `TS6196` (declared but never used) errors.

### 2. Unused Import Scan

For each `.ts` and `.tsx` file in `puma-frontend/src/` and `puma-backend/src/`:

1. Parse all `import` statements
2. Check if each imported identifier is used in the file body
3. Flag imports that are:
   - Imported but never referenced in code
   - Type-only imports that could use `import type`
   - Wildcard imports (`import * as`) where only specific members are used

### 3. Orphaned File Detection

Scan for files that are not imported by any other file:

1. Build the full import graph starting from entry points:
   - Frontend: `puma-frontend/src/main.tsx`
   - Backend: `puma-backend/src/index.ts`
2. Walk all imports recursively to find every reachable file
3. Compare against all `.ts`/`.tsx` files in `src/`
4. Files NOT in the reachable graph are **orphans**

**Exceptions** (not orphans even if unreachable):
- Type definition files (`*.d.ts`)
- Barrel files (`index.ts`) — they gather exports
- Config files (`vite.config.ts`, `tailwind.config.js`, etc.)
- Test files (`*.test.ts`, `*.spec.ts`)

### 4. Unused Export Detection

For each file, check if its exports are actually imported elsewhere:

1. Collect all `export` statements (named exports, default exports)
2. Search all other files for imports of those identifiers
3. Flag exports with zero external references

**Exceptions:**
- Barrel file re-exports (these are entry points)
- Store hooks (may be used dynamically)
- Type exports (may be used in declaration files)

### 5. Circular Dependency Check

Detect circular import chains:

1. Build the import dependency graph
2. Run cycle detection (DFS with back-edge detection)
3. Report any cycles found with the full chain:
   ```
   ⚠️ Circular: A.tsx → B.tsx → C.tsx → A.tsx
   ```

### 6. Generate Cleanup Report

```
═══════════════════════════════════════════
  PUMA-X Cleanup Report
═══════════════════════════════════════════

  Unused Imports:     {N} (auto-fixable ✅)
  Unused Variables:   {N} (auto-fixable ✅)
  Unused Exports:     {N} (review needed 👀)
  Orphaned Files:     {N} (review needed 👀)
  Circular Deps:      {N} (must fix 🔴)
  
  ─── Auto-Fixable ───

  {file}:{line} — Remove unused import: {identifier}
  {file}:{line} — Remove unused variable: {identifier}
  ...

  ─── Review Needed ───

  ORPHAN: {filepath} — not imported by any file
  UNUSED EXPORT: {filepath}:{identifier} — exported but never imported
  ...

  ─── Circular Dependencies ───

  CYCLE: {A} → {B} → {C} → {A}
  Suggestion: {how to break the cycle}
  ...

═══════════════════════════════════════════
```

### 7. Auto-Fix (With Confirmation)

Present the auto-fixable items to the user:

1. **Unused imports**: Remove the import line entirely (or just the unused identifier from a multi-import)
2. **Unused variables**: Remove the declaration (if safe) or prefix with `_` if it's a required parameter
3. **Type-only imports**: Convert `import { X }` to `import type { X }` where appropriate

Ask: "Apply {N} auto-fixes? (y/n)"

After fixing:
- Re-run TypeScript check to confirm no new errors
- Re-run ESLint to confirm clean

### 8. Manual Review Items

For items that need human decision:

- **Orphaned files**: "This file exists but nothing imports it. Delete it? It may be needed later — check git history."
- **Unused exports**: "This function/component is exported but never imported. Remove the export? It may be part of a public API."
- **Circular deps**: "These files form a circular import chain. Suggest extracting shared types/utilities into a separate file."

## Rules

- **Never delete files automatically** — always ask for confirmation
- **Never remove exports automatically** — they may be part of a public API or future use
- **Always verify after cleanup** — run `npx tsc --noEmit` after every batch of changes
- **Preserve barrel files** — don't flag `index.ts` re-exports as unused
- **Respect `_` prefix convention** — variables prefixed with `_` are intentionally unused
