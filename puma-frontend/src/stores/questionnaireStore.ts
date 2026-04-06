import type { UserContext } from '@/types';

export interface QuestionnaireSlice {
  context: Partial<UserContext>;
  setContextField: <K extends keyof UserContext>(key: K, value: UserContext[K]) => void;
  resetContext: () => void;
}

type SetState = (updater: (state: QuestionnaireSlice) => Partial<QuestionnaireSlice>) => void;

export const createQuestionnaireSlice = (set: SetState): QuestionnaireSlice => ({
  context: {},
  setContextField: (key, value) => set((state) => ({ context: { ...state.context, [key]: value } })),
  resetContext: () => set(() => ({ context: {} })),
});
