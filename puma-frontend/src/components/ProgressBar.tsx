import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number; // 0–100
  label?: string;
  className?: string;
  color?: 'accent' | 'success' | 'white';
}

const colorClasses = {
  accent: 'bg-gradient-accent',
  success: 'bg-green-500',
  white: 'bg-white',
};

export const ProgressBar = ({ value, label, className = '', color = 'accent' }: ProgressBarProps) => (
  <div className={`w-full ${className}`}>
    {label && <p className="text-xs text-text-muted mb-1">{label}</p>}
    <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${colorClasses[color]}`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  </div>
);
