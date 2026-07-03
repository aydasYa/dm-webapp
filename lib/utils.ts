import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Einheitliche Karten-/Panel-Oberfläche (Rand + Schatten) — an EINER Stelle änderbar
export const cardSurface = "ring-[2px] ring-foreground/15 shadow-[0_3px_7px_-1px_rgb(0_0_0/0.1)]"