import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import DashboardShell from "@/components/DashboardShell"

export const dynamic = "force-dynamic"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const { data } = await supabase.auth.getClaims()
    if (!data?.claims) redirect("/login")

    const user = await prisma.user.findUnique({
        where: { supabaseId: data.claims.sub },
        select: { role: true, firstname: true, lastname: true },
    })
    if (!user) redirect("/login")

    return (
        <DashboardShell role={user.role} firstname={user.firstname} lastname={user.lastname}>
            {children}
        </DashboardShell>
    )
}