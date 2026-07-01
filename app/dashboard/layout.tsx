import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { requireUser } from "@/lib/auth"
import { UserStatus } from "@/src/generated/prisma/enums"
import DashboardShell from "@/components/DashboardShell"



export const dynamic = "force-dynamic"


export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const user = await requireUser()

    // 3. Pending oder Rejected page rendern passend zum nutzer
    if (user.status === UserStatus.PENDING) redirect("/pending")
    if (user.status === UserStatus.REJECTED) redirect("/rejected")

    const supabase = await createClient()
    if (user.deletedAt) {
        await supabase.auth.signOut()
        redirect("/blocked?reason=deleted")
    }
    if (user.status === UserStatus.INACTIVE) {
        await supabase.auth.signOut()
        redirect("/blocked?reason=inactive")
    }

    return (
        <DashboardShell role={user.role} firstname={user.firstname} lastname={user.lastname} qrCode={user.qrCode} companyName={user.company?.name ?? null}>
            {children}
        </DashboardShell>
    )
}