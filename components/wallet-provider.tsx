"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { Connection } from "@solana/web3.js"
import { useWallet } from "@lazorkit/wallet"
import { Buffer } from "buffer"
import { ConnectionModal } from "./connection-modal"

// Polyfill Buffer for browser
if (typeof window !== "undefined") {
  window.Buffer = window.Buffer || Buffer
}

// Define the context type
type WalletContextType = {
  connection: Connection | null
  isConnected: boolean
  publicKey: string | null
  connect: () => Promise<void>
  disconnect: () => void
  signMessage: (message: Uint8Array) => Promise<Uint8Array>
  isLoading: boolean
  error: string | null
}

// Create context with default values
const WalletContext = createContext<WalletContextType>({
  connection: null,
  isConnected: false,
  publicKey: null,
  connect: async () => {},
  disconnect: () => {},
  signMessage: async () => new Uint8Array(),
  isLoading: false,
  error: null,
})

// Hook to use the wallet context
export const useWalletContext = () => useContext(WalletContext)

// Client Component wrapper to handle client-side only code
function ClientWalletProvider({ children }: { children: ReactNode }) {
  const [connection, setConnection] = useState<Connection | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showConnectionModal, setShowConnectionModal] = useState(false)

  // Initialize connection
  useEffect(() => {
    const conn = new Connection("https://api.mainnet-beta.solana.com")
    setConnection(conn)
  }, [])

  // Use LazorKit wallet hook - only runs on client side
  const {
    isConnected,
    publicKey,
    connect: lazorConnect,
    disconnect: lazorDisconnect,
    signMessage: lazorSignMessage,
    error,
  } = useWallet(connection || new Connection("https://api.mainnet-beta.solana.com"))

  // Connect function with loading state
  const connect = async () => {
    setIsLoading(true)
    try {
      await lazorConnect()
      // Show connection modal after successful connection
      setShowConnectionModal(true)
    } catch (err) {
      console.error("Connection error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle modal close and page refresh
  const handleModalClose = () => {
    setShowConnectionModal(false)
    // Force a page refresh to ensure wallet state is properly reflected
    window.location.reload()
  }

  // Wrap the context values
  const contextValue: WalletContextType = {
    connection,
    isConnected,
    publicKey,
    connect,
    disconnect: lazorDisconnect,
    signMessage: lazorSignMessage,
    isLoading,
    error,
  }

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
      <ConnectionModal isOpen={showConnectionModal} onClose={handleModalClose} publicKey={publicKey} />
    </WalletContext.Provider>
  )
}

// Server-safe provider that conditionally renders the client provider
export function WalletProvider({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Provide a fallback context for server-side rendering
  const fallbackContextValue: WalletContextType = {
    connection: null,
    isConnected: false,
    publicKey: null,
    connect: async () => {},
    disconnect: () => {},
    signMessage: async () => new Uint8Array(),
    isLoading: false,
    error: null,
  }

  // Only render the client provider on the client side
  if (!isMounted) {
    return <WalletContext.Provider value={fallbackContextValue}>{children}</WalletContext.Provider>
  }

  return <ClientWalletProvider>{children}</ClientWalletProvider>
}
