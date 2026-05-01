// user features dashboard, contains each element the user (abschlepper/Tow-truck-drive
// can see and their possible interactions with the webapp
import LogoutButton from "./LogoutButton"

// Updated props for new user dashboard
type Props = {
  user: {
    // User (Abschlepper information)
    email: string
    firstname: string
    lastname: string
    phone: string | null
    role: string
    status: string
    qrCode: string | null

    // Company information
    companyName: string | null
    companyAddress: string | null
    companyCity: string | null
    companyPostcode: string | null
    companyPhone: string | null
    companyEmail: string | null
    companyContactPerson: string | null
  }
}

export default function UserFeatures({ user }: Props) {
    return (
        <main className="p-8">
            <h1 className="text-2xl font-semibold">Abschlepper Dashboard</h1>
            <p className="text-muted-foreground mt-1">
                Willkommen, <span className="font-semibold">
                {user.firstname} {user.lastname}
                </span>
            </p>

            <p className="text-sm text-muted-foreground mt-1">
                Status: {user.status}
            </p>
            <LogoutButton />
        </main>
    )
}