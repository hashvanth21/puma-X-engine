import { useState, useEffect } from 'react';

export type ScanStatus = 'idle' | 'aligning' | 'scanning' | 'analyzing' | 'complete';

export function useScanner() {
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [progress, setProgress] = useState(0);

  const startScan = () => {
    setStatus('aligning');
    setProgress(0);
  };

  useEffect(() => {
    if (status === 'aligning') {
      const timer = setTimeout(() => setStatus('scanning'), 2000);
      return () => clearTimeout(timer);
    }

    if (status === 'scanning') {
      const interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            clearInterval(interval);
            setStatus('analyzing');
            return 100;
          }
          return p + 2; // Increments over ~2-3 seconds
        });
      }, 50);
      return () => clearInterval(interval);
    }

    if (status === 'analyzing') {
      const timer = setTimeout(() => setStatus('complete'), 1500);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return { status, progress, startScan, setStatus };
}
