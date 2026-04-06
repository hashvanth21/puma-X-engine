import { useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Footprints, ArrowLeft, ArrowRight } from 'lucide-react';
import { PageWrapper, Button } from '@/components';
import { useScanner } from '@/hooks/useScanner';
import { fadeInUp, staggerContainer } from '@/design/animations';
import ScanResults from './ScanResults';

const videoConstraints = {
  facingMode: 'environment',
  width: { ideal: 1280 },
  height: { ideal: 720 },
};

const FootOutlineSVG = ({ pulsing = false }: { pulsing?: boolean }) => (
  <svg
    viewBox="0 0 200 320"
    className="w-40 h-64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <motion.path
      d="M100 10 C60 10, 30 60, 30 110 C30 160, 40 200, 45 240 C50 280, 60 310, 100 310 C140 310, 150 280, 155 240 C160 200, 170 160, 170 110 C170 60, 140 10, 100 10Z"
      stroke="#D90429"
      strokeWidth="2.5"
      strokeDasharray={pulsing ? '8 6' : '0'}
      fill="none"
      initial={{ pathLength: 0, opacity: 0.3 }}
      animate={{
        pathLength: 1,
        opacity: pulsing ? [0.3, 1, 0.3] : 1,
      }}
      transition={{
        pathLength: { duration: 1.2, ease: 'easeInOut' },
        opacity: pulsing
          ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }
          : { duration: 0.4 },
      }}
    />
  </svg>
);

const LaserBeam = ({ progress }: { progress: number }) => (
  <motion.div
    className="absolute left-0 right-0 h-1 z-20 pointer-events-none"
    style={{ top: `${(progress / 100) * 100}%` }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-accent-red to-transparent" />
    <div className="w-full h-8 -mt-4 bg-gradient-to-r from-transparent via-accent-red/15 to-transparent blur-md" />
  </motion.div>
);

const AnalyzingRings = () => (
  <div className="flex items-center justify-center relative">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="absolute rounded-full border border-accent-red/30"
        style={{ width: 80 + i * 50, height: 80 + i * 50 }}
        animate={{ rotate: i % 2 === 0 ? 360 : -360, scale: [1, 1.05, 1] }}
        transition={{
          rotate: { duration: 3 + i, repeat: Infinity, ease: 'linear' },
          scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
    ))}
    <motion.p
      className="text-accent-red text-xs font-medium tracking-widest uppercase text-center z-10"
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      Generating<br />Biomechanical Map
    </motion.p>
  </div>
);

export default function Screen2FootScan() {
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam>(null);
  const { status, progress, startScan } = useScanner();

  const handleStartScan = useCallback(() => {
    startScan();
  }, [startScan]);

  const statusLabel: Record<string, string> = {
    idle: 'Ready to Scan',
    aligning: 'Align your foot…',
    scanning: 'Scanning…',
    analyzing: 'Analyzing biomechanics…',
    complete: 'Scan Complete!',
  };

  if (status === 'complete') {
    return (
      <PageWrapper className="pt-24 pb-12 flex flex-col items-center justify-start min-h-screen px-4">
        <ScanResults />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="pt-20 flex flex-col items-center justify-center min-h-screen px-4">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg"
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-chip bg-accent-red/10 mb-4">
            <div className="w-2 h-2 rounded-full bg-accent-red animate-pulse" />
            <span className="text-accent-red text-xs font-semibold tracking-wider uppercase">Foot Scan</span>
          </div>
          <h2 className="font-display font-black text-3xl text-text-primary mb-1">
            Scan Your Foot
          </h2>
          <p className="text-text-muted text-sm">
            We'll analyze your biomechanics in seconds
          </p>
        </motion.div>

        {/* Camera Card */}
        <motion.div
          variants={fadeInUp}
          className="relative aspect-[3/4] bg-bg-card rounded-hero shadow-deep overflow-hidden"
        >
          <Webcam
            ref={webcamRef}
            audio={false}
            videoConstraints={videoConstraints}
            className="absolute inset-0 w-full h-full object-cover"
            onUserMediaError={() => {}}
          />

          {/* IDLE overlay */}
          <AnimatePresence>
            {status === 'idle' && (
              <motion.div
                key="idle-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-bg-dark/70 backdrop-blur-sm flex flex-col items-center justify-center gap-6 z-10"
              >
                <Footprints className="w-16 h-16 text-accent-red" />
                <p className="text-white/70 text-sm text-center max-w-xs">
                  Place your foot in the camera view and tap <strong className="text-white">Start Scan</strong> to begin.
                </p>
                <Button variant="accent" size="lg" onClick={handleStartScan}>
                  <Camera className="w-5 h-5" />
                  Start Scan
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ALIGNING overlay */}
          <AnimatePresence>
            {status === 'aligning' && (
              <motion.div
                key="aligning-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center z-10"
              >
                <FootOutlineSVG pulsing />
              </motion.div>
            )}
          </AnimatePresence>

          {/* SCANNING overlay */}
          <AnimatePresence>
            {status === 'scanning' && (
              <motion.div
                key="scanning-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10"
              >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <FootOutlineSVG />
                </div>
                <LaserBeam progress={progress} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ANALYZING overlay */}
          <AnimatePresence>
            {status === 'analyzing' && (
              <motion.div
                key="analyzing-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-bg-dark/60 backdrop-blur-sm flex items-center justify-center z-10"
              >
                <AnalyzingRings />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status bar */}
          {status !== 'idle' && (
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-bg-dark/90 to-transparent z-20"
            >
              <p className="text-white font-display font-bold text-lg mb-2">
                {statusLabel[status]}
              </p>
              {status === 'scanning' && (
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-accent-red rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: 'linear', duration: 0.05 }}
                  />
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Navigation */}
        <motion.div variants={fadeInUp} className="mt-6 flex items-center justify-between">
          <Button variant="primary" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft size={14} className="mr-1" />
            Back
          </Button>
          {status === 'idle' && (
            <Button variant="ghost" size="sm" onClick={() => navigate('/questions')}>
              Skip
              <ArrowRight size={14} className="ml-1" />
            </Button>
          )}
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
}
