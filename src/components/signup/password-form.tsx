"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Check } from "lucide-react"

interface PasswordFormProps {
  onSubmit: (password: string) => void
  onBack: () => void
}

interface PasswordRequirement {
  label: string
  test: (password: string) => boolean
}

const passwordRequirements: PasswordRequirement[] = [
  {
    label: "Has at least 12 characters",
    test: (password) => password.length >= 12,
  },
  {
    label: "Contains at least one number",
    test: (password) => /\d/.test(password),
  },
  {
    label: "Contains at least one lowercase letter",
    test: (password) => /[a-z]/.test(password),
  },
  {
    label: "Contains at least one uppercase letter",
    test: (password) => /[A-Z]/.test(password),
  },
]

export default function PasswordForm({ onSubmit, onBack }: PasswordFormProps) {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const getPasswordStrength = () => {
    const meetsAllRequirements = passwordRequirements.every((req) => req.test(formData.password))
    return meetsAllRequirements ? "strong" : "weak"
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (getPasswordStrength() !== "strong") {
      newErrors.password = "Password does not meet all requirements"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData.password)
    }
  }

  return (
    <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Password must have at least 8 characters, 1 uppercase letter and 1 number
        </p>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value })
                setErrors({ ...errors, password: "" })
              }}
              className="border-gray-300 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Password strength:</span>
            <span className={`text-sm ${getPasswordStrength() === "strong" ? "text-emerald-600" : "text-gray-600"}`}>
              {getPasswordStrength()}
            </span>
          </div>

          <div className="space-y-2">
            {passwordRequirements.map((req, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <Check size={16} className={req.test(formData.password) ? "text-emerald-600" : "text-gray-400"} />
                <span className={req.test(formData.password) ? "text-gray-900" : "text-gray-500"}>{req.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value })
                setErrors({ ...errors, confirmPassword: "" })
              }}
              className="border-gray-300 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
        </div>
      </div>

      <div className="flex space-x-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
          Create account
        </Button>
      </div>
    </motion.form>
  )
}

