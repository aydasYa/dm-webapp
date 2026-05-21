"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  Users,
  QrCode,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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

type SidebarProps = {
  isAdmin: boolean
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ isAdmin, collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()

  const filteredItems = navItems.filter((item) => !item.adminOnly || isAdmin)

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
            DM
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-foreground">
                Abschlepper
              </span>
              <span className="text-xs text-muted-foreground">
                DeinMotorschaden
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {filteredItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href.includes("?") && pathname === "/dashboard" && item.href.includes(pathname))

          const linkContent = (
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )

          if (collapsed) {
            return (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            )
          }

          return <div key={item.href}>{linkContent}</div>
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-sidebar-border p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className={cn("w-full", collapsed && "px-2")}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>Einklappen</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}
