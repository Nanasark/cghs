import { NextResponse } from "next/server";
import crypto from "crypto"; // Needed for HMAC verification
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    // Get the signature from the headers
   const signature = request.headers.get("x-auth-client-signature") || "";


    // Get the request body as text for signature verification
    const bodyText = await request.text();
    const body = JSON.parse(bodyText);

    // Verify the signature
    const isValidSignature = verifySignature(bodyText, signature);
    if (!isValidSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Extract verification details
    const { id, status, vendorData } = body.verification;
    const userId = vendorData; // This is the user ID passed when creating the session

    if (status === "approved") {
      // Upsert user with KYC approval details
      await db.from("users").upsert([
        {
          // Ensures matching userId if exists
          address: userId, // Only used in insert (optional)
          kyc_status: "approved",
          kyc_verified_at: new Date().toISOString(),
          kyc_verification_id: id,
        },
      ]);
    } else if (status === "declined") {
      // Upsert user with KYC rejection details
      await db.from("users").upsert([
        {
          address: userId,
          kyc_status: "rejected",
          kyc_rejection_reason: body.verification.reason || "Unknown reason",
        },
      ]);
    } else {
      // Handle other statuses (resubmission_requested, expired, etc.)
      await db.from("users").upsert([
        {
          address: userId,
          kyc_status: status,
        },
      ]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing Veriff webhook:", error);
    return NextResponse.json(
      { error: "Failed to process verification result" },
      { status: 500 }
    );
  }
}

// Function to verify webhook signature
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
