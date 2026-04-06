import { motion } from 'framer-motion';

interface ColorSwatchProps {
  colors: { name: string; value: string }[];
  selectedColor?: string;
  onSelect?: (color: string) => void;
  className?: string;
}

export const ColorSwatch = ({ colors, selectedColor, onSelect, className = '' }: ColorSwatchProps) => (
  <div className={`flex items-center gap-2.5 ${className}`}>
    {colors.map((color) => (
      <motion.button
        key={color.name}
        onClick={() => onSelect?.(color.name)}
        className="relative w-7 h-7 rounded-full border border-border-subtle transition-all duration-200"
        style={{ backgroundColor: color.value }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        aria-label={`Select ${color.name} color`}
      >
        {selectedColor === color.name && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -inset-1 rounded-full ring-2 ring-accent-red ring-offset-2 ring-offset-bg-main"
          />
        )}
      </motion.button>
    ))}
  </div>
);
