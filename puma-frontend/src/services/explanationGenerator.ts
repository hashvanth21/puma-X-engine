import type { Shoe, FootProfile, UserContext, MatchReason } from '@/types';

// ─── Match Reason Generator ─────────────────────────────────────

export function generateMatchReasons(
  shoe: Shoe,
  footProfile: FootProfile,
  context: UserContext
): MatchReason[] {
  const reasons: MatchReason[] = [];

  // 1. Width match
  if (footProfile.width === 'wide' && shoe.attributes.wideFootScore >= 7) {
    reasons.push({
      attribute: 'Foot Width',
      explanation: `Your wider foot profile gets room to breathe in the ${shoe.model}'s spacious forefoot — no pinching during long ${formatActivity(context.activity)} sessions`,
      positive: true,
    });
  } else if (footProfile.width === 'narrow' && shoe.attributes.wideFootScore <= 4) {
    reasons.push({
      attribute: 'Foot Width',
      explanation: `The ${shoe.model}'s snug fit wraps your narrower foot securely — no sliding or instability`,
      positive: true,
    });
  }

  // 2. Arch support
  if (shoe.attributes.archSuitability.includes(footProfile.arch)) {
    const techName = shoe.techFeatures.find(
      (t) => t.includes('RUNGUIDE') || t.includes('NITRO') || t.includes('Foam')
    ) || shoe.techFeatures[0];
    reasons.push({
      attribute: 'Arch Support',
      explanation: `The ${techName} in the ${shoe.model} matches your ${footProfile.arch} arch profile for natural alignment`,
      positive: true,
    });
  }

  // 3. Pronation
  if (shoe.attributes.pronationSupport.includes(footProfile.pronation)) {
    const guidance = footProfile.pronation === 'overpronation'
      ? 'stability guidance to manage inward roll'
      : footProfile.pronation === 'supination'
        ? 'flexible cushioning for your outward gait pattern'
        : 'a neutral platform for your balanced stride';
    reasons.push({
      attribute: 'Pronation Control',
      explanation: `Built-in ${guidance} — the ${shoe.model} keeps your stride aligned mile after mile`,
      positive: true,
    });
  }

  // 4. Climate / Wet grip
  if (context.climate === 'rainy' && shoe.attributes.wetGripScore >= 6) {
    const gripTech = shoe.techFeatures.includes('PUMAGRIP')
      ? 'PUMAGRIP outsole'
      : 'high-traction rubber outsole';
    reasons.push({
      attribute: 'Wet Weather Grip',
      explanation: `The ${gripTech} maintains traction on wet surfaces — essential for your rainy ${formatUseCase(context.useCase)} route`,
      positive: true,
    });
  }

  // 5. All-day comfort
  if (context.hoursPerDay >= 7 && shoe.attributes.longWearComfortScore >= 7) {
    const foamTech = shoe.techFeatures.find((t) => t.includes('Foam') || t.includes('NITRO') || t.includes('Softride'))
      || 'advanced cushioning';
    reasons.push({
      attribute: 'All-Day Comfort',
      explanation: `With ${context.hoursPerDay}+ hours on your feet, the ${foamTech} in the ${shoe.model} won't compress or bottom out`,
      positive: true,
    });
  }

  // 6. Performance / Race
  if (context.priority === 'performance' && shoe.attributes.raceUseScore >= 7) {
    const plateTech = shoe.techFeatures.find((t) => t.includes('PWRPLATE') || t.includes('Carbon'))
      || 'responsive midsole technology';
    reasons.push({
      attribute: 'Race Performance',
      explanation: `The ${plateTech} in the ${shoe.model} converts your energy into forward propulsion — built for speed, not just comfort`,
      positive: true,
    });
  }

  // 7. Use case alignment (always include)
  const useCaseReason = generateUseCaseReason(shoe, context);
  if (useCaseReason) {
    reasons.push(useCaseReason);
  }

  // Filter to positive reasons, cap at 5, ensure at least 3
  const positiveReasons = reasons.filter((r) => r.positive);

  if (positiveReasons.length >= 3) {
    return positiveReasons.slice(0, 5);
  }

  // If fewer than 3, add general positive reasons
  const fallbackReasons: MatchReason[] = [];

  if (!positiveReasons.find((r) => r.attribute === 'Arch Support')) {
    fallbackReasons.push({
      attribute: 'Versatile Design',
      explanation: `The ${shoe.model}'s ${shoe.attributes.archSuitability.join('/')} arch support accommodates a range of foot profiles`,
      positive: true,
    });
  }

  if (!positiveReasons.find((r) => r.attribute === 'All-Day Comfort') && shoe.attributes.longWearComfortScore >= 5) {
    fallbackReasons.push({
      attribute: 'Cushioning',
      explanation: `${shoe.attributes.longWearComfortScore}/10 comfort rating ensures reliable cushioning from morning to evening`,
      positive: true,
    });
  }

  if (shoe.attributes.weight < 290) {
    fallbackReasons.push({
      attribute: 'Lightweight',
      explanation: `At just ${shoe.attributes.weight}g, the ${shoe.model} keeps your feet light and responsive throughout the day`,
      positive: true,
    });
  }

  return [...positiveReasons, ...fallbackReasons].slice(0, 5);
}

// ─── Elimination Reason Generator ───────────────────────────────

export function generateEliminationReason(
  shoe: Shoe,
  winner: Shoe,
  footProfile: FootProfile,
  context: UserContext
): string {
  // Check disqualifiers in priority order

  // 1. Width mismatch
  if (footProfile.width === 'wide' && shoe.attributes.wideFootScore < 4) {
    return `${shoe.model}: Too narrow for your wider foot profile — ${shoe.attributes.wideFootScore}/10 width accommodation`;
  }

  // 2. Wet grip in rainy climate
  if (context.climate === 'rainy' && shoe.attributes.wetGripScore < 4) {
    return `${shoe.model}: Low wet-grip rating (${shoe.attributes.wetGripScore}/10) — not safe for your rainy ${formatUseCase(context.useCase)} conditions`;
  }

  // 3. Lifestyle shoe for running
  if (shoe.category === 'lifestyle' && context.activity === 'running') {
    return `${shoe.model}: A lifestyle sneaker — insufficient cushioning and support for ${context.hoursPerDay}+ hours of running`;
  }

  // 4. Pronation mismatch
  if (footProfile.pronation === 'overpronation' && !shoe.attributes.pronationSupport.includes('overpronation')) {
    return `${shoe.model}: No overpronation support — your gait pattern needs guidance that this shoe doesn't provide`;
  }

  // 5. Performance priority with low race score
  if (context.priority === 'performance' && shoe.attributes.raceUseScore < 3) {
    return `${shoe.model}: Comfort-focused design lacks the responsive energy return your performance goals demand`;
  }

  // 6. Long wear with low comfort
  if (context.hoursPerDay >= 8 && shoe.attributes.longWearComfortScore < 5) {
    return `${shoe.model}: Cushioning breaks down during extended ${context.hoursPerDay}-hour wear sessions`;
  }

  // 7. Lifestyle shoe for standing
  if (shoe.category === 'lifestyle' && context.useCase === 'long-standing') {
    return `${shoe.model}: Lifestyle cushioning insufficient for ${context.hoursPerDay}+ hours of standing — need dedicated comfort technology`;
  }

  // 8. Fallback — compare weakest dimension
  const weakest = findWeakestDimension(shoe, winner, context);
  return `${shoe.model}: The ${winner.model} outperforms on ${weakest} — the deciding factor for your profile`;
}

// ─── Helpers ────────────────────────────────────────────────────

function formatActivity(activity: string): string {
  return activity.replace('-', ' ');
}

function formatUseCase(useCase: string): string {
  return useCase.replace(/-/g, ' ');
}

function generateUseCaseReason(shoe: Shoe, context: UserContext): MatchReason | null {
  const explanations: Record<string, string> = {
    'daily-commute': `Designed to handle the stop-start of daily commuting — ${shoe.attributes.dailyCommuteScore}/10 commute suitability`,
    'running': `Engineered for the rhythmic impact of distance running — ${shoe.attributes.runningScore}/10 running suitability`,
    'long-standing': `Extra cushioning depth absorbs the compression of standing for ${context.hoursPerDay}+ hours daily`,
    'gym-casual': `Versatile enough for gym workouts and casual outings without swapping shoes`,
    'office-wear': `Maintains professional appearance while delivering ${shoe.attributes.longWearComfortScore}/10 comfort through a full workday`,
    'rainy-conditions': `Built for wet-weather reliability with ${shoe.attributes.wetGripScore}/10 grip performance`,
  };

  const explanation = explanations[context.useCase];
  if (!explanation) return null;

  return {
    attribute: 'Use Case Match',
    explanation,
    positive: true,
  };
}

function findWeakestDimension(shoe: Shoe, winner: Shoe, context: UserContext): string {
  const comparisons: Array<{ label: string; diff: number }> = [
    { label: 'all-day cushioning', diff: winner.attributes.longWearComfortScore - shoe.attributes.longWearComfortScore },
    { label: 'wet-weather traction', diff: winner.attributes.wetGripScore - shoe.attributes.wetGripScore },
    { label: 'running performance', diff: winner.attributes.runningScore - shoe.attributes.runningScore },
    { label: 'commute durability', diff: winner.attributes.dailyCommuteScore - shoe.attributes.dailyCommuteScore },
    { label: 'wide-foot accommodation', diff: winner.attributes.wideFootScore - shoe.attributes.wideFootScore },
  ];

  // Find where the winner has the biggest advantage
  comparisons.sort((a, b) => b.diff - a.diff);

  // If context is rainy, prioritize wet grip
  if (context.climate === 'rainy') {
    const wetGrip = comparisons.find((c) => c.label === 'wet-weather traction');
    if (wetGrip && wetGrip.diff > 0) return wetGrip.label;
  }

  return comparisons[0]?.label || 'overall suitability';
}
