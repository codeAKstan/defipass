"use client"

import { createContext, useContext, useEffect, type ReactNode } from "react"
import type { Connection } from "@solana/web3.js"
import { Buffer } from "buffer"
import process from "process"

// Polyfill Buffer and process for browser environment
if (typeof window !== "undefined") {
  window.Buffer = window.Buffer || Buffer
  window.process = window.process || process
}

// Create a context to provide the Solana connection
const WalletContext = createContext<{ connection: Connection | null }>({
  connection: null,
})

export function WalletProvider({
  children,
  connection,
}: {
  children: ReactNode
  connection: Connection
}) {
  // Initialize any required wallet configurations here
  useEffect(() => {
    // This ensures the wallet is properly initialized
    const initWallet = async () => {
      try {
        // Any additional wallet initialization can go here
        console.log("Wallet provider initialized with connection:", connection.rpcEndpoint)
      } catch (error) {
        console.error("Failed to initialize wallet provider:", error)
      }
    }

    initWallet()
  }, [connection])

  return <WalletContext.Provider value={{ connection }}>{children}</WalletContext.Provider>
}

export function useWalletContext() {
  return useContext(WalletContext)
}
