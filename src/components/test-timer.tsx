"use client";

import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TestTimerProps {
  initialTime: number; // in seconds
  onComplete: () => void;
}

export function TestTimer({ initialTime, onComplete }: TestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onComplete]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Badge variant="outline" className="flex items-center gap-2 text-lg py-1 px-3">
        <Timer className="h-5 w-5" />
        <span>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
    </Badge>
  );
}
