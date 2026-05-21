import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { Role, LeadStatus } from "@/src/generated/prisma/enums"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const dynamic = "force-dynamic"

type SearchParams = { status?: string }

const statusStyles: Record<string, string> = {
	NEW: "bg-violet-100 text-violet-700 ring-violet-200",
	DISTRIBUTED: "bg-blue-100 text-blue-700 ring-blue-200",
	QR_SCANNED: "bg-cyan-100 text-cyan-700 ring-cyan-200",
	WORKSHOP_SELECTED: "bg-indigo-100 text-indigo-700 ring-indigo-200",
	IN_REPAIR: "bg-yellow-100 text-yellow-700 ring-yellow-200",
	REPAIR_DONE: "bg-orange-100 text-orange-700 ring-orange-200",
	VEHICLE_DELIVERED: "bg-teal-100 text-teal-700 ring-teal-200",
	COMPLETED: "bg-emerald-100 text-emerald-800 ring-emerald-300",
	CANCELLED: "bg-red-100 text-red-700 ring-red-200",
}

export default async function LeadsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
	const { status } = await searchParams

	const supabase = await createClient()
	const { data } = await supabase.auth.getClaims()
	if (!data?.claims) redirect("/login")

	const user = await prisma.user.findUnique({
		where: { supabaseId: data.claims.sub },
		select: { id: true, role: true },
	})
	if (!user) redirect("/login")

	const isAdmin = user.role === Role.ADMIN

	const leads = await prisma.lead.findMany({
		where: {
			deletedAt: null,
			...(isAdmin ? {} : { towTruckDriverId: user.id }),
			...(status && { status: status as LeadStatus }),
		},
		select: {
			id: true,
			customerLastName: true,
			vehicleMake: true,
			vehicleModel: true,
			breakdownStreet: true,
			breakdownPostcode: true,
			breakdownCity: true,
			status: true,
			createdAt: true,
			...(isAdmin && {
				towTruckDriver: {
					select: { firstname: true, lastname: true, companyName: true },
				},
			}),
		},
		orderBy: { createdAt: "desc" },
	})

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">{isAdmin ? "Alle Leads" : "Meine Leads"}</h1>
				{!isAdmin && (
					<Button asChild>
						<Link href="/dashboard/leads/new">+ Neuer Lead</Link>
					</Button>
				)}
			</div>

			<Card>
				<CardContent className="pt-6">
					<form action="/dashboard/leads" method="get" className="flex items-center gap-3">
						<label htmlFor="status" className="text-sm font-medium">Status:</label>
						<select
							id="status"
							name="status"
							defaultValue={status ?? ""}
							className="border rounded-md px-3 py-1.5 text-sm bg-background"
						>
							<option value="">Alle</option>
							<option value="NEW">NEW</option>
							<option value="DISTRIBUTED">DISTRIBUTED</option>
							<option value="QR_SCANNED">QR_SCANNED</option>
							<option value="WORKSHOP_SELECTED">WORKSHOP_SELECTED</option>
							<option value="IN_REPAIR">IN_REPAIR</option>
							<option value="REPAIR_DONE">REPAIR_DONE</option>
							<option value="VEHICLE_DELIVERED">VEHICLE_DELIVERED</option>
							<option value="COMPLETED">COMPLETED</option>
							<option value="CANCELLED">CANCELLED</option>
						</select>
						<Button type="submit" variant="outline" size="sm">Filtern</Button>
					</form>
				</CardContent>
			</Card>

			{leads.length === 0 ? (
				<Card>
					<CardContent className="pt-6">
						<p className="text-center text-muted-foreground">Keine Leads gefunden</p>
					</CardContent>
				</Card>
			) : (
				<div className="flex flex-col gap-3">
					{leads.map((lead) => (
						<Link key={lead.id} href={`/dashboard/leads/${lead.id}`}>
							<Card className="transition-colors hover:bg-accent">
								<CardContent className="pt-6">
									<div className="flex items-center justify-between">
										<div>
											<p className="font-semibold">{lead.customerLastName}</p>
											<p className="text-sm text-muted-foreground">
												{lead.vehicleMake} {lead.vehicleModel}
											</p>
											<p className="text-sm text-muted-foreground">
												{lead.breakdownStreet}, {lead.breakdownPostcode} {lead.breakdownCity}
											</p>
											{isAdmin && "towTruckDriver" in lead && lead.towTruckDriver && (
												<p className="text-xs text-muted-foreground mt-1">
													Fahrer: {lead.towTruckDriver.firstname} {lead.towTruckDriver.lastname}
													{lead.towTruckDriver.companyName && ` — ${lead.towTruckDriver.companyName}`}
												</p>
											)}
										</div>
										<span className={`text-xs font-medium rounded-full px-2 py-1 ring-1 ring-inset ${statusStyles[lead.status] ?? statusStyles.NEW}`}>
											{lead.status}
										</span>
									</div>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			)}
		</div>
	)
}