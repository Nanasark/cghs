'use server'

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db'; // Your database connection

interface KYBD{
  status: unknown
  documents:unknown
}

export async function submitKybData(businessId: string, kybData:KYBD, address:string) {
  try {
    // 1. Store the complete KYB data in your database
    // await db.kybApplications.upsert({
    //   where: { businessId },
    //   update: {
    //     businessDetails: kybData.businessDetails,
    //     documents: kybData.documents,
    //     status: kybData.status,
    //     updatedAt: new Date(),
    //   },
    //   create: {
    //     businessId,
    //     businessDetails: kybData.businessDetails,
    //     documents: kybData.documents,
    //     status: kybData.status,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    // });

   const metadata = {
  id: businessId, // Unique identifier for the KYB submission
   userAddress:  address, // If tracking the creator
  status: kybData.status, // "pending", "approved", etc.
  document_references: kybData.documents, // Stores only Cloudinary references
};
    
      const { error } = await db
        .from("kyb")
        .insert(metadata)
        .select()
        .single();
        if (error) {
          throw new Error(`Supabase error: ${error.message}`);
        }

    // 2. You might want to trigger notifications or other processes
    // await sendKybSubmissionNotification(businessId);
    
    // 3. Revalidate relevant paths
    revalidatePath(`/dashboard`);
    revalidatePath(`/admin/kyb`);
    
    return { success: true };
  } catch (error) {
    console.error('Error submitting KYB data:', error);
    throw new Error('Failed to submit KYB application');
  }
}