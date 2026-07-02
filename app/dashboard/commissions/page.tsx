import { Role } from "@/src/generated/prisma/enums"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { summarizeCommissions } from "@/lib/commission"
import CommissionsChart from "@/components/CommissionsChart"
import { StatCard } from "@/components/StatCard"
import { Wallet, Clock, CircleCheckBig } from "lucide-react"
import DonutChart from "@/components/DonutChart"
import DateRangeFilter from "@/components/DateRangeFilter"
import { Pagination } from "@/components/Pagination"
import { resolveRange, inRange } from "@/lib/dateRange"
import { getCommissions } from "@/lib/getCommissions"
import { requireUser } from "@/lib/auth"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge, COMMISSION_STATUS } from "@/components/StatusBadge"
import { PageHeader } from "@/components/PageHeader"

export const dynamic = "force-dynamic"

export default async function CommissionsPage({
	searchParams,
}: {
	searchParams: Promise<{ preset?: string; from?: string; to?: string; driver?: string; page?: string }>
}) {
	const { preset, from, to, driver, page: pageParam } = await searchParams
	const user = await requireUser()

	const isAdmin = user.role === Role.ADMIN

	// Admin: Fahrerliste fürs Filter-Dropdown
	const drivers = isAdmin
		? await prisma.user.findMany({
			where: { role: Role.TOW_TRUCK_DRIVER, companyId: user.companyId, deletedAt: null },
			select: { id: true, firstname: true, lastname: true },
			orderBy: { firstname: "asc" },
		})
		: []

	// Fahrer sieht nur eigene; Admin den gewählten Fahrer (oder alle)
	const driverId = isAdmin ? (driver || undefined) : user.id

	// Provisionen aus der JSON (Salesforce-Simulation)
	const records = await getCommissions({
		companyId: user.companyId ?? "",
		driverId,
	})
	const commissions = records.map((r) => ({
		id: r.id,
		amount: r.amount,
		status: r.status as string,
		driverName: r.driverName,
		createdAt: new Date(r.createdAt),
	}))

	// KPIs/Donut/Liste folgen dem Zeitraum; der Jahres-Chart bleibt ungefiltert
	const range = resolveRange(preset, from, to)
	const summaryCommissions = commissions.filter((c) => inRange(c.createdAt, range))

	// Paginierung: nur 10 pro Seite anzeigen
	const pageSize = 5
	const pageNum = Math.max(1, Number(pageParam) || 1)
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

	return (
		<div className="space-y-6">
			<div className="space-y-6">
				<PageHeader title={isAdmin ? "Alle Provisionen" : "Meine Provisionen"} />
				<div className="grid gap-6 md:grid-cols-3">
					<StatCard label="Gesamt" value={`${totalAmount.toFixed(2)} €`} icon={Wallet} color="blue" />
					<StatCard label="Offen (Pending)" value={`${pendingAmount.toFixed(2)} €`} icon={Clock} color="amber" />
					<StatCard label="Ausbezahlt" value={`${paidAmount.toFixed(2)} €`} icon={CircleCheckBig} color="green" />
				</div>

				<div className="grid gap-6 md:grid-cols-2">
					<Card className="flex-grow">
						<CardHeader>
							<CardTitle className="text-base font-semibold">Provisionen {currentYear} (pro Monat)</CardTitle>
						</CardHeader>
						<CardContent>
							<CommissionsChart data={chartData} />
						</CardContent>
					</Card>
					<Card className="flex-grow">
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
					<DateRangeFilter
						preset={preset}
						from={from}
						to={to}
						drivers={isAdmin ? drivers : undefined}
						selectedDriver={driver}
						adminId={user.id}
						adminName={`${user.firstname} ${user.lastname}`}
					/>
				</div>
				<p className="text-muted-foreground">{summaryCommissions.length} Einträge insgesamt</p>
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
					basePath="/dashboard/commissions"
					query={{ preset, from, to, driver }}
				/>
		</div>
	)
}