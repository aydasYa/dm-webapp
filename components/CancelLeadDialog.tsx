"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Field, FieldLabel } from "@/components/ui/field"
import { cancelLead } from "@/app/actions/leads"

type Props = {
    leadId: string
}

export default function CancelLeadDialog({ leadId }: Props) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive">Stornieren</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Lead stornieren</DialogTitle>
                    <DialogDescription>
                        Bitte gib die Storno-Details an. Diese Aktion kann nicht rückgängig gemacht werden.
                    </DialogDescription>
                </DialogHeader>

                <form action={cancelLead} className="space-y-4">
                    <input type="hidden" name="leadId" value={leadId} />

                    <Field>
                        <FieldLabel htmlFor="invoiceId">Rechnungs-ID</FieldLabel>
                        <Input
                            id="invoiceId"
                            name="invoiceId"
                            type="text"
                            required
                            minLength={5}
                            placeholder="z.B. RECH-2026-001"
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="cancelReason">Storno-Grund</FieldLabel>
                        <Select name="cancelReason" required>
                            <SelectTrigger id="cancelReason">
                                <SelectValue placeholder="Grund auswählen" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CUSTOMER_REQUEST">Kunde wollte Storno</SelectItem>
                                <SelectItem value="INVALID_LEAD">Ungültiger Lead (Fake/Doppelt)</SelectItem>
                                <SelectItem value="WORKSHOP_DECLINED">Werkstatt abgesagt</SelectItem>
                                <SelectItem value="NO_REPAIR_POSSIBLE">Reparatur nicht möglich</SelectItem>
                                <SelectItem value="OTHER">Sonstiges</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Abbrechen
                        </Button>
                        <Button type="submit" variant="destructive">
                            Lead stornieren
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}