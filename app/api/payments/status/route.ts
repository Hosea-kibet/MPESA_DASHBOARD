import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const requestId = searchParams.get("requestId")

    if (!requestId) {
      return NextResponse.json({ error: "Request ID is required" }, { status: 400 })
    }

    const stkRequest = await prisma.stkRequest.findUnique({
      where: { id: requestId },
    })

    if (!stkRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    return NextResponse.json({
      status: stkRequest.status,
      resultCode: stkRequest.resultCode,
      resultDesc: stkRequest.resultDesc,
    })
  } catch (error: any) {
    console.error("Error getting payment status:", error)
    return NextResponse.json({ error: error.message || "Failed to get payment status" }, { status: 500 })
  }
}
