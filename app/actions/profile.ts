"use server"

import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Role } from "@/src/generated/prisma/enums"
import { requireUser } from '@/lib/auth'


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
  const companyContactFirstname = (formData.get("companyContactFirstname") as string || null)
  const companyContactLastname = (formData.get("companyContactLastname") as string || null)

  const me = await requireUser()

  // 3. Persönliche Daten immer aktualisieren
  await prisma.user.update({
    where: { id: me.id },
    data: { firstname, lastname, phone },
  })

  // 4. Firmendaten NUR für Admin – jetzt im Company-Model
  if (me.role === Role.ADMIN && me.companyId) {
    await prisma.company.update({
      where: { id: me.companyId },
      data: {
        ...(companyName ? { name: companyName } : {}),
        address: companyAddress,
        postcode: companyPostcode,
        city: companyCity,
        phone: companyPhone,
        email: companyEmail,
        website: companyWebsite,
        contactFirstname: companyContactFirstname,
        contactLastname: companyContactLastname,
      },
    })
  }

  // 5. Redirect zurück zum Profil (mit Flash für Toast)
  redirect("/dashboard/profile?saved=1")
}