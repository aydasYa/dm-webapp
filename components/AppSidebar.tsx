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
import { signout } from "@/app/actions/auth"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

type Props = {
  role: "ADMIN" | "TOW_TRUCK_DRIVER" | "SUPER_ADMIN"
  firstname: string
  lastname: string
}

export default function AppSidebar({ role, firstname, lastname }: Props) {
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

const items = role === "ADMIN" ? adminItems : role === "SUPER_ADMIN" ? superAdminItems : driverItems

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