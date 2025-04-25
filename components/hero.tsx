"use client"

import { useState, useEffect } from "react"
import { useWalletContext } from "./wallet-provider"
import { Button } from "@/components/ui/button"
import { Sparkles, Key, ShieldCheck } from "lucide-react"

export function Hero() {
  const { connection, isConnected, publicKey, connect, isLoading } = useWalletContext()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration errors
  useEffect(() => {
    setMounted(true)
  }, [])

  // Add a new useEffect to handle the dashboard visibility when connected
  useEffect(() => {
    if (isConnected && publicKey) {
      // Force a re-render when connection state changes
      setMounted(false)
      setTimeout(() => setMounted(true), 0)
    }
  }, [isConnected, publicKey])

  if (!mounted) return null

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/amethyst-flow.png')] opacity-20 bg-cover bg-center" />

      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            DeFiPass
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
            Walletless Solana DeFi via Passkey Authentication
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
            {!isConnected ? (
              <>
                {connection && (
                  <Button
                    size="lg"
                    onClick={connect}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isLoading ? "Connecting..." : "Connect with Passkey"}
                    <Key className="ml-2 h-4 w-4" />
                  </Button>
                )}
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <p className="text-green-400 font-medium flex items-center">
                  <ShieldCheck className="mr-2 h-5 w-5" />
                  Connected with Passkey
                </p>
                <p className="text-sm text-muted-foreground font-mono">
                  {publicKey?.slice(0, 6)}...{publicKey?.slice(-4)}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-secondary/50 backdrop-blur-sm p-6 rounded-lg">
              <div className="bg-primary/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Key className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Seed Phrases</h3>
              <p className="text-muted-foreground">Secure authentication using device biometrics and Passkeys</p>
            </div>

            <div className="bg-secondary/50 backdrop-blur-sm p-6 rounded-lg">
              <div className="bg-primary/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">On-Chain Verification</h3>
              <p className="text-muted-foreground">Fully verified transactions using Secp256r1 signatures</p>
            </div>

            <div className="bg-secondary/50 backdrop-blur-sm p-6 rounded-lg">
              <div className="bg-primary/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Jupiter Integration</h3>
              <p className="text-muted-foreground">Swap tokens with the best rates across Solana</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
