import prisma from "@/lib/prisma"
import { Role, UserStatus } from "@/src/generated/prisma/enums"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminDashboard({ firstname }: { firstname: string }) {
	const totalLeads = await prisma.lead.count({ where: { deletedAt: null } })
	const totalActiveDrivers = await prisma.user.count({ where: { role: Role.TOW_TRUCK_DRIVER, status: UserStatus.ACTIVE } })
	const totalInactiveDrivers = await prisma.user.count({ where: { role: Role.TOW_TRUCK_DRIVER, status: UserStatus.INACTIVE } })
	const totalRejectedDrivers = await prisma.user.count({ where: { role: Role.TOW_TRUCK_DRIVER, status: UserStatus.REJECTED } })
	const registeredDrivers = await prisma.user.count({ where: { role: Role.TOW_TRUCK_DRIVER } })
	const pendingUsers = await prisma.user.count({ where: { status: UserStatus.PENDING } })

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Willkommen, {firstname}</h1>
				<p className="text-muted-foreground">Übersicht deiner Aktivitäten</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader>
						<CardTitle className="text-base font-semibold">
							Alle Leads
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{totalLeads}</p>
					</CardContent>
				</Card>
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
									Abgelehnte Abschlepper
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-2xl font-bold">{totalRejectedDrivers}</p>
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