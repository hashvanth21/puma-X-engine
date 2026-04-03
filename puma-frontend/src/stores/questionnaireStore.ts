import { UserContext } from '@/types';

export interface QuestionnaireSlice {
  context: Partial<UserContext>;
  setContextField: <K extends keyof UserContext>(key: K, value: UserContext[K]) => void;
  resetContext: () => void;
}

export const createQuestionnaireSlice = (set: (fn: (state: QuestionnaireSlice) => Partial<QuestionnaireSlice>) => void): QuestionnaireSlice => ({
  context: {},
  setContextField: (key, value) => set((state) => ({ context: { ...state.context, [key]: value } })),
  resetContext: () => set(() => ({ context: {} })),
});
