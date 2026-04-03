import { motion } from 'framer-motion';
import { cardHover } from '@/design/animations';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
  selected?: boolean;
}

export const Card = ({ children, className = '', hoverable, onClick, selected }: CardProps) => (
  <motion.div
    variants={hoverable ? cardHover : undefined}
    initial={hoverable ? 'rest' : undefined}
    whileHover={hoverable ? 'hover' : undefined}
    onClick={onClick}
    className={`glass-card p-6 ${selected ? 'border-accent/50 bg-accent/5' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
  >
    {children}
  </motion.div>
);
