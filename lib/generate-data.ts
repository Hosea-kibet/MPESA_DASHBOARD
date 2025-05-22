import { faker } from "@faker-js/faker"
import type { DashboardData } from "./types"

export function generateDummyData(): DashboardData {
  // Set seed for consistent data
  faker.seed(123)

  // Generate total metrics
  const totalRevenue = faker.number.int({ min: 5000000, max: 10000000 })
  const revenueIncrease = faker.number.int({ min: 5, max: 25 })
  const totalCustomers = faker.number.int({ min: 10000, max: 50000 })
  const customerIncrease = faker.number.int({ min: 3, max: 15 })
  const totalTransactions = faker.number.int({ min: 50000, max: 200000 })
  const transactionIncrease = faker.number.int({ min: 8, max: 20 })
  const successRate = faker.number.int({ min: 92, max: 99 })
  const successRateIncrease = faker.number.int({ min: 1, max: 5 })

  // Generate channel metrics
  const tillPayments = Math.round(totalRevenue * faker.number.float({ min: 0.3, max: 0.4, multipleOf: 0.001 }))
  const tillPercentage = Math.round((tillPayments / totalRevenue) * 100)
  const paybillPayments = Math.round(totalRevenue * faker.number.float({ min: 0.4, max: 0.5, multipleOf: 0.001 }))
  const paybillPercentage = Math.round((paybillPayments / totalRevenue) * 100)
  const ussdPayments = totalRevenue - tillPayments - paybillPayments
  const ussdPercentage = Math.round((ussdPayments / totalRevenue) * 100)

  // Generate customers
  const customers = Array.from({ length: 20 }, () => {
    const name = faker.person.fullName()
    const phone = `+254${faker.string.numeric(9)}`
    const totalSpent = faker.number.int({ min: 1000, max: 50000 })
    const channels = ["Till", "Paybill", "USSD"]
    const preferredChannel = channels[faker.number.int({ min: 0, max: 2 })]
    const lastTransaction = faker.date.recent({ days: 30 }).toLocaleDateString()

    return {
      id: faker.string.uuid(),
      name,
      phone,
      totalSpent,
      preferredChannel,
      lastTransaction,
    }
  })

  // Generate recent transactions
  const recentTransactions = Array.from({ length: 5 }, () => {
    const customerName = faker.person.fullName()
    const amount = faker.number.int({ min: 100, max: 5000 })
    const date = faker.date.recent({ days: 7 }).toLocaleDateString()
    const status = faker.helpers.arrayElement(["success", "failed"]) as "success" | "failed"
    const channels = ["Till", "Paybill", "USSD"]
    const channel = channels[faker.number.int({ min: 0, max: 2 })]

    return {
      id: faker.string.uuid(),
      customerName,
      customerAvatar: `/placeholder.svg?height=40&width=40`,
      amount,
      date,
      status,
      channel,
    }
  })

  // Generate channel distribution
  const channelDistribution = [
    { name: "Till", value: tillPercentage },
    { name: "Paybill", value: paybillPercentage },
    { name: "USSD", value: ussdPercentage },
  ]

  // Generate payment trends
  const paymentTrends = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

    return {
      date: dateStr,
      amount: faker.number.int({ min: 50000, max: 500000 }),
      transactions: faker.number.int({ min: 500, max: 5000 }),
    }
  })

  // Generate payment success rate
  const paymentSuccessRate = [
    {
      name: "Till",
      success: faker.number.int({ min: 90, max: 98 }),
      failure: faker.number.int({ min: 2, max: 10 }),
    },
    {
      name: "Paybill",
      success: faker.number.int({ min: 92, max: 99 }),
      failure: faker.number.int({ min: 1, max: 8 }),
    },
    {
      name: "USSD",
      success: faker.number.int({ min: 85, max: 95 }),
      failure: faker.number.int({ min: 5, max: 15 }),
    },
  ]

  // Generate daily transactions
  const dailyTransactions = Array.from({ length: 24 }, (_, i) => {
    const hour = `${i}:00`

    // Create a pattern where transactions peak during morning and evening
    let multiplier = 1
    if (i >= 7 && i <= 9) multiplier = 3 // Morning peak
    if (i >= 17 && i <= 19) multiplier = 4 // Evening peak

    return {
      hour,
      till: faker.number.int({ min: 10, max: 50 }) * multiplier,
      paybill: faker.number.int({ min: 20, max: 80 }) * multiplier,
      ussd: faker.number.int({ min: 5, max: 30 }) * multiplier,
    }
  })

  // Generate revenue by channel
  const revenueByChannel = [
    {
      name: "Till",
      revenue: tillPayments,
      transactions: Math.round(totalTransactions * (tillPercentage / 100)),
    },
    {
      name: "Paybill",
      revenue: paybillPayments,
      transactions: Math.round(totalTransactions * (paybillPercentage / 100)),
    },
    {
      name: "USSD",
      revenue: ussdPayments,
      transactions: Math.round(totalTransactions * (ussdPercentage / 100)),
    },
  ]

  // Generate user activity map (scatter plot data)
  const userActivityMap = Array.from({ length: 50 }, () => {
    // Generate points roughly within Kenya's coordinates
    const x = faker.number.float({ min: 33.5, max: 42.0, multipleOf: 0.001 }) // Longitude
    const y = faker.number.float({ min: -4.5, max: 5.5, multipleOf: 0.001 }) // Latitude
    const z = faker.number.int({ min: 10, max: 100 }) // Size/volume

    return {
      x,
      y,
      z,
      name: faker.location.city(),
    }
  })

  return {
    totalRevenue,
    revenueIncrease,
    totalCustomers,
    customerIncrease,
    totalTransactions,
    transactionIncrease,
    successRate,
    successRateIncrease,
    tillPayments,
    tillPercentage,
    paybillPayments,
    paybillPercentage,
    ussdPayments,
    ussdPercentage,
    customers,
    recentTransactions,
    channelDistribution,
    paymentTrends,
    paymentSuccessRate,
    dailyTransactions,
    revenueByChannel,
    userActivityMap,
  }
}
