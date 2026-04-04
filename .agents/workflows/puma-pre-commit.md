---
description: Run all quality checks before committing — lint, architecture guard, dead code scan, build verification, and code review as final quality gate
---

# /puma-pre-commit — Pre-Commit Quality Gate

The final gatekeeper before code enters the repository. Runs all quality checks in sequence and blocks the commit if any critical issues are found. This ensures nothing subpar reaches the repo.

## When to Use

Run this workflow:
- Before every `git commit`
- Before pushing to remote
- Before creating a pull request
- After completing a phase or major feature

## Steps

### 1. Identify What's Changed

// turbo
```
cd c:\Users\Hashvanth\Puma-X && git status --short
```

// turbo
```
cd c:\Users\Hashvanth\Puma-X && git diff --cached --name-only
```

If nothing is staged, report "No staged changes. Stage files first with `git add`."

List all changed/staged files for context.

### 2. Gate 1: ESLint (Frontend)

// turbo
```
cd c:\Users\Hashvanth\Puma-X\puma-frontend && npx eslint . 2>&1
```

- **Pass**: Zero errors (warnings acceptable but noted)
- **Fail**: Any ESLint error blocks the commit
- **Auto-fix**: Run `--fix` and re-check

### 3. Gate 2: TypeScript Compilation

// turbo
```
cd c:\Users\Hashvanth\Puma-X\puma-frontend && npx tsc --noEmit 2>&1
```

// turbo
```
cd c:\Users\Hashvanth\Puma-X\puma-backend && npx tsc --noEmit 2>&1
```

- **Pass**: Zero TypeScript errors
- **Fail**: Any type error blocks the commit
- **Note**: `noUnusedLocals` and `noUnusedParameters` are enforced (tsconfig has these enabled)

### 4. Gate 3: Architecture Conformance

Run the architecture guard checks (from `/puma-architecture-guard`):

For each changed `.ts`/`.tsx` file, verify:
- File is in the correct directory per architecture rules
- No forbidden import patterns (screen-to-screen, component-to-store direct)
- Import depth doesn't exceed 2 relative levels
- Naming follows conventions

- **Pass**: No architecture violations
- **Fail**: Any forbidden import or misplaced file blocks the commit

### 5. Gate 4: Dead Code Quick Check

For each changed file only (not full codebase):
- Check for unused imports in the changed files
- Check for unused variables
- Check for `console.log` statements (must be removed before commit)
- Check for commented-out code blocks (>3 lines)
- Check for `TODO`/`FIXME` without tracking reference

- **Pass**: No dead code in changed files
- **Fail**: Unused imports or console.log block the commit
- **Warn**: TODOs are warnings, not blockers

### 6. Gate 5: Build Verification

// turbo
```
cd c:\Users\Hashvanth\Puma-X\puma-frontend && npm run build 2>&1
```

- **Pass**: Build completes without errors
- **Fail**: Build failure blocks the commit
- This catches issues that ESLint/TSC may miss (Vite-specific build errors)

### 7. Gate 6: Code Review (Changed Files Only)

For each changed `.ts`/`.tsx` file, perform a quick review:

**Critical checks (blockers):**
- No `any` types introduced
- No `as` casts without justification comment
- No inline styles (`style={{}}`)
- No missing TypeScript return types on exported functions
- No `eslint-disable` without inline justification
- No hardcoded secrets or API keys

**Warning checks (noted but don't block):**
- Missing JSDoc on exported functions
- Components without `React.memo` that receive object props
- Missing error boundaries on async operations

### 8. Generate Gate Results

```
═══════════════════════════════════════════
  PUMA-X Pre-Commit Quality Gate
═══════════════════════════════════════════
  Date: {timestamp}
  Changed Files: {N}

  ─── Gate Results ───

  Gate 1 — ESLint:         ✅ PASS | ❌ FAIL ({N} errors)
  Gate 2 — TypeScript:     ✅ PASS | ❌ FAIL ({N} errors)
  Gate 3 — Architecture:   ✅ PASS | ❌ FAIL ({N} violations)
  Gate 4 — Dead Code:      ✅ PASS | ❌ FAIL ({N} issues)
  Gate 5 — Build:          ✅ PASS | ❌ FAIL
  Gate 6 — Code Review:    ✅ PASS | ⚠️ WARNINGS ({N})

  ─── Overall Verdict ───

  ✅ ALL GATES PASSED — Safe to commit!

  OR

  ❌ COMMIT BLOCKED — {N} gate(s) failed

  Fix these issues before committing:
  1. [Gate {N}] {specific issue and fix}
  2. [Gate {N}] {specific issue and fix}
  ...

  ⚠️ Warnings (non-blocking):
  1. [Gate {N}] {warning description}
  ...

═══════════════════════════════════════════
```

### 9. On All Gates Passed

If all gates pass, suggest a commit message:

```
Suggested commit message:
──────────────────────────
{type}({scope}): {description}

Types: feat | fix | refactor | style | docs | chore
Scope: scan | questionnaire | match | compare | ecosystem | foundation | backend

Example: feat(questionnaire): implement climate selection cards with animated transitions
```

### 10. On Gate Failure

For each failed gate:
1. Show the exact error(s)
2. Provide specific fix instructions
3. Offer to auto-fix where possible
4. After fixes, re-run only the failed gates

## Gate Severity

| Gate | Severity | Can Auto-Fix? |
|------|----------|---------------|
| ESLint | 🔴 Blocker | Yes (--fix) |
| TypeScript | 🔴 Blocker | Partial (unused imports) |
| Architecture | 🔴 Blocker | No (needs restructuring) |
| Dead Code | 🟡 Mixed | Yes (imports, console.log) |
| Build | 🔴 Blocker | No (needs code fix) |
| Code Review | 🟡 Warnings | Partial |

## Rules

- **ALL gates must pass** for a clean commit verdict
- **Never skip gates** — run all 6 even if early ones fail (user needs full picture)
- **Auto-fix first, then report** — fix what can be fixed, then report what remains
- **Be fast** — prioritize speed; full review is for `/puma-code-review`, this is a quick gate
- **Suggest commit message** — following conventional commits format
- **Track gate history** — if the same gate fails repeatedly, note it as a pattern
