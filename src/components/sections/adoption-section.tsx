export default function AdoptionSection() {
  return (
    <section className="py-16 bg-emerald-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Widespread Adoption</h2>
          <p className="text-lg text-gray-600">
            From Ghana to the global stage, cGHS is becoming the preferred stablecoin for West African transactions.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm h-16 w-full flex items-center justify-center">
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

