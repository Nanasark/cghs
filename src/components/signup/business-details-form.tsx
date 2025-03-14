"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"

interface BusinessDetailsFormProps {
  initialData: {
    businessId: string
    businessName: string
    addressLine1: string
    addressLine2: string
    cityRegion: string
    state: string
    country: string
    jurisdiction: string
    phoneNumber: string
    socialLinks: {
      linkedin: string
      twitter: string
      facebook: string
    }
  }
  onNext: (data: BusinessDetailsFormProps["initialData"]) => void
}

export default function BusinessDetailsForm({ initialData, onNext }: BusinessDetailsFormProps) {
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required"
    }
    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = "Address is required"
    }
    if (!formData.cityRegion.trim()) {
      newErrors.cityRegion = "City/Region is required"
    }
    if (!formData.country) {
      newErrors.country = "Country is required"
    }
    if (!formData.jurisdiction) {
      newErrors.jurisdiction = "Jurisdiction is required"
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required"
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
    <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
          Full Name of the Business <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="businessName"
          value={formData.businessName}
          onChange={(e) => {
            setFormData({ ...formData, businessName: e.target.value })
            setErrors({ ...errors, businessName: "" })
          }}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
          placeholder="Enter your business name"
        />
        {errors.businessName && <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>}
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Registered Address of the Business <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.addressLine1}
          onChange={(e) => {
            setFormData({ ...formData, addressLine1: e.target.value })
            setErrors({ ...errors, addressLine1: "" })
          }}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
          placeholder="Address line 1"
        />
        {errors.addressLine1 && <p className="mt-1 text-sm text-red-600">{errors.addressLine1}</p>}

        <input
          type="text"
          value={formData.addressLine2}
          onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
          placeholder="Address line 2 (optional)"
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              value={formData.cityRegion}
              onChange={(e) => {
                setFormData({ ...formData, cityRegion: e.target.value })
                setErrors({ ...errors, cityRegion: "" })
              }}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
              placeholder="City/Region"
            />
            {errors.cityRegion && <p className="mt-1 text-sm text-red-600">{errors.cityRegion}</p>}
          </div>
          <div>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
              placeholder="State/Province"
            />
          </div>
        </div>

        <select
          value={formData.country}
          onChange={(e) => {
            setFormData({ ...formData, country: e.target.value })
            setErrors({ ...errors, country: "" })
          }}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
        >
          <option value="">Select country</option>
          <option value="GH">Ghana</option>
          <option value="NG">Nigeria</option>
          {/* Add more countries */}
        </select>
        {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
      </div>

      <div>
        <label htmlFor="jurisdiction" className="block text-sm font-medium text-gray-700">
          Jurisdiction of Incorporation <span className="text-red-500">*</span>
        </label>
        <select
          id="jurisdiction"
          value={formData.jurisdiction}
          onChange={(e) => {
            setFormData({ ...formData, jurisdiction: e.target.value })
            setErrors({ ...errors, jurisdiction: "" })
          }}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
        >
          <option value="">Select jurisdiction</option>
          <option value="GH">Ghana</option>
          <option value="NG">Nigeria</option>
          {/* Add more countries */}
        </select>
        {errors.jurisdiction && <p className="mt-1 text-sm text-red-600">{errors.jurisdiction}</p>}
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
          Telephone number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="phoneNumber"
          value={formData.phoneNumber}
          onChange={(e) => {
            setFormData({ ...formData, phoneNumber: e.target.value })
            setErrors({ ...errors, phoneNumber: "" })
          }}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
          placeholder="Enter your business phone number"
        />
        {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          Continue
        </button>
      </div>
    </motion.form>
  )
}

