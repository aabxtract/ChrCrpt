'use client';

import { useTimeCapsule } from '@/hooks/use-time-capsule';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import CapsuleCard from './capsule-card';
import { Skeleton } from './ui/skeleton';
import { useAccount } from 'wagmi';

function CapsuleListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {[...Array(2)].map((_, i) => (
        <Skeleton key={i} className="h-48 rounded-lg" />
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg bg-primary/10 border-2 border-dashed border-primary/20">
      <p className="text-muted-foreground">{message}</p>
    </div>
  )
}

export default function MyCapsulesList() {
  const { sentCapsules, receivedCapsules, isLoading } = useTimeCapsule();
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
       <Card className="border-accent/30 shadow-glow-accent-sm bg-card/50 backdrop-blur-sm mt-6">
        <CardHeader>
          <CardTitle className="font-headline text-center">View Your Capsules</CardTitle>
        </CardHeader>
        <CardContent>
           <EmptyState message="Please connect your wallet to see your time capsules." />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8 mt-6">
      <Card className="border-accent/30 shadow-glow-accent-sm bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline">Received Capsules</CardTitle>
          <CardDescription>These are the time capsules others have sent to you.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <CapsuleListSkeleton />
          ) : receivedCapsules.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {receivedCapsules.map((capsule) => (
                <CapsuleCard key={capsule.tokenId.toString()} capsule={capsule} type="received" />
              ))}
            </div>
          ) : (
            <EmptyState message="You have not received any capsules yet." />
          )}
        </CardContent>
      </Card>
      <Card className="border-accent/30 shadow-glow-accent-sm bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline">Sent Capsules</CardTitle>
          <CardDescription>These are the time capsules you have sent.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <CapsuleListSkeleton />
          ) : sentCapsules.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {sentCapsules.map((capsule) => (
                <CapsuleCard key={capsule.tokenId.toString()} capsule={capsule} type="sent" />
              ))}
            </div>
          ) : (
            <EmptyState message="You have not sent any capsules yet." />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
