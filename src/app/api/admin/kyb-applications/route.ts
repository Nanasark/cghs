import { NextResponse } from "next/server"
import { db as supabaseAdmin } from "@/lib/db"

export async function GET() {
  try {
    // Get all KYB applications from Supabase
    const { data, error } = await supabaseAdmin
      .from("kyb")
      .select("id, business_details, contact_name, email, created_at, status")
      .order("created_at", { ascending: false });

console.log("Fetched Data:", JSON.stringify(data, null, 2));
    if (error) {
      console.error("Error fetching KYB applications:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Format the data for the frontend
    const applications = data.map((app) => ({
      id: app.id,
      businessName: app.business_details.businessName || "Unknown Business",
       contactName: app.contact_name,
      email: app.email,
      date: new Date(app.created_at).toISOString().split("T")[0], // Format as YYYY-MM-DD
      status: app.status,
    }))

    return NextResponse.json(applications)
  } catch (error) {
    console.error("Error fetching KYB applications:", error)
    return NextResponse.json({ error: "Failed to fetch KYB applications" }, { status: 500 })
  }
}

