"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface BusinessDetailsFormProps {
  initialData: {
    businessName: string
    isRegistered: boolean
  }
  onNext: (data: { businessName: string; isRegistered: boolean }) => void
}

export default function BusinessDetailsForm({ initialData, onNext }: BusinessDetailsFormProps) {
  const [formData, setFormData] = useState(initialData)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.businessName.trim()) {
      setError("Business name is required")
      return
    }
    onNext(formData)
  }

  return (
    <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="businessName">
            Business Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="businessName"
            placeholder="Enter your business name"
            value={formData.businessName}
            onChange={(e) => {
              setFormData({ ...formData, businessName: e.target.value })
              setError("")
            }}
            className="border-gray-300"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isRegistered"
            checked={formData.isRegistered}
            onCheckedChange={(checked) => setFormData({ ...formData, isRegistered: checked as boolean })}
          />
          <Label htmlFor="isRegistered" className="text-sm text-gray-600">
            Registered Business
          </Label>
        </div>
        {formData.isRegistered && (
          <p className="text-sm text-gray-500">
            My business has the approval, documentation, and licenses required to operate legally
          </p>
        )}
      </div>

      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
        Get started
      </Button>
    </motion.form>
  )
}

