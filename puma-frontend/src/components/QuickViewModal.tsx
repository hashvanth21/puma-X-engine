import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './Button';

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    category: string;
    price: string;
    images: string[];
    description: string;
    sizes: string[];
    colors: { name: string; value: string }[];
  };
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const panelVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: 40,
    scale: 0.96,
    transition: { duration: 0.25 },
  },
};

export const QuickViewModal = ({ isOpen, onClose, product }: QuickViewModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal Panel */}
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl md:max-h-[85vh] z-50 bg-bg-card rounded-hero shadow-deep overflow-hidden"
          >
            {/* Close Button */}
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-bg-secondary rounded-full flex items-center justify-center shadow-subtle"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={18} className="text-text-secondary" />
            </motion.button>

            <div className="flex flex-col md:flex-row h-full overflow-y-auto">
              {/* Image Gallery */}
              <div className="relative w-full md:w-1/2 bg-bg-secondary aspect-square md:aspect-auto">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {product.images.map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-white/60" />
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 p-6 md:p-8 flex flex-col">
                <p className="text-xs text-text-muted uppercase tracking-wider font-medium mb-1">
                  {product.category}
                </p>
                <h2 className="text-text-primary font-display font-bold text-2xl mb-2">
                  {product.name}
                </h2>
                <p className="text-text-primary font-semibold text-xl mb-4">
                  {product.price}
                </p>

                <p className="text-text-secondary text-sm leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Color Selection */}
                <div className="mb-5">
                  <p className="text-sm font-medium text-text-primary mb-2">Color</p>
                  <div className="flex gap-2">
                    {product.colors.map((color) => (
                      <div
                        key={color.name}
                        className="w-7 h-7 rounded-full border border-border-subtle"
                        style={{ backgroundColor: color.value }}
                      />
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-text-primary mb-2">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        className="min-w-10 h-10 px-3 rounded-chip text-sm font-medium bg-bg-secondary text-text-secondary shadow-inset hover:shadow-subtle transition-all duration-200"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto flex flex-col gap-3">
                  <Button variant="accent" size="md" className="w-full">
                    Add to Cart
                  </Button>
                  <Button variant="primary" size="md" className="w-full">
                    Find My Fit
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
