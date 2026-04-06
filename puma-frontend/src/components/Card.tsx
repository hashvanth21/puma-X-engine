import { motion } from 'framer-motion';
import { cardLift } from '@/design/animations';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
  selected?: boolean;
  inset?: boolean;
}

export const Card = ({ children, className = '', hoverable, onClick, selected, inset }: CardProps) => {
  const baseClasses = inset
    ? 'bg-bg-card rounded-card shadow-inset'
    : selected
      ? 'bg-bg-card rounded-card shadow-subtle ring-2 ring-accent-red/30'
      : 'bg-bg-card rounded-card shadow-premium';

  return (
    <motion.div
      variants={hoverable ? cardLift : undefined}
      initial={hoverable ? 'rest' : undefined}
      whileHover={hoverable ? 'hover' : undefined}
      onClick={onClick}
      className={`${baseClasses} transition-all duration-300 ease-premium ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};
