"use client"

import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import AppSidebar from "@/components/AppSidebar"

type Props = {
    role: "ADMIN" | "TOW_TRUCK_DRIVER" | "SUPER_ADMIN"
    firstname: string
    lastname: string
    children: React.ReactNode
}

export default function DashboardShell({ role, firstname, lastname, children }: Props) {
    return (
        <SidebarProvider>
            <AppSidebar role={role} firstname={firstname} lastname={lastname} />
            <SidebarInset>
                <header className="flex h-14 items-center gap-2 border-b px-4">
                    <SidebarTrigger />
                </header>
                <main className="flex-1 p-6">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    )
}