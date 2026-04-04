---
description: AI code review on changed files — checks React patterns, TypeScript strictness, Framer Motion usage, Zustand patterns, accessibility, and performance
---

# /puma-code-review — AI Code Review

Perform a thorough code review of recently changed files, checking against PUMA Reality Match Engine conventions, React best practices, and clean code principles.

## Steps

### 1. Identify Changed Files

Determine what to review based on context:

- If the user specifies a file → review that file
- If there are staged changes → run `git diff --cached --name-only` in `c:\Users\Hashvanth\Puma-X`
- Otherwise → run `git diff --name-only HEAD~1` in `c:\Users\Hashvanth\Puma-X`

Filter to only `.ts`, `.tsx`, `.css` files. Exclude `node_modules`, `dist`, `.planning`.

### 2. Read Each Changed File

For each file, read the full contents. Also read the git diff to understand what specifically changed:

```
cd c:\Users\Hashvanth\Puma-X && git diff HEAD~1 -- {filepath}
```

### 3. Review Against Checklist

For each file, evaluate against ALL of the following categories:

#### 3a. Naming Conventions
- ✅ Components: `PascalCase` (e.g., `MetricCard`, `FootScanOverlay`)
- ✅ Hooks: `useCamelCase` (e.g., `useScanState`, `useFootProfile`)
- ✅ Utilities: `camelCase` (e.g., `calculateArchType`, `formatMetric`)
- ✅ Constants: `UPPER_SNAKE_CASE` (e.g., `SCAN_DURATION_MS`, `MAX_RETRIES`)
- ✅ Types/Interfaces: `PascalCase` with descriptive names (e.g., `FootProfile`, `ScanState`)
- ✅ Files: Match their primary export name
- ❌ Flag: Single-letter variables (except `i`, `j` in loops), unclear abbreviations

#### 3b. React Patterns
- ✅ Named exports for components (except screens which use default for lazy loading)
- ✅ Props interface defined above component (`{ComponentName}Props`)
- ✅ Destructured props in function signature
- ✅ `React.memo()` on components receiving object/array props from parent
- ✅ `useCallback` for event handlers passed as props
- ✅ `useMemo` for expensive computations
- ✅ Error boundaries around screen-level components
- ❌ Flag: Inline styles (use Tailwind classes or design tokens)
- ❌ Flag: Direct DOM manipulation (use refs properly)
- ❌ Flag: State updates in render body (use useEffect)
- ❌ Flag: Missing dependency arrays in useEffect/useMemo/useCallback

#### 3c. TypeScript Strictness
- ✅ Every function has explicit return type
- ✅ Every prop interface is fully typed
- ✅ Union types preferred over enums for string literals
- ✅ `readonly` on props and state that shouldn't mutate
- ✅ Discriminated unions for state machines (e.g., scan state)
- ❌ Flag: `any` type (suggest `unknown` + type guard)
- ❌ Flag: `as` type assertion without comment explaining why
- ❌ Flag: Non-null assertion `!` without safety check
- ❌ Flag: Implicit `any` from untyped function parameters

#### 3d. Framer Motion
- ✅ Animation variants defined as constants OUTSIDE the component
- ✅ `layoutId` for shared layout animations between screens
- ✅ `AnimatePresence` wrapping conditional renders
- ✅ `motion.div` with proper `initial`, `animate`, `exit` props
- ✅ Spring physics for natural feel (not linear easing)
- ✅ Staggered children animations use `staggerChildren` in parent variant
- ❌ Flag: Hardcoded duration values (use design system animation tokens)
- ❌ Flag: `animate` prop with inline object (extract to variant)

#### 3e. Zustand Store Patterns
- ✅ Store selectors use shallow comparison for object selections
- ✅ Actions are defined inside store (not outside)
- ✅ Each store has a `reset()` action for demo flow
- ✅ Store slices are properly typed with state + actions
- ✅ Derived state computed in selectors, not stored
- ❌ Flag: Entire store selected (`useStore()` without selector)
- ❌ Flag: Store access in render body without selector
- ❌ Flag: Mutable state updates (must use immer or return new objects)

#### 3f. Tailwind & Styling
- ✅ Consistent use of design system colors (e.g., `bg-bg-primary`, `text-accent`)
- ✅ Responsive classes present for key breakpoints (mobile-first)
- ✅ No raw hex colors — use Tailwind theme extensions
- ✅ Consistent spacing rhythm (multiples of 4px / Tailwind scale)
- ❌ Flag: Inline `style={{}}` (use Tailwind or CSS modules)
- ❌ Flag: Raw pixel values in Tailwind (use theme values)
- ❌ Flag: Long class strings (>8 classes) without extraction

#### 3g. Performance
- ✅ Screens use lazy loading (`React.lazy`)
- ✅ Images have explicit `width`/`height` or `aspect-ratio`
- ✅ Heavy computations wrapped in `useMemo`
- ✅ Event handlers stable across renders (`useCallback`)
- ✅ Lists use stable `key` props (not array index unless static)
- ❌ Flag: Unbounded `useEffect` without cleanup
- ❌ Flag: Creating objects/arrays in render (causes child re-renders)
- ❌ Flag: Missing `Suspense` boundaries

#### 3h. Accessibility
- ✅ Interactive elements have visible focus states
- ✅ Buttons have descriptive text or `aria-label`
- ✅ Form inputs have associated labels
- ✅ Color contrast meets WCAG AA (4.5:1 for text)
- ✅ Semantic HTML (`<nav>`, `<main>`, `<section>`, `<article>`)
- ✅ Keyboard navigation works (tab order, Enter/Space activation)
- ❌ Flag: `div` with `onClick` (use `button`)
- ❌ Flag: Missing `alt` text on images
- ❌ Flag: Focus trap not implemented in modals

#### 3i. Clean Code Principles
- ✅ Functions do one thing (single responsibility)
- ✅ Max function length ~30 lines (extract helpers)
- ✅ Max component length ~150 lines (extract sub-components)
- ✅ No magic numbers — extract to named constants
- ✅ Early returns over nested conditionals
- ✅ Descriptive variable names (not `data`, `info`, `item`, `temp`)
- ✅ JSDoc on all exported functions and complex internal ones
- ❌ Flag: Commented-out code (delete it, git has history)
- ❌ Flag: Console.log left in code (use proper logging or remove)
- ❌ Flag: TODO/FIXME without associated issue/tracking

### 4. Generate Review Report

For each file, output a structured review:

```
═══════════════════════════════════════════
  Code Review: {filename}
═══════════════════════════════════════════

  🔴 CRITICAL (must fix before merge)
  ──────────────────────────────────
  Line {N}: {issue description}
  → Fix: {specific fix suggestion}

  🟡 WARNING (should fix)
  ──────────────────────────────────
  Line {N}: {issue description}
  → Fix: {specific fix suggestion}

  🔵 SUGGESTION (nice to have)
  ──────────────────────────────────
  Line {N}: {issue description}
  → Consider: {improvement suggestion}

  ✅ GOOD PATTERNS (keep doing this)
  ──────────────────────────────────
  - {positive observation}
  - {positive observation}

═══════════════════════════════════════════
```

### 5. Overall Summary

After all files reviewed:

```
  Review Summary
  ──────────────
  Files reviewed: {N}
  🔴 Critical:    {N}
  🟡 Warnings:    {N}
  🔵 Suggestions: {N}

  Verdict: ✅ APPROVE | ⚠️ APPROVE WITH CHANGES | ❌ REQUEST CHANGES
```

### 6. Offer Auto-Fixes

For warnings and suggestions that have clear fixes:
- List each fixable issue
- Ask user for approval
- Apply fixes and re-verify

## Rules

- **Be specific**: Every issue must reference a line number and include a concrete fix
- **Be balanced**: Always highlight good patterns, not just problems
- **Prioritize**: Critical issues are blockers; warnings are important; suggestions are optional
- **Context-aware**: Consider the file's role (component vs screen vs store vs hook) when judging
- **No nitpicking**: Don't flag stylistic preferences that are consistent within the codebase
