---
description: Capture screenshots of each screen at desktop and mobile viewports, audit visual quality against Apple-level premium standard
---

# /puma-visual-check — Visual Quality Audit

Capture screenshots of every screen in the PUMA Reality Match Engine at both desktop and mobile viewports. Evaluate each screen against the "Apple-level premium" visual standard. Generate a detailed audit report with scores and specific improvement suggestions.

## Prerequisites

Dev server must be running at `http://localhost:5173` (or current port).

## Steps

### 1. Open Browser

Navigate to the dev server URL. Set viewport to desktop width (1440px × 900px).

### 2. Audit Each Screen

For EACH of the 6 screens, perform these checks at both **desktop (1440px)** and **mobile (390px)** viewports:

#### Visual Quality Criteria (Score 1-5 per item)

**A. Color & Contrast**
- [ ] Background uses design system dark palette (not pure black)
- [ ] Text has sufficient contrast ratio (WCAG AA: 4.5:1 min)
- [ ] Accent colors are consistent across elements
- [ ] No raw hex colors — all from design tokens
- [ ] Gradient usage is tasteful, not overdone
- Score: __/5

**B. Typography**
- [ ] Heading hierarchy is clear (size, weight, spacing)
- [ ] Body text is readable (16px+ on mobile, proper line-height)
- [ ] Font family matches design system (not browser default)
- [ ] No orphan words or awkward line breaks at current viewport
- [ ] Letter-spacing appropriate for headings vs body
- Score: __/5

**C. Spacing & Layout**
- [ ] Consistent spacing rhythm (4px grid / Tailwind scale)
- [ ] Content is centered and doesn't stretch too wide (max-width container)
- [ ] Cards/sections have consistent padding
- [ ] No elements touching viewport edges without padding
- [ ] Proper whitespace creating visual breathing room
- Score: __/5

**D. Animation & Motion**
- [ ] Entry animations present (not static page load)
- [ ] Staggered content reveal (not everything at once)
- [ ] Hover states on interactive elements
- [ ] Spring physics used (natural feel, not linear/mechanical)
- [ ] Page transitions smooth (no flash of blank content)
- Score: __/5

**E. Interactive Elements**
- [ ] Buttons have hover/active states with visual feedback
- [ ] Cards/options have clear selection states
- [ ] Focus states visible for keyboard navigation
- [ ] Cursor changes on interactive elements (pointer)
- [ ] Touch targets large enough on mobile (44px minimum)
- Score: __/5

**F. Visual Hierarchy**
- [ ] Primary CTA is visually dominant (size, color, position)
- [ ] Information is scannable (not a wall of text)
- [ ] Important elements draw the eye first
- [ ] Supporting content is visually subordinate
- [ ] Clear visual grouping of related elements
- Score: __/5

**G. Premium Polish**
- [ ] Glassmorphism or depth effects where appropriate
- [ ] Subtle shadows creating elevation hierarchy
- [ ] Border radius consistent across all cards/buttons
- [ ] Loading states feel premium (not just a spinner)
- [ ] Overall "would a PUMA exec be impressed?" test
- Score: __/5

### 3. Capture Screenshots

For each screen, capture:
1. Desktop view (1440px × 900px) — full page
2. Mobile view (390px × 844px) — full page
3. Any specific detail shots (hover states, animations mid-frame)

### 4. Generate Visual Audit Report

```
═══════════════════════════════════════════
  PUMA-X Visual Quality Audit
═══════════════════════════════════════════
  Date: {timestamp}
  Viewports: Desktop (1440px), Mobile (390px)

  ─── Screen Scores (out of 35) ───

  Screen 1 (Problem):      {score}/35  {grade}
  Screen 2 (Foot Scan):    {score}/35  {grade}
  Screen 3 (Questions):    {score}/35  {grade}
  Screen 4 (Match Result): {score}/35  {grade}
  Screen 5 (Comparison):   {score}/35  {grade}
  Screen 6 (Ecosystem):    {score}/35  {grade}

  Overall Score: {total}/210  {overall-grade}

  Grading Scale:
  A+ (32-35) — Apple quality ✨
  A  (28-31) — Premium, minor tweaks
  B  (24-27) — Good, needs polish
  C  (20-23) — Acceptable, significant gaps
  D  (<20)   — Needs major redesign

  ─── Per-Screen Details ───

  Screen 1: {Name}
  ──────────────────
  Desktop: {grade} | Mobile: {grade}
  
  ✅ Strengths:
  - {what looks great}
  
  ⚠️ Issues:
  - Line {area}: {specific visual issue}
    → Fix: {specific CSS/Tailwind fix}
  
  Screenshots: [desktop] [mobile]

  ... (repeat for each screen)

  ─── Priority Fixes ───

  🔴 Critical (blocks demo):
  1. {fix description}

  🟡 Important (noticeably hurts):
  1. {fix description}

  🔵 Polish (nice to have):
  1. {fix description}

═══════════════════════════════════════════
```

### 5. Offer Fixes

For each visual issue identified:
- Provide the specific CSS/Tailwind class change
- Identify the exact file and component
- Ask if user wants to apply the fix

## Grading Criteria

**What "Apple-level premium" means for this project:**
- Dark mode with sophisticated color palette (not just `bg-gray-900`)
- Typography that breathes (generous line-height, proper sizing hierarchy)
- Animations that feel natural (spring physics, staggered reveals)
- Interactive elements that respond (hover scales, color shifts, shadows)
- Visual depth (shadows, glassmorphism, layered elements)
- Generous whitespace (not cramped)
- Consistent design language across all screens
- No element feels "default" or "unstyled"

## Rules

- **Judge as a PUMA executive would** — not a developer. Does it FEEL premium?
- **Be specific** — "spacing is off" is useless. "Section padding is 16px, should be 24px for breathing room" is useful
- **Include screenshots** — embed captured images in the report
- **Compare screens** — consistency across screens is as important as individual quality
- **Test both viewports** — mobile is equally important for this demo
- **Don't just check existence** — an animation that's too fast or too subtle isn't much better than none
