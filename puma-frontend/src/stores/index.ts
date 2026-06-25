import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { FootProfile, UserContext, Recommendation, RecommendationWithML } from '@/types';
import { createAnalyticsSlice, type AnalyticsSlice, type InteractionEvent } from './analyticsStore';

export type { InteractionEvent };

export interface AppStore extends AnalyticsSlice {
  footProfile: FootProfile | null;
  setFootProfile: (profile: FootProfile) => void;
  resetFootProfile: () => void;
  context: Partial<UserContext>;
  setContextField: <K extends keyof UserContext>(key: K, value: UserContext[K]) => void;
  resetContext: () => void;
  recommendation: Recommendation | null;
  setRecommendation: (rec: Recommendation | RecommendationWithML) => void;
  resetRecommendation: () => void;
  currentScreen: number;
  advanceScreen: () => void;
  goToScreen: (n: number) => void;
  resetAll: () => void;
}

export const useAppStore = create<AppStore>()(
  devtools(
    (set, get) => ({
      // ─── Analytics slice ──────────────────────────────────
      ...createAnalyticsSlice(
        (partial) => set(partial as Partial<AppStore>),
        () => get() as AnalyticsSlice
      ),

      // ─── Foot Profile ─────────────────────────────────────
      footProfile: null,
      setFootProfile: (profile) => set({ footProfile: profile }),
      resetFootProfile: () => set({ footProfile: null }),

      // ─── Context / Questionnaire ──────────────────────────
      context: {},
      setContextField: (key, value) => set((state) => ({ context: { ...state.context, [key]: value } })),
      resetContext: () => set({ context: {} }),

      // ─── Recommendation ───────────────────────────────────
      recommendation: null,
      setRecommendation: (rec) => set({ recommendation: rec }),
      resetRecommendation: () => set({ recommendation: null }),

      // ─── Screen navigation ────────────────────────────────
      currentScreen: 1,
      advanceScreen: () => set((state) => ({ currentScreen: state.currentScreen + 1 })),
      goToScreen: (n) => set({ currentScreen: n }),

      // ─── Global reset ─────────────────────────────────────
      resetAll: () => {
        const { resetAnalytics } = get();
        resetAnalytics();
        set({
          footProfile: null,
          context: {},
          recommendation: null,
          currentScreen: 1,
          recommendationId: null,
        });
      },
    }),
    { name: 'puma-store' }
  )
);

export { createFootProfileSlice, type FootProfileSlice } from './footProfileStore';
export { createQuestionnaireSlice, type QuestionnaireSlice } from './questionnaireStore';
export { createRecommendationSlice, type RecommendationSlice } from './recommendationStore';
export { createAnalyticsSlice, type AnalyticsSlice } from './analyticsStore';
