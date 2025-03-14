"use client"

import Link from "next/link"
import { Download, Lock, Upload } from "lucide-react"

interface Transaction {
  id: string
  type: string
  amount: number
  from?: string
  to?: string
  date: string
}

interface TransactionsCardProps {
  transactions: Transaction[]
  kybStatus: string
  onUpdateKyb: () => void
  showAll?: boolean
}

export default function TransactionsCard({
  transactions,
  kybStatus,
  onUpdateKyb,
  showAll = false,
}: TransactionsCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatAmount = (amount: number, type: string) => {
    return type === "send" ? `-${amount.toFixed(2)}` : `+${amount.toFixed(2)}`
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 relative overflow-hidden">
      {kybStatus !== "approved" && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
          <Lock className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-gray-600 font-medium text-center max-w-xs">
            Complete KYB verification to view your transaction history
          </p>
          <button
            onClick={onUpdateKyb}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700"
          >
            Update KYB Information
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">{showAll ? "Transaction History" : "Recent Transactions"}</h2>
        {!showAll && (
          <Link href="/transactions" className="text-sm text-emerald-600 hover:text-emerald-700">
            View all
          </Link>
        )}
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500">No transactions yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {(showAll ? transactions : transactions.slice(0, 3)).map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-full ${transaction.type === "receive" ? "bg-green-100" : "bg-blue-100"}`}>
                  {transaction.type === "receive" ? (
                    <Download className={`h-4 w-4 text-green-600`} />
                  ) : (
                    <Upload className={`h-4 w-4 text-blue-600`} />
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {transaction.type === "receive" ? "Received from" : "Sent to"}{" "}
                    {transaction.type === "receive" ? transaction.from : transaction.to}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(transaction.date)} at {formatTime(transaction.date)}
                  </p>
                </div>
              </div>
              <div
                className={`text-sm font-medium ${transaction.type === "receive" ? "text-green-600" : "text-blue-600"}`}
              >
                {formatAmount(transaction.amount, transaction.type)} cGHS
              </div>
            </div>
          ))}
        </div>
      )}

      {showAll && transactions.length > 5 && (
        <div className="mt-4 text-center">
          <button className="text-sm text-emerald-600 hover:text-emerald-700">Load More</button>
        </div>
      )}
    </div>
  )
}

