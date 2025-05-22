"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import useStore from "@/lib/store"

interface PaymentHistoryProps {
  customerId: string
}

export function PaymentHistory({ customerId }: PaymentHistoryProps) {
  const { transactions, isLoading, fetchCustomerTransactions } = useStore()

  useEffect(() => {
    fetchCustomerTransactions(customerId)
  }, [customerId, fetchCustomerTransactions])

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>Recent transactions for this customer</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No transactions found</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Receipt No.</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{new Date(transaction.transactionDate).toLocaleDateString()}</TableCell>
                  <TableCell>{transaction.channel.name}</TableCell>
                  <TableCell>KSh {Number(transaction.amount).toLocaleString()}</TableCell>
                  <TableCell>{transaction.mpesaReceiptNumber || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={transaction.status === "completed" ? "default" : "outline"}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
