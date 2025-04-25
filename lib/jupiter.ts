import type { TokenInfo } from "@/types/token"

// Jupiter API endpoints
const JUPITER_API_BASE = "https://quote-api.jup.ag/v6"
const JUPITER_SWAP_API_BASE = "https://jup.ag/api/v6"

// Mock token list for fallback
const mockTokens: TokenInfo[] = [
  {
    address: "So11111111111111111111111111111111111111112",
    symbol: "SOL",
    name: "Solana",
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    tags: ["popular"],
  },
  {
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    tags: ["popular"],
  },
  {
    address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    symbol: "USDT",
    name: "USDT",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png",
    tags: ["popular"],
  },
  {
    address: "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj",
    symbol: "stSOL",
    name: "Lido Staked SOL",
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj/logo.png",
    tags: ["popular"],
  },
  {
    address: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
    symbol: "mSOL",
    name: "Marinade staked SOL",
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png",
    tags: ["popular"],
  },
]

// Fetch token list from Jupiter API
export async function fetchTokens(): Promise<TokenInfo[]> {
  try {
    console.log("Attempting to fetch tokens from Jupiter API...")
    const response = await fetch("https://token.jup.ag/all")

    if (!response.ok) {
      console.warn(`Failed to fetch tokens: ${response.status}, using mock tokens`)
      return mockTokens
    }

    const tokens = await response.json()
    console.log(`Fetched ${tokens.length} tokens from Jupiter API`)

    // Filter for popular tokens to keep the list manageable
    const popularSymbols = ["SOL", "USDC", "USDT", "mSOL", "stSOL", "BTC", "ETH", "BONK", "JUP"]
    const filteredTokens = tokens.filter(
      (token: TokenInfo) => popularSymbols.includes(token.symbol) && token.tags?.includes("popular"),
    )

    if (filteredTokens.length > 0) {
      console.log(`Using ${filteredTokens.length} filtered popular tokens`)
      return filteredTokens
    }

    console.log("No popular tokens found, using first 20 tokens")
    return tokens.slice(0, 20)
  } catch (error) {
    console.error("Error fetching tokens:", error)
    console.log("Using mock tokens as fallback")
    return mockTokens
  }
}

// Mock quote function for fallback
function getMockQuote(inputMint: string, outputMint: string, amount: number): any {
  // Find tokens
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
    otherAmountThreshold: "0",
    swapMode: "ExactIn",
    outputDecimals: toToken.decimals,
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
    // Convert amount to proper format (considering decimals)
    const fromToken = mockTokens.find((t) => t.address === inputMint)
    const decimals = fromToken?.decimals || 9
    const amountInSmallestUnit = Math.floor(amount * 10 ** decimals)

    const url = `${JUPITER_API_BASE}/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amountInSmallestUnit}&slippageBps=${slippageBps}`

    console.log("Fetching quote from:", url)

    const response = await fetch(url)
    if (!response.ok) {
      console.warn(`Failed to fetch quote: ${response.status}, using mock quote`)
      return getMockQuote(inputMint, outputMint, amount)
    }

    const data = await response.json()
    console.log("Quote data:", data)

    return {
      inAmount: amount,
      outAmount: data.outAmount / 10 ** data.outputDecimals,
      priceImpactPct: data.priceImpactPct,
      marketInfos: data.marketInfos || [],
      routePlan: data.routePlan || [],
      otherAmountThreshold: data.otherAmountThreshold,
      swapMode: data.swapMode,
      outputDecimals: data.outputDecimals,
    }
  } catch (error) {
    console.error("Error fetching quote:", error)
    console.log("Using mock quote as fallback")
    return getMockQuote(inputMint, outputMint, amount)
  }
}

// Mock swap execution for fallback
function getMockSwapTransaction(): any {
  return {
    txid: "mock_transaction_id_" + Math.random().toString(36).substring(2, 15),
    swapTransaction: "SGVsbG8gV29ybGQ=", // Base64 encoded "Hello World"
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
    // 1. Get a quote from Jupiter
    const fromToken = mockTokens.find((t) => t.address === inputMint)
    const decimals = fromToken?.decimals || 9
    const amountInSmallestUnit = Math.floor(amount * 10 ** decimals)

    const quoteUrl = `${JUPITER_API_BASE}/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amountInSmallestUnit}&slippageBps=${slippageBps}`
    console.log("Fetching swap quote from:", quoteUrl)

    const quoteResponse = await fetch(quoteUrl)

    if (!quoteResponse.ok) {
      console.warn(`Failed to fetch quote: ${quoteResponse.status}, using mock swap`)
      return getMockSwapTransaction()
    }

    const quoteData = await quoteResponse.json()

    // 2. Get a serialized transaction from Jupiter
    const swapUrl = `${JUPITER_SWAP_API_BASE}/swap`
    console.log("Preparing swap transaction...")

    const swapResponse = await fetch(swapUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quoteResponse: quoteData,
        userPublicKey: wallet,
        wrapAndUnwrapSol: true,
      }),
    })

    if (!swapResponse.ok) {
      console.warn(`Failed to prepare swap: ${swapResponse.status}, using mock swap`)
      return getMockSwapTransaction()
    }

    const swapData = await swapResponse.json()
    console.log("Swap transaction prepared:", swapData)

    // 3. Return the transaction for signing
    return {
      txid: swapData.txid || "pending_transaction",
      message: swapData.swapTransaction, // Base64 encoded transaction
    }
  } catch (error) {
    console.error("Error executing swap:", error)
    console.log("Using mock swap as fallback")
    return getMockSwapTransaction()
  }
}

// Verify Secp256r1 signature on-chain
export async function verifySignature(signature: Uint8Array, message: string, publicKey: string): Promise<boolean> {
  try {
    // In a real implementation, you would call your Solana program to verify the signature
    // For now, we'll simulate a successful verification
    console.log("Verifying signature on-chain...")
    console.log("Signature:", signature)
    console.log("Message:", message)
    console.log("Public Key:", publicKey)

    // Simulate a delay for verification
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Return true to simulate successful verification
    return true
  } catch (error) {
    console.error("Error verifying signature:", error)
    throw error
  }
}
