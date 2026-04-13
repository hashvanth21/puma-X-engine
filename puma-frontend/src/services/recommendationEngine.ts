import type { Shoe, FootProfile, UserContext, Recommendation, MatchReason } from '@/types';

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

// ─── Dimension Scorers (0-10 each) ──────────────────────────────

function scoreFootProfile(shoe: Shoe, profile: FootProfile): number {
  // Width compatibility
  let widthScore: number;
  if (profile.width === 'wide') {
    widthScore = shoe.attributes.wideFootScore;
  } else if (profile.width === 'narrow') {
    widthScore = 10 - shoe.attributes.wideFootScore;
  } else {
    widthScore = 7; // standard width — most shoes work
  }

  // Arch match
  const archMatch = shoe.attributes.archSuitability.includes(profile.arch) ? 10 : 3;

  // Pronation match
  const pronationMatch = shoe.attributes.pronationSupport.includes(profile.pronation) ? 10 : 2;

  return (widthScore + archMatch + pronationMatch) / 3;
}

function scoreUseCase(shoe: Shoe, context: UserContext): number {
  switch (context.useCase) {
    case 'daily-commute':
      return shoe.attributes.dailyCommuteScore;
    case 'running':
      return shoe.attributes.runningScore;
    case 'long-standing':
      return shoe.attributes.longWearComfortScore;
    case 'gym-casual':
      return (shoe.attributes.dailyCommuteScore + shoe.attributes.longWearComfortScore) / 2;
    case 'office-wear':
      return shoe.attributes.dailyCommuteScore * 0.8 + shoe.attributes.longWearComfortScore * 0.2;
    case 'rainy-conditions':
      return shoe.attributes.wetGripScore;
    default:
      return 5;
  }
}

function scoreActivity(shoe: Shoe, context: UserContext): number {
  switch (context.activity) {
    case 'running':
      return shoe.attributes.runningScore;
    case 'walking':
      return (shoe.attributes.dailyCommuteScore + shoe.attributes.longWearComfortScore) / 2;
    case 'standing':
      return shoe.attributes.longWearComfortScore;
    case 'gym-casual':
      return shoe.attributes.runningScore * 0.3 + shoe.attributes.dailyCommuteScore * 0.7;
    default:
      return 5;
  }
}

function scoreClimate(shoe: Shoe, context: UserContext): number {
  if (context.climate === 'rainy') {
    const hasRainyEnv = shoe.attributes.idealEnvironment.includes('rainy');
    return hasRainyEnv ? shoe.attributes.wetGripScore : shoe.attributes.wetGripScore * 0.6;
  }
  // Dry climate — most shoes fine
  return 8;
}

function scorePriority(shoe: Shoe, context: UserContext): number {
  const ps = context.priorityScore;
  if (ps <= 33) {
    // Comfort-focused
    return shoe.attributes.longWearComfortScore;
  } else if (ps >= 67) {
    // Performance-focused
    return (shoe.attributes.raceUseScore + shoe.attributes.runningScore) / 2;
  }
  // Balanced
  return (shoe.attributes.longWearComfortScore + shoe.attributes.runningScore) / 2;
}

function scoreWearDuration(shoe: Shoe, context: UserContext): number {
  const hours = context.hoursPerDay;
  if (hours >= 8) {
    // Long wear — comfort matters more, heavy shoes penalized
    const weightBonus = shoe.attributes.weight < 300 ? 1 : -1;
    return Math.min(10, shoe.attributes.longWearComfortScore + weightBonus);
  } else if (hours >= 5) {
    return (shoe.attributes.longWearComfortScore + 5) / 2;
  }
  return 7; // Short wear — most shoes fine
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

  // Convert 0-10 weighted score to 0-100 percentage
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
  // Score all shoes
  const scored: ScoredShoe[] = shoes.map((shoe) => ({
    shoe,
    score: scoreShoe(shoe, footProfile, context, weights),
  }));

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // Tiebreaker for close scores (within 2 points)
  for (let i = 0; i < scored.length - 1; i++) {
    if (scored[i].score - scored[i + 1].score <= 2) {
      // Prefer lighter shoe as tiebreaker
      if (scored[i + 1].shoe.attributes.weight < scored[i].shoe.attributes.weight) {
        [scored[i], scored[i + 1]] = [scored[i + 1], scored[i]];
      }
    }
  }

  const primary = scored[0];
  const alternate = scored[1];
  const eliminated = scored.slice(2, 5); // Top 3 eliminated for display

  // Placeholder reasons — Plan 04-03 integrates the explanation generator
  const primaryReasons: MatchReason[] = [];

  const eliminatedShoes = eliminated.map((entry) => ({
    shoe: entry.shoe,
    reason: `Outscored by ${primary.shoe.model} (${primary.score}% vs ${entry.score}%)`,
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
