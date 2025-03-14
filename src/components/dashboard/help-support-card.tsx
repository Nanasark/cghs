import Link from "next/link"
import { Bell, HelpCircle, ShieldCheck } from "lucide-react"

export default function HelpSupportCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Help & Support</h2>
      <div className="space-y-3">
        <Link href="/faq" className="flex items-center text-sm text-gray-700 hover:text-emerald-600">
          <HelpCircle className="h-5 w-5 text-gray-500 mr-3" />
          <span>FAQs</span>
        </Link>
        <Link href="/contact" className="flex items-center text-sm text-gray-700 hover:text-emerald-600">
          <Bell className="h-5 w-5 text-gray-500 mr-3" />
          <span>Contact Support</span>
        </Link>
        <Link href="/security" className="flex items-center text-sm text-gray-700 hover:text-emerald-600">
          <ShieldCheck className="h-5 w-5 text-gray-500 mr-3" />
          <span>Security Tips</span>
        </Link>
      </div>
    </div>
  )
}

