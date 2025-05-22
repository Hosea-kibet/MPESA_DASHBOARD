"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart,
  Calendar,
  CreditCard,
  DollarSign,
  LayoutDashboard,
  Moon,
  Phone,
  Settings,
  Store,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const routes = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    title: "Transactions",
    href: "/transactions",
    icon: CreditCard,
  },
  {
    title: "Payment Channels",
    href: "/payment-channels",
    icon: Store,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: Calendar,
  },
  {
    title: "Initiate Payment",
    href: "/payments/new",
    icon: DollarSign,
  },
  {
    title: "M-Pesa Settings",
    href: "/admin/mpesa-settings",
    icon: Phone,
  },
  {
    title: "Theme Settings",
    href: "/settings/theme",
    icon: Moon,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function SidebarNavigation() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start px-2 text-sm font-medium">
      {routes.map((route) => (
        <Button
          key={route.href}
          variant={pathname === route.href ? "secondary" : "ghost"}
          className={cn("flex justify-start gap-2", pathname === route.href ? "bg-muted hover:bg-muted" : "")}
          asChild
        >
          <Link href={route.href}>
            <route.icon className="h-4 w-4" />
            {route.title}
          </Link>
        </Button>
      ))}
    </nav>
  )
}
