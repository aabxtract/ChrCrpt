'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { type MockCapsule } from '@/lib/mock-data';
import Countdown from './countdown';
import { Lock, PackageOpen, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useAccount } from 'wagmi';
import { decryptMessage } from '@/lib/crypto';
import { useToast } from '@/hooks/use-toast';

interface CapsuleCardProps {
  capsule: MockCapsule;
  type: 'sent' | 'received';
}

function AddressDisplay({ address, label }: { address: `0x${string}`, label: string }) {
  const truncated = `${address.slice(0, 6)}...${address.slice(-4)}`;
  return (
    <div className="text-xs text-muted-foreground">
      <span className="font-semibold">{label}: </span>
      <span className="font-code">{truncated}</span>
    </div>
  );
}

export default function CapsuleCard({ capsule, type }: CapsuleCardProps) {
  const { address } = useAccount();
  const { toast } = useToast();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [decryptedMessage, setDecryptedMessage] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);

  useEffect(() => {
    const checkUnlock = () => {
      const now = Math.floor(Date.now() / 1000);
      setIsUnlocked(now >= capsule.unlockTime);
    };
    checkUnlock();
    const interval = setInterval(checkUnlock, 1000);
    return () => clearInterval(interval);
  }, [capsule.unlockTime]);

  const handleDecrypt = async () => {
    setIsDecrypting(true);
    try {
      // In a real app, the secret for decryption would be derived from the user's private key (e.g., via a signature)
      // For this demo, we use the recipient's address as the "secret"
      const secret = type === 'received' ? (address as string) : capsule.recipient;
      const message = await decryptMessage(capsule.encryptedMessage, secret);
      setDecryptedMessage(message);
    } catch (error) {
      console.error("Decryption failed", error);
      toast({
        title: "Decryption Failed",
        description: "Could not decrypt message. The key may be incorrect or the data corrupted.",
        variant: "destructive"
      });
    } finally {
      setIsDecrypting(false);
    }
  };

  const Icon = isUnlocked ? PackageOpen : Lock;
  const iconColor = isUnlocked ? 'text-accent' : 'text-muted-foreground';

  return (
    <Card className="flex flex-col justify-between bg-card/60 border-border backdrop-blur-sm hover:border-accent transition-colors duration-300 shadow-lg hover:shadow-glow-accent-sm">
      <CardHeader className="flex-row items-start justify-between">
        <div className="space-y-1">
          <CardTitle className="font-headline text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Capsule #{capsule.tokenId.toString()}</CardTitle>
          <AddressDisplay address={capsule.sender} label="From" />
          <AddressDisplay address={capsule.recipient} label="To" />
        </div>
        <Icon className={`h-8 w-8 ${iconColor} transition-colors`} />
      </CardHeader>
      <CardContent className="flex-grow">
        {decryptedMessage ? (
          <div className="p-4 rounded-md bg-background/50 border border-border font-code text-sm text-foreground/80 break-words whitespace-pre-wrap">
            {decryptedMessage}
          </div>
        ) : isUnlocked ? (
          <div className="text-center text-accent flex flex-col items-center justify-center h-full">
            <p className="font-semibold text-lg animate-glow-pulse">Capsule Unlocked!</p>
            <p className="text-sm">The message is now available to be revealed.</p>
          </div>
        ) : (
          <Countdown unlockTime={capsule.unlockTime} isRecipient={type === 'received'} />
        )}
      </CardContent>
      <CardFooter>
        {isUnlocked && !decryptedMessage && type === 'received' && (
          <Button onClick={handleDecrypt} disabled={isDecrypting} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow-accent hover:shadow-glow-accent-sm transition-all duration-300">
            {isDecrypting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Reveal Message
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
