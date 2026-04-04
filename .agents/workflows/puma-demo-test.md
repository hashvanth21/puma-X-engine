---
description: Walk through all 6 demo screens in the browser, verifying renders, animations, state persistence, and zero console errors
---

# /puma-demo-test — End-to-End Demo Flow Test

Walk through the complete PUMA Reality Match Engine demo flow in the browser — all 6 screens — verifying that everything renders correctly, animations play smoothly, state persists across screens, and there are zero console errors.

## Prerequisites

The dev server must be running. If not:

```
cd c:\Users\Hashvanth\Puma-X\puma-frontend && npm run dev
```

Note the dev server URL (typically `http://localhost:5173`).

## Steps

### 1. Start the Dev Server

// turbo
Check if the dev server is already running:

```
cd c:\Users\Hashvanth\Puma-X\puma-frontend && npm run dev
```

Wait for the "ready" message. Note the URL.

### 2. Screen 1: "Your Current Problem"

Open the browser to the dev server URL (`http://localhost:5173`).

**Verify:**
- [ ] Page loads without console errors
- [ ] Hero section is visible with heading and subtext
- [ ] Generic shoe grid is displayed
- [ ] CTA button ("Experience Reality Match" or similar) is present and clickable
- [ ] Animations play on entry (fade in, slide up, stagger)
- [ ] NavBar is visible with PUMA branding
- [ ] Layout looks correct (no overflow, no broken alignment)

**Capture:** Screenshot at 1440px desktop width.

### 3. Screen 2: Foot Scan

Click the CTA to navigate to `/scan`.

**Verify:**
- [ ] Page transition animation plays (slide out/in)
- [ ] Camera/scan interface appears (simulated or real)
- [ ] Animated foot outline guide is visible
- [ ] NavBar shows "Step 1/5" or equivalent progress
- [ ] "Start Scan" or auto-scan initiates
- [ ] Scan progress animation plays
- [ ] Scan completes with result reveal animation
- [ ] Foot profile data displayed: width, arch, pronation, size
- [ ] "Continue" button appears after scan completes
- [ ] No console errors throughout scan flow

**Check state:** Verify `footProfile` is populated in Zustand (check via React DevTools if possible, or observe displayed values).

**Capture:** Screenshot of scan result.

### 4. Screen 3: Context Questionnaire

Navigate to `/questions`.

**Verify for EACH of the 5 steps:**

**Step 1 — Use Case:**
- [ ] Visual cards with icons are displayed
- [ ] Cards are selectable (click highlights)
- [ ] Progress indicator shows "1/5"

**Step 2 — Daily Hours:**
- [ ] Time picker or selection is present
- [ ] Selection works

**Step 3 — Activity Type:**
- [ ] Activity cards displayed
- [ ] Selection works

**Step 4 — Climate:**
- [ ] Climate options displayed
- [ ] Selection works

**Step 5 — Comfort vs Performance:**
- [ ] Interactive slider is present
- [ ] Slider moves and updates value

**Across all steps:**
- [ ] Smooth Framer Motion transitions between steps
- [ ] "Back" button works without losing previous answers
- [ ] Progress indicator updates correctly
- [ ] Final "Submit" or "Continue" navigates forward

**Check state:** Verify `questionnaire` state has all 5 answers.

### 5. Screen 4: Match Result

Navigate to `/match`.

**Verify:**
- [ ] Hero match card appears with shoe image
- [ ] Match percentage is displayed (e.g., "94% Match")
- [ ] 3+ match reasons listed (e.g., "ideal for wide feet", "high arch support")
- [ ] "Why not others" section lists 2+ eliminated shoes with reasons
- [ ] Animations: staggered reveal, percentage counter, card entrance
- [ ] "Compare" or "View Comparison" CTA present

**Capture:** Screenshot of match result.

### 6. Screen 5: Comparison

Navigate to `/compare`.

**Verify:**
- [ ] Side-by-side comparison table is visible
- [ ] At least 2 shoes compared (primary + alternate)
- [ ] Attribute scores shown with visual bars/indicators
- [ ] Winner highlighted for each attribute
- [ ] Icons and visual differentiators present
- [ ] Layout is readable and not cramped

**Capture:** Screenshot of comparison.

### 7. Screen 6: Ecosystem Vision

Navigate to `/ecosystem`.

**Verify:**
- [ ] Ecosystem vision screen loads
- [ ] 4 expansion areas displayed (apparel, training, replacement, loyalty)
- [ ] Animated reveal on entry
- [ ] "Reset Demo" button present and works
- [ ] Clicking reset returns to Screen 1 with clean state

### 8. Cross-Cutting Checks

**After full flow:**
- [ ] **Zero console errors** throughout all 6 screens
- [ ] **Zero console warnings** (except known React dev warnings)
- [ ] **No layout breaks** — no horizontal scroll, no overflow
- [ ] **State resets cleanly** — after reset, Screen 2 shows fresh scan (not cached results)
- [ ] **Back navigation works** — browser back button goes to previous screen
- [ ] **Deep linking works** — refresh on any screen reloads correctly

### 9. Mobile Viewport Test

Resize browser to 390px width and repeat core checks:
- [ ] Screen 1 renders without horizontal overflow
- [ ] Screen 2 scan UI adapts to narrow viewport
- [ ] Screen 3 cards stack vertically
- [ ] Screen 4 match card is readable
- [ ] Screen 5 comparison adapts (stacked or scrollable)
- [ ] Screen 6 cards stack properly

**Capture:** Mobile screenshots.

### 10. Generate Test Report

```
═══════════════════════════════════════════
  PUMA-X Demo Test Report
═══════════════════════════════════════════
  Date: {timestamp}
  Environment: Dev (Vite)
  Browser: Chrome

  ─── Results ───

  Screen 1 (Problem):      ✅ Pass | ❌ Fail ({issues})
  Screen 2 (Foot Scan):    ✅ Pass | ❌ Fail ({issues})
  Screen 3 (Questions):    ✅ Pass | ❌ Fail ({issues})
  Screen 4 (Match Result): ✅ Pass | ❌ Fail ({issues})
  Screen 5 (Comparison):   ✅ Pass | ❌ Fail ({issues})
  Screen 6 (Ecosystem):    ✅ Pass | ❌ Fail ({issues})

  ─── Cross-Cutting ───

  Console Errors:    {N} (❌ if > 0)
  Layout Breaks:     {N} (❌ if > 0)
  State Persistence: ✅ | ❌
  Mobile Responsive: ✅ | ❌
  Demo Reset:        ✅ | ❌

  ─── Issues Found ───

  1. [Screen {N}] {issue description}
  2. [Screen {N}] {issue description}
  ...

  Overall: ✅ DEMO READY | ❌ {N} issues to fix
═══════════════════════════════════════════
```

## Rules

- **Test the REAL app** — use the browser to navigate, don't just read code
- **Check console** — open DevTools console and monitor for errors
- **Be thorough** — click every interactive element, try every flow path
- **Test reset** — the demo must reset cleanly (PUMA stakeholders will demo repeatedly)
- **Report with evidence** — include screenshots for every screen tested
- **Don't skip screens** — even placeholder screens should render without errors
- **Test the transition** — the ANIMATION between screens is part of the demo quality
