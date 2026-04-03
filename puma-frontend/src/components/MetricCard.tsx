import { motion } from 'framer-motion';
import { fadeInUp } from '@/design/animations';

interface MetricCardProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  unit?: string;
  delay?: number;
}

export const MetricCard = ({ label, value, icon, unit, delay = 0 }: MetricCardProps) => (
  <motion.div
    variants={fadeInUp}
    custom={delay}
    className="glass-card p-5 flex items-center gap-4 group"
  >
    {/* Icon circle */}
    {icon && (
      <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0 group-hover:bg-accent/20 transition-colors duration-300">
        {icon}
      </div>
    )}

    {/* Text */}
    <div className="flex-1 min-w-0">
      <p className="text-text-muted text-xs uppercase tracking-wider font-medium mb-0.5">
        {label}
      </p>
      <p className="text-text-primary font-display font-bold text-lg leading-tight truncate">
        {value}
        {unit && <span className="text-text-secondary text-sm font-normal ml-1">{unit}</span>}
      </p>
    </div>

    {/* Subtle accent bar on the right */}
    <motion.div
      className="w-1 h-8 rounded-full bg-gradient-accent"
      initial={{ scaleY: 0, originY: 1 }}
      animate={{ scaleY: 1 }}
      transition={{ delay: delay + 0.3, duration: 0.4, ease: 'easeOut' }}
    />
  </motion.div>
);
