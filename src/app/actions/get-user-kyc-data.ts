"use server"
import {db as supabase} from "@/lib/db"
export async function getUserKycData(userId: string) {
  if (!userId) {
    return null
  }

  try {
    // Fetch the user's KYC status from your database
    const { data, error } = await supabase
      .from("users")
      .select("kyc_status, kyc_verified_at, kyc_verification_id, kyc_rejection_reason")
      .eq("address", userId)
      .single()

    if (error) {
      console.error("Error fetching KYC data:", error)
      return null
    }

    return {
      status: data?.kyc_status || "not_started",
      verifiedAt: data?.kyc_verified_at || null,
      verificationId: data?.kyc_verification_id || null,
      rejectionReason: data?.kyc_rejection_reason || null,
    }
  } catch (error) {
    console.error("Error in getUserKycData:", error)
    return null
  }
}

