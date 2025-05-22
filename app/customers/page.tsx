import { Suspense } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CustomerList } from "@/components/customer-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Plus } from "lucide-react"
import { CustomerListSkeleton } from "@/components/skeletons/customer-list-skeleton"

// This is a Server Component that fetches data
async function getCustomers() {
  try {
    // Dynamically import prisma to avoid issues during build time
    const { prisma } = await import("@/lib/db")

    // Use Next.js's cache behavior for this fetch
    const customers = await prisma.customer.findMany({
      orderBy: { name: "asc" },
    })

    return customers
  } catch (error) {
    console.error("Error fetching customers:", error)
    return []
  }
}

export default async function CustomersPage() {
  // Fetch data on the server
  const initialCustomers = await getCustomers()

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Button asChild>
          <Link href="/customers/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Link>
        </Button>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Customer Management</CardTitle>
          <CardDescription>View and manage your customers</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<CustomerListSkeleton />}>
            <CustomerList initialCustomers={initialCustomers} />
          </Suspense>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
