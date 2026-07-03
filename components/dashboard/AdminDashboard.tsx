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
import { buildLeadStatus, buildLeadTrend } from "@/lib/leadStats"
import { buildMonthlyCommissions, buildCommissionTrend, buildCommissionStatus } from "@/lib/commissionStats"
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
	const commissionTrend = buildCommissionTrend(allCommissions, now)
	const commissionChartData = buildMonthlyCommissions(allCommissions, currentYear)

	const provisionStatusData = buildCommissionStatus({ pending: comOpen, approved: comApproved, paid: comPaid, rejected: comRejected })

	// Leads (nach Zeitraum gefiltert für KPIs/Donut)
	const leads = leadRecords.filter((l) => inRange(new Date(l.createdAt), range))
	const totalLeads = leads.length
	const completedLeads = leads.filter((l) => l.status === "COMPLETED").length
	const conversionRate = totalLeads > 0 ? (completedLeads / totalLeads) * 100 : 0
	const leadStatusData = buildLeadStatus(leads)
	const leadTrendData = buildLeadTrend(leadRecords, now)

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
