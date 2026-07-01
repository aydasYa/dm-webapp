"use client"

import { useEffect, useState } from "react"

export function PasswordMatchHint() {
  const [message, setMessage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const password = document.querySelector<HTMLInputElement>('input[name="password"]')
    const passwordConfirm = document.querySelector<HTMLInputElement>('input[name="passwordConfirm"]')

    if (!password || !passwordConfirm) return

    const checkPasswords = () => {
      if (!password.value || !passwordConfirm.value) {
        setMessage(null)
        return
      }

      if (password.value !== passwordConfirm.value) {
        setIsError(true)
        setMessage("Die Passwörter müssen identisch sein.")
        return
      }

      setIsError(false)
      setMessage("Die Passwörter stimmen überein.")
    }

    password.addEventListener("input", checkPasswords)
    passwordConfirm.addEventListener("input", checkPasswords)

    return () => {
      password.removeEventListener("input", checkPasswords)
      passwordConfirm.removeEventListener("input", checkPasswords)
    }
  }, [])

  if (!message) return null

  return (
    <p className={isError ? "text-sm text-destructive" : "text-sm text-success"}>
      {message}
    </p>
  )
}