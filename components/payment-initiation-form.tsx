"use client"

import type React from "react"

import { useState } from "react"
import { initiatePayment, getPaymentStatus } from "@/app/actions/mpesa-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Customer {
  id: string
  name: string
  phone: string
}

interface PaymentInitiationFormProps {
  customers: Customer[]
}

export function PaymentInitiationForm({ customers }: PaymentInitiationFormProps) {
  const [selectedCustomerId, setSelectedCustomerId] = useState("")
  const [phone, setPhone] = useState("")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "pending" | "success" | "error">("idle")
  const [requestId, setRequestId] = useState("")
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setPaymentStatus("idle")

    try {
      const amountValue = Number.parseFloat(amount)
      if (isNaN(amountValue) || amountValue <= 0) {
        throw new Error("Please enter a valid amount")
      }

      // If using existing customer
      if (selectedCustomerId) {
        const selectedCustomer = customers.find((c) => c.id === selectedCustomerId)
        if (!selectedCustomer) {
          throw new Error("Selected customer not found")
        }

        const phoneToUse = phone || selectedCustomer.phone
        const result = await initiatePayment(selectedCustomerId, phoneToUse, amountValue)

        if (result.success) {
          setRequestId(result.data.requestId)
          setPaymentStatus("pending")
          toast({
            title: "Payment initiated",
            description: `Payment request sent to ${selectedCustomer.name}`,
          })

          // Poll for payment status
          pollPaymentStatus(result.data.requestId)
        } else {
          setError(result.error || "Failed to initiate payment")
          setPaymentStatus("error")
        }
      } else {
        // If using new phone number
        if (!phone) {
          throw new Error("Please enter a phone number")
        }

        // Create a temporary customer for the payment
        // In a real app, you might want to save this customer to the database
        const result = await initiatePayment("temp-customer", phone, amountValue)

        if (result.success) {
          setRequestId(result.data.requestId)
          setPaymentStatus("pending")
          toast({
            title: "Payment initiated",
            description: `Payment request sent to ${phone}`,
          })

          // Poll for payment status
          pollPaymentStatus(result.data.requestId)
        } else {
          setError(result.error || "Failed to initiate payment")
          setPaymentStatus("error")
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
      setPaymentStatus("error")
    } finally {
      setLoading(false)
    }
  }

  const pollPaymentStatus = async (id: string) => {
    let attempts = 0
    const maxAttempts = 10
    const interval = setInterval(async () => {
      attempts++

      const result = await getPaymentStatus(id)

      if (result.success) {
        if (result.data.status === "success") {
          setPaymentStatus("success")
          clearInterval(interval)
          toast({
            title: "Payment successful",
            description: "Your payment has been processed successfully",
          })
        } else if (result.data.status === "failed") {
          setPaymentStatus("error")
          setError(result.data.resultDesc || "Payment failed")
          clearInterval(interval)
        }
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval)
      }
    }, 3000)
  }

  const handleCustomerChange = (customerId: string) => {
    setSelectedCustomerId(customerId)
    const selectedCustomer = customers.find((c) => c.id === customerId)
    if (selectedCustomer) {
      setPhone(selectedCustomer.phone)
    }
  }

  return (
    <div className="space-y-6">
      {paymentStatus === "pending" && (
        <Alert className="mb-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertTitle>Payment in progress</AlertTitle>
          <AlertDescription>Please check your phone and enter your M-Pesa PIN to complete the payment</AlertDescription>
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

      <Tabs defaultValue="existing">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="existing">Existing Customer</TabsTrigger>
          <TabsTrigger value="new">New Phone Number</TabsTrigger>
        </TabsList>
        <TabsContent value="existing" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="customer">Select Customer</Label>
            <Select onValueChange={handleCustomerChange} value={selectedCustomerId}>
              <SelectTrigger id="customer">
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name} ({customer.phone})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCustomerId && (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  placeholder="Use different phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to use the customer's registered phone number
                </p>
              </div>

              <div className="space-y-2">
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

              <Button
                onClick={handleSubmit}
                disabled={
                  loading ||
                  paymentStatus === "pending" ||
                  paymentStatus === "success" ||
                  !selectedCustomerId ||
                  !amount
                }
                className="w-full mt-4"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Processing..." : "Send Payment Request"}
              </Button>
            </>
          )}
        </TabsContent>
        <TabsContent value="new" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="new-phone">Phone Number</Label>
            <Input
              id="new-phone"
              placeholder="e.g. 0712345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-amount">Amount (KSh)</Label>
            <Input
              id="new-amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="0.01"
              required
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading || paymentStatus === "pending" || paymentStatus === "success" || !phone || !amount}
            className="w-full mt-4"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Processing..." : "Send Payment Request"}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}
