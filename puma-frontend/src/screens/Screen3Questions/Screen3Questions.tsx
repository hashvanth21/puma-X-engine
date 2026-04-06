import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock, MapPin, Activity, Cloud, SlidersHorizontal, Check } from 'lucide-react';
import { PageWrapper, Button, Card } from '@/components';
import { useAppStore } from '@/stores';
import { fadeInUp, slideInRight, itemReveal, staggerContainer } from '@/design/animations';
import type { UseCase, ActivityType, Climate } from '@/types';

type StepKey = 'useCase' | 'hours' | 'activity' | 'climate' | 'priority';

interface StepConfig {
  key: StepKey;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const steps: StepConfig[] = [
  { key: 'useCase', title: 'Where will you use it?', subtitle: 'Select your primary environment', icon: <MapPin size={22} /> },
  { key: 'hours', title: 'How many hours per day?', subtitle: 'Average daily wear time', icon: <Clock size={22} /> },
  { key: 'activity', title: 'What activity type?', subtitle: 'Your primary movement pattern', icon: <Activity size={22} /> },
  { key: 'climate', title: 'What is your climate?', subtitle: 'Typical weather conditions', icon: <Cloud size={22} /> },
  { key: 'priority', title: 'Comfort or Performance?', subtitle: 'Set your priority balance', icon: <SlidersHorizontal size={22} /> },
];

const useCaseOptions: { value: UseCase; label: string; emoji: string }[] = [
  { value: 'daily-commute', label: 'Daily Commute', emoji: '🚶' },
  { value: 'office-wear', label: 'Office / Work', emoji: '💼' },
  { value: 'running', label: 'Running', emoji: '🏃' },
  { value: 'long-standing', label: 'Long Standing', emoji: '🧍' },
  { value: 'gym-casual', label: 'Gym + Casual', emoji: '🏋️' },
  { value: 'rainy-conditions', label: 'Rainy / Wet', emoji: '🌧️' },
];

const hoursOptions = [
  { value: '2-4', label: '2–4 hrs', emoji: '⏱️' },
  { value: '4-8', label: '4–8 hrs', emoji: '🕐' },
  { value: '8-12', label: '8–12 hrs', emoji: '🔋' },
  { value: '12+', label: '12+ hrs', emoji: '⚡' },
];

const activityOptions: { value: ActivityType; label: string; emoji: string }[] = [
  { value: 'running', label: 'Running', emoji: '🏃' },
  { value: 'walking', label: 'Walking', emoji: '🚶' },
  { value: 'standing', label: 'Standing', emoji: '🧍' },
  { value: 'gym-casual', label: 'Gym + Casual', emoji: '🏋️' },
];

const climateOptions: { value: Climate; label: string; emoji: string }[] = [
  { value: 'rainy', label: 'Rainy / Wet', emoji: '🌧️' },
  { value: 'dry', label: 'Dry / Hot', emoji: '☀️' },
];

export default function Screen3Questions() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [useCase, setUseCase] = useState<UseCase | null>(null);
  const [hours, setHours] = useState<string>('');
  const [activity, setActivity] = useState<ActivityType | null>(null);
  const [climate, setClimate] = useState<Climate | null>(null);
  const [priorityScore, setPriorityScore] = useState(50);
  const setContextField = useAppStore((s) => s.setContextField);

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      if (useCase) setContextField('useCase', useCase);
      if (activity) setContextField('activity', activity);
      if (climate) setContextField('climate', climate);
      setContextField('hoursPerDay', parseInt(hours || '6'));
      setContextField('priorityScore', priorityScore);
      navigate('/match');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
    else navigate('/scan');
  };

  const isStepComplete = (): boolean => {
    switch (step.key) {
      case 'useCase': return !!useCase;
      case 'hours': return !!hours;
      case 'activity': return !!activity;
      case 'climate': return !!climate;
      case 'priority': return true;
      default: return false;
    }
  };

  const renderOptions = () => {
    if (step.key === 'useCase') {
      return (
        <div className="grid grid-cols-2 gap-3">
          {useCaseOptions.map((opt) => {
            const isSelected = useCase === opt.value;
            return (
              <motion.button
                key={opt.value}
                onClick={() => setUseCase(opt.value)}
                className={`p-5 rounded-card text-center transition-all duration-200 ${
                  isSelected
                    ? 'bg-bg-card shadow-premium ring-2 ring-accent-red/30'
                    : 'bg-bg-secondary shadow-inset hover:shadow-subtle'
                }`}
                whileTap={{ scale: 0.97 }}
                whileHover={isSelected ? {} : { y: -2 }}
              >
                <span className="text-3xl mb-2 block">{opt.emoji}</span>
                <span className={`text-sm font-medium ${isSelected ? 'text-text-primary' : 'text-text-secondary'}`}>
                  {opt.label}
                </span>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-2 flex justify-center"
                  >
                    <div className="w-5 h-5 rounded-full bg-accent-red flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      );
    }

    if (step.key === 'hours') {
      return (
        <div className="grid grid-cols-2 gap-3">
          {hoursOptions.map((opt) => {
            const isSelected = hours === opt.value;
            return (
              <motion.button
                key={opt.value}
                onClick={() => setHours(opt.value)}
                className={`p-5 rounded-card text-center transition-all duration-200 ${
                  isSelected
                    ? 'bg-bg-card shadow-premium ring-2 ring-accent-red/30'
                    : 'bg-bg-secondary shadow-inset hover:shadow-subtle'
                }`}
                whileTap={{ scale: 0.97 }}
                whileHover={isSelected ? {} : { y: -2 }}
              >
                <span className="text-3xl mb-2 block">{opt.emoji}</span>
                <span className={`text-sm font-medium ${isSelected ? 'text-text-primary' : 'text-text-secondary'}`}>
                  {opt.label}
                </span>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-2 flex justify-center"
                  >
                    <div className="w-5 h-5 rounded-full bg-accent-red flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      );
    }

    if (step.key === 'activity') {
      return (
        <div className="grid grid-cols-2 gap-3">
          {activityOptions.map((opt) => {
            const isSelected = activity === opt.value;
            return (
              <motion.button
                key={opt.value}
                onClick={() => setActivity(opt.value)}
                className={`p-5 rounded-card text-center transition-all duration-200 ${
                  isSelected
                    ? 'bg-bg-card shadow-premium ring-2 ring-accent-red/30'
                    : 'bg-bg-secondary shadow-inset hover:shadow-subtle'
                }`}
                whileTap={{ scale: 0.97 }}
                whileHover={isSelected ? {} : { y: -2 }}
              >
                <span className="text-3xl mb-2 block">{opt.emoji}</span>
                <span className={`text-sm font-medium ${isSelected ? 'text-text-primary' : 'text-text-secondary'}`}>
                  {opt.label}
                </span>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-2 flex justify-center"
                  >
                    <div className="w-5 h-5 rounded-full bg-accent-red flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      );
    }

    if (step.key === 'climate') {
      return (
        <div className="grid grid-cols-2 gap-3">
          {climateOptions.map((opt) => {
            const isSelected = climate === opt.value;
            return (
              <motion.button
                key={opt.value}
                onClick={() => setClimate(opt.value)}
                className={`p-5 rounded-card text-center transition-all duration-200 ${
                  isSelected
                    ? 'bg-bg-card shadow-premium ring-2 ring-accent-red/30'
                    : 'bg-bg-secondary shadow-inset hover:shadow-subtle'
                }`}
                whileTap={{ scale: 0.97 }}
                whileHover={isSelected ? {} : { y: -2 }}
              >
                <span className="text-3xl mb-2 block">{opt.emoji}</span>
                <span className={`text-sm font-medium ${isSelected ? 'text-text-primary' : 'text-text-secondary'}`}>
                  {opt.label}
                </span>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-2 flex justify-center"
                  >
                    <div className="w-5 h-5 rounded-full bg-accent-red flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      );
    }

    return null;
  };

  const renderPrioritySlider = () => (
    <div className="py-6">
      <div className="flex justify-between text-sm text-text-muted mb-4">
        <span className="font-medium">Comfort</span>
        <span className="font-medium">Performance</span>
      </div>
      <div className="relative h-3 bg-bg-secondary rounded-full shadow-inset overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-accent-red rounded-full"
          animate={{ width: `${priorityScore}%` }}
          transition={{ duration: 0.2 }}
        />
        <input
          type="range"
          min="0"
          max="100"
          value={priorityScore}
          onChange={(e) => setPriorityScore(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <p className="text-center text-text-secondary font-medium mt-3">
        {priorityScore < 35 ? 'Maximum comfort focus' : priorityScore > 65 ? 'Maximum performance focus' : 'Balanced approach'}
      </p>
    </div>
  );

  return (
    <PageWrapper className="flex items-center justify-center min-h-screen px-4">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg"
      >
        {/* Progress */}
        <motion.div variants={fadeInUp} className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-muted font-medium uppercase tracking-wider">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-xs text-text-muted font-medium">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-bg-secondary rounded-full shadow-inset overflow-hidden">
            <motion.div
              className="h-full bg-accent-red rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Card className="p-8">
              {/* Question Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent-red/10 flex items-center justify-center text-accent-red">
                  {step.icon}
                </div>
                <div>
                  <h2 className="font-display font-bold text-xl text-text-primary">
                    {step.title}
                  </h2>
                  <p className="text-text-muted text-sm">{step.subtitle}</p>
                </div>
              </div>

              {/* Options */}
              {step.key === 'priority' ? renderPrioritySlider() : renderOptions()}
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div variants={itemReveal} className="mt-6 flex items-center justify-between">
          <Button variant="primary" size="sm" onClick={handleBack}>
            <ArrowLeft size={14} className="mr-1" />
            Back
          </Button>
          <Button
            variant="accent"
            size="sm"
            onClick={handleNext}
            disabled={!isStepComplete()}
          >
            {currentStep === steps.length - 1 ? 'See My Match' : 'Continue'}
            <ArrowRight size={14} className="ml-1" />
          </Button>
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
}
