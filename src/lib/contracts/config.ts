import { hardhat, sepolia } from 'viem/chains';
import TimeCapsuleABI from './TimeCapsule.abi.json';

// The user specified Hardhat, but for a web dApp example, a public testnet is easier.
export const targetChain = process.env.NODE_ENV === 'development' ? hardhat : sepolia;

// A placeholder address. In a real project, this would be your deployed contract address.
export const timeCapsuleContract = {
  address: '0x5FbDB2315678afecb367f032d93F642f64180aa3' as `0x${string}`,
  abi: TimeCapsuleABI,
} as const;
