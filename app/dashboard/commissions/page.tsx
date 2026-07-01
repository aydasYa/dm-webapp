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

export const dynamic = "force-dynamic"

const statusStyles: Record<string, string> = {
	PENDING: "bg-yellow-100 text-yellow-700 ring-yellow-200",
	APPROVED: "bg-blue-100 text-blue-700 ring-blue-200",
	PAID: "bg-emerald-100 text-emerald-800 ring-emerald-300",
	REJECTED: "bg-red-100 text-red-700 ring-red-200",
}

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
		{ name: "Offen", value: Math.round(pendingAmount), color: "#ca8a04" },
		{ name: "Genehmigt", value: Math.round(approvedAmount), color: "#2563eb" },
		{ name: "Ausbezahlt", value: Math.round(paidAmount), color: "#059669" },
		{ name: "Abgelehnt", value: Math.round(rejectedAmount), color: "#dc2626" },
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
			<div>
				<h1 className="text-2xl font-bold">{isAdmin ? "Alle Provisionen" : "Meine Provisionen"}</h1>
				<div className="mt-4">
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
				<div className="grid gap-4 md:grid-cols-3">
					<StatCard label="Gesamt" value={`${totalAmount.toFixed(2)} €`} icon={Wallet} color="blue" />
					<StatCard label="Offen (Pending)" value={`${pendingAmount.toFixed(2)} €`} icon={Clock} color="amber" />
					<StatCard label="Ausbezahlt" value={`${paidAmount.toFixed(2)} €`} icon={CircleCheckBig} color="green" />
				</div>

				<div className="flex">
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
				<p className="text-muted-foreground">{summaryCommissions.length} Einträge insgesamt</p>
			</div>

			{summaryCommissions.length === 0 ? (
				<Card>
					<CardContent className="pt-6">
						<p className="text-center text-muted-foreground">Keine Provisionen vorhanden</p>
					</CardContent>
				</Card>
			) : (
				<div className="flex flex-col gap-3">
					{pageItems.map((c) => (
						<Card key={c.id}>
							<CardContent className="flex items-center justify-between gap-4 pt-6">
								<div>
									<p className="font-semibold">{c.driverName}</p>
									<p className="text-sm text-muted-foreground">{c.createdAt.toLocaleDateString("de-DE")}</p>
								</div>
								<div className="flex items-center gap-3">
									<span className={`rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${statusStyles[c.status] ?? statusStyles.PENDING}`}>
										{c.status}
									</span>
									<p className="text-xl font-bold">{c.amount.toFixed(2)} €</p>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
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