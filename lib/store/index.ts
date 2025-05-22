import { create } from "zustand"
import { createCustomerStore } from "./customer-store"
import { createTransactionStore } from "./transaction-store"
import { createUIStore } from "./ui-store"
import { createPaymentStore } from "./payment-store"

// Create a root store that combines all the other stores
const useStore = create((...args) => ({
  ...createCustomerStore(...args),
  ...createTransactionStore(...args),
  ...createUIStore(...args),
  ...createPaymentStore(...args),
}))

export default useStore
