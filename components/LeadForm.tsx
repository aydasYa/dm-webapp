import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { CardContent } from "@/components/ui/card"

const VEHICLE_PROBLEMS = [
  "Motor macht Geräusche",
  "Motor läuft unrund",
  "Motor überhitzt",
  "Zylinderkopfdichtung defekt",
  "Steuerkette gerissen",
  "Hoher Ölverbrauch",
  "Metallspäne im Öl",
  "Lagerschaden",
  "Ruckeln beim Schalten",
]

export type LeadFormData = {
  id: string
  customerLastName: string
  vehicleMake: string
  vehicleModel: string
  vehicleHsn: string | null
  vehicleTsn: string | null
  vehicleType: string | null
  vehicleEngine: string | null
  vehicleMotorCode: string | null
  vehicleMileage: string | null
  vehicleFuelType: string | null
  vehicleProblems: string[]
  vehicleDiagnosis: string | null
  breakdownStreet: string
  breakdownPostcode: string
  breakdownCity: string
  internNotice: string | null
}

type LeadFormProps = {
  action: (formData: FormData) => Promise<void>
  lead?: LeadFormData
  cancelHref: string
}

const SELECT_CLASS = "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

export function LeadForm({ action, lead, cancelHref }: LeadFormProps) {
  const isEdit = !!lead

  return (
    <form action={action}>
      {isEdit && <input type="hidden" name="leadId" value={lead.id} />}

      <CardContent className="flex flex-col gap-6">
        <FieldGroup>

          <Field>
            <FieldLabel htmlFor="customerLastName">Nachname des Kunden</FieldLabel>
            <Input id="customerLastName" name="customerLastName" type="text" required
              defaultValue={lead?.customerLastName ?? ""} />
          </Field>

          <Field>
            <FieldLabel htmlFor="vehicleMake">Fahrzeug-Marke</FieldLabel>
            <Input id="vehicleMake" name="vehicleMake" type="text" required
              defaultValue={lead?.vehicleMake ?? ""} />
          </Field>

          <Field>
            <FieldLabel htmlFor="vehicleModel">Fahrzeug-Modell</FieldLabel>
            <Input id="vehicleModel" name="vehicleModel" type="text" required
              defaultValue={lead?.vehicleModel ?? ""} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="vehicleHsn">HSN (zu 2.1)</FieldLabel>
              <Input id="vehicleHsn" name="vehicleHsn" type="text"
                defaultValue={lead?.vehicleHsn ?? ""} />
            </Field>
            <Field>
              <FieldLabel htmlFor="vehicleTsn">TSN (zu 2.2)</FieldLabel>
              <Input id="vehicleTsn" name="vehicleTsn" type="text"
                defaultValue={lead?.vehicleTsn ?? ""} />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="vehicleType">Fahrzeugtyp</FieldLabel>
            <Input id="vehicleType" name="vehicleType" type="text"
              defaultValue={lead?.vehicleType ?? ""} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="vehicleEngine">kW / Hubraum / PS</FieldLabel>
              <Input id="vehicleEngine" name="vehicleEngine" type="text"
                defaultValue={lead?.vehicleEngine ?? ""} />
            </Field>
            <Field>
              <FieldLabel htmlFor="vehicleMotorCode">Motorcode</FieldLabel>
              <Input id="vehicleMotorCode" name="vehicleMotorCode" type="text"
                defaultValue={lead?.vehicleMotorCode ?? ""} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="vehicleMileage">Kilometerstand</FieldLabel>
              <Input id="vehicleMileage" name="vehicleMileage" type="text"
                placeholder="z.B. 120000"
                defaultValue={lead?.vehicleMileage ?? ""} />
            </Field>
            <Field>
              <FieldLabel htmlFor="vehicleFuelType">Kraftstoff</FieldLabel>
              <select id="vehicleFuelType" name="vehicleFuelType"
                defaultValue={lead?.vehicleFuelType ?? ""}
                className={SELECT_CLASS}>
                <option value="">Bitte wählen</option>
                <option value="BENZIN">Benzin</option>
                <option value="DIESEL">Diesel</option>
                <option value="GAS">Gas</option>
                <option value="ELEKTRO">Elektro</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </Field>
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-medium">Probleme</legend>
            <div className="grid grid-cols-2 gap-2">
              {VEHICLE_PROBLEMS.map((problem) => (
                <label key={problem} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="vehicleProblems"
                    value={problem}
                    defaultChecked={lead?.vehicleProblems.includes(problem) ?? false}
                  />
                  {problem}
                </label>
              ))}
            </div>
          </fieldset>

          <Field>
            <FieldLabel htmlFor="vehicleDiagnosis">Diagnose / Fehlerbeschreibung</FieldLabel>
            <Textarea id="vehicleDiagnosis" name="vehicleDiagnosis" rows={3}
              defaultValue={lead?.vehicleDiagnosis ?? ""} />
          </Field>

          <Field>
            <FieldLabel htmlFor="breakdownStreet">Pannen-Straße</FieldLabel>
            <Input id="breakdownStreet" name="breakdownStreet" type="text" required
              defaultValue={lead?.breakdownStreet ?? ""} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="breakdownPostcode">Pannen-PLZ</FieldLabel>
              <Input id="breakdownPostcode" name="breakdownPostcode" type="text" required
                defaultValue={lead?.breakdownPostcode ?? ""} />
            </Field>
            <Field>
              <FieldLabel htmlFor="breakdownCity">Pannen-Ort</FieldLabel>
              <Input id="breakdownCity" name="breakdownCity" type="text" required
                defaultValue={lead?.breakdownCity ?? ""} />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="internNotice">Interne Notiz (Optional)</FieldLabel>
            <Textarea id="internNotice" name="internNotice" rows={3}
              defaultValue={lead?.internNotice ?? ""} />
          </Field>

        </FieldGroup>

        <div className="flex gap-3">
          <Button asChild variant="outline" className="flex-1">
            <Link href={cancelHref}>Abbrechen</Link>
          </Button>
          <Button type="submit" className="flex-1">
            {isEdit ? "Änderungen speichern" : "Lead speichern"}
          </Button>
        </div>
      </CardContent>
    </form>
  )
}
