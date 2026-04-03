import { Recommendation } from '@/types';

export interface RecommendationSlice {
  recommendation: Recommendation | null;
  setRecommendation: (rec: Recommendation) => void;
  resetRecommendation: () => void;
}

export const createRecommendationSlice = (set: (fn: (state: RecommendationSlice) => Partial<RecommendationSlice>) => void): RecommendationSlice => ({
  recommendation: null,
  setRecommendation: (rec) => set(() => ({ recommendation: rec })),
  resetRecommendation: () => set(() => ({ recommendation: null })),
});
