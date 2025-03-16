"use client"

import type React from "react"

import { ReactNode, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, FileText, Settings, LogOut, Menu, X } from "lucide-react"
import AdminAuthWrapper from "@/components/admin-auth-wrapper"
import { ThirdwebProvider } from "thirdweb/react"


export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ThirdwebProvider>
    <AdminAuthWrapper>
      <AdminLayoutContent>{children}</AdminLayoutContent>
      </AdminAuthWrapper>
    </ThirdwebProvider>
  )
}



 function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "KYB Applications", href: "/admin/kyb", icon: FileText },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <div
          className="fixed inset-0 bg-gray-900/80 z-40"
          style={{ display: sidebarOpen ? "block" : "none" }}
          onClick={() => setSidebarOpen(false)}
        />

        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transition-transform duration-300 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <div className="flex items-center">
              <Image src="/logo.svg" alt="cGHS Logo" width={32} height={32} />
              <span className="ml-2 text-lg font-semibold text-emerald-700">cGHS Admin</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  pathname === item.href ? "bg-emerald-100 text-emerald-700" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="border-t border-gray-200 p-4">
            <Link
              href="/admin/logout"
              className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Log out
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-4 border-b">
            <Image src="/logo.svg" alt="cGHS Logo" width={32} height={32} />
            <span className="ml-2 text-lg font-semibold text-emerald-700">cGHS Admin</span>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  pathname === item.href ? "bg-emerald-100 text-emerald-700" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="border-t border-gray-200 p-4">
            <Link
              href="/admin/logout"
              className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Log out
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 flex items-center h-16 bg-white border-b border-gray-200 lg:hidden">
          <button
            type="button"
            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 flex justify-center">
            <Image src="/logo.svg" alt="cGHS Logo" width={32} height={32} />
            <span className="ml-2 text-lg font-semibold text-emerald-700">cGHS Admin</span>
          </div>
          <div className="w-14"></div> {/* Spacer to center the logo */}
        </div>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

