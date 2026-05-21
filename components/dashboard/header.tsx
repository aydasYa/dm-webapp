"use client"

import { Menu, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { signout } from "@/app/actions/auth"

type HeaderProps = {
  user: {
    firstname: string
    lastname: string
    email: string
    role: string
  }
  onMenuClick: () => void
  pendingCount?: number
}

export function Header({ user, onMenuClick, pendingCount = 0 }: HeaderProps) {
  const initials = `${user.firstname.charAt(0)}${user.lastname.charAt(0)}`.toUpperCase()
  const isAdmin = user.role === "ADMIN"

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 md:px-6">
      {/* Left: Menu button (mobile) */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>

        <div className="hidden md:block">
          <h1 className="text-lg font-semibold">
            {isAdmin ? "Admin Dashboard" : "Abschlepper Dashboard"}
          </h1>
        </div>
      </div>

      {/* Right: Notifications + User menu */}
      <div className="flex items-center gap-2">
        {/* Notifications (Admin only) */}
        {isAdmin && pendingCount > 0 && (
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/dashboard?tab=users">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-medium text-destructive-foreground">
                {pendingCount > 9 ? "9+" : pendingCount}
              </span>
              <span className="sr-only">{pendingCount} ausstehende Freigaben</span>
            </Link>
          </Button>
        )}

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">
                  {user.firstname} {user.lastname}
                </p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile/edit">Profil bearbeiten</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <form action={signout} className="w-full">
                <button type="submit" className="w-full text-left text-destructive">
                  Abmelden
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
