import { motion } from 'framer-motion';

interface NavBarProps {
  currentStep?: number;
  totalSteps?: number;
  onReset?: () => void;
}

export const NavBar = ({ currentStep, totalSteps, onReset }: NavBarProps) => (
  <motion.nav
    initial={{ y: -60, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
    className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-bg-primary/80 backdrop-blur-md border-b border-border-subtle"
  >
    <div className="flex items-center gap-2">
      <span className="font-display font-black text-xl text-text-primary tracking-wider">PUMA</span>
      <span className="text-xs text-text-muted font-medium uppercase tracking-widest">Reality Match</span>
    </div>
    
    {currentStep && totalSteps && (
      <div className="flex items-center gap-3">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${
              i < currentStep ? 'bg-accent w-6' : 'bg-bg-elevated w-3'
            }`}
          />
        ))}
      </div>
    )}

    {onReset && (
      <button
        onClick={onReset}
        className="text-xs text-text-muted hover:text-text-primary transition-colors"
      >
        Reset
      </button>
    )}
  </motion.nav>
);
