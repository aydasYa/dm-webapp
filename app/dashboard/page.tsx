import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Role, UserStatus } from "@/src/generated/prisma/enums"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
	const supabase = await createClient()
	const { data } = await supabase.auth.getClaims()
	if (!data?.claims) redirect("/login")

	const user = await prisma.user.findUnique({
		where: { supabaseId: data.claims.sub },
		select: { firstname: true, role: true, status: true },
	})
	if (!user) redirect("/login")

	if (user.status === UserStatus.PENDING) {
		return <p>Konto wartet auf Freigabe.</p>
	}
	if (user.status === UserStatus.REJECTED) {
		return <p>Registrierung abgelehnt.</p>
	}

	const isAdmin = user.role === Role.ADMIN

	const totalLeads = await prisma.lead.count({
		where: {
			deletedAt: null,
			...(isAdmin ? {} : { towTruckDriver: { supabaseId: data.claims.sub } }),
		},
	})

	const totalActiveDrivers = isAdmin
		? await prisma.user.count({
			where: { role: Role.TOW_TRUCK_DRIVER, status: UserStatus.ACTIVE },
		})
		: 0

	const totalInactiveDrivers = isAdmin
		? await prisma.user.count({
			where: { role: Role.TOW_TRUCK_DRIVER, status: UserStatus.INACTIVE },
		})
		: 0

	const totalRejectedDrivers = isAdmin
		? await prisma.user.count({
			where: { role: Role.TOW_TRUCK_DRIVER, status: UserStatus.REJECTED },
		})
		: 0

	const registeredDrivers = isAdmin
		? await prisma.user.count({ where: { role: Role.TOW_TRUCK_DRIVER } })
		: 0

	const pendingUsers = isAdmin
		? await prisma.user.count({ where: { status: UserStatus.PENDING } })
		: 0

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Willkommen, {user.firstname}</h1>
				<p className="text-muted-foreground">Übersicht deiner Aktivitäten</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader>
						<CardTitle className="text-base font-semibold">
							{isAdmin ? "Alle Leads" : "Meine Leads"}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{totalLeads}</p>
					</CardContent>
				</Card>

				{isAdmin && (
					<>
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
					</>
				)}
			</div>
		</div>
	)
}