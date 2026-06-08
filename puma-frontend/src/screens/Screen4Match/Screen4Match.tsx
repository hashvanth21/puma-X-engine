import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Shield, Zap, Heart, Star, X, MessageSquare } from 'lucide-react';
import { PageWrapper, Button, Card, Badge } from '@/components';
import FeedbackModal from '@/components/FeedbackModal';
import { staggerContainer, fadeInUp, itemReveal, scaleReveal } from '@/design/animations';
import { useAppStore } from '@/stores';

const matchData = {
  primary: {
    name: 'Velocity Nitro 3',
    category: 'Performance Running',
    price: '$139',
    matchScore: 94,
    image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_800/global/377748/01/sv01/fnd/PNA/fmt/png',
    colors: ['Electric Blue', 'Black/White'],
    reasons: [
      { icon: Shield, text: 'Standard width last matches your foot profile' },
      { icon: Zap, text: 'NITRO foam ideal for your forefoot strike pattern' },
      { icon: Heart, text: 'Medium arch support aligns with your biomechanics' },
    ],
  },
  alternate: {
    name: 'ForeverRun NITRO',
    category: 'Daily Running',
    price: '$159',
    matchScore: 87,
    image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_800/global/310109/01/sv01/fnd/PNA/fmt/png',
  },
  eliminated: [
    { name: 'Deviate NITRO Elite 3', reason: 'Racing plate too aggressive for daily use', score: 62 },
    { name: 'RS-X Efekt', reason: 'Lifestyle weight — not optimized for running', score: 45 },
  ],
};

export default function Screen4Match() {
  const navigate = useNavigate();
  const { sessionId, recommendationId, trackInteraction, flushEvents } = useAppStore();

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);
  const [alternativesExpanded, setAlternativesExpanded] = useState(false);

  // Track time spent on this screen + flush on unmount
  useEffect(() => {
    const start = Date.now();
    return () => {
      trackInteraction('time_spent', { duration_ms: Date.now() - start });
      flushEvents();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Delayed feedback prompt — show after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowFeedbackPrompt(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handlePrimaryClick = () => {
    trackInteraction('clicked_primary', { model: matchData.primary.name });
  };

  const handleAlternativesExpand = () => {
    if (!alternativesExpanded) {
      trackInteraction('opened_alternatives');
    }
    setAlternativesExpanded((prev) => !prev);
  };

  const handleFeedbackOpen = () => {
    setFeedbackOpen(true);
    setShowFeedbackPrompt(false);
  };

  const handleFeedbackClose = () => {
    setFeedbackOpen(false);
    flushEvents();
  };

  return (
    <PageWrapper className="px-4 pb-16">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center mb-10 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-chip bg-accent-red/10 mb-4">
            <Star size={14} className="text-accent-red" />
            <span className="text-accent-red text-xs font-semibold tracking-wider uppercase">Your Match</span>
          </div>
          <h1 className="font-display font-black text-4xl text-text-primary mb-1">
            We Found Your Shoe
          </h1>
          <p className="text-text-muted">
            Based on your foot profile and lifestyle context
          </p>
        </motion.div>

        {/* Hero Match Card */}
        <motion.div variants={scaleReveal}>
          <Card className="overflow-hidden mb-6">
            {/* Shoe Image */}
            <div className="relative h-64 bg-bg-secondary overflow-hidden">
              <img
                src={matchData.primary.image}
                alt={matchData.primary.name}
                className="w-full h-full object-cover"
              />
              {/* Match Score Badge */}
              <div className="absolute top-4 right-4 bg-bg-card rounded-full shadow-premium px-4 py-2">
                <span className="text-accent-red font-display font-black text-2xl">
                  {matchData.primary.matchScore}%
                </span>
                <span className="text-text-muted text-xs ml-1">match</span>
              </div>
            </div>

            {/* Details */}
            <div className="p-6">
              <Badge variant="muted" className="mb-2">{matchData.primary.category}</Badge>
              <h2 className="font-display font-black text-2xl text-text-primary mb-1">
                {matchData.primary.name}
              </h2>
              <p className="text-text-primary font-semibold text-xl mb-5">
                {matchData.primary.price}
              </p>

              {/* Match Reasons */}
              <div className="space-y-3 mb-6">
                {matchData.primary.reasons.map((reason, i) => (
                  <motion.div
                    key={i}
                    variants={itemReveal}
                    className="flex items-start gap-3 p-3 bg-bg-secondary rounded-chip shadow-inset"
                  >
                    <div className="w-8 h-8 rounded-lg bg-accent-red/10 flex items-center justify-center shrink-0 mt-0.5">
                      <reason.icon size={14} className="text-accent-red" />
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">{reason.text}</p>
                  </motion.div>
                ))}
              </div>

              {/* Color Options */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm text-text-muted">Available in:</span>
                {matchData.primary.colors.map((color) => (
                  <span key={color} className="text-xs text-text-secondary font-medium">
                    {color}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="accent" size="md" className="flex-1" onClick={handlePrimaryClick}>
                  Add to Cart
                </Button>
                <Button variant="primary" size="md" onClick={() => navigate('/compare')}>
                  Compare
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Alternate Shoe */}
        <motion.div variants={fadeInUp}>
          <button
            className="w-full text-left mb-3"
            onClick={handleAlternativesExpand}
          >
            <h3 className="font-display font-bold text-lg text-text-primary">
              Also Great For You {alternativesExpanded ? '▲' : '▼'}
            </h3>
          </button>
          <AnimatePresence>
            {alternativesExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-8"
              >
                <Card hoverable className="p-4 flex items-center gap-4">
                  <img
                    src={matchData.alternate.image}
                    alt={matchData.alternate.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-xs text-text-muted uppercase tracking-wider">{matchData.alternate.category}</p>
                    <p className="font-display font-semibold text-text-primary">{matchData.alternate.name}</p>
                    <p className="text-text-secondary font-medium">{matchData.alternate.price}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-accent-red font-display font-bold text-xl">
                      {matchData.alternate.matchScore}%
                    </span>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
          {!alternativesExpanded && <div className="mb-8" />}
        </motion.div>

        {/* Why Not Others */}
        <motion.div variants={fadeInUp}>
          <h3 className="font-display font-bold text-lg text-text-primary mb-3">
            Why Not The Others?
          </h3>
          <div className="space-y-3">
            {matchData.eliminated.map((shoe, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-bg-secondary shadow-inset flex items-center justify-center">
                      <X size={14} className="text-text-muted" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary text-sm">{shoe.name}</p>
                      <p className="text-xs text-text-muted">{shoe.reason}</p>
                    </div>
                  </div>
                  <span className="text-text-muted font-display font-bold text-sm">{shoe.score}%</span>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Feedback Prompt — appears after 5s */}
        <AnimatePresence>
          {showFeedbackPrompt && !feedbackOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-8"
            >
              <div className="bg-bg-card border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent-red/10 flex items-center justify-center">
                    <MessageSquare size={16} className="text-accent-red" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">How was this recommendation?</p>
                    <p className="text-xs text-text-muted">Takes 30 seconds</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleFeedbackOpen}
                    className="px-4 py-2 bg-accent-red text-white text-xs font-semibold rounded-xl hover:bg-accent-red/90 transition-colors"
                  >
                    Give Feedback
                  </button>
                  <button
                    onClick={() => setShowFeedbackPrompt(false)}
                    className="p-2 text-text-muted hover:text-text-primary transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <motion.div variants={itemReveal} className="mt-10 flex items-center justify-between">
          <Button variant="primary" size="sm" onClick={() => navigate('/questions')}>
            <ArrowLeft size={14} className="mr-1" />
            Back
          </Button>
          <Button variant="accent" size="sm" onClick={() => navigate('/compare')}>
            Side-by-Side Compare
            <ArrowRight size={14} className="ml-1" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={handleFeedbackClose}
        recommendationId={recommendationId}
        sessionId={sessionId}
        shoeModel={matchData.primary.name}
      />
    </PageWrapper>
  );
}
