// user features dashboard, contains each element the user (abschlepper/Tow-truck-drive
// can see and their possible interactions with the webapp
import LogoutButton from "./LogoutButton"
import { QRCodeSVG } from "qrcode.react"

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
    const hasCompanyData = !!(
        user.companyName ||
        user.companyAddress ||
        user.companyCity ||
        user.companyPostcode ||
        user.companyPhone ||
        user.companyEmail ||
        user.companyContactPerson 
    )

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
            <h2 className="font-semibold">Persönliche Daten</h2>
            <p>Email: {user.email}</p>
            <p>Telefonnummer: {user.phone ?? "Nicht angegeben"}</p>

            <h2 className="font-semibold">Firmendaten</h2>
            {hasCompanyData ? (
            <>
                {user.companyName && <p>Name: {user.companyName}</p>}
                {user.companyAddress && <p>Adresse: {user.companyAddress}</p>}
                {user.companyCity && <p>Ort: {user.companyCity}</p>}
                {user.companyPostcode && <p>PLZ: {user.companyPostcode}</p>}
                {user.companyPhone && <p>Telefonnummer: {user.companyPhone}</p>}
                {user.companyEmail && <p>Email: {user.companyEmail}</p>}
                {user.companyContactPerson && <p>Kontaktperson: {user.companyContactPerson}</p>}
                
            </>
            ) : (
                <p>Keine Firmendaten hinterlegt</p>
            )}
            <h2 className="font-semibold">Mein QR-Code</h2>
              {user.qrCode ? (
                <>
                <div className="p-4 border border-border rounded-lg inline-block bg-white">
                <QRCodeSVG value={user.qrCode} size={180} />
                </div>
                <p className="text-xs text-muted-foreground">{user.qrCode}</p>
                </>
              ) : (
                <p>Wartet auf Generierung</p>
              )}
            <LogoutButton />
        </main>
    )
}