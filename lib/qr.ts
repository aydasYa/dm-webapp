import prisma from "@/lib/prisma"

// Baut die UTM-QR-URL für einen User (Fahrer) und speichert sie
export async function createQrCode(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { companyId: true } })
  if (!user) return
  const firmenId = user.companyId ?? "unbekannt"
  const url = `https://angebot.deinmotorschaden.de?utm_medium=${userId}&utm_source=${firmenId}`
  await prisma.user.update({ where: { id: userId }, data: { qrCode: url } })
}