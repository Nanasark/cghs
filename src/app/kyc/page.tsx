"use client"
// import KycVerificationCard from "@/components/kyc-verification-card";
// import EmailLogin from "@/components/login/withEmail";
import { useActiveAccount } from "thirdweb/react";
import VeriffVerification from "@/components/kyc-verification-card";
import Header from "@/components/header";

// "use client"
export default function KYCPage() {
  
    
  const account = useActiveAccount()
    const user = account ? account.address : ""
    


return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex flex-col lg:flex-row items-center justify-center min-h-[80vh] max-w-5xl mx-auto px-6 py-12 gap-12">
        {/* Left Side - Verification Component */}
        <div className="flex-1 flex justify-center">
          <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-md">
            <VeriffVerification user={user} />
          </div>
        </div>

        {/* Right Side - KYC Message */}
        <div className="flex-1 flex items-center justify-center text-center lg:text-left">
          <div className="max-w-sm space-y-4">
            <h1 className="text-2xl font-semibold text-emerald-600">
              Complete Your KYC
            </h1>
            <p className="text-gray-700">
              To access all features, verify your identity. This keeps your account secure and trusted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

