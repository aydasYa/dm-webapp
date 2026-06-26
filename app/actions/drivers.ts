"use server"

import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Role, UserStatus } from '@/src/generated/prisma/enums'
import { revalidatePath } from 'next/cache'
import { NAME_PATTERN, EMAIL_PATTERN, str } from '@/app/actions/validation'
import { createQrCode } from '@/lib/qr'
import { assertSameCompany, requireUser } from '@/lib/auth'


// Admin-Aktion: neuen Fahrer anlegen + Einladungslink (Magic Link) verschicken
// Der Fahrer wird sofort als Supabase-Account angelegt (noch ohne Passwort) und
// bekommt per E-Mail einen Magic Link. Beim Öffnen setzt er sein Passwort selbst.
export async function createDriver(formData: FormData) {
  const caller = await requireUser()
  if(caller.role !== Role.ADMIN) throw new Error("Keine Berechtigung")

  // 2. Formularfelder lesen + validieren
  const firstname = str(formData, 'firstname')
  const lastname = str(formData, 'lastname')
  const email = str(formData, 'email')
  if (!firstname || !lastname || !email) redirect('/dashboard/users/new?error=missing_fields')
  if (!NAME_PATTERN.test(firstname) || !NAME_PATTERN.test(lastname)) redirect('/dashboard/users/new?error=invalid_format')
  if (!EMAIL_PATTERN.test(email)) redirect('/dashboard/users/new?error=invalid_email')

  // 3. Supabase-Einladung: legt den Account an UND verschickt den Magic Link
  // (E-Mail-Versand läuft über das in Supabase konfigurierte Resend-SMTP)
  const { createAdminClient } = await import('@/lib/supabase/admin')
  const admin = createAdminClient()
  const { data: invite, error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { firstname, lastname },
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/set-password`,
  })
  if (error || !invite.user) {
    console.error('Einladungsfehler:', error)
    redirect('/dashboard/users/new?error=invite_failed')
  }

  // 4. DB-Datensatz: Fahrer der eigenen Firma, direkt ACTIVE (vom Admin angelegt)
  try {
    await prisma.user.create({
      data: {
        supabaseId: invite.user.id,
        email,
        firstname,
        lastname,
        role: Role.TOW_TRUCK_DRIVER,
        status: UserStatus.PENDING,
        companyId: caller.companyId,
        companyName: caller.companyName,
        companyAddress: caller.companyAddress,
        companyCity: caller.companyCity,
        companyPostcode: caller.companyPostcode,
        companyPhone: caller.companyPhone,
        companyEmail: caller.companyEmail,
        companyContactFirstname: caller.companyContactFirstname,
        companyContactLastname: caller.companyContactLastname,
      },
    })
  } catch (prismaError) {
    // Rollback: eingeladenen Supabase-Nutzer wieder löschen – kein verwaister Account
    console.error('Prisma Fehler, eingeladener Nutzer wird zurückgesetzt:', prismaError)
    await admin.auth.admin.deleteUser(invite.user.id)
    redirect('/dashboard/users/new?error=db_failed')
  }

  revalidatePath('/dashboard/users')
  redirect('/dashboard/users')
}


// Admin-Aktion: Fahrer löschen (Soft-Delete – Daten bleiben wegen Leads/Provisionen erhalten)
export async function deleteDriver(formData: FormData) {
  const caller = await requireUser()
  if(caller.role !== Role.ADMIN) throw new Error("Keine Berechtigung")

  const userId = formData.get("userId") as string

  await assertSameCompany(caller.companyId, userId)

  await prisma.user.update({
    where: { id: userId },
    data: { deletedAt: new Date(), status: UserStatus.INACTIVE },
  })

  revalidatePath("/dashboard/users")
}


// Admin-Aktion: Nutzer freigeben (ACTIVE) oder ablehnen (REJECTED)
// Wird direkt aus dem Admin-Dashboard aufgerufen
export async function updateUserStatus(formData: FormData) {
  const caller = await requireUser()
  if(caller.role !== Role.ADMIN) throw new Error("Keine Berechtigung")

  const userId = formData.get("userId") as string
  const newStatus = formData.get("newStatus") as UserStatus

  if (!Object.values(UserStatus).includes(newStatus)) {
    throw new Error("Ungültiger Nutzerstatus")
  }

  // IDOR-Schutz: Ziel muss zur Firma des Aufrufers gehören
   await assertSameCompany(caller.companyId, userId)

  await prisma.user.update({
    where: { id: userId },
    data: { status: newStatus },
  })

  if (newStatus === UserStatus.ACTIVE) await createQrCode(userId)

  revalidatePath("/dashboard")
}


// QR-Code für einen Abschlepper generieren
// Der Code ist eine UTM-URL zur Angebotsseite – damit kann später nachverfolgt werden,
// welcher Abschlepper den Kunden gebracht hat (utm_medium = userId, utm_source = Firmenname)
export async function generateQrCode(formData: FormData) {
  // Gleiche Admin-Prüfung wie bei updateUserStatus
  const caller = await requireUser()
  if(caller.role !== Role.ADMIN) throw new Error("Keine Berechtigung")

  const userId = formData.get("userId") as string

  await assertSameCompany(caller.companyId, userId)

  await createQrCode(userId)

  revalidatePath("/dashboard")
}


