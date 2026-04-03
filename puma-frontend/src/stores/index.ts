import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { type FootProfileSlice, createFootProfileSlice } from './footProfileStore';
import { type QuestionnaireSlice, createQuestionnaireSlice } from './questionnaireStore';
import { type RecommendationSlice, createRecommendationSlice } from './recommendationStore';

interface NavigationSlice {
  currentScreen: number;
  advanceScreen: () => void;
  goToScreen: (n: number) => void;
  resetAll: () => void;
}

type AppStore = FootProfileSlice & QuestionnaireSlice & RecommendationSlice & NavigationSlice;

export const useAppStore = create<AppStore>()(
  devtools(
    (set) => ({
      ...createFootProfileSlice(set as any),
      ...createQuestionnaireSlice(set as any),
      ...createRecommendationSlice(set as any),
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
