"use client"

import type React from "react"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import useStore from "@/lib/store"

interface PaymentFormProps {
  customerId: string
  customerName: string
  customerPhone: string
}

export function PaymentForm({ customerId, customerName, customerPhone }: PaymentFormProps) {
  const { toast } = useToast()
  const {
    amount,
    phoneNumber,
    paymentStatus,
    error,
    setAmount,
    setPhoneNumber,
    setSelectedCustomerId,
    initiatePayment,
    resetPaymentForm,
  } = useStore()

  // Initialize form with customer data
  useEffect(() => {
    setSelectedCustomerId(customerId)
    setPhoneNumber(customerPhone)

    // Reset form when unmounting
    return () => resetPaymentForm()
  }, [customerId, customerPhone, setSelectedCustomerId, setPhoneNumber, resetPaymentForm])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await initiatePayment()
      toast({
        title: "Payment initiated",
        description: "Check your phone to complete the payment",
      })
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to initiate payment",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Initiate M-Pesa Payment</CardTitle>
        <CardDescription>Send an STK push to the customer&apos;s phone</CardDescription>
      </CardHeader>
      <CardContent>
        {paymentStatus === "pending" && (
          <Alert className="mb-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertTitle>Payment in progress</AlertTitle>
            <AlertDescription>
              Please check your phone and enter your M-Pesa PIN to complete the payment
            </AlertDescription>
          </Alert>
        )}

        {paymentStatus === "success" && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle>Payment successful</AlertTitle>
            <AlertDescription>Your payment has been processed successfully</AlertDescription>
          </Alert>
        )}

        {paymentStatus === "error" && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Payment failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="customer">Customer</Label>
              <Input id="customer" value={customerName} disabled />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="e.g. 0712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Amount (KSh)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="0.01"
                required
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          disabled={paymentStatus === "pending" || paymentStatus === "success"}
          className="w-full"
        >
          {paymentStatus === "pending" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {paymentStatus === "pending" ? "Processing..." : "Send Payment Request"}
        </Button>
      </CardFooter>
    </Card>
  )
}
