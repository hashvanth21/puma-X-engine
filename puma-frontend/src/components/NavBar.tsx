import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Heart, ShoppingBag, User } from 'lucide-react';

interface NavBarProps {
  currentStep?: number;
  totalSteps?: number;
  onReset?: () => void;
}

const navLinks = ['New', 'Men', 'Women', 'Performance', 'Running'];

export const NavBar = ({ currentStep, totalSteps, onReset }: NavBarProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-premium ${
        scrolled
          ? 'bg-bg-dark/95 backdrop-blur-xl shadow-lg shadow-black/10'
          : 'bg-bg-dark backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <span className="font-display font-black text-xl text-white tracking-widest">
              PUMA
            </span>
            <span className="hidden sm:block text-xs text-white/40 font-medium uppercase tracking-widest">
              Reality Match
            </span>
          </div>

          {/* Center: Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.a
                key={link}
                href="#"
                className="relative text-sm text-white/60 hover:text-white transition-colors duration-200 py-1"
                whileHover={{ y: -1 }}
              >
                {link}
                <motion.span
                  className="absolute bottom-0 left-0 right-0 h-px bg-accent-red"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.a>
            ))}
          </div>

          {/* Right: Icons + Progress */}
          <div className="flex items-center gap-4">
            {currentStep && totalSteps && (
              <div className="hidden md:flex items-center gap-2 mr-2">
                {Array.from({ length: totalSteps }, (_, i) => (
                  <motion.div
                    key={i}
                    className={`rounded-full transition-all duration-300 ${
                      i < currentStep
                        ? 'bg-accent-red h-1 w-6'
                        : 'bg-white/20 h-1 w-3'
                    }`}
                    layout
                  />
                ))}
              </div>
            )}

            <div className="flex items-center gap-3">
              {[Search, Heart, ShoppingBag, User].map((Icon, i) => (
                <motion.button
                  key={i}
                  className="text-white/50 hover:text-white transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={18} strokeWidth={1.5} />
                </motion.button>
              ))}
            </div>

            {onReset && (
              <motion.button
                onClick={onReset}
                className="text-xs text-white/40 hover:text-white/70 transition-colors ml-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reset
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Subtle bottom border */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </motion.nav>
  );
};
