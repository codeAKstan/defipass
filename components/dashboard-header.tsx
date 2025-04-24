"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useWallet } from "@lazorkit/wallet"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Shield, Copy, LogOut, Check } from "lucide-react"
import { truncateAddress } from "@/lib/utils"

export function DashboardHeader() {
  const router = useRouter()
  const { publicKey, disconnect } = useWallet()
  const [copied, setCopied] = useState(false)

  const handleCopyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    router.push("/")
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">DeFiPass</h1>
        </div>

        <div className="flex items-center space-x-4">
          {publicKey && (
            <div className="flex items-center bg-secondary rounded-lg px-3 py-1.5">
              <span className="text-sm font-medium mr-2">{truncateAddress(publicKey)}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopyAddress}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          )}

          <Button variant="outline" size="sm" onClick={handleDisconnect}>
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect
          </Button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
