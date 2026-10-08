import { useState, useRef, useCallback, useEffect } from 'react';

export function useTimer() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const startRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const start = useCallback(() => {
    startRef.current = Date.now();
    setRunning(true);
  }, []);

  const stop = useCallback(() => {
    if (startRef.current !== null) {
      setElapsed((Date.now() - startRef.current) / 1000);
    }
    setRunning(false);
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => {
        if (startRef.current !== null) {
          setElapsed((Date.now() - startRef.current) / 1000);
        }
      }, 1000);
    }
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, [running]);

  const reset = useCallback(() => {
    stop();
    setElapsed(0);
    startRef.current = null;
  }, [stop]);

  return { elapsed: Math.floor(elapsed), running, start, stop, reset };
}
