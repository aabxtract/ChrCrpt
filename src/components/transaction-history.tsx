'use client';

import { useTimeCapsule } from '@/hooks/use-time-capsule';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { History, TrendingUp } from 'lucide-react';

export default function TransactionHistory() {
  const { sentCapsules } = useTimeCapsule();
  const { isConnected } = useAccount();

  if (!isConnected) {
    return null;
  }

  return (
    <Card className="max-w-4xl mx-auto border-primary/30 shadow-glow-primary-sm bg-card/50 backdrop-blur-sm mt-8">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="font-headline flex items-center gap-2">
          <History className="h-6 w-6 text-primary" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
            <div className='flex items-center gap-2'>
                <TrendingUp className="h-5 w-5 text-accent" />
                <p className="text-lg font-semibold">Capsules Sent</p>
            </div>
          <p className="text-2xl font-bold font-headline text-primary">{sentCapsules.length}</p>
        </div>
      </CardContent>
    </Card>
  );
}
