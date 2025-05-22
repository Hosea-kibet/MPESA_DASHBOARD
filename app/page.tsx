import { Suspense } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardContent } from "@/components/dashboard-content"
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton"
import { generateDummyData } from "@/lib/generate-data"
import { CssTest } from "@/components/css-test"

// Server component to fetch dashboard data
async function getDashboardData() {
  try {
    // Dynamically import prisma to avoid issues during build time
    const { prisma } = await import("@/lib/db")

    // Get total revenue
    const totalRevenue = await prisma.transaction.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    })

    // Get total customers
    const totalCustomers = await prisma.customer.count()

    // Get total transactions
    const totalTransactions = await prisma.transaction.count()

    // Get success rate
    const successfulTransactions = await prisma.transaction.count({
      where: { status: "completed" },
    })

    const successRate = totalTransactions > 0 ? Math.round((successfulTransactions / totalTransactions) * 100) : 0

    // Get recent transactions
    const recentTransactions = await prisma.transaction.findMany({
      take: 5,
      orderBy: { transactionDate: "desc" },
      include: {
        customer: {
          select: {
            name: true,
            phone: true,
          },
        },
        channel: {
          select: {
            name: true,
          },
        },
      },
    })

    // Get channel distribution
    const channels = await prisma.paymentChannel.findMany()

    const channelDistribution = await Promise.all(
      channels.map(async (channel) => {
        const count = await prisma.transaction.count({
          where: { channelId: channel.id },
        })

        return {
          name: channel.name,
          value: count,
        }
      }),
    )

    return {
      totalRevenue: totalRevenue._sum.amount || 0,
      totalCustomers,
      totalTransactions,
      successRate,
      recentTransactions,
      channelDistribution,
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    // Return dummy data as fallback
    const dummyData = generateDummyData()
    return {
      totalRevenue: dummyData.totalRevenue,
      totalCustomers: dummyData.totalCustomers,
      totalTransactions: dummyData.totalTransactions,
      successRate: dummyData.successRate,
      recentTransactions: dummyData.recentTransactions,
      channelDistribution: dummyData.channelDistribution,
    }
  }
}

export default async function HomePage() {
  const dashboardData = await getDashboardData()

  return (
    <>
      {/* CSS Test Component */}
      {/* <CssTest /> */}

      <DashboardLayout>
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent initialData={dashboardData} />
        </Suspense>
      </DashboardLayout>
    </>
  )
}
