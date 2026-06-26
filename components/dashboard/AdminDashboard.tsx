import LeadsChart from "@/components/LeadsChart"
import { getLeads } from "@/lib/getLeads"
import prisma from "@/lib/prisma"
import { Role, UserStatus } from "@/src/generated/prisma/enums"
import { summarizeCommissions } from "@/lib/commission"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/StatCard"
import { Button } from "@/components/ui/button"
import DonutChart from "@/components/DonutChart"
import CommissionsChart from "@/components/CommissionsChart"
import { getCommissions } from "@/lib/getCommissions"


// Short, user-facing status labels (UI is German)
const STATUS_LABEL: Record<UserStatus, string> = {
	ACTIVE: "Aktiv",
	PENDING: "Ausstehend",
	INACTIVE: "Deaktiviert",
	REJECTED: "Abgelehnt",
}

export default async function AdminDashboard({ firstname, companyId, selectedDriverId, adminId, adminName }: { firstname: string; companyId: string | null; selectedDriverId?: string; adminId: string; adminName: string }) {
	// Drivers of this company (for the filter dropdown)
	const [
		drivers,
		totalActiveDrivers,
		totalInactiveDrivers,
		registeredDrivers,
		pendingUsers,
		commissionRecords,
		leadRecords,
	] = await Promise.all([
		prisma.user.findMany({
			where: { role: Role.TOW_TRUCK_DRIVER, companyId, deletedAt: null },
			select: { id: true, firstname: true, lastname: true, email: true, status: true, createdAt: true },
			orderBy: { firstname: "asc" },
		}),
		prisma.user.count({ where: { role: Role.TOW_TRUCK_DRIVER, status: UserStatus.ACTIVE, companyId } }),
		prisma.user.count({ where: { role: Role.TOW_TRUCK_DRIVER, status: UserStatus.INACTIVE, companyId } }),
		prisma.user.count({ where: { role: Role.TOW_TRUCK_DRIVER, companyId } }),
		prisma.user.count({ where: { role: Role.TOW_TRUCK_DRIVER, status: UserStatus.PENDING, companyId } }),
		getCommissions({ companyId: companyId ?? "", driverId: selectedDriverId }),
		getLeads({ companyId: companyId ?? "", driverId: selectedDriverId }),
	])
	const commissions = commissionRecords.map((r) => ({
		amount: r.amount,
		status: r.status as string,
		createdAt: new Date(r.createdAt),
	}))
	const { total: comSum, pending: comOpen, paid: comPaid, approved: comApproved, rejected: comRejected } = summarizeCommissions(commissions)

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

	// Commission per month (current year) for the bar chart
	const monthNames = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
	const currentYear = now.getFullYear()
	const chartData = monthNames.map((month, idx) => ({
		month,
		amount: commissions
			.filter(c => c.createdAt.getFullYear() === currentYear && c.createdAt.getMonth() === idx)
			.reduce((s, c) => s + Number(c.amount), 0),
	}))

	// Leads pro Tag im aktuellen Monat (für das Lead-Entwicklung-Diagramm)
	const daysInMonth = new Date(currentYear, now.getMonth() + 1, 0).getDate()
	const leadTrendData = Array.from({ length: daysInMonth }, (_, i) => {
		const day = i + 1
		const count = leadRecords.filter((l) => {
			const d = new Date(l.createdAt)
			return d.getFullYear() === currentYear && d.getMonth() === now.getMonth() && d.getDate() === day
		}).length
		return { day: String(day).padStart(2, "0"), count }
	})

	// Commission distribution by status for the donut (amounts, color per slice)
	const provisionStatusData = [
		{ name: "Offen", value: Math.round(comOpen), color: "#ca8a04" },
		{ name: "Genehmigt", value: Math.round(comApproved), color: "#2563eb" },
		{ name: "Ausbezahlt", value: Math.round(comPaid), color: "#059669" },
		{ name: "Abgelehnt", value: Math.round(comRejected), color: "#dc2626" },
	].filter((d) => d.value > 0)

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
						<option value={adminId}>{adminName} (Inhaber)</option>
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
					<StatCard label="Gesamt" value={`${comSum.toFixed(2)} €`} trend={commissionTrend} />
					<StatCard label="Offen" value={`${comOpen.toFixed(2)} €`} />
					<StatCard label="Ausbezahlt" value={`${comPaid.toFixed(2)} €`} />
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="text-base font-semibold">Provisionen {currentYear} (pro Monat)</CardTitle>
					</CardHeader>
					<CardContent>
						<CommissionsChart data={chartData} />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="text-base font-semibold">Provisionen nach Status</CardTitle>
					</CardHeader>
					<CardContent>
						{provisionStatusData.length === 0 ? (
							<p className="text-center text-muted-foreground">Keine Provisionen vorhanden</p>
						) : (
							<DonutChart data={provisionStatusData} unit="€" />
						)}
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StatCard label="Aktive Abschlepper" value={String(totalActiveDrivers)} />
				<StatCard label="Inaktive Abschlepper" value={String(totalInactiveDrivers)} />
				<StatCard label="Alle registrierten" value={String(registeredDrivers)} />
				<StatCard label="Warten auf Freigabe" value={String(pendingUsers)} />
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-base font-semibold">
						Lead-Entwicklung ({now.toLocaleDateString("de-DE", { month: "long" })})
					</CardTitle>
				</CardHeader>
				<CardContent>
					<LeadsChart data={leadTrendData} />
				</CardContent>
			</Card>

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