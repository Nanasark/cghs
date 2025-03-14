"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, Upload, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface KybIssue {
  field: string
  issue: string
  required: boolean
}

interface UpdateKybModalProps {
  isOpen: boolean
  onClose: () => void
  kybStatus: string
  kybIssues?: KybIssue[]
}

export default function UpdateKybModal({ isOpen, onClose, kybStatus, kybIssues = [] }: UpdateKybModalProps) {
  // const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File | null>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  // Generate document fields based on issues or default fields
  const documentFields =
    kybIssues.length > 0
      ? kybIssues.map((issue) => ({
          id: issue.field.toLowerCase().replace(/[^a-z0-9]/g, "_"),
          name: issue.field,
          description: issue.issue,
          required: issue.required,
        }))
      : [
          {
            id: "incorporation",
            name: "Certificate of Incorporation",
            description: "Please upload a certified copy",
            required: true,
          },
          {
            id: "articles",
            name: "Articles of Association/Bylaws",
            description: "Please upload a certified copy",
            required: true,
          },
          {
            id: "shareholders",
            name: "Shareholder(s)' Register",
            description: "Please upload a certified copy",
            required: true,
          },
          {
            id: "directors",
            name: "Director(s)' Register",
            description: "Please upload a certified copy",
            required: true,
          },
          {
            id: "orgChart",
            name: "Organisational Chart",
            description: "Please upload a certified copy",
            required: true,
          },
          {
            id: "incumbency",
            name: "Certificate of Incumbency",
            description: "Please upload a certified copy",
            required: true,
          },
          {
            id: "representativeId",
            name: "Representative's ID",
            description: "Please upload a valid ID document",
            required: true,
          },
          {
            id: "representativeAddress",
            name: "Representative's Proof of Address",
            description: "Please upload a recent proof of address",
            required: true,
          },
        ]

  const handleFileChange = (fieldId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setUploadedFiles((prev) => ({
        ...prev,
        [fieldId]: file,
      }))

      // Clear error for this field
      setErrors({ ...errors, [fieldId]: "" })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    documentFields.forEach((field) => {
      if (field.required && !uploadedFiles[field.id]) {
        newErrors[field.id] = `${field.name} is required`
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsSubmitting(true)

      try {
        // In a real app, you would upload the files to your API here
        console.log("Submitting updated KYB documents:", uploadedFiles)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Show success state
        setIsSuccess(true)
      } catch (error) {
        console.error("Error submitting documents:", error)
        alert("An error occurred while submitting your documents. Please try again.")
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleClose = () => {
    if (isSuccess) {
      // If successful, refresh the page to show updated status
      router.refresh()
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            {isSuccess ? "Update Successful" : "Update KYB Information"}
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-6">
              <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">KYB Information Updated</h3>
              <p className="text-gray-600 mb-6">
                Your KYB information has been successfully submitted for review. We&apos;ll notify you once the verification
                process is complete.
              </p>
              <button
                onClick={handleClose}
                className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Return to Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {kybStatus === "rejected" ? (
                <div className="mb-6">
                  <p className="text-sm text-gray-600">
                    Your KYB verification was not approved. Please update the following information to complete your
                    verification.
                  </p>
                </div>
              ) : (
                <div className="mb-6">
                  <p className="text-sm text-gray-600">
                    You can update your KYB information here. Please upload the required documents to proceed with
                    verification.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {documentFields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                      {field.name} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <p className="text-xs text-gray-500">{field.description}</p>

                    <div className="relative">
                      <input
                        type="file"
                        id={field.id}
                        ref={(el) => (fileInputRefs.current[field.id] = el)}
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange(field.id, e)}
                      />
                      <label
                        htmlFor={field.id}
                        className={`
                          flex items-center justify-center w-full p-3 border-2 border-dashed rounded-lg cursor-pointer
                          ${uploadedFiles[field.id] ? "border-emerald-500 bg-emerald-50" : "border-gray-300 hover:border-emerald-500"}
                        `}
                      >
                        {uploadedFiles[field.id] ? (
                          <div className="text-emerald-600">{uploadedFiles[field.id]?.name}</div>
                        ) : (
                          <div className="flex items-center space-x-2 text-gray-500">
                            <Upload className="w-4 h-4" />
                            <span>Upload {field.name}</span>
                          </div>
                        )}
                      </label>
                    </div>

                    {errors[field.id] && <p className="mt-1 text-sm text-red-600">{errors[field.id]}</p>}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 border border-gray-300 bg-white text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

