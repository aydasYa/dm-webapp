"use server"

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Role, UserStatus } from '@/src/generated/prisma/enums'
import { str, validateSignup, type SignupFields } from '@/app/actions/validation'
import { createQrCode } from '@/lib/qr'


export async function signup(formData: FormData) {
  const d: SignupFields = {
    email: str(formData, 'email'),
    password: str(formData, 'password'),
    passwordConfirm: str(formData, 'passwordConfirm'),
    firstname: str(formData, 'firstname'),
    lastname: str(formData, 'lastname'),
    phone: str(formData, 'phone'),
    companyName: str(formData, 'companyName'),
    companyAddress: str(formData, 'companyAddress'),
    companyPostcode: str(formData, 'companyPostcode'),
    companyCity: str(formData, 'companyCity'),
    companyPhone: str(formData, 'companyPhone'),
    companyEmail: str(formData, 'companyEmail'),
    companyWebsite: str(formData, 'companyWebsite'),
  }

  const validationError = validateSignup(d)
  if (validationError) redirect(`/signup?error=${validationError}`)

  const { email, password, firstname, lastname, phone,
    companyName, companyAddress, companyPostcode, companyCity,
    companyPhone, companyEmail, companyWebsite } = d

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
    // Erst die Firma mit allen Details anlegen
    const company = await prisma.company.create({
      data: {
        name: companyName,
        address: companyAddress,
        postcode: companyPostcode,
        city: companyCity,
        phone: companyPhone,
        email: companyEmail,
        website: companyWebsite,
      },
    })

    // Dann den Admin-User, direkt mit der companyId verknüpft
    await prisma.user.create({
      data: {
        supabaseId: data.user.id,
        email,
        firstname,
        lastname,
        phone,
        role: Role.ADMIN,
        status: UserStatus.PENDING,
        companyId: company.id,
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


// Wird vom eingeladenen Fahrer aufgerufen, nachdem er den Magic Link geöffnet hat.
// Der Link hat ihn bereits eingeloggt – hier setzt er nur noch sein Passwort.
export async function setPassword(formData: FormData) {
  const password = str(formData, 'password')
  const passwordConfirm = str(formData, 'passwordConfirm')

  if (password.length < 8) redirect('/auth/set-password?error=password_too_short')
  if (password !== passwordConfirm) redirect('/auth/set-password?error=password_mismatch')

  // Muss eingeloggt sein – die Magic-Link-Session steht bereits
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect('/login')

  const { error } = await supabase.auth.updateUser({ password })
  if (error) {
    console.error('Passwort-Fehler:', error)
    redirect('/auth/set-password?error=update_failed')
  }

  const user = await prisma.user.update({
    where: { supabaseId: data.claims.sub },
    data: { status: UserStatus.ACTIVE },
  })

  await createQrCode(user.id);

  redirect('/dashboard')
}

