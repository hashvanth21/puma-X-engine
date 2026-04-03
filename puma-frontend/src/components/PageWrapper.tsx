import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '@/design/animations';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const PageWrapper = ({ children, className = '' }: PageWrapperProps) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={pageTransition}
    className={`min-h-screen bg-bg-primary ${className}`}
  >
    {children}
  </motion.div>
);
