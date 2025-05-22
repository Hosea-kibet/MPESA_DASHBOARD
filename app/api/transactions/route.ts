import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic";


export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || undefined
    const channel = searchParams.get("channel") || undefined
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { customer: { name: { contains: search, mode: "insensitive" } } },
        { customer: { phone: { contains: search, mode: "insensitive" } } },
        { mpesaReceiptNumber: { contains: search, mode: "insensitive" } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (channel) {
      where.channel = { name: channel }
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
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
        skip,
      }),
      prisma.transaction.count({ where }),
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
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch transactions" }, { status: 500 })
  }
}
