"use server"

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstname = formData.get('firstname') as string
  const lastname = formData.get('lastname') as string

  // 1. Supabase Auth User anlegen
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

  // 2. Prisma User anlegen (mit Rollback bei Fehler)
  try {
    await prisma.user.create({
      data: {
        supabaseId: data.user.id,
        email,
        firstname,
        lastname,
      },
    })
  } catch (prismaError) {
    console.error('Prisma create error, rolling back Supabase user:', prismaError)
    // Rollback: Supabase User wieder löschen
    const { createAdminClient } = await import('@/lib/supabase/admin')
    const admin = createAdminClient()
    await admin.auth.admin.deleteUser(data.user.id)
    redirect('/signup?error=db_failed')
  }

  redirect('/signup/success')
}