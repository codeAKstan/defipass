import { WalletProvider } from "@/components/wallet-provider"
import { Hero } from "@/components/hero"
import { Dashboard } from "@/components/dashboard"
import { DocumentationPanel } from "@/components/documentation-panel"
import { ThemeToggleContainer } from "@/components/theme-toggle-container"

export default function Home() {
  return (
    <WalletProvider>
      <main className="min-h-screen bg-gradient-to-b from-background to-background/80">
        <ThemeToggleContainer />
        <Hero />
        <Dashboard />
        <DocumentationPanel />
      </main>
    </WalletProvider>
  )
}
