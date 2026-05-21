"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  Users,
  QrCode,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

type NavItem = {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  adminOnly?: boolean
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Leads", href: "/leads", icon: FileText },
  { label: "QR-Codes", href: "/dashboard?tab=qrcodes", icon: QrCode, adminOnly: true },
  { label: "Nutzer", href: "/dashboard?tab=users", icon: Users, adminOnly: true },
]

type MobileSidebarProps = {
  isAdmin: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileSidebar({ isAdmin, open, onOpenChange }: MobileSidebarProps) {
  const pathname = usePathname()
  const filteredItems = navItems.filter((item) => !item.adminOnly || isAdmin)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="flex h-16 flex-row items-center justify-between border-b border-border px-4">
          <SheetTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm">
              DM
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Abschlepper</span>
              <span className="text-xs text-muted-foreground font-normal">DeinMotorschaden</span>
            </div>
          </SheetTitle>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="h-5 w-5" />
            <span className="sr-only">Schliessen</span>
          </Button>
        </SheetHeader>

        <nav className="flex-1 space-y-1 p-2">
          {filteredItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href.includes("?") && pathname === "/dashboard")

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
