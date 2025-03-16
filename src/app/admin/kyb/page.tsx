"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Search, Loader2 } from "lucide-react"

import { Suspense } from "react";


export default function KYBWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <KYBApplicationsPage />
    </Suspense>
  );
}


interface KYBApplication {
  id: string
  businessName: string
  contactName: string
  email: string
  date: string
  status: "pending" | "approved" | "rejected"
}

function KYBApplicationsPage() {
  const searchParams = useSearchParams()
  const initialStatus = searchParams.get("status") || "all"

  const [statusFilter, setStatusFilter] = useState(initialStatus)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const [applications, setApplications] = useState<KYBApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch KYB applications from the server
  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/admin/kyb-applications")

        if (!response.ok) {
          throw new Error(`Error fetching applications: ${response.statusText}`)
        }

        const data = await response.json()
        setApplications(data)
      } catch (err) {
        console.error("Failed to fetch KYB applications:", err)
        setError("Failed to load applications. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchApplications()
  }, [])

  // Filter applications based on status and search query
  const filteredApplications = applications.filter((app) => {
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    const matchesSearch =
      app.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">KYB Applications</h1>
        <p className="mt-1 text-sm text-gray-500">Review and manage business verification applications</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="pb-3 border-b mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Applications</h2>
          <p className="text-sm text-gray-500">View and manage all KYB applications in the system</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search applications..."
              className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative w-full md:w-[180px]">
            <div
              className="flex justify-between items-center w-full rounded-md border border-gray-300 py-2 px-3 text-sm bg-white cursor-pointer"
              onClick={() => setIsSelectOpen(!isSelectOpen)}
            >
              <span className="text-gray-900">
                {statusFilter === "all"
                  ? "All Applications"
                  : statusFilter === "pending"
                    ? "Pending Review"
                    : statusFilter === "approved"
                      ? "Approved"
                      : "Rejected"}
              </span>
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                <path d="M7 7l3 3 3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {isSelectOpen && (
              <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
                <div className="py-1">
                  {[
                    { value: "all", label: "All Applications" },
                    { value: "pending", label: "Pending Review" },
                    { value: "approved", label: "Approved" },
                    { value: "rejected", label: "Rejected" },
                  ].map((option) => (
                    <div
                      key={option.value}
                      className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                        statusFilter === option.value ? "bg-emerald-50 text-emerald-700" : "text-gray-700"
                      }`}
                      onClick={() => {
                        setStatusFilter(option.value)
                        setIsSelectOpen(false)
                      }}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
            <span className="ml-3 text-gray-600">Loading applications...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="rounded-md border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Application ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Business Name
                  </th>
                  <th
                    scope="col"
                    className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Contact Person
                  </th>
                  <th
                    scope="col"
                    className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">
                      No applications found
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.businessName}</td>
                      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {app.contactName}
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {app.email}
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {app.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            app.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : app.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/admin/kyb/${app.id}`}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

