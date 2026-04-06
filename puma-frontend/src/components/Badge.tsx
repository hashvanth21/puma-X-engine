import { motion } from 'framer-motion';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'accent' | 'success' | 'muted' | 'red';
  className?: string;
  selected?: boolean;
}

const variantClasses: Record<string, string> = {
  accent: 'bg-bg-card text-accent-gold shadow-sm-neumo',
  success: 'bg-green-50 text-green-700 shadow-sm-neumo',
  muted: 'bg-bg-secondary text-text-muted',
  red: 'bg-accent-red/10 text-accent-red',
};

export const Badge = ({ children, variant = 'muted', className = '', selected }: BadgeProps) => (
  <motion.span
    whileTap={selected ? { scale: 0.95 } : undefined}
    className={`inline-flex items-center px-3 py-1 rounded-chip text-xs font-semibold transition-all duration-200 ${variantClasses[variant]} ${selected ? 'ring-2 ring-accent-red ring-offset-2 ring-offset-bg-main' : ''} ${className}`}
  >
    {children}
  </motion.span>
);
