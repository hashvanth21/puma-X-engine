---
description: Scaffold a new Zustand store with TypeScript interfaces, selectors, reset action, and barrel export registration
---

# /puma-new-store — Scaffold a Zustand Store

Create a new Zustand store following PUMA Reality Match Engine conventions. Stores are the single source of truth for each domain (foot profile, questionnaire, recommendations, etc.).

## Arguments

The user must provide:
- **Domain name** (camelCase): e.g., "shoeDatabase", "comparison", "demoMode"

Optional:
- **State fields**: Key state properties and their types
- **Actions**: Key actions the store should support

## Steps

### 1. Validate

- Domain name must be camelCase
- File `src/stores/{domain}Store.ts` must not already exist
- Domain must not conflict with existing stores (`footProfile`, `questionnaire`, `recommendation`)

### 2. Read Existing Store Pattern

Read `c:\Users\Hashvanth\Puma-X\puma-frontend\src\stores\index.ts` to understand the current combined store pattern and ensure the new store integrates correctly.

### 3. Create the Store File

Create `c:\Users\Hashvanth\Puma-X\puma-frontend\src\stores\{domain}Store.ts`:

```typescript
import { StateCreator } from 'zustand';

// ─── State ────────────────────────────────────────────────────

export interface {Domain}State {
  /** Description of field */
  fieldName: FieldType;
  // ... more state fields
}

// ─── Actions ──────────────────────────────────────────────────

export interface {Domain}Actions {
  /** Set a specific field */
  setFieldName: (value: FieldType) => void;
  /** Reset this slice to initial state */
  reset{Domain}: () => void;
  // ... more actions
}

// ─── Slice ────────────────────────────────────────────────────

export type {Domain}Slice = {Domain}State & {Domain}Actions;

const initial{Domain}State: {Domain}State = {
  fieldName: defaultValue,
  // ... initial values
};

export const create{Domain}Slice: StateCreator<
  {Domain}Slice,
  [],
  [],
  {Domain}Slice
> = (set) => ({
  ...initial{Domain}State,

  setFieldName: (value) =>
    set({ fieldName: value }),

  reset{Domain}: () =>
    set(initial{Domain}State),
});
```

### 4. Register in Combined Store

Open `c:\Users\Hashvanth\Puma-X\puma-frontend\src\stores\index.ts` and:

1. Import the new slice creator and its types
2. Add to the combined store type
3. Add to the `create()` call
4. Add the reset call to `resetAll()`
5. Export individual selector hooks

#### Example additions:

```typescript
// Add import
import { create{Domain}Slice, type {Domain}Slice } from './{domain}Store';

// Add to combined type
type AppState = FootProfileSlice & QuestionnaireSlice & RecommendationSlice & {Domain}Slice;

// Add to create()
export const useAppStore = create<AppState>()((...a) => ({
  ...createFootProfileSlice(...a),
  ...createQuestionnaireSlice(...a),
  ...createRecommendationSlice(...a),
  ...create{Domain}Slice(...a),
}));

// Add to resetAll
resetAll: () => {
  get().resetFootProfile();
  get().resetQuestionnaire();
  get().resetRecommendation();
  get().reset{Domain}();
},

// Add selector exports
export const use{Domain} = () => useAppStore((state) => ({
  fieldName: state.fieldName,
  // ... select specific fields
}));
```

### 5. Export Types

Ensure the store's types are accessible:

```typescript
export type { {Domain}State, {Domain}Actions } from './{domain}Store';
```

### 6. Lint Check

// turbo
```
cd c:\Users\Hashvanth\Puma-X\puma-frontend && npx eslint src/stores/ --fix
```

### 7. TypeScript Check

// turbo
```
cd c:\Users\Hashvanth\Puma-X\puma-frontend && npx tsc --noEmit 2>&1
```

### 8. Confirmation

```
✅ Created: src/stores/{domain}Store.ts
✅ Registered in: src/stores/index.ts
✅ Combined type updated: AppState
✅ Reset integrated: resetAll() calls reset{Domain}()
✅ Selector exported: use{Domain}()
✅ Lint: Clean
✅ TypeScript: Clean

Usage:
  // Full selector
  const { fieldName } = use{Domain}();

  // Individual field
  const fieldName = useAppStore(state => state.fieldName);

  // Action
  const setFieldName = useAppStore(state => state.setFieldName);
```

## Template Rules

- **Always separate State and Actions interfaces** — clear contract
- **Always define `initialState` as a constant** — enables clean reset
- **Always include a `reset` action** — required for demo flow reset
- **Always use `StateCreator` typing** — ensures type safety with slices
- **Never store derived data** — compute it in selectors
- **Keep stores flat** — prefer `{ width: 'wide', arch: 'high' }` over nested `{ foot: { width: 'wide' } }`
- **Use descriptive action names** — `setFootWidth` not `set1` or `update`
- **Selectors should use shallow comparison** — prevents unnecessary re-renders
