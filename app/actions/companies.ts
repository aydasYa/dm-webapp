"use server"

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Role, UserStatus } from '@/src/generated/prisma/enums'
import { revalidatePath } from 'next/cache'


// Super-Admin-Aktion: Status eines Firmen-Admins setzen
// freigeben (ACTIVE), ablehnen (REJECTED), deaktivieren (INACTIVE) oder reaktivieren (ACTIVE)
export async function updateCompanyAdminStatus(formData: FormData) {
  // 1. Aufrufer muss Super-Admin sein – Server Actions sind öffentliche Endpunkte
  const supabase = await createClient()
  const { data: sessionData } = await supabase.auth.getClaims()
  if (!sessionData?.claims) redirect('/login')

  const caller = await prisma.user.findUnique({
    where: { supabaseId: sessionData.claims.sub },
    select: { role: true },
  })
  if (caller?.role !== Role.SUPER_ADMIN) throw new Error("Keine Berechtigung")

  // 2. Eingaben lesen + auf erlaubte Statuswerte begrenzen
  const userId = formData.get("userId") as string
  const newStatus = formData.get("newStatus") as UserStatus
  const allowed: UserStatus[] = [UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.REJECTED]
  if (!allowed.includes(newStatus)) throw new Error("Ungültiger Status")

  // 3. Scope: es dürfen NUR Firmen-Admins so verändert werden (kein Fahrer, kein Super-Admin)
  const target = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } })
  if (target?.role !== Role.ADMIN) throw new Error("Nur Firmen-Admins können verändert werden")

  await prisma.user.update({
    where: { id: userId },
    data: { status: newStatus },
  })

  revalidatePath("/dashboard/companies")
}


// Super-Admin-Aktion: Firmen-Admin löschen (Soft-Delete – Daten bleiben wegen Referenzen erhalten)
export async function deleteCompanyAdmin(formData: FormData) {
  const supabase = await createClient()
  const { data: sessionData } = await supabase.auth.getClaims()
  if (!sessionData?.claims) redirect('/login')

  const caller = await prisma.user.findUnique({
    where: { supabaseId: sessionData.claims.sub },
    select: { role: true },
  })
  if (caller?.role !== Role.SUPER_ADMIN) throw new Error("Keine Berechtigung")

  const userId = formData.get("userId") as string
  const target = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } })
  if (target?.role !== Role.ADMIN) throw new Error("Nur Firmen-Admins können gelöscht werden")

  await prisma.user.update({
    where: { id: userId },
    data: { deletedAt: new Date(), status: UserStatus.INACTIVE },
  })

  revalidatePath("/dashboard/companies")
}