---
description: Build production bundles for frontend and backend, analyze bundle size, verify code splitting, and run Lighthouse performance audit
---

# /puma-build — Production Build & Validation

Build production-ready bundles for both frontend and backend, analyze output quality, verify code splitting, and run performance audits. Ensures the demo is fast and deployable.

## Steps

### 1. Frontend Production Build

// turbo
Run the production build:

```
cd c:\Users\Hashvanth\Puma-X\puma-frontend && npm run build 2>&1
```

**Check:**
- Build completes without errors
- No TypeScript errors (build includes `tsc -b`)
- No warnings (treat warnings as errors for demo)

If build fails, stop and report the errors with specific fix suggestions.

### 2. Backend Production Build

// turbo
```
cd c:\Users\Hashvanth\Puma-X\puma-backend && npm run build 2>&1
```

**Check:**
- Compiles without errors
- Output in `dist/` directory

### 3. Analyze Frontend Bundle

After successful frontend build, analyze the output in `puma-frontend/dist/`:

// turbo
```
cd c:\Users\Hashvanth\Puma-X\puma-frontend && Get-ChildItem -Path dist/assets -Recurse | ForEach-Object { [PSCustomObject]@{ Name=$_.Name; SizeKB=[math]::Round($_.Length/1024, 1) } } | Sort-Object SizeKB -Descending | Format-Table -AutoSize
```

**Targets:**
- Total JS bundle: < 500KB gzipped (< 1.5MB uncompressed)
- Total CSS: < 50KB
- Largest single chunk: < 200KB uncompressed
- No single vendor chunk > 300KB

**Check code splitting:**
- Each lazy-loaded screen should produce its own chunk
- Expected chunks: main + vendor + 6 screen chunks
- Three.js/R3F should be in a separate vendor chunk

### 4. Check for Bundling Issues

Scan the build output for common problems:

- **Source maps in production**: `dist/` should NOT contain `.map` files (unless intentional)
- **Dev-only code**: Search for `console.log`, `debugger` statements in built JS
- **Environment variables**: Ensure no `.env` secrets are bundled into frontend code
- **Large assets**: Images > 500KB should be optimized

// turbo
```
cd c:\Users\Hashvanth\Puma-X\puma-frontend && Select-String -Path "dist/assets/*.js" -Pattern "console\.(log|debug|warn)" -SimpleMatch 2>&1
```

### 5. Preview Production Build

// turbo
Start the production preview server:

```
cd c:\Users\Hashvanth\Puma-X\puma-frontend && npm run preview
```

Open the browser to the preview URL (typically `http://localhost:4173`).

**Verify:**
- [ ] App loads correctly
- [ ] All screens navigate properly
- [ ] No 404 errors for assets
- [ ] Animations work in production build
- [ ] No console errors in production mode

### 6. Performance Assessment

Evaluate key performance metrics by loading the production build:

**Metrics to check:**
- **First Contentful Paint (FCP)**: Target < 1.5s
- **Largest Contentful Paint (LCP)**: Target < 2.5s
- **Total Bundle Size**: Check against targets from step 3
- **Code Splitting**: Verify only the needed screen chunk loads initially

### 7. Generate Build Report

```
═══════════════════════════════════════════
  PUMA-X Production Build Report
═══════════════════════════════════════════
  Date: {timestamp}
  
  ─── Build Status ───
  
  Frontend Build:  ✅ Success | ❌ Failed
  Backend Build:   ✅ Success | ❌ Failed
  
  ─── Bundle Analysis ───
  
  Total JS:     {size}KB (target: <500KB gzipped)  ✅|⚠️|❌
  Total CSS:    {size}KB (target: <50KB)            ✅|⚠️|❌
  Largest Chunk: {name} — {size}KB                  ✅|⚠️|❌
  
  Chunk Breakdown:
  ├── main.{hash}.js         {size}KB
  ├── vendor.{hash}.js       {size}KB
  ├── Screen1.{hash}.js      {size}KB
  ├── Screen2.{hash}.js      {size}KB
  ├── Screen3.{hash}.js      {size}KB
  ├── Screen4.{hash}.js      {size}KB
  ├── Screen5.{hash}.js      {size}KB
  └── Screen6.{hash}.js      {size}KB
  
  ─── Quality Checks ───
  
  Console.log in prod:    ✅ None | ❌ Found {N}
  Source maps:            ✅ Excluded | ⚠️ Included
  Code splitting:         ✅ {N} chunks | ❌ Single bundle
  Dev dependencies:       ✅ Excluded | ❌ Bundled
  
  ─── Performance ───
  
  Page Load:    {metric}  (target: <2s)
  Bundle Load:  {metric}  (target: <500KB)
  
  ─── Verdict ───
  
  ✅ PRODUCTION READY | ⚠️ NEEDS OPTIMIZATION | ❌ BUILD BROKEN

═══════════════════════════════════════════
```

### 8. Optimization Suggestions

If targets are exceeded, provide specific suggestions:

- **Large vendor chunk**: Consider dynamic importing Three.js only on Screen 5
- **Console.log found**: Remove all console statements before production
- **Large images**: Suggest WebP conversion or lazy loading
- **Missing code splitting**: Verify lazy() imports in App.tsx

## Rules

- **Build MUST succeed** — a failed build blocks everything
- **Zero console.log in production** — use proper logging or remove
- **Check code splitting** — lazy loading is critical for initial load performance
- **Verify in browser** — don't just check file sizes, actually load the production build
- **Don't skip backend** — even if it's minimal, it must compile cleanly
- **Report real numbers** — measure actual sizes, don't estimate
