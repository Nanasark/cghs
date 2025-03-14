import type React from "react"
import { ThirdwebProvider } from "thirdweb/react"
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-gray-50">
    <ThirdwebProvider>
      {children}
  </ThirdwebProvider>
  </div>
}

