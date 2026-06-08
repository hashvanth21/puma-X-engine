import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

type FitFeedback = 'perfect_fit' | 'slightly_tight' | 'too_tight' | 'slightly_loose' | 'too_loose';
type UseCaseFeedback = 'good_for_purpose' | 'not_ideal';
type StyleFeedback = 'liked_style' | 'disliked_style';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendationId: string | null;
  sessionId: string;
  shoeModel: string;
}

const fitOptions: { value: FitFeedback; label: string; emoji: string }[] = [
  { value: 'perfect_fit', label: 'Perfect fit', emoji: '✅' },
  { value: 'slightly_tight', label: 'Slightly tight', emoji: '↔️' },
  { value: 'too_tight', label: 'Too tight', emoji: '❌' },
  { value: 'slightly_loose', label: 'Slightly loose', emoji: '↔️' },
  { value: 'too_loose', label: 'Too loose', emoji: '❌' },
];

const useCaseOptions: { value: UseCaseFeedback; label: string; emoji: string }[] = [
  { value: 'good_for_purpose', label: 'Good for my purpose', emoji: '👍' },
  { value: 'not_ideal', label: 'Not ideal', emoji: '👎' },
];

const styleOptions: { value: StyleFeedback; label: string; emoji: string }[] = [
  { value: 'liked_style', label: 'Liked the style', emoji: '❤️' },
  { value: 'disliked_style', label: "Didn't like the style", emoji: '💔' },
];

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants = {
  hidden: { opacity: 0, y: 48, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 340, damping: 30 },
  },
  exit: { opacity: 0, y: 32, scale: 0.97, transition: { duration: 0.2 } },
};

export default function FeedbackModal({ isOpen, onClose, recommendationId, sessionId, shoeModel }: FeedbackModalProps) {
  const [fit, setFit] = useState<FitFeedback | null>(null);
  const [useCase, setUseCase] = useState<UseCaseFeedback | null>(null);
  const [style, setStyle] = useState<StyleFeedback | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = fit || useCase || style;

  const handleSubmit = async () => {
    if (!recommendationId || !canSubmit) return;
    setSubmitting(true);

    try {
      await fetch(`${API_BASE}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recommendation_id: recommendationId,
          session_id: sessionId,
          ...(fit && { fit_feedback: fit }),
          ...(useCase && { use_case_feedback: useCase }),
          ...(style && { style_feedback: style }),
        }),
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFit(null);
        setUseCase(null);
        setStyle(null);
        onClose();
      }, 1500);
    } catch (err) {
      console.error('[Feedback] Failed to submit:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFit(null);
    setUseCase(null);
    setStyle(null);
    setSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Panel */}
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-lg px-4 pb-8 md:bottom-auto md:top-1/2 md:-translate-y-1/2"
          >
            <div className="bg-bg-card border border-white/10 rounded-2xl shadow-premium overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/10">
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-0.5">Your feedback</p>
                  <h2 className="font-display font-bold text-lg text-text-primary">
                    How was the {shoeModel}?
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Content */}
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="thank-you"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-10 gap-3"
                  >
                    <CheckCircle size={40} className="text-accent-red" />
                    <p className="font-display font-semibold text-text-primary">Thank you!</p>
                    <p className="text-sm text-text-muted">Your feedback helps improve future recommendations.</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-6 py-5 space-y-6"
                  >
                    {/* Q1 — Fit */}
                    <div>
                      <p className="text-sm font-semibold text-text-secondary mb-3">How did it fit?</p>
                      <div className="flex flex-wrap gap-2">
                        {fitOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setFit(opt.value === fit ? null : opt.value)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                              fit === opt.value
                                ? 'bg-accent-red/15 border-accent-red text-accent-red'
                                : 'bg-bg-secondary border-white/10 text-text-secondary hover:border-white/30'
                            }`}
                          >
                            <span>{opt.emoji}</span>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Q2 — Use case */}
                    <div>
                      <p className="text-sm font-semibold text-text-secondary mb-3">Right for your purpose?</p>
                      <div className="flex gap-2">
                        {useCaseOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setUseCase(opt.value === useCase ? null : opt.value)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium border transition-all duration-200 ${
                              useCase === opt.value
                                ? 'bg-accent-red/15 border-accent-red text-accent-red'
                                : 'bg-bg-secondary border-white/10 text-text-secondary hover:border-white/30'
                            }`}
                          >
                            <span>{opt.emoji}</span>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Q3 — Style */}
                    <div>
                      <p className="text-sm font-semibold text-text-secondary mb-3">Style preference?</p>
                      <div className="flex gap-2">
                        {styleOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setStyle(opt.value === style ? null : opt.value)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium border transition-all duration-200 ${
                              style === opt.value
                                ? 'bg-accent-red/15 border-accent-red text-accent-red'
                                : 'bg-bg-secondary border-white/10 text-text-secondary hover:border-white/30'
                            }`}
                          >
                            <span>{opt.emoji}</span>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      onClick={handleSubmit}
                      disabled={!canSubmit || submitting}
                      className={`w-full py-3 rounded-xl font-display font-semibold text-sm transition-all duration-200 ${
                        canSubmit && !submitting
                          ? 'bg-accent-red text-white hover:bg-accent-red/90 shadow-lg'
                          : 'bg-bg-secondary text-text-muted cursor-not-allowed'
                      }`}
                    >
                      {submitting ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
