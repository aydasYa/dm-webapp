import Link from "next/link"
import { FormField } from "@/components/form/FormField"
import { signupFields } from "@/app/signup/fields"
import { signup } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Building2, User } from "lucide-react"

export default function SignUpPage() {
  const personalFields = signupFields.filter((f) => f.group === "personal")
  const companyFields = signupFields.filter((f) => f.group === "company")

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-3xl p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm">
              DM
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Abschlepper Dashboard</span>
              <span className="text-xs text-muted-foreground">von DeinMotorschaden</span>
            </div>
          </Link>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/login">Login</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Registrieren</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Account erstellen</CardTitle>
            <CardDescription>
              Registriere dich, um Leads zu erfassen und dein Dashboard zu nutzen.
            </CardDescription>
          </CardHeader>

          <form action={signup}>
            <CardContent className="flex flex-col gap-8">
              {/* Personal Data Section */}
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold">Persönliche Daten</h2>
                </div>
                <FieldGroup>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {personalFields.map((field) => (
                      <div
                        key={field.id}
                        className={
                          field.id === "email" || field.id === "password"
                            ? "sm:col-span-1"
                            : ""
                        }
                      >
                        <FormField field={field} />
                      </div>
                    ))}
                  </div>
                </FieldGroup>
              </div>

              {/* Company Data Section */}
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold">Firmendaten</h2>
                </div>
                <FieldGroup>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {companyFields.map((field) => (
                      <div
                        key={field.id}
                        className={field.id === "companyName" ? "sm:col-span-2" : ""}
                      >
                        <FormField field={field} />
                      </div>
                    ))}
                  </div>
                </FieldGroup>
              </div>

              {/* Submit Button */}
              <Button type="submit" size="lg" className="w-full">
                Account erstellen
              </Button>

              {/* Login Link */}
              <p className="text-center text-sm text-muted-foreground">
                Bereits registriert?{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  Jetzt anmelden
                </Link>
              </p>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  )
}
