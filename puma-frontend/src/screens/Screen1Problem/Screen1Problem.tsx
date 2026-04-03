import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PageWrapper, Button, Badge } from '@/components';
import { staggerContainer, fadeInUp, cardHover } from '@/design/animations';

// Mock shoe data to show the "generic grid" problem
const mockShoes = [
  { id: '1', name: 'Velocity Nitro 3', price: 'Rs. 10,999', category: 'Running', color: 'Electric Blue' },
  { id: '2', name: 'Deviate NITRO Elite 3', price: 'Rs. 22,999', category: 'Racing', color: 'Fast Yellow' },
  { id: '3', name: 'ForeverRun NITRO', price: 'Rs. 12,999', category: 'Running', color: 'Sunset Glow' },
  { id: '4', name: 'Softride Pro', price: 'Rs. 6,999', category: 'Lifestyle', color: 'Puma White' },
  { id: '5', name: 'RS-X Efekt', price: 'Rs. 9,999', category: 'Lifestyle', color: 'Archive Green' },
  { id: '6', name: 'Electrify NITRO 3', price: 'Rs. 11,999', category: 'Speed', color: 'Future Pink' },
  { id: '7', name: 'Magnify NITRO 2', price: 'Rs. 13,999', category: 'Cushion', color: 'Black-White' },
  { id: '8', name: 'Transport', price: 'Rs. 7,999', category: 'Trail', color: 'Dark Coal' },
];

// Premium shoe color gradients for the mock cards (no real images needed)
const shoeGradients = [
  'from-blue-600 to-indigo-900',
  'from-yellow-400 to-orange-600',
  'from-orange-400 to-pink-600',
  'from-gray-100 to-gray-300',
  'from-green-600 to-teal-900',
  'from-pink-500 to-purple-700',
  'from-gray-800 to-black',
  'from-slate-600 to-slate-900',
];

export default function Screen1Problem() {
  const navigate = useNavigate();

  return (
    <PageWrapper className="pt-20 pb-16">
      {/* Hero section — problem statement */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-6 pt-12 pb-8 text-center"
      >
        <motion.div variants={fadeInUp}>
          <Badge variant="muted" className="mb-6">
            🔍 The Problem with Online Shopping
          </Badge>
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          className="font-display font-black text-5xl md:text-7xl text-text-primary leading-tight mb-6"
        >
          Too many shoes.
          <br />
          <span className="text-gradient-accent">Zero confidence.</span>
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="text-xl text-text-secondary max-w-2xl mx-auto mb-4"
        >
          You scroll through hundreds of options. Every shoe looks great on screen.
          But which one actually fits <em>your</em> foot, <em>your</em> walk, <em>your</em> life?
        </motion.p>

        <motion.p
          variants={fadeInUp}
          className="text-base text-text-muted max-w-xl mx-auto mb-12"
        >
          Most people guess. Most guesses are wrong. That's why returns are expensive and trust is low.
        </motion.p>
      </motion.section>

      {/* The "overwhelming" shoe grid */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-6 mb-12"
      >
        <motion.div
          variants={fadeInUp}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {mockShoes.map((shoe, idx) => (
            <motion.div
              key={shoe.id}
              variants={cardHover}
              initial="rest"
              whileHover="hover"
              className="glass-card p-4 cursor-not-allowed relative overflow-hidden group"
            >
              {/* Shoe visual placeholder */}
              <div className={`w-full h-32 rounded-xl bg-gradient-to-br ${shoeGradients[idx]} mb-3 flex items-center justify-center`}>
                <span className="text-4xl opacity-60">👟</span>
              </div>
              
              {/* Confusion overlay — subtle "?" */}
              <div className="absolute inset-0 bg-bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-lg pointer-events-none">
                <span className="text-3xl text-text-muted font-display font-black">?</span>
              </div>

              <p className="text-xs font-semibold text-text-secondary truncate">{shoe.name}</p>
              <p className="text-xs text-text-muted">{shoe.category}</p>
              <p className="text-sm font-bold text-text-primary mt-1">{shoe.price}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Problem labels */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-wrap justify-center gap-3 mt-6"
        >
          {['Which fits my arch?', 'Good for wet roads?', 'Worth standing 8 hrs?', 'Right for my gait?'].map((q) => (
            <span key={q} className="px-4 py-2 bg-accent-red/10 border border-accent-red/20 rounded-full text-xs text-accent-red/80">
              ❓ {q}
            </span>
          ))}
        </motion.div>
      </motion.section>

      {/* The solution CTA */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-xl mx-auto px-6 text-center"
      >
        <motion.div
          variants={fadeInUp}
          className="glass-card p-8 border border-accent/20"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-accent mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">🦶</span>
          </div>
          <h2 className="font-display font-black text-2xl text-text-primary mb-3">
            There's a better way.
          </h2>
          <p className="text-text-secondary text-sm mb-6">
            PUMA's Reality Match Engine scans your foot, understands your life, and matches you to the exact shoe built for your body and world.
          </p>
          <Button
            size="lg"
            className="w-full font-display text-xl py-5"
            onClick={() => navigate('/scan')}
            id="start-scan-cta"
          >
            Find My Perfect Fit →
          </Button>
          <p className="text-text-muted text-xs mt-3">
            60 seconds · No registration required
          </p>
        </motion.div>
      </motion.section>
    </PageWrapper>
  );
}
