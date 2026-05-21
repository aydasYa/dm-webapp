import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { Role, UserStatus } from "@/src/generated/prisma/enums"
import { updateUserStatus } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function UsersPage() {
	const supabase = await createClient()
	const { data } = await supabase.auth.getClaims()
	if (!data?.claims) redirect("/login")

	// Permission-Check: nur Admin
	const caller = await prisma.user.findUnique({
		where: { supabaseId: data.claims.sub },
		select: { role: true },
	})
	if (caller?.role !== Role.ADMIN) redirect("/dashboard")

	const pendingUsers = await prisma.user.findMany({
		where: { status: UserStatus.PENDING },
		select: {
			id: true,
			firstname: true,
			lastname: true,
			email: true,
			companyName: true,
			createdAt: true,
		},
		orderBy: { createdAt: "desc" },
	})

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Ausstehende Freigaben</h1>
				<p className="text-muted-foreground">{pendingUsers.length} Nutzer warten auf Aktivierung</p>
			</div>

			{pendingUsers.length === 0 ? (
				<Card>
					<CardContent className="pt-6">
						<p className="text-center text-muted-foreground">Keine ausstehenden Freigaben</p>
					</CardContent>
				</Card>
			) : (
				<div className="flex flex-col gap-3">
					{pendingUsers.map((pu) => (
						<Card key={pu.id}>
							<CardHeader>
								<CardTitle className="text-base">
									{pu.firstname} {pu.lastname}
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="text-sm text-muted-foreground space-y-1">
									<p>{pu.email}</p>
									{pu.companyName && <p>Firma: {pu.companyName}</p>}
									<p>Registriert: {pu.createdAt.toLocaleDateString("de-DE")}</p>
								</div>
								<div className="flex gap-2">
									<form action={updateUserStatus}>
										<input type="hidden" name="userId" value={pu.id} />
										<input type="hidden" name="newStatus" value="ACTIVE" />
										<Button type="submit">Freigeben</Button>
									</form>
									<form action={updateUserStatus}>
										<input type="hidden" name="userId" value={pu.id} />
										<input type="hidden" name="newStatus" value="REJECTED" />
										<Button type="submit" variant="destructive">Ablehnen</Button>
									</form>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	)
}