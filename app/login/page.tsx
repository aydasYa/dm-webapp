import Link from "next/link"
import Image from "next/image"
import { LoginForm } from "@/components/login-form"
import { Card, CardContent } from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <Link href="/" className="flex items-center justify-center self-center">
          <Image
            src="/logo.png"
            alt="DeinMotorschaden Logo"
            width={280}
            height={84}
            priority
            className="h-28 w-auto object-contain"
          />
        </Link>
        <Card>
          <CardContent className="pt-6">
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}