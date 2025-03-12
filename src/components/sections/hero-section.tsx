import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-emerald-50 to-white overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 right-0 w-1/2 h-1/2">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-emerald-500"
              style={{
                width: `${Math.random() * 20 + 5}px`,
                height: `${Math.random() * 20 + 5}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.2,
              }}
            />
          ))}
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              cGHS Token
              <span className="block text-emerald-600">Ghana's First Stablecoin</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-lg">
              A digital currency backed 1:1 by the Ghanaian Cedi, bringing financial inclusion and stability to West
              Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="#get-started"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Create Account
              </Link>
              <Link
                href="#learn-more"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Learn How cGHS Works
              </Link>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 animate-pulse"
                style={{ animationDuration: "3s" }}
              ></div>
              <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center">
                <span className="text-4xl md:text-5xl font-bold text-emerald-600">cGHS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

