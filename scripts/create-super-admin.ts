import "./load-env" // MUSS zuerst stehen: lädt Env vor lib/prisma & Co.

import prisma from "@/lib/prisma"
import { createAdminClient } from "@/lib/supabase/admin"
import { Role, UserStatus } from "@/src/generated/prisma/enums"

async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL
  const password = process.env.SUPER_ADMIN_PASSWORD
  const firstname = process.env.SUPER_ADMIN_FIRSTNAME ?? "Super"
  const lastname = process.env.SUPER_ADMIN_LASTNAME ?? "Admin"
  if (!email || !password) {
    throw new Error("SUPER_ADMIN_EMAIL und SUPER_ADMIN_PASSWORD müssen in .env.local gesetzt sein")
  }

  // 1. Schon ein Super-Admin da? Dann nichts tun (idempotent)
  const existing = await prisma.user.findFirst({ where: { role: Role.SUPER_ADMIN } })
  if (existing) {
    console.log(`Super-Admin existiert bereits: ${existing.email}`)
    return
  }

  // 2. Supabase-Auth-Account anlegen (sofort bestätigt → direkt einloggbar)
  const supabase = createAdminClient()
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })
  if (error || !data.user) {
    throw new Error(`Supabase-Account konnte nicht angelegt werden: ${error?.message}`)
  }

  // 3. DB-Zeile anlegen – bei Fehler Supabase-Account zurückrollen (kein verwaister Account)
  try {
    const user = await prisma.user.create({
      data: {
        supabaseId: data.user.id,
        email,
        firstname,
        lastname,
        role: Role.SUPER_ADMIN,
        status: UserStatus.ACTIVE,
      },
    })
    console.log(`✅ Super-Admin angelegt: ${user.email} (${user.id})`)
  } catch (e) {
    await supabase.auth.admin.deleteUser(data.user.id)
    throw new Error(`DB-Zeile fehlgeschlagen, Supabase-Account zurückgesetzt: ${String(e)}`)
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
