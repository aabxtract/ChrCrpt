'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { MOCK_CAPSULES, type MockCapsule } from '@/lib/mock-data';
import { useToast } from './use-toast';

// In a real app, this would use useReadContracts and useWriteContract from wagmi
export function useTimeCapsule() {
  const { address } = useAccount();
  const { toast } = useToast();
  const [capsules, setCapsules] = useState<MockCapsule[]>(MOCK_CAPSULES);
  const [isLoading, setIsLoading] = useState(true);
  const [isMinting, setIsMinting] = useState(false);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const sentCapsules = capsules.filter(c => c.sender === address);
  const receivedCapsules = capsules.filter(c => c.recipient === address);

  const mintCapsule = useCallback(async (recipient: `0x${string}`, encryptedMessage: string, unlockTime: number) => {
    if (!address) {
        toast({
            title: "Connection Error",
            description: "Please connect your wallet to mint a capsule.",
            variant: "destructive",
        });
        return;
    }

    setIsMinting(true);
    toast({
        title: "Minting Capsule...",
        description: "Your transaction is being processed.",
    });

    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newCapsule: MockCapsule = {
        tokenId: BigInt(capsules.length + 1),
        recipient,
        encryptedMessage,
        unlockTime,
        sender: address,
        burned: false,
    };

    setCapsules(prev => [...prev, newCapsule]);
    setIsMinting(false);

    toast({
        title: "Success!",
        description: "Your Time Capsule NFT has been minted.",
    });
  }, [address, capsules.length, toast]);

  return { capsules, sentCapsules, receivedCapsules, isLoading, isMinting, mintCapsule };
}
