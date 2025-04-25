"use client"

import { useState, useEffect } from "react"
import { useWalletContext } from "./wallet-provider"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink } from "lucide-react"

// Mock transaction data - in a real app, this would come from blockchain data
const mockTransactions = [
  {
    id: "tx1",
    type: "swap",
    status: "confirmed",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    details: {
      fromToken: "SOL",
      toToken: "USDC",
      fromAmount: "0.5",
      toAmount: "50.125",
    },
  },
  {
    id: "tx2",
    type: "swap",
    status: "confirmed",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    details: {
      fromToken: "USDC",
      toToken: "BONK",
      fromAmount: "10",
      toAmount: "55000",
    },
  },
  {
    id: "tx3",
    type: "transfer",
    status: "confirmed",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    details: {
      token: "SOL",
      amount: "0.1",
      to: "8xhYf...j2Hy",
    },
  },
]

export function RecentActivity() {
  const { publicKey } = useWalletContext()
  const [transactions, setTransactions] = useState<typeof mockTransactions | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate fetching transaction history
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true)
      try {
        // In a real app, you would fetch the actual transaction history
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setTransactions(mockTransactions)
      } catch (error) {
        console.error("Error fetching transactions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (publicKey) {
      fetchTransactions()
    }
  }, [publicKey])

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`
    } else if (diffMins < 24 * 60) {
      const diffHours = Math.floor(diffMins / 60)
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
    } else {
      const diffDays = Math.floor(diffMins / (60 * 24))
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No recent activity found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {transactions.map((tx) => (
        <div key={tx.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
          <div className="bg-primary/20 p-2 rounded-full">
            {tx.type === "swap" ? (
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">
                  {tx.type === "swap"
                    ? `Swap ${tx.details.fromToken} to ${tx.details.toToken}`
                    : `Send ${tx.details.token}`}
                </h4>
                <Badge variant="outline" className="text-xs">
                  {tx.status}
                </Badge>
              </div>
              <a
                href={`https://explorer.solana.com/tx/${tx.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="text-sm text-muted-foreground">
              {tx.type === "swap"
                ? `${tx.details.fromAmount} ${tx.details.fromToken} → ${tx.details.toAmount} ${tx.details.toToken}`
                : `${tx.details.amount} ${tx.details.token} to ${tx.details.to}`}
            </div>

            <div className="text-xs text-muted-foreground mt-1">{formatTime(tx.timestamp)}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
