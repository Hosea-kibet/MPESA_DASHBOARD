import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const customer = await prisma.customer.findUnique({
      where: { id },
    })

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    // Get customer stats
    const transactionCount = await prisma.transaction.count({
      where: { customerId: id },
    })

    const totalSpent = await prisma.transaction.aggregate({
      where: {
        customerId: id,
        status: "completed",
      },
      _sum: { amount: true },
    })

    // Get preferred channel
    const channelStats = await prisma.transaction.groupBy({
      by: ["channelId"],
      where: { customerId: id },
      _count: true,
      orderBy: { _count: "desc" },
      take: 1,
    })

    let preferredChannel = "None"

    if (channelStats.length > 0) {
      const channel = await prisma.paymentChannel.findUnique({
        where: { id: channelStats[0].channelId },
      })
      preferredChannel = channel?.name || "None"
    }

    return NextResponse.json({
      customer,
      stats: {
        transactionCount,
        totalSpent: totalSpent._sum.amount || 0,
        preferredChannel,
      },
    })
  } catch (error: any) {
    console.error("Error fetching customer:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch customer" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { name, phone, email } = body

    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id },
    })

    if (!existingCustomer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    // If phone is being updated, check if it's already in use
    if (phone && phone !== existingCustomer.phone) {
      const phoneInUse = await prisma.customer.findUnique({
        where: { phone },
      })

      if (phoneInUse) {
        return NextResponse.json({ error: "Phone number is already in use" }, { status: 400 })
      }
    }

    const customer = await prisma.customer.update({
      where: { id },
      data: { name, phone, email },
    })

    return NextResponse.json({ customer })
  } catch (error: any) {
    console.error("Error updating customer:", error)
    return NextResponse.json({ error: error.message || "Failed to update customer" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id },
    })

    if (!existingCustomer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    // Check if customer has transactions
    const transactionCount = await prisma.transaction.count({
      where: { customerId: id },
    })

    if (transactionCount > 0) {
      return NextResponse.json({ error: "Cannot delete customer with existing transactions" }, { status: 400 })
    }

    await prisma.customer.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting customer:", error)
    return NextResponse.json({ error: error.message || "Failed to delete customer" }, { status: 500 })
  }
}
