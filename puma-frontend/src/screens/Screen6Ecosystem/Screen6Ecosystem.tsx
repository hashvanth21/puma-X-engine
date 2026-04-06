import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shirt, RefreshCw, Bell, Heart, ArrowRight, Sparkles } from 'lucide-react';
import { PageWrapper, Button, Card } from '@/components';
import { staggerContainer, fadeInUp, itemReveal, scaleReveal } from '@/design/animations';

const ecosystemCards = [
  {
    icon: Shirt,
    title: 'Apparel Matching',
    description: 'Complete your look with AI-matched apparel based on your body type, climate, and the shoe you chose.',
    status: 'Coming Phase 2',
    color: 'text-accent-blue',
    bgColor: 'bg-accent-blue/10',
  },
  {
    icon: RefreshCw,
    title: 'Smart Replacement',
    description: 'We track your shoe wear patterns and remind you when it is time for a fresh pair — before your feet feel it.',
    status: 'Coming Phase 3',
    color: 'text-accent-red',
    bgColor: 'bg-accent-red/10',
  },
  {
    icon: Bell,
    title: 'Daily Fit Alerts',
    description: 'Weather-aware daily recommendations that adapt your shoe and outfit choice to conditions in real time.',
    status: 'Coming Phase 3',
    color: 'text-accent-gold',
    bgColor: 'bg-accent-gold/10',
  },
  {
    icon: Heart,
    title: 'Loyalty & Rewards',
    description: 'Earn points for every perfect match. Unlock exclusive access to limited drops and personalized collections.',
    status: 'Coming Phase 4',
    color: 'text-accent-red',
    bgColor: 'bg-accent-red/10',
  },
];

export default function Screen6Ecosystem() {
  const navigate = useNavigate();

  return (
    <PageWrapper className="px-4 pb-16">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center mb-12 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-chip bg-accent-red/10 mb-4">
            <Sparkles size={14} className="text-accent-red" />
            <span className="text-accent-red text-xs font-semibold tracking-wider uppercase">The Future</span>
          </div>
          <h1 className="font-display font-black text-4xl lg:text-5xl text-text-primary mb-2">
            Beyond The Shoe
          </h1>
          <p className="text-text-muted max-w-lg mx-auto">
            Reality Match Engine is the foundation. Here is where it goes next.
          </p>
        </motion.div>

        {/* Ecosystem Grid */}
        <div className="grid md:grid-cols-2 gap-5 mb-12">
          {ecosystemCards.map((card, i) => (
            <motion.div key={card.title} variants={itemReveal} custom={i}>
              <Card hoverable className="p-6 h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center`}>
                    <card.icon size={22} className={card.color} />
                  </div>
                  <span className="text-xs text-text-muted font-medium">{card.status}</span>
                </div>
                <h3 className="font-display font-bold text-lg text-text-primary mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed flex-1">
                  {card.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Vision Statement */}
        <motion.div variants={scaleReveal}>
          <Card className="p-8 lg:p-10 text-center bg-bg-dark text-white">
            <h2 className="font-display font-black text-2xl lg:text-3xl mb-3">
              PUMA doesn't sell shoes.
              <br />
              <span className="text-gradient-red">It sells certainty.</span>
            </h2>
            <p className="text-white/60 max-w-md mx-auto mb-8 leading-relaxed">
              Every interaction becomes an opportunity to deepen trust, reduce returns, and build a relationship that lasts beyond the first purchase.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="text-center">
                <p className="font-display font-black text-3xl text-accent-red">25%</p>
                <p className="text-white/50 text-xs mt-1">Return Reduction</p>
              </div>
              <div className="text-center">
                <p className="font-display font-black text-3xl text-accent-red">18%</p>
                <p className="text-white/50 text-xs mt-1">Conversion Lift</p>
              </div>
              <div className="text-center">
                <p className="font-display font-black text-3xl text-accent-red">+20%</p>
                <p className="text-white/50 text-xs mt-1">Repeat Purchase</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Navigation */}
        <motion.div variants={itemReveal} className="mt-10 flex items-center justify-center">
          <Button variant="accent" size="lg" onClick={() => navigate('/')}>
            Start Over
            <ArrowRight size={18} className="ml-1" />
          </Button>
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
}
