import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface SlideInPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const panelVariants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    x: '100%',
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

export const SlideInPanel = ({ isOpen, onClose, title, children }: SlideInPanelProps) => (
  <AnimatePresence>
    {isOpen && (
      <>
        {/* Backdrop */}
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          onClick={onClose}
        />

        {/* Slide-in Panel */}
        <motion.div
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-bg-card shadow-deep z-50 overflow-y-auto rounded-l-hero"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-bg-card/90 backdrop-blur-md border-b border-border-subtle px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-display font-bold text-text-primary">{title}</h2>
            <motion.button
              onClick={onClose}
              className="w-9 h-9 bg-bg-secondary rounded-full flex items-center justify-center shadow-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={16} className="text-text-secondary" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-6">{children}</div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);
