import { useState, useCallback } from 'react';
import { useAppStore } from '@/stores';
import type { UserContext } from '@/types';

const TOTAL_STEPS = 5;
const AUTO_ADVANCE_DELAY_MS = 400;

export function useQuestionnaire() {
  const [step, setStep] = useState(0);
  const setContextField = useAppStore((s) => s.setContextField);
  const context = useAppStore((s) => s.context);

  const next = useCallback(() => {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }, []);

  const back = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  const select = useCallback(
    <K extends keyof UserContext>(key: K, value: UserContext[K]) => {
      setContextField(key, value);
      // Auto-advance after brief delay so the user sees the selection highlight
      setTimeout(() => next(), AUTO_ADVANCE_DELAY_MS);
    },
    [setContextField, next],
  );

  const setPriority = useCallback(
    (score: number) => {
      setContextField('priorityScore', score);
      const label = score <= 33 ? 'comfort' : score >= 67 ? 'performance' : 'balanced';
      setContextField('priority', label);
    },
    [setContextField],
  );

  const isFirst = step === 0;
  const isLast = step === TOTAL_STEPS - 1;

  return {
    step,
    totalSteps: TOTAL_STEPS,
    next,
    back,
    select,
    setPriority,
    isFirst,
    isLast,
    context,
  };
}
