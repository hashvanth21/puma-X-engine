import { motion } from 'framer-motion';
import { springTransition } from '@/design/animations';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-accent text-black font-bold hover:opacity-90 accent-glow',
  secondary: 'bg-bg-elevated border border-border-subtle text-text-primary hover:border-border-medium',
  ghost: 'bg-transparent text-text-secondary hover:text-text-primary',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm rounded-md',
  md: 'px-6 py-3 text-base rounded-lg',
  lg: 'px-8 py-4 text-lg rounded-xl',
};

export const Button = ({ variant = 'primary', size = 'md', loading, children, className = '', ...props }: ButtonProps) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={springTransition}
    className={`${variantClasses[variant]} ${sizeClasses[size]} font-family-display transition-all duration-200 disabled:opacity-50 ${className}`}
    disabled={loading || props.disabled}
    {...(props as any)}
  >
    {loading ? <span className="animate-pulse">Loading...</span> : children}
  </motion.button>
);
