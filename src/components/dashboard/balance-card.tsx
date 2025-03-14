"use client"

import { Download, Lock, Upload } from "lucide-react"

interface BalanceCardProps {
  balance: number
  kybStatus: string
  onUpdateKyb: () => void
}

export default function BalanceCard({ balance, kybStatus, onUpdateKyb }: BalanceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 relative overflow-hidden">
      {kybStatus !== "approved" && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
          <Lock className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-gray-600 font-medium text-center max-w-xs">
            Complete KYB verification to access your cGHS wallet
          </p>
          <button
            onClick={onUpdateKyb}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700"
          >
            Update KYB Information
          </button>
        </div>
      )}

      <h2 className="text-lg font-medium text-gray-900 mb-4">cGHS Balance</h2>
      <div className="flex items-baseline">
        <span className="text-3xl font-bold text-gray-900">{balance.toFixed(2)}</span>
        <span className="ml-1 text-gray-500">cGHS</span>
      </div>

      <div className="mt-6 flex space-x-3">
        <button className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
          <div className="flex items-center justify-center">
            <Download className="h-4 w-4 mr-2" />
            <span>Buy cGHS</span>
          </div>
        </button>
        <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
          <div className="flex items-center justify-center">
            <Upload className="h-4 w-4 mr-2" />
            <span>Sell cGHS</span>
          </div>
        </button>
      </div>
    </div>
  )
}

