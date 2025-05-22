import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/db"

export default async function PaymentChannelsPage() {
  const channels = await prisma.paymentChannel.findMany()

  const channelStats = await Promise.all(
    channels.map(async (channel) => {
      const count = await prisma.transaction.count({
        where: { channelId: channel.id },
      })

      const total = await prisma.transaction.aggregate({
        where: {
          channelId: channel.id,
          status: "completed",
        },
        _sum: { amount: true },
      })

      return {
        ...channel,
        transactionCount: count,
        totalAmount: total._sum.amount || 0,
      }
    }),
  )

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold">Payment Channels</h1>
      <div className="grid gap-4 mt-6 md:grid-cols-3">
        {channelStats.map((channel) => (
          <Card key={channel.id}>
            <CardHeader>
              <CardTitle>{channel.name}</CardTitle>
              <CardDescription>{channel.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Transactions:</span>
                  <span className="font-medium">{channel.transactionCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat("en-KE", {
                      style: "currency",
                      currency: "KES",
                    }).format(Number(channel.totalAmount))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  )
}
