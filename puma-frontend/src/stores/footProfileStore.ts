import type { FootProfile } from '@/types';

export interface FootProfileSlice {
  footProfile: FootProfile | null;
  setFootProfile: (profile: FootProfile) => void;
  resetFootProfile: () => void;
}

type SetState = (updater: (state: FootProfileSlice) => Partial<FootProfileSlice>) => void;

export const createFootProfileSlice = (set: SetState): FootProfileSlice => ({
  footProfile: null,
  setFootProfile: (profile) => set(() => ({ footProfile: profile })),
  resetFootProfile: () => set(() => ({ footProfile: null })),
});
