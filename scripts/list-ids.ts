import "./load-env"

import prisma from "@/lib/prisma"
import { Role } from "@/src/generated/prisma/enums"

// Prints company IDs + user IDs so they can be used in data/aydas-commissions.json
async function main() {
  const companies = await prisma.company.findMany({
    select: { id: true, name: true },
  })

  const users = await prisma.user.findMany({
    select: { id: true, firstname: true, lastname: true, role: true, companyId: true },
    orderBy: { createdAt: "asc" },
  })

  console.log("\n=== COMPANIES (companyId) ===")
  console.table(companies)

  console.log("\n=== USERS (driverId = id) ===")
  console.table(
    users.map((u) => ({
      id: u.id,
      name: `${u.firstname} ${u.lastname}`,
      role: u.role,
      companyId: u.companyId,
      isDriver: u.role === Role.TOW_TRUCK_DRIVER,
    }))
  )
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
