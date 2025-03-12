import Link from "next/link"

export default function CtaSection() {
  return (
    <section className="py-16 bg-emerald-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to experience the future of money in Ghana?</h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join thousands of Ghanaians already using cGHS for faster, cheaper, and more secure transactions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#get-started"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-emerald-700 bg-white hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            >
              Get Started
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

