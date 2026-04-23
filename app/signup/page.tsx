import { FormField } from "@/components/form/FormField";
import { signupFields } from "@/app/signup/fields";
import { signup } from "@/app/actions/auth";
import Link from "next/link"

export default function SignUp() {
    return (
        <div>
            <div>
                <h1>Registrieren</h1>
                <p>Erstelle deinen Account</p>
            </div>

            <form action={signup}>
            {signupFields.map((field) => (
                    <FormField field={field} key={field.id}/>
                ))}
                <button type='submit'>Registrieren</button>
            </form>

            <p>Konto vorhanden? <Link href="/login">Anmelden</Link></p>
        </div>
    )
}