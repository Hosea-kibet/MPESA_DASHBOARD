import { prisma } from "@/lib/db"
import { initiateSTKPush } from "@/lib/mpesa"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerId, phoneNumber, amount } = body

    if (!phoneNumber || !amount) {
      return NextResponse.json({ error: "Phone number and amount are required" }, { status: 400 })
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json({ error: "Amount must be a positive number" }, { status: 400 })
    }

    let customer

    // Check if this is a temporary customer or an existing one
    if (customerId === "temp-customer") {
      // For temporary customers, we'll create a basic record
      customer = await prisma.customer.create({
        data: {
          name: `Customer (${phoneNumber})`,
          phone: phoneNumber,
        },
      })
    } else {
      // Get customer details for existing customer
      customer = await prisma.customer.findUnique({
        where: { id: customerId },
      })

      if (!customer) {
        return NextResponse.json({ error: "Customer not found" }, { status: 404 })
      }
    }

    // Initiate STK push
    const accountReference = `Payment for ${customer.name}`
    const transactionDesc = "M-Pesa Payment"

    const stkResponse = await initiateSTKPush(phoneNumber, Number(amount), accountReference, transactionDesc)

    if (!stkResponse.success) {
      return NextResponse.json({ error: stkResponse.error || "Failed to initiate payment" }, { status: 500 })
    }

    // Save STK request to database
    const stkRequest = await prisma.stkRequest.create({
      data: {
        customerId: customer.id,
        checkoutRequestId: stkResponse.data.CheckoutRequestID,
        merchantRequestId: stkResponse.data.MerchantRequestID,
        amount: Number(amount),
        phone: phoneNumber,
        status: "pending",
      },
    })

    return NextResponse.json({
      success: true,
      requestId: stkRequest.id,
      checkoutRequestId: stkResponse.data.CheckoutRequestID,
    })
  } catch (error: any) {
    console.error("Error initiating payment:", error)
    return NextResponse.json({ error: error.message || "Failed to initiate payment" }, { status: 500 })
  }
}
