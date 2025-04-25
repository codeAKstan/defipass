"use client"

import { useState, useEffect } from "react"
import { useWalletContext } from "./wallet-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowDownUp, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock token data - in a real app, this would come from Jupiter API
const tokens = [
  { symbol: "SOL", name: "Solana", icon: "/abstract-solana.png", decimals: 9 },
  { symbol: "USDC", name: "USD Coin", icon: "/usdc-digital-currency.png", decimals: 6 },
  { symbol: "BONK", name: "Bonk", icon: "/stylized-dog-profile.png", decimals: 5 },
  { symbol: "JUP", name: "Jupiter", icon: "/jupiter-inspired-abstract.png", decimals: 6 },
]

export function SwapInterface() {
  const { publicKey, signMessage } = useWalletContext()
  const { toast } = useToast()

  const [fromToken, setFromToken] = useState(tokens[0])
  const [toToken, setToToken] = useState(tokens[1])
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isPriceLoading, setIsPriceLoading] = useState(false)
  const [priceImpact, setPriceImpact] = useState<string | null>(null)
  const [route, setRoute] = useState<any | null>(null)

  // Fix the BN.js assertion error by ensuring proper number handling

  // Update the useEffect for fetching price to handle number parsing safely
  useEffect(() => {
    const fetchPrice = async () => {
      if (!fromAmount || isNaN(Number(fromAmount)) || Number(fromAmount) <= 0) {
        setToAmount("")
        setPriceImpact(null)
        setRoute(null)
        return
      }

      setIsPriceLoading(true)
      try {
        // In a real app, you would fetch the actual price from Jupiter API
        // For demo purposes, we'll use mock data
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Mock conversion rate
        let rate = 0
        if (fromToken.symbol === "SOL" && toToken.symbol === "USDC") {
          rate = 100.25
        } else if (fromToken.symbol === "USDC" && toToken.symbol === "SOL") {
          rate = 0.00997
        } else if (fromToken.symbol === "SOL" && toToken.symbol === "BONK") {
          rate = 55000
        } else if (fromToken.symbol === "BONK" && toToken.symbol === "SOL") {
          rate = 0.000018
        } else if (fromToken.symbol === "SOL" && toToken.symbol === "JUP") {
          rate = 15.5
        } else if (fromToken.symbol === "JUP" && toToken.symbol === "SOL") {
          rate = 0.0645
        } else {
          rate = 1
        }

        const parsedAmount = Number(fromAmount) || 0
        const calculatedAmount = (parsedAmount * rate).toFixed(toToken.decimals)
        setToAmount(calculatedAmount)

        // Mock price impact
        setPriceImpact((Math.random() * 0.5).toFixed(2))

        // Mock route
        setRoute({
          inAmount: fromAmount,
          outAmount: calculatedAmount,
          marketInfos: [{ label: "Jupiter", percent: 100 }],
        })
      } catch (error) {
        console.error("Error fetching price:", error)
        toast({
          title: "Error",
          description: "Failed to fetch price. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsPriceLoading(false)
      }
    }

    fetchPrice()
  }, [fromToken, toToken, fromAmount, toast])

  const handleSwapTokens = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  // Update the handleSwap function to handle number parsing safely
  const handleSwap = async () => {
    if (!route || !publicKey) return

    setIsLoading(true)
    try {
      // In a real app, you would:
      // 1. Get the transaction from Jupiter API
      // 2. Sign it with the user's passkey
      // 3. Send it to the blockchain

      // For demo purposes, we'll simulate the process
      toast({
        title: "Preparing transaction...",
        description: "Getting the best route for your swap",
      })

      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create a mock message to sign - use string encoding to avoid BN.js issues
      const mockMessage = new TextEncoder().encode(
        `Swap ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}`,
      )

      toast({
        title: "Waiting for signature...",
        description: "Please approve the transaction with your passkey",
      })

      // Request signature from the user's passkey
      const signature = await signMessage(mockMessage)

      toast({
        title: "Transaction signed!",
        description: "Sending transaction to the blockchain",
      })

      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Swap successful!",
        description: `Swapped ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}`,
        variant: "success",
      })

      // Reset form
      setFromAmount("")
      setToAmount("")
      setPriceImpact(null)
      setRoute(null)
    } catch (error) {
      console.error("Swap error:", error)
      toast({
        title: "Swap failed",
        description: "There was an error processing your swap. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>From</Label>
          <div className="flex gap-2">
            <Select
              value={fromToken.symbol}
              onValueChange={(value) => setFromToken(tokens.find((t) => t.symbol === value) || tokens[0])}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                {tokens.map((token) => (
                  <SelectItem key={token.symbol} value={token.symbol} disabled={token.symbol === toToken.symbol}>
                    <div className="flex items-center gap-2">
                      <img src={token.icon || "/placeholder.svg"} alt={token.name} className="w-5 h-5 rounded-full" />
                      <span>{token.symbol}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="0.00"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button variant="outline" size="icon" onClick={handleSwapTokens}>
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <Label>To</Label>
          <div className="flex gap-2">
            <Select
              value={toToken.symbol}
              onValueChange={(value) => setToToken(tokens.find((t) => t.symbol === value) || tokens[1])}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                {tokens.map((token) => (
                  <SelectItem key={token.symbol} value={token.symbol} disabled={token.symbol === fromToken.symbol}>
                    <div className="flex items-center gap-2">
                      <img src={token.icon || "/placeholder.svg"} alt={token.name} className="w-5 h-5 rounded-full" />
                      <span>{token.symbol}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="number" placeholder="0.00" value={toAmount} readOnly className="flex-1" />
          </div>
        </div>
      </div>

      {isPriceLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ) : route ? (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Rate</span>
            <span>
              1 {fromToken.symbol} ≈ {(Number.parseFloat(toAmount) / Number.parseFloat(fromAmount)).toFixed(6)}{" "}
              {toToken.symbol}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Price Impact</span>
            <span className={Number.parseFloat(priceImpact || "0") > 1 ? "text-amber-500" : "text-green-500"}>
              {priceImpact}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Route</span>
            <span>Jupiter</span>
          </div>
        </div>
      ) : null}

      <Button
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        disabled={!route || isLoading}
        onClick={handleSwap}
      >
        {isLoading ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Swapping...
          </>
        ) : !fromAmount ? (
          "Enter an amount"
        ) : !route ? (
          "Insufficient balance"
        ) : (
          `Swap ${fromToken.symbol} to ${toToken.symbol}`
        )}
      </Button>
    </div>
  )
}
