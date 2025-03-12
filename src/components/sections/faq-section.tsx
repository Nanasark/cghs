import Link from "next/link"

export default function FaqSection() {
  const faqs = [
    {
      question: "What is cGHS?",
      answer:
        "cGHS is a stablecoin cryptocurrency designed to maintain the value of the Ghanaian Cedi (GHS). Each cGHS token is backed by an equivalent amount of Ghanaian Cedis held in reserve, ensuring a stable 1:1 peg with the traditional currency.",
    },
    {
      question: "How do cGHS Tokens work?",
      answer:
        "cGHS tokens work on blockchain technology, allowing for fast, secure, and transparent transactions. The tokens are fully backed by reserves of Ghanaian Cedis, ensuring stability and trust in the digital currency.",
    },
    {
      question: "What currencies and commodities does cGHS support?",
      answer:
        "Currently, cGHS is pegged 1:1 with the Ghanaian Cedi. We're exploring additional stablecoins pegged to other West African currencies in the future.",
    },
    {
      question: "Why use cGHS Tokens?",
      answer:
        "cGHS offers the benefits of cryptocurrency (speed, security, low fees) with the stability of the Ghanaian Cedi. It's ideal for remittances, online purchases, and protecting against cryptocurrency volatility.",
    },
  ]

  return (
    <section id="faq" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600">Find answers to the most common questions about cGHS.</p>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-gray-200">
          {faqs.map((faq, index) => (
            <div key={index} className="py-6">
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                  <span className="transition group-open:rotate-180">
                    <svg
                      fill="none"
                      height="24"
                      shapeRendering="geometricPrecision"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      width="24"
                    >
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </span>
                </summary>
                <p className="text-gray-600 mt-3 group-open:animate-fadeIn">{faq.answer}</p>
              </details>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="#contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Need Help?
          </Link>
        </div>
      </div>
    </section>
  )
}

