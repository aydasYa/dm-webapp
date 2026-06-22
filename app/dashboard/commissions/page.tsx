import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { Role, CommissionStatus } from "@/src/generated/prisma/enums"
import { approveCommission, markCommissionAsPaid } from "@/app/actions/commissions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import CommissionsChart from "@/components/CommissionsChart"
import { StatCard } from "@/components/StatCard"
import DonutChart from "@/components/DonutChart"
import DateRangeFilter from "@/components/DateRangeFilter"
import { resolveRange, inRange } from "@/lib/dateRange"

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
	searchParams: Promise<{ preset?: string; from?: string; to?: string }>
}) {
	const { preset, from, to } = await searchParams
	const supabase = await createClient()
	const { data } = await supabase.auth.getClaims()
	if (!data?.claims) redirect("/login")

	const user = await prisma.user.findUnique({
		where: { supabaseId: data.claims.sub },
		select: { id: true, role: true, companyId: true },
	})
	if (!user) redirect("/login")

	const isAdmin = user.role === Role.ADMIN

	// Admin sieht alle Provisionen SEINER Firma (über den Fahrer), Driver nur eigene
	const commissions = await prisma.commission.findMany({
		where: isAdmin ? { towTruckDriver: { companyId: user.companyId } } : { towTruckDriverId: user.id },
		include: {
			lead: {
				select: { customerLastName: true, vehicleMake: true, vehicleModel: true },
			},
			...(isAdmin && {
				towTruckDriver: {
					select: { firstname: true, lastname: true, companyName: true },
				},
			}),
		},
		orderBy: { createdAt: "desc" },
	})

	// KPIs/Donut/Liste folgen dem Zeitraum; der Jahres-Chart bleibt ungefiltert
	const range = resolveRange(preset, from, to)
	const ranged = commissions.filter((c) => inRange(c.createdAt, range))
	const summaryCommissions = ranged

	const totalAmount = summaryCommissions.reduce((sum, c) => sum + Number(c.amount), 0)
	const pendingAmount = summaryCommissions
		.filter((c) => c.status === CommissionStatus.PENDING)
		.reduce((sum, c) => sum + Number(c.amount), 0)
	const paidAmount = summaryCommissions
		.filter((c) => c.status === CommissionStatus.PAID)
		.reduce((sum, c) => sum + Number(c.amount), 0)
	const approvedAmount = summaryCommissions
		.filter((c) => c.status === CommissionStatus.APPROVED)
		.reduce((sum, c) => sum + Number(c.amount), 0)
	const rejectedAmount = summaryCommissions
		.filter((c) => c.status === CommissionStatus.REJECTED)
		.reduce((sum, c) => sum + Number(c.amount), 0)

	// Commission distribution by status for the donut (amounts, color per slice)
	const provisionStatusData = [
		{ name: "Offen", value: Math.round(pendingAmount), color: "#ca8a04" },
		{ name: "Genehmigt", value: Math.round(approvedAmount), color: "#2563eb" },
		{ name: "Ausbezahlt", value: Math.round(paidAmount), color: "#059669" },
		{ name: "Abgelehnt", value: Math.round(rejectedAmount), color: "#dc2626" },
	].filter((d) => d.value > 0)

	// Chart-Daten: Provision pro Monat (dieses Jahr)
	const monthNames = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
	const currentYear = new Date().getFullYear()

	const chartData = monthNames.map((month, idx) => {
		const monthTotal = commissions
			.filter((c) => c.createdAt.getFullYear() === currentYear && c.createdAt.getMonth() === idx)
			.reduce((sum, c) => sum + Number(c.amount), 0)
		return { month, amount: monthTotal }
	})

	// Gesamtsaldo dieses Jahr (Driver-Sicht)
	const yearStart = new Date(new Date().getFullYear(), 0, 1)
	const thisYearCommissions = commissions.filter((c) => c.createdAt >= yearStart)
	const totalThisYear = thisYearCommissions.reduce((sum, c) => sum + Number(c.amount), 0)

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">{isAdmin ? "Alle Provisionen" : "Meine Provisionen"}</h1>
				<div className="mt-4">
					<DateRangeFilter preset={preset} from={from} to={to} />
				</div>
				<div className="grid gap-4 md:grid-cols-3">
					<StatCard label="Gesamt" value={`${totalAmount.toFixed(2)} €`} />
					<StatCard label="Offen (Pending)" value={`${pendingAmount.toFixed(2)} €`} />
					<StatCard label="Ausbezahlt" value={`${paidAmount.toFixed(2)} €`} />
				</div>

				<Card>
					<CardHeader>
						<CardTitle className="text-base font-semibold">
							Provisionen {currentYear} (pro Monat)
						</CardTitle>
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
				<p className="text-muted-foreground">
					{isAdmin
						? `${summaryCommissions.length} Einträge insgesamt`
						: `Gesamtsaldo dieses Jahr: ${totalThisYear.toFixed(2)} €`}
				</p>
			</div>

			{summaryCommissions.length === 0 ? (
				<Card>
					<CardContent className="pt-6">
						<p className="text-center text-muted-foreground">Keine Provisionen vorhanden</p>
					</CardContent>
				</Card>
			) : (
				<div className="flex flex-col gap-3">
					{summaryCommissions.map((c) => (
						<Card key={c.id}>
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle className="text-base">
										{c.lead.customerLastName} — {c.lead.vehicleMake} {c.lead.vehicleModel}
									</CardTitle>
									<span className={`text-xs font-medium rounded-full px-2 py-1 ring-1 ring-inset ${statusStyles[c.status] ?? statusStyles.PENDING}`}>
										{c.status}
									</span>
								</div>
							</CardHeader>
							<CardContent className="space-y-3 text-sm">
								<div className="flex items-center justify-between">
									<p className="text-2xl font-bold">{Number(c.amount).toFixed(2)} €</p>
									<p className="text-muted-foreground">
										{c.createdAt.toLocaleDateString("de-DE")}
									</p>
								</div>

								{isAdmin && "towTruckDriver" in c && c.towTruckDriver && (
									<p className="text-muted-foreground">
										Fahrer: {c.towTruckDriver.firstname} {c.towTruckDriver.lastname}
										{c.towTruckDriver.companyName && ` — ${c.towTruckDriver.companyName}`}
									</p>
								)}

								{c.paidAt && (
									<p className="text-muted-foreground">
										Bezahlt am: {c.paidAt.toLocaleDateString("de-DE")}
										{c.paymentRef && ` (Ref: ${c.paymentRef})`}
									</p>
								)}

								{/* Admin-Actions */}
								{isAdmin && c.status === CommissionStatus.PENDING && (
									<form action={approveCommission}>
										<input type="hidden" name="commissionId" value={c.id} />
										<Button type="submit" size="sm">Freigeben</Button>
									</form>
								)}

								{isAdmin && c.status === CommissionStatus.APPROVED && (
									<form action={markCommissionAsPaid} className="flex gap-2 items-end">
										<input type="hidden" name="commissionId" value={c.id} />
										<div className="flex-1">
											<label htmlFor={`ref-${c.id}`} className="text-xs text-muted-foreground">
												Payment Ref (optional)
											</label>
											<Input
												id={`ref-${c.id}`}
												name="paymentRef"
												placeholder="z.B. SEPA-2026-001"
											/>
										</div>
										<Button type="submit" size="sm">Als bezahlt markieren</Button>
									</form>
								)}
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	)
}
