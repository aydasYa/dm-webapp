import prisma from "@/lib/prisma"

// Baut die UTM-QR-URL für einen User (Fahrer) und speichert sie
export async function createQrCode(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { companyId: true } })
  if (!user) return
  const url = `https://angebot.deinmotorschaden.de?user_id=${userId}&company_id=${user.companyId ?? "unbekannt"}`
  await prisma.user.update({ where: { id: userId }, data: { qrCode: url } })
} 