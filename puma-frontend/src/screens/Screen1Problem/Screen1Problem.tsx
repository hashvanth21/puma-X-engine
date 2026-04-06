import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PageWrapper, Button, Badge, ProductCard } from '@/components';
import { staggerContainer, fadeInUp, heroFloat, heroFloatLoop } from '@/design/animations';
import { ArrowRight, Shield, Zap, Target, ChevronRight } from 'lucide-react';

const mockShoes = [
  { id: '1', name: 'Velocity Nitro 3', price: '$139', category: 'Running', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop', colors: ['blue', 'black'] },
  { id: '2', name: 'Deviate NITRO Elite 3', price: '$250', category: 'Racing', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop', colors: ['white', 'red'] },
  { id: '3', name: 'ForeverRun NITRO', price: '$159', category: 'Daily Run', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop', colors: ['gray', 'blue'] },
  { id: '4', name: 'Softride Pro', price: '$89', category: 'Lifestyle', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop', colors: ['white', 'black'] },
  { id: '5', name: 'RS-X Efekt', price: '$120', category: 'Lifestyle', image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&h=600&fit=crop', colors: ['green', 'white'] },
  { id: '6', name: 'Electrify NITRO 3', price: '$149', category: 'Speed', image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&h=600&fit=crop', colors: ['red', 'black'] },
  { id: '7', name: 'Magnify NITRO 2', price: '$169', category: 'Cushion', image: 'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=600&h=600&fit=crop', colors: ['black', 'gray'] },
  { id: '8', name: 'Transport', price: '$99', category: 'Trail', image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&h=600&fit=crop', colors: ['black', 'green'] },
];

const problemQuestions = [
  { icon: Shield, text: 'Which fits my arch?' },
  { icon: Zap, text: 'Good for wet roads?' },
  { icon: Target, text: 'Worth standing 8 hrs?' },
  { icon: ArrowRight, text: 'Right for my gait?' },
];

export default function Screen1Problem() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-8 pb-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* Left: Typography */}
          <div>
            <motion.div variants={fadeInUp}>
              <Badge variant="muted" className="mb-6">
                THE PROBLEM WITH ONLINE SHOPPING
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-text-primary leading-none mb-6 tracking-tight"
            >
              Too many shoes.
              <br />
              <span className="text-gradient-red">Zero confidence.</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-text-secondary max-w-lg mb-8 leading-relaxed"
            >
              Every shoe looks great on screen. But which one actually fits <em className="text-text-primary not-italic font-medium">your</em> foot, <em className="text-text-primary not-italic font-medium">your</em> movement, <em className="text-text-primary not-italic font-medium">your</em> world?
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-3 mb-10">
              {problemQuestions.map((q) => (
                <motion.div
                  key={q.text}
                  className="flex items-center gap-2 px-4 py-2.5 bg-bg-card rounded-chip shadow-sm-neumo"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <q.icon size={14} className="text-accent-red" />
                  <span className="text-xs font-medium text-text-secondary">{q.text}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Button
                variant="accent"
                size="lg"
                onClick={() => navigate('/scan')}
                className="group"
              >
                Find My Perfect Fit
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
              <p className="text-text-muted text-xs mt-3 ml-1">
                60 seconds · No registration required
              </p>
            </motion.div>
          </div>

          {/* Right: Floating Shoe */}
          <motion.div
            variants={heroFloat}
            className="relative flex items-center justify-center"
          >
            {/* Background blurred shapes */}
            <div className="absolute w-72 h-72 bg-accent-red/5 rounded-full blur-3xl" />
            <div className="absolute w-48 h-48 bg-accent-blue/5 rounded-full blur-2xl -translate-x-8 translate-y-8" />

            <motion.div
              variants={heroFloatLoop}
              initial="rest"
              animate="float"
              className="relative bg-bg-card rounded-hero shadow-deep p-8 aspect-square max-w-sm w-full flex items-center justify-center overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop"
                alt="Featured PUMA sneaker"
                className="w-full h-full object-cover rounded-card"
              />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-xs text-white/60 uppercase tracking-wider font-medium">Featured</p>
                <p className="text-white font-display font-bold text-xl">Velocity Nitro 3</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Shoe Grid — The "Overwhelming" Problem */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.div variants={fadeInUp} className="text-center mb-10">
            <h2 className="font-display font-bold text-3xl text-text-primary mb-2">
              The Guessing Game
            </h2>
            <p className="text-text-secondary max-w-md mx-auto">
              Hundreds of options. No way to know which one is right for you.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {mockShoes.map((shoe, idx) => (
              <ProductCard
                key={shoe.id}
                {...shoe}
                delay={idx * 0.06}
                onQuickView={() => {}}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Solution CTA */}
      <section className="max-w-3xl mx-auto px-6 lg:px-8 pb-24">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            variants={fadeInUp}
            className="bg-bg-card rounded-hero shadow-premium p-10 lg:p-14 text-center"
          >
            <motion.div
              variants={fadeInUp}
              className="w-16 h-16 rounded-2xl bg-accent-red/10 mx-auto mb-6 flex items-center justify-center"
            >
              <Target size={28} className="text-accent-red" />
            </motion.div>

            <h2 className="font-display font-black text-3xl text-text-primary mb-3">
              There's a better way.
            </h2>
            <p className="text-text-secondary text-base max-w-md mx-auto mb-8 leading-relaxed">
              PUMA's Reality Match Engine scans your foot, understands your life, and matches you to the exact shoe built for your body and world.
            </p>

            <Button
              variant="accent"
              size="lg"
              onClick={() => navigate('/scan')}
              className="w-full sm:w-auto px-12"
            >
              Start Your Foot Scan
              <ArrowRight size={18} className="ml-1" />
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </PageWrapper>
  );
}
