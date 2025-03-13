"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface AuthorisedRepresentativeFormProps {
  initialData: {
    representativeId: File | null
    representativeAddress: File | null
  }
  onNext: (data: AuthorisedRepresentativeFormProps["initialData"]) => void
  onBack: () => void
}

export default function AuthorisedRepresentativeForm({
  initialData,
  onNext,
  onBack,
}: AuthorisedRepresentativeFormProps) {
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleFileChange = (field: "representativeId" | "representativeAddress", file: File) => {
    setFormData({ ...formData, [field]: file })
    setErrors({ ...errors, [field]: "" })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.representativeId) {
      newErrors.representativeId = "Passport or identity document is required"
    }

    if (!formData.representativeAddress) {
      newErrors.representativeAddress = "Proof of address is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onNext(formData)
    }
  }

  return (
    <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="representativeId">
            Passport or Identity Document <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <input
              type="file"
              id="representativeId"
              className="hidden"
              accept="image/*,.pdf"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileChange("representativeId", file)
              }}
            />
            <label
              htmlFor="representativeId"
              className={`
                flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer
                ${formData.representativeId ? "border-emerald-500 bg-emerald-500/10" : "border-gray-300 hover:border-emerald-500"}
              `}
            >
              {formData.representativeId ? (
                <div className="text-emerald-600">{formData.representativeId.name}</div>
              ) : (
                <div className="flex items-center space-x-2 text-gray-500">
                  <Upload className="w-5 h-5" />
                  <span>Upload Passport or ID</span>
                </div>
              )}
            </label>
          </div>
          {errors.representativeId && <p className="text-red-500 text-sm">{errors.representativeId}</p>}
          <p className="text-sm text-gray-500">Upload a clear image of your passport or government-issued ID</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="representativeAddress">
            Proof of Address <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <input
              type="file"
              id="representativeAddress"
              className="hidden"
              accept="image/*,.pdf"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileChange("representativeAddress", file)
              }}
            />
            <label
              htmlFor="representativeAddress"
              className={`
                flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer
                ${formData.representativeAddress ? "border-emerald-500 bg-emerald-500/10" : "border-gray-300 hover:border-emerald-500"}
              `}
            >
              {formData.representativeAddress ? (
                <div className="text-emerald-600">{formData.representativeAddress.name}</div>
              ) : (
                <div className="flex items-center space-x-2 text-gray-500">
                  <Upload className="w-5 h-5" />
                  <span>Upload Proof of Address</span>
                </div>
              )}
            </label>
          </div>
          {errors.representativeAddress && <p className="text-red-500 text-sm">{errors.representativeAddress}</p>}
          <p className="text-sm text-gray-500">
            Upload a recent utility bill or bank statement (not older than 3 months)
          </p>
        </div>
      </div>

      <div className="flex space-x-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
          Continue
        </Button>
      </div>
    </motion.form>
  )
}

