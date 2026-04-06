import type { Recommendation } from '@/types';

export interface RecommendationSlice {
  recommendation: Recommendation | null;
  setRecommendation: (rec: Recommendation) => void;
  resetRecommendation: () => void;
}

type SetState = (partial: Partial<RecommendationSlice>) => void;

export const createRecommendationSlice = (set: SetState): RecommendationSlice => ({
  recommendation: null,
  setRecommendation: (rec) => set({ recommendation: rec }),
  resetRecommendation: () => set({ recommendation: null }),
});
