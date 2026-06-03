import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import DashboardShell from "@/components/DashboardShell"
import { UserStatus } from "@/src/generated/prisma/enums"

export const dynamic = "force-dynamic"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const { data } = await supabase.auth.getClaims()
    // 1. Prüfen ob nutzer eingeloggt ist
    if (!data?.claims) redirect("/login")

    // 2. User in DB finden
    const user = await prisma.user.findUnique({
        where: { supabaseId: data.claims.sub },
        select: {
            role: true,
            firstname: true,
            lastname: true,
            status: true,
        },
    })
    if (!user) redirect("/login")

    // 3. Pending oder Rejected page rendern passend zum nutzer
    if (user.status === UserStatus.PENDING) redirect("/pending")
    if (user.status === UserStatus.REJECTED) redirect("/rejected")

    return (
        <DashboardShell role={user.role} firstname={user.firstname} lastname={user.lastname}>
            {children}
        </DashboardShell>
    )
}