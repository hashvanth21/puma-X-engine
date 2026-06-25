import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Shield, Zap, Heart, Star, X, MessageSquare } from 'lucide-react';
import { PageWrapper, Button, Card, Badge } from '@/components';
import FeedbackModal from '@/components/FeedbackModal';
import { staggerContainer, fadeInUp, itemReveal, scaleReveal } from '@/design/animations';
import { useAppStore } from '@/stores';
import type { RecommendationWithML, MLConfidence, MLExplanation } from '@/types';

// ─── Static fallback (demo mode / API unavailable) ─────────────────────────

const STATIC_FALLBACK: RecommendationWithML = {
  primary: {
    id: 'velocity-nitro-3',
    name: 'Velocity Nitro 3',
    model: 'Velocity NITRO 3',
    colorway: 'Electric Blue',
    price: 139,
    imageUrl:
      'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_800/global/377748/01/sv01/fnd/PNA/fmt/png',
    category: 'running',
    attributes: {
      wideFootScore: 6,
      wetGripScore: 7,
      dailyCommuteScore: 7,
      raceUseScore: 8,
      longWearComfortScore: 8,
      runningScore: 9,
      archSuitability: ['low', 'medium', 'high'],
      pronationSupport: ['neutral', 'overpronation'],
      weight: 265,
      idealEnvironment: ['dry', 'rainy'],
    },
    description: 'Elite daily trainer with NITRO foam',
    techFeatures: ['NITRO foam', 'PUMAGRIP', 'PWRTAPE'],
    tagline: 'Run faster, recover faster',
    modelYear: 2024,
  },
  primaryMatchScore: 94,
  primaryReasons: [
    { attribute: 'width', explanation: 'Standard width last matches your foot profile', positive: true },
    { attribute: 'cushioning', explanation: 'NITRO foam ideal for your forefoot strike pattern', positive: true },
    { attribute: 'arch', explanation: 'Medium arch support aligns with your biomechanics', positive: true },
  ],
  alternate: {
    id: 'foreverrun-nitro-2',
    name: 'ForeverRun NITRO',
    model: 'ForeverRun NITRO 2',
    colorway: 'Black/White',
    price: 159,
    imageUrl:
      'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_800/global/310109/01/sv01/fnd/PNA/fmt/png',
    category: 'running',
    attributes: {
      wideFootScore: 5,
      wetGripScore: 8,
      dailyCommuteScore: 8,
      raceUseScore: 6,
      longWearComfortScore: 9,
      runningScore: 8,
      archSuitability: ['low', 'medium', 'high'],
      pronationSupport: ['neutral', 'overpronation', 'supination'],
      weight: 280,
      idealEnvironment: ['dry', 'rainy'],
    },
    description: 'Maximum daily comfort runner',
    techFeatures: ['NITRO foam', 'ForeverFOAM', 'PUMAGRIP'],
    tagline: 'Run forever in comfort',
    modelYear: 2024,
  },
  alternateMatchScore: 87,
  eliminatedShoes: [
    {
      shoe: {
        id: 'deviate-nitro-3',
        name: 'Deviate NITRO Elite 3',
        model: 'Deviate NITRO 3',
        colorway: 'Carbon/Red',
        price: 249,
        imageUrl: '',
        category: 'running',
        attributes: {
          wideFootScore: 4,
          wetGripScore: 6,
          dailyCommuteScore: 4,
          raceUseScore: 10,
          longWearComfortScore: 5,
          runningScore: 10,
          archSuitability: ['medium', 'high'],
          pronationSupport: ['neutral'],
          weight: 195,
          idealEnvironment: ['dry'],
        },
        description: 'Elite race-day shoe',
        techFeatures: ['Carbon plate', 'NITRO Elite foam'],
        tagline: 'Break your limits',
        modelYear: 2024,
      },
      reason: 'Racing plate too aggressive for daily use',
    },
    {
      shoe: {
        id: 'rs-x',
        name: 'RS-X Efekt',
        model: 'RS-X',
        colorway: 'White/Navy',
        price: 110,
        imageUrl: '',
        category: 'lifestyle',
        attributes: {
          wideFootScore: 7,
          wetGripScore: 4,
          dailyCommuteScore: 6,
          raceUseScore: 2,
          longWearComfortScore: 7,
          runningScore: 3,
          archSuitability: ['low', 'medium', 'high'],
          pronationSupport: ['neutral'],
          weight: 340,
          idealEnvironment: ['dry'],
        },
        description: 'Chunky lifestyle runner',
        techFeatures: ['RS cushioning', 'Suede overlays'],
        tagline: 'Style meets comfort',
        modelYear: 2024,
      },
      reason: 'Lifestyle weight — not optimized for running',
    },
  ],
  generatedAt: new Date().toISOString(),
  mlConfidence: {
    probability: 0.89,
    confidence: 'high',
    top_features: ['wide_foot_compatibility', 'arch_support_match', 'running_performance'],
    model_version: 'feature-weight-v1',
    hybrid_weights: { rule_engine: '60%', ml_predictor: '40%' },
    score_breakdown: { rule_contribution: 57, ml_contribution: 36 },
    swapped_by_ml: false,
  },
  mlExplanation: {
    explanation:
      '89% of users with a standard-width foot + running had the best results with Velocity NITRO 3',
    similar_users_count: 0,
    success_rate: 0.89,
    match_criteria: ['standard', 'running'],
    data_source: 'prior',
    arch_explanation: 'Biomechanically suited for neutral arch profiles',
  },
};

// ─── Reason icon picker ─────────────────────────────────────────────────────

function getReasonIcon(attribute: string) {
  if (attribute === 'arch' || attribute === 'pronation') return Shield;
  if (attribute === 'cushioning' || attribute === 'performance') return Zap;
  return Heart;
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function Screen4Match() {
  const navigate = useNavigate();
  const {
    sessionId,
    recommendationId,
    trackInteraction,
    flushEvents,
    footProfile,
    context,
    recommendation: storedRec,
    setRecommendation,
  } = useAppStore();

  const [liveRec, setLiveRec] = useState<RecommendationWithML | null>(
    storedRec as RecommendationWithML | null
  );
  const [loading, setLoading] = useState(!storedRec);
  const [apiError, setApiError] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);
  const [alternativesExpanded, setAlternativesExpanded] = useState(false);

  // Fetch recommendation from API if not already in store
  useEffect(() => {
    if (storedRec) {
      setLiveRec(storedRec as RecommendationWithML);
      setLoading(false);
      return;
    }

    if (!footProfile || !context?.useCase) {
      // No profile data — use static fallback for demo mode
      setLoading(false);
      setApiError(true);
      return;
    }

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3001';

    fetch(`${BACKEND_URL}/api/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        footProfile,
        context,
        session_id: sessionId ?? undefined,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.recommendation) {
          const rec: RecommendationWithML = {
            primary: data.recommendation.primary,
            primaryMatchScore: data.recommendation.primaryMatchScore,
            primaryReasons: data.recommendation.primaryReasons ?? [],
            alternate: data.recommendation.alternate,
            alternateMatchScore: data.recommendation.alternateMatchScore,
            eliminatedShoes: data.recommendation.eliminatedShoes ?? [],
            generatedAt: data.recommendation.generatedAt ?? new Date().toISOString(),
            mlConfidence: (data.ml_confidence as MLConfidence) ?? null,
            mlExplanation: (data.ml_explanation as MLExplanation) ?? null,
          };
          setLiveRec(rec);
          setRecommendation(rec);
        } else {
          setApiError(true);
        }
      })
      .catch(() => setApiError(true))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Derive display data — use live API data or static fallback
  const displayRec = apiError || !liveRec ? STATIC_FALLBACK : liveRec;
  const primaryName = displayRec.primary.name ?? displayRec.primary.model;
  const primaryScore = displayRec.primaryMatchScore;
  const primaryImage = displayRec.primary.imageUrl;
  const primaryPrice = `$${displayRec.primary.price}`;
  const primaryReasons = displayRec.primaryReasons ?? [];
  const alternateName = displayRec.alternate.name ?? displayRec.alternate.model;
  const alternateScore = displayRec.alternateMatchScore;
  const alternateImage = displayRec.alternate.imageUrl;
  const alternatePrice = `$${displayRec.alternate.price}`;
  const eliminatedList = displayRec.eliminatedShoes ?? [];
  const mlConf = displayRec.mlConfidence;
  const mlExpl = displayRec.mlExplanation;

  const handlePrimaryClick = () => {
    trackInteraction('clicked_primary', { model: primaryName });
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

  // Loading state
  if (loading) {
    return (
      <PageWrapper className="px-4 pb-16">
        <div className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 rounded-full border-2 border-accent-red border-t-transparent"
          />
          <p className="text-text-muted text-sm">Analyzing your profile...</p>
        </div>
      </PageWrapper>
    );
  }

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
              {primaryImage ? (
                <img
                  src={primaryImage}
                  alt={primaryName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-text-muted text-sm">No image available</span>
                </div>
              )}
              {/* Match Score Badge */}
              <div className="absolute top-4 right-4 bg-bg-card rounded-full shadow-premium px-4 py-2">
                <span className="text-accent-red font-display font-black text-2xl">
                  {primaryScore}%
                </span>
                <span className="text-text-muted text-xs ml-1">match</span>
              </div>
            </div>

            {/* Details */}
            <div className="p-6">
              <Badge variant="muted" className="mb-2">{displayRec.primary.category}</Badge>
              <h2 className="font-display font-black text-2xl text-text-primary mb-1">
                {primaryName}
              </h2>
              <p className="text-text-primary font-semibold text-xl mb-5">
                {primaryPrice}
              </p>

              {/* Match Reasons */}
              <div className="space-y-3 mb-6">
                {primaryReasons.map((reason, i) => {
                  const Icon = getReasonIcon(reason.attribute);
                  return (
                    <motion.div
                      key={i}
                      variants={itemReveal}
                      className="flex items-start gap-3 p-3 bg-bg-secondary rounded-chip shadow-inset"
                    >
                      <div className="w-8 h-8 rounded-lg bg-accent-red/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon size={14} className="text-accent-red" />
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">{reason.explanation}</p>
                    </motion.div>
                  );
                })}
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

        {/* ML Confidence Explanation Card */}
        {mlConf && mlExpl && (
          <motion.div variants={fadeInUp} className="mb-6">
            <Card className="p-5 border border-accent-red/20 bg-gradient-to-br from-bg-card to-bg-secondary">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-accent-red/10 flex items-center justify-center shrink-0">
                  <Zap size={13} className="text-accent-red" />
                </div>
                <span className="text-xs font-semibold text-accent-red uppercase tracking-wider">
                  Why We're Confident
                </span>
              </div>

              {/* Main explanation sentence */}
              <p className="text-sm text-text-primary font-medium leading-relaxed mb-4">
                {mlExpl.explanation}
              </p>

              {/* Confidence probability bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-text-muted">Match confidence</span>
                  <span className="text-xs font-bold text-accent-red">
                    {Math.round(mlConf.probability * 100)}%
                  </span>
                </div>
                <div className="h-1.5 bg-bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round(mlConf.probability * 100)}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                    className="h-full bg-gradient-to-r from-accent-red to-red-400 rounded-full"
                  />
                </div>
              </div>

              {/* Top features chips */}
              {mlConf.top_features.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {mlConf.top_features.map((feat) => (
                    <span
                      key={feat}
                      className="px-2.5 py-1 bg-accent-red/10 text-accent-red text-xs font-medium rounded-chip"
                    >
                      {feat.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                  ))}
                </div>
              )}

              {/* Arch explanation */}
              <p className="text-xs text-text-muted leading-relaxed">
                {mlExpl.arch_explanation}
              </p>

              {/* Hybrid scoring footnote */}
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-text-muted">
                  Rule engine {mlConf.hybrid_weights.rule_engine} · ML {mlConf.hybrid_weights.ml_predictor}
                </span>
                <span className="text-xs text-text-muted">{mlConf.model_version}</span>
              </div>
            </Card>
          </motion.div>
        )}

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
                  {alternateImage ? (
                    <img
                      src={alternateImage}
                      alt={alternateName}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-bg-secondary" />
                  )}
                  <div className="flex-1">
                    <p className="text-xs text-text-muted uppercase tracking-wider">
                      {displayRec.alternate.category}
                    </p>
                    <p className="font-display font-semibold text-text-primary">{alternateName}</p>
                    <p className="text-text-secondary font-medium">{alternatePrice}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-accent-red font-display font-bold text-xl">
                      {alternateScore}%
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
            {eliminatedList.map((entry, i) => {
              const shoeName = entry.shoe.name ?? entry.shoe.model;
              const shoeScore = (entry.shoe as RecommendationWithML['primary'] & { matchScore?: number }).matchScore;
              return (
                <Card key={i} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-bg-secondary shadow-inset flex items-center justify-center">
                        <X size={14} className="text-text-muted" />
                      </div>
                      <div>
                        <p className="font-medium text-text-primary text-sm">{shoeName}</p>
                        <p className="text-xs text-text-muted">{entry.reason}</p>
                      </div>
                    </div>
                    {shoeScore !== undefined && (
                      <span className="text-text-muted font-display font-bold text-sm">{shoeScore}%</span>
                    )}
                  </div>
                </Card>
              );
            })}
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
        shoeModel={primaryName}
      />
    </PageWrapper>
  );
}
