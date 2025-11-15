'use client';

import { useState, useEffect } from 'react';
import { intervalToDuration, formatDuration } from 'date-fns';
import { useNotification } from '@/hooks/use-notification';

interface CountdownProps {
  unlockTime: number;
  isRecipient: boolean;
}

export default function Countdown({ unlockTime, isRecipient }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<Duration | null>(null);
  const { sendNotification } = useNotification();
  const [notificationSent, setNotificationSent] = useState(false);

  useEffect(() => {
    const unlockDate = new Date(unlockTime * 1000);

    const updateCountdown = () => {
      const now = new Date();
      if (now >= unlockDate) {
        setTimeLeft(null); // Countdown finished
        if (isRecipient && !notificationSent) {
          sendNotification('Capsule Unlocked!', 'Your time capsule message is now available to view.');
          setNotificationSent(true);
        }
        return;
      }
      const duration = intervalToDuration({ start: now, end: unlockDate });
      setTimeLeft(duration);
    };

    updateCountdown();
    const timerId = setInterval(updateCountdown, 1000);

    return () => clearInterval(timerId);
  }, [unlockTime, isRecipient, sendNotification, notificationSent]);

  if (!timeLeft) {
    return (
      <div className="text-center text-muted-foreground p-4">
        <p>Preparing to unlock...</p>
      </div>
    );
  }

  const formatted = formatDuration(timeLeft, {
    format: ['days', 'hours', 'minutes', 'seconds'],
    zero: true,
    delimiter: ':',
  })
  .split(':')
  .map(v => v.padStart(2, '0'));

  const labels = ['Days', 'Hours', 'Minutes', 'Seconds'];

  return (
    <div className="grid grid-cols-4 gap-2 text-center p-4 rounded-lg bg-card/50 border border-border animate-soft-pulse">
      {formatted.map((value, index) => (
        <div key={labels[index]} className="flex flex-col p-2 rounded-md bg-background/50">
          <span className="font-headline text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-slate-200 to-primary">{value}</span>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{labels[index]}</span>
        </div>
      ))}
    </div>
  );
}
