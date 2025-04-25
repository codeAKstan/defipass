"use client"

import { useState, useEffect } from "react"
import { useWalletContext } from "./wallet-provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Copy, ExternalLink, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"

export function WalletInfo() {
  const { connection, publicKey, disconnect } = useWalletContext()
  const [balance, setBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Fetch real SOL balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (!connection || !publicKey) return

      setIsLoading(true)
      try {
        // Convert string publicKey to PublicKey object
        const pubKeyObj = new PublicKey(publicKey)

        // Fetch the actual balance from the blockchain
        const lamports = await connection.getBalance(pubKeyObj)
        const solBalance = lamports / LAMPORTS_PER_SOL
        setBalance(solBalance)
      } catch (error) {
        console.error("Error fetching balance:", error)
        // Fallback to a default value if there's an error
        setBalance(0)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBalance()
  }, [connection, publicKey])

  const copyAddress = () => {
    if (!publicKey) return

    // Make sure we're on the client side
    if (typeof window !== "undefined") {
      try {
        // Modern clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard
            .writeText(publicKey)
            .then(() => {
              toast({
                title: "Address copied",
                description: "Wallet address copied to clipboard",
              })
            })
            .catch((err) => {
              console.error("Failed to copy address:", err)
              fallbackCopy()
            })
        } else {
          // Fallback for browsers that don't support clipboard API
          fallbackCopy()
        }
      } catch (error) {
        console.error("Copy failed:", error)
        fallbackCopy()
      }
    }
  }

  // Add this fallback copy function
  const fallbackCopy = () => {
    try {
      // Create a temporary input element
      const textArea = document.createElement("textarea")
      textArea.value = publicKey || ""

      // Make the textarea out of viewport
      textArea.style.position = "fixed"
      textArea.style.left = "-999999px"
      textArea.style.top = "-999999px"
      document.body.appendChild(textArea)

      // Select and copy
      textArea.focus()
      textArea.select()
      const successful = document.execCommand("copy")
      document.body.removeChild(textArea)

      if (successful) {
        toast({
          title: "Address copied",
          description: "Wallet address copied to clipboard",
        })
      } else {
        toast({
          title: "Copy failed",
          description: "Could not copy address to clipboard",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Fallback copy failed:", err)
      toast({
        title: "Copy failed",
        description: "Could not copy address to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleDisconnect = () => {
    disconnect()
    toast({
      title: "Disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet</CardTitle>
        <CardDescription>Your wallet information and balance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-1">Address</p>
          <div className="flex items-center gap-2">
            <code className="bg-secondary p-2 rounded text-xs w-full overflow-hidden text-ellipsis">{publicKey}</code>
            <Button variant="outline" size="icon" onClick={copyAddress}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-1">SOL Balance</p>
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <p className="text-2xl font-bold">{balance !== null ? balance.toFixed(4) : "0"} SOL</p>
          )}
        </div>

        <div className="pt-4">
          <p className="text-sm font-medium mb-2">Authentication</p>
          <div className="flex items-center gap-2 text-sm text-green-400">
            <span className="inline-block h-2 w-2 rounded-full bg-green-400"></span>
            Authenticated with Passkey
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            if (typeof window !== "undefined" && publicKey) {
              window.open(`https://explorer.solana.com/address/${publicKey}`, "_blank")
            }
          }}
        >
          View on Explorer
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
        <Button variant="destructive" className="w-full" onClick={handleDisconnect}>
          Disconnect
          <LogOut className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
