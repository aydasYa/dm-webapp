import { Button } from "@/components/ui/button"
import { FilterX } from "lucide-react"

type Driver = { id: string; firstname: string; lastname: string }

const field =
  "h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"

export default function DateRangeFilter({
  preset,
  from,
  to,
  drivers,
  selectedDriver,
  adminId,
  adminName,
}: {
  preset?: string
  from?: string
  to?: string
  drivers?: Driver[]
  selectedDriver?: string
  adminId?: string
  adminName?: string
}) {
  return (
    <form method="get" className="flex flex-wrap items-end gap-3 rounded-xl border bg-card p-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="from" className="text-xs font-medium text-muted-foreground">Von Datum</label>
        <input type="date" id="from" name="from" defaultValue={from ?? ""} className={field} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="to" className="text-xs font-medium text-muted-foreground">Bis Datum</label>
        <input type="date" id="to" name="to" defaultValue={to ?? ""} className={field} />
      </div>

      {drivers && (
        <div className="flex flex-col gap-1">
          <label htmlFor="driver" className="text-xs font-medium text-muted-foreground">Fahrer</label>
          <select id="driver" name="driver" defaultValue={selectedDriver ?? ""} className={field}>
            <option value="">Alle Fahrer</option>
            {adminId && <option value={adminId}>{adminName} (Inhaber)</option>}
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>{d.firstname} {d.lastname}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="preset" className="text-xs font-medium text-muted-foreground">Zeitraum</label>
        <select id="preset" name="preset" defaultValue={preset ?? ""} className={field}>
          <option value="">Eigener Zeitraum</option>
          <option value="7d">Letzte 7 Tage</option>
          <option value="30d">Letzte 30 Tage</option>
          <option value="3m">Letzte 3 Monate</option>
        </select>
      </div>

      <Button type="submit" size="sm">Filtern</Button>

      <Button asChild variant="ghost" size="sm" className="ml-auto text-muted-foreground">
        <a href="?">
          <FilterX className="size-4" />
          Filter zurücksetzen
        </a>
      </Button>
    </form>
  )
}
