import LogoutButton from '@/components/LogoutButton'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Role, UserStatus } from '@/src/generated/prisma/enums'
import AdminFeatures from '@/components/AdminFeatures'
import UserFeatures from '@/components/UserFeatures'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { supabaseId: data.claims.sub },
    select: { 
      role: true, 
      firstname: true, 
      lastname: true, 
      status: true,
      email: true,
      phone: true,
      qrCode: true,
      companyName: true,
      companyAddress: true,
      companyPostcode: true,
      companyCity: true,
      companyPhone: true,
      companyEmail: true,
      companyContactPerson: true,
    },
  })

  if (!user) redirect('/login')

  // STATUS-GATE: nur ACTIVE darf rein
  if (user.status === UserStatus.PENDING) {
    return (
      <main>
        <h1>Konto wartet auf Freigabe</h1>
        <p>Hallo {user.firstname}, dein Konto wurde erfolgreich registriert und deine E-Mail bestätigt.</p>
        <p>Ein Admin muss dein Konto noch freigeben, bevor du die App nutzen kannst.</p>
        <LogoutButton />
      </main>
    )
  }

  if (user.status === UserStatus.REJECTED) {
    return (
      <main>
        <h1>Registrierung abgelehnt</h1>
        <p>Leider wurde deine Registrierung abgelehnt.</p>
        <LogoutButton />
      </main>
    )
  }

  // Ab hier: status === ACTIVE
  const drivers = await prisma.user.findMany({
    where: {
      role: Role.TOW_TRUCK_DRIVER,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      qrCode: true,
      companyName: true,
    },
  })

  // PendingUsers
  const pendingUsers = user.role === Role.ADMIN
    ? await prisma.user.findMany({
      where: { status: UserStatus.PENDING },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        companyName: true,
        createdAt: true, 
      },
      orderBy: { createdAt: 'desc' },
    })
  : []
  
    // alle leads holen
    const allLeads = user.role === Role.ADMIN
      ? await prisma.lead.findMany({
          where: { deletedAt: null },
          select: {
            id: true,
            customerLastName: true,
            vehicleMake: true,
            vehicleModel: true,
            breakdownAddress: true,
            status: true,
            createdAt: true,
            towTruckDriver: {
              select: { firstname: true, lastname: true, companyName: true }
            },
          },
          orderBy: { createdAt: 'desc' },
      }) : []

    console.log(allLeads);

  // whoever is logged in, render their dashboard (User vs Admin - Dashbaords)
  if ( user.role === Role.ADMIN ) {
    return <AdminFeatures 
      user={  user } 
      drivers={ drivers } 
      pendingUsers={ pendingUsers }
      allLeads={ allLeads }
    />
    }

  return <UserFeatures user={ user }/>
}