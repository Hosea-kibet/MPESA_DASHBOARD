import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function PaymentHistorySkeleton() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>Recent transactions for this customer</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-5 w-[80px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-[80px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-[80px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-[80px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-[80px]" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-5 w-[100px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-[80px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-[80px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-[100px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-[80px]" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
