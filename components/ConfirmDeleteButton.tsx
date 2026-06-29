"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog"

type Props = {
  action: (formData: FormData) => void
  userId: string
  title?: string
  description?: string
}

export function ConfirmDeleteButton({
  action,
  userId,
  title = "Wirklich löschen?",
  description = "Diese Aktion kann nicht rückgängig gemacht werden.",
}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" size="sm" variant="destructive">Löschen</Button>
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
            <input type="hidden" name="userId" value={userId} />
            <Button type="submit" variant="destructive">Löschen</Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}