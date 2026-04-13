---
phase: 5
slug: match-result-comparison-ui
status: approved
shadcn_initialized: false
preset: none
created: 2026-04-14
---

# Phase 5 — UI Design Contract

> Visual and interaction contract for frontend phases. Focused on premium PUMA neumorphism/glassmorphism aesthetics with highly dynamic efforts and immersive details.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | custom |
| Preset | none |
| Component library | framer-motion |
| Icon library | lucide-react |
| Font | Tailwind Sans (Inter / Roboto) or Outfit if used previously |
| Aesthetic Theme | Premium Dark Mode + Glassmorphism / Neumorphism |

---

## Spacing Scale

Declared values (must be multiples of 4):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon gaps, inline padding |
| sm | 8px | Compact element spacing |
| md | 16px | Default element spacing, Inner Card Padding |
| lg | 24px | Major sections within cards |
| xl | 32px | Layout gaps, Hero Card interior spacing |
| 2xl | 48px | Major section breaks |
| 3xl | 64px | Page-level spacing |

Exceptions: none

---

## Typography

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Body | 16px | 400 | 1.5 |
| Label | 14px | 500 / 600 | 1.4 |
| Heading 3 | 24px | 700 / Bold | 1.25 |
| Heading 2 | 32px | 700 / Bold | 1.2 |
| Display (Match %) | 64px | 800 / Black | 1.0 (Tracking tight) |

*PUMA specific note: Typography should feel athletic, precise, and tech-forward. Heavy use of uppercase for headers and labels. Tight letter spacing for bold display metrics.*

---

## Color & Finishes

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | `#0A0A0A` / `#000000` | Background, negative space |
| Secondary (30%) | `#18181A` / Glass | Cards, floating UI layers, glassmorphic panels `rgba(255, 255, 255, 0.05)`, backdrop blur |
| Accent (10%) | `#E3FF15` (Puma Electro Volt) | Primary call to action, active icons, match score gauge, glowing effects |
| Match Success | `#00FF88` | High match indicator, positive stats |
| Destructive/Eliminated | `#FF3366` | Eliminated reasons, negative indicators |

*Material Finishes:*
- **Glassmorphism:** Frosting effect on cards filtering the background blur (`backdrop-blur-xl`).
- **Dynamic Shadows (Neumorphism touch):** Subtle drop glows driven by accent colors instead of black shadows (`shadow-[0_0_30px_rgba(227,255,21,0.2)]`).
- **Borders:** Thin translucent borders indicating precision (`border-white/10`).

---

## Copywriting Contract

| Element | Copy |
|---------|------|
| Primary CTA | SECURE YOUR PAIR |
| Alternate CTA | VIEW ALL OPTIONS |
| Hero Heading | YOUR PERFECT MATCH |
| Match % Label | MATCH CONFIDENCE |
| Elimination Heading | WHY NOT THE OTHERS? |
| Empty state body | Waiting for scan results... |
| Feature Label | ENGINEERED FOR: {Feature} |

---

## Animation & Dynamics (Framer Motion)

| Registry / Type | Technique | Usage |
|----------|-------------|-------------|
| **Page Transitions** | Fade + Upward Spring | Screen changes |
| **Card Hover** | Scale(1.02) + Glow Intensity Increase | Product cards, comparisons |
| **Data Reveal** | Staggered Fade Up (`staggerChildren: 0.1`) | Match reasons list |
| **Numeric Count** | Counter Spring Animation | Match % animating from 0 to actual |
| **3D Elements** | Floating Y-axis breathing (`y: [0, -10, 0]`) | 3D Shoe Visuals / Hero assets |

---

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS
- [x] Dimension 2 Visuals: PASS
- [x] Dimension 3 Color: PASS
- [x] Dimension 4 Typography: PASS
- [x] Dimension 5 Spacing: PASS
- [x] Dimension 6 Registry Safety: PASS

**Approval:** approved 2026-04-14
