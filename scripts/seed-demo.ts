import "./load-env" // MUSS zuerst stehen: lädt Env vor lib/prisma & Co.

import prisma from "@/lib/prisma"
import { createAdminClient } from "@/lib/supabase/admin"
import { createQrCode } from "@/lib/qr"
import { Role, UserStatus } from "@/src/generated/prisma/enums"

// ─────────────────────────────────────────────────────────────
// Demo-Seed: 3 Firmen (je 1 Admin + 4 Fahrer) + 1 Super-Admin.
// Alle Accounts mit Passwort "demo12345", sofort aktiv & einloggbar.
// Wiederholbar: löscht vorher alle @demo.de-Daten (Supabase + DB).
// Ausführen NACH `pnpm prisma migrate reset`.
// ─────────────────────────────────────────────────────────────

const DEMO_DOMAIN = "@demo.de"
const PASSWORD = "test1234"

const supabase = createAdminClient()

// Legt einen Supabase-Auth-Account an und gibt die supabaseId zurück
async function createAuthUser(email: string, firstname: string, lastname: string): Promise<string> {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { firstname, lastname },
  })
  if (error || !data.user) {
    throw new Error(`Supabase-Account fehlgeschlagen (${email}): ${error?.message}`)
  }
  return data.user.id
}

// Räumt alte Demo-Daten weg, damit das Skript wiederholbar ist
async function cleanup() {
  // 1. DB: Demo-User löschen, dann verwaiste Firmen
  await prisma.user.deleteMany({ where: { email: { endsWith: DEMO_DOMAIN } } })
  await prisma.company.deleteMany({ where: { users: { none: {} } } })

  // 2. Supabase: alle Auth-Accounts mit @demo.de löschen (seitenweise)
  let page = 1
  for (;;) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 })
    if (error || !data) break
    const demoUsers = data.users.filter((u) => u.email?.endsWith(DEMO_DOMAIN))
    for (const u of demoUsers) await supabase.auth.admin.deleteUser(u.id)
    if (data.users.length < 200) break
    page++
  }
}

// ─── Demo-Daten ───
const companies = [
  {
    name: "Abschlepp Berlin GmbH",
    address: "Müllerstraße 12",
    postcode: "13353",
    city: "Berlin",
    phone: "030 1234567",
    email: "info@abschlepp-berlin.de",
    website: "https://abschlepp-berlin.de",
    contactFirstname: "Markus",
    contactLastname: "Weber",
    admin: { firstname: "Markus", lastname: "Weber", email: "admin.berlin@demo.de" },
    drivers: [
      { firstname: "Tom", lastname: "Schulz" },
      { firstname: "Jan", lastname: "Krüger" },
      { firstname: "Leon", lastname: "Hofmann" },
      { firstname: "Nico", lastname: "Braun" },
    ],
  },
  {
    name: "Hanse Bergung Hamburg",
    address: "Reeperbahn 88",
    postcode: "20359",
    city: "Hamburg",
    phone: "040 7654321",
    email: "info@hanse-bergung.de",
    website: "https://hanse-bergung.de",
    contactFirstname: "Sabine",
    contactLastname: "Fischer",
    admin: { firstname: "Sabine", lastname: "Fischer", email: "admin.hamburg@demo.de" },
    drivers: [
      { firstname: "Finn", lastname: "Meyer" },
      { firstname: "Lars", lastname: "Wagner" },
      { firstname: "Ole", lastname: "Schmidt" },
      { firstname: "Pia", lastname: "Richter" },
    ],
  },
  {
    name: "Isar Pannenhilfe München",
    address: "Leopoldstraße 45",
    postcode: "80802",
    city: "München",
    phone: "089 2468135",
    email: "info@isar-pannenhilfe.de",
    website: "https://isar-pannenhilfe.de",
    contactFirstname: "Mehmet",
    contactLastname: "Yıldız",
    admin: { firstname: "Mehmet", lastname: "Yıldız", email: "admin.muenchen@demo.de" },
    drivers: [
      { firstname: "Emre", lastname: "Demir" },
      { firstname: "Luca", lastname: "Bauer" },
      { firstname: "Ben", lastname: "Wolf" },
      { firstname: "Mia", lastname: "Neumann" },
    ],
  },
]

const superAdmin = { firstname: "Deniz", lastname: "Kaya", email: "superadmin@demo.de" }

// Firmen-Admins mit besonderem Status (für Freigabe-/Ablehnungs-Test) – keine Fahrer
const specialAdmins = [
  {
    status: UserStatus.PENDING,
    company: {
      name: "Werkstatt Express Köln",
      address: "Hohe Straße 7",
      postcode: "50667",
      city: "Köln",
      phone: "0221 9876543",
      email: "info@werkstatt-express.de",
      website: "https://werkstatt-express.de",
      contactFirstname: "Jonas",
      contactLastname: "Klein",
    },
    admin: { firstname: "Jonas", lastname: "Klein", email: "admin.pending@demo.de" },
  },
  {
    status: UserStatus.REJECTED,
    company: {
      name: "Abschlepp Süd Stuttgart",
      address: "Königstraße 30",
      postcode: "70173",
      city: "Stuttgart",
      phone: "0711 1357924",
      email: "info@abschlepp-sued.de",
      website: "https://abschlepp-sued.de",
      contactFirstname: "Carla",
      contactLastname: "Vogt",
    },
    admin: { firstname: "Carla", lastname: "Vogt", email: "admin.rejected@demo.de" },
  },
]

async function main() {
  console.log("Räume alte @demo.de-Daten weg …")
  await cleanup()

  // ─── Super-Admin ───
  const saId = await createAuthUser(superAdmin.email, superAdmin.firstname, superAdmin.lastname)
  await prisma.user.create({
    data: {
      supabaseId: saId,
      email: superAdmin.email,
      firstname: superAdmin.firstname,
      lastname: superAdmin.lastname,
      role: Role.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
    },
  })
  console.log(`✅ Super-Admin: ${superAdmin.email}`)

  // ─── Firmen + Admins + Fahrer ───
  for (const c of companies) {
    const company = await prisma.company.create({
      data: {
        name: c.name,
        address: c.address,
        postcode: c.postcode,
        city: c.city,
        phone: c.phone,
        email: c.email,
        website: c.website,
        contactFirstname: c.contactFirstname,
        contactLastname: c.contactLastname,
      },
    })

    // Admin der Firma
    const adminAuthId = await createAuthUser(c.admin.email, c.admin.firstname, c.admin.lastname)
    await prisma.user.create({
      data: {
        supabaseId: adminAuthId,
        email: c.admin.email,
        firstname: c.admin.firstname,
        lastname: c.admin.lastname,
        role: Role.ADMIN,
        status: UserStatus.ACTIVE,
        companyId: company.id,
      },
    })

    // 4 Fahrer der Firma (aktiv, mit QR-Code)
    let n = 1
    for (const d of c.drivers) {
      const email = `fahrer${n}.${c.city.toLowerCase().replace(/[^a-z]/g, "")}@demo.de`
      const driverAuthId = await createAuthUser(email, d.firstname, d.lastname)
      const driver = await prisma.user.create({
        data: {
          supabaseId: driverAuthId,
          email,
          firstname: d.firstname,
          lastname: d.lastname,
          role: Role.TOW_TRUCK_DRIVER,
          status: UserStatus.ACTIVE,
          companyId: company.id,
        },
      })
      await createQrCode(driver.id)
      n++
    }

    console.log(`✅ ${c.name}: Admin ${c.admin.email} + 4 Fahrer`)
  }

  // ─── Sonder-Admins (PENDING / REJECTED), ohne Fahrer ───
  for (const s of specialAdmins) {
    const company = await prisma.company.create({ data: s.company })
    const authId = await createAuthUser(s.admin.email, s.admin.firstname, s.admin.lastname)
    await prisma.user.create({
      data: {
        supabaseId: authId,
        email: s.admin.email,
        firstname: s.admin.firstname,
        lastname: s.admin.lastname,
        role: Role.ADMIN,
        status: s.status,
        companyId: company.id,
      },
    })
    console.log(`✅ ${s.company.name}: Admin ${s.admin.email} (${s.status})`)
  }

  console.log(`\nFertig. Login-Passwort für alle: ${PASSWORD}`)
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
