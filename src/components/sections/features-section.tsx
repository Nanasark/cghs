import { Shield, Globe, BarChart3, Users } from "lucide-react"

export default function FeaturesSection() {
  const features = [
    {
      icon: <Shield className="h-8 w-8 text-emerald-600" />,
      title: "Stability and Security",
      description: "Fully backed by Ghanaian Cedi reserves, providing stability and protection against volatility.",
    },
    {
      icon: <Globe className="h-8 w-8 text-emerald-600" />,
      title: "World-Class Transparency",
      description: "Regular audits and public disclosure of reserves ensure complete transparency.",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-emerald-600" />,
      title: "Fast Transactions",
      description: "Lightning-fast settlement times for both local and international transfers.",
    },
    {
      icon: <Users className="h-8 w-8 text-emerald-600" />,
      title: "Financial Inclusion",
      description: "Bringing banking services to the unbanked population across Ghana and West Africa.",
    },
    {
      icon: (
        <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Low Fees",
      description: "Minimal transaction fees compared to traditional banking and money transfer services.",
    },
    {
      icon: (
        <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Instant Settlement",
      description: "No waiting periods for funds to clear, enabling immediate access to your money.",
    },
  ]

  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose cGHS?</h2>
          <p className="text-lg text-gray-600">
            cGHS offers the stability of the Ghanaian Cedi with the efficiency of blockchain technology, providing a
            reliable digital asset for everyday transactions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

