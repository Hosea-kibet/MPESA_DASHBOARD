"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import useStore from "@/lib/store"
import { CustomerTable } from "@/components/customer-table"
import type { Customer } from "@prisma/client"

interface CustomerListProps {
  initialCustomers: Customer[]
}

export function CustomerList({ initialCustomers }: CustomerListProps) {
  const router = useRouter()
  const { customers, setCustomers, fetchCustomers } = useStore()

  // Initialize store with server data
  useEffect(() => {
    setCustomers(initialCustomers)
  }, [initialCustomers, setCustomers])

  // Refresh data from API
  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  const handleRowClick = (customerId: string) => {
    router.push(`/customers/${customerId}`)
  }

  return <CustomerTable customers={customers} onRowClick={handleRowClick} />
}
