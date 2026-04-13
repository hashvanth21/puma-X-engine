import type { Shoe, FootProfile, UserContext, Recommendation, MatchReason } from '../data/shoes';

// ─── Scoring Configuration ───────────────────────────────────────

export interface ScoringWeights {
  footProfile: number;
  useCase: number;
  activity: number;
  climate: number;
  priority: number;
  wearDuration: number;
}

export const DEFAULT_WEIGHTS: ScoringWeights = {
  footProfile: 0.30,
  useCase: 0.25,
  activity: 0.20,
  climate: 0.10,
  priority: 0.10,
  wearDuration: 0.05,
};

// ─── Request/Response Types ─────────────────────────────────────

export interface RecommendRequest {
  footProfile: FootProfile;
  context: UserContext;
}

export interface RecommendResponse {
  recommendation: Recommendation;
}

// ─── Dimension Scorers (0-10 each) ──────────────────────────────

function scoreFootProfile(shoe: Shoe, profile: FootProfile): number {
  let widthScore: number;
  if (profile.width === 'wide') {
    widthScore = shoe.attributes.wideFootScore;
  } else if (profile.width === 'narrow') {
    widthScore = 10 - shoe.attributes.wideFootScore;
  } else {
    widthScore = 7;
  }
  const archMatch = shoe.attributes.archSuitability.includes(profile.arch) ? 10 : 3;
  const pronationMatch = shoe.attributes.pronationSupport.includes(profile.pronation) ? 10 : 2;
  return (widthScore + archMatch + pronationMatch) / 3;
}

function scoreUseCase(shoe: Shoe, context: UserContext): number {
  switch (context.useCase) {
    case 'daily-commute': return shoe.attributes.dailyCommuteScore;
    case 'running': return shoe.attributes.runningScore;
    case 'long-standing': return shoe.attributes.longWearComfortScore;
    case 'gym-casual': return (shoe.attributes.dailyCommuteScore + shoe.attributes.longWearComfortScore) / 2;
    case 'office-wear': return shoe.attributes.dailyCommuteScore * 0.8 + shoe.attributes.longWearComfortScore * 0.2;
    case 'rainy-conditions': return shoe.attributes.wetGripScore;
    default: return 5;
  }
}

function scoreActivity(shoe: Shoe, context: UserContext): number {
  switch (context.activity) {
    case 'running': return shoe.attributes.runningScore;
    case 'walking': return (shoe.attributes.dailyCommuteScore + shoe.attributes.longWearComfortScore) / 2;
    case 'standing': return shoe.attributes.longWearComfortScore;
    case 'gym-casual': return shoe.attributes.runningScore * 0.3 + shoe.attributes.dailyCommuteScore * 0.7;
    default: return 5;
  }
}

function scoreClimate(shoe: Shoe, context: UserContext): number {
  if (context.climate === 'rainy') {
    const hasRainyEnv = shoe.attributes.idealEnvironment.includes('rainy');
    return hasRainyEnv ? shoe.attributes.wetGripScore : shoe.attributes.wetGripScore * 0.6;
  }
  return 8;
}

function scorePriority(shoe: Shoe, context: UserContext): number {
  const ps = context.priorityScore;
  if (ps <= 33) return shoe.attributes.longWearComfortScore;
  if (ps >= 67) return (shoe.attributes.raceUseScore + shoe.attributes.runningScore) / 2;
  return (shoe.attributes.longWearComfortScore + shoe.attributes.runningScore) / 2;
}

function scoreWearDuration(shoe: Shoe, context: UserContext): number {
  const hours = context.hoursPerDay;
  if (hours >= 8) {
    const weightBonus = shoe.attributes.weight < 300 ? 1 : -1;
    return Math.min(10, shoe.attributes.longWearComfortScore + weightBonus);
  }
  if (hours >= 5) return (shoe.attributes.longWearComfortScore + 5) / 2;
  return 7;
}

// ─── Main Scoring Function ──────────────────────────────────────

export function scoreShoe(
  shoe: Shoe,
  footProfile: FootProfile,
  context: UserContext,
  weights: ScoringWeights = DEFAULT_WEIGHTS
): number {
  const dimensions = {
    footProfile: scoreFootProfile(shoe, footProfile),
    useCase: scoreUseCase(shoe, context),
    activity: scoreActivity(shoe, context),
    climate: scoreClimate(shoe, context),
    priority: scorePriority(shoe, context),
    wearDuration: scoreWearDuration(shoe, context),
  };

  const totalScore =
    dimensions.footProfile * weights.footProfile +
    dimensions.useCase * weights.useCase +
    dimensions.activity * weights.activity +
    dimensions.climate * weights.climate +
    dimensions.priority * weights.priority +
    dimensions.wearDuration * weights.wearDuration;

  return Math.round(Math.min(100, Math.max(0, (totalScore / 10) * 100)));
}

// ─── Recommendation Generator ───────────────────────────────────

interface ScoredShoe {
  shoe: Shoe;
  score: number;
}

export function generateRecommendation(
  footProfile: FootProfile,
  context: UserContext,
  shoes: Shoe[],
  weights: ScoringWeights = DEFAULT_WEIGHTS
): Recommendation {
  const scored: ScoredShoe[] = shoes.map((shoe) => ({
    shoe,
    score: scoreShoe(shoe, footProfile, context, weights),
  }));

  scored.sort((a, b) => b.score - a.score);

  // Tiebreaker
  for (let i = 0; i < scored.length - 1; i++) {
    if (scored[i].score - scored[i + 1].score <= 2) {
      if (scored[i + 1].shoe.attributes.weight < scored[i].shoe.attributes.weight) {
        [scored[i], scored[i + 1]] = [scored[i + 1], scored[i]];
      }
    }
  }

  const primary = scored[0];
  const alternate = scored[1];
  const eliminated = scored.slice(2, 5);

  const primaryReasons = generateMatchReasons(primary.shoe, footProfile, context);

  const eliminatedShoes = eliminated.map((entry) => ({
    shoe: entry.shoe,
    reason: generateEliminationReason(entry.shoe, primary.shoe, footProfile, context),
  }));

  return {
    primary: primary.shoe,
    primaryMatchScore: primary.score,
    primaryReasons,
    alternate: alternate.shoe,
    alternateMatchScore: alternate.score,
    eliminatedShoes,
    generatedAt: new Date().toISOString(),
  };
}

// ─── Explanation Generator (inline for backend) ──────────────────

function generateMatchReasons(shoe: Shoe, footProfile: FootProfile, context: UserContext): MatchReason[] {
  const reasons: MatchReason[] = [];

  if (footProfile.width === 'wide' && shoe.attributes.wideFootScore >= 7) {
    reasons.push({ attribute: 'Foot Width', explanation: `Your wider foot profile gets room to breathe in the ${shoe.model}'s spacious forefoot`, positive: true });
  } else if (footProfile.width === 'narrow' && shoe.attributes.wideFootScore <= 4) {
    reasons.push({ attribute: 'Foot Width', explanation: `The ${shoe.model}'s snug fit wraps your narrower foot securely`, positive: true });
  }

  if (shoe.attributes.archSuitability.includes(footProfile.arch)) {
    const tech = shoe.techFeatures[0] || 'cushioning system';
    reasons.push({ attribute: 'Arch Support', explanation: `The ${tech} in the ${shoe.model} matches your ${footProfile.arch} arch profile`, positive: true });
  }

  if (shoe.attributes.pronationSupport.includes(footProfile.pronation)) {
    const guidance = footProfile.pronation === 'overpronation' ? 'stability guidance' : footProfile.pronation === 'supination' ? 'flexible cushioning' : 'neutral platform';
    reasons.push({ attribute: 'Pronation Control', explanation: `Built-in ${guidance} keeps your stride aligned mile after mile`, positive: true });
  }

  if (context.climate === 'rainy' && shoe.attributes.wetGripScore >= 6) {
    reasons.push({ attribute: 'Wet Weather Grip', explanation: `High-traction outsole maintains grip on wet surfaces`, positive: true });
  }

  if (context.hoursPerDay >= 7 && shoe.attributes.longWearComfortScore >= 7) {
    reasons.push({ attribute: 'All-Day Comfort', explanation: `With ${context.hoursPerDay}+ hours on your feet, the ${shoe.model}'s cushioning won't compress`, positive: true });
  }

  if (context.priority === 'performance' && shoe.attributes.raceUseScore >= 7) {
    reasons.push({ attribute: 'Race Performance', explanation: `Built for speed — responsive energy return for your performance goals`, positive: true });
  }

  reasons.push({ attribute: 'Use Case Match', explanation: `${shoe.attributes.runningScore}/10 running · ${shoe.attributes.dailyCommuteScore}/10 commute · ${shoe.attributes.longWearComfortScore}/10 comfort`, positive: true });

  return reasons.filter(r => r.positive).slice(0, 5);
}

function generateEliminationReason(shoe: Shoe, winner: Shoe, footProfile: FootProfile, context: UserContext): string {
  if (footProfile.width === 'wide' && shoe.attributes.wideFootScore < 4) return `${shoe.model}: Too narrow for your wider foot profile — ${shoe.attributes.wideFootScore}/10 width`;
  if (context.climate === 'rainy' && shoe.attributes.wetGripScore < 4) return `${shoe.model}: Low wet-grip (${shoe.attributes.wetGripScore}/10) — not safe for rainy conditions`;
  if (shoe.category === 'lifestyle' && context.activity === 'running') return `${shoe.model}: Lifestyle sneaker — insufficient support for running`;
  if (footProfile.pronation === 'overpronation' && !shoe.attributes.pronationSupport.includes('overpronation')) return `${shoe.model}: No overpronation support`;
  if (context.priority === 'performance' && shoe.attributes.raceUseScore < 3) return `${shoe.model}: Comfort-focused — lacks responsive energy return`;
  if (context.hoursPerDay >= 8 && shoe.attributes.longWearComfortScore < 5) return `${shoe.model}: Cushioning insufficient for ${context.hoursPerDay}-hour wear`;
  return `${shoe.model}: The ${winner.model} outperforms on key attributes for your profile`;
}

