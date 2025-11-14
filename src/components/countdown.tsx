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
    delimiter: ' : ',
  })
  .replace(/\b\d\b/g, '0$&') // Pad with leading zeros
  .split(' : ');

  const labels = ['Days', 'Hours', 'Minutes', 'Seconds'];

  return (
    <div className="flex justify-around text-center p-4 rounded-lg bg-primary/10 animate-soft-pulse">
      {formatted.map((value, index) => (
        <div key={labels[index]} className="flex flex-col">
          <span className="font-headline text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-gray-200 to-purple-300">{value}</span>
          <span className="text-xs text-muted-foreground">{labels[index]}</span>
        </div>
      ))}
    </div>
  );
}
