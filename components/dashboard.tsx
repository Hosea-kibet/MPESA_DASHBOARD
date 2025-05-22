"use client"

import { useState } from "react"
import {
  BarChart,
  Calendar,
  CreditCard,
  DollarSign,
  Download,
  LayoutDashboard,
  Phone,
  PieChart,
  Search,
  Settings,
  ShoppingCart,
  Store,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomerTable } from "@/components/customer-table"
import { TransactionList } from "@/components/transaction-list"
import { PaymentChannelDistribution } from "@/components/payment-channel-distribution"
import { PaymentTrendChart } from "@/components/payment-trend-chart"
import { PaymentSuccessRateChart } from "@/components/payment-success-rate-chart"
import { DailyTransactionsChart } from "@/components/daily-transactions-chart"
import { RevenueByChannelChart } from "@/components/revenue-by-channel-chart"
import { UserActivityMap } from "@/components/user-activity-map"
import { generateDummyData } from "@/lib/generate-data"
import Link from "next/link"

export default function Dashboard() {
  const [data] = useState(() => generateDummyData())

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center gap-2 font-semibold">
            <Phone className="h-6 w-6" />
            <span className="hidden sm:inline-block">M-Pesa Analytics Dashboard</span>
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
            <Button variant="outline" size="icon" className="rounded-full">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-[240px_1fr]">
        <div className="hidden border-r bg-muted/40 lg:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-2 text-sm font-medium">
                <Button variant="ghost" className="flex justify-start gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
                <Button variant="ghost" className="flex justify-start gap-2">
                  <Users className="h-4 w-4" />
                  Customers
                </Button>
                <Button variant="ghost" className="flex justify-start gap-2">
                  <CreditCard className="h-4 w-4" />
                  Transactions
                </Button>
                <Button variant="ghost" className="flex justify-start gap-2">
                  <Store className="h-4 w-4" />
                  Payment Channels
                </Button>
                <Button variant="ghost" className="flex justify-start gap-2">
                  <BarChart className="h-4 w-4" />
                  Analytics
                </Button>
                <Button variant="ghost" className="flex justify-start gap-2">
                  <Calendar className="h-4 w-4" />
                  Reports
                </Button>
                <Button variant="ghost" className="flex justify-start gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
                <Button variant="ghost" className="flex justify-start gap-2" asChild>
                  <Link href="/admin/mpesa-settings">
                    <Phone className="h-4 w-4" />
                    M-Pesa Settings
                  </Link>
                </Button>
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
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
                      <div className="text-2xl font-bold">KSh {data.totalRevenue.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">+{data.revenueIncrease}% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{data.totalCustomers.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">+{data.customerIncrease}% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{data.totalTransactions.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">+{data.transactionIncrease}% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                      <PieChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{data.successRate}%</div>
                      <p className="text-xs text-muted-foreground">+{data.successRateIncrease}% from last month</p>
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
                      <PaymentTrendChart data={data.paymentTrends} />
                    </CardContent>
                  </Card>
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>Payment Channel Distribution</CardTitle>
                      <CardDescription>Breakdown by payment method</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PaymentChannelDistribution data={data.channelDistribution} />
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
                      <TransactionList transactions={data.recentTransactions} />
                    </CardContent>
                  </Card>
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Revenue by Channel</CardTitle>
                      <CardDescription>Comparison of revenue across different M-Pesa channels</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <RevenueByChannelChart data={data.revenueByChannel} />
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
                    <CustomerTable customers={data.customers} />
                  </CardContent>
                </Card>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Activity</CardTitle>
                      <CardDescription>Geographic distribution of customer transactions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <UserActivityMap data={data.userActivityMap} />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Success Rate</CardTitle>
                      <CardDescription>Success vs. failure rate by customer segment</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PaymentSuccessRateChart data={data.paymentSuccessRate} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="channels" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Till Payments</CardTitle>
                      <Store className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">KSh {data.tillPayments.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">{data.tillPercentage}% of total revenue</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Paybill Payments</CardTitle>
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">KSh {data.paybillPayments.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">{data.paybillPercentage}% of total revenue</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">USSD Payments</CardTitle>
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">KSh {data.ussdPayments.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">{data.ussdPercentage}% of total revenue</p>
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
                      <RevenueByChannelChart data={data.revenueByChannel} />
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Daily Transactions by Channel</CardTitle>
                      <CardDescription>Transaction patterns throughout the day</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <DailyTransactionsChart data={data.dailyTransactions} />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Channel Distribution</CardTitle>
                      <CardDescription>Percentage breakdown of payment channels</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PaymentChannelDistribution data={data.channelDistribution} />
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
                      <PaymentTrendChart data={data.paymentTrends} />
                    </CardContent>
                  </Card>
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>Success Rate Analysis</CardTitle>
                      <CardDescription>Payment success rate by channel</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PaymentSuccessRateChart data={data.paymentSuccessRate} />
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Daily Transaction Patterns</CardTitle>
                      <CardDescription>Hourly transaction distribution</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <DailyTransactionsChart data={data.dailyTransactions} />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>User Activity Map</CardTitle>
                      <CardDescription>Geographic distribution of transactions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <UserActivityMap data={data.userActivityMap} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  )
}
