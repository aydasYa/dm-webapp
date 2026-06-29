import { Button } from "@/components/ui/button"

type Driver = { id: string; firstname: string; lastname: string }

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
    <form method="get" className="flex flex-wrap items-end gap-3">
      {drivers && (
        <div className="flex flex-col gap-1">
          <label htmlFor="driver" className="text-sm font-medium">Fahrer</label>
          <select id="driver" name="driver" defaultValue={selectedDriver ?? ""} className="h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm">
            <option value="">Alle Fahrer</option>
            {adminId && <option value={adminId}>{adminName} (Inhaber)</option>}
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>{d.firstname} {d.lastname}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="preset" className="text-sm font-medium">Zeitraum</label>
        <select id="preset" name="preset" defaultValue={preset ?? ""} className="h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm">
          <option value="">Eigener Zeitraum</option>
          <option value="7d">Letzte 7 Tage</option>
          <option value="30d">Letzte 30 Tage</option>
          <option value="3m">Letzte 3 Monate</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="from" className="text-sm font-medium">Von</label>
        <input type="date" id="from" name="from" defaultValue={from ?? ""} className="h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm" />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="to" className="text-sm font-medium">Bis</label>
        <input type="date" id="to" name="to" defaultValue={to ?? ""} className="h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm" />
      </div>

      <Button type="submit" variant="outline" size="sm">Filtern</Button>
    </form>
  )
}