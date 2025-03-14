"use client"

interface DashboardTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function DashboardTabs({ activeTab, onTabChange }: DashboardTabsProps) {
  return (
    <div className="mb-6 border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => onTabChange("overview")}
          className={`pb-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === "overview"
              ? "border-emerald-500 text-emerald-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => onTabChange("documents")}
          className={`pb-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === "documents"
              ? "border-emerald-500 text-emerald-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Documents
        </button>
        <button
          onClick={() => onTabChange("transactions")}
          className={`pb-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === "transactions"
              ? "border-emerald-500 text-emerald-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Transactions
        </button>
        <button
          onClick={() => onTabChange("settings")}
          className={`pb-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === "settings"
              ? "border-emerald-500 text-emerald-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Settings
        </button>
      </nav>
    </div>
  )
}

