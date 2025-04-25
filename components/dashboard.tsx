"use client"

import { useState, useEffect } from "react"
import { useWalletContext } from "./wallet-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SwapInterface } from "./swap-interface"
import { WalletInfo } from "./wallet-info"
import { RecentActivity } from "./recent-activity"

export function Dashboard() {
  const { isConnected } = useWalletContext()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration errors
  useEffect(() => {
    setMounted(true)
  }, [])

  // Change the conditional rendering to make sure dashboard appears immediately after connection
  if (!mounted) return null
  if (!isConnected) return null

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Your Dashboard</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="swap" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="swap">Swap</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="swap">
                <Card>
                  <CardHeader>
                    <CardTitle>Swap Tokens</CardTitle>
                    <CardDescription>Powered by Jupiter - the best swap rates across Solana</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SwapInterface />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your recent transactions and swaps</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentActivity />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <WalletInfo />
          </div>
        </div>
      </div>
    </section>
  )
}
