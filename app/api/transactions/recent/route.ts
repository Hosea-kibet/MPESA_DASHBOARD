import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic";


export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "5")

    const transactions = await prisma.transaction.findMany({
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
      orderBy: { transactionDate: "desc" },
      take: limit,
    })

    return NextResponse.json({ transactions })
  } catch (error: any) {
    console.error("Error fetching recent transactions:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch recent transactions" }, { status: 500 })
  }
}
