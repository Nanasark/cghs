/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client"

// import { useState, useEffect } from "react"
// import { CheckCircle, AlertTriangle, Loader2, Shield } from "lucide-react"
// import { createVeriffFrame, MESSAGES } from "@veriff/incontext-sdk"
// import { isAddress } from "thirdweb"

// interface KycVerificationCardProps {
//   kycStatus: string
//   user: string
//   onVerificationComplete?: () => void
// }

// export default function KycVerificationCard({ kycStatus, user, onVerificationComplete }: KycVerificationCardProps) {
//   const [verificationStatus, setVerificationStatus] = useState<"pending" | "loading" | "success" | "error" | null>(null)
//   const [errorMessage, setErrorMessage] = useState<string | null>(null)
//   const [sessionUrl, setSessionUrl] = useState<string | null>(null)


//   useEffect(() => {
//     if (kycStatus === "approved") {
//       setVerificationStatus("success")
//     } else if (kycStatus === "pending") {
//       setVerificationStatus("pending")
//     } else if (kycStatus === "rejected") {
//       setVerificationStatus("error")
//       setErrorMessage("Your verification was rejected. Please try again.")
//     }
//   }, [kycStatus])

//   const startVerification = async () => {
//     setVerificationStatus("loading")
//     setErrorMessage(null)

//     try {
//       if (!isAddress(user)) {
//         alert("Sign In First")
//         throw new Error("User Not Signed In")
//       }

//       if (sessionUrl) {
//         launchVeriffFlow(sessionUrl)
//         return
//       }

//       // Create a new verification session through backend
//       const response = await fetch("/api/create-verification", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ userId: user }),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to create verification session")
//       }

//       const { sessionUrl: url } = await response.json()
//       setSessionUrl(url)
//       launchVeriffFlow(url)
//     } catch (error: any) {
//       console.error("Error starting verification:", error)
//       setVerificationStatus("error")
//       setErrorMessage(error.message || "An unexpected error occurred")
//     }
//   }

//   const launchVeriffFlow = (url: string) => {
//     try {
//       const veriffFrame = createVeriffFrame({
//         url,
//         onEvent: (msg) => {
//           switch (msg) {
//             case MESSAGES.STARTED:
//               console.log("Verification started")
//               break
//             case MESSAGES.SUBMITTED:
//               console.log("Verification submitted")
//               break
//             case MESSAGES.FINISHED:
//               console.log("Verification finished")
//               setVerificationStatus("pending")
//               onVerificationComplete?.()
//               break
//             case MESSAGES.CANCELED:
//               console.log("Verification canceled")
//               setVerificationStatus("error")
//               setErrorMessage("Verification was canceled")
//               break
//             case MESSAGES.RELOAD_REQUEST:
//               console.log("Verification reloaded")
//               break
//           }
//         },
//       })
//       return veriffFrame
//     } catch (error: any) {
//       console.error("Error launching Veriff flow:", error)
//       setVerificationStatus("error")
//       setErrorMessage(error.message || "Failed to launch verification")
//     }
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//       <div className="p-6">
//         <h2 className="text-lg font-medium text-gray-900 mb-4">Identity Verification</h2>

//         {verificationStatus === "loading" ? (
//           <div className="flex flex-col items-center justify-center py-6">
//             <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
//             <p className="mt-2 text-sm text-gray-500">Loading verification...</p>
//           </div>
//         ) : verificationStatus === "success" ? (
//           <div className="flex items-start space-x-3">
//             <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
//             <div>
//               <h3 className="text-sm font-medium text-gray-900">Verification Complete</h3>
//               <p className="mt-1 text-sm text-gray-500">
//                 Your identity has been verified successfully. You now have full access to all features.
//               </p>
//             </div>
//           </div>
//         ) : verificationStatus === "error" ? (
//           <div className="flex items-start space-x-3">
//             <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
//             <div>
//               <h3 className="text-sm font-medium text-gray-900">Verification Failed</h3>
//               <p className="mt-1 text-sm text-gray-500">{errorMessage || "There was an error with the verification process."}</p>
//               <button
//                 onClick={startVerification}
//                 className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
//               >
//                 Try Again
//               </button>
//             </div>
//           </div>
//         ) : verificationStatus === "pending" ? (
//           <div className="flex items-start space-x-3">
//             <Shield className="h-5 w-5 text-yellow-500 mt-0.5" />
//             <div>
//               <h3 className="text-sm font-medium text-gray-900">Verification In Progress</h3>
//               <p className="mt-1 text-sm text-gray-500">
//                 Your verification is being processed. This usually takes 1-2 business days. We&apos;ll notify you when it&apos;s complete.
//               </p>
//             </div>
//           </div>
//         ) : (
//           <div>
//             <p className="text-sm text-gray-500 mb-4">
//               Verify your identity to unlock all features of cGHS. This process takes about 5 minutes.
//             </p>
//             <ul className="mt-2 text-sm text-gray-500 list-disc pl-5 space-y-1 mb-4">
//               <li>A valid government-issued ID (passport, driver&apos;s license, or ID card)</li>
//               <li>A device with a camera for taking a selfie</li>
//               <li>Good lighting conditions</li>
//             </ul>
//             <button
//               onClick={startVerification}
//               className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
//             >
//               Start Verification
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }


import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Veriff: any; // 👈 Declare Veriff on the global window object
    veriffSDK: any;
  }
}

interface KycVerificationCardProps {
  kycStatus?: string
  user: string
  onVerificationComplete?: () => void
}

const VeriffVerification = ({ user}: KycVerificationCardProps) => {
  const veriffRootRef = useRef(null);

  useEffect(() => {
    // Function to load scripts dynamically
    const loadScript = (src: string) => {
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
      script.onerror = () => reject(new (window as any).Error(`Failed to load ${src}`));

        document.body.appendChild(script);
      });
    };

    // Load Veriff SDK scripts
    Promise.all([
      loadScript("https://cdn.veriff.me/sdk/js/1.5/veriff.min.js"),
      loadScript("https://cdn.veriff.me/incontext/js/v1/veriff.js"),
    ])
      .then(() => {
        if (window.Veriff) {
          const veriff = window.Veriff({
            host: "https://stationapi.veriff.com",
            apiKey: "f600dd61-d3fe-4445-8c71-199c38204e83", // Replace with your actual API key
            parentId: "veriff-root",
            onSession: (err: any, response:any) => {
              if (!err) {
                window.veriffSDK.createVeriffFrame({ url: response.verification.url });
              }
            },
          });

          veriff.setParams({
            vendorData: user,
          });

          veriff.mount();
        }
      })
      .catch((error) => {
        console.error("Error loading Veriff scripts:", error);
      });

    return () => {
      // Cleanup if needed
    };
  }, [user]);

  return <div id="veriff-root" ref={veriffRootRef}></div>;
};

export default VeriffVerification;
