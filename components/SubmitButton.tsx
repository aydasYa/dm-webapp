"use client"

import { useFormStatus } from "react-dom"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = React.ComponentProps<typeof Button> & { pendingText?: string }

export function SubmitButton({ children, pendingText, disabled, ...props }: Props) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending || disabled} {...props}>
      {pending && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
      {pending ? (pendingText ?? children) : children}
    </Button>
  )
}