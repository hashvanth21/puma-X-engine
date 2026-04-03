# Phase 2: Foot Scan Module

## PUMA Narrative Framing
"For the demo, we intentionally prioritized experience certainty and visual fidelity. The scanning layer is architected so that real computer vision and biomechanical ML can replace the deterministic engine later without changing the user experience."

## Core Focus
Build a high-fidelity cinematic foot scan simulation that feels instant and totally reliable to PUMA stakeholders, using a live webcam feed overlay stacked beneath a deterministic engine.

**Key constraints:**
- DO NOT attempt heavy browser ML parsing (MediaPipe).
- Utilize the `react-webcam` component to capture live video inside the black glass `Screen2FootScan`.
- Drive the user down a sequence: "Place Foot in Frame" -> "Scanning" -> "Analyzing" -> "Results".

## Data Structure
Output the following into the Zustand `footProfileStore` upon completion:
```typescript
interface FootProfile {
  archType: 'low' | 'medium' | 'high';
  width: 'narrow' | 'standard' | 'wide';
  pronation: 'neutral' | 'overpronation' | 'supination';
  estimatedSizeEu: number;
}
```
*We will hardcode this to a "Neutral / Standard / Medium / 43" profile for this specific deterministic path.*
