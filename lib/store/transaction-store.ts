import type { StateCreator } from "zustand"
import type { Transaction } from "@prisma/client"

export interface TransactionWithRelations extends Transaction {
  customer: {
    name: string
    phone: string
  }
  channel: {
    name: string
  }
}

export interface TransactionState {
  transactions: TransactionWithRelations[]
  recentTransactions: TransactionWithRelations[]
  isLoading: boolean
  error: string | null
  setTransactions: (transactions: TransactionWithRelations[]) => void
  setRecentTransactions: (transactions: TransactionWithRelations[]) => void
  fetchTransactions: () => Promise<void>
  fetchRecentTransactions: () => Promise<void>
  fetchCustomerTransactions: (customerId: string) => Promise<void>
}

export const createTransactionStore: StateCreator<TransactionState> = (set, get) => ({
  transactions: [],
  recentTransactions: [],
  isLoading: false,
  error: null,

  setTransactions: (transactions) => set({ transactions }),
  setRecentTransactions: (transactions) => set({ recentTransactions: transactions }),

  fetchTransactions: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("/api/transactions")
      if (!response.ok) throw new Error("Failed to fetch transactions")
      const data = await response.json()
      set({ transactions: data.transactions, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  fetchRecentTransactions: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("/api/transactions/recent")
      if (!response.ok) throw new Error("Failed to fetch recent transactions")
      const data = await response.json()
      set({ recentTransactions: data.transactions, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  fetchCustomerTransactions: async (customerId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/customers/${customerId}/transactions`)
      if (!response.ok) throw new Error("Failed to fetch customer transactions")
      const data = await response.json()
      set({ transactions: data.transactions, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
})
