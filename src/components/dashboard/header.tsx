"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Bell, ChevronDown, FileText, X } from "lucide-react"
import EmailLogin from "../login/withEmail"

interface Notification {
  id: number
  type: string
  message: string
  date: string
  read: boolean
}

interface HeaderProps {
  businessName: string
  notifications: Notification[]
}

export default function Header({ businessName, notifications }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Image src="/logo.svg" alt="cGHS Logo" width={32} height={32} className="h-8 w-auto" />
            <span className="ml-2 text-lg font-semibold text-emerald-700">cGHS</span>
          </div>

          <div className="flex items-center space-x-4">
               <EmailLogin label="sign in" />
            <div className="relative">
              <button
                className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-6 w-6" />
                {notifications.some((n) => !n.read) && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                    <button className="text-gray-400 hover:text-gray-500" onClick={() => setShowNotifications(false)}>
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 border-b border-gray-100 hover:bg-gray-50 ${!notification.read ? "bg-blue-50" : ""}`}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              {notification.type === "kyb" ? (
                                <FileText className="h-5 w-5 text-blue-500" />
                              ) : (
                                <Bell className="h-5 w-5 text-emerald-500" />
                              )}
                            </div>
                            <div className="ml-3 flex-1">
                              <p className="text-sm text-gray-900">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(notification.date)} at {formatTime(notification.date)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
            
                  <div className="p-2 border-t border-gray-200">
                    <Link
                      href="/notifications"
                      className="block text-center text-xs text-emerald-600 hover:text-emerald-700"
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button className="flex items-center space-x-1 text-sm text-gray-700 hover:text-gray-900 focus:outline-none">
                <span>{businessName}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

