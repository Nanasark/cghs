"use client"

import { useState } from "react"
import Image from "next/image"
import { FileText, Eye, Download, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface DocumentReference {
  url: string
  format: string
  publicId: string
  uploadedAt: string
  resourceType: string
}

interface KybDocumentsCardProps {
  documents: Record<string, DocumentReference>
  kybStatus: string
}

export default function KybDocumentsCard({ documents, kybStatus }: KybDocumentsCardProps) {
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Document type display names
  const documentLabels: Record<string, string> = {
    incorporation: "Certificate of Incorporation",
    articles: "Articles of Association",
    directors: "Directors Register",
    shareholders: "Shareholders Register",
    orgChart: "Organizational Chart",
    incumbency: "Certificate of Incumbency",
    representativeId: "Representative ID",
    representativeAddress: "Representative Proof of Address",
    // Add controller document labels
    controller1_id: "Controller 1 ID",
    controller1_address: "Controller 1 Proof of Address",
    controller2_id: "Controller 2 ID",
    controller2_address: "Controller 2 Proof of Address",
    // Generic pattern for any number of controllers
    ...Object.fromEntries(
      Array.from({ length: 10 }).flatMap((_, i) => [
        [`controller${i + 1}_id`, `Controller ${i + 1} ID`],
        [`controller${i + 1}_address`, `Controller ${i + 1} Proof of Address`],
      ]),
    ),
  }

  // Toggle document expansion
  const toggleExpand = (docKey: string) => {
    if (expandedDoc === docKey) {
      setExpandedDoc(null)
    } else {
      setExpandedDoc(docKey)
      // Pre-load the preview URL
      setPreviewUrl(documents[docKey].url)
    }
  }

  // Format the upload date
  const formatUploadDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (e) {
      console.log(e)
      return "Unknown date"
    }
  }

  // Get status icon based on KYB status
  const getStatusIcon = () => {
    switch (kybStatus) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  // Get status text based on KYB status
  const getStatusText = () => {
    switch (kybStatus) {
      case "approved":
        return "Verified"
      case "rejected":
        return "Rejected"
      default:
        return "Pending Review"
    }
  }

  // Get status color based on KYB status
  const getStatusColor = () => {
    switch (kybStatus) {
      case "approved":
        return "text-green-700"
      case "rejected":
        return "text-red-700"
      default:
        return "text-yellow-700"
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">KYB Documents</h2>
        <div className="flex items-center">
          {getStatusIcon()}
          <span className={`ml-2 text-sm font-medium ${getStatusColor()}`}>{getStatusText()}</span>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(documents).map(([docKey, doc]) => (
          <div key={docKey} className="border border-gray-200 rounded-md overflow-hidden">
            <div
              className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleExpand(docKey)}
            >
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{documentLabels[docKey] || docKey}</p>
                  <p className="text-xs text-gray-500">Uploaded {formatUploadDate(doc.uploadedAt)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-2">{doc.format.toUpperCase()}</span>
                {expandedDoc === docKey ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </div>

            {expandedDoc === docKey && (
              <div className="border-t border-gray-200">
                <div className="p-3">
                  {doc.resourceType === "image" ? (
                    <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
                      <Image
                        src={previewUrl || doc.url}
                        alt={documentLabels[docKey] || docKey}
                        fill
                        className="object-contain"
                        onError={() => {
                          // Handle image loading errors
                          console.error(`Failed to load image: ${doc.url}`)
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-48 bg-gray-100 rounded-md">
                      <FileText className="h-12 w-12 text-gray-400" />
                    </div>
                  )}

                  <div className="flex justify-between mt-3">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      View Full Size
                    </a>
                    <a
                      href={doc.url}
                      download={`${documentLabels[docKey] || docKey}.${doc.format}`}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Download className="h-3.5 w-3.5 mr-1" />
                      Download
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

