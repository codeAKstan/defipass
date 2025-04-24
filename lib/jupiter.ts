import type { TokenInfo } from "@/types/token"

// Mock token list for development
const mockTokens: TokenInfo[] = [
  {
    address: "So11111111111111111111111111111111111111112",
    symbol: "SOL",
    name: "Solana",
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
  },
  {
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
  },
  {
    address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    symbol: "USDT",
    name: "USDT",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png",
  },
  {
    address: "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj",
    symbol: "stSOL",
    name: "Lido Staked SOL",
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj/logo.png",
  },
  {
    address: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
    symbol: "mSOL",
    name: "Marinade staked SOL",
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png",
  },
]

// Fetch token list from Jupiter API
export async function fetchTokens(): Promise<TokenInfo[]> {
  try {
    // In a real implementation, you would fetch from Jupiter API
    // const response = await fetch("https://token.jup.ag/all")
    // const tokens = await response.json()
    // return tokens

    // For now, return mock data
    return mockTokens
  } catch (error) {
    console.error("Error fetching tokens:", error)
    return mockTokens
  }
}

// Fetch quote from Jupiter API
export async function fetchQuote({
  inputMint,
  outputMint,
  amount,
  slippageBps = 50,
}: {
  inputMint: string
  outputMint: string
  amount: number
  slippageBps?: number
}) {
  try {
    // In a real implementation, you would fetch from Jupiter API
    // const response = await fetch(
    //   `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`
    // )
    // const data = await response.json()
    // return data

    // For now, return mock data
    const fromToken = mockTokens.find((t) => t.address === inputMint)
    const toToken = mockTokens.find((t) => t.address === outputMint)

    if (!fromToken || !toToken) {
      throw new Error("Token not found")
    }

    // Mock exchange rate (this would come from Jupiter in reality)
    let rate = 1

    if (fromToken.symbol === "SOL" && toToken.symbol === "USDC") {
      rate = 100 // 1 SOL = 100 USDC
    } else if (fromToken.symbol === "USDC" && toToken.symbol === "SOL") {
      rate = 0.01 // 1 USDC = 0.01 SOL
    } else if (fromToken.symbol === "SOL" && toToken.symbol === "stSOL") {
      rate = 0.95 // 1 SOL = 0.95 stSOL
    } else if (fromToken.symbol === "stSOL" && toToken.symbol === "SOL") {
      rate = 1.05 // 1 stSOL = 1.05 SOL
    }

    // Apply some randomness to simulate market fluctuations
    const randomFactor = 0.98 + Math.random() * 0.04 // Between 0.98 and 1.02
    rate *= randomFactor

    return {
      inAmount: amount,
      outAmount: amount * rate,
      priceImpactPct: 0.1,
      marketInfos: [],
      routePlan: [],
    }
  } catch (error) {
    console.error("Error fetching quote:", error)
    throw error
  }
}

// Execute swap via Jupiter API
export async function executeSwap({
  wallet,
  inputMint,
  outputMint,
  amount,
  slippageBps = 50,
}: {
  wallet: string
  inputMint: string
  outputMint: string
  amount: number
  slippageBps?: number
}) {
  try {
    // In a real implementation, you would:
    // 1. Get a quote from Jupiter
    // 2. Get a serialized transaction from Jupiter
    // 3. Return the transaction for signing

    // For now, return mock data
    return {
      txid: "mock_transaction_id_" + Math.random().toString(36).substring(2, 15),
      message: "SGVsbG8gV29ybGQ=", // Base64 encoded "Hello World"
    }
  } catch (error) {
    console.error("Error executing swap:", error)
    throw error
  }
}
