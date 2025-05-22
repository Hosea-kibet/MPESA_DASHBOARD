import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PaymentTrendChart } from "@/components/payment-trend-chart"
import { PaymentChannelDistribution } from "@/components/payment-channel-distribution"
import { PaymentSuccessRateChart } from "@/components/payment-success-rate-chart"
import { DailyTransactionsChart } from "@/components/daily-transactions-chart"
import { generateDummyData } from "@/lib/generate-data"

export default function AnalyticsPage() {
  const data = generateDummyData()

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold">Analytics</h1>
      <div className="grid gap-4 mt-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-2 md:col-span-1">
            <CardHeader>
              <CardTitle>Payment Trends</CardTitle>
              <CardDescription>Transaction volume over time</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <PaymentTrendChart data={data.paymentTrends} />
            </CardContent>
          </Card>
          <Card className="col-span-2 md:col-span-1">
            <CardHeader>
              <CardTitle>Channel Distribution</CardTitle>
              <CardDescription>Breakdown by payment method</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentChannelDistribution data={data.channelDistribution} />
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Success Rate Analysis</CardTitle>
              <CardDescription>Payment success rate by channel</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentSuccessRateChart data={data.paymentSuccessRate} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Daily Transaction Patterns</CardTitle>
              <CardDescription>Hourly transaction distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <DailyTransactionsChart data={data.dailyTransactions} />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
