import { motion, type HTMLMotionProps } from 'framer-motion';

type ButtonVariant = 'primary' | 'accent' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-bg-card text-text-primary font-semibold shadow-premium hover:shadow-deep',
  accent: 'bg-accent-red text-white font-semibold shadow-lg shadow-accent-red/25 hover:shadow-xl hover:shadow-accent-red/30',
  ghost: 'bg-transparent text-text-secondary hover:text-text-primary',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-5 py-2.5 text-sm rounded-button',
  md: 'px-7 py-3 text-base rounded-button',
  lg: 'px-9 py-4 text-lg rounded-button',
};

export const Button = ({ variant = 'primary', size = 'md', loading, children, className = '', ...props }: ButtonProps) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98, transition: { duration: 0.15 } }}
    className={`${variantClasses[variant]} ${sizeClasses[size]} transition-all duration-300 ease-premium disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 ${className}`}
    disabled={loading || props.disabled}
    {...(props as HTMLMotionProps<'button'>)}
  >
    {loading ? (
      <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
    ) : (
      children
    )}
  </motion.button>
);
