"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAdmin } from "@/lib/auth"
import UnauthorizedPage from "@/app/unauthorized/page"
import { getUserEmail } from "thirdweb/wallets/in-app";
import { client } from "@/app/client"






export default function AdminAuthWrapper({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      try {
        // Get the user's email from your web3 provider
        const email = await getUserEmail({client})

        // Check if the user is an admin
        const authorized = await isAdmin(email)
        setIsAuthorized(authorized)

        // If not authorized, you could also redirect instead of showing the unauthorized page
        // if (!authorized) {
        //   router.push('/unauthorized')
        // }
      } catch (error) {
        console.error("Error checking admin status:", error)
        setIsAuthorized(false)
      }
    }

    checkAuth()
  }, [router])

  // Show loading state while checking authorization
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  // Show unauthorized page if not authorized
  if (!isAuthorized) {
    return <UnauthorizedPage />
  }

  // Show admin content if authorized
  return <>{children}</>
}

