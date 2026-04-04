---
description: Scaffold a new reusable component with TypeScript types, Framer Motion, Tailwind, and barrel export registration
---

# /puma-new-component — Scaffold a New Component

Generate a new reusable component following PUMA Reality Match Engine conventions. Every component gets proper TypeScript types, Framer Motion integration, Tailwind styling, JSDoc, and automatic barrel export registration.

## Arguments

The user must provide:
- **Component name** (PascalCase): e.g., "ShoeCard", "AnimatedBadge", "ProgressRing"

Optional:
- **Description**: What the component does
- **Props**: Key props it should accept

## Steps

### 1. Validate the Name

- Must be PascalCase (e.g., `ShoeCard`, not `shoeCard` or `shoe-card`)
- Must not conflict with existing components in `src/components/`
- Must not be a reserved React name (`Component`, `Fragment`, `Suspense`, etc.)

If invalid, suggest a corrected name.

### 2. Create the Component File

Create `c:\Users\Hashvanth\Puma-X\puma-frontend\src\components\{ComponentName}.tsx`:

```tsx
import { motion } from 'framer-motion';

/**
 * {ComponentDescription}
 *
 * @example
 * <{ComponentName} {exampleProps} />
 */

interface {ComponentName}Props {
  /** Brief description of each prop */
  // ... props based on user description or sensible defaults
  className?: string;
}

const variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export function {ComponentName}({ className = '', ...props }: {ComponentName}Props) {
  return (
    <motion.div
      className={`{tailwind-classes} ${className}`}
      variants={variants}
      initial="hidden"
      animate="visible"
    >
      {/* Component content */}
    </motion.div>
  );
}
```

### 3. Register in Barrel Export

Open `c:\Users\Hashvanth\Puma-X\puma-frontend\src\components\index.ts` and add:

```ts
export { {ComponentName} } from './{ComponentName}';
```

Maintain alphabetical order in the barrel file.

### 4. Lint the New File

// turbo
Run lint on the new component:

```
cd c:\Users\Hashvanth\Puma-X\puma-frontend && npx eslint src/components/{ComponentName}.tsx --fix
```

### 5. TypeScript Check

// turbo
```
cd c:\Users\Hashvanth\Puma-X\puma-frontend && npx tsc --noEmit 2>&1
```

### 6. Confirmation

Report what was created:

```
✅ Created: src/components/{ComponentName}.tsx
✅ Registered in: src/components/index.ts
✅ Lint: Clean
✅ TypeScript: Clean

Usage:
  import { {ComponentName} } from '@/components';
```

## Template Rules

- **Always include `className` prop** — allows style overrides from parent
- **Always define animation variants outside the component** — prevents recreation on re-render
- **Always use named export** (not default) — matches project convention for components
- **Always include JSDoc** with `@example` — helps other developers understand usage
- **Use Tailwind design tokens** — `bg-bg-primary`, `text-text-primary`, `rounded-xl`, etc.
- **Use Framer Motion `motion.div`** — every component should animate on mount
- **Keep the component focused** — one responsibility, under 100 lines
