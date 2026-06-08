// ─── Session ─────────────────────────────────────────────
export interface SessionInfo {
  session_id: string;
}

// ─── Scan Profile Event ─────────────────────────────────
export interface ScanProfileRecord {
  session_id: string;
  width: 'narrow' | 'standard' | 'wide';
  arch: 'low' | 'medium' | 'high';
  pronation: 'neutral' | 'overpronation' | 'supination';
  foot_length?: number;
  fit_preference?: string;
}

// ─── Recommendation Event ───────────────────────────────
export interface RecommendationEvent {
  session_id: string;
  profile_id?: string;
  use_case: string;
  activity: string;
  climate: string;
  priority_score: number;
  hours_per_day: number;
  recommended_top3: Array<{ model: string; score: number }>;
  primary_model: string;
  primary_score: number;
  alternate_model?: string;
  alternate_score?: number;
  confidence_score?: number;
}

// ─── Interaction Event ──────────────────────────────────
export type InteractionEventType =
  | 'clicked_primary'
  | 'opened_alternatives'
  | 'time_spent'
  | 'changed_use_case'
  | 're_ran_scan';

export interface InteractionEvent {
  session_id: string;
  recommendation_id?: string;
  event_type: InteractionEventType;
  event_data?: Record<string, unknown>;
}

// ─── Feedback Record ────────────────────────────────────
export type FitFeedback = 'perfect_fit' | 'slightly_tight' | 'too_tight' | 'slightly_loose' | 'too_loose';
export type UseCaseFeedback = 'good_for_purpose' | 'not_ideal';
export type StyleFeedback = 'liked_style' | 'disliked_style';

export interface FeedbackRecord {
  recommendation_id: string;
  session_id: string;
  fit_feedback?: FitFeedback;
  use_case_feedback?: UseCaseFeedback;
  style_feedback?: StyleFeedback;
}
