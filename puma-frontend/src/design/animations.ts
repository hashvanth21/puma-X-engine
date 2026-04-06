import type { Variants, Transition } from 'framer-motion';

export const premiumEasing = [0.22, 1, 0.36, 1];
export const premiumDuration = 0.3;

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 32 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: premiumEasing, staggerChildren: 0.08 },
  },
  exit: { opacity: 0, y: -24, transition: { duration: 0.25 } },
};

export const pageTransition: Transition = {
  duration: 0.6,
  ease: premiumEasing,
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: premiumEasing },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

export const cardLift = {
  rest: { y: 0 },
  hover: {
    y: -4,
    transition: { duration: premiumDuration, ease: premiumEasing },
  },
};

export const buttonPress = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98, transition: { duration: 0.15 } },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: premiumEasing } },
  exit: { opacity: 0, x: -32, transition: { duration: 0.25 } },
};

export const springTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 28,
};

export const smoothTransition: Transition = {
  duration: premiumDuration,
  ease: premiumEasing,
};

export const scoreBarVariant: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: (score: number) => ({
    scaleX: score / 10,
    originX: 0,
    transition: { duration: 0.8, ease: 'easeOut', delay: 0.2 },
  }),
};

export const scanPulse: Variants = {
  idle: { scale: 1, opacity: 0.3 },
  pulse: {
    scale: [1, 1.06, 1],
    opacity: [0.3, 1, 0.3],
    transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
  },
};

export const scanReveal: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: premiumEasing },
  },
};

export const heroFloat: Variants = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: premiumEasing },
  },
};

export const heroFloatLoop: Variants = {
  rest: { y: 0 },
  float: {
    y: -10,
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
};

export const itemReveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: premiumEasing },
  },
};

export const scaleReveal: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: premiumEasing },
  },
};
