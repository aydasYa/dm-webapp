"use server"

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Role } from '@/src/generated/prisma/enums'
import { UserStatus } from '@/src/generated/prisma/enums'
import { revalidatePath } from 'next/cache'

export async function signup(formData: FormData) {
  // Personen felder (sptäter: model <User>)
  const email     = formData.get('email') as string
  const password  = formData.get('password') as string
  const firstname = formData.get('firstname') as string
  const lastname  = formData.get('lastname') as string
  const phone     = formData.get('phone') as string

  // Personen felder (sptäter: model <Company>)
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
      emailRedirectTo: 'http://localhost:3000/auth/confirm',
    },
  })

  if (error || !data.user) {
    console.error('Supabase signUp error:', error)
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
        role: Role.TOW_TRUCK_DRIVER,
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
    console.error('Prisma create error, rolling back Supabase user:', prismaError)
    const { createAdminClient } = await import('@/lib/supabase/admin')
    const admin = createAdminClient()
    await admin.auth.admin.deleteUser(data.user.id)
    redirect('/signup?error=db_failed')
  }

  redirect('/signup/success')
}

// Alle server actions, besser: in getrennte files legen für übersicht
export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function updateUserStatus(formData: FormData) {
  const userId = formData.get("userId") as string
  const newStatus = formData.get("newStatus") as UserStatus
  
  await prisma.user.update({
    where: { id: userId },
    data:  { status: newStatus },
  })

  revalidatePath("/dashboard")
}

export async function generateQrCode(formData: FormData) {
  const userId = formData.get("userId") as string

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { companyName: true },
  })

  if (!user) {
    throw new Error("User nicht gefunden")
  }
  
  const utmSource = user.companyName ? encodeURIComponent(user.companyName) : "unkown"

  const url = `https://angebot.deinmotorschaden.de?utm_medium=${userId}&utm_source=${utmSource}`

  await prisma.user.update({
    where: { id: userId },
    data: { qrCode: url },
  })

  revalidatePath("/dashboard")
}