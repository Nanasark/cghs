import Link from "next/link"
import Image from "next/image"
import { CheckCircle } from "lucide-react"

export default function KYBSuccessPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Image src="/logo.svg" alt="cGHS Logo" width={48} height={48} className="w-12 h-12" />
      </div>

      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6 space-y-6 text-center">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-emerald-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900">Verification Submitted Successfully</h1>

        <p className="text-gray-600">
          Thank you for submitting your business verification documents. Our team will review your information and get
          back to you within 2-3 business days.
        </p>

        <div className=" flex gap-5 pt-4">
          <Link
            href="/"
            className="inline-flex justify-center rounded-md border border-transparent bg-emerald-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Return to Home
          </Link>
           <Link
            href="/dashboard"
            className="inline-flex justify-center rounded-md border border-transparent bg-emerald-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

