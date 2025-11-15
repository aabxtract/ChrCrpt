'use client';

import { useTimeCapsule } from '@/hooks/use-time-capsule';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { History, TrendingUp } from 'lucide-react';

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg bg-card/30 border-2 border-dashed border-border">
      <p className="text-muted-foreground">{message}</p>
    </div>
  )
}

export default function TransactionHistory() {
  const { sentCapsules, receivedCapsules, isLoading } = useTimeCapsule();
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
       <Card className="border-primary/30 shadow-glow-primary-sm bg-card/50 backdrop-blur-sm mt-4">
        <CardHeader>
          <CardTitle className="font-headline text-center">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
           <EmptyState message="Please connect your wallet to see your transaction history." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/30 shadow-glow-primary-sm bg-card/50 backdrop-blur-sm mt-4">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <History className="h-6 w-6 text-primary" />
          Transaction Summary
        </CardTitle>
        <CardDescription>An overview of your time capsule activity.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
            <div className='flex items-center gap-2'>
                <TrendingUp className="h-5 w-5 text-accent" />
                <p className="text-lg font-semibold">Capsules Sent</p>
            </div>
          <p className="text-2xl font-bold font-headline text-primary">{sentCapsules.length}</p>
        </div>
         <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
            <div className='flex items-center gap-2'>
                <TrendingUp className="h-5 w-5 text-accent" />
                <p className="text-lg font-semibold">Capsules Received</p>
            </div>
          <p className="text-2xl font-bold font-headline text-primary">{receivedCapsules.length}</p>
        </div>
      </CardContent>
    </Card>
  );
}
