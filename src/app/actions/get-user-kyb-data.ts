"use server"
import { db } from "@/lib/db"

function delay(ms:number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getUserKybData(walletAddress: string) {
  try {

    await delay(500)
    if (!walletAddress) {
      throw new Error("Wallet address required")
    }


    await walletAddress;
    // Normalize address to lowercase for consistency


    // Get the user's business ID using their wallet address
    // const { data: user, error: userError } = await db
    //   .from("users")
    //   .select("businessId")
    //   .eq("address", walletAddress)
    //   .single()

    // if (userError) throw userError
    // if (!user || !user.businessId) {
    //   throw new Error("No business associated with this wallet address")
    // }

    // Get the KYB data for the business
    const { data: kybData, error: kybError } = await db
      .from("kyb")
      .select("document_references,status")
      // .select("status, documents, businessDetails, feedback, issues")
      .eq("userAddress", walletAddress)
      .single()
console.log("Data:", kybData);
    if (kybError) throw kybError

    return kybData || null
  } catch (error) {
    console.error("Error fetching KYB data:", error)
    console.log(walletAddress)
    throw error
  }
}