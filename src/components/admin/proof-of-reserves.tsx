"use client"

import { useState, useEffect } from "react"
import { Loader2, RefreshCw, ExternalLink, Shield } from "lucide-react"

interface ProofOfReserveData {
  transformedProof: {
    claimInfo: {
      context: string
      parameters: string
      provider: string
    }
    signedClaim: {
      claim: {
        epoch: number
        identifier: string
        owner: string
        timestampS: number
      }
      signatures: string[]
    }
  }
}

export default function ProofOfReserves() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [proofData, setProofData] = useState<ProofOfReserveData | null>(null)
  const [reserves, setReserves] = useState<string | null>(null)
  const [timestamp, setTimestamp] = useState<number | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchProofOfReserves = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("https://transakt-cghs.onrender.com/proofOfReserve")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.data) {
        setProofData(data.data)

        // Extract reserves from context
        try {
          const contextObj = JSON.parse(data.data.transformedProof.claimInfo.context)
          if (contextObj.extractedParameters && contextObj.extractedParameters.balance) {
            setReserves(contextObj.extractedParameters.balance)
          }
        } catch (e) {
          console.error("Error parsing context:", e)
          setError("Failed to parse reserves data")
        }

        // Extract timestamp
        if (data.data.transformedProof.signedClaim.claim.timestampS) {
          setTimestamp(data.data.transformedProof.signedClaim.claim.timestampS)
        }
      } else {
        throw new Error("Invalid response format")
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error fetching proof of reserves:", error)
      setError(error.message || "Failed to fetch proof of reserves")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchProofOfReserves()
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchProofOfReserves()
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000) // Convert from seconds to milliseconds
    return date.toLocaleString()
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Shield className="h-5 w-5 text-emerald-500 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">Proof of Reserves</h2>
        </div>
        <button
          onClick={handleRefresh}
          className="text-gray-500 hover:text-emerald-600 transition-colors"
          disabled={isLoading || isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin text-emerald-600" : ""}`} />
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
          <span className="ml-2 text-gray-600">Loading proof of reserves...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-700">
          <p>{error}</p>
          <button onClick={fetchProofOfReserves} className="mt-2 text-sm text-emerald-600 hover:text-emerald-700">
            Try again
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Currency
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Chain
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Reserves
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Contract Address
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">cGHS</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Scroll Network</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reserves ? `₵${reserves}` : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <a
                      href={`https://scrollscan.com/address/0xf85aab5cd1029c8b3f765e4d3e5c871843e25740`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-emerald-600 hover:text-emerald-700"
                    >
                      {truncateAddress("0xf85aab5cd1029c8b3f765e4d3e5c871843e25740")}
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {timestamp ? formatDate(timestamp) : "N/A"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Verification Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Identifier</p>
                <p className="text-sm text-gray-900 break-all">
                  {proofData?.transformedProof.signedClaim.claim.identifier || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Owner</p>
                <p className="text-sm text-gray-900 break-all">
                  {proofData?.transformedProof.signedClaim.claim.owner || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Epoch</p>
                <p className="text-sm text-gray-900">{proofData?.transformedProof.signedClaim.claim.epoch || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Provider</p>
                <p className="text-sm text-gray-900">{proofData?.transformedProof.claimInfo.provider || "N/A"}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

