import { FootProfile } from '@/types';

export interface FootProfileSlice {
  footProfile: FootProfile | null;
  setFootProfile: (profile: FootProfile) => void;
  resetFootProfile: () => void;
}

export const createFootProfileSlice = (set: (fn: (state: FootProfileSlice) => Partial<FootProfileSlice>) => void): FootProfileSlice => ({
  footProfile: null,
  setFootProfile: (profile) => set(() => ({ footProfile: profile })),
  resetFootProfile: () => set(() => ({ footProfile: null })),
});
