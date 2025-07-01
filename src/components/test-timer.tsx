
"use client";

import { useState, useEffect, useRef } from 'react';
import { Timer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TestTimerProps {
  initialTime: number; // in seconds
  onTimeUpdate: (elapsedSeconds: number) => void;
}

export function TestTimer({ initialTime, onTimeUpdate }: TestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isOvertime, setIsOvertime] = useState(false);
  
  const elapsedRef = useRef(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      elapsedRef.current += 1;
      const newElapsed = elapsedRef.current;
      
      onTimeUpdate(newElapsed);
      
      const remaining = initialTime - newElapsed;
      setTimeLeft(remaining);

      if (remaining < 0 && !isOvertime) {
        setIsOvertime(true);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [initialTime, onTimeUpdate, isOvertime]);

  const displayTime = isOvertime ? -timeLeft : timeLeft;
  const minutes = Math.floor(displayTime / 60);
  const seconds = displayTime % 60;

  return (
    <Badge variant={isOvertime ? "destructive" : "outline"} className="flex items-center gap-2 text-lg py-1 px-3">
        <Timer className="h-5 w-5" />
        <div className="flex items-center">
            {isOvertime && <span className="mr-1">-</span>}
            <span>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
        </div>
    </Badge>
  );
}
