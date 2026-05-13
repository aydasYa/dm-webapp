// "use server" → diese Datei läuft nur auf dem Server, nie im Browser
// Formulare können Server Actions direkt als action={} aufrufen – kein API-Endpunkt nötig
"use server"

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// formData kommt direkt aus dem <form> – Next.js übergibt die Felder automatisch
export async function login(formData: FormData) {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
        email:    formData.get("email") as string,
        password: formData.get("password") as string,
    });

    // redirect() von Next.js bricht die Funktion sofort ab und leitet weiter
    if (error) redirect("login?error=invalid_credentials")
    redirect("/dashboard");
}