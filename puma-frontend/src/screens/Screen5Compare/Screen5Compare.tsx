import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Trophy } from 'lucide-react';
import { PageWrapper, Button, Card } from '@/components';
import { staggerContainer, fadeInUp, itemReveal } from '@/design/animations';

const comparisonData = {
  shoes: [
    { name: 'Velocity Nitro 3', isWinner: true, matchScore: 94 },
    { name: 'ForeverRun NITRO', isWinner: false, matchScore: 87 },
    { name: 'Deviate NITRO Elite 3', isWinner: false, matchScore: 62 },
  ],
  attributes: [
    { label: 'Wide Foot Comfort', scores: [8, 7, 5] },
    { label: 'Wet Grip', scores: [9, 7, 6] },
    { label: 'Daily Commute', scores: [9, 8, 4] },
    { label: 'Race Performance', scores: [6, 5, 10] },
    { label: 'Arch Support', scores: [8, 8, 6] },
    { label: 'Long-Wear Comfort', scores: [9, 8, 5] },
    { label: 'Weight (lighter = better)', scores: [7, 6, 9] },
  ],
};

export default function Screen5Compare() {
  const navigate = useNavigate();
  const maxScore = 10;

  return (
    <PageWrapper className="px-4 pb-16">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center mb-10 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-chip bg-accent-red/10 mb-4">
            <Trophy size={14} className="text-accent-red" />
            <span className="text-accent-red text-xs font-semibold tracking-wider uppercase">Comparison</span>
          </div>
          <h1 className="font-display font-black text-4xl text-text-primary mb-1">
            Side by Side
          </h1>
          <p className="text-text-muted">
            See how your top matches stack up
          </p>
        </motion.div>

        {/* Shoe Headers */}
        <motion.div variants={fadeInUp} className="mb-8">
          <div className="grid grid-cols-3 gap-4">
            {comparisonData.shoes.map((shoe, i) => (
              <Card
                key={i}
                className={`p-4 text-center ${shoe.isWinner ? 'ring-2 ring-accent-red/30' : ''}`}
              >
                {shoe.isWinner && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-red/10 mb-2">
                    <Trophy size={10} className="text-accent-red" />
                    <span className="text-accent-red text-xs font-semibold">Best Match</span>
                  </div>
                )}
                <p className={`font-display font-bold text-sm ${shoe.isWinner ? 'text-text-primary' : 'text-text-secondary'}`}>
                  {shoe.name}
                </p>
                <p className={`text-2xl font-display font-black mt-1 ${shoe.isWinner ? 'text-accent-red' : 'text-text-muted'}`}>
                  {shoe.matchScore}%
                </p>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Attribute Comparison */}
        <motion.div variants={fadeInUp}>
          <Card className="p-6">
            <h3 className="font-display font-bold text-lg text-text-primary mb-6">
              Attribute Breakdown
            </h3>
            <div className="space-y-5">
              {comparisonData.attributes.map((attr, i) => (
                <motion.div key={attr.label} variants={itemReveal}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-text-secondary">{attr.label}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {attr.scores.map((score, j) => (
                      <div key={j} className="relative">
                        <div className="h-2.5 bg-bg-secondary rounded-full shadow-inset overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full transition-all duration-700 ${
                              j === 0 && comparisonData.shoes[j].isWinner
                                ? 'bg-accent-red'
                                : 'bg-text-muted/40'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${(score / maxScore) * 100}%` }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
                          />
                        </div>
                        <span className="text-xs text-text-muted mt-1 block text-center font-medium">
                          {score}/{maxScore}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div variants={itemReveal} className="mt-8 flex items-center justify-between">
          <Button variant="primary" size="sm" onClick={() => navigate('/match')}>
            <ArrowLeft size={14} className="mr-1" />
            Back to Match
          </Button>
          <Button variant="accent" size="sm" onClick={() => navigate('/ecosystem')}>
            See The Vision
            <ArrowRight size={14} className="ml-1" />
          </Button>
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
}
