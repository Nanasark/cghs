"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, Plus, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface Controller {
  type: string
  id: File | null
  address: File | null
}

interface ControllersFormProps {
  initialData: {
    controllers: Controller[]
  }
  onNext: (data: ControllersFormProps["initialData"]) => void
  onBack: () => void
}

export default function ControllersForm({ initialData, onNext, onBack }: ControllersFormProps) {
  const [controllers, setControllers] = useState<Controller[]>(
    initialData.controllers.length > 0 ? initialData.controllers : [{ type: "", id: null, address: null }],
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleTypeChange = (index: number, value: string) => {
    const newControllers = [...controllers]
    newControllers[index].type = value
    setControllers(newControllers)

    // Clear error for this field
    setErrors({ ...errors, [`controller${index}Type`]: "" })
  }

  const handleFileChange = (index: number, fileType: "id" | "address", file: File) => {
    const newControllers = [...controllers]
    newControllers[index][fileType] = file
    setControllers(newControllers)

    // Clear error for this field
    setErrors({ ...errors, [`controller${index}${fileType}`]: "" })
  }

  const addController = () => {
    setControllers([...controllers, { type: "", id: null, address: null }])
  }

  const removeController = (index: number) => {
    if (controllers.length > 1) {
      const newControllers = [...controllers]
      newControllers.splice(index, 1)
      setControllers(newControllers)

      // Remove errors for this controller
      const newErrors = { ...errors }
      delete newErrors[`controller${index}Type`]
      delete newErrors[`controller${index}id`]
      delete newErrors[`controller${index}address`]
      setErrors(newErrors)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    controllers.forEach((controller, index) => {
      if (!controller.type) {
        newErrors[`controller${index}Type`] = "Controller type is required"
      }

      if (!controller.id) {
        newErrors[`controller${index}id`] = "ID document is required"
      }

      if (!controller.address) {
        newErrors[`controller${index}address`] = "Proof of address is required"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onNext({ controllers })
    }
  }

  return (
    <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-6">
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900">Controllers</h3>
          <p className="text-sm text-gray-500">
            Controllers are individuals with significant control over the Business. Please add:
          </p>
          <ul className="list-disc pl-5 mt-2 text-sm text-gray-500">
            <li>Any shareholder or ultimate beneficial owner(s) holding equal or more than 10% shares</li>
            <li>All directors</li>
          </ul>
        </div>

        <div className="space-y-6">
          {controllers.map((controller, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md relative">
              {controllers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeController(index)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}

              <div className="mb-4">
                <h4 className="text-md font-medium text-gray-900">Controller {index + 1}</h4>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor={`controller${index}Type`}>
                    Type of controller <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id={`controller${index}Type`}
                    value={controller.type}
                    onChange={(e) => handleTypeChange(index, e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                  >
                    <option value="">Select type</option>
                    <option value="director">Director</option>
                    <option value="shareholder">Shareholder</option>
                    <option value="both">Both Director and Shareholder</option>
                  </select>
                  {errors[`controller${index}Type`] && (
                    <p className="mt-1 text-sm text-red-600">{errors[`controller${index}Type`]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`controller${index}Id`}>
                    Passport or Identity Document <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <input
                      type="file"
                      id={`controller${index}Id`}
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileChange(index, "id", file)
                      }}
                    />
                    <label
                      htmlFor={`controller${index}Id`}
                      className={`
                        flex items-center justify-center w-full p-3 border-2 border-dashed rounded-lg cursor-pointer
                        ${controller.id ? "border-emerald-500 bg-emerald-500/10" : "border-gray-300 hover:border-emerald-500"}
                      `}
                    >
                      {controller.id ? (
                        <div className="text-emerald-600">{controller.id.name}</div>
                      ) : (
                        <div className="flex items-center space-x-2 text-gray-500">
                          <Upload className="w-4 h-4" />
                          <span>Upload ID</span>
                        </div>
                      )}
                    </label>
                  </div>
                  {errors[`controller${index}id`] && (
                    <p className="mt-1 text-sm text-red-600">{errors[`controller${index}id`]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`controller${index}Address`}>
                    Proof of Address <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <input
                      type="file"
                      id={`controller${index}Address`}
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileChange(index, "address", file)
                      }}
                    />
                    <label
                      htmlFor={`controller${index}Address`}
                      className={`
                        flex items-center justify-center w-full p-3 border-2 border-dashed rounded-lg cursor-pointer
                        ${controller.address ? "border-emerald-500 bg-emerald-500/10" : "border-gray-300 hover:border-emerald-500"}
                      `}
                    >
                      {controller.address ? (
                        <div className="text-emerald-600">{controller.address.name}</div>
                      ) : (
                        <div className="flex items-center space-x-2 text-gray-500">
                          <Upload className="w-4 h-4" />
                          <span>Upload Proof of Address</span>
                        </div>
                      )}
                    </label>
                  </div>
                  {errors[`controller${index}address`] && (
                    <p className="mt-1 text-sm text-red-600">{errors[`controller${index}address`]}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addController}
          className="mt-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add more Controller
        </button>
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

