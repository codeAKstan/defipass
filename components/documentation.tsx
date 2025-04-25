"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react"

export function Documentation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button variant="outline" className="mb-2 shadow-lg" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <>
            <ChevronDown className="mr-2 h-4 w-4" />
            Close Documentation
          </>
        ) : (
          <>
            <ChevronUp className="mr-2 h-4 w-4" />
            View Documentation
          </>
        )}
      </Button>

      {isOpen && (
        <Card className="w-[350px] md:w-[450px] shadow-xl">
          <CardHeader>
            <CardTitle>DeFiPass Documentation</CardTitle>
            <CardDescription>Walletless Solana DeFi via Passkey Authentication</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="usage">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="usage">Usage</TabsTrigger>
                <TabsTrigger value="tech">Tech Stack</TabsTrigger>
                <TabsTrigger value="links">Links</TabsTrigger>
              </TabsList>

              <TabsContent value="usage" className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">How to Use</h3>
                  <ol className="list-decimal pl-5 space-y-1 text-sm">
                    <li>Click "Connect with Passkey" on the landing page</li>
                    <li>Create or select a passkey when prompted</li>
                    <li>Once connected, you'll be redirected to the dashboard</li>
                    <li>Select tokens and amount to swap</li>
                    <li>Click "Swap" and confirm with your passkey</li>
                    <li>Transaction will be verified on-chain via Secp256r1 signatures</li>
                  </ol>
                </div>
              </TabsContent>

              <TabsContent value="tech" className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Technology Stack</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Frontend: Next.js with App Router</li>
                    <li>Authentication: LazorKit SDK for Passkey integration</li>
                    <li>DeFi: Jupiter API for token swapping</li>
                    <li>Styling: Tailwind CSS with shadcn/ui components</li>
                    <li>Signature Verification: Secp256r1 via LazorKit on-chain program</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="links" className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Useful Links</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a
                        href="https://docs.lazorkit.xyz/introduction"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-primary hover:underline"
                      >
                        LazorKit Documentation
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://station.jup.ag/docs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-primary hover:underline"
                      >
                        Jupiter API Documentation
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://github.com/yourusername/defipass"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-primary hover:underline"
                      >
                        GitHub Repository
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
