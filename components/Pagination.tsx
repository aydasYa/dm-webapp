import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Pagination({
  page,
  totalPages,
  basePath,
  query = {},
}: {
  page: number
  totalPages: number
  basePath: string
  query?: Record<string, string | undefined> // bestehende Filter (preset, from, to, driver …) bleiben erhalten
}) {
  if (totalPages <= 1) return null

  // Baut den Link für eine Seite und behält dabei alle gesetzten Filter bei
  const hrefFor = (p: number) => {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(query)) {
      if (value) params.set(key, value)
    }
    params.set("page", String(p))
    return `${basePath}?${params.toString()}`
  }

  return (
    <div className="flex items-center justify-center gap-4 pt-2">
      {page > 1 ? (
        <Button asChild variant="outline" size="sm">
          <Link href={hrefFor(page - 1)} scroll={false}>Zurück</Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>Zurück</Button>
      )}

      <span className="text-sm text-muted-foreground">Seite {page} von {totalPages}</span>

      {page < totalPages ? (
        <Button asChild variant="outline" size="sm">
          <Link href={hrefFor(page + 1)} scroll={false}>Weiter</Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>Weiter</Button>
      )}
    </div>
  )
}
