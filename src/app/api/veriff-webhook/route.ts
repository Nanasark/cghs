import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto"; // Needed for HMAC verification

export async function POST(request: Request) {
  try {
    // Get Veriff's webhook signature
    const signature = request.headers.get("x-auth-client-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    // Get raw body for signature verification
    const bodyText = await request.text();

    // Verify signature before parsing JSON
    const isValidSignature = verifySignature(bodyText, signature);
    if (!isValidSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse the JSON body after verifying signature
    const body = JSON.parse(bodyText);
    if (!body.verification) {
      return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
    }

    // Extract verification details
    const { id, status, vendorData, reason } = body.verification;
    const userId = vendorData ?? ""; // Ensure vendorData is present

    if (!userId) {
      return NextResponse.json({ error: "Missing user ID in webhook" }, { status: 400 });
    }

    // Update the user's KYC status in the database
    const updateData: Record<string, unknown> = { kyc_status: status };
    if (status === "approved") {
      updateData.kyc_verified_at = new Date().toISOString();
      updateData.kyc_verification_id = id;
    } else if (status === "declined") {
      updateData.kyc_rejection_reason = reason ?? "Unknown reason";
    }

    const { error } = await db.from("users").update(updateData).eq("id", userId);
    if (error) {
      console.error("Database update error:", error);
      return NextResponse.json({ error: "Failed to update user KYC status" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing Veriff webhook:", error);
    return NextResponse.json({ error: "Failed to process verification result" }, { status: 500 });
  }
}


function verifySignature(payload: string, signature: string): boolean {
  const secret = process.env.VERIFF_WEBHOOK_SECRET;
  if (!secret) {
    console.error("Missing VERIFF_WEBHOOK_SECRET");
    return false;
  }

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(payload);
  const expectedSignature = hmac.digest("hex");

  return expectedSignature === signature;
}
