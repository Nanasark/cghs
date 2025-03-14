"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, XCircle, Loader2 } from "lucide-react"

// Define the KYB application interface
interface KYBDocument {
  url: string
  format: string
  publicId: string
  uploadedAt: string
  resourceType: string
  value?: string
}

interface KYBApplication {
  id: string
  businessDetails: {
    businessName: string
    addressLine1: string
    addressLine2?: string
    cityRegion: string
    state: string
    country: string
    jurisdiction: string
    phoneNumber: string
  }
  documents: Record<string, KYBDocument>
  status: "pending" | "approved" | "rejected"
  feedback?: string
  submittedAt: string
  updatedAt?: string
}

// Properly type the page component props according to Next.js App Router
export default function KYBApplicationDetailPage({
  params,
}: {
  params: {
    id: string
  }
}) {
  const router = useRouter()
  const [application, setApplication] = useState<KYBApplication | null>(null)
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [note, setNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch KYB application details from the server
  useEffect(() => {
    const fetchApplicationDetails = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // const response = await fetch(`/api/admin/kyb-applications/${params.id}`)
        // const response

        // if (!response.ok) {
        //   throw new Error(`Error fetching application: ${response.statusText}`)
        // }

        // const data = await response.json()
        // setApplication(data)
      } catch (err) {
        console.error("Failed to fetch KYB application details:", err)
        setError("Failed to load application details. Please try again.")
        // Fallback to mock data in case of error
        setApplication(mockApplication)
      } finally {
        setIsLoading(false)
      }
    }

    fetchApplicationDetails()
  }, [params.id])

  const handleApprove = async () => {
    if (!application) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/admin/kyb-applications/${application.id}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ feedback: note }),
      })

      if (!response.ok) {
        throw new Error(`Error approving application: ${response.statusText}`)
      }

      // Update local state
      setApplication({
        ...application,
        status: "approved",
        feedback: note || undefined,
        updatedAt: new Date().toISOString(),
      })

      // Close dialog
      setIsApproveDialogOpen(false)
      setNote("")

      // Show success message (in a real app, you might use a toast)
      alert("Application approved successfully. Email notification sent to the applicant.")
    } catch (error) {
      console.error("Error approving application:", error)
      alert("Failed to approve application. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (!application) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/admin/kyb-applications/${application.id}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ feedback: note }),
      })

      if (!response.ok) {
        throw new Error(`Error rejecting application: ${response.statusText}`)
      }

      // Update local state
      setApplication({
        ...application,
        status: "rejected",
        feedback: note,
        updatedAt: new Date().toISOString(),
      })

      // Close dialog
      setIsRejectDialogOpen(false)
      setNote("")

      // Show success message (in a real app, you might use a toast)
      alert("Application rejected. Email notification sent to the applicant.")
    } catch (error) {
      console.error("Error rejecting application:", error)
      alert("Failed to reject application. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Mock data as fallback
  const mockApplication: KYBApplication = {
    id: params.id,
    businessDetails: {
      businessName: "Accra Fintech Ltd",
      addressLine1: "123 Main Street",
      addressLine2: "Suite 101",
      cityRegion: "Accra",
      state: "Greater Accra",
      country: "Ghana",
      jurisdiction: "Ghana",
      phoneNumber: "+233 20 123 4567",
    },
    documents: {
      incorporation: {
        url: "#",
        format: "pdf",
        publicId: "mock-id",
        uploadedAt: new Date().toISOString(),
        resourceType: "image",
      },
      articles: {
        url: "#",
        format: "pdf",
        publicId: "mock-id",
        uploadedAt: new Date().toISOString(),
        resourceType: "image",
      },
      representativeId: {
        url: "#",
        format: "pdf",
        publicId: "mock-id",
        uploadedAt: new Date().toISOString(),
        resourceType: "image",
      },
    },
    status: "pending",
    submittedAt: new Date().toISOString(),
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
        <span className="ml-3 text-gray-600">Loading application details...</span>
      </div>
    )
  }

  if (error || !application) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error || "Failed to load application details"}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 mr-4"
        >
          Go Back
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Application Details</h1>
        </div>
        <div className="flex space-x-2">
          {application.status === "pending" && (
            <>
              <button
                className="inline-flex items-center px-3 py-2 border border-red-200 text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50"
                onClick={() => setIsRejectDialogOpen(true)}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </button>
              <button
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setIsApproveDialogOpen(true)}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b">
              <h3 className="text-lg font-medium text-gray-900">Business Information</h3>
              <p className="mt-1 text-sm text-gray-500">Details provided during the KYB application process</p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <dl className="divide-y divide-gray-200">
                <div className="py-3 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Application ID</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{application.id}</dd>
                </div>
                <div className="py-3 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Business Name</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{application.businessDetails.businessName}</dd>
                </div>
                <div className="py-3 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="text-sm text-gray-900 col-span-2">
                    {application.businessDetails.addressLine1}
                    {application.businessDetails.addressLine2 && <br />}
                    {application.businessDetails.addressLine2}
                    <br />
                    {application.businessDetails.cityRegion}, {application.businessDetails.state}
                    <br />
                    {application.businessDetails.country}
                  </dd>
                </div>
                <div className="py-3 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Jurisdiction</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{application.businessDetails.jurisdiction}</dd>
                </div>
                <div className="py-3 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{application.businessDetails.phoneNumber}</dd>
                </div>
                <div className="py-3 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Application Date</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{formatDate(application.submittedAt)}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b">
              <h3 className="text-lg font-medium text-gray-900">Submitted Documents</h3>
              <p className="mt-1 text-sm text-gray-500">Documents uploaded by the applicant for verification</p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <ul className="divide-y divide-gray-200">
                {Object.entries(application.documents).map(
                  ([key, doc]) =>
                    // Skip non-document entries (like controller types which are stored as values)
                    doc.url && (
                      <li key={key} className="py-3 flex justify-between items-center">
                        <span className="text-sm text-gray-900">
                          {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                        >
                          View Document
                        </a>
                      </li>
                    ),
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b">
              <h3 className="text-lg font-medium text-gray-900">Application Status</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    application.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : application.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </span>
                <span className="text-sm text-gray-500">
                  Last updated: {formatDate(application.updatedAt || application.submittedAt)}
                </span>
              </div>

              {application.feedback && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <h4 className="text-sm font-medium text-gray-700">Feedback:</h4>
                  <p className="mt-1 text-sm text-gray-600">{application.feedback}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b">
              <h3 className="text-lg font-medium text-gray-900">Admin Actions</h3>
              <p className="mt-1 text-sm text-gray-500">Manage this KYB application</p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="text-sm text-gray-500">
                {application.status === "pending" ? (
                  <p>
                    This application is awaiting your review. Please approve or reject based on the provided information
                    and documents.
                  </p>
                ) : application.status === "approved" ? (
                  <p>This application has been approved. The applicant has been notified via email.</p>
                ) : (
                  <p>This application has been rejected. The applicant has been notified via email.</p>
                )}
              </div>
            </div>
            <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t flex justify-between">
              <button
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                onClick={() => router.back()}
              >
                Back to List
              </button>
              {application.status !== "pending" && (
                <button
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  onClick={async () => {
                    try {
                      const response = await fetch(`/api/admin/kyb-applications/${application.id}/reset`, {
                        method: "POST",
                      })

                      if (!response.ok) {
                        throw new Error("Failed to reset status")
                      }

                      setApplication({ ...application, status: "pending", feedback: undefined })
                      alert("Application status reset to pending")
                    } catch (error) {
                      console.error("Error resetting status:", error)
                      alert("Failed to reset application status")
                    }
                  }}
                >
                  Reset Status
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Approve Dialog */}
      {isApproveDialogOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Approve KYB Application</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        This will approve the application and send an email notification to the applicant.
                      </p>
                    </div>
                    <div className="mt-4">
                      <label htmlFor="approve-note" className="block text-sm font-medium text-gray-700">
                        Approval Note (Optional)
                      </label>
                      <textarea
                        id="approve-note"
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                        placeholder="Add any additional information for the applicant..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        This note will be included in the email sent to the applicant.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleApprove}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Approving..." : "Approve Application"}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsApproveDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Dialog */}
      {isRejectDialogOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Reject KYB Application</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        This will reject the application and send an email notification to the applicant.
                      </p>
                    </div>
                    <div className="mt-4">
                      <label htmlFor="reject-note" className="block text-sm font-medium text-gray-700">
                        Rejection Note
                      </label>
                      <textarea
                        id="reject-note"
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                        placeholder="Explain why this application is being rejected..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        This note will be included in the email sent to the applicant.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleReject}
                  disabled={isSubmitting || !note.trim()}
                >
                  {isSubmitting ? "Rejecting..." : "Reject Application"}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsRejectDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

