"use server"

import { prisma } from "@/lib/db"
import { initiateSTKPush } from "@/lib/mpesa"
import { revalidatePath } from "next/cache"

export async function initiatePayment(customerId: string, phoneNumber: string, amount: number) {
  try {
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

      customerId = customer.id
    } else {
      // Get customer details for existing customer
      customer = await prisma.customer.findUnique({
        where: { id: customerId },
      })

      if (!customer) {
        return { success: false, error: "Customer not found" }
      }
    }

    // Initiate STK push
    const accountReference = `Payment for ${customer.name}`
    const transactionDesc = "M-Pesa Payment"

    const stkResponse = await initiateSTKPush(phoneNumber, amount, accountReference, transactionDesc)

    if (!stkResponse.success) {
      return { success: false, error: stkResponse.error }
    }

    // Save STK request to database
    const stkRequest = await prisma.stkRequest.create({
      data: {
        customerId,
        checkoutRequestId: stkResponse.data.CheckoutRequestID,
        merchantRequestId: stkResponse.data.MerchantRequestID,
        amount,
        phone: phoneNumber,
        status: "pending",
      },
    })

    revalidatePath("/dashboard")
    revalidatePath("/payments/new")
    revalidatePath("/customers")
    revalidatePath("/transactions")

    return {
      success: true,
      data: {
        requestId: stkRequest.id,
        checkoutRequestId: stkResponse.data.CheckoutRequestID,
      },
    }
  } catch (error: any) {
    console.error("Error initiating payment:", error)
    return { success: false, error: error.message }
  }
}

export async function getPaymentStatus(requestId: string) {
  try {
    const stkRequest = await prisma.stkRequest.findUnique({
      where: { id: requestId },
    })

    if (!stkRequest) {
      return { success: false, error: "Request not found" }
    }

    return {
      success: true,
      data: {
        status: stkRequest.status,
        resultCode: stkRequest.resultCode,
        resultDesc: stkRequest.resultDesc,
      },
    }
  } catch (error: any) {
    console.error("Error getting payment status:", error)
    return { success: false, error: error.message }
  }
}
