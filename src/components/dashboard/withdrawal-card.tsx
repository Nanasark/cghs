/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowUpCircle, Loader2, CheckCircle, AlertCircle, ExternalLink } from "lucide-react"
import { useActiveAccount } from "thirdweb/react"
import { balanceOf } from "thirdweb/extensions/erc20";
import {tokencontract} from "@/app/contract"
import { toEther } from "thirdweb/utils";
import { getChannel } from "@/lib/utils"
import { useLandContract } from "@/lib/use-contract"

interface WithdrawalCardProps {
  onBalanceUpdate: () => void
  kybStatus: string
}

export default function WithdrawalCard({ onBalanceUpdate, kybStatus }: WithdrawalCardProps) {
   const [amount, setAmount] = useState<string>("")
  const [receiver, setReceiver] = useState<string>("")
  const [referenceNote, setReferenceNote] = useState<string>("")
  const [network, setNetwork] = useState<string>("MTN")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [requestId, setRequestId] = useState<string | null>(null)
  const [initialBalance, setInitialBalance] = useState<number | null>(null)
  const [transactionHash, setTransactionHash] = useState<string | null>(null)
  const [transferStep, setTransferStep] = useState<"initiated" | "transferring" | "redeeming" | "completed" | null>(
    null,
  )

  const { TransferERC } = useLandContract()
  const account = useActiveAccount()
  const userAddress = account ? account.address : ""

  // Check if user has access based on KYB status
  const hasAccess = kybStatus === "approved"

  // Reset form state when success is true after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false)
        setAmount("")
        setReceiver("")
        setReferenceNote("")
        setRequestId(null)
        // Don't reset transaction hash so user can still click it
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [success])

  const fetchBalance = async (): Promise<number> => {
    try {
       const response = await balanceOf({
        contract: tokencontract,
        address: userAddress,
        });

  
      const data = toEther(response)
      return Number(data) || 0
    } catch (error) {
      console.error("Error fetching balance:", error)
      return 0
    }
  }

  const handleInitiateWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!hasAccess) {
      setError("You need to complete KYB verification to make withdrawals")
      return
    }

    if (!amount || !receiver || !network) {
      setError("Please fill in all required fields")
      return
    }

    if (!userAddress) {
      setError("No wallet connected")
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      // Get initial balance
      const balance = await fetchBalance()
      setInitialBalance(balance)

      // Check if user has enough balance
      if (balance < Number.parseFloat(amount)) {
        throw new Error("Insufficient balance for this withdrawal")
      }

      // Get the correct channel number based on network and transaction type
      const channel = getChannel(network, "withdrawal")

      if (channel === 0) {
        throw new Error("Invalid network selected")
      }

      // Step 1: Call withdraw API to initiate the withdrawal
      setTransferStep("initiated")
      const response = await fetch("https://transakt-cghs.onrender.com/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          countryCode: "GH",
          amount: Number.parseFloat(amount),
          referenceNote: referenceNote || "Withdrawal via cGHS Dashboard",
          receiver: receiver,
          channel: channel,
          userAddress: userAddress,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to initiate withdrawal")
      }

      const data = await response.json()

      if (data.status === "initiated" && data.requestId) {
        setRequestId(data.requestId)

        // Step 2: Transfer ERC20 tokens
        setTransferStep("transferring")
        const transferResult = await TransferERC(Number.parseFloat(amount))
        // const transferResult= "0x170382ec31cb0ebc56a640b3e3f6a267ce00690207b072dcdd33abbe993ed4bc"
        if (transferResult) {
          // Get the actual transaction hash from the transfer
          const txHash = typeof transferResult === "string" ? transferResult : ""
          setTransactionHash(txHash)
console.log(requestId)
          if (!txHash) {
            throw new Error("Failed to get transaction hash from token transfer")
          }

          console.log("transaction Hash:",txHash)
          console.log("requestId:",data.requestId)
          // Step 3: Call redeem-from-transfer API
          setTransferStep("redeeming")
          const redeemResponse = await fetch("https://transakt-cghs.onrender.com/redeem-from-transfer", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              transferTxHash: txHash,
              channel: channel,
              receiver: receiver,
              requestId: data.requestId ,
            }),
          })

          if (!redeemResponse.ok) {
            const redeemErrorData = await redeemResponse.json()
            throw new Error(redeemErrorData.message || "Failed to redeem withdrawal")
          }

          setTransferStep("completed")

          // Wait a moment for the balance to update
          setTimeout(async () => {
            // Check if balance decreased
            const newBalance = await fetchBalance()
            if (initialBalance !== null && newBalance < initialBalance) {
              setSuccess(true)
              onBalanceUpdate() // Update parent component balance
            } else {
              // Still mark as success but note the balance hasn't updated yet
              setSuccess(true)
              console.log("Withdrawal completed, but balance hasn't updated yet")
            }
            setIsLoading(false)
          }, 3000)
        } else {
          throw new Error("Failed to transfer tokens")
        }
      } else {
        throw new Error("Invalid response from server")
      }
    } catch (error: any) {
      setError(error.message || "An error occurred while processing withdrawal")
      setTransferStep(null)
    } finally {
      if (!success) {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <ArrowUpCircle className="h-5 w-5 text-emerald-500 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">Withdraw cGHS</h2>
        </div>

        {kybStatus !== "approved" ? (
          <div className="bg-amber-50 p-4 rounded-md">
            <p className="text-sm text-amber-800">Complete KYB verification to make withdrawals</p>
          </div>
        ) : success ? (
          <div className="bg-green-50 p-4 rounded-md flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-green-800">Withdrawal Successful</h3>
              <p className="text-sm text-green-700 mt-1">
                Your withdrawal of ₵{amount} has been processed successfully.
              </p>
              {transactionHash && (
                <a
                  href={`https://scrollscan.com/tx/${transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center text-sm text-emerald-600 hover:text-emerald-700"
                >
                  View transaction on ScrollScan
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        ) : transferStep ? (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Withdrawal in Progress</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="mr-2 flex-shrink-0">
                    {transferStep === "initiated" ||
                    transferStep === "transferring" ||
                    transferStep === "redeeming" ||
                    transferStep === "completed" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                    )}
                  </div>
                  <span className="text-sm text-gray-700">Withdrawal initiated</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 flex-shrink-0">
                    {transferStep === "transferring" ? (
                      <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                    ) : transferStep === "redeeming" || transferStep === "completed" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                    )}
                  </div>
                  <span className="text-sm text-gray-700">Transferring tokens</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 flex-shrink-0">
                    {transferStep === "redeeming" ? (
                      <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                    ) : transferStep === "completed" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                    )}
                  </div>
                  <span className="text-sm text-gray-700">Processing withdrawal</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 flex-shrink-0">
                    {transferStep === "completed" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                    )}
                  </div>
                  <span className="text-sm text-gray-700">Withdrawal completed</span>
                </li>
              </ul>
              <p className="text-xs text-gray-500 mt-3">
                Please do not close this window until the process is complete.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 p-3 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm text-red-700">{error}</p>
                  <button
                    onClick={() => {
                      setError(null)
                      setTransferStep(null)
                      setIsLoading(false)
                    }}
                    className="text-xs text-red-600 underline mt-1"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleInitiateWithdrawal} className="space-y-4">
            {error && (
              <div className="bg-red-50 p-3 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="withdrawal-amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₵) <span className="text-red-500">*</span>
              </label>
              <input
                id="withdrawal-amount"
                type="number"
                step="0.01"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="0.00"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="withdrawal-network" className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Network <span className="text-red-500">*</span>
              </label>
              <select
                id="withdrawal-network"
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                required
                disabled={isLoading}
              >
                <option value="MTN">MTN Mobile Money</option>
                <option value="Vodafone">Vodafone Cash</option>
                <option value="AirtelTigo">AirtelTigo Money</option>
              </select>
            </div>

            <div>
              <label htmlFor="withdrawal-receiver" className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Money Number <span className="text-red-500">*</span>
              </label>
              <input
                id="withdrawal-receiver"
                type="tel"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="0201234567"
                required
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-500">Enter the mobile money number to receive funds</p>
            </div>

            <div>
              <label htmlFor="withdrawal-reference" className="block text-sm font-medium text-gray-700 mb-1">
                Reference Note
              </label>
              <input
                id="withdrawal-reference"
                type="text"
                value={referenceNote}
                onChange={(e) => setReferenceNote(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="Optional reference"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !hasAccess}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Processing...
                </>
              ) : (
                "Withdraw"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

