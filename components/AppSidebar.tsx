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
} from "@/components/ui/sidebar"
import { LayoutDashboard, Users, QrCode, User, LogOut, Euro, Building2 } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { QRCodeSVG } from "qrcode.react"
import { signout } from "@/app/actions/account"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Role } from "@/src/generated/prisma/enums"


type Props = {
  role: Role
  firstname: string
  lastname: string
  qrCode: string | null
}

export default function AppSidebar({ role, firstname, lastname, qrCode }: Props) {
  const pathname = usePathname()
  const initials = `${firstname?.[0] ?? ""}${lastname?.[0] ?? ""}`.toUpperCase()

  // Menü-Einträge je nach Rolle
  const superAdminItems = [
    { title: "Übersicht", url: "/dashboard", icon: LayoutDashboard },
    { title: "Unternehmen", url: "/dashboard/companies", icon: Building2 },
    { title: "Profil", url: "/dashboard/profile", icon: User },
  ]

const adminItems = [
  { title: "Übersicht", url: "/dashboard", icon: LayoutDashboard },
  { title: "Fahrer", url: "/dashboard/users", icon: Users },
  { title: "QR-Codes", url: "/dashboard/qrcodes", icon: QrCode },
  { title: "Profil", url: "/dashboard/profile", icon: User },
  { title: "Provisionen", url: "/dashboard/commissions", icon: Euro },
]

const driverItems = [
  { title: "Profil", url: "/dashboard/profile", icon: User },
  { title: "Provisionen", url: "/dashboard", icon: Euro },
  { title: "QR-Code", url: "/dashboard/qrcode", icon: QrCode },
]

  const items = role === Role.ADMIN ? adminItems : role === Role.SUPER_ADMIN ? superAdminItems : driverItems

return (
  <Sidebar>
    <SidebarHeader>
      <div className="flex flex-col items-center gap-1 px-2 py-3">
        <Link href="/dashboard">
          <Image
            src="/logo.png"
            alt="DeinMotorschaden Logo"
            width={160}
            height={48}
            className="h-10 w-auto object-contain"
          />
        </Link>
      </div>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
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
        <SidebarGroup>
          <SidebarGroupLabel className="justify-center">Mein QR-Code</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="flex flex-col items-center gap-2 px-2 py-2">
              <div className="rounded-lg border bg-white p-2">
                <QRCodeSVG value={qrCode} size={120} />
              </div>
              <a href={qrCode} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground underline-offset-2 hover:underline">
                Link öffnen
              </a>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      )}
      <div className="flex items-center gap-2 px-2 py-1.5">
        <Avatar size="sm">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className="truncate text-sm font-medium">{firstname} {lastname}</span>
      </div>
      <form action={signout}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton type="submit">
              <LogOut />
              <span>Abmelden</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </form>
    </SidebarFooter>
  </Sidebar>
)
}