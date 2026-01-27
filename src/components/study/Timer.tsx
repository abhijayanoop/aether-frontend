import { useState, useEffect } from "react";
import { Clock, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
}

export function Timer({ duration, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    if (isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isPaused, onTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getColor = () => {
    const percentage = (timeLeft / duration) * 100;
    if (percentage > 50) return "text-green-600";
    if (percentage > 20) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="flex items-center gap-3">
      <Clock className="h-5 w-5 text-muted-foreground" />
      <span className={`text-2xl font-bold ${getColor()}`}>
        {formatTime(timeLeft)}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsPaused(!isPaused)}
      >
        {isPaused ? (
          <Play className="h-4 w-4" />
        ) : (
          <Pause className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
