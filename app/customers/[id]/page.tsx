import { Suspense } from "react"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PaymentForm } from "@/components/payment-form"
import { PaymentHistory } from "@/components/payment-history"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, User } from "lucide-react"
import Link from "next/link"
import { CustomerDetailSkeleton } from "@/components/skeletons/customer-detail-skeleton"
import { PaymentHistorySkeleton } from "@/components/skeletons/payment-history-skeleton"

// Server component to fetch customer data
async function getCustomerData(id: string) {
  const customer = await prisma.customer.findUnique({
    where: { id },
  })

  if (!customer) {
    return null
  }

  // Get customer stats
  const transactionCount = await prisma.transaction.count({
    where: { customerId: customer.id },
  })

  const totalSpent = await prisma.transaction.aggregate({
    where: {
      customerId: customer.id,
      status: "completed",
    },
    _sum: { amount: true },
  })

  // Get preferred channel
  const channelStats = await prisma.transaction.groupBy({
    by: ["channelId"],
    where: { customerId: customer.id },
    _count: true,
    orderBy: { _count: "desc" },
    take: 1,
  })

  let preferredChannel = "None"

  if (channelStats.length > 0) {
    const channel = await prisma.paymentChannel.findUnique({
      where: { id: channelStats[0].channelId },
    })
    preferredChannel = channel?.name || "None"
  }

  return {
    customer,
    stats: {
      transactionCount,
      totalSpent: totalSpent._sum.amount || 0,
      preferredChannel,
      customerSince: customer.createdAt,
    },
  }
}

export default async function CustomerPage({ params }: { params: { id: string } }) {
  const data = await getCustomerData(params.id)

  if (!data) {
    notFound()
  }

  const { customer, stats } = data

  return (
    <DashboardLayout>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/customers">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Customer Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <Suspense fallback={<CustomerDetailSkeleton />}>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle>{customer.name}</CardTitle>
                <CardDescription>{customer.phone}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">KSh {stats.totalSpent.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transactions</p>
                  <p className="text-2xl font-bold">{stats.transactionCount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Preferred Channel</p>
                  <p className="text-lg font-medium">{stats.preferredChannel}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Customer Since</p>
                  <p className="text-lg font-medium">{new Date(stats.customerSince).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Suspense>

        <PaymentForm customerId={customer.id} customerName={customer.name} customerPhone={customer.phone} />
      </div>

      <Suspense fallback={<PaymentHistorySkeleton />}>
        <PaymentHistory customerId={customer.id} />
      </Suspense>
    </DashboardLayout>
  )
}
