import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function UseCasesSection() {
  const useCases = [
    {
      title: "cGHS for Individuals",
      description: "Send money to friends and family, make purchases online, and protect your savings from inflation.",
      cta: "Learn more",
    },
    {
      title: "cGHS for Merchants",
      description: "Accept digital payments, reduce transaction fees, and eliminate chargebacks for your business.",
      cta: "Learn more",
    },
    {
      title: "cGHS for Exchanges",
      description: "Provide your users with a stable trading pair backed by the Ghanaian economy.",
      cta: "Learn more",
    },
  ]

  return (
    <section id="use-cases" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">cGHS for Everyone</h2>
          <p className="text-lg text-gray-600">
            From everyday users to businesses and financial institutions, cGHS provides tailored solutions for all.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-6 hover:border-emerald-500 transition-colors"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 mr-2">
                  {index + 1}
                </span>
                {useCase.title}
              </h3>
              <p className="text-gray-600 mb-4">{useCase.description}</p>
              <Link
                href={`#${useCase.title.toLowerCase().replace(/\s+/g, "-")}`}
                className="inline-flex items-center text-emerald-600 hover:text-emerald-700"
              >
                <span>{useCase.cta}</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

