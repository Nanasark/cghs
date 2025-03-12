import Link from "next/link"
import { ArrowRight, CoinsIcon as Coin } from "lucide-react"

export default function AboutSection() {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Driving the Future of Money in Ghana</h2>
          <p className="text-lg text-gray-600">
            cGHS tokens are the most stable payment solution for Ghanaians, offering a seamless bridge between
            traditional finance and digital assets. As a stablecoin in the international financial system and a digital
            representation of the Ghanaian Cedi, cGHS tokens support and empower growing economies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-square rounded-full bg-emerald-100 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3/4 h-3/4 relative">
                  <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-emerald-500 rounded-tl-full"></div>
                  <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-white rounded-tr-full border-2 border-emerald-500"></div>
                  <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-white rounded-bl-full border-2 border-emerald-500"></div>
                  <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-emerald-500 rounded-br-full"></div>
                  <div className="absolute inset-1/4 bg-white rounded-full flex items-center justify-center">
                    <Coin className="h-12 w-12 text-emerald-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">100% backed and fully transparent</h3>
            <p className="text-gray-600 mb-6">
              All cGHS tokens are 100% backed by our reserves, which include traditional currency and cash equivalents,
              ensuring the stability and security of your digital assets.
            </p>
            <Link href="#transparency" className="inline-flex items-center text-emerald-600 hover:text-emerald-700">
              <span>cGHS Transparency Page</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

