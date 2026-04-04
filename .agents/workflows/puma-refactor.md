---
description: Analyze a file or component and suggest/execute refactoring improvements while preserving behavior — extract components, hooks, constants, and simplify logic
---

# /puma-refactor — Guided Refactoring Assistant

Analyze a target file and identify refactoring opportunities. Suggest specific improvements, preview before/after, and execute approved changes while preserving all existing behavior.

## Arguments

The user must provide:
- **Target file path**: Relative or absolute path to the file to refactor

Optional:
- **Focus area**: "extract components", "simplify logic", "improve types", "performance", or "all"

## Steps

### 1. Read and Analyze the Target File

Read the full file contents. Measure:
- Total lines of code
- Number of functions/components
- Import count
- Cyclomatic complexity (rough estimate based on conditionals)
- Nesting depth (max indentation level)

### 2. Identify Refactoring Opportunities

Check for each category of improvement:

#### 2a. Component Extraction (for `.tsx` files)
- **Repeated JSX patterns** (3+ similar blocks) → extract to shared component
- **Large render blocks** (>50 lines in return statement) → extract sub-components
- **Conditional render sections** (>15 lines) → extract to named sub-component
- **List item rendering** → extract to dedicated item component

#### 2b. Hook Extraction
- **Complex state logic** (3+ `useState` in one component) → extract to custom hook
- **Side effect logic** (`useEffect` with >10 lines) → extract to custom hook
- **Reused stateful logic** (same pattern in 2+ components) → extract to shared hook
- **State machine patterns** (multiple related states) → extract to state machine hook

#### 2c. Constant Extraction
- **Magic numbers** → extract to named constant with JSDoc
- **Magic strings** → extract to string constant or enum-like union
- **Repeated style strings** → extract to Tailwind class composition
- **Animation configs** → extract to design system animation tokens
- **Color/spacing values** → should reference design tokens

#### 2d. Logic Simplification
- **Deeply nested conditionals** (3+ levels) → flatten with early returns
- **Long conditional chains** (if/else if/else if) → use object lookup map
- **Complex ternaries** → extract to helper function with descriptive name
- **Repeated null checks** → use optional chaining or early return guard

#### 2e. Type Improvements
- **`any` types** → replace with proper types or `unknown` + type guard
- **Inline object types** → extract to named interface
- **Repeated union types** → extract to type alias
- **Missing return types** → add explicit return types to functions
- **Non-discriminated unions** → add discriminant field for state machines

#### 2f. Performance Improvements
- **Unstable object/array creation in render** → wrap in `useMemo`
- **Inline callback props** → wrap in `useCallback`
- **Missing memo on expensive components** → add `React.memo`
- **Expensive computations in render** → move to `useMemo`
- **Redundant re-renders** → optimize store selectors

### 3. Create Refactoring Plan

Present findings in a structured format:

```
═══════════════════════════════════════════
  Refactoring Analysis: {filename}
═══════════════════════════════════════════

  File Stats:
  ───────────
  Lines: {N}     Functions: {N}     Imports: {N}
  Complexity: {low/medium/high}     Score: {N}/10

  ─── Refactoring Opportunities ───

  1. 🔧 EXTRACT COMPONENT: Lines {N}-{N}
     What: {description of repeated/large JSX block}
     Into: src/components/{NewComponent}.tsx
     Impact: Reduces file by ~{N} lines, improves reusability

  2. 🔧 EXTRACT HOOK: Lines {N}-{N}
     What: {description of complex state logic}
     Into: src/hooks/use{HookName}.ts
     Impact: Separates concerns, testable independently

  3. 🔧 SIMPLIFY: Lines {N}-{N}
     What: {nested conditional → early return}
     Before:
       if (a) {
         if (b) {
           if (c) { ... }
         }
       }
     After:
       if (!a) return;
       if (!b) return;
       if (!c) return;
       ...

  4. 🔧 CONSTANT: Lines {N}-{N}
     What: Magic number {value} used {N} times
     Into: const {CONSTANT_NAME} = {value}; // {explanation}

  Total opportunities: {N}
  Estimated line reduction: ~{N} lines ({N}%)

═══════════════════════════════════════════
```

### 4. Get User Approval

Present the plan and ask:
- "Apply all refactorings? (y/n)"
- "Or select specific ones: 1, 3, 4"

### 5. Execute Refactorings

For each approved refactoring:

1. **Create new files** if extracting (components, hooks)
2. **Modify the original file** to use the extracted pieces
3. **Update imports** in the original file
4. **Register new components** in barrel exports
5. **Verify behavior preserved** — run TypeScript check after each change

### 6. Post-Refactoring Verification

// turbo
```
cd c:\Users\Hashvanth\Puma-X\puma-frontend && npx tsc --noEmit 2>&1
```

// turbo
```
cd c:\Users\Hashvanth\Puma-X\puma-frontend && npx eslint {modified-files} --fix
```

### 7. Final Report

```
  Refactoring Complete
  ────────────────────
  Refactorings applied: {N}/{N}
  Files modified: {list}
  Files created: {list}
  Lines before: {N}
  Lines after: {N}
  Reduction: {N} lines ({N}%)
  TypeScript: ✅ Clean
  ESLint: ✅ Clean
```

## Rules

- **NEVER change behavior** — refactoring preserves existing functionality exactly
- **One refactoring at a time** — apply, verify, then next. Never batch without checking
- **Verify after each change** — run TypeScript check after every refactoring
- **Keep related code together** — don't over-extract; code that changes together stays together
- **Respect the mental model** — don't create abstractions that make code harder to understand
- **Name things well** — extracted pieces must have descriptive, self-documenting names
- **Don't refactor tests** — if tests exist, they should still pass unchanged after refactoring
- **Ask when uncertain** — if a refactoring might change behavior, ask the user first
