    import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
    import { Badge } from "@/components/ui/badge"
    import type { TransactionWithRelations } from "@/lib/store/transaction-store"

    export function TransactionList({ transactions = [] }: { transactions: TransactionWithRelations[] }) {
    if (!Array.isArray(transactions)) {
        return <div className="text-center py-4 text-muted-foreground">No transactions available</div>
    }

    return (
        <div className="space-y-8">
        {transactions.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No transactions found</div>
        ) : (
            transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center">
                <Avatar className="h-9 w-9 flex-shrink-0">
                <AvatarImage src={`/placeholder.svg?height=36&width=36`} alt={transaction.customer.name} />
                <AvatarFallback>{transaction.customer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{transaction.customer.name}</p>
                <p className="text-sm text-muted-foreground">
                    {new Date(transaction.transactionDate).toLocaleDateString()} via {transaction.channel.name}
                </p>
                </div>
                <div className="ml-auto font-medium">
                <Badge variant={transaction.status === "completed" ? "default" : "outline"}>
                    {transaction.status === "completed" ? "Success" : "Failed"}
                </Badge>
                </div>
                <div className="ml-4 font-medium">KSh {Number(transaction.amount).toLocaleString()}</div>
            </div>
            ))
        )}
        </div>
    )
    }
