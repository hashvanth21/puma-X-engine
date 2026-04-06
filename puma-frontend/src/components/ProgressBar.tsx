import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  label?: string;
  className?: string;
  color?: 'red' | 'gold' | 'blue';
}

const colorClasses = {
  red: 'bg-accent-red',
  gold: 'bg-accent-gold',
  blue: 'bg-accent-blue',
};

export const ProgressBar = ({ value, label, className = '', color = 'red' }: ProgressBarProps) => (
  <div className={`w-full ${className}`}>
    {label && <p className="text-xs text-text-muted mb-1.5 font-medium">{label}</p>}
    <div className="h-2 bg-bg-secondary rounded-full shadow-inset overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${colorClasses[color]} transition-all duration-500`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  </div>
);
