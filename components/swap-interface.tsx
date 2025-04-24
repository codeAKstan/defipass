"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@lazorkit/wallet"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowDown, RefreshCw, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { fetchTokens, fetchQuote, executeSwap } from "@/lib/jupiter"
import type { TokenInfo } from "@/types/token"

export function SwapInterface() {
  const { publicKey, signMessage } = useWallet()
  const [tokens, setTokens] = useState<TokenInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [fromToken, setFromToken] = useState<string>("")
  const [toToken, setToToken] = useState<string>("")
  const [fromAmount, setFromAmount] = useState<string>("0.1")
  const [toAmount, setToAmount] = useState<string>("0")
  const [swapping, setSwapping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Fetch tokens on component mount
  useEffect(() => {
    const getTokens = async () => {
      try {
        setLoading(true)
        const tokenList = await fetchTokens()
        setTokens(tokenList)

        // Set default tokens (SOL and USDC)
        const sol = tokenList.find((t) => t.symbol === "SOL")
        const usdc = tokenList.find((t) => t.symbol === "USDC")

        if (sol) setFromToken(sol.address)
        if (usdc) setToToken(usdc.address)

        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch tokens:", error)
        setError("Failed to load tokens. Please try again.")
        setLoading(false)
      }
    }

    getTokens()
  }, [])

  // Get quote when inputs change
  useEffect(() => {
    const getQuote = async () => {
      if (!fromToken || !toToken || !fromAmount || Number.parseFloat(fromAmount) <= 0) {
        setToAmount("0")
        return
      }

      try {
        setError(null)
        const quote = await fetchQuote({
          inputMint: fromToken,
          outputMint: toToken,
          amount: Number.parseFloat(fromAmount),
          slippageBps: 50, // 0.5%
        })

        if (quote) {
          setToAmount(quote.outAmount.toString())
        }
      } catch (error) {
        console.error("Failed to fetch quote:", error)
        setError("Failed to get swap quote. Please try different tokens or amount.")
      }
    }

    getQuote()
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
      setError(null)
      setSuccess(null)

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
        const signature = await signMessage(new Uint8Array(Buffer.from(message, "base64")))
        console.log("Transaction signed:", signature)

        // Here you would normally send the signature to your backend
        // which would then verify it using the on-chain program

        setSuccess(`Swap successful! Transaction ID: ${txid}`)
      }
    } catch (error) {
      console.error("Swap failed:", error)
      setError("Swap failed. Please try again.")
    } finally {
      setSwapping(false)
    }
  }

  const getTokenByAddress = (address: string) => {
    return tokens.find((t) => t.address === address)
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Swap Tokens</CardTitle>
        <CardDescription>Powered by Jupiter Exchange</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
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
              <Input id="toAmount" type="text" value={toAmount} readOnly placeholder="0.0" disabled />
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
                  ? `1 ${getTokenByAddress(fromToken)?.symbol} ≈ ${(Number.parseFloat(toAmount) / Number.parseFloat(fromAmount)).toFixed(6)} ${getTokenByAddress(toToken)?.symbol}`
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
