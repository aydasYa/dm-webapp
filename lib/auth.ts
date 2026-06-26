import prisma from "@/lib/prisma"
import { createClient } from "./supabase/server"
import { redirect } from "next/navigation"
import { Role } from "@/src/generated/prisma/enums"


// Wirft, wenn das Ziel-User nicht zur Firma des Aufrufers, gehört (IDOR-Schutz)
export async function assertSameCompany(callerCompanyId: string |null, userId: string) {
    if(!callerCompanyId) throw new Error("Keine Berechtigung")
    const target = await prisma.user.findUnique({
        where: { id: userId },
        select: { companyId: true },
    })

    if (!target || target.companyId !== callerCompanyId) {
        throw new Error("Keine Berechtigung")
    }
}


// Holt den eingeloggten User; leitet zu /login wenn nicht angemeldet.
// Optional: verlangt eine Rolle, sonst Redirect zum Dashboard
export async function requireUser(role?: Role) {
    const supabase = await createClient()
    const { data } = await supabase.auth.getClaims()
    if(!data?.claims) redirect("/login")
    
    const user = await prisma.user.findUnique({
        where: { supabaseId: data?.claims.sub},
        include: { company: true },
    })
    if(!user) redirect("/login")
    
    if(role && user.role !== role) redirect("/dashboard")

    return user
}