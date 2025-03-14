"use client"

import { Clock, X } from "lucide-react"

interface KybIssue {
  field: string
  issue: string
  required: boolean
}

interface KybStatusCardProps {
  status: string
  issues?: KybIssue[]
  onUpdateKyb: () => void
}

export default function KybStatusCard({ status, issues = [], onUpdateKyb }: KybStatusCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">KYB Status</h2>
      <div className="space-y-4">
        <div className="flex items-center">
          <div className={`p-2 rounded-full ${status === "pending" ? "bg-yellow-100" : "bg-red-100"}`}>
            {status === "pending" ? (
              <Clock className="h-4 w-4 text-yellow-600" />
            ) : (
              <X className="h-4 w-4 text-red-600" />
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {status === "pending" ? "Under Review" : "Updates Required"}
            </p>
            <p className="text-xs text-gray-500">
              {status === "pending" ? "Submitted on March 15, 2023" : "Reviewed on March 16, 2023"}
            </p>
          </div>
        </div>

        {status === "rejected" && issues && issues.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Issues to Address:</h3>
            <ul className="space-y-2">
              {issues.map((issue, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 text-red-500">•</span>
                  <span className="ml-2 text-sm text-gray-700">
                    <span className="font-medium">{issue.field}:</span> {issue.issue}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={onUpdateKyb}
          className="w-full mt-4 bg-emerald-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          Update KYB Information
        </button>
      </div>
    </div>
  )
}

