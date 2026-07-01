"use client"

import { useEffect, useRef } from "react"
import { toast } from "sonner"

// Zeigt einmalig einen Toast, wenn eine Seite nach einem redirect (?flag) geladen wird
export function FlashToast({ message }: { message: string }) {
  const shown = useRef(false)

  useEffect(() => {
    if (shown.current) return
    shown.current = true
    toast.success(message)
  }, [message])

  return null
}
