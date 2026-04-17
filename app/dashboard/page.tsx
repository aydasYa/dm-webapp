import { createClient } from '@/lib/supabase/server' 
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Role } from '@/src/generated/prisma/enums'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  // 1. Check Supabase session
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect('/login')

  // 2. Fetch your Prisma user by supabaseId
  const user = await prisma.user.findUnique({
    where:  { supabaseId: data.claims.sub },
    select: { role: true, firstname: true, lastname: true, status: true }
  })

  if (!user) redirect('/login')

  // 3. Render based on role
  if (user.role === Role.ADMIN) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <p className="text-muted-foreground mt-1">
          Willkommen, {user.firstname} {user.lastname}
        </p>
      </main>
    )
  }

  // TOW_TRUCK_DRIVER
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Abschlepper Dashboard</h1>
      <p className="text-muted-foreground mt-1">
        Willkommen, {user.firstname} {user.lastname}
      </p>
      <p className="text-sm text-muted-foreground mt-1">
        Status: {user.status}
      </p>
    </main>
  )
}