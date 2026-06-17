import { setPassword } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const ERROR_MESSAGES: Record<string, string> = {
    password_too_short: "Das Passwort muss mindestens 8 Zeichen lang sein.",
    password_mismatch: "Die Passwörter stimmen nicht überein.",
    update_failed: "Passwort konnte nicht gesetzt werden. Bitte versuche es erneut.",
}

export default async function SetPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>
}) {
    const { error } = await searchParams
    const errorMessage = error ? (ERROR_MESSAGES[error] ?? "Ein Fehler ist aufgetreten.") : null

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Passwort festlegen</CardTitle>
                    <CardDescription>Lege dein Passwort fest, um dein Konto zu aktivieren</CardDescription>
                    {errorMessage && <p className="text-sm font-medium text-destructive">{errorMessage}</p>}
                </CardHeader>
                <form action={setPassword}>
                    <CardContent className="flex flex-col gap-6">
                        <FieldGroup>

                            {/* 👉 2 Felder: password + passwordConfirm */}
                            <Field>
                                <FieldLabel htmlFor="password">Passwort</FieldLabel>
                                <Input id="password" name="password" type="password" required minLength={8} />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="passwordConfirm">Passwort bestätigen</FieldLabel>
                                <Input id="passwordConfirm" name="passwordConfirm" type="password" required minLength={8} />
                            </Field>


                        </FieldGroup>
                        <Button type="submit" className="w-full">Passwort speichern</Button>
                    </CardContent>
                </form>
            </Card>
        </div>
    )
}