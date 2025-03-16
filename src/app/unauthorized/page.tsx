import Link from "next/link"
import Image from "next/image"
import { AlertTriangle } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Image src="/logo.svg" alt="cGHS Logo" width={48} height={48} className="w-12 h-12" />
      </div>

      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-6 text-center">
        <div className="flex justify-center">
          <AlertTriangle className="h-16 w-16 text-amber-500" />
        </div>

        <h1 className="text-2xl font-semibold text-gray-900">Access Denied</h1>

        <p className="text-gray-600">
          You don&apos;t have permission to access the admin area. If you believe this is an error, please contact support.
        </p>

        <div className="pt-4 space-y-4">
          <Link
            href="/dashboard"
            className="block w-full rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Go to Your Dashboard
          </Link>

          <Link
            href="/"
            className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

