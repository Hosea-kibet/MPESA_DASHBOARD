import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/db"
import { PaymentInitiationForm } from "@/components/payment-initiation-form"

export default async function NewPaymentPage() {
  // Get all customers for the dropdown
  const customers = await prisma.customer.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      phone: true,
    },
  })

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Initiate M-Pesa Payment</h1>
      <p className="text-muted-foreground">Send an STK push to a customer's phone to request payment</p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>Enter the payment details to initiate an STK push</CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentInitiationForm customers={customers} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Payment Instructions</CardTitle>
            <CardDescription>How M-Pesa STK push works</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">1. Select a customer</h3>
              <p className="text-sm text-muted-foreground">
                Choose an existing customer from the dropdown or enter a new phone number.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">2. Enter amount</h3>
              <p className="text-sm text-muted-foreground">Specify the amount to be paid in Kenyan Shillings (KSh).</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">3. Send payment request</h3>
              <p className="text-sm text-muted-foreground">
                Click "Send Payment Request" to initiate the STK push to the customer's phone.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">4. Customer confirmation</h3>
              <p className="text-sm text-muted-foreground">
                The customer will receive a prompt on their phone to enter their M-Pesa PIN to complete the payment.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">5. Payment confirmation</h3>
              <p className="text-sm text-muted-foreground">
                Once the payment is processed, you'll receive a confirmation and the transaction will be recorded.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
