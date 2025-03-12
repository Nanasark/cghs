"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ContactInformationFormProps {
  initialData: {
    contactName: string
    email: string
  }
  onNext: (data: { contactName: string; email: string }) => void
  onBack: () => void
}

export default function ContactInformationForm({ initialData, onNext, onBack }: ContactInformationFormProps) {
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.contactName.trim()) {
      newErrors.contactName = "Contact name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
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
          <Label htmlFor="contactName">
            Contact Person Legal Fullname <span className="text-red-500">*</span>
          </Label>
          <Input
            id="contactName"
            placeholder="Enter legal fullname"
            value={formData.contactName}
            onChange={(e) => {
              setFormData({ ...formData, contactName: e.target.value })
              setErrors({ ...errors, contactName: "" })
            }}
            className="border-gray-300"
          />
          {errors.contactName && <p className="text-red-500 text-sm">{errors.contactName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value })
              setErrors({ ...errors, email: "" })
            }}
            className="border-gray-300"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
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

