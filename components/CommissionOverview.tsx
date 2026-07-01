import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { summarizeCommissions } from "@/lib/commission"
import CommissionsChart from "@/components/CommissionsChart"
import { StatCard } from "@/components/StatCard"
import { Wallet, Clock, CircleCheckBig } from "lucide-react"
import DonutChart from "@/components/DonutChart"
import DateRangeFilter from "@/components/DateRangeFilter"
import { resolveRange, inRange } from "@/lib/dateRange"
import { getCommissions } from "@/lib/getCommissions"
import { getLeads } from "@/lib/getLeads"
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
	const provisionStatusData = [
		{ name: "Offen", value: Math.round(pendingAmount), color: "var(--warning)" },
		{ name: "Genehmigt", value: Math.round(approvedAmount), color: "var(--info)" },
		{ name: "Ausbezahlt", value: Math.round(paidAmount), color: "var(--success)" },
		{ name: "Abgelehnt", value: Math.round(rejectedAmount), color: "var(--destructive)" },
	].filter((d) => d.value > 0)

	// Provision pro Monat (dieses Jahr) — ungefiltert
	const monthNames = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
	const currentYear = new Date().getFullYear()
	const chartData = monthNames.map((month, idx) => ({
		month,
		amount: commissions
			.filter((c) => c.createdAt.getFullYear() === currentYear && c.createdAt.getMonth() === idx)
			.reduce((sum, c) => sum + c.amount, 0),
	}))

	// Vormonats-Trend
	const now = new Date()
	const sumForMonth = (year: number, month: number) =>
		commissions
			.filter((c) => c.createdAt.getFullYear() === year && c.createdAt.getMonth() === month)
			.reduce((sum, c) => sum + c.amount, 0)
	const thisMonthSum = sumForMonth(now.getFullYear(), now.getMonth())
	const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
	const lastMonthSum = sumForMonth(lastMonthDate.getFullYear(), lastMonthDate.getMonth())
	const diff = thisMonthSum - lastMonthSum
	const trendProvision = `${diff >= 0 ? "↑" : "↓"} ${Math.abs(diff).toFixed(0)} € vs. ${monthNames[lastMonthDate.getMonth()]}`

	// Eigene Leads: pro Tag (Liniendiagramm) + Status-Verteilung (Donut)
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
	const leadStatusData = [
		{ name: "Abgeschlossen", value: leadRecords.filter((l) => l.status === "COMPLETED").length, color: "var(--success)" },
		{ name: "In Bearbeitung", value: leadRecords.filter((l) => l.status === "IN_PROGRESS").length, color: "var(--info)" },
		{ name: "Offen", value: leadRecords.filter((l) => l.status === "OPEN").length, color: "var(--warning)" },
		{ name: "Storniert", value: leadRecords.filter((l) => l.status === "CANCELLED").length, color: "var(--destructive)" },
	].filter((d) => d.value > 0)

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Meine Provisionen</h1>
				<div className="mt-4">
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
