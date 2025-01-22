import React from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { useMatchTimer } from '../hooks/useMatchTimer';
import { MatchTimer as MatchTimerType } from '../types/match';

interface MatchTimerProps {
  initialTimer: MatchTimerType;
  onTimerUpdate?: (timer: MatchTimerType) => void;
}

export const MatchTimer: React.FC<MatchTimerProps> = ({ 
  initialTimer, 
  onTimerUpdate 
}) => {
  const { 
    timer, 
    elapsedTime, 
    startTimer, 
    pauseTimer, 
    resetTimer, 
    getRemainingTime 
  } = useMatchTimer(initialTimer);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    if (timer.status === 'running') {
      pauseTimer();
    } else {
      startTimer();
    }
    onTimerUpdate?.(timer);
  };

  const handleReset = () => {
    resetTimer();
    onTimerUpdate?.(initialTimer);
  };

  return (
    <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div className="text-2xl font-bold">
        {formatTime(getRemainingTime())}
      </div>
      <div className="flex space-x-2">
        <button 
          onClick={handleStartPause}
          className={`p-2 rounded-full ${
            timer.status === 'running' 
              ? 'bg-yellow-100 text-yellow-600' 
              : 'bg-green-100 text-green-600'
          }`}
        >
          {timer.status === 'running' ? <Pause /> : <Play />}
        </button>
        <button 
          onClick={handleReset}
          className="p-2 bg-gray-100 text-gray-600 rounded-full"
        >
          <RefreshCw />
        </button>
      </div>
      <div className="text-sm text-gray-500">
        {timer.status === 'running' ? 'Running' : 
         timer.status === 'paused' ? 'Paused' : 'Stopped'}
      </div>
    </div>
  );
};
