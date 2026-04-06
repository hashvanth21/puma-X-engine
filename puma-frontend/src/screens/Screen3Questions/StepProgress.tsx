import { motion } from 'framer-motion';

interface StepProgressProps {
  current: number;
  total: number;
}

export const StepProgress = ({ current, total }: StepProgressProps) => (
  <div className="flex items-center justify-center gap-2.5">
    {Array.from({ length: total }).map((_, i) => {
      const isCompleted = i < current;
      const isCurrent = i === current;

      return (
        <motion.div
          key={i}
          className={`rounded-full transition-colors duration-300 ${
            isCompleted
              ? 'bg-accent-red w-2 h-2'
              : isCurrent
                ? 'bg-accent-red w-3 h-3'
                : 'bg-bg-card shadow-smNeumo w-2 h-2'
          }`}
          animate={{ scale: isCurrent ? 1.2 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
      );
    })}
    <span className="ml-2 text-text-muted text-xs font-medium tracking-wide">
      {current + 1}/{total}
    </span>
  </div>
);
