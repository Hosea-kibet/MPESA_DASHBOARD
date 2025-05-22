import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const customerId = params.id
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    // Check if customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    })

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: { customerId },
        include: { channel: true },
        orderBy: { transactionDate: "desc" },
        take: limit,
        skip,
      }),
      prisma.transaction.count({
        where: { customerId },
      }),
    ])

    return NextResponse.json({
      transactions,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    })
  } catch (error: any) {
    console.error("Error fetching customer transactions:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch customer transactions" }, { status: 500 })
  }
}
