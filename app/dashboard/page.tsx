"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { SwapInterface } from "@/components/swap-interface"
import { Documentation } from "@/components/documentation"
import { WalletProvider } from "@/components/wallet-provider"
import { Connection } from "@solana/web3.js"
import { useWallet } from "@lazorkit/wallet"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const router = useRouter()
  const [connection, setConnection] = useState<Connection | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initialize Solana connection
    try {
      const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com"
      console.log("Dashboard: Connecting to Solana RPC:", rpcUrl)
      const conn = new Connection(rpcUrl, "confirmed")
      setConnection(conn)
    } catch (err) {
      console.error("Dashboard: Failed to initialize connection:", err)
      setError("Failed to connect to Solana network. Please try again.")
    }
  }, [])

  if (!connection) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <WalletProvider connection={connection}>
      <DashboardContent router={router} error={error} setError={setError} />
      <Documentation />
    </WalletProvider>
  )
}

function DashboardContent({
  router,
  error,
  setError,
}: {
  router: any
  error: string | null
  setError: (error: string | null) => void
}) {
  const { isConnected, publicKey, connect } = useWallet()
  const [checkingConnection, setCheckingConnection] = useState(true)
  const [reconnecting, setReconnecting] = useState(false)

  // Check wallet connection status
  useEffect(() => {
    const checkWallet = setTimeout(() => {
      console.log("Dashboard: Checking wallet connection status:", isConnected, publicKey)
      setCheckingConnection(false)
    }, 1500)

    return () => clearTimeout(checkWallet)
  }, [isConnected, publicKey])

  // Handle reconnection
  const handleReconnect = async () => {
    try {
      setReconnecting(true)
      await connect()
      setReconnecting(false)
    } catch (error) {
      console.error("Reconnection failed:", error)
      setError("Failed to reconnect wallet. Please try again.")
      setReconnecting(false)
    }
  }

  if (checkingConnection) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If not connected, show reconnect option
  if (!isConnected || !publicKey) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Alert className="mb-6 max-w-md">
          <AlertTitle>Wallet Not Connected</AlertTitle>
          <AlertDescription>Your wallet is not connected. Please reconnect to continue.</AlertDescription>
        </Alert>
        <div className="flex gap-4">
          <Button onClick={handleReconnect} disabled={reconnecting}>
            {reconnecting ? "Reconnecting..." : "Reconnect Wallet"}
          </Button>
          <Button variant="outline" onClick={() => router.push("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <SwapInterface setError={setError} />
      </main>
    </div>
  )
}
