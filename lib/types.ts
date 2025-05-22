export interface Customer {
  id: string
  name: string
  phone: string
  totalSpent: number
  preferredChannel: string
  lastTransaction: string
}

export interface Transaction {
  id: string
  customerName: string
  customerAvatar: string
  amount: number
  date: string
  status: "success" | "failed"
  channel: string
}

export interface ChannelDistribution {
  name: string
  value: number
}

export interface PaymentTrend {
  date: string
  amount: number
  transactions: number
}

export interface PaymentSuccessRate {
  name: string
  success: number
  failure: number
}

export interface DailyTransaction {
  hour: string
  till: number
  paybill: number
  ussd: number
}

export interface RevenueByChannel {
  name: string
  revenue: number
  transactions: number
}

export interface UserActivity {
  x: number
  y: number
  z: number
  name: string
}

export interface DashboardData {
  totalRevenue: number
  revenueIncrease: number
  totalCustomers: number
  customerIncrease: number
  totalTransactions: number
  transactionIncrease: number
  successRate: number
  successRateIncrease: number
  tillPayments: number
  tillPercentage: number
  paybillPayments: number
  paybillPercentage: number
  ussdPayments: number
  ussdPercentage: number
  customers: Customer[]
  recentTransactions: Transaction[]
  channelDistribution: ChannelDistribution[]
  paymentTrends: PaymentTrend[]
  paymentSuccessRate: PaymentSuccessRate[]
  dailyTransactions: DailyTransaction[]
  revenueByChannel: RevenueByChannel[]
  userActivityMap: UserActivity[]
}
