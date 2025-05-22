import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function CustomerListSkeleton() {
  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="ml-auto h-10 w-[100px]" />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-5 w-[100px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-[100px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-[100px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-[100px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-[100px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-[50px]" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-5 w-[20px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-[150px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-[120px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-[100px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-[100px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-[30px]" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
