import { prisma } from "@/lib/db"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionsTable } from "@/components/transactions-table"

export default async function TransactionsPage() {
  const transactions = await prisma.transaction.findMany({
    include: {
      customer: true,
      channel: true,
    },
    orderBy: {
      transactionDate: "desc",
    },
    take: 100,
  })

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold">Transactions</h1>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View all M-Pesa transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionsTable transactions={transactions} />
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
