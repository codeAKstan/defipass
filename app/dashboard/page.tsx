"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { SwapInterface } from "@/components/swap-interface"
import { WalletProvider } from "@/components/wallet-provider"
import { Connection } from "@solana/web3.js"
import { useWallet } from "@lazorkit/wallet"

export default function DashboardPage() {
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
      <DashboardContent router={router} />
    </WalletProvider>
  )
}

function DashboardContent({ router }: { router: any }) {
  const { isConnected, publicKey } = useWallet()

  useEffect(() => {
    // Redirect to home if not connected
    if (!isConnected) {
      router.push("/")
    }
  }, [isConnected, router])

  if (!isConnected || !publicKey) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <SwapInterface />
      </main>
    </div>
  )
}
