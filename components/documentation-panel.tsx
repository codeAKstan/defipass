"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Code, FileText, HelpCircle, Layers, PlayCircle } from "lucide-react"

export function DocumentationPanel() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <HelpCircle className="mr-2 h-5 w-5" />
            Documentation
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-2xl">DeFiPass Documentation</SheetTitle>
            <SheetDescription>Walletless Solana DeFi via Passkey Authentication</SheetDescription>
          </SheetHeader>

          <Tabs defaultValue="guide" className="mt-4">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="guide">
                <PlayCircle className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Guide</span>
              </TabsTrigger>
              <TabsTrigger value="tech">
                <Code className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Tech</span>
              </TabsTrigger>
              <TabsTrigger value="resources">
                <FileText className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Resources</span>
              </TabsTrigger>
              <TabsTrigger value="about">
                <BookOpen className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">About</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="guide" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Step-by-Step Testing Guide</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    <strong>Connect your wallet</strong>: Click the "Connect with Passkey" button on the homepage.
                  </li>
                  <li>
                    <strong>Create a passkey</strong>: Follow the browser prompts to create a new passkey (uses your
                    device's biometric authentication).
                  </li>
                  <li>
                    <strong>View your dashboard</strong>: After connecting, you'll see your wallet address and SOL
                    balance.
                  </li>
                  <li>
                    <strong>Try swapping tokens</strong>: Go to the Swap tab and select tokens to swap.
                  </li>
                  <li>
                    <strong>Sign a transaction</strong>: When you click "Swap", you'll be prompted to sign the
                    transaction with your passkey.
                  </li>
                  <li>
                    <strong>View transaction history</strong>: Check the Activity tab to see your transaction history.
                  </li>
                </ol>
              </div>

              <div className="space-y-2">
                {/* <h3 className="text-lg font-medium">For Judges</h3>
                <p>
                  This application demonstrates a complete walletless DeFi experience using Passkeys for authentication
                  and transaction signing. Key features to evaluate:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Seamless Passkey authentication flow</li>
                  <li>Real-time balance fetching from Solana blockchain</li>
                  <li>Jupiter integration for token swapping</li>
                  <li>On-chain verification of Secp256r1 signatures</li>
                  <li>Clean, responsive UI with dark mode support</li>
                </ul> */}
              </div>
            </TabsContent>

            <TabsContent value="tech" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Technical Stack</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Frontend</h4>
                    <ul className="list-disc pl-5">
                      <li>Next.js 14 (App Router)</li>
                      <li>React 18</li>
                      <li>TypeScript</li>
                      <li>Tailwind CSS</li>
                      <li>shadcn/ui components</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium">Authentication</h4>
                    <ul className="list-disc pl-5">
                      <li>LazorKit SDK (@lazorkit/wallet)</li>
                      <li>WebAuthn/Passkey standards</li>
                      <li>Secp256r1 signatures</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium">Blockchain</h4>
                    <ul className="list-disc pl-5">
                      <li>Solana Web3.js</li>
                      <li>Jupiter API for token swapping</li>
                      <li>LazorKit on-chain program for signature verification</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Architecture</h3>
                <p>
                  DeFiPass uses a client-side architecture where all blockchain interactions happen directly from the
                  browser. The application flow:
                </p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>User authenticates with Passkey (WebAuthn)</li>
                  <li>LazorKit SDK derives a Solana wallet from the Passkey</li>
                  <li>Transactions are prepared client-side</li>
                  <li>User signs transactions with their Passkey</li>
                  <li>Signatures are verified on-chain via Secp256r1 program</li>
                </ol>
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Useful Links</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="https://docs.lazorkit.xyz/introduction"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-500 hover:underline"
                    >
                      <Layers className="h-4 w-4 mr-2" />
                      LazorKit Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://station.jup.ag/docs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-500 hover:underline"
                    >
                      <Layers className="h-4 w-4 mr-2" />
                      Jupiter API Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://solana.com/developers"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-500 hover:underline"
                    >
                      <Layers className="h-4 w-4 mr-2" />
                      Solana Developer Resources
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/yourusername/defipass"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-500 hover:underline"
                    >
                      <Code className="h-4 w-4 mr-2" />
                      Project GitHub Repository
                    </a>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Submission Details</h3>
                <p>This project was created for the LazorKit Hackathon. To submit your own project:</p>
                <ul className="list-disc pl-5">
                  <li>
                    Join the TG group:{" "}
                    <a
                      href="https://t.me/+RZ3Y8_ZRnOJiMjll"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      https://t.me/+RZ3Y8_ZRnOJiMjll
                    </a>
                  </li>
                  <li>
                    Submit your project:{" "}
                    <a
                      href="https://portal.lazorkit.xyz/submit"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      https://portal.lazorkit.xyz/submit
                    </a>
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="about" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">About DeFiPass</h3>
                <p>
                  DeFiPass is a walletless Solana DeFi application that enables users to interact with decentralized
                  finance protocols using Passkey authentication instead of traditional seed phrases.
                </p>
                <p>
                  By leveraging WebAuthn standards and Secp256r1 signatures, DeFiPass provides a secure, user-friendly
                  way to access Solana DeFi without the complexity of managing seed phrases or installing browser
                  extensions.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Key Features</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Passkey Authentication</strong>: Log in with device biometrics (fingerprint, face ID)
                  </li>
                  <li>
                    <strong>No Seed Phrases</strong>: Enhanced security without the risk of losing seed phrases
                  </li>
                  <li>
                    <strong>Jupiter Integration</strong>: Swap tokens with the best rates across Solana
                  </li>
                  <li>
                    <strong>On-Chain Verification</strong>: All transactions verified on-chain via Secp256r1 signatures
                  </li>
                  <li>
                    <strong>Real-time Balances</strong>: View your actual token balances from the blockchain
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t">
                <p className="text-sm text-muted-foreground">Created for the LazorKit Hackathon 2023</p>
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </div>
  )
}
