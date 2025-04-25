"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@lazorkit/wallet"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowDown, RefreshCw, AlertCircle, RotateCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { fetchTokens, fetchQuote, executeSwap, verifySignature } from "@/lib/jupiter"
import type { TokenInfo } from "@/types/token"

export function SwapInterface({ setError }: { setError: (error: string | null) => void }) {
  const { publicKey, signMessage } = useWallet()
  const [tokens, setTokens] = useState<TokenInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [fromToken, setFromToken] = useState<string>("")
  const [toToken, setToToken] = useState<string>("")
  const [fromAmount, setFromAmount] = useState<string>("0.1")
  const [toAmount, setToAmount] = useState<string>("0")
  const [swapping, setSwapping] = useState(false)
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [tokenMap, setTokenMap] = useState<Map<string, TokenInfo>>(new Map())
  const [loadingTokens, setLoadingTokens] = useState(false)

  // Fetch tokens on component mount
  const fetchTokenList = async () => {
    try {
      setLoadingTokens(true)
      setLoading(true)
      setLocalError(null)

      console.log("Fetching token list...")
      const tokenList = await fetchTokens()

      if (tokenList.length === 0) {
        throw new Error("No tokens returned from API")
      }

      setTokens(tokenList)

      // Create a map for quick lookups
      const map = new Map<string, TokenInfo>()
      tokenList.forEach((token) => {
        map.set(token.address, token)
      })
      setTokenMap(map)

      // Set default tokens (SOL and USDC)
      const sol = tokenList.find((t) => t.symbol === "SOL")
      const usdc = tokenList.find((t) => t.symbol === "USDC")

      if (sol) setFromToken(sol.address)
      if (usdc) setToToken(usdc.address)

      setLoading(false)
      setLoadingTokens(false)
    } catch (error) {
      console.error("Failed to fetch tokens:", error)
      setLocalError("Failed to load tokens. Please try again.")
      setError("Failed to load tokens. Please try again.")
      setLoading(false)
      setLoadingTokens(false)
    }
  }

  useEffect(() => {
    fetchTokenList()
  }, [setError])

  // Get quote when inputs change
  useEffect(() => {
    const getQuote = async () => {
      if (!fromToken || !toToken || !fromAmount || Number.parseFloat(fromAmount) <= 0) {
        setToAmount("0")
        return
      }

      try {
        setQuoteLoading(true)
        setLocalError(null)

        console.log("Fetching quote for swap...")
        const quote = await fetchQuote({
          inputMint: fromToken,
          outputMint: toToken,
          amount: Number.parseFloat(fromAmount),
          slippageBps: 50, // 0.5%
        })

        if (quote) {
          setToAmount(quote.outAmount.toString())
        }

        setQuoteLoading(false)
      } catch (error) {
        console.error("Failed to fetch quote:", error)
        setLocalError("Failed to get swap quote. Please try different tokens or amount.")
        setQuoteLoading(false)
      }
    }

    // Debounce the quote request
    const timeoutId = setTimeout(() => {
      if (fromToken && toToken && fromAmount && Number.parseFloat(fromAmount) > 0) {
        getQuote()
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [fromToken, toToken, fromAmount])

  const handleSwapTokens = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)
  }

  const handleSwap = async () => {
    if (!publicKey || !fromToken || !toToken || !fromAmount || Number.parseFloat(fromAmount) <= 0) {
      return
    }

    try {
      setSwapping(true)
      setLocalError(null)
      setSuccess(null)
      setError(null)

      console.log("Executing swap...")
      // Execute the swap
      const { txid, message } = await executeSwap({
        wallet: publicKey,
        inputMint: fromToken,
        outputMint: toToken,
        amount: Number.parseFloat(fromAmount),
        slippageBps: 50,
      })

      // Sign the transaction with passkey
      if (message) {
        console.log("Requesting signature for transaction...")
        const messageBytes = new Uint8Array(Buffer.from(message, "base64"))
        const signature = await signMessage(messageBytes)
        console.log("Transaction signed successfully")

        // Verify the signature on-chain
        console.log("Verifying signature on-chain...")
        const verified = await verifySignature(signature, message, publicKey)

        if (verified) {
          console.log("Signature verified successfully")
          setSuccess(`Swap successful! Transaction ID: ${txid}`)
        } else {
          throw new Error("Signature verification failed")
        }
      }
    } catch (error) {
      console.error("Swap failed:", error)
      setLocalError(`Swap failed: ${error instanceof Error ? error.message : "Unknown error"}`)
      setError(`Swap failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setSwapping(false)
    }
  }

  const getTokenByAddress = (address: string) => {
    return tokenMap.get(address)
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Swap Tokens</CardTitle>
          <CardDescription>Powered by Jupiter Exchange</CardDescription>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={fetchTokenList}
          disabled={loadingTokens}
          title="Refresh token list"
        >
          <RotateCw className={`h-4 w-4 ${loadingTokens ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {localError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{localError}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-50">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="fromAmount">From</Label>
            {fromToken && <span className="text-sm text-muted-foreground">Balance: Loading...</span>}
          </div>
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                id="fromAmount"
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.0"
                disabled={loading || swapping}
              />
            </div>
            <Select value={fromToken} onValueChange={setFromToken} disabled={loading || swapping}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <div className="p-2">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : tokens.length === 0 ? (
                  <div className="p-2 text-center">
                    <p className="text-sm text-muted-foreground mb-2">No tokens available</p>
                    <Button size="sm" onClick={fetchTokenList} className="w-full">
                      Retry
                    </Button>
                  </div>
                ) : (
                  tokens.map((token) => (
                    <SelectItem key={token.address} value={token.address}>
                      {token.symbol}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-center">
          <Button variant="ghost" size="icon" onClick={handleSwapTokens} disabled={loading || swapping}>
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="toAmount">To (Estimated)</Label>
            {toToken && <span className="text-sm text-muted-foreground">Balance: Loading...</span>}
          </div>
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                id="toAmount"
                type="text"
                value={quoteLoading ? "Loading..." : toAmount}
                readOnly
                placeholder="0.0"
                disabled
              />
            </div>
            <Select value={toToken} onValueChange={setToToken} disabled={loading || swapping}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <div className="p-2">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : tokens.length === 0 ? (
                  <div className="p-2 text-center">
                    <p className="text-sm text-muted-foreground mb-2">No tokens available</p>
                    <Button size="sm" onClick={fetchTokenList} className="w-full">
                      Retry
                    </Button>
                  </div>
                ) : (
                  tokens.map((token) => (
                    <SelectItem key={token.address} value={token.address}>
                      {token.symbol}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {fromToken && toToken && (
          <div className="text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Rate</span>
              <span>
                {Number.parseFloat(fromAmount) > 0 && Number.parseFloat(toAmount) > 0
                  ? `1 ${getTokenByAddress(fromToken)?.symbol || ""} ≈ ${(
                      Number.parseFloat(toAmount) / Number.parseFloat(fromAmount)
                    ).toFixed(6)} ${getTokenByAddress(toToken)?.symbol || ""}`
                  : "Enter an amount"}
              </span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleSwap}
          disabled={loading || swapping || !fromToken || !toToken || Number.parseFloat(fromAmount) <= 0}
        >
          {swapping ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Swapping...
            </>
          ) : (
            "Swap"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
