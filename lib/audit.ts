import prisma from "@/lib/prisma"

// Schreibt einen AuditLog-Eintrag: WER (actorId) hat WAS (action) getan, optional Details.
// "wann" macht createdAt automatisch.
export async function logAudit({
  action,
  actorId,
  details,
}: {
  action: string
  actorId?: string
  details?: string
}) {
  await prisma.auditLog.create({
    data: {
      action,
      userId: actorId,
      details,
    },
  })
}