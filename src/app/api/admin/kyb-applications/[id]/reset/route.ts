import { NextResponse } from "next/server"
import { db as supabaseAdmin } from "@/lib/db"

export async function POST(request: Request, {
  params,
}: {
  params: Promise<{ id: string }>
}) {
  try {
         const { id } = await params


    // Get current application data
    const { data: application, error: fetchError } = await supabaseAdmin
      .from("kyb")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError || !application) {
      console.error("Error fetching KYB application:", fetchError)
      return NextResponse.json({ error: "KYB application not found" }, { status: 404 })
    }

    // Reset application status to pending
    const { data: updatedApplication, error: updateError } = await supabaseAdmin
      .from("kyb")
      .update({
        status: "pending",
        feedback: null, // Remove any previous feedback
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (updateError) {
      console.error("Error resetting KYB application status:", updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json(updatedApplication)
  } catch (error) {
    console.error("Error resetting KYB application status:", error)
    return NextResponse.json({ error: "Failed to reset KYB application status" }, { status: 500 })
  }
}

