import { useState, useEffect, useCallback } from 'react';
import { MatchTimer } from '../types/match';

export function useMatchTimer(initialTimer: MatchTimer) {
  const [timer, setTimer] = useState<MatchTimer>(initialTimer);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (timer.status === 'running') {
      intervalId = setInterval(() => {
        setElapsedTime(prev => {
          const newTime = prev + 1;
          
          // Check for match duration or overtime
          if (newTime >= timer.duration + (timer.overtime || 0)) {
            clearInterval(intervalId);
            return timer.duration + (timer.overtime || 0);
          }

          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [timer.status, timer.duration, timer.overtime]);

  const startTimer = useCallback(() => {
    setTimer(prev => ({
      ...prev,
      startTime: new Date().toISOString(),
      status: 'running'
    }));
  }, []);

  const pauseTimer = useCallback(() => {
    setTimer(prev => ({
      ...prev,
      pausedTime: new Date().toISOString(),
      status: 'paused'
    }));
  }, []);

  const resetTimer = useCallback(() => {
    setTimer(initialTimer);
    setElapsedTime(0);
  }, [initialTimer]);

  const getRemainingTime = useCallback(() => {
    const totalDuration = timer.duration + (timer.overtime || 0);
    return Math.max(0, totalDuration - elapsedTime);
  }, [elapsedTime, timer.duration, timer.overtime]);

  return {
    timer,
    elapsedTime,
    startTimer,
    pauseTimer,
    resetTimer,
    getRemainingTime
  };
}
