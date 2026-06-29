import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Pagination({
  page,
  totalPages,
  basePath,
}: {
  page: number
  totalPages: number
  basePath: string
}) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-4 pt-2">
      {page > 1 ? (
        <Button asChild variant="outline" size="sm">
          <Link href={`${basePath}?page=${page - 1}`}>Zurück</Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>Zurück</Button>
      )}

      <span className="text-sm text-muted-foreground">Seite {page} von {totalPages}</span>

      {page < totalPages ? (
        <Button asChild variant="outline" size="sm">
          <Link href={`${basePath}?page=${page + 1}`}>Weiter</Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>Weiter</Button>
      )}
    </div>
  )
}