import { motion } from 'framer-motion';

interface FilterChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'color' | 'size';
  colorValue?: string;
  className?: string;
}

export const FilterChip = ({
  label,
  selected = false,
  onClick,
  variant = 'default',
  colorValue,
  className = '',
}: FilterChipProps) => {
  if (variant === 'color') {
    return (
      <motion.button
        onClick={onClick}
        className="relative w-8 h-8 rounded-full transition-all duration-200"
        style={{ backgroundColor: colorValue || label }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
      >
        {selected && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 rounded-full ring-2 ring-accent-red ring-offset-2 ring-offset-bg-main"
          />
        )}
      </motion.button>
    );
  }

  if (variant === 'size') {
    return (
      <motion.button
        onClick={onClick}
        className={`min-w-10 h-10 px-3 rounded-chip text-sm font-medium transition-all duration-200 ${
          selected
            ? 'bg-bg-card text-text-primary shadow-premium ring-1 ring-accent-red/30'
            : 'bg-bg-secondary text-text-secondary shadow-inset'
        } ${className}`}
        whileTap={{ scale: 0.95 }}
      >
        {label}
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className={`px-4 py-2 rounded-chip text-sm font-medium transition-all duration-200 ${
        selected
          ? 'bg-bg-card text-text-primary shadow-premium ring-1 ring-accent-red/30'
          : 'bg-bg-secondary text-text-secondary shadow-inset hover:shadow-subtle'
      } ${className}`}
      whileTap={{ scale: 0.96 }}
    >
      {label}
    </motion.button>
  );
};
