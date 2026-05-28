"use server"

// Alle Auth-bezogenen Server-Aktionen: Registrierung, Login, Abmelden, Freigabe, QR-Code
// Tipp für später: jede Funktion in eine eigene Datei auslagern, wenn es mehr wird

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Role } from '@/src/generated/prisma/enums'
import { UserStatus } from '@/src/generated/prisma/enums'
import { revalidatePath } from 'next/cache'

// Registrierung: läuft in zwei Schritten
// 1. Supabase-Account anlegen (für Auth/Login)
// 2. Nutzer-Datensatz in der Datenbank speichern (für App-Daten)
// Schlägt Schritt 2 fehl, wird der Supabase-Account automatisch wieder gelöscht – kein halb-angelegter Nutzer
export async function signup(formData: FormData) {
  // Persönliche Felder (später: Model <User>)
  const email     = formData.get('email') as string
  const password  = formData.get('password') as string
  const firstname = formData.get('firstname') as string
  const lastname  = formData.get('lastname') as string
  const phone     = formData.get('phone') as string

  // Firmendaten (später: Model <Company>)
  const companyName          = formData.get('companyName') as string
  const companyAddress       = formData.get('companyAddress') as string
  const companyPostcode      = formData.get('companyPostcode') as string
  const companyCity          = formData.get('companyCity') as string
  const companyPhone         = formData.get('companyPhone') as string
  const companyEmail         = formData.get('companyEmail') as string
  const companyContactPerson = formData.get('companyContactPerson') as string

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { firstname, lastname },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm`,
    },
  })

  if (error || !data.user) {
    console.error('Supabase Registrierungsfehler:', error)
    redirect('/signup?error=signup_failed')
  }

  try {
    await prisma.user.create({
      data: {
        supabaseId: data.user.id,
        email,
        firstname,
        lastname,
        phone,
        role: Role.TOW_TRUCK_DRIVER, // neue Nutzer sind immer Abschlepper – Admins werden manuell gesetzt
        companyName,
        companyAddress,
        companyPostcode,
        companyCity,
        companyPhone,
        companyEmail,
        companyContactPerson,
      },
    })
  } catch (prismaError) {
    // DB-Fehler: Supabase-Account zurückrollen, damit kein verwaister Auth-Nutzer entsteht
    console.error('Prisma Fehler, Supabase-Nutzer wird zurückgesetzt:', prismaError)
    const { createAdminClient } = await import('@/lib/supabase/admin')
    const admin = createAdminClient()
    await admin.auth.admin.deleteUser(data.user.id)
    redirect('/signup?error=db_failed')
  }

  redirect('/signup/success')
}

// Abmelden: Session bei Supabase beenden und zurück zum Login
export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

// Admin-Aktion: Nutzer freigeben (ACTIVE) oder ablehnen (REJECTED)
// Wird direkt aus dem Admin-Dashboard aufgerufen
export async function updateUserStatus(formData: FormData) {
  // Erst prüfen ob der Aufrufer wirklich Admin ist – Server Actions sind öffentliche Endpunkte
  const supabase = await createClient()
  const { data: sessionData } = await supabase.auth.getClaims()
  if (!sessionData?.claims) redirect('/login')

  const caller = await prisma.user.findUnique({
    where: { supabaseId: sessionData.claims.sub },
    select: { role: true },
  })
  if (caller?.role !== Role.ADMIN) throw new Error("Keine Berechtigung")

  const userId = formData.get("userId") as string
  const newStatus = formData.get("newStatus") as UserStatus

  if (!Object.values(UserStatus).includes(newStatus)) {
    throw new Error("Ungültiger Nutzerstatus")
  }

  await prisma.user.update({
    where: { id: userId },
    data:  { status: newStatus },
  })

  revalidatePath("/dashboard")
}

// QR-Code für einen Abschlepper generieren
// Der Code ist eine UTM-URL zur Angebotsseite – damit kann später nachverfolgt werden,
// welcher Abschlepper den Kunden gebracht hat (utm_medium = userId, utm_source = Firmenname)
export async function generateQrCode(formData: FormData) {
  // Gleiche Admin-Prüfung wie bei updateUserStatus
  const supabase = await createClient()
  const { data: sessionData } = await supabase.auth.getClaims()
  if (!sessionData?.claims) redirect('/login')

  const caller = await prisma.user.findUnique({
    where: { supabaseId: sessionData.claims.sub },
    select: { role: true },
  })
  if (caller?.role !== Role.ADMIN) throw new Error("Keine Berechtigung")

  const userId = formData.get("userId") as string

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { companyName: true },
  })

  if (!user) {
    throw new Error("Benutzer nicht gefunden")
  }

  const utmSource = user.companyName ? encodeURIComponent(user.companyName) : "unbekannt"

  const url = `https://angebot.deinmotorschaden.de?utm_medium=${userId}&utm_source=${utmSource}`

  await prisma.user.update({
    where: { id: userId },
    data: { qrCode: url },
  })

  revalidatePath("/dashboard")
}

export async function updateProfile(formData: FormData) {
  // 1. Pflichtfelder lesen (immer string)
  const firstname = formData.get("firstname") as string
  const lastname = formData.get("lastname") as string

  // 2. Optionale Felder lesen (leer -> null)
  const phone                 = (formData.get("phone") as string || null)
  const companyName           = (formData.get("companyName") as string || null)
  const companyAddress        = (formData.get("companyAddress") as string || null)
  const companyPostcode       = (formData.get("companyPostcode") as string || null)
  const companyCity           = (formData.get("companyCity") as string || null)
  const companyPhone          = (formData.get("companyPhone") as string || null)
  const companyEmail          = (formData.get("companyEmail") as string || null)
  const companyContactPerson  = (formData.get("companyContactPerson") as string || null)

  // 3. Login prüfen via suapabase
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect("/login")

  // 4. Update -> direkt via supabaseId  (kein Owner-Check nötig)
  await prisma.user.update({
    where: { supabaseId: data.claims.sub },
    data: {
      firstname,
      lastname,
      phone,
      companyName,
      companyAddress,
      companyPostcode,
      companyCity,
      companyPhone,
      companyEmail,
      companyContactPerson,
    },
  })

    // 5. Redirect zurück zum Dashbaord
    redirect("/dashboard/profile")
}