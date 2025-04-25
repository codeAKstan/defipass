# DeFiPass: Walletless Solana DeFi via Passkey Authentication

![DeFiPass Banner](public/amethyst-flow.png)

DeFiPass enables users to interact with Solana DeFi protocols using Passkey authentication instead of traditional seed phrases. By leveraging WebAuthn standards and Secp256r1 signatures, DeFiPass provides a secure, user-friendly way to access Solana DeFi without the complexity of managing seed phrases or installing browser extensions.

## 🚀 Features

- **Passkey Authentication**: Log in with device biometrics (fingerprint, face ID)
- **No Seed Phrases**: Enhanced security without the risk of losing seed phrases
- **Jupiter Integration**: Swap tokens with the best rates across Solana
- **On-Chain Verification**: All transactions verified on-chain via Secp256r1 signatures
- **Real-time Balances**: View your actual token balances from the blockchain
- **Dark/Light Mode**: Toggle between themes for optimal viewing experience
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components

### Authentication
- LazorKit SDK (@lazorkit/wallet)
- WebAuthn/Passkey standards
- Secp256r1 signatures

### Blockchain
- Solana Web3.js
- Jupiter API for token swapping
- LazorKit on-chain program for signature verification

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- A modern browser that supports WebAuthn (Chrome, Firefox, Safari, Edge)
- A device with biometric capabilities (for the best experience)

## 🔧 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/codeAKstan/defipass
   cd defipass

2. Install dependencies:
    ```bash
    npm run dev
        # or
    yarn dev

3. Run the development server:
    ```bash
    npm run dev
        # or
    yarn dev

4. Open [http://localhost:3000](http://localhost:3000)