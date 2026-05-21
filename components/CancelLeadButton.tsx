"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cancelLead } from "@/app/actions/leads"
import { XCircle } from "lucide-react"

type Props = {
  leadId: string
}

export default function CancelLeadButton({ leadId }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <XCircle className="mr-2 h-4 w-4" />
          Stornieren
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lead stornieren?</DialogTitle>
          <DialogDescription>
            Bist du sicher, dass du diesen Lead stornieren möchtest? Diese Aktion
            kann nicht rückgängig gemacht werden.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Abbrechen
          </Button>
          <form action={cancelLead}>
            <input type="hidden" name="leadId" value={leadId} />
            <Button type="submit" variant="destructive">
              Ja, stornieren
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
