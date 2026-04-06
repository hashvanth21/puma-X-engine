import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ArrowRight } from 'lucide-react';
import { Card, Button } from '@/components';
import { slideInRight } from '@/design/animations';

interface PrioritySliderProps {
  value: number;
  onChange: (score: number) => void;
  onFinish: () => void;
}

function getPriorityLabel(score: number): string {
  if (score <= 33) return 'Comfort-Focused';
  if (score >= 67) return 'Performance-Focused';
  return 'Balanced';
}

function getPriorityDescription(score: number): string {
  if (score <= 33) return 'Prioritises cushioning, support, and all-day wear comfort';
  if (score >= 67) return 'Optimised for speed, responsiveness, and competitive performance';
  return 'Best of both worlds — comfort meets capability';
}

export function PrioritySlider({ value, onChange, onFinish }: PrioritySliderProps) {
  const label = getPriorityLabel(value);
  const description = getPriorityDescription(value);
  const fillPercent = value;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="priority-slider"
        variants={slideInRight}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Card className="p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-7">
            <div className="w-11 h-11 rounded-xl bg-accent-red/10 flex items-center justify-center text-accent-red">
              <SlidersHorizontal size={22} />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-text-primary">
                Comfort or Performance?
              </h2>
              <p className="text-text-muted text-sm">Set your priority balance</p>
            </div>
          </div>

          {/* Slider Section */}
          <div className="py-6">
            {/* Labels */}
            <div className="flex justify-between text-sm mb-5">
              <span className={`font-semibold transition-colors duration-200 ${
                value <= 33 ? 'text-accent-red' : 'text-text-muted'
              }`}>
                Comfort
              </span>
              <span className={`font-semibold transition-colors duration-200 ${
                value > 33 && value < 67 ? 'text-accent-gold' : 'text-text-muted'
              }`}>
                Balanced
              </span>
              <span className={`font-semibold transition-colors duration-200 ${
                value >= 67 ? 'text-accent-red' : 'text-text-muted'
              }`}>
                Performance
              </span>
            </div>

            {/* Track & Thumb */}
            <div className="relative h-3 bg-bg-secondary rounded-full shadow-inset overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full rounded-full"
                style={{
                  background: value <= 33
                    ? 'linear-gradient(90deg, #D90429, #EF233C)'
                    : value >= 67
                      ? 'linear-gradient(90deg, #C8A000, #D90429)'
                      : 'linear-gradient(90deg, #C8A000, #FFC800)',
                }}
                animate={{ width: `${fillPercent}%` }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
              />
              <input
                id="priority-slider-input"
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="priority-range-input absolute inset-0 w-full h-full cursor-pointer"
                aria-label="Priority balance slider"
              />
            </div>

            {/* Dynamic Label */}
            <div className="text-center mt-5">
              <motion.p
                key={label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-text-primary font-display font-bold text-lg"
              >
                {label}
              </motion.p>
              <motion.p
                key={description}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-text-muted text-sm mt-1"
              >
                {description}
              </motion.p>
            </div>
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4"
          >
            <Button
              variant="accent"
              size="lg"
              onClick={onFinish}
              className="w-full"
            >
              See Your Match
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
