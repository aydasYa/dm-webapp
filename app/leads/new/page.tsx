import Link from "next/link"
import { createLead } from "@/app/actions/leads"

export default function NewLead() {
    return (
        <div className="p-8">
            <div>
                <h1 className="text-2xl font-semibold">Neuen Lead erstellen</h1>
            </div>

            <form action={createLead} className="flex flex-col gap-4 mt-6 max-w-md">
                <div className="flex flex-col gap-1">
                    <label htmlFor="customerLastName">Nachname des Kunden</label>
                    <input
                        id="customerLastName"
                        name="customerLastName"
                        type="text"
                        required
                        className="border rounded px-3 py-2"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="vehicleMake">Fahrzeug-Marke</label>
                    <input
                        id="vehicleMake"
                        name="vehicleMake"
                        type="text"
                        required
                        className="border rounded px-3 py-2"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="vehicleModel">Fahrzeug-Modell</label>
                    <input
                        id="vehicleModel"
                        name="vehicleModel"
                        type="text"
                        required
                        className="border rounded px-3 py-2"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="breakdownAddress">Pannen-Adresse</label>
                    <input
                        id="breakdownAddress"
                        name="breakdownAddress"
                        type="text"
                        required
                        className="border rounded px-3 py-2"
                    />
                </div>
                
                <div className="flex flex-col gap-1">
                    <label htmlFor="internNotice">Interne Notiz (optional)</label>
                    <textarea
                        id="internNotice"
                        name="internNotice"
                        rows={3}
                        className="border rounded px-3 py-2"/>
                </div>

                <button
                    type="submit"
                    className="bg-black text-white rounded px-4 py-2 mt-2"
                >
                    Lead speichern
                </button>
            </form>

            <p className="mt-6">
                <Link href="/leads" className="underline">Zurück zu Leads-Übersicht</Link>
                <Link href="/dashboard" className="underline">Zurück zum Dashboard</Link>

            </p>
        </div>
    )
}
