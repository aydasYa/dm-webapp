import LeadsChart from "@/components/LeadsChart"
import { getLeads } from "@/lib/getLeads"
import prisma from "@/lib/prisma"
import { Role } from "@/src/generated/prisma/enums"
import { summarizeCommissions } from "@/lib/commission"
import { resolveRange, inRange } from "@/lib/dateRange"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/StatCard"
import DonutChart from "@/components/DonutChart"
import CommissionsChart from "@/components/CommissionsChart"
import DateRangeFilter from "@/components/DateRangeFilter"
import { getCommissions } from "@/lib/getCommissions"
import { Users, CircleCheckBig, TrendingUp, Wallet, Clock } from "lucide-react"

export default async function AdminDashboard({
	firstname,
	companyId,
	selectedDriverId,
	adminId,
	adminName,
	preset,
	from,
	to,
}: {
	firstname: string
	companyId: string | null
	selectedDriverId?: string
	adminId: string
	adminName: string
	preset?: string
	from?: string
	to?: string
}) {
	// Fahrer (fürs Filter-Dropdown) + Provisionen + Leads (nach Fahrer gefiltert)
	const [drivers, commissionRecords, leadRecords] = await Promise.all([
		prisma.user.findMany({
			where: { role: Role.TOW_TRUCK_DRIVER, companyId, deletedAt: null },
			select: { id: true, firstname: true, lastname: true },
			orderBy: { firstname: "asc" },
		}),
		getCommissions({ companyId: companyId ?? "", driverId: selectedDriverId }),
		getLeads({ companyId: companyId ?? "", driverId: selectedDriverId }),
	])

	const now = new Date()
	const hour = now.getHours()
	const greeting = hour < 11 ? "Guten Morgen" : hour < 18 ? "Guten Mittag" : "Guten Abend"
	const currentYear = now.getFullYear()
	const range = resolveRange(preset, from, to)

	// Provisionen
	const allCommissions = commissionRecords.map((r) => ({
		amount: r.amount,
		status: r.status as string,
		createdAt: new Date(r.createdAt),
	}))
	const commissions = allCommissions.filter((c) => inRange(c.createdAt, range))
	const { total: comSum, pending: comOpen, paid: comPaid, approved: comApproved, rejected: comRejected } = summarizeCommissions(commissions)

	const sumForMonth = (year: number, month: number) =>
		allCommissions
			.filter(c => c.createdAt.getFullYear() === year && c.createdAt.getMonth() === month)
			.reduce((s, c) => s + Number(c.amount), 0)
	const thisMonthSum = sumForMonth(now.getFullYear(), now.getMonth())
	const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
	const diff = thisMonthSum - sumForMonth(lastMonth.getFullYear(), lastMonth.getMonth())
	const commissionTrend = `${diff >= 0 ? "↑" : "↓"} ${Math.abs(diff).toFixed(0)} € vs. ${lastMonth.toLocaleDateString("de-DE", { month: "short" })}`

	const monthNames = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
	const commissionChartData = monthNames.map((month, idx) => ({
		month,
		amount: allCommissions
			.filter(c => c.createdAt.getFullYear() === currentYear && c.createdAt.getMonth() === idx)
			.reduce((s, c) => s + Number(c.amount), 0),
	}))

	const provisionStatusData = [
		{ name: "Offen", value: Math.round(comOpen), color: "var(--warning)" },
		{ name: "Genehmigt", value: Math.round(comApproved), color: "var(--info)" },
		{ name: "Ausbezahlt", value: Math.round(comPaid), color: "var(--success)" },
		{ name: "Abgelehnt", value: Math.round(comRejected), color: "var(--destructive)" },
	].filter((d) => d.value > 0)

	// Leads (nach Zeitraum gefiltert für KPIs/Donut)
	const leads = leadRecords.filter((l) => inRange(new Date(l.createdAt), range))
	const totalLeads = leads.length
	const completedLeads = leads.filter((l) => l.status === "COMPLETED").length
	const conversionRate = totalLeads > 0 ? (completedLeads / totalLeads) * 100 : 0

	const leadStatusData = [
		{ name: "Abgeschlossen", value: leads.filter((l) => l.status === "COMPLETED").length, color: "var(--success)" },
		{ name: "In Bearbeitung", value: leads.filter((l) => l.status === "IN_PROGRESS").length, color: "var(--info)" },
		{ name: "Offen", value: leads.filter((l) => l.status === "OPEN").length, color: "var(--warning)" },
		{ name: "Storniert", value: leads.filter((l) => l.status === "CANCELLED").length, color: "var(--destructive)" },
	].filter((d) => d.value > 0)

	// Lead-Entwicklung (aktueller Monat, nach Fahrer gefiltert)
	const daysInMonth = new Date(currentYear, now.getMonth() + 1, 0).getDate()
	const leadTrendData = Array.from({ length: daysInMonth }, (_, i) => {
		const day = i + 1
		const count = leadRecords.filter((l) => {
			const d = new Date(l.createdAt)
			return d.getFullYear() === currentYear && d.getMonth() === now.getMonth() && d.getDate() === day
		}).length
		const mm = String(now.getMonth() + 1).padStart(2, "0")
		const dd = String(day).padStart(2, "0")
		return { date: `${currentYear}-${mm}-${dd}`, count }
	})

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">{greeting}, {firstname} 👋</h1>
				<p className="text-muted-foreground">Hier ist deine Übersicht für {now.toLocaleDateString("de-DE", { month: "long", year: "numeric" })}.</p>
			</div>

			{/* Filter oben (wie im Mockup): Zeitraum + Fahrer */}
			<DateRangeFilter
				preset={preset}
				from={from}
				to={to}
				drivers={drivers}
				selectedDriver={selectedDriverId}
				adminId={adminId}
				adminName={adminName}
			/>

			{/* Provisionen: KPIs + Diagramme */}
			<div>
				<h2 className="font-semibold mb-2">Provisionen</h2>
				<div className="grid gap-6 md:grid-cols-3">
					<StatCard label="Gesamt" value={`${comSum.toFixed(2)} €`} icon={Wallet} color="blue" trend={commissionTrend} />
					<StatCard label="Offen" value={`${comOpen.toFixed(2)} €`} icon={Clock} color="amber" />
					<StatCard label="Ausbezahlt" value={`${comPaid.toFixed(2)} €`} icon={CircleCheckBig} color="green" />
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="text-base font-semibold">Provisionen {currentYear} (pro Monat)</CardTitle>
					</CardHeader>
					<CardContent>
						<CommissionsChart data={commissionChartData} />
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

			{/* Leads: KPIs + Diagramme */}
			<div>
				<h2 className="font-semibold mb-2">Leads</h2>
				<div className="grid gap-6 md:grid-cols-3">
					<StatCard label="Leads gesamt" value={String(totalLeads)} icon={Users} color="blue" />
					<StatCard label="Abschlüsse" value={String(completedLeads)} icon={CircleCheckBig} color="green" />
					<StatCard label="Conversion Rate" value={`${conversionRate.toFixed(1)} %`} icon={TrendingUp} color="purple" />
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardContent>
						<LeadsChart data={leadTrendData} title={`Lead-Entwicklung (${now.toLocaleDateString("de-DE", { month: "long" })})`} />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="text-base font-semibold">Lead-Status-Verteilung</CardTitle>
					</CardHeader>
					<CardContent>
						{leadStatusData.length === 0 ? (
							<p className="text-center text-muted-foreground">Keine Leads vorhanden</p>
						) : (
							<DonutChart data={leadStatusData} />
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
