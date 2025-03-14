'use server'

import cloudinary from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';

interface UploadResult {
  public_id: string;
  secure_url: string;
  resource_type: string;
  format: string;
  
  [key: string]: unknown; // To accommodate any additional properties returned by Cloudinary
}


export async function uploadKybDocument(
  formData: FormData,
  businessId: string,
  documentType: string
): Promise<UploadResult> {
  try {
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('No file provided');
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const folder = `kyb/${businessId}/${documentType}`;
    
    const result: UploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
          tags: ["kyb", businessId, documentType],
          context: `business_id=${businessId}&document_type=${documentType}`,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            reject(error);
          } else {
            resolve(result as UploadResult); // Explicitly assert result type
          }
        }
      );

      uploadStream.end(buffer);
    });

    revalidatePath(`/signup/success`);
    return result;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
}
