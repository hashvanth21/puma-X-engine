import { useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Footprints } from 'lucide-react';
import { PageWrapper, Button } from '@/components';
import { useScanner } from '@/hooks/useScanner';
import { fadeInUp, staggerContainer } from '@/design/animations';
import ScanResults from './ScanResults';

const videoConstraints = {
  facingMode: 'environment',
  width: { ideal: 1280 },
  height: { ideal: 720 },
};

/* ─── SVG Foot Outline ──────────────────────────────── */
const FootOutlineSVG = ({ pulsing = false }: { pulsing?: boolean }) => (
  <svg
    viewBox="0 0 200 320"
    className="w-40 h-64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <motion.path
      d="M100 10 C60 10, 30 60, 30 110 C30 160, 40 200, 45 240 C50 280, 60 310, 100 310 C140 310, 150 280, 155 240 C160 200, 170 160, 170 110 C170 60, 140 10, 100 10Z"
      stroke="rgb(200, 160, 0)"
      strokeWidth="2.5"
      strokeDasharray={pulsing ? '8 6' : '0'}
      fill="none"
      initial={{ pathLength: 0, opacity: 0.4 }}
      animate={{
        pathLength: 1,
        opacity: pulsing ? [0.4, 1, 0.4] : 1,
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

/* ─── Scanning Laser Beam ─────────────────────────────── */
const LaserBeam = ({ progress }: { progress: number }) => (
  <motion.div
    className="absolute left-0 right-0 h-1 z-20 pointer-events-none"
    style={{ top: `${(progress / 100) * 100}%` }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {/* Beam line */}
    <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" />
    {/* Glow effect */}
    <div className="w-full h-8 -mt-4 bg-gradient-to-r from-transparent via-accent/20 to-transparent blur-md" />
  </motion.div>
);

/* ─── Analyzing Rings ─────────────────────────────────── */
const AnalyzingRings = () => (
  <div className="flex items-center justify-center">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="absolute rounded-full border border-accent/40"
        style={{ width: 80 + i * 50, height: 80 + i * 50 }}
        animate={{ rotate: i % 2 === 0 ? 360 : -360, scale: [1, 1.05, 1] }}
        transition={{
          rotate: { duration: 3 + i, repeat: Infinity, ease: 'linear' },
          scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
    ))}
    <motion.p
      className="text-accent text-xs font-medium tracking-widest uppercase text-center z-10"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      Generating<br />Biomechanical Map
    </motion.p>
  </div>
);

/* ─── Main Screen ──────────────────────────────────── */
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

  /* ── Complete state → show results ── */
  if (status === 'complete') {
    return (
      <PageWrapper className="pt-24 pb-12 flex flex-col items-center justify-start min-h-screen px-4">
        <ScanResults />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="pt-20 flex flex-col items-center justify-center min-h-screen px-4">
      {/* Camera viewport */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-lg aspect-[3/4] rounded-xl overflow-hidden glass-card"
      >
        {/* Webcam feed */}
        <Webcam
          ref={webcamRef}
          audio={false}
          videoConstraints={videoConstraints}
          className="absolute inset-0 w-full h-full object-cover"
          onUserMediaError={() => {}}
        />

        {/* ── IDLE overlay ── */}
        <AnimatePresence>
          {status === 'idle' && (
            <motion.div
              key="idle-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-6 z-10"
            >
              <Footprints className="w-16 h-16 text-accent" />
              <p className="text-text-secondary text-sm text-center max-w-xs">
                Place your foot in the camera view and tap <strong className="text-text-primary">Start Scan</strong> to
                begin the analysis.
              </p>
              <Button size="lg" onClick={handleStartScan}>
                <Camera className="w-5 h-5 mr-2 inline" />
                Start Scan
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── ALIGNING overlay: pulsing foot outline ── */}
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

        {/* ── SCANNING overlay: laser beam + static foot outline ── */}
        <AnimatePresence>
          {status === 'scanning' && (
            <motion.div
              key="scanning-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10"
            >
              {/* Foot outline (solid) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <FootOutlineSVG />
              </div>
              {/* Laser beam sweeping top to bottom */}
              <LaserBeam progress={progress} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── ANALYZING overlay: concentric rings ── */}
        <AnimatePresence>
          {status === 'analyzing' && (
            <motion.div
              key="analyzing-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center z-10"
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
            className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-20"
          >
            <p className="text-text-primary font-display font-bold text-lg">
              {statusLabel[status]}
            </p>

            {/* Progress bar during scanning */}
            {status === 'scanning' && (
              <div className="mt-2 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-accent rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: 'linear', duration: 0.05 }}
                />
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Bottom navigation */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mt-6 flex gap-3">
        <Button variant="secondary" size="sm" onClick={() => navigate('/')}>
          ← Back
        </Button>
        {status === 'idle' && (
          <Button variant="ghost" size="sm" onClick={() => navigate('/questions')}>
            Skip to Questions →
          </Button>
        )}
      </motion.div>
    </PageWrapper>
  );
}
