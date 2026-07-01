"use client"

import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import AppSidebar from "@/components/AppSidebar"
import { Role } from "@/src/generated/prisma/enums"

type Props = {
    role: Role
    firstname: string
    lastname: string
    qrCode: string | null
    companyName: string | null
    children: React.ReactNode
}

export default function DashboardShell({ role, firstname, lastname, qrCode, companyName, children }: Props) {
    return (
        <SidebarProvider>
            <AppSidebar role={role} firstname={firstname} lastname={lastname} qrCode={qrCode} companyName={companyName} />
            <SidebarInset>
                <header className="flex h-14 items-center gap-2 border-b px-4">
                    <SidebarTrigger />
                </header>
                <main className="flex-1 p-6">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    )
}