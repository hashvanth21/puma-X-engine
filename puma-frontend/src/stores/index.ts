import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { FootProfile, UserContext, Recommendation } from '@/types';

export interface AppStore {
  footProfile: FootProfile | null;
  setFootProfile: (profile: FootProfile) => void;
  resetFootProfile: () => void;
  context: Partial<UserContext>;
  setContextField: <K extends keyof UserContext>(key: K, value: UserContext[K]) => void;
  resetContext: () => void;
  recommendation: Recommendation | null;
  setRecommendation: (rec: Recommendation) => void;
  resetRecommendation: () => void;
  currentScreen: number;
  advanceScreen: () => void;
  goToScreen: (n: number) => void;
  resetAll: () => void;
}

export const useAppStore = create<AppStore>()(
  devtools(
    (set) => ({
      footProfile: null,
      setFootProfile: (profile) => set({ footProfile: profile }),
      resetFootProfile: () => set({ footProfile: null }),
      context: {},
      setContextField: (key, value) => set((state) => ({ context: { ...state.context, [key]: value } })),
      resetContext: () => set({ context: {} }),
      recommendation: null,
      setRecommendation: (rec) => set({ recommendation: rec }),
      resetRecommendation: () => set({ recommendation: null }),
      currentScreen: 1,
      advanceScreen: () => set((state) => ({ currentScreen: state.currentScreen + 1 })),
      goToScreen: (n) => set({ currentScreen: n }),
      resetAll: () => set({
        footProfile: null,
        context: {},
        recommendation: null,
        currentScreen: 1,
      }),
    }),
    { name: 'puma-store' }
  )
);

export { createFootProfileSlice, type FootProfileSlice } from './footProfileStore';
export { createQuestionnaireSlice, type QuestionnaireSlice } from './questionnaireStore';
export { createRecommendationSlice, type RecommendationSlice } from './recommendationStore';
