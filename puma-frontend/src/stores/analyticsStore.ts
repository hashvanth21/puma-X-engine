export interface InteractionEvent {
  session_id: string;
  recommendation_id?: string;
  event_type: 'clicked_primary' | 'opened_alternatives' | 'time_spent' | 'changed_use_case' | 're_ran_scan';
  event_data?: Record<string, unknown>;
}

export interface AnalyticsSlice {
  sessionId: string;
  recommendationId: string | null;
  interactionBuffer: InteractionEvent[];
  setRecommendationId: (id: string | null) => void;
  trackInteraction: (type: InteractionEvent['event_type'], data?: Record<string, unknown>) => void;
  flushEvents: () => Promise<void>;
  resetAnalytics: () => void;
}

type SetState = (partial: Partial<AnalyticsSlice> | ((state: AnalyticsSlice) => Partial<AnalyticsSlice>)) => void;
type GetState = () => AnalyticsSlice;

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export const createAnalyticsSlice = (set: SetState, get: GetState): AnalyticsSlice => ({
  sessionId: crypto.randomUUID(),
  recommendationId: null,
  interactionBuffer: [],

  setRecommendationId: (id) => set({ recommendationId: id }),

  trackInteraction: (type, data) => {
    const state = get();
    const event: InteractionEvent = {
      session_id: state.sessionId,
      recommendation_id: state.recommendationId ?? undefined,
      event_type: type,
      event_data: data,
    };
    set({ interactionBuffer: [...state.interactionBuffer, event] });
  },

  flushEvents: async () => {
    const state = get();
    if (state.interactionBuffer.length === 0) return;

    const events = [...state.interactionBuffer];
    set({ interactionBuffer: [] });

    try {
      await fetch(`${API_BASE}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events }),
      });
    } catch (err) {
      console.error('[Analytics] Failed to flush events:', err);
      // Re-add failed events to buffer for retry
      set((s) => ({ interactionBuffer: [...events, ...s.interactionBuffer] }));
    }
  },

  resetAnalytics: () => set({
    sessionId: crypto.randomUUID(),
    recommendationId: null,
    interactionBuffer: [],
  }),
});
