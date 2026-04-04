---
description: Run full codebase lint (ESLint + TypeScript strict) across frontend and backend, auto-fix trivial issues, report remaining errors
---

# /puma-lint — Full Codebase Lint & Fix

Run ESLint and TypeScript compiler checks across both `puma-frontend/` and `puma-backend/` to catch code quality issues. Auto-fix what's possible, report what needs manual attention.

## Steps

### 1. Frontend ESLint (auto-fix)

// turbo
Run ESLint with auto-fix on the frontend:

```
cd c:\Users\Hashvanth\Puma-X\puma-frontend && npx eslint . --fix 2>&1
```

- If clean (exit 0): report "✅ Frontend ESLint: Clean"
- If errors remain: capture output, group errors by file

### 2. Frontend TypeScript Strict Check

// turbo
Run the TypeScript compiler in check-only mode:

```
cd c:\Users\Hashvanth\Puma-X\puma-frontend && npx tsc --noEmit 2>&1
```

- If clean: report "✅ Frontend TypeScript: Clean"
- If errors: capture and categorize:
  - **Type errors** (TS2xxx): Must fix — wrong types, missing properties
  - **Unused code** (TS6133, TS6196): Auto-fixable — remove unused imports/variables
  - **Strict null** (TS2531, TS18047, TS18048): Important — add null checks

### 3. Backend TypeScript Check

// turbo
Run TypeScript check on the backend:

```
cd c:\Users\Hashvanth\Puma-X\puma-backend && npx tsc --noEmit 2>&1
```

- Same categorization as step 2

### 4. Auto-Fix Trivial Issues

For each **unused import** or **unused variable** error found in steps 2-3:
- Open the file
- Remove the unused import line or variable declaration
- Verify the removal doesn't break anything

**Do NOT auto-fix:**
- Type errors (need human decision)
- Missing property errors
- Any error in test files

### 5. Generate Summary Report

Output a summary in this format:

```
═══════════════════════════════════════════
  PUMA-X Lint Report
═══════════════════════════════════════════

  Frontend ESLint:    ✅ Clean | ❌ {N} errors, {N} warnings
  Frontend TypeScript: ✅ Clean | ❌ {N} errors
  Backend TypeScript:  ✅ Clean | ❌ {N} errors

  Auto-fixed: {N} issues (unused imports/variables)
  Remaining:  {N} issues requiring manual fix

  ─── Remaining Issues ───
  
  🔴 {file}:{line} — {error message}
  🔴 {file}:{line} — {error message}
  ...

═══════════════════════════════════════════
```

### 6. Offer Fixes

If there are remaining errors:
- For each error, explain what's wrong and suggest a specific fix
- Ask the user if they want to apply the suggested fixes
- Apply approved fixes one at a time, re-running lint after each

## Rules

- **Never suppress errors** with `// @ts-ignore` or `eslint-disable` unless there's a documented, justified reason
- **Never use `any` type** — use `unknown` with type guards instead
- **Preserve all existing functionality** — lint fixes must not change behavior
- **Run final check** — after all fixes, re-run steps 1-3 to confirm clean state
