"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Connection } from "@solana/web3.js"
import { useWallet } from "@lazorkit/wallet"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { WalletProvider } from "@/components/wallet-provider"
import { Shield, Key, WalletIcon, ArrowRight, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function LandingPage() {
  const router = useRouter()
  const [connection, setConnection] = useState<Connection | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initialize Solana connection
    try {
      const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com"
      console.log("Connecting to Solana RPC:", rpcUrl)
      const conn = new Connection(rpcUrl, "confirmed")
      setConnection(conn)
    } catch (err) {
      console.error("Failed to initialize connection:", err)
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
      <LandingContent router={router} error={error} setError={setError} />
    </WalletProvider>
  )
}

function LandingContent({
  router,
  error,
  setError,
}: {
  router: any
  error: string | null
  setError: (error: string | null) => void
}) {
  const { isConnected, publicKey } = useWallet()
  const [manualRedirect, setManualRedirect] = useState(false)

  // Check if wallet is already connected and redirect if needed
  useEffect(() => {
    if (isConnected && publicKey) {
      console.log("Wallet already connected, redirecting to dashboard")
      router.push("/dashboard")
    }
  }, [isConnected, publicKey, router])

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">DeFiPass</h1>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        {error && (
          <Alert variant="destructive" className="mb-6 max-w-md">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {manualRedirect && (
          <Alert className="mb-6 max-w-md">
            <AlertTitle>Wallet Connected!</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>Your wallet has been connected successfully.</p>
              <Button onClick={() => router.push("/dashboard")} className="mt-2">
                Go to Dashboard
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Walletless Solana DeFi</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Access DeFi on Solana with just your Passkey. No seed phrases, no browser extensions.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <ConnectButton router={router} setError={setError} setManualRedirect={setManualRedirect} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <FeatureCard
            icon={<Key className="h-8 w-8 text-primary" />}
            title="Passkey Authentication"
            description="Log in securely using WebAuthn standards supported by Apple, Google, and the FIDO Alliance."
          />
          <FeatureCard
            icon={<WalletIcon className="h-8 w-8 text-primary" />}
            title="No Seed Phrases"
            description="Forget about managing seed phrases. Your biometrics are your keys."
          />
          <FeatureCard
            icon={<ArrowRight className="h-8 w-8 text-primary" />}
            title="Seamless Swaps"
            description="Swap tokens via Jupiter with the best rates and lowest slippage."
          />
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} DeFiPass. Built with LazorKit and Jupiter.
        </div>
      </footer>
    </div>
  )
}

function ConnectButton({
  router,
  setError,
  setManualRedirect,
}: {
  router: any
  setError: (error: string | null) => void
  setManualRedirect: (value: boolean) => void
}) {
  const { connect, isConnected, publicKey } = useWallet()
  const [connecting, setConnecting] = useState(false)
  const [checkCount, setCheckCount] = useState(0)

  // Function to check if wallet is connected with public key
  const checkWalletStatus = useCallback(() => {
    console.log(`Checking wallet status (attempt ${checkCount + 1}):`, { isConnected, publicKey })

    if (isConnected && publicKey) {
      console.log("Wallet connected with public key, redirecting to dashboard")
      router.push("/dashboard")
      return true
    }

    if (checkCount >= 5) {
      console.log("Max check attempts reached, showing manual redirect option")
      if (isConnected) {
        setManualRedirect(true)
      } else {
        setError("Failed to connect wallet after multiple attempts. Please try again.")
      }
      setConnecting(false)
      return true
    }

    setCheckCount((prev) => prev + 1)
    return false
  }, [checkCount, isConnected, publicKey, router, setError, setManualRedirect])

  // Effect to periodically check wallet status after connection attempt
  useEffect(() => {
    if (connecting && checkCount > 0) {
      const timer = setTimeout(() => {
        const done = checkWalletStatus()
        if (!done) {
          // Continue checking
          console.log("Wallet not ready yet, will check again...")
        }
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [connecting, checkCount, checkWalletStatus])

  const handleConnect = async () => {
    try {
      setConnecting(true)
      setError(null)
      setManualRedirect(false)
      setCheckCount(0)

      console.log("Attempting to connect wallet...")
      await connect()

      // Start the checking process
      setCheckCount(1)
    } catch (error) {
      console.error("Connection failed:", error)
      setError(`Connection failed: ${error instanceof Error ? error.message : "Unknown error"}`)
      setConnecting(false)
    }
  }

  return (
    <Button size="lg" onClick={handleConnect} className="px-8" disabled={connecting}>
      {connecting ? (
        <>
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        "Connect with Passkey"
      )}
    </Button>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="mb-2">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}
