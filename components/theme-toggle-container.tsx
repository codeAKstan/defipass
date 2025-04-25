"use client"

import { ThemeSwitcher } from "./theme-switcher"

export function ThemeToggleContainer() {
  return (
    <div className="fixed top-4 right-4 z-50">
      <ThemeSwitcher />
    </div>
  )
}
