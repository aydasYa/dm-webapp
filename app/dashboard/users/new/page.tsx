import { createDriver } from "@/app/actions/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewDriver() {
    return (
        <div className="space-y-6 max-w-xl">
            <h1 className="text-2xl font-bold">Fahrer anlegen</h1>
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Fahrer-Daten</CardTitle>
                    <CardDescription>Der Fahrer bekommt einen Einladungslink per E-Mail</CardDescription>
                </CardHeader>
                <form action={createDriver}>
                    <CardContent className="flex flex-col gap-6">
                        <FieldGroup>

                            {/* 👉 3 Felder hier: firstname, lastname, email */}
                            <Field>
                                <FieldLabel htmlFor="firstname">Vorname</FieldLabel>
                                <Input id="firstname" name="firstname" type="text" required />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="lastname">Nachname</FieldLabel>
                                <Input id="lastname" name="lastname" type="text" required />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="email">E-Mail</FieldLabel>
                                <Input id="email" name="email" type="email" required />
                            </Field>
                        </FieldGroup>
                        <div className="flex gap-3">
                            <Button asChild variant="outline" className="flex-1">
                                <Link href="/dashboard/users">Abbrechen</Link>
                            </Button>
                            <Button type="submit" className="flex-1">Einladung senden</Button>
                        </div>
                    </CardContent>
                </form>
            </Card>
        </div>
    )
}