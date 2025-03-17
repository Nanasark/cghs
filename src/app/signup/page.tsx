"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import BusinessDetailsForm from "@/components/signup/business-details-form"
import AuthorisedRepresentativeForm from "@/components/signup/authorised-representative-form"
import ControllersForm from "@/components/signup/controllers-form"
import BusinessDocumentsForm from "@/components/signup/business-documents-form"
import { getUserKycData } from "../actions/get-user-kyc-data"
import { useActiveAccount } from "thirdweb/react"
import KYCPage from "../kyc/page"
import Header from "@/components/header"



export default function KYBApplication() {
  const account = useActiveAccount()
  const address = account ? account.address : ""
  const [kycStatus,setKYCStatus]= useState("")
  useEffect(()=>{
    async function checkStatus() {
      const kycdata = await getUserKycData(address) 

      if (kycdata?.status) {
        setKYCStatus(kycdata?.status)
      }
    }

    checkStatus()
  }, [address])
  
  return (<>
   
   {kycStatus === "approved"?

      <KYBPage /> : <KYCPage/>
    }
  </>
   
  )

  
  

}

const steps = ["Business Details", "Authorised Representative", "Controllers", "Business Documents"]

 function KYBPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Business Details
    businessId: crypto.randomUUID(),
     businessName: "",
    addressLine1: "",
    addressLine2: "",
    cityRegion: "",
    state: "",
    country: "",
    jurisdiction: "",
    phoneNumber: "",
    socialLinks: {
      linkedin: "",
      twitter: "",
      facebook: "",
    },

    // Authorised Representative
    representativeId: null as File | null,
    representativeAddress: null as File | null,

    // Controllers
    controllers: [] as Array<{
      type: string
      id: File | null
      address: File | null
    }>,

    // Business Documents
    incorporation: null as File | null,
    articles: null as File | null,
    shareholders: null as File | null,
    directors: null as File | null,
    orgChart: null as File | null,
    incumbency: null as File | null,
  })

  const handleNext = (data: Partial<typeof formData>) => {
    // Merge the new data with existing data, preserving all previous uploads
    setFormData((prev) => {
      // For controllers, we need special handling to ensure we don't lose any uploaded files
      if (data.controllers) {
        // Make sure we preserve any file uploads from previous controllers
        const updatedControllers = data.controllers.map((newController, index) => {
          const prevController = prev.controllers[index]
          if (prevController) {
            return {
              ...newController,
              // Preserve files if they weren't changed
              id: newController.id || prevController.id,
              address: newController.address || prevController.address,
            }
          }
          return newController
        })

        return { ...prev, ...data, controllers: updatedControllers }
      }

      return { ...prev, ...data }
    })

    setStep((prev) => Math.min(prev + 1, steps.length))
  }

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

   return (
    <> <Header/>
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Image src="/logo.svg" alt="cGHS Logo" width={48} height={48} className="w-12 h-12" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-lg shadow-md p-6"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Create your cGHS account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Please fill out the fields below on behalf of the authorized representative for your company.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8 relative">
          <div className="h-1 w-full bg-gray-200 rounded">
            <div
              className="h-1 bg-emerald-500 rounded transition-all duration-300"
              style={{ width: `${(step / steps.length) * 100}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-gray-500 text-center">
            Step {step} of {steps.length}
          </div>
        </div>

        {step === 1 && <BusinessDetailsForm initialData={formData} onNext={handleNext} />}
        {step === 2 && <AuthorisedRepresentativeForm initialData={formData} onNext={handleNext} onBack={handleBack} />}
        {step === 3 && <ControllersForm initialData={formData} onNext={handleNext} onBack={handleBack} />}
        {step === 4 && <BusinessDocumentsForm initialData={formData} onBack={handleBack} />}

        <div className="mt-6 text-center text-sm text-gray-600">
          By creating an account, you acknowledge you agree to our
          <div className="flex justify-center space-x-2 mt-1">
            <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700">
              Privacy Policy
            </Link>
            <span>|</span>
            <Link href="/aml" className="text-emerald-600 hover:text-emerald-700">
              AML Policy
            </Link>
            <span>|</span>
            <Link href="/terms" className="text-emerald-600 hover:text-emerald-700">
              Terms of Use
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="mt-6 text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-emerald-600 hover:text-emerald-700">
          Log in
        </Link>
      </div>
       </div>
     </>
  )
}

