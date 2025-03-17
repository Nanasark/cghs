import { NextResponse } from "next/server";
import crypto from "crypto"; // Needed for HMAC verification
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    // Get Veriff's HMAC signature
    const signature = request.headers.get("x-hmac-signature") || "";

    // Get raw request body for signature verification
    const bodyText = await request.text();

    // Verify the signature
    if (!verifySignature(bodyText, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse JSON
    const body = JSON.parse(bodyText);
    console.log("Received Webhook Payload:", body);

    // Extract data safely
    const verification = body.data?.verification ?? null; // ✅ Handles new payload structure
    const userId = body.vendorData || null; // ✅ Supports `vendorData`
    const status = verification?.decision || body.status || "unknown"; // ✅ Uses decision/status

    // Ensure we have enough data to process
    if (!verification) {
      console.error("Missing verification data:", body);
      return NextResponse.json({ error: "Invalid payload structure" }, { status: 400 });
    }

    if (!userId) {
      console.warn("Warning: vendorData is missing or null. Cannot link verification to a user.");
    }

    // Handle different verification statuses
    let updateData: Record<string, unknown> = { kyc_status: status };

    if (status === "approved") {
      updateData = {
        address: userId,
        kyc_status: "approved",
        kyc_verified_at: new Date().toISOString(),
        kyc_verification_id: body.sessionId, // ✅ New identifier in payload
        document_type: verification.document?.type?.value || "unknown",
        document_country: verification.document?.country?.value || "unknown",
        document_number: verification.document?.number?.value || "unknown",
      };
    } else if (status === "declined") {
      updateData = {
        kyc_status: "rejected",
        kyc_rejection_reason: "Decision score too low" // Customize as needed
      };
    }

    // Upsert the user record with KYC status (only if we have a userId)
    if (userId) {
      await db.from("users").upsert(updateData, { onConflict: "address" });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing Veriff webhook:", error);
    return NextResponse.json({ error: "Failed to process verification result" }, { status: 500 });
  }
}

// HMAC Signature Verification
function verifySignature(payload: string, signature: string): boolean {
  const secret = process.env.VERIFF_API_KEY;
  if (!secret) {
    console.error("Missing VERIFF_API_KEY");
    return false;
  }

  // Compute HMAC-SHA256
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(payload);
  const expectedSignature = hmac.digest("hex");

  return expectedSignature === signature;
}



// import { NextResponse } from "next/server";
// import crypto from "crypto"; // Needed for HMAC verification
// import { db } from "@/lib/db";

// export async function POST(request: Request) {
//   try {
//     // Get the signature from the headers
//    const signature = request.headers.get("x-auth-client-signature") || "";


//     // Get the request body as text for signature verification
//     const bodyText = await request.text();
//     const body = JSON.parse(bodyText);

//     // Verify the signature
//     const isValidSignature = verifySignature(bodyText, signature);
//     if (!isValidSignature) {
//       return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
//     }

//     // Extract verification details
//     const { id, status, vendorData } = body.verification;
//     const userId = vendorData; // This is the user ID passed when creating the session

//     if (status === "approved") {
//       // Upsert user with KYC approval details
//       await db.from("users").upsert([
//         {
//           // Ensures matching userId if exists
//           address: userId, // Only used in insert (optional)
//           kyc_status: "approved",
//           kyc_verified_at: new Date().toISOString(),
//           kyc_verification_id: id,
//         },
//       ]);
//     } else if (status === "declined") {
//       // Upsert user with KYC rejection details
//       await db.from("users").upsert([
//         {
//           address: userId,
//           kyc_status: "rejected",
//           kyc_rejection_reason: body.verification.reason || "Unknown reason",
//         },
//       ]);
//     } else {
//       // Handle other statuses (resubmission_requested, expired, etc.)
//       await db.from("users").upsert([
//         {
//           address: userId,
//           kyc_status: status,
//         },
//       ]);
//     }

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Error processing Veriff webhook:", error);
//     return NextResponse.json(
//       { error: "Failed to process verification result" },
//       { status: 500 }
//     );
//   }
// }

// // Function to verify webhook signature
// function verifySignature(payload: string, signature: string): boolean {
//   const secret = process.env.VERIFF_API_KEY;
//   if (!secret) {
//     console.error("Missing VERIFF_API_KEY");
//     return false;
//   }

//   const hmac = crypto.createHmac("sha256", secret);
//   hmac.update(payload);
//   const expectedSignature = hmac.digest("hex");

//   return expectedSignature === signature;
// }
