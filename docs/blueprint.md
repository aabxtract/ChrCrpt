# **App Name**: ChronoCrypt

## Core Features:

- Connect Wallet: Enable users to connect their Web3 wallets using Wagmi.
- Encrypted Message Input: Provide a text area for users to write private messages that are encrypted client-side using crypto.subtle (AES-GCM) before being stored.
- Unlock Date Selection: Allow users to select an unlock date using a date picker component.  The timestamp will be recorded for use in smart contract and front end.
- Time-Capsule NFT Minting: Mint an ERC-721 NFT (TimeCapsule) on the Hardhat network. The NFT contains the encrypted message, sender address, receiver address, and unlock timestamp.
- Capsule Display: Display sent and received capsules.  Include a countdown timer to unlock, as well as a means of showing the decrypted message (recipient-side decryption).
- Early Access Prevention: Implement a smart contract gate that enforces: require(block.timestamp >= unlockTime), preventing early access to the encapsulated message.
- Countdown Completion Alert: The UI displays a countdown, using an LLM tool the app alerts the receiver with browser notification upon timer completion. The AI is able to estimate how to set up an operating-system compatible notification by parsing the user's environmental parameters such as browser type and version, OS etc. It uses this tool to craft the correct notification payload.

## Style Guidelines:

- Primary color: Midnight blue (#2c3e50) to convey a sense of security and mystery.
- Background color: Very dark gray (#34495e), desaturated to 20%, to support the futuristic theme.
- Accent color: Electric purple (#8e44ad) to highlight interactive elements and create a soft glow.
- Body and headline font: 'Space Grotesk' sans-serif for headlines, 'Inter' sans-serif for body, providing a techy, scientific feel with a modern look. 
- Code font: 'Source Code Pro' for displaying encrypted messages or code snippets.
- Use minimalist icons. A lock icon for locked capsules and an open vault icon for unlocked capsules.
- Subtle, smooth transitions and a softly pulsing animation for the countdown timer to enhance user experience.