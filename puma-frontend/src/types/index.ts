// Domain types

export type FootWidth = 'narrow' | 'standard' | 'wide';
export type ArchType = 'low' | 'medium' | 'high';
export type Pronation = 'neutral' | 'overpronation' | 'supination';

export interface FootProfile {
  width: FootWidth;
  arch: ArchType;
  pronation: Pronation;
  estimatedSize: number; // EU size, e.g. 42
  scanConfidence: number; // 0–100
}

export type UseCase =
  | 'daily-commute'
  | 'office-wear'
  | 'running'
  | 'long-standing'
  | 'gym-casual'
  | 'rainy-conditions';

export type ActivityType = 'running' | 'walking' | 'standing' | 'gym-casual';
export type Climate = 'rainy' | 'dry';
export type Priority = 'comfort' | 'performance' | 'balanced';

export interface UserContext {
  useCase: UseCase;
  hoursPerDay: number; // 1–12
  activity: ActivityType;
  climate: Climate;
  priority: Priority;
  priorityScore: number; // 0 = max comfort, 100 = max performance
}

export interface ShoeAttribute {
  wideFootScore: number;        // 0–10
  wetGripScore: number;         // 0–10
  dailyCommuteScore: number;    // 0–10
  raceUseScore: number;         // 0–10
  longWearComfortScore: number; // 0–10
  runningScore: number;         // 0–10
  archSuitability: ArchType[];  // which arch types it suits
  pronationSupport: Pronation[]; // pronation types it handles
  weight: number;               // grams
  idealEnvironment: Climate[];
}

export interface Shoe {
  id: string;
  name: string;
  model: string;
  colorway: string;
  price: number;
  imageUrl: string;
  category: 'running' | 'lifestyle' | 'training';
  attributes: ShoeAttribute;
  description: string;
  techFeatures: string[];
  tagline: string;
  modelYear: number;
}

export interface MatchReason {
  attribute: string;
  explanation: string;
  positive: boolean;
}

export interface Recommendation {
  primary: Shoe;
  primaryMatchScore: number; // 0–100
  primaryReasons: MatchReason[];
  alternate: Shoe;
  alternateMatchScore: number;
  eliminatedShoes: Array<{
    shoe: Shoe;
    reason: string;
  }>;
  generatedAt: string; // ISO timestamp
}

export interface AppState {
  currentScreen: number;
  footProfile: FootProfile | null;
  context: UserContext | null;
  recommendation: Recommendation | null;
}
