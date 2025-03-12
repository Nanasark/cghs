"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import BusinessDetailsForm from "@/components/signup/business-details-form"
import ContactInformationForm from "@/components/signup/contact-information-form"
import PasswordForm from "@/components/signup/password-form"
import StepIndicator from "@/components/signup/step-indicator"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    businessName: "",
    isRegistered: false,
    contactName: "",
    email: "",
    password: "",
  })
  const totalSteps = 3
  const router = useRouter()

  const handleNext = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setStep((prev) => Math.min(prev + 1, totalSteps))
  }

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (password: string) => {
    const finalData = { ...formData, password }
    // Here you would typically send the data to your API
    console.log("Submitting:", finalData)
    // Redirect to login page after successful submission
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Image src="/logo.svg" alt="cGHS Logo" width={48} height={48} className="w-12 h-12" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-lg shadow-xl p-6 space-y-6"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create your cGHS account</h1>
          <p className="text-gray-600">
            {step === 1 && "Enter your business details"}
            {step === 2 &&
              "Please fill out the fields below on behalf of the authorized representative for your company."}
            {step === 3 && "Choose a password"}
          </p>
        </div>

        <StepIndicator currentStep={step} totalSteps={totalSteps} />

        <div className="mt-8">
          {step === 1 && <BusinessDetailsForm initialData={formData} onNext={handleNext} />}
          {step === 2 && <ContactInformationForm initialData={formData} onNext={handleNext} onBack={handleBack} />}
          {step === 3 && <PasswordForm onSubmit={handleSubmit} onBack={handleBack} />}
        </div>

        <div className="text-sm text-center space-y-4">
          <p className="text-gray-600">By creating an account, you acknowledge you agree to our</p>
          <div className="space-x-2 text-emerald-600">
            <Link href="/privacy" className="hover:text-emerald-700">
              Privacy Policy
            </Link>
            <span>|</span>
            <Link href="/aml" className="hover:text-emerald-700">
              AML Policy
            </Link>
            <span>|</span>
            <Link href="/terms" className="hover:text-emerald-700">
              Terms of Use
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="mt-8 text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-emerald-600 hover:text-emerald-700">
          Log in
        </Link>
      </div>
    </div>
  )
}

