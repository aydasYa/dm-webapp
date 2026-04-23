import Link from "next/link"

export default function SignupSuccessPage() {
    return (
        <div>
            <h1>Bitte bestätige deine E-Mail</h1>
            <p>
                Wir haben dir einen Bestätigungslink geschickt. Klicke auf den Link
                in deiner E-Mail, um deine Registrierung abzuschließen.
            </p>
            <p>Nahc der Bestätigung muss dein Konto noch von einem Admin freigegeben werden.</p>
            <Link href="/login">Zurück zum Login</Link>
        </div>
    )
}