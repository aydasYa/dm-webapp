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
import { LayoutDashboard, Users, QrCode, FileText, User, LogOut, Euro } from "lucide-react"
import { signout } from "@/app/actions/auth"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

type Props = {
  role: "ADMIN" | "TOW_TRUCK_DRIVER"
  firstname: string
  lastname: string
}

export default function AppSidebar({ role, firstname, lastname }: Props) {
  const pathname = usePathname()

  // Menü-Einträge je nach Rolle
  const adminItems = [
    { title: "Übersicht", url: "/dashboard", icon: LayoutDashboard },
    { title: "Fahrer", url: "/dashboard/users", icon: Users },
    { title: "QR-Codes", url: "/dashboard/qrcodes", icon: QrCode },
    { title: "Alle Leads", url: "/dashboard/leads", icon: FileText },
    { title: "Profil", url: "/dashboard/profile", icon: User },
    { title: "Provisionen", url: "/dashboard/commissions", icon: Euro},
  ]

  const driverItems = [
    { title: "Profil", url: "/dashboard/profile", icon: User },
    { title: "Provisionen", url: "/dashboard", icon: Euro},
    { title: "QR-Code", url: "/dashboard/qrcode", icon: QrCode },
  ]

  const items = role === "ADMIN" ? adminItems : driverItems

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
          <p className="text-xs text-muted-foreground">{firstname} {lastname}</p>
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