"use client"

import type React from "react"

import { Search, Settings, Phone } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { ThemeToggle } from "@/components/theme-toggle"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center gap-2 font-semibold">
            <Link href="/" className="flex items-center gap-2">
              <Phone className="h-6 w-6" />
              <span className="hidden sm:inline-block">M-Pesa Analytics Dashboard</span>
            </Link>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-[200px] rounded-lg bg-background pl-8 md:w-[240px] lg:w-[320px]"
              />
            </div>
            <ThemeToggle />
            <Button variant="outline" size="icon" className="rounded-full" asChild>
              <Link href="/settings">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-[240px_1fr]">
        <div className="hidden border-r bg-muted/40 lg:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex-1 overflow-auto py-2">
              <SidebarNavigation />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
