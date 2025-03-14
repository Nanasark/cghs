"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Search } from "lucide-react"

// Mock data - in a real app, this would come from your API
const mockApplications = [
  {
    id: "APP123",
    businessName: "Accra Fintech Ltd",
    contactName: "Kwame Mensah",
    email: "kwame@accrafintech.com",
    date: "2023-03-12",
    status: "pending",
  },
  {
    id: "APP122",
    businessName: "Ghana Traders Co.",
    contactName: "Ama Owusu",
    email: "ama@ghanatraders.com",
    date: "2023-03-11",
    status: "approved",
  },
  {
    id: "APP121",
    businessName: "Kumasi Retail Group",
    contactName: "Kofi Boateng",
    email: "kofi@kumasiretail.com",
    date: "2023-03-10",
    status: "rejected",
  },
  {
    id: "APP120",
    businessName: "Tema Exports Inc.",
    contactName: "Abena Mensah",
    email: "abena@temaexports.com",
    date: "2023-03-09",
    status: "approved",
  },
  {
    id: "APP119",
    businessName: "Cape Coast Services",
    contactName: "Yaw Darko",
    email: "yaw@capecoastservices.com",
    date: "2023-03-08",
    status: "pending",
  },
  {
    id: "APP118",
    businessName: "Takoradi Shipping Ltd",
    contactName: "Akua Asante",
    email: "akua@takoradishipping.com",
    date: "2023-03-07",
    status: "approved",
  },
  {
    id: "APP117",
    businessName: "Ho Valley Tech",
    contactName: "Kwesi Ampofo",
    email: "kwesi@hovalleytech.com",
    date: "2023-03-06",
    status: "rejected",
  },
  {
    id: "APP116",
    businessName: "Tamale Agri Solutions",
    contactName: "Gifty Adu",
    email: "gifty@tamaleagri.com",
    date: "2023-03-05",
    status: "pending",
  },
]

export default function KYBApplicationsPage() {
  const searchParams = useSearchParams()
  const initialStatus = searchParams.get("status") || "all"

  const [statusFilter, setStatusFilter] = useState(initialStatus)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSelectOpen, setIsSelectOpen] = useState(false)

  const filteredApplications = mockApplications.filter((app) => {
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    const matchesSearch =
      app.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatus && matchesSearch
  })

  return (
     <Suspense fallback={<div>Loading...</div>}>
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
      </div>
      </div>
       </Suspense>
  )
   
}

