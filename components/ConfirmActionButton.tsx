"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog"

type Props = {
  action: (formData: FormData) => void
  fields: Record<string, string>        // versteckte Felder, z.B. { userId } oder { userId, newStatus }
  triggerLabel: string                  // Text auf dem öffnenden Button
  confirmLabel?: string                 // Text auf dem Bestätigen-Button
  title?: string
  description?: string
  triggerVariant?: "outline" | "destructive"
  confirmVariant?: "outline" | "destructive" | "default"
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
}: Props) {
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
          <form action={action}>
            {Object.entries(fields).map(([name, value]) => (
              <input key={name} type="hidden" name={name} value={value} />
            ))}
            <Button type="submit" variant={confirmVariant}>{confirmLabel}</Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}