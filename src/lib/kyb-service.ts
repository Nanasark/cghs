import { db} from "./db" 

export async function getKybApplicationStatus(id: string) {
  try {
    const { data, error } = await db
      .from("kyb")
      .select("id, status, feedback, updated_at")
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching KYB application status:", error)
      throw new Error(`Failed to fetch KYB application status: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error("Error in getKybApplicationStatus:", error)
    throw error
  }
}