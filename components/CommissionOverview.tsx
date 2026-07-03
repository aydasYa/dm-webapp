import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { summarizeCommissions } from "@/lib/commission"
import CommissionsChart from "@/components/CommissionsChart"
import { StatCard } from "@/components/StatCard"
import { Wallet, Clock, CircleCheckBig } from "lucide-react"
import DonutChart from "@/components/DonutChart"
import { buildMonthlyCommissions, buildCommissionTrend, buildCommissionStatus } from "@/lib/commissionStats"
import DateRangeFilter from "@/components/DateRangeFilter"
import { resolveRange, inRange } from "@/lib/dateRange"
import { getCommissions } from "@/lib/getCommissions"
import { getLeads } from "@/lib/getLeads"
import { buildLeadStatus, buildLeadTrend } from "@/lib/leadStats"
import LeadsChart from "@/components/LeadsChart"
import { Pagination } from "@/components/Pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge, COMMISSION_STATUS } from "@/components/StatusBadge"

export default async function CommissionOverview({
	userId,
	companyId,
	preset,
	from,
	to,
	page,
}: {
	userId: string
	companyId: string | null
	preset?: string
	from?: string
	to?: string
	page?: string
}) {
	// Provisionen + Leads aus der JSON (Salesforce-Simulation): nur die eigenen des Fahrers
	const [records, leadRecords] = await Promise.all([
		getCommissions({ companyId: companyId ?? "", driverId: userId }),
		getLeads({ companyId: companyId ?? "", driverId: userId }),
	])
	const commissions = records.map((r) => ({
		id: r.id,
		amount: r.amount,
		status: r.status as string,
		driverName: r.driverName,
		createdAt: new Date(r.createdAt),
	}))

	// KPIs/Donut/Liste folgen dem Zeitraum; Chart + Trend bleiben ungefiltert
	const range = resolveRange(preset, from, to)
	const summaryCommissions = commissions.filter((c) => inRange(c.createdAt, range))

	// Paginierung: nur 10 pro Seite anzeigen
	const pageSize = 10
	const pageNum = Math.max(1, Number(page) || 1)
	const totalPages = Math.ceil(summaryCommissions.length / pageSize)
	const pageItems = summaryCommissions.slice((pageNum - 1) * pageSize, pageNum * pageSize)

	const { total: totalAmount, pending: pendingAmount, paid: paidAmount, approved: approvedAmount, rejected: rejectedAmount } = summarizeCommissions(summaryCommissions)

	// Verteilung nach Status für den Donut (Beträge, Farbe pro Slice)
	const provisionStatusData = buildCommissionStatus({ pending: pendingAmount, approved: approvedAmount, paid: paidAmount, rejected: rejectedAmount })

	const currentYear = new Date().getFullYear()
	const chartData = buildMonthlyCommissions(commissions, currentYear)

	const now = new Date()
	const trendProvision = buildCommissionTrend(commissions, now)

	// Eigene Leads: Verlauf + Status-Verteilung
	const leadTrendData = buildLeadTrend(leadRecords, now)
	const leadStatusData = buildLeadStatus(leadRecords)

	return (
		<div className="space-y-6">
			<div className="space-y-6">
				<h1 className="text-2xl font-bold">Meine Provisionen</h1>
				<div>
					<DateRangeFilter preset={preset} from={from} to={to} />
				</div>
				<div className="grid gap-6 md:grid-cols-3">
					<StatCard label="Provision verdient" value={`${totalAmount.toFixed(2)} €`} icon={Wallet} color="blue" trend={trendProvision} />
					<StatCard label="Offen" value={`${pendingAmount.toFixed(2)} €`} icon={Clock} color="amber" />
					<StatCard label="Ausbezahlt" value={`${paidAmount.toFixed(2)} €`} icon={CircleCheckBig} color="green" />
				</div>

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

			<div>
				<h2 className="font-semibold mb-2">Meine Leads ({now.toLocaleDateString("de-DE", { month: "long" })})</h2>
				<div className="grid gap-6 md:grid-cols-2">
					<Card>
						<CardContent>
							<LeadsChart data={leadTrendData} title="Lead-Entwicklung" />
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

			<p className="text-sm text-muted-foreground">{summaryCommissions.length} Einträge insgesamt</p>

			{summaryCommissions.length === 0 ? (
				<Card>
					<CardContent className="pt-6">
						<p className="text-center text-muted-foreground">Keine Provisionen vorhanden</p>
					</CardContent>
				</Card>
			) : (
				<Card>
					<CardContent className="p-0">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Fahrer</TableHead>
									<TableHead>Datum</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Betrag</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{pageItems.map((c) => {
									const s = COMMISSION_STATUS[c.status] ?? COMMISSION_STATUS.PENDING
									return (
										<TableRow key={c.id}>
											<TableCell className="font-medium">{c.driverName}</TableCell>
											<TableCell className="text-muted-foreground">{c.createdAt.toLocaleDateString("de-DE")}</TableCell>
											<TableCell><StatusBadge tone={s.tone}>{s.label}</StatusBadge></TableCell>
											<TableCell className="text-right font-semibold tabular-nums">{c.amount.toFixed(2)} €</TableCell>
										</TableRow>
									)
								})}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			)}

			<Pagination
				page={pageNum}
				totalPages={totalPages}
				basePath="/dashboard"
				query={{ preset, from, to }}
			/>
		</div>
	)
}
