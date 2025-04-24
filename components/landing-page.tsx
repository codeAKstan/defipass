"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Connection } from "@solana/web3.js"
import { useWallet } from "@lazorkit/wallet"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { WalletProvider } from "@/components/wallet-provider"
import { Shield, Key, Wallet, ArrowRight } from "lucide-react"

export function LandingPage() {
  const router = useRouter()
  const [connection, setConnection] = useState<Connection | null>(null)

  useEffect(() => {
    // Initialize Solana connection
    const conn = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com")
    setConnection(conn)
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
      <LandingContent router={router} />
    </WalletProvider>
  )
}

function LandingContent({ router }: { router: any }) {
  const { isConnected } = useWallet()

  useEffect(() => {
    // Redirect to dashboard if already connected
    if (isConnected) {
      router.push("/dashboard")
    }
  }, [isConnected, router])

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
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Walletless Solana DeFi</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Access DeFi on Solana with just your Passkey. No seed phrases, no browser extensions.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <ConnectButton router={router} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <FeatureCard
            icon={<Key className="h-8 w-8 text-primary" />}
            title="Passkey Authentication"
            description="Log in securely using WebAuthn standards supported by Apple, Google, and the FIDO Alliance."
          />
          <FeatureCard
            icon={<Wallet className="h-8 w-8 text-primary" />}
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

function ConnectButton({ router }: { router: any }) {
  const { connect, isConnected } = useWallet()

  const handleConnect = async () => {
    try {
      await connect()
      if (isConnected) {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Connection failed:", error)
    }
  }

  return (
    <Button size="lg" onClick={handleConnect} className="px-8">
      Connect with Passkey
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
