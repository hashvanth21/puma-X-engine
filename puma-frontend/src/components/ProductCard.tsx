import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Eye } from 'lucide-react';

interface ProductCardProps {
  name: string;
  category: string;
  price: string;
  image: string;
  colors?: string[];
  onQuickView?: () => void;
  onFavorite?: () => void;
  delay?: number;
}

const colorMap: Record<string, string> = {
  black: '#111111',
  white: '#F5F5F5',
  red: '#D90429',
  blue: '#2563EB',
  gray: '#9CA3AF',
  green: '#10B981',
};

export const ProductCard = ({
  name,
  category,
  price,
  image,
  colors = ['black'],
  onQuickView,
  onFavorite,
  delay = 0,
}: ProductCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group bg-bg-card rounded-card shadow-premium hover:shadow-deep transition-all duration-300 ease-premium hover:-translate-y-1 cursor-pointer overflow-hidden"
    >
      {/* Image Area */}
      <div className="relative aspect-square bg-bg-secondary rounded-t-card overflow-hidden">
        <motion.img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Overlay Actions */}
        <motion.div
          className="absolute inset-0 bg-black/10 flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        >
          {onQuickView && (
            <motion.button
              onClick={(e) => { e.stopPropagation(); onQuickView(); }}
              className="bg-white/90 backdrop-blur-sm text-text-primary px-4 py-2 rounded-chip text-sm font-medium flex items-center gap-1.5 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Eye size={14} />
              Quick View
            </motion.button>
          )}
        </motion.div>

        {/* Favorite Button */}
        <motion.button
          onClick={(e) => { e.stopPropagation(); setIsFavorited(!isFavorited); onFavorite?.(); }}
          className="absolute top-3 right-3 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart
            size={16}
            className={`transition-colors duration-200 ${isFavorited ? 'fill-accent-red text-accent-red' : 'text-text-muted'}`}
          />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-xs text-text-muted uppercase tracking-wider font-medium mb-1">
          {category}
        </p>
        <h3 className="text-text-primary font-display font-semibold text-base mb-2 truncate">
          {name}
        </h3>
        <p className="text-text-primary font-semibold text-lg mb-3">
          {price}
        </p>

        {/* Color Swatches */}
        {colors.length > 0 && (
          <div className="flex items-center gap-2">
            {colors.map((color) => (
              <motion.div
                key={color}
                className="w-5 h-5 rounded-full border border-border-subtle"
                style={{ backgroundColor: colorMap[color] || color }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
