import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export default async function Home() {
    const supabase = await createClient()
    const { data } = await supabase.auth.getClaims()

    if (data?.claims) redirect("/dashboard")
    // Wenn keiner eingeloggt ist -> zum Login
    redirect("/login")
}