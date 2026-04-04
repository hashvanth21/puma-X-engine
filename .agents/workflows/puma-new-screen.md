---
description: Scaffold a new screen with routing, lazy loading, Framer Motion page transitions, Zustand store connections, and proper folder structure
---

# /puma-new-screen — Scaffold a New Screen

Generate a new screen/page following the `Screen{N}{Name}` convention with proper routing integration, lazy loading, Framer Motion page transitions, and Zustand store connections.

## Arguments

The user must provide:
- **Screen number** (integer): e.g., 7
- **Screen name** (PascalCase): e.g., "Settings", "Profile"

Optional:
- **Route path**: e.g., "/settings" (defaults to `/{lowercase-name}`)
- **Description**: What the screen shows
- **Store connections**: Which stores it reads from

## Steps

### 1. Validate

- Screen number must not conflict with existing screens (1–6 are taken)
- Name must be PascalCase
- Route path must not conflict with existing routes in `App.tsx`
- Check: folder `src/screens/Screen{N}{Name}/` must not already exist

### 2. Create Screen Folder Structure

Create the following in `c:\Users\Hashvanth\Puma-X\puma-frontend\src\screens\Screen{N}{Name}\`:

#### 2a. Main Screen File: `Screen{N}{Name}.tsx`

```tsx
import { motion } from 'framer-motion';
import { PageWrapper } from '@/components';

/**
 * Screen {N}: {ScreenDescription}
 *
 * Route: /{route-path}
 */

const pageVariants = {
  initial: { opacity: 0, x: 30 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    x: -30,
    transition: { duration: 0.3 },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

function Screen{N}{Name}() {
  return (
    <PageWrapper>
      <motion.div
        className="min-h-screen pt-20 px-6 pb-12"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            {Screen Title}
          </h1>
          <p className="text-text-secondary text-lg">
            {Screen description}
          </p>
        </motion.div>

        {/* Screen content goes here */}

      </motion.div>
    </PageWrapper>
  );
}

export default Screen{N}{Name};
```

#### 2b. Barrel File: `index.ts`

```ts
export { default } from './Screen{N}{Name}';
```

### 3. Update App.tsx

Add the screen to the app routing:

#### 3a. Add Lazy Import

After the existing lazy imports in `App.tsx`, add:

```tsx
const Screen{N}{Name} = lazy(() => import('@/screens/Screen{N}{Name}/Screen{N}{Name}'));
```

#### 3b. Add Route

Inside the `<Routes>` block, add:

```tsx
<Route path="/{route-path}" element={<Screen{N}{Name} />} />
```

#### 3c. Update Screen-to-Step Mapping

If this screen is part of the main demo flow, add to `screenToStep`:

```tsx
'/{route-path}': {step-number},
```

And update `totalSteps` if needed.

### 4. Lint All Modified Files

// turbo
```
cd c:\Users\Hashvanth\Puma-X\puma-frontend && npx eslint src/screens/Screen{N}{Name}/ src/App.tsx --fix
```

### 5. TypeScript Check

// turbo
```
cd c:\Users\Hashvanth\Puma-X\puma-frontend && npx tsc --noEmit 2>&1
```

### 6. Confirmation

```
✅ Created: src/screens/Screen{N}{Name}/Screen{N}{Name}.tsx
✅ Created: src/screens/Screen{N}{Name}/index.ts
✅ Updated: src/App.tsx (lazy import + route)
✅ Lint: Clean
✅ TypeScript: Clean

Route: /{route-path}
Import: const Screen{N}{Name} = lazy(() => import('@/screens/Screen{N}{Name}/Screen{N}{Name}'));
```

## Template Rules

- **Always use default export** — required for `React.lazy()` code splitting
- **Always wrap in `PageWrapper`** — consistent page padding/layout
- **Always include page transition variants** — smooth entry/exit animations
- **Always include `exit` variant** — required for `AnimatePresence` in App.tsx
- **Use `staggerChildren`** — content reveals progressively, not all at once
- **Keep screen focused on layout** — extract reusable pieces to `components/`
- **Connect to stores via selectors** — use `useAppStore(state => state.specificValue)`
- **Each screen gets its own folder** — allows screen-specific sub-components later
