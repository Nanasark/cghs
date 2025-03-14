"use client"

import { ChevronDown, ExternalLink, FileText, Lock, User } from "lucide-react"

interface QuickActionsCardProps {
  kybStatus: string
  onUpdateKyb: () => void
}

export default function QuickActionsCard({ kybStatus, onUpdateKyb }: QuickActionsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 relative overflow-hidden">
      {kybStatus !== "approved" && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
          <Lock className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-gray-600 font-medium text-center max-w-xs">
            Complete KYB verification to access these features
          </p>
          <button
            onClick={onUpdateKyb}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700"
          >
            Update KYB Information
          </button>
        </div>
      )}

      <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
      <div className="space-y-3">
        <button className="w-full flex items-center justify-between p-3 rounded-md border border-gray-200 hover:bg-gray-50">
          <div className="flex items-center">
            <User className="h-5 w-5 text-gray-500" />
            <span className="ml-3 text-sm text-gray-700">Send to Contact</span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>

        <button className="w-full flex items-center justify-between p-3 rounded-md border border-gray-200 hover:bg-gray-50">
          <div className="flex items-center">
            <ExternalLink className="h-5 w-5 text-gray-500" />
            <span className="ml-3 text-sm text-gray-700">External Transfer</span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>

        <button className="w-full flex items-center justify-between p-3 rounded-md border border-gray-200 hover:bg-gray-50">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-gray-500" />
            <span className="ml-3 text-sm text-gray-700">Generate Statement</span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>
      </div>
    </div>
  )
}

