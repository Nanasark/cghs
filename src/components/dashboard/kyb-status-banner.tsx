"use client"

import { Clock, ShieldCheck, X } from "lucide-react"

interface KybStatusBannerProps {
  status: string
  feedback?: string
  onUpdateKyb: () => void
  onToggleStatus: () => void
}

export default function KybStatusBanner({ status, feedback, onUpdateKyb, onToggleStatus }: KybStatusBannerProps) {
  return (
    <div
      className={`mb-6 p-4 rounded-lg ${
        status === "approved"
          ? "bg-green-50 border border-green-200"
          : status === "rejected"
            ? "bg-red-50 border border-red-200"
            : "bg-yellow-50 border border-yellow-200"
      }`}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {status === "approved" ? (
            <ShieldCheck className="h-5 w-5 text-green-500" />
          ) : status === "rejected" ? (
            <X className="h-5 w-5 text-red-500" />
          ) : (
            <Clock className="h-5 w-5 text-yellow-500" />
          )}
        </div>
        <div className="ml-3">
          <h3
            className={`text-sm font-medium ${
              status === "approved" ? "text-green-800" : status === "rejected" ? "text-red-800" : "text-yellow-800"
            }`}
          >
            {status === "approved"
              ? "KYB Verification Approved"
              : status === "rejected"
                ? "KYB Verification Rejected"
                : "KYB Verification Pending"}
          </h3>
          <div
            className={`mt-1 text-sm ${
              status === "approved" ? "text-green-700" : status === "rejected" ? "text-red-700" : "text-yellow-700"
            }`}
          >
            {status === "approved" ? (
              <p>Your business has been verified. You now have full access to all cGHS features.</p>
            ) : status === "rejected" ? (
              <div>
                <p>Your KYB verification was not approved. Please review the feedback below:</p>
                <p className="mt-1 font-medium">{feedback}</p>
                <button onClick={onUpdateKyb} className="mt-2 text-red-700 hover:text-red-800 font-medium underline">
                  Update KYB Information
                </button>
              </div>
            ) : (
              <div>
                <p>Your KYB verification is currently under review. This process typically takes 1-3 business days.</p>
                <button
                  onClick={onUpdateKyb}
                  className="mt-2 text-yellow-700 hover:text-yellow-800 font-medium underline"
                >
                  Update KYB Information
                </button>
              </div>
            )}
          </div>
        </div>

        {/* For demo purposes only - toggle KYB status */}
        <button onClick={onToggleStatus} className="ml-auto text-xs text-gray-500 underline">
          Demo: Change Status
        </button>
      </div>
    </div>
  )
}

