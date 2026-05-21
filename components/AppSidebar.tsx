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
import { LayoutDashboard, Users, QrCode, FileText, User, LogOut } from "lucide-react"
import { signout } from "@/app/actions/auth"
import Link from "next/link"
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
    { title: "Freigaben", url: "/dashboard/users", icon: Users },
    { title: "QR-Codes", url: "/dashboard/qrcodes", icon: QrCode },
    { title: "Alle Leads", url: "/dashboard/leads", icon: FileText },
    { title: "Profil", url: "/dashboard/profile", icon: User },
  ]

  const driverItems = [
    { title: "Übersicht", url: "/dashboard", icon: LayoutDashboard },
    { title: "Meine Leads", url: "/dashboard/leads", icon: FileText },
    { title: "Profil", url: "/dashboard/profile", icon: User },
  ]

  const items = role === "ADMIN" ? adminItems : driverItems

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-2">
          <p className="font-semibold">DM-WebApp</p>
          <p className="text-xs text-muted-foreground">
            {firstname} {lastname}
          </p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
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