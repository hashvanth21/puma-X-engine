import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Activity,
  Cloud,
  SlidersHorizontal,
  Briefcase,
  Footprints,
  PersonStanding,
  Dumbbell,
  CloudRain,
  Sun,
  Timer,
  BatteryMedium,
  BatteryFull,
  Zap,
} from 'lucide-react';
import { PageWrapper, Button } from '@/components';
import { fadeInUp, staggerContainer, itemReveal } from '@/design/animations';
import { useQuestionnaire } from '@/hooks/useQuestionnaire';
import { StepProgress } from './StepProgress';
import { QuestionStep, type QuestionOption } from './QuestionStep';
import { PrioritySlider } from './PrioritySlider';
import type { UseCase, ActivityType, Climate } from '@/types';

/* ────────────────────────────────────────────
 * Step configuration
 * ──────────────────────────────────────────── */

interface StepMeta {
  key: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const STEPS: StepMeta[] = [
  { key: 'useCase', title: 'Where will you use them most?', subtitle: 'Select your primary environment', icon: <MapPin size={22} /> },
  { key: 'hours', title: 'How many hours per day?', subtitle: 'Average daily wear time', icon: <Clock size={22} /> },
  { key: 'activity', title: 'Primary activity?', subtitle: 'Your main movement pattern', icon: <Activity size={22} /> },
  { key: 'climate', title: 'Typical weather conditions?', subtitle: 'Your local climate', icon: <Cloud size={22} /> },
  { key: 'priority', title: 'Comfort or Performance?', subtitle: 'Set your priority balance', icon: <SlidersHorizontal size={22} /> },
];

/* ────────────────────────────────────────────
 * Option data
 * ──────────────────────────────────────────── */

const useCaseOptions: QuestionOption<UseCase>[] = [
  { value: 'daily-commute', label: 'Daily Commute', description: 'Everyday travel & errands', icon: <Footprints size={22} /> },
  { value: 'office-wear', label: 'Office Wear', description: 'Work-day comfort', icon: <Briefcase size={22} /> },
  { value: 'running', label: 'Running', description: 'Training & racing', icon: <Activity size={22} /> },
  { value: 'long-standing', label: 'Long Standing', description: 'On your feet 8+ hours', icon: <PersonStanding size={22} /> },
  { value: 'gym-casual', label: 'Gym & Casual', description: 'Mixed workouts & lifestyle', icon: <Dumbbell size={22} /> },
  { value: 'rainy-conditions', label: 'Rainy Conditions', description: 'Wet-weather protection', icon: <CloudRain size={22} /> },
];

const hoursOptions: QuestionOption<number>[] = [
  { value: 3, label: '2–4 hours', description: 'Short sessions', icon: <Timer size={22} /> },
  { value: 5, label: '4–6 hours', description: 'Half-day wear', icon: <Clock size={22} /> },
  { value: 7, label: '6–8 hours', description: 'Full workday', icon: <BatteryMedium size={22} /> },
  { value: 9, label: '8–10 hours', description: 'Extended wear', icon: <BatteryFull size={22} /> },
  { value: 11, label: '10–12 hours', description: 'All-day marathon', icon: <Zap size={22} /> },
];

const activityOptions: QuestionOption<ActivityType>[] = [
  { value: 'running', label: 'Running', description: 'High-impact cardio', icon: <Activity size={22} /> },
  { value: 'walking', label: 'Walking', description: 'Low-impact movement', icon: <Footprints size={22} /> },
  { value: 'standing', label: 'Standing', description: 'Stationary support', icon: <PersonStanding size={22} /> },
  { value: 'gym-casual', label: 'Gym & Casual', description: 'Mixed training', icon: <Dumbbell size={22} /> },
];

const climateOptions: QuestionOption<Climate>[] = [
  { value: 'rainy', label: 'Rainy / Wet', description: 'Frequent rain & moisture', icon: <CloudRain size={22} /> },
  { value: 'dry', label: 'Dry / Warm', description: 'Sunshine & ventilation', icon: <Sun size={22} /> },
];

/* ────────────────────────────────────────────
 * Screen Component
 * ──────────────────────────────────────────── */

export default function Screen3Questions() {
  const navigate = useNavigate();
  const {
    step,
    totalSteps,
    back,
    select,
    setPriority,
    isFirst,
    context,
  } = useQuestionnaire();

  const meta = STEPS[step];

  /* ── Navigation handlers ── */
  const handleBack = () => {
    if (isFirst) {
      navigate('/scan');
    } else {
      back();
    }
  };

  const handleFinish = () => {
    navigate('/match');
  };

  /* ── Render current step content ── */
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <QuestionStep<UseCase>
            stepIndex={step}
            title={meta.title}
            subtitle={meta.subtitle}
            headerIcon={meta.icon}
            options={useCaseOptions}
            selectedValue={context.useCase}
            onSelect={(v) => select('useCase', v)}
          />
        );
      case 1:
        return (
          <QuestionStep<number>
            stepIndex={step}
            title={meta.title}
            subtitle={meta.subtitle}
            headerIcon={meta.icon}
            options={hoursOptions}
            selectedValue={context.hoursPerDay}
            onSelect={(v) => select('hoursPerDay', v)}
          />
        );
      case 2:
        return (
          <QuestionStep<ActivityType>
            stepIndex={step}
            title={meta.title}
            subtitle={meta.subtitle}
            headerIcon={meta.icon}
            options={activityOptions}
            selectedValue={context.activity}
            onSelect={(v) => select('activity', v)}
          />
        );
      case 3:
        return (
          <QuestionStep<Climate>
            stepIndex={step}
            title={meta.title}
            subtitle={meta.subtitle}
            headerIcon={meta.icon}
            options={climateOptions}
            selectedValue={context.climate}
            onSelect={(v) => select('climate', v)}
          />
        );
      case 4:
        return (
          <PrioritySlider
            value={context.priorityScore ?? 50}
            onChange={setPriority}
            onFinish={handleFinish}
          />
        );
      default:
        return null;
    }
  };

  return (
    <PageWrapper className="flex items-center justify-center min-h-screen px-4">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg"
      >
        {/* Step Progress Indicator */}
        <motion.div variants={fadeInUp} className="mb-8">
          <StepProgress current={step} total={totalSteps} />
        </motion.div>

        {/* Current Step Content */}
        {renderStep()}

        {/* Navigation — Back button */}
        <motion.div variants={itemReveal} className="mt-6 flex items-center">
          <Button variant="primary" size="sm" onClick={handleBack}>
            <ArrowLeft size={14} className="mr-1" />
            Back
          </Button>
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
}
