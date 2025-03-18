// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { ArrowDownCircle, Loader2, CheckCircle, AlertCircle } from "lucide-react"
// import { useActiveAccount } from "thirdweb/react"
// import { balanceOf } from "thirdweb/extensions/erc20";
// import {tokencontract} from "@/app/contract"
// import { toEther } from "thirdweb/utils";

// interface DepositCardProps {
//   onBalanceUpdate: () => void
//   kybStatus: string
// }

// export default function DepositCard({ onBalanceUpdate, kybStatus }: DepositCardProps) {
//   const [amount, setAmount] = useState<string>("")
//   const [receiver, setReceiver] = useState<string>("")
//   const [referenceNote, setReferenceNote] = useState<string>("")
//   const [isLoading, setIsLoading] = useState<boolean>(false)
//   const [error, setError] = useState<string | null>(null)
//   const [success, setSuccess] = useState<boolean>(false)
//   const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false)
//   const [requestId, setRequestId] = useState<string | null>(null)
//   const [channel, setChannel] = useState<number>(6) // Default channel
//   const [initialBalance, setInitialBalance] = useState<number | null>(null)

//   const account = useActiveAccount()
//   const userAddress = account ? account.address : ""

//   // Check if user has access based on KYB status
//   const hasAccess = kybStatus === "approved"

//   // Reset form state when success is true after 5 seconds
//   useEffect(() => {
//     if (success) {
//       const timer = setTimeout(() => {
//         setSuccess(false)
//         setAmount("")
//         setReceiver("")
//         setReferenceNote("")
//         setRequestId(null)
//       }, 5000)

//       return () => clearTimeout(timer)
//     }
//   }, [success])

//   const fetchBalance = async (): Promise<number> => {
//     try {
//       const response = await balanceOf({
//         contract: tokencontract,
//         address: userAddress,
//         });

    
//       const data = toEther(response)
//       return Number(data) || 0
//     } catch (error) {
//       console.error("Error fetching balance:", error)
//       return 0
//     }
//   }

//   const handleInitiateDeposit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!hasAccess) {
//       setError("You need to complete KYB verification to make deposits")
//       return
//     }

//     if (!amount || !receiver) {
//       setError("Please fill in all required fields")
//       return
//     }

//     if (!userAddress) {
//       setError("No wallet connected")
//       return
//     }

//     setError(null)
//     setIsLoading(true)

//     try {
//       // Get initial balance
//       const balance = await fetchBalance()
//       setInitialBalance(balance)

//       // Call deposit API
//       const response = await fetch("https://transakt-cghs.onrender.com/depositCollateral", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           countryCode: "GH",
//           amount: Number.parseFloat(amount),
//           referenceNote: referenceNote || "Deposit via cGHS Dashboard",
//           receiver: receiver,
//           channel: channel,
//           userAddress: userAddress,
//         }),
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.message || "Failed to initiate deposit")
//       }

//       const data = await response.json()

//       if (data.success && data.requestId) {
//         setRequestId(data.requestId)
//         setShowConfirmModal(true)
//       } else {
//         throw new Error("Invalid response from server")
//       }
//     } catch (error: any) {
//       setError(error.message || "An error occurred while initiating deposit")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleConfirmDeposit = async () => {
//     if (!requestId) return

//     setIsLoading(true)
//     setError(null)

//     try {
//       const response = await fetch("https://transakt-cghs.onrender.com/executeDeposit", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           requestId: requestId,
//           channel: channel,
//           receiver: receiver,
//           referenceNote: referenceNote || "Deposit via cGHS Dashboard",
//         }),
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.message || "Failed to execute deposit")
//       }

//       const data = await response.json()

//       if (data.success) {
//         // Wait a moment for the balance to update
//         setTimeout(async () => {
//           // Check if balance increased
//           const newBalance = await fetchBalance()
//           if (initialBalance !== null && newBalance > initialBalance) {
//             setSuccess(true)
//             onBalanceUpdate() // Update parent component balance
//           } else {
//             setError("Deposit completed, but balance hasn't updated yet. It may take a few minutes.")
//           }
//           setShowConfirmModal(false)
//           setIsLoading(false)
//         }, 3000)
//       } else {
//         throw new Error("Deposit failed")
//       }
//     } catch (error: any) {
//       setError(error.message || "An error occurred while confirming deposit")
//       setShowConfirmModal(false)
//       setIsLoading(false)
//     }
//   }

//   const handleCancelDeposit = () => {
//     setShowConfirmModal(false)
//     setRequestId(null)
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//       <div className="p-6">
//         <div className="flex items-center mb-4">
//           <ArrowDownCircle className="h-5 w-5 text-emerald-500 mr-2" />
//           <h2 className="text-lg font-medium text-gray-900">Deposit cGHS</h2>
//         </div>

//         {kybStatus !== "approved" ? (
//           <div className="bg-amber-50 p-4 rounded-md">
//             <p className="text-sm text-amber-800">Complete KYB verification to make deposits</p>
//           </div>
//         ) : success ? (
//           <div className="bg-green-50 p-4 rounded-md flex items-start">
//             <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
//             <div>
//               <h3 className="text-sm font-medium text-green-800">Deposit Successful</h3>
//               <p className="text-sm text-green-700 mt-1">Your deposit of ₵{amount} has been processed successfully.</p>
//             </div>
//           </div>
//         ) : (
//           <form onSubmit={handleInitiateDeposit} className="space-y-4">
//             {error && (
//               <div className="bg-red-50 p-3 rounded-md flex items-start">
//                 <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
//                 <p className="text-sm text-red-700">{error}</p>
//               </div>
//             )}

//             <div>
//               <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
//                 Amount (₵) <span className="text-red-500">*</span>
//               </label>
//               <input
//                 id="amount"
//                 type="number"
//                 step="0.01"
//                 min="1"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
//                 placeholder="0.00"
//                 required
//                 disabled={isLoading}
//               />
//             </div>

//             <div>
//               <label htmlFor="receiver" className="block text-sm font-medium text-gray-700 mb-1">
//                 Mobile Money Number <span className="text-red-500">*</span>
//               </label>
//               <input
//                 id="receiver"
//                 type="tel"
//                 value={receiver}
//                 onChange={(e) => setReceiver(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
//                 placeholder="0201234567"
//                 required
//                 disabled={isLoading}
//               />
//               <p className="mt-1 text-xs text-gray-500">Enter the mobile money number to pay from</p>
//             </div>

//             <div>
//               <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">
//                 Reference Note
//               </label>
//               <input
//                 id="reference"
//                 type="text"
//                 value={referenceNote}
//                 onChange={(e) => setReferenceNote(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
//                 placeholder="Optional reference"
//                 disabled={isLoading}
//               />
//             </div>

//             <button
//               type="submit"
//               className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
//               disabled={isLoading || !hasAccess}
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="animate-spin h-4 w-4 mr-2" />
//                   Processing...
//                 </>
//               ) : (
//                 "Deposit"
//               )}
//             </button>
//           </form>
//         )}
//       </div>

//       {/* Confirmation Modal */}
//       {showConfirmModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-md w-full p-6">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deposit</h3>
//             <p className="text-gray-600 mb-4">
//               Please confirm your deposit of <span className="font-semibold">₵{amount}</span> from mobile number{" "}
//               <span className="font-semibold">{receiver}</span>.
//             </p>
//             <p className="text-sm text-gray-500 mb-6">
//               You will receive a prompt on your mobile phone. Please complete the payment to continue.
//             </p>

//             <div className="flex space-x-3">
//               <button
//                 onClick={handleCancelDeposit}
//                 className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
//                 disabled={isLoading}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmDeposit}
//                 className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="animate-spin h-4 w-4 mr-2" />
//                     Processing...
//                   </>
//                 ) : (
//                   "Confirm"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

