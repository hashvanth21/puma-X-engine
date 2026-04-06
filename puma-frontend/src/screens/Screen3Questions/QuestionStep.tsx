import { type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { Card } from '@/components';
import { slideInRight } from '@/design/animations';

export interface QuestionOption<T extends string | number = string> {
  value: T;
  label: string;
  description?: string;
  icon: ReactNode;
}

interface QuestionStepProps<T extends string | number = string> {
  stepIndex: number;
  title: string;
  subtitle: string;
  headerIcon: ReactNode;
  options: QuestionOption<T>[];
  selectedValue: T | null | undefined;
  onSelect: (value: T) => void;
  columns?: 2 | 3;
}

export function QuestionStep<T extends string | number = string>({
  stepIndex,
  title,
  subtitle,
  headerIcon,
  options,
  selectedValue,
  onSelect,
  columns = 2,
}: QuestionStepProps<T>) {
  const gridCols = columns === 3 ? 'grid-cols-3' : 'grid-cols-2';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepIndex}
        variants={slideInRight}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Card className="p-8">
          {/* Question Header */}
          <div className="flex items-center gap-3 mb-7">
            <div className="w-11 h-11 rounded-xl bg-accent-red/10 flex items-center justify-center text-accent-red">
              {headerIcon}
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-text-primary">
                {title}
              </h2>
              <p className="text-text-muted text-sm">{subtitle}</p>
            </div>
          </div>

          {/* Option Cards Grid */}
          <div className={`grid ${gridCols} gap-3`}>
            {options.map((opt) => {
              const isSelected = selectedValue === opt.value;

              return (
                <motion.button
                  key={String(opt.value)}
                  onClick={() => onSelect(opt.value)}
                  className={`relative p-5 rounded-card text-center transition-all duration-200 ${
                    isSelected
                      ? 'bg-bg-card shadow-premium ring-2 ring-accent-red/30'
                      : 'bg-bg-secondary shadow-inset hover:shadow-subtle'
                  }`}
                  whileTap={{ scale: 0.97 }}
                  whileHover={isSelected ? {} : { y: -2 }}
                >
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 mx-auto mb-3 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? 'bg-accent-red/15 text-accent-red'
                        : 'bg-bg-main/60 text-text-secondary'
                    }`}
                  >
                    {opt.icon}
                  </div>

                  {/* Label */}
                  <span
                    className={`text-sm font-semibold block ${
                      isSelected ? 'text-text-primary' : 'text-text-secondary'
                    }`}
                  >
                    {opt.label}
                  </span>

                  {/* Optional description */}
                  {opt.description && (
                    <span className="text-xs text-text-muted mt-1 block leading-snug">
                      {opt.description}
                    </span>
                  )}

                  {/* Selection checkmark */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      className="absolute top-2.5 right-2.5"
                    >
                      <div className="w-5 h-5 rounded-full bg-accent-red flex items-center justify-center">
                        <Check size={11} className="text-white" strokeWidth={3} />
                      </div>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
