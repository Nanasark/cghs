"use client"
import Link from "next/link"
import { FileText, UserCheck, UserX, Clock, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
interface KYBApplication {
  id: string
  businessName: string
  contactName: string
  email: string
  date: string
  status: "pending" | "approved" | "rejected"
}

export default function AdminDashboard() {
  // In a real application, these would come from your database
    const [applications, setApplications] = useState<KYBApplication[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
  const stats = [
    { name: "Total Applications", value: 42, icon: FileText, href: "/admin/kyb" },
    { name: "Pending Review", value: 12, icon: Clock, href: "/admin/kyb?status=pending" },
    { name: "Approved", value: 24, icon: UserCheck, href: "/admin/kyb?status=approved" },
    { name: "Rejected", value: 6, icon: UserX, href: "/admin/kyb?status=rejected" },
  ]

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
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of KYB applications and system status</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.name} href={stat.href}>
            <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-emerald-100 text-emerald-600">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Applications</h2>
          
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
                  ) :
          <div className="space-y-4">
            
            {applications.slice(0, 4).map((app) => (
              <Link
                key={app.id}
                href={`/admin/kyb/${app.id}`}
                className="block p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{app.businessName}</p>
                    <p className="text-sm text-gray-500">Application ID: {app.id.slice(0, 6)}...</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">{app.date}</span>
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
                  </div>
                </div>
              </Link>
            ))}
          </div>
          }
          <div className="mt-4">
            <Link href="/admin/kyb" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
              View all applications →
            </Link>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">System Status</h2>
          <div className="space-y-4">
            {[
              { name: "API Services", status: "operational" },
              { name: "Email Notifications", status: "operational" },
              { name: "Database", status: "operational" },
              { name: "KYB Verification", status: "operational" },
            ].map((service) => (
              <div key={service.name} className="flex justify-between items-center p-3 border-b border-gray-200">
                <span className="text-gray-900">{service.name}</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Operational
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

