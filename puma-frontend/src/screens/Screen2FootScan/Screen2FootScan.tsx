import { useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Footprints } from 'lucide-react';
import { PageWrapper, Button } from '@/components';
import { useScanner } from '@/hooks/useScanner';
import { fadeInUp, staggerContainer } from '@/design/animations';

const videoConstraints = {
  facingMode: 'environment',
  width: { ideal: 1280 },
  height: { ideal: 720 },
};

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

  return (
    <PageWrapper className="pt-20 flex flex-col items-center justify-center min-h-screen px-4">
      {/* Camera viewport */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-lg aspect-[3/4] rounded-xl overflow-hidden glass-card"
      >
        {/* Webcam feed — falls back to black if no camera */}
        <Webcam
          ref={webcamRef}
          audio={false}
          videoConstraints={videoConstraints}
          className="absolute inset-0 w-full h-full object-cover"
          onUserMediaError={() => {
            /* Camera denied — still shows UI via simulation mode */
          }}
        />

        {/* Darkened overlay when idle to prompt action */}
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
                Place your foot in the camera view and tap <strong>Start Scan</strong> to begin the analysis.
              </p>
              <Button size="lg" onClick={handleStartScan}>
                <Camera className="w-5 h-5 mr-2 inline" />
                Start Scan
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status bar */}
        {status !== 'idle' && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-10"
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

            {/* Analyzing spinner */}
            {status === 'analyzing' && (
              <div className="mt-3 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-accent rounded-full border-t-transparent animate-spin" />
                <span className="text-text-muted text-xs">Processing biomechanical data…</span>
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
