import { supabase } from '../db/supabase';
import type {
  ScanProfileRecord,
  RecommendationEvent,
  InteractionEvent,
  FeedbackRecord,
} from '../types/events';

/**
 * Log a scan profile to the database.
 * Returns the created profile ID or null on failure.
 */
export async function logScanProfile(profile: ScanProfileRecord): Promise<string | null> {
  const { data, error } = await supabase
    .from('scan_profiles')
    .insert([profile])
    .select('id')
    .single();

  if (error) {
    console.error('[EventService] Failed to log scan profile:', error.message);
    return null;
  }
  return data?.id ?? null;
}

/**
 * Log a recommendation event to the database.
 * Returns the created recommendation ID or null on failure.
 */
export async function logRecommendationEvent(event: RecommendationEvent): Promise<string | null> {
  const { data, error } = await supabase
    .from('recommendations')
    .insert([event])
    .select('id')
    .single();

  if (error) {
    console.error('[EventService] Failed to log recommendation:', error.message);
    return null;
  }
  return data?.id ?? null;
}

/**
 * Batch insert interaction events.
 * Fire-and-forget — errors are logged but don't throw.
 */
export async function logInteractionEvents(events: InteractionEvent[]): Promise<void> {
  if (events.length === 0) return;

  const { error } = await supabase
    .from('interaction_events')
    .insert(events);

  if (error) {
    console.error('[EventService] Failed to log interaction events:', error.message);
  }
}

/**
 * Log structured user feedback.
 * Returns the created feedback ID or null on failure.
 */
export async function logFeedback(feedback: FeedbackRecord): Promise<string | null> {
  const { data, error } = await supabase
    .from('feedback')
    .insert([feedback])
    .select('id')
    .single();

  if (error) {
    console.error('[EventService] Failed to log feedback:', error.message);
    return null;
  }
  return data?.id ?? null;
}

/**
 * Update the selected_model on an existing recommendation.
 * Called when user clicks a specific shoe from the results.
 */
export async function updateSelectedModel(
  recommendationId: string,
  selectedModel: string
): Promise<boolean> {
  const { error } = await supabase
    .from('recommendations')
    .update({ selected_model: selectedModel })
    .eq('id', recommendationId);

  if (error) {
    console.error('[EventService] Failed to update selected model:', error.message);
    return false;
  }
  return true;
}
