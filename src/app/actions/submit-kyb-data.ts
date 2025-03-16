'use server'

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db'; // Your database connection


interface DocumentReference {
  url: string
  format: string
  publicId: string
  uploadedAt: string
  resourceType: string
  value?: string
}
interface BusinessDetails {
  businessName: string
  addressLine1: string
  addressLine2?: string
  cityRegion: string
  state: string
  country: string
  jurisdiction: string
  phoneNumber: string
}

interface KYBD{
  status: unknown
   businessDetails: BusinessDetails
  documents: Record<string, DocumentReference>
  contactName: string
  email: string
}

export async function submitKybData(businessId: string, kybData:KYBD, address:string) {
  try {
    
   const metadata = {
  id: businessId, // Unique identifier for the KYB submission
  userAddress:  address, // If tracking the creator
  status: kybData.status, // "pending", "approved", etc.
  document_references: kybData.documents, // Stores only Cloudinary references
  business_details:kybData.businessDetails,
  contact_name: kybData.contactName,
  email: kybData.email,
};
    
      const { data:result,error } = await db
        .from("kyb")
        .insert(metadata)
        .select()
        .single();
    if (error) {
      console.error("Error submitting KYB application:", error)
      throw new Error(`Failed to submit KYB application: ${error.message}`)
    }

    // 2. You might want to trigger notifications or other processes
    // await sendKybSubmissionNotification(businessId);
       // 3. Revalidate relevant paths
    revalidatePath(`/dashboard`);
    revalidatePath(`/admin/kyb`);


     return {result, success: true };
  
   
  } catch (error) {
    console.error('Error submitting KYB data:', error);
    throw new Error('Failed to submit KYB application');
  }
}