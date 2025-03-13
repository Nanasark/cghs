"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface BusinessDocumentsFormProps {
  initialData: {
    incorporation: File | null
    articles: File | null
    shareholders: File | null
    directors: File | null
    orgChart: File | null
    incumbency: File | null
  }
  onBack: () => void
}

export default function BusinessDocumentsForm({ initialData, onBack }: BusinessDocumentsFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const documentFields = [
    {
      id: "incorporation",
      name: "Certificate of Incorporation",
      description: "This document should be certified.",
    },
    {
      id: "articles",
      name: "Articles of Association/Bylaws",
      description: "This document should be certified.",
    },
    {
      id: "shareholders",
      name: "Shareholder(s)' Register",
      description: "This document should be certified.",
    },
    {
      id: "directors",
      name: "Director(s)' Register",
      description: "This document should be certified.",
    },
    {
      id: "orgChart",
      name: "Organisational Chart",
      description: "This document should be certified.",
    },
    {
      id: "incumbency",
      name: "Certificate of Incumbency",
      description: "This document should be certified.",
    },
  ]

  const handleFileChange = (fieldId: string, file: File) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: file,
    }))

    // Clear error for this field
    setErrors({ ...errors, [fieldId]: "" })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    documentFields.forEach((field) => {
      if (!formData[field.id as keyof typeof formData]) {
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
        console.log("Submitting documents:", formData)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Redirect to success page or dashboard
        router.push("/signup/success")
      } catch (error) {
        console.error("Error submitting documents:", error)
        alert("An error occurred while submitting your documents. Please try again.")
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-6">
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900">Business Documents</h3>
          <p className="text-sm text-gray-500">Please upload the constitutional documents of the Business.</p>
        </div>

        <div className="space-y-4">
          {documentFields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>
                {field.name} <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-gray-500">{field.description}</p>

              <div className="relative">
                <input
                  type="file"
                  id={field.id}
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileChange(field.id, file)
                  }}
                />
                <label
                  htmlFor={field.id}
                  className={`
                    flex items-center justify-center w-full p-3 border-2 border-dashed rounded-lg cursor-pointer
                    ${formData[field.id as keyof typeof formData] ? "border-emerald-500 bg-emerald-500/10" : "border-gray-300 hover:border-emerald-500"}
                  `}
                >
                  {formData[field.id as keyof typeof formData] ? (
                    <div className="text-emerald-600">{formData[field.id as keyof typeof formData]?.name}</div>
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
      </div>

      <div className="flex space-x-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1" disabled={isSubmitting}>
          Back
        </Button>
        <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </motion.form>
  )
}

