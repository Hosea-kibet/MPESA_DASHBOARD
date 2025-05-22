import axios from "axios"

// M-Pesa API endpoints
const MPESA_AUTH_URL = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
const MPESA_STK_URL = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"

// Environment variables
const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || ""
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || ""
const PASSKEY = process.env.MPESA_PASSKEY || ""
const SHORTCODE = process.env.MPESA_SHORTCODE || ""
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL || ""

// Get OAuth token
export async function getAccessToken(): Promise<string> {
  try {
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64")
    const response = await axios.get(MPESA_AUTH_URL, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    })
    return response.data.access_token
  } catch (error) {
    console.error("Error getting M-Pesa access token:", error)
    throw new Error("Failed to get M-Pesa access token")
  }
}

// Generate timestamp
function getTimestamp(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hour = String(date.getHours()).padStart(2, "0")
  const minute = String(date.getMinutes()).padStart(2, "0")
  const second = String(date.getSeconds()).padStart(2, "0")

  return `${year}${month}${day}${hour}${minute}${second}`
}

// Generate password
function getPassword(timestamp: string): string {
  const data = `${SHORTCODE}${PASSKEY}${timestamp}`
  return Buffer.from(data).toString("base64")
}

// Initiate STK Push
export async function initiateSTKPush(
  phoneNumber: string,
  amount: number,
  accountReference: string,
  transactionDesc: string,
) {
  try {
    // Format phone number (remove leading 0 or +254)
    let formattedPhone = phoneNumber.replace(/^0|^\+254/, "")
    // Add 254 prefix if not present
    if (!formattedPhone.startsWith("254")) {
      formattedPhone = `254${formattedPhone}`
    }

    const timestamp = getTimestamp()
    const password = getPassword(timestamp)
    const token = await getAccessToken()

    // Log the callback URL being used
    console.log(`Using callback URL: ${CALLBACK_URL}`)

    if (!CALLBACK_URL) {
      console.warn("MPESA_CALLBACK_URL is not set. Callbacks will not be received.")
    }

    const requestData = {
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(amount),
      PartyA: formattedPhone,
      PartyB: SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: CALLBACK_URL,
      AccountReference: accountReference,
      TransactionDesc: transactionDesc,
    }

    console.log("Initiating STK push with data:", JSON.stringify(requestData, null, 2))

    const response = await axios.post(MPESA_STK_URL, requestData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    console.log("STK push response:", JSON.stringify(response.data, null, 2))

    return {
      success: true,
      data: response.data,
    }
  } catch (error: any) {
    console.error("Error initiating STK push:", error.response?.data || error.message)
    return {
      success: false,
      error: error.response?.data || error.message,
    }
  }
}

// Validate M-Pesa callback
export function validateCallback(body: any): boolean {
  // Basic validation to ensure the callback has the expected structure
  if (!body || !body.Body || !body.Body.stkCallback) {
    return false
  }

  const { stkCallback } = body.Body
  return !!(stkCallback.MerchantRequestID && stkCallback.CheckoutRequestID && stkCallback.ResultCode !== undefined)
}
