"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutDashboard, Users, QrCode, User, LogOut, Euro, Building2, ChevronsUpDown } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { QRCodeSVG } from "qrcode.react"
import { signout } from "@/app/actions/account"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Role } from "@/src/generated/prisma/enums"
import { ThemeToggle } from "@/components/theme-toggle"


type Props = {
  role: Role
  firstname: string
  lastname: string
  qrCode: string | null
  companyName: string | null
}

export default function AppSidebar({ role, firstname, lastname, qrCode, companyName }: Props) {
  const pathname = usePathname()
  const initials = `${firstname?.[0] ?? ""}${lastname?.[0] ?? ""}`.toUpperCase()

  // Menü-Einträge je nach Rolle
  // Profil ist bewusst NICHT hier — es steckt im Profil-Dropdown unten
  const superAdminItems = [
    { title: "Übersicht", url: "/dashboard", icon: LayoutDashboard },
    { title: "Unternehmen", url: "/dashboard/companies", icon: Building2 },
  ]

  const adminItems = [
    { title: "Übersicht", url: "/dashboard", icon: LayoutDashboard },
    { title: "Fahrer", url: "/dashboard/users", icon: Users },
    { title: "QR-Codes", url: "/dashboard/qrcodes", icon: QrCode },
    { title: "Provisionen", url: "/dashboard/commissions", icon: Euro },
  ]

  const driverItems = [
    { title: "Provisionen", url: "/dashboard", icon: Euro },
    { title: "QR-Code", url: "/dashboard/qrcode", icon: QrCode },
  ]

  const items = role === Role.ADMIN ? adminItems : role === Role.SUPER_ADMIN ? superAdminItems : driverItems

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex justify-end px-1 pt-1">
          <SidebarTrigger />
        </div>
        <div className="flex flex-col items-center gap-1 px-2 pb-3 group-data-[collapsible=icon]:hidden">
          <Link href="/dashboard">
            <Image
              src="/logo.png"
              alt="DeinMotorschaden Logo"
              width={160}
              height={48}
              className="h-10 w-auto object-contain"
            />
          </Link>
          <span className="text-xs font-medium text-muted-foreground">
            Partner Network
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={item.url === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.url)}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {qrCode && (
          <div className="mx-2 mb-2 rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-3 group-data-[collapsible=icon]:hidden">
            <div className="flex flex-col items-center gap-2 text-center">
              <div>
                <p className="text-sm font-semibold">Mein QR-Code</p>
                <p className="text-xs text-muted-foreground">
                  Scannen lassen und Provision verdienen.
                </p>
              </div>
              <div className="rounded-lg border bg-white p-2">
                <QRCodeSVG value={qrCode} size={120} />
              </div>
              <a
                href={qrCode}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary underline-offset-2 hover:underline"
              >
                Link öffnen
              </a>
            </div>
          </div>
        )}
        <div className="flex items-center gap-1 px-1 pb-1 group-data-[collapsible=icon]:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring">
                <Avatar size="sm">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium">{firstname} {lastname}</span>
                  {companyName && (
                    <span className="truncate text-xs text-muted-foreground">{companyName}</span>
                  )}
                </div>
                <ChevronsUpDown className="ml-auto size-4 shrink-0 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-56">
              <DropdownMenuLabel className="truncate">{firstname} {lastname}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">
                  <User />
                  Profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <form action={signout}>
                <DropdownMenuItem asChild>
                  <button type="submit" className="w-full">
                    <LogOut />
                    Abmelden
                  </button>
                </DropdownMenuItem>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
