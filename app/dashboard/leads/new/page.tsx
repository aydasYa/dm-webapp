import { createLead } from "@/app/actions/leads"
import { LeadForm } from "@/components/LeadForm"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewLead() {
  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold">Neuen Lead erstellen</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lead-Daten</CardTitle>
          <CardDescription>Erfasse einen neuen Lead aus deinem Einsatz</CardDescription>
        </CardHeader>
        <LeadForm action={createLead} cancelHref="/dashboard/leads" />
      </Card>
    </div>
  )
}
