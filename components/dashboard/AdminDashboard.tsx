import prisma from "@/lib/prisma"
import { Role, UserStatus, CommissionStatus } from "@/src/generated/prisma/enums"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminDashboard({ firstname }: { firstname: string }) {
	const totalActiveDrivers = await prisma.user.count({ where: { role: Role.TOW_TRUCK_DRIVER, status: UserStatus.ACTIVE } })
	const totalInactiveDrivers = await prisma.user.count({ where: { role: Role.TOW_TRUCK_DRIVER, status: UserStatus.INACTIVE } })
	const registeredDrivers = await prisma.user.count({ where: { role: Role.TOW_TRUCK_DRIVER } })
	const pendingUsers = await prisma.user.count({ where: { status: UserStatus.PENDING } })

	// Calculate the Commission
	const commissions = await prisma.commission.findMany({ select: { amount: true, status: true } })
	const comSum = commissions.reduce((s, c) => s + Number(c.amount), 0)
	const comOpen = commissions.filter(c => c.status === CommissionStatus.PENDING).reduce((s, c) => s + Number(c.amount), 0)
	const comPaid = commissions.filter(c => c.status === CommissionStatus.PAID).reduce((s, c) => s + Number(c.amount), 0)

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Willkommen, {firstname}</h1>
				<p className="text-muted-foreground">Übersicht deiner Aktivitäten</p>
			</div>

			<div>
				<h2 className="font-semibold mb-2">Provisionen</h2>
				<div className="grid gap-4 md:grid-cols-3">
					<Card><CardHeader><CardTitle className="text-base font-semibold">Gesamt</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{comSum.toFixed(2)} €</p></CardContent></Card>
					<Card><CardHeader><CardTitle className="text-base font-semibold">Offen</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{comOpen.toFixed(2)} €</p></CardContent></Card>
					<Card><CardHeader><CardTitle className="text-base font-semibold">Ausbezahlt</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{comPaid.toFixed(2)} €</p></CardContent></Card>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader>
						<CardTitle className="text-base font-semibold">
							Aktive Abschlepper
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{totalActiveDrivers}</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-base font-semibold">
							Inaktive Abschlepper
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{totalInactiveDrivers}</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-base font-semibold">
							Alle registrierten Abschlepper
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{registeredDrivers}</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-base font-semibold">
							Warten auf Freigabe
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{pendingUsers}</p>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}