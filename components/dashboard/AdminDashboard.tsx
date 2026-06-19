import prisma from "@/lib/prisma"
import { Role, UserStatus, CommissionStatus } from "@/src/generated/prisma/enums"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/StatCard"
import { Button } from "@/components/ui/button"
import { Wallet, Clock, CheckCircle2, UserCheck, UserX, Users, Hourglass } from "lucide-react"

// Short, user-facing status labels (UI is German)
const STATUS_LABEL: Record<UserStatus, string> = {
	ACTIVE: "Aktiv",
	PENDING: "Ausstehend",
	INACTIVE: "Deaktiviert",
	REJECTED: "Abgelehnt",
}

export default async function AdminDashboard({ firstname, companyId, selectedDriverId }: { firstname: string; companyId: string | null; selectedDriverId?: string }) {
	// Drivers of this company (for the filter dropdown)
	const drivers = await prisma.user.findMany({
		where: { role: Role.TOW_TRUCK_DRIVER, companyId, deletedAt: null },
		select: { id: true, firstname: true, lastname: true, email: true, status: true, createdAt: true },
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
	const commissions = await prisma.commission.findMany({ where: commissionWhere, select: { amount: true, status: true, createdAt: true } })
	const comSum = commissions.reduce((s, c) => s + Number(c.amount), 0)
	const comOpen = commissions.filter(c => c.status === CommissionStatus.PENDING).reduce((s, c) => s + Number(c.amount), 0)
	const comPaid = commissions.filter(c => c.status === CommissionStatus.PAID).reduce((s, c) => s + Number(c.amount), 0)

	// Month-over-month commission trend (respects the driver filter above)
	const now = new Date()
	const sumForMonth = (year: number, month: number) =>
		commissions
			.filter(c => c.createdAt.getFullYear() === year && c.createdAt.getMonth() === month)
			.reduce((s, c) => s + Number(c.amount), 0)
	const thisMonthSum = sumForMonth(now.getFullYear(), now.getMonth())
	const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
	const lastMonthSum = sumForMonth(lastMonth.getFullYear(), lastMonth.getMonth())
	const diff = thisMonthSum - lastMonthSum
	const commissionTrend = `${diff >= 0 ? "↑" : "↓"} ${Math.abs(diff).toFixed(0)} € vs. ${lastMonth.toLocaleDateString("de-DE", { month: "short" })}`

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
					<StatCard title="Gesamt" value={`${comSum.toFixed(2)} €`} icon={Wallet} trend={commissionTrend} />
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

			<div>
				<h2 className="font-semibold mb-2">Fahrer</h2>
				{drivers.length === 0 ? (
					<Card>
						<CardContent className="pt-6">
							<p className="text-center text-muted-foreground">Noch keine Fahrer</p>
						</CardContent>
					</Card>
				) : (
					<Card>
						<CardContent className="divide-y p-0">
							{drivers.map((d) => (
								<div key={d.id} className="flex items-center justify-between gap-4 px-4 py-3">
									<div className="min-w-0">
										<p className="font-medium truncate">{d.firstname} {d.lastname}</p>
										<p className="text-sm text-muted-foreground truncate">{d.email}</p>
									</div>
									<div className="flex shrink-0 items-center gap-4">
										<span className="text-xs text-muted-foreground">seit {d.createdAt.toLocaleDateString("de-DE")}</span>
										<span className="rounded-full bg-muted px-2 py-1 text-xs font-medium">{STATUS_LABEL[d.status]}</span>
									</div>
								</div>
							))}
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	)
}