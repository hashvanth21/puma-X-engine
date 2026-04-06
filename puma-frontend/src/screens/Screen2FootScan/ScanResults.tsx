import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ruler, Mountain, Footprints, Hash, ArrowRight } from 'lucide-react';
import { MetricCard, Button } from '@/components';
import { useAppStore } from '@/stores';
import { staggerContainer, fadeInUp } from '@/design/animations';
import type { FootProfile } from '@/types';

const MOCK_FOOT_PROFILE: FootProfile = {
  width: 'standard',
  arch: 'medium',
  pronation: 'neutral',
  estimatedSize: 43,
  scanConfidence: 94,
};

const metrics = [
  { label: 'Foot Width', value: 'Standard', icon: <Ruler className="w-5 h-5" /> },
  { label: 'Arch Type', value: 'Medium', icon: <Mountain className="w-5 h-5" /> },
  { label: 'Pressure Distribution', value: 'Forefoot Strike', icon: <Footprints className="w-5 h-5" /> },
  { label: 'Estimated Size', value: '43', unit: 'EU', icon: <Hash className="w-5 h-5" /> },
];

export default function ScanResults() {
  const navigate = useNavigate();
  const setFootProfile = useAppStore((s) => s.setFootProfile);

  useEffect(() => {
    setFootProfile(MOCK_FOOT_PROFILE);
  }, [setFootProfile]);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="w-full max-w-lg mx-auto px-4"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-chip bg-accent-red/10 mb-4">
          <div className="w-2 h-2 rounded-full bg-accent-red animate-pulse" />
          <span className="text-accent-red text-xs font-semibold tracking-wider uppercase">Scan Complete</span>
        </div>
        <h2 className="font-display font-black text-3xl text-text-primary mb-1">
          Your Foot Profile
        </h2>
        <p className="text-text-muted text-sm">
          94% confidence · Biomechanical analysis
        </p>
      </motion.div>

      {/* Metric cards */}
      <div className="flex flex-col gap-3 mb-8">
        {metrics.map((m, i) => (
          <MetricCard key={m.label} {...m} delay={i * 0.12} />
        ))}
      </div>

      {/* CTA */}
      <motion.div variants={fadeInUp} className="text-center">
        <Button variant="accent" size="lg" onClick={() => navigate('/questions')}>
          Continue to Reality Questions
          <ArrowRight size={18} className="ml-1" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
