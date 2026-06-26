"use server"

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Role } from "@/src/generated/prisma/enums"


export async function updateProfile(formData: FormData) {
  // 1. Pflichtfelder lesen (immer string)
  const firstname = formData.get("firstname") as string
  const lastname = formData.get("lastname") as string

  // 2. Optionale Felder lesen (leer -> null)
  const phone = (formData.get("phone") as string || null)
  const companyName = (formData.get("companyName") as string || null)
  const companyAddress = (formData.get("companyAddress") as string || null)
  const companyPostcode = (formData.get("companyPostcode") as string || null)
  const companyCity = (formData.get("companyCity") as string || null)
  const companyPhone = (formData.get("companyPhone") as string || null)
  const companyEmail = (formData.get("companyEmail") as string || null)
  const companyWebsite = (formData.get("companyWebsite") as string || null)

  // 3. Login prüfen + Rolle holen
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if(!data?.claims) redirect("/login")

  const me = await prisma.user.findUnique({
    where: { supabaseId: data.claims.sub },
    select: { role: true },
  })

  if(!me) redirect("/login")

    // 4. Update: persönliche Felder immer; Firmendaten NUR für Admin
  await prisma.user.update({
    where: { supabaseId: data.claims.sub },
    data: {
      firstname,
      lastname,
      phone,
      ...(me.role === Role.ADMIN
        ? {
            companyName,
            companyAddress,
            companyPostcode,
            companyCity,
            companyPhone,
            companyEmail,
            companyWebsite,
          }
        : {}),
    },
  })

  // 5. Redirect zurück zum Dashbaord
  redirect("/dashboard/profile")
}