import Header from "@/components/header"
import HeroSection from "@/components/sections/hero-section"
import AboutSection from "@/components/sections/about-section"
import FeaturesSection from "@/components/sections/features-section"
import UseCasesSection from "@/components/sections/use-cases-section"
import AdoptionSection from "@/components/sections/adoption-section"
import FaqSection from "@/components/sections/faq-section"
import CtaSection from "@/components/sections/cta-section"
import FooterSection from "@/components/sections/footer-section"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <UseCasesSection />
        <AdoptionSection />
        <FaqSection />
        <CtaSection />
      </main>
      <FooterSection />
    </div>
  )
}

