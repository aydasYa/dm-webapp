import prisma from "@/lib/prisma"
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"

export default async function DriverDashboard({
	supabaseId,
	firstname,
}: {
	supabaseId: string
	firstname: string
}) {
	const totalLeads = await prisma.lead.count({
		where: { deletedAt: null, towTruckDriver: { supabaseId } },
	})

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
							Meine Leads
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{totalLeads}</p>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}