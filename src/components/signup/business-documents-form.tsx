"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { uploadKybDocument } from "@/app/actions/upload-document"
import { submitKybData } from "@/app/actions/submit-kyb-data"
import { useActiveAccount } from "thirdweb/react"
import EmailLogin from "../login/withEmail"
import { isAddress } from "thirdweb"

interface UploadResult {
  public_id: string;
  secure_url: string;
  resource_type: string;
  format: string;
}
interface KYBDocument {
  url: string
  format: string
  publicId: string
  uploadedAt: string // Can be converted to Date if needed
  resourceType: string
  value?:unknown
}

type KYBDocuments = Record<string, KYBDocument>
interface Controller {
  type: string
  id: File | null
  address: File | null
}
interface BusinessDocumentsFormProps {
  initialData: {
    businessId: string
     incorporation: File | null
    articles: File | null
    shareholders: File | null
    directors: File | null
    orgChart: File | null
    incumbency: File | null
    representativeId: File | null
    representativeAddress: File | null
    controllers: Controller[]
    businessName:string,
        addressLine1: string;
  addressLine2?: string; // Optional if it might be empty
  cityRegion: string;
  state: string;
  country: string;
  jurisdiction: string;
  phoneNumber: string;
  }
  onBack: () => void
}

export default function BusinessDocumentsForm({ initialData, onBack }: BusinessDocumentsFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const account = useActiveAccount()
  const address = account? account.address :""
// const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, any>>({})
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

//   const handleFileUpload = async (fieldId: string, file: File) => {
//     try {
//       const formData = new FormData();
//       formData.append('file', file);
      
//       // Show loading state
//       setUploadedDocuments(prev => ({
//         ...prev,
//         [fieldId]: { ...prev[fieldId], isUploading: true }
//       }));
      
//       // Upload to Cloudinary via server action
//       const result = await uploadKybDocument(
//         formData, 
//         initialData.businessId, 
//         fieldId
//       );
      
//       // Update state with upload result
//       setUploadedDocuments(prev => ({
//         ...prev,
//         [fieldId]: {
//           file,
//           result,
//           isUploading: false
//         }
//       }));
      
//       // Clear error
//       setErrors(prev => ({ ...prev, [fieldId]: "" }));
      
//     } catch (error) {
//       console.error(`Error uploading ${fieldId}:`, error);
//       setErrors(prev => ({ 
//         ...prev, 
//         [fieldId]: "Failed to upload document. Please try again." 
//       }));
      
//       setUploadedDocuments(prev => ({
//         ...prev,
//         [fieldId]: { ...prev[fieldId], isUploading: false }
//       }));
//     }
//   }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // documentFields.forEach(field => {
    //   if (!uploadedDocuments[field.id]) {
    //     newErrors[field.id] = `${field.name} is required`;
    //   }
    // });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      // 1️⃣ Upload all files first
      const documentReferences: KYBDocuments = {}

      // Process business documents from current step
      for (const field of documentFields) {
        const fieldId = field.id
        const fileData = formData[fieldId as keyof typeof formData]

        if (fileData instanceof File) {
          const formData = new FormData()
          formData.append("file", fileData)

          const result: UploadResult = await uploadKybDocument(formData, initialData.businessId, fieldId)

          documentReferences[fieldId] = {
            publicId: result.public_id,
            url: result.secure_url,
            resourceType: result.resource_type,
            format: result.format,
            uploadedAt: new Date().toISOString(),
          }
        }
      }

      // Process representative documents from previous step
      if (initialData.representativeId instanceof File) {
        const repIdFormData = new FormData()
        repIdFormData.append("file", initialData.representativeId)
        const repIdResult: UploadResult = await uploadKybDocument(
          repIdFormData,
          initialData.businessId,
          "representativeId",
        )
        documentReferences["representativeId"] = {
          publicId: repIdResult.public_id,
          url: repIdResult.secure_url,
          resourceType: repIdResult.resource_type,
          format: repIdResult.format,
          uploadedAt: new Date().toISOString(),
        }
      }

      if (initialData.representativeAddress instanceof File) {
        const repAddressFormData = new FormData()
        repAddressFormData.append("file", initialData.representativeAddress)
        const repAddressResult: UploadResult = await uploadKybDocument(
          repAddressFormData,
          initialData.businessId,
          "representativeAddress",
        )
        documentReferences["representativeAddress"] = {
          publicId: repAddressResult.public_id,
          url: repAddressResult.secure_url,
          resourceType: repAddressResult.resource_type,
          format: repAddressResult.format,
          uploadedAt: new Date().toISOString(),
        }
      }

      // Process controller documents from previous step
      if (initialData.controllers && initialData.controllers.length > 0) {
        for (let i = 0; i < initialData.controllers.length; i++) {
          const controller = initialData.controllers[i]
          const controllerIndex = i + 1

          // Upload controller ID document
          if (controller.id instanceof File) {
            const controllerIdFormData = new FormData()
            controllerIdFormData.append("file", controller.id)
            const fieldId = `controller${controllerIndex}_id`
            const controllerIdResult: UploadResult = await uploadKybDocument(
              controllerIdFormData,
              initialData.businessId,
              fieldId,
            )

            documentReferences[fieldId] = {
              publicId: controllerIdResult.public_id,
              url: controllerIdResult.secure_url,
              resourceType: controllerIdResult.resource_type,
              format: controllerIdResult.format,
              uploadedAt: new Date().toISOString(),
            }
          }

          // Upload controller address document
          if (controller.address instanceof File) {
            const controllerAddressFormData = new FormData()
            controllerAddressFormData.append("file", controller.address)
            const fieldId = `controller${controllerIndex}_address`
            const controllerAddressResult: UploadResult = await uploadKybDocument(
              controllerAddressFormData,
              initialData.businessId,
              fieldId,
            )

            documentReferences[fieldId] = {
              publicId: controllerAddressResult.public_id,
              url: controllerAddressResult.secure_url,
              resourceType: controllerAddressResult.resource_type,
              format: controllerAddressResult.format,
              uploadedAt: new Date().toISOString(),
            }
          }

          // Store controller type information
          documentReferences[`controller${controllerIndex}_type`] = {
            publicId: "",
            url: "",
            resourceType: "text",
            format: "text",
            uploadedAt: new Date().toISOString(),
            value: controller.type, // Store the controller type as a value
          }
        }
      }

      // 2️⃣ Combine previous business details + uploaded file data
      const completeKybData = {
        businessDetails: {
          businessName: initialData.businessName,
          addressLine1: initialData.addressLine1,
          addressLine2: initialData.addressLine2,
          cityRegion: initialData.cityRegion,
          state: initialData.state,
          country: initialData.country,
          jurisdiction: initialData.jurisdiction,
          phoneNumber: initialData.phoneNumber,
        },
        documents: documentReferences, // Now contains all uploaded files
        submittedAt: new Date().toISOString(),
        status: "pending",
      }

      // 3️⃣ Submit the complete KYB data to backend
      await submitKybData(initialData.businessId, completeKybData, address)

      // 4️⃣ Redirect to success page
      router.push("/signup/success")
    } catch (error) {
      console.error("Error submitting KYB data:", error)
      alert("An error occurred while submitting your information. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }
// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   if (!validateForm()) return;

//   setIsSubmitting(true);
//   try {
//     // 1️⃣ Upload all files first
//     const documentReferences: KYBDocuments = {};

//     for (const [fieldId, fileData] of Object.entries(formData)) {
//       if (fileData instanceof File) {
//         const formData = new FormData();
//         formData.append("file", fileData);

//         const result: UploadResult  = await uploadKybDocument(formData, initialData.businessId, fieldId);

//         documentReferences[fieldId] = {
//           publicId: result.public_id,
//           url: result.secure_url,
//           resourceType: result.resource_type,
//           format: result.format,
//           uploadedAt: new Date().toISOString(),
//         };
//       }
//     }

//     // 2️⃣ Combine previous business details + uploaded file data
//     const completeKybData = {
//       businessDetails: {
//         businessName: initialData.businessName,
//         addressLine1: initialData.addressLine1,
//         addressLine2: initialData.addressLine2,
//         cityRegion: initialData.cityRegion,
//         state: initialData.state,
//         country: initialData.country,
//         jurisdiction: initialData.jurisdiction,
//         phoneNumber: initialData.phoneNumber,
//       },
//       documents: documentReferences, // Now contains all uploaded files
//       submittedAt: new Date().toISOString(),
//       status: "pending",
//     };

//     // 3️⃣ Submit the complete KYB data to backend
//     await submitKybData(initialData.businessId, completeKybData, address);

//     // 4️⃣ Redirect to success page
//     router.push("/signup/success");
//   } catch (error) {
//     console.error("Error submitting KYB data:", error);
//     alert("An error occurred while submitting your information. Please try again.");
//   } finally {
//     setIsSubmitting(false);
//   }
// };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (validateForm()) {
//       setIsSubmitting(true);
      
//       try {
//         // 1. Create a record of all uploaded documents
//         const documentReferences = Object.entries(uploadedDocuments).reduce(
//           (acc, [key, value]) => {
//             if (value && value.result) {
//               acc[key] = {
//                 publicId: value.result.public_id,
//                 url: value.result.secure_url,
//                 resourceType: value.result.resource_type,
//                 format: value.result.format,
//                 uploadedAt: new Date().toISOString()
//               };
//             }
//             return acc;
//           }, 
//           {} as Record<string, any>
//         );
        
//         // 2. Combine form data from previous steps with document references
//         const completeKybData = {
//           // Business details from previous steps
//           businessDetails: {
//             businessName: initialData.businessName,
//             addressLine1: initialData.addressLine1,
//             addressLine2: initialData.addressLine2,
//             cityRegion: initialData.cityRegion,
//             state: initialData.state,
//             country: initialData.country,
//             jurisdiction: initialData.jurisdiction,
//             phoneNumber: initialData.phoneNumber,
//             // Other business details...
//           },
//           // Document references from Cloudinary
//           documents: documentReferences,
//           // Metadata
//           submittedAt: new Date().toISOString(),
//           status: "pending"
//         };
        

//         await handleFileUpload()
//         // 3. Submit the complete KYB data to your backend
//         await submitKybData(initialData.businessId, completeKybData);
        
//         // 4. Redirect to success page
//         router.push("/signup/success");
//       } catch (error) {
//         console.error("Error submitting KYB data:", error);
//         alert("An error occurred while submitting your information. Please try again.");
//       } finally {
//         setIsSubmitting(false);
//       }
//     }
//   }

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
                  {/* {formData[field.id as keyof typeof formData] ? (
                    <div className="text-emerald-600">{formData[field.id as keyof typeof formData]?.name}</div>
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Upload className="w-4 h-4" />
                      <span>Upload {field.name}</span>
                    </div>
                  )} */}
                  {formData[field.id as keyof typeof formData] ? (
                    typeof formData[field.id as keyof typeof formData] === "object" &&
                    "name" in (formData[field.id as keyof typeof formData] as File) ? (
                      <div className="text-emerald-600">
                        {(formData[field.id as keyof typeof formData] as File).name}
                      </div>
                    ) : (
                      <div className="text-gray-600">File uploaded</div> // Fallback if it's not a File
                    )
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
        {
          isAddress(address) ?
        
            <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button> :
            <EmailLogin label={"Sign In to submit"} />
        }
      </div>
    </motion.form>
  )
}

