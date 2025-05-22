import type { StateCreator } from "zustand"
import { persist } from "zustand/middleware"
import type { Customer } from "@prisma/client"

export interface CustomerState {
  customers: Customer[]
  selectedCustomer: Customer | null
  isLoading: boolean
  error: string | null
  setCustomers: (customers: Customer[]) => void
  setSelectedCustomer: (customer: Customer | null) => void
  addCustomer: (customer: Customer) => void
  updateCustomer: (id: string, data: Partial<Customer>) => void
  deleteCustomer: (id: string) => void
  fetchCustomers: () => Promise<void>
  fetchCustomerById: (id: string) => Promise<void>
}

export const createCustomerStore: StateCreator<CustomerState, [], [["zustand/persist", unknown]]> = persist(
  (set, get) => ({
    customers: [],
    selectedCustomer: null,
    isLoading: false,
    error: null,

    setCustomers: (customers) => set({ customers }),
    setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),

    addCustomer: (customer) =>
      set((state) => ({
        customers: [...state.customers, customer],
      })),

    updateCustomer: (id, data) =>
      set((state) => ({
        customers: state.customers.map((customer) => (customer.id === id ? { ...customer, ...data } : customer)),
        selectedCustomer:
          state.selectedCustomer?.id === id ? { ...state.selectedCustomer, ...data } : state.selectedCustomer,
      })),

    deleteCustomer: (id) =>
      set((state) => ({
        customers: state.customers.filter((customer) => customer.id !== id),
        selectedCustomer: state.selectedCustomer?.id === id ? null : state.selectedCustomer,
      })),

    fetchCustomers: async () => {
      set({ isLoading: true, error: null })
      try {
        const response = await fetch("/api/customers")
        if (!response.ok) throw new Error("Failed to fetch customers")
        const data = await response.json()
        set({ customers: data.customers, isLoading: false })
      } catch (error: any) {
        set({ error: error.message, isLoading: false })
      }
    },

    fetchCustomerById: async (id) => {
      set({ isLoading: true, error: null })
      try {
        const response = await fetch(`/api/customers/${id}`)
        if (!response.ok) throw new Error("Failed to fetch customer")
        const data = await response.json()
        set({ selectedCustomer: data.customer, isLoading: false })
      } catch (error: any) {
        set({ error: error.message, isLoading: false })
      }
    },
  }),
  {
    name: "customer-storage",
    partialize: (state) => ({ customers: state.customers }),
  },
)
