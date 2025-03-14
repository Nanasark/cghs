"use client"

import { useState, useEffect } from "react"
import Header from "@/components/dashboard/header"
import KybStatusBanner from "@/components/dashboard/kyb-status-banner"
import DashboardTabs from "@/components/dashboard/dashboard-tabs"
import BalanceCard from "@/components/dashboard/balance-card"
import TransactionsCard from "@/components/dashboard/transactions-card"
import KybStatusCard from "@/components/dashboard/kyb-status-card"
import KybDocumentsCard from "@/components/dashboard/kyb-documents-card"
import QuickActionsCard from "@/components/dashboard/quick-actions-card"
import HelpSupportCard from "@/components/dashboard/help-support-card"
import UpdateKybModal from "@/components/dashboard/update-kyb-modal"
import { getUserKybData } from "@/app/actions/get-user-kyb-data"
import { FileText } from "lucide-react"
import { useActiveAccount } from "thirdweb/react"


interface KYBDocument {
  url: string
  format: string
  publicId: string
  uploadedAt: string // Can be converted to Date if needed
  resourceType: string
}

type KYBDocuments = Record<string, KYBDocument>

// Mock data - in a real app, this would come from your API
const mockUser = {
  businessName: "Accra Fintech Ltd",
  kybStatus: "pending", // "pending", "approved", "rejected"
  balance: 5000,
  notifications: [
    {
      id: 1,
      type: "kyb",
      message: "Your KYB verification is under review. We'll notify you once it's complete.",
      date: "2023-03-15T10:30:00Z",
      read: false,
    },
    {
      id: 2,
      type: "transaction",
      message: "You've received 500 cGHS from Ghana Traders Co.",
      date: "2023-03-14T14:45:00Z",
      read: true,
    },
  ],
  transactions: [
    { id: "TX123", type: "receive", amount: 500, from: "Ghana Traders Co.", date: "2023-03-14T14:45:00Z" },
    { id: "TX122", type: "send", amount: 200, to: "Kumasi Retail Group", date: "2023-03-10T09:30:00Z" },
    { id: "TX121", type: "receive", amount: 1000, from: "Initial Deposit", date: "2023-03-05T11:15:00Z" },
  ],
  kybFeedback:
    "We need additional documentation for your business registration. Please upload a certified copy of your business registration certificate.",
  kybIssues: [
    {
      field: "Business Registration Certificate",
      issue: "Document is not certified",
      required: true,
    },
    {
      field: "Director's ID",
      issue: "Document is expired",
      required: true,
    },
  ],
}

export default function Dashboard() {
  const [user, setUser] = useState(mockUser)
  const [activeTab, setActiveTab] = useState("overview")
  const [kybStatus, setKybStatus] = useState(user.kybStatus)
  const [showUpdateKybModal, setShowUpdateKybModal] = useState(false)
  const [kybDocuments, setKybDocuments] = useState<KYBDocuments>({})
  const [isLoading, setIsLoading] = useState(true)
  const account = useActiveAccount()
  const address = account? account.address:""
  // Fetch KYB data on component mount
  useEffect(() => {
    async function fetchKybData() {
      try {
        setIsLoading(true)
        const data = await getUserKybData(address)

        if (data) {
          // Update KYB status if available
          if (data.status) {
            setKybStatus(data.status)
            setUser((prev) => ({ ...prev, kybStatus: data.status }))
          }

          // Set KYB documents if available
          if (data.document_references) {
            setKybDocuments(data.document_references)
          }
        }
        console.log(address)
        console.log(data)
      } catch (error) {
        console.error("Error fetching KYB data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchKybData()
  }, [address])

  // For demo purposes - toggle KYB status
  const toggleKybStatus = () => {
    const newStatus = kybStatus === "approved" ? "pending" : kybStatus === "pending" ? "rejected" : "approved"

    setKybStatus(newStatus)
    setUser({ ...user, kybStatus: newStatus })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header businessName={user.businessName} notifications={user.notifications} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <KybStatusBanner
          status={kybStatus}
          feedback={user.kybFeedback}
          onUpdateKyb={() => setShowUpdateKybModal(true)}
          onToggleStatus={toggleKybStatus}
        />

        <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <BalanceCard
                balance={user.balance}
                kybStatus={kybStatus}
                onUpdateKyb={() => setShowUpdateKybModal(true)}
              />

              <TransactionsCard
                transactions={user.transactions}
                kybStatus={kybStatus}
                onUpdateKyb={() => setShowUpdateKybModal(true)}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {kybStatus !== "approved" && (
                <KybStatusCard
                  status={kybStatus}
                  issues={user.kybIssues}
                  onUpdateKyb={() => setShowUpdateKybModal(true)}
                />
              )}

              <QuickActionsCard kybStatus={kybStatus} onUpdateKyb={() => setShowUpdateKybModal(true)} />

              <HelpSupportCard />
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="space-y-6">
            {isLoading ? (
              <div className="bg-white rounded-lg shadow-sm p-6 flex justify-center items-center h-64">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
                <span className="ml-3 text-gray-600">Loading documents...</span>
              </div>
            ) : Object.keys(kybDocuments).length > 0 ? (
              <KybDocumentsCard documents={kybDocuments} kybStatus={kybStatus} />
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Documents Found</h3>
                <p className="text-gray-500">You haven&apos;t uploaded any KYB documents yet.</p>
                <button
                  onClick={() => setShowUpdateKybModal(true)}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700"
                >
                  Upload Documents
                </button>
              </div>
            )}
          </div>
        )}

        {/* Other tabs content */}
        {activeTab === "transactions" && (
          <div className="space-y-6">
            <TransactionsCard
              transactions={user.transactions}
              kybStatus={kybStatus}
              onUpdateKyb={() => setShowUpdateKybModal(true)}
              showAll={true}
            />
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            {/* Settings content */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h2>
              <p className="text-gray-500">Settings content will go here.</p>
            </div>
          </div>
        )}
      </main>

      {/* Update KYB Modal */}
      {showUpdateKybModal && (
        <UpdateKybModal
          isOpen={showUpdateKybModal}
          onClose={() => setShowUpdateKybModal(false)}
          kybStatus={kybStatus}
          kybIssues={user.kybIssues}
        />
      )}
    </div>
  )
}

