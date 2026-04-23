// import { createClient } from '@/lib/supabase/server' 
// import prisma from '@/lib/prisma'
// import { redirect } from 'next/navigation'
// import { Role } from '@/src/generated/prisma/enums'
// import AdminFeatures from '@/app/components/AdminFeatures'
// import UserFeatures from '@/app/components/UserFeatures'

// export const dynamic = 'force-dynamic'

// export default async function DashboardPage() {
// 	// 1. Check Supabase session
// 	const supabase = await createClient()
// 	const { data } = await supabase.auth.getClaims()
// 	if (!data?.claims) redirect('/login')

// 	// 2. Eingeloggten User holen
// 	const user = await prisma.user.findUnique({
// 		where:  { supabaseId: data.claims.sub },
// 		select: { role: true, firstname: true, lastname: true, status: true }
// 	})

// 	if (!user) {
// 		redirect('/login')
// 	}

// 	// 3. Alle fahrer aus der Datenbank holen
// 	const drivers = await prisma.user.findMany({
// 		where: { role: Role.TOW_TRUCK_DRIVER },
// 		select: { id: true, firstname: true, lastname: true }
// 	});

// 	// 4. Rolle prüfen und richtige Component rendern
// 	if (user.role === Role.ADMIN) {
// 		return <AdminFeatures firstname={ user.firstname } lastname={ user.lastname } drivers={drivers} />
// 	}
	
// 	// else -> User (Abschlepper/tow-truck-driver)
// 	return (
// 		<UserFeatures 
// 		firstname={ user.firstname }
// 		lastname={ user.lastname } 
// 		status={ user.status } 
// 		/>
// 	)
// }

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Role, UserStatus } from '@/src/generated/prisma/enums'
import AdminFeatures from '@/app/components/AdminFeatures'
import UserFeatures from '@/app/components/UserFeatures'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { supabaseId: data.claims.sub },
    select: { role: true, firstname: true, lastname: true, status: true },
  })

  if (!user) redirect('/login')

  // STATUS-GATE: nur ACTIVE darf rein
  if (user.status === UserStatus.PENDING) {
    return (
      <main>
        <h1>Konto wartet auf Freigabe</h1>
        <p>Hallo {user.firstname}, dein Konto wurde erfolgreich registriert und deine E-Mail bestätigt.</p>
        <p>Ein Admin muss dein Konto noch freigeben, bevor du die App nutzen kannst.</p>
      </main>
    )
  }

  if (user.status === UserStatus.REJECTED) {
    return (
      <main>
        <h1>Registrierung abgelehnt</h1>
        <p>Leider wurde deine Registrierung abgelehnt.</p>
      </main>
    )
  }

  // Ab hier: status === ACTIVE
  const drivers = await prisma.user.findMany({
    where: { role: Role.TOW_TRUCK_DRIVER },
    select: { id: true, firstname: true, lastname: true },
  })

  if (user.role === Role.ADMIN) {
    return <AdminFeatures firstname={user.firstname} lastname={user.lastname} drivers={drivers} />
  }

  return (
    <UserFeatures
      firstname={user.firstname}
      lastname={user.lastname}
      status={user.status}
    />
  )
}