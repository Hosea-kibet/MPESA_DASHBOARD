import type { StateCreator } from "zustand"

export interface PaymentState {
  paymentStatus: "idle" | "pending" | "success" | "error"
  requestId: string
  error: string | null
  amount: string
  phoneNumber: string
  selectedCustomerId: string
  setPaymentStatus: (status: "idle" | "pending" | "success" | "error") => void
  setRequestId: (id: string) => void
  setError: (error: string | null) => void
  setAmount: (amount: string) => void
  setPhoneNumber: (phone: string) => void
  setSelectedCustomerId: (id: string) => void
  resetPaymentForm: () => void
  initiatePayment: () => Promise<void>
  checkPaymentStatus: (requestId: string) => Promise<void>
}

export const createPaymentStore: StateCreator<PaymentState> = (set, get) => ({
  paymentStatus: "idle",
  requestId: "",
  error: null,
  amount: "",
  phoneNumber: "",
  selectedCustomerId: "",

  setPaymentStatus: (status) => set({ paymentStatus: status }),
  setRequestId: (id) => set({ requestId: id }),
  setError: (error) => set({ error }),
  setAmount: (amount) => set({ amount }),
  setPhoneNumber: (phone) => set({ phoneNumber: phone }),
  setSelectedCustomerId: (id) => set({ selectedCustomerId: id }),

  resetPaymentForm: () =>
    set({
      paymentStatus: "idle",
      requestId: "",
      error: null,
      amount: "",
      phoneNumber: "",
      selectedCustomerId: "",
    }),

  initiatePayment: async () => {
    const { selectedCustomerId, phoneNumber, amount } = get()

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      set({ error: "Please enter a valid amount", paymentStatus: "error" })
      return
    }

    if (!selectedCustomerId && !phoneNumber) {
      set({ error: "Please select a customer or enter a phone number", paymentStatus: "error" })
      return
    }

    set({ paymentStatus: "pending", error: null })

    try {
      const response = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: selectedCustomerId || "temp-customer",
          phoneNumber,
          amount: Number(amount),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to initiate payment")
      }

      const data = await response.json()
      set({ requestId: data.requestId, paymentStatus: "pending" })

      // Start polling for payment status
      get().checkPaymentStatus(data.requestId)
    } catch (error: any) {
      set({ error: error.message, paymentStatus: "error" })
    }
  },

  checkPaymentStatus: async (requestId) => {
    let attempts = 0
    const maxAttempts = 10

    const checkStatus = async () => {
      attempts++

      try {
        const response = await fetch(`/api/payments/status?requestId=${requestId}`)
        if (!response.ok) throw new Error("Failed to check payment status")

        const data = await response.json()

        if (data.status === "success") {
          set({ paymentStatus: "success" })
          return true
        } else if (data.status === "failed") {
          set({ paymentStatus: "error", error: data.resultDesc || "Payment failed" })
          return true
        }
      } catch (error) {
        console.error("Error checking payment status:", error)
      }

      if (attempts >= maxAttempts) {
        set({ paymentStatus: "error", error: "Payment status check timed out" })
        return true
      }

      return false
    }

    const poll = async () => {
      const done = await checkStatus()
      if (!done) {
        setTimeout(poll, 3000)
      }
    }

    poll()
  },
})
