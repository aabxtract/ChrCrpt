import { add } from 'date-fns';

export type MockCapsule = {
  tokenId: bigint;
  encryptedMessage: string;
  unlockTime: number;
  sender: `0x${string}`;
  recipient: `0x${string}`;
  burned: boolean;
};

const now = new Date();

export const MOCK_CAPSULES: MockCapsule[] = [
  {
    tokenId: 1n,
    // "Hello from the past! This is a secret message." -> iv:encrypted
    encryptedMessage: "5aSpCj9a/aFqgU3W:N8GIPo69Jp6T6W2VzL9v9w8xXvWbF8A4f7G5+1tV+hX+x6C2zY/jQ8c=",
    unlockTime: Math.floor(add(now, { days: 3, hours: 5 }).getTime() / 1000),
    sender: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', // Mock sender
    recipient: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', // Mock recipient
    burned: false,
  },
  {
    tokenId: 2n,
     // "This one is already unlocked." -> iv:encrypted
    encryptedMessage: "gX8bQv2k/sLpY7tV:F9HJOo7jKq7U7X3WzM+w+x9yYwXc",
    unlockTime: Math.floor(add(now, { minutes: -10 }).getTime() / 1000),
    sender: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    recipient: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    burned: false,
  },
    {
    tokenId: 3n,
    // "A short message just for you." -> iv:encrypted
    encryptedMessage: "kZ9cRw3m/tMqZ8uW:A+JKPp8kLr8V8Y4XzN/x/y+zZxXf",
    unlockTime: Math.floor(add(now, { seconds: 30 }).getTime() / 1000),
    sender: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    recipient: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    burned: false,
  },
];
