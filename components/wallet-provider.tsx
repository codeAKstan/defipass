"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { Connection } from "@solana/web3.js"
import { Buffer } from "buffer"

// Polyfill Buffer for browser environment
if (typeof window !== "undefined") {
  window.Buffer = window.Buffer || Buffer
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
  return <WalletContext.Provider value={{ connection }}>{children}</WalletContext.Provider>
}

export function useWalletContext() {
  return useContext(WalletContext)
}
