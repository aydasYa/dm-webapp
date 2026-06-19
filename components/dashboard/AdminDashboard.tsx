import prisma from "@/lib/prisma"
import { Role, UserStatus, CommissionStatus } from "@/src/generated/prisma/enums"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/StatCard"
import { Button } from "@/components/ui/button"
import { Wallet, Clock, CheckCircle2, UserCheck, UserX, Users, Hourglass } from "lucide-react"

export default async function AdminDashboard({ firstname, companyId, selectedDriverId }: { firstname: string; companyId: string | null; selectedDriverId?: string }) {
	// Drivers of this company (for the filter dropdown)
	const drivers = await prisma.user.findMany({
		where: { role: Role.TOW_TRUCK_DRIVER, companyId, deletedAt: null },
		select: { id: true, firstname: true, lastname: true },
		orderBy: { firstname: "asc" },
	})

	// If a driver is selected: only their commissions, otherwise the whole company
	const commissionWhere = selectedDriverId
		? { towTruckDriverId: selectedDriverId }
		: { towTruckDriver: { companyId } }

	// All metrics scoped to the caller's own company (tenant isolation)
	const totalActiveDrivers = await prisma.user.count({ where: { role: Role.TOW_TRUCK_DRIVER, status: UserStatus.ACTIVE, companyId } })
	const totalInactiveDrivers = await prisma.user.count({ where: { role: Role.TOW_TRUCK_DRIVER, status: UserStatus.INACTIVE, companyId } })
	const registeredDrivers = await prisma.user.count({ where: { role: Role.TOW_TRUCK_DRIVER, companyId } })
	const pendingUsers = await prisma.user.count({ where: { role: Role.TOW_TRUCK_DRIVER, status: UserStatus.PENDING, companyId } })

	// Commission totals (filtered by selected driver, or whole company)
	const commissions = await prisma.commission.findMany({ where: commissionWhere, select: { amount: true, status: true } })
	const comSum = commissions.reduce((s, c) => s + Number(c.amount), 0)
	const comOpen = commissions.filter(c => c.status === CommissionStatus.PENDING).reduce((s, c) => s + Number(c.amount), 0)
	const comPaid = commissions.filter(c => c.status === CommissionStatus.PAID).reduce((s, c) => s + Number(c.amount), 0)

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Willkommen, {firstname}</h1>
				<p className="text-muted-foreground">Übersicht deiner Aktivitäten</p>
			</div>

			{/* GET form -> filter via URL (?driver=...) */}
			<form method="get" className="flex items-end gap-3">
				<div className="flex flex-col gap-1">
					<label htmlFor="driver" className="text-sm font-medium">Fahrer</label>
					<select id="driver" name="driver" defaultValue={selectedDriverId ?? ""} className="h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm">
						<option value="">Alle Fahrer</option>
						{drivers.map((d) => (
							<option key={d.id} value={d.id}>{d.firstname} {d.lastname}</option>
						))}
					</select>
				</div>
				<Button type="submit" variant="outline" size="sm">Filtern</Button>
			</form>

			<div>
				<h2 className="font-semibold mb-2">Provisionen</h2>
				<div className="grid gap-4 md:grid-cols-3">
					<StatCard title="Gesamt" value={`${comSum.toFixed(2)} €`} icon={Wallet} />
					<StatCard title="Offen" value={`${comOpen.toFixed(2)} €`} icon={Clock} />
					<StatCard title="Ausbezahlt" value={`${comPaid.toFixed(2)} €`} icon={CheckCircle2} />
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StatCard title="Aktive Abschlepper" value={String(totalActiveDrivers)} icon={UserCheck} />
				<StatCard title="Inaktive Abschlepper" value={String(totalInactiveDrivers)} icon={UserX} />
				<StatCard title="Alle registrierten" value={String(registeredDrivers)} icon={Users} />
				<StatCard title="Warten auf Freigabe" value={String(pendingUsers)} icon={Hourglass} />
			</div>
		</div>
	)
}