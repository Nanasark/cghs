import { NextResponse } from "next/server"
import {db } from "@/lib/db"

export async function GET(request: Request, {
  params,
}: {
  params: Promise<{ id: string }>
}) {
  try {
        const { id } = await params

    // Get KYB application by ID from Supabase
    const { data, error } = await db.from("kyb").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching KYB application:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "KYB application not found" }, { status: 404 })
    }

    // Format the data for the frontend if needed
    const application = {
      id: data.id,
      businessDetails: data.business_details,
      documents: data.document_references,
      status: data.status,
      feedback: data.feedback,
      submittedAt: data.created_at,
      updatedAt: data.updated_at,
      email: data.email,
      contactName: data.contact_name,
    }

    return NextResponse.json(application)
  } catch (error) {
    console.error("Error fetching KYB application:", error)
    return NextResponse.json({ error: "Failed to fetch KYB application" }, { status: 500 })
  }
}

export async function PATCH(request: Request, {
  params,
}: {
  params: Promise<{ id: string }>
}) {
  try {
    const { id } = await params
    const data = await request.json()

    // Update KYB application in Supabase
    const { data: updatedData, error } = await db
      .from("kyb")
      .update({
        status: data.status,
        feedback: data.feedback,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating KYB application:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(updatedData)
  } catch (error) {
    console.error("Error updating KYB application:", error)
    return NextResponse.json({ error: "Failed to update KYB application" }, { status: 500 })
  }
}

