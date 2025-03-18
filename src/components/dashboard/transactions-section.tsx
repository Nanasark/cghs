"use client"

import { useState } from "react"
import DepositCard from "./deposit-card"
import WithdrawalCard from "./withdrawal-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TransactionsSectionProps {
  kybStatus: string
  onBalanceUpdate: () => void
}

export default function TransactionsSection({ kybStatus, onBalanceUpdate }: TransactionsSectionProps) {
  const [activeTab, setActiveTab] = useState<string>("deposit")

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Transactions</h2>

        <Tabs defaultValue="deposit" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          </TabsList>

          <TabsContent value="deposit">
            <DepositCard onBalanceUpdate={onBalanceUpdate} kybStatus={kybStatus} />
          </TabsContent>

          <TabsContent value="withdraw">
            <WithdrawalCard onBalanceUpdate={onBalanceUpdate} kybStatus={kybStatus} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

