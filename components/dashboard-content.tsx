"use client"

import { useEffect, useRef } from "react"
import { CreditCard, DollarSign, Download, Phone, PieChart, ShoppingCart, Store, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransactionList } from "@/components/transaction-list"
import { PaymentChannelDistribution } from "@/components/payment-channel-distribution"
import { PaymentTrendChart } from "@/components/payment-trend-chart"
import { PaymentSuccessRateChart } from "@/components/payment-success-rate-chart"
import { RevenueByChannelChart } from "@/components/revenue-by-channel-chart"
import useStore from "@/lib/store"
import { generateDummyData } from "@/lib/generate-data"

interface DashboardContentProps {
  initialData: {
    totalRevenue: number
    totalCustomers: number
    totalTransactions: number
    successRate: number
    recentTransactions: any[]
    channelDistribution: any[]
  }
}

export function DashboardContent({ initialData }: DashboardContentProps) {
  // For charts that don't have real data yet, we'll use dummy data
  const dummyData = generateDummyData()

  // Use a ref to track if we've already initialized the data
  const initialized = useRef(false)

  // Get the store without destructuring to avoid re-renders
  const store = useStore()

  // Initialize store with server data only once
  useEffect(() => {
    // Only set the data if we haven't already done so
    if (!initialized.current && initialData.recentTransactions) {
      initialized.current = true

      // Use the raw transactions directly in the component
      // instead of trying to update the store
    }
  }, [initialData]) // Only depend on initialData

  return (
    <>
      <div className="flex items-center gap-4">
        <h1 className="font-semibold text-lg md:text-2xl">M-Pesa Payment Dashboard</h1>
        <Button variant="outline" size="sm" className="ml-auto gap-1">
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline-block">Export</span>
        </Button>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="channels">Payment Channels</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">KSh {initialData.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+{dummyData.revenueIncrease}% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{initialData.totalCustomers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+{dummyData.customerIncrease}% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{initialData.totalTransactions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+{dummyData.transactionIncrease}% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{initialData.successRate}%</div>
                <p className="text-xs text-muted-foreground">+{dummyData.successRateIncrease}% from last month</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Payment Trends</CardTitle>
                <CardDescription>Daily transaction volume over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <PaymentTrendChart data={dummyData.paymentTrends} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Payment Channel Distribution</CardTitle>
                <CardDescription>Breakdown by payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentChannelDistribution data={initialData.channelDistribution} />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest M-Pesa transactions across all channels</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Use initialData directly instead of store state */}
                <TransactionList transactions={initialData.recentTransactions} />
              </CardContent>
            </Card>
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue by Channel</CardTitle>
                <CardDescription>Comparison of revenue across different M-Pesa channels</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <RevenueByChannelChart data={dummyData.revenueByChannel} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Overview</CardTitle>
              <CardDescription>Manage and view customer information and payment history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <Button asChild>
                  <a href="/customers">View All Customers</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="channels" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Till Payments</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">KSh {dummyData.tillPayments.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{dummyData.tillPercentage}% of total revenue</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paybill Payments</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">KSh {dummyData.paybillPayments.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{dummyData.paybillPercentage}% of total revenue</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">USSD Payments</CardTitle>
                <Phone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">KSh {dummyData.ussdPayments.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{dummyData.ussdPercentage}% of total revenue</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Channel Performance Comparison</CardTitle>
                <CardDescription>Transaction volume and success rate by channel</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <RevenueByChannelChart data={dummyData.revenueByChannel} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Payment Trends</CardTitle>
                <CardDescription>Transaction volume over time</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <PaymentTrendChart data={dummyData.paymentTrends} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Success Rate Analysis</CardTitle>
                <CardDescription>Payment success rate by channel</CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentSuccessRateChart data={dummyData.paymentSuccessRate} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}
