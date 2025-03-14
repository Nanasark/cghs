"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react"

// Mock data - in a real app, this would come from your API based on the ID
const mockApplication = {
  id: "APP123",
  businessName: "Accra Fintech Ltd",
  isRegistered: true,
  contactName: "Kwame Mensah",
  email: "kwame@accrafintech.com",
  date: "2023-03-12",
  status: "pending",
  documents: [
    { name: "Business Registration Certificate", url: "#" },
    { name: "Tax Certificate", url: "#" },
    { name: "Director's ID", url: "#" },
  ],
}

export default function KYBApplicationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [application, setApplication] = useState(mockApplication)
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [note, setNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleApprove = async () => {
    setIsSubmitting(true)

    try {
      // In a real app, you would make an API call here
      console.log("Approving application", application.id, "with note:", note, params)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local state
      setApplication({
        ...application,
        status: "approved",
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
    setIsSubmitting(true)

    try {
      // In a real app, you would make an API call here
      console.log("Rejecting application", application.id, "with note:", note)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local state
      setApplication({
        ...application,
        status: "rejected",
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
                  <dd className="text-sm text-gray-900 col-span-2">{application.businessName}</dd>
                </div>
                <div className="py-3 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Registered Business</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{application.isRegistered ? "Yes" : "No"}</dd>
                </div>
                <div className="py-3 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Contact Person</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{application.contactName}</dd>
                </div>
                <div className="py-3 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{application.email}</dd>
                </div>
                <div className="py-3 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Application Date</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{application.date}</dd>
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
                {application.documents.map((doc, index) => (
                  <li key={index} className="py-3 flex justify-between items-center">
                    <span className="text-sm text-gray-900">{doc.name}</span>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                    >
                      View Document
                    </a>
                  </li>
                ))}
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
                <span className="text-sm text-gray-500">Last updated: {application.date}</span>
              </div>
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
                  onClick={() => {
                    setApplication({ ...application, status: "pending" })
                    alert("Application status reset to pending")
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

