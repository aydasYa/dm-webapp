"use server"

export default function createLead(formData: FormData) {
    // 1. Daten aus dem Form lesen
    const x = formData.get("Feldname") as string
}