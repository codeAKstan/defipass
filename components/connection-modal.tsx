"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ShieldCheck } from "lucide-react"

interface ConnectionModalProps {
  isOpen: boolean
  onClose: () => void
  publicKey: string | null
}

export function ConnectionModal({ isOpen, onClose, publicKey }: ConnectionModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-green-500" />
            Wallet Connected Successfully
          </DialogTitle>
          <DialogDescription>Your wallet has been connected using Passkey authentication.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-4">
          <div className="bg-primary/20 p-4 rounded-full mb-4">
            <ShieldCheck className="h-10 w-10 text-primary" />
          </div>

          <p className="text-center mb-2">You are now connected with address:</p>
          <code className="bg-secondary p-2 rounded text-xs w-full text-center overflow-hidden text-ellipsis">
            {publicKey}
          </code>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Continue to Dashboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
