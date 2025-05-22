import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        orderBy: { name: "asc" },
        take: limit,
        skip,
      }),
      prisma.customer.count({ where }),
    ])

    return NextResponse.json({
      customers,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    })
  } catch (error: any) {
    console.error("Error fetching customers:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch customers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, email } = body

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 })
    }

    // Check if customer with phone already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { phone },
    })

    if (existingCustomer) {
      return NextResponse.json({ error: "Customer with this phone number already exists" }, { status: 400 })
    }

    const customer = await prisma.customer.create({
      data: { name, phone, email },
    })

    return NextResponse.json({ customer })
  } catch (error: any) {
    console.error("Error creating customer:", error)
    return NextResponse.json({ error: error.message || "Failed to create customer" }, { status: 500 })
  }
}
