import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("Received M-Pesa callback")
    const body = await request.json()
    console.log("Callback payload:", JSON.stringify(body, null, 2))

    // Extract callback data
    const { Body } = body

    if (!Body || !Body.stkCallback) {
      console.error("Invalid callback format")
      return NextResponse.json({ success: false, message: "Invalid callback format" }, { status: 400 })
    }

    const { stkCallback } = Body
    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc } = stkCallback

    console.log(`Processing STK callback: ${CheckoutRequestID}, Result: ${ResultCode}`)

    // Find the STK request
    const stkRequest = await prisma.stkRequest.findUnique({
      where: { checkoutRequestId: CheckoutRequestID },
      include: { customer: true },
    })

    if (!stkRequest) {
      console.error(`STK request not found: ${CheckoutRequestID}`)
      return NextResponse.json({ success: false, message: "STK request not found" }, { status: 404 })
    }

    // Update STK request status
    const status = ResultCode === 0 ? "success" : "failed"

    await prisma.stkRequest.update({
      where: { id: stkRequest.id },
      data: {
        status,
        resultCode: ResultCode.toString(),
        resultDesc: ResultDesc,
      },
    })

    console.log(`Updated STK request status to ${status}`)

    // If payment was successful, create a transaction record
    if (ResultCode === 0) {
      // Get CallbackMetadata
      const { CallbackMetadata } = stkCallback
      const items = CallbackMetadata?.Item || []

      // Extract transaction details
      const mpesaReceiptNumber = items.find((item: any) => item.Name === "MpesaReceiptNumber")?.Value
      const transactionDate = items.find((item: any) => item.Name === "TransactionDate")?.Value
      const phoneNumber = items.find((item: any) => item.Name === "PhoneNumber")?.Value

      // Find the Paybill channel
      const paybillChannel = await prisma.paymentChannel.findFirst({
        where: { name: "Paybill" },
      })

      if (paybillChannel) {
        // Create transaction record
        const transaction = await prisma.transaction.create({
          data: {
            customerId: stkRequest.customerId,
            channelId: paybillChannel.id,
            amount: stkRequest.amount,
            status: "completed",
            mpesaReceiptNumber,
          },
        })

        console.log(`Created transaction record: ${transaction.id}`)
      } else {
        console.error("Paybill channel not found")
      }
    }

    return NextResponse.json({
      success: true,
      message: "Callback processed successfully",
    })
  } catch (error: any) {
    console.error("Error processing M-Pesa callback:", error)
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    )
  }
}

// Add a GET handler for testing the callback endpoint
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "M-Pesa callback endpoint is active",
  })
}
