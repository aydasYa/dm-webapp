import prisma from "@/lib/prisma"


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
