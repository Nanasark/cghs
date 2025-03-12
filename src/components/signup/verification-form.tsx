"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface VerificationFormProps {
  onBack: () => void
}

interface DocumentUpload {
  name: string
  file: File | null
  preview: string | null
}

export default function VerificationForm({ onBack }: VerificationFormProps) {
  const [documents, setDocuments] = useState<Record<string, DocumentUpload>>({
    businessRegistration: {
      name: "Business Registration Certificate",
      file: null,
      preview: null,
    },
    taxCertificate: {
      name: "Tax Certificate",
      file: null,
      preview: null,
    },
    directorId: {
      name: "Director's ID",
      file: null,
      preview: null,
    },
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleFileChange = (documentKey: string, file: File) => {
    setDocuments((prev) => ({
      ...prev,
      [documentKey]: {
        ...prev[documentKey],
        file,
        preview: URL.createObjectURL(file),
      },
    }))
    // Clear error when file is uploaded
    setErrors((prev) => ({
      ...prev,
      [documentKey]: "",
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    Object.entries(documents).forEach(([key, doc]) => {
      if (!doc.file) {
        newErrors[key] = `${doc.name} is required`
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Here you would typically upload the files to your API
      console.log("Uploading documents:", documents)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert("Documents submitted successfully!")
    }
  }

  return (
    <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {Object.entries(documents).map(([key, doc]) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-white">
              {doc.name} <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <input
                type="file"
                id={key}
                className="hidden"
                accept="image/*,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileChange(key, file)
                }}
              />
              <label
                htmlFor={key}
                className={`
                  flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer
                  ${doc.file ? "border-emerald-500 bg-emerald-500/10" : "border-gray-600 hover:border-emerald-500"}
                `}
              >
                {doc.preview ? (
                  <div className="text-emerald-400">{doc.file?.name}</div>
                ) : (
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Upload className="w-5 h-5" />
                    <span>Upload {doc.name}</span>
                  </div>
                )}
              </label>
            </div>
            {errors[key] && <p className="text-red-500 text-sm">{errors[key]}</p>}
          </div>
        ))}
      </div>

      <div className="flex space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1 border-gray-600 text-white hover:bg-gray-700"
        >
          Back
        </Button>
        <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
          Submit
        </Button>
      </div>
    </motion.form>
  )
}

