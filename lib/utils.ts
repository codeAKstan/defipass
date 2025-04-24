import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateAddress(address: string, start = 4, end = 4): string {
  if (!address) return ""
  if (address.length <= start + end) return address
  return `${address.slice(0, start)}...${address.slice(-end)}`
}

export function formatAmount(amount: number | string, decimals = 6): string {
  const num = typeof amount === "string" ? Number.parseFloat(amount) : amount
  if (isNaN(num)) return "0"

  if (num < 0.000001) {
    return "<0.000001"
  }

  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  })
}
