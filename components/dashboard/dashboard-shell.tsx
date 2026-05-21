"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { MobileSidebar } from "./mobile-sidebar"
import { Header } from "./header"
import { TooltipProvider } from "@/components/ui/tooltip"

type DashboardShellProps = {
  children: React.ReactNode
  user: {
    firstname: string
    lastname: string
    email: string
    role: string
  }
  pendingCount?: number
}

export function DashboardShell({ children, user, pendingCount = 0 }: DashboardShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  
  const isAdmin = user.role === "ADMIN"

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Desktop Sidebar */}
        <Sidebar
          isAdmin={isAdmin}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Mobile Sidebar */}
        <MobileSidebar
          isAdmin={isAdmin}
          open={mobileOpen}
          onOpenChange={setMobileOpen}
        />

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header
            user={user}
            onMenuClick={() => setMobileOpen(true)}
            pendingCount={pendingCount}
          />
          <main className="flex-1 overflow-y-auto bg-muted/30 p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}
