"use client"

import { Button } from "@/components/ui/button"
import { SubmitButton } from "./SubmitButton"
import { toast } from "sonner"
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog"

type Props = {
  action: (formData: FormData) => void | Promise<void>
  fields: Record<string, string>        // versteckte Felder, z.B. { userId } oder { userId, newStatus }
  triggerLabel: string                  // Text auf dem öffnenden Button
  confirmLabel?: string                 // Text auf dem Bestätigen-Button
  title?: string
  description?: string
  triggerVariant?: "outline" | "destructive"
  confirmVariant?: "outline" | "destructive" | "default"
  successMessage?: string               // wenn gesetzt: Toast nach erfolgreicher Aktion
}

export function ConfirmActionButton({
  action,
  fields,
  triggerLabel,
  confirmLabel = "Bestätigen",
  title = "Bist du sicher?",
  description = "Diese Aktion kann nicht rückgängig gemacht werden.",
  triggerVariant = "destructive",
  confirmVariant = "destructive",
  successMessage,
}: Props) {
  const submit = successMessage
    ? async (formData: FormData) => {
        await action(formData)
        toast.success(successMessage)
      }
    : action

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" size="sm" variant={triggerVariant}>{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Abbrechen</Button>
          </DialogClose>
          <form action={submit}>
            {Object.entries(fields).map(([name, value]) => (
              <input key={name} type="hidden" name={name} value={value} />
            ))}
            <SubmitButton variant={confirmVariant}>{confirmLabel}</SubmitButton>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}