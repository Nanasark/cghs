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

    // Parse the verified request body
    const body = JSON.parse(bodyText);

    // Extract verification details
    const { id, status, vendorData } = body.verification;
    const userId = vendorData; // This is the user’s unique identifier

    // Handle different KYC verification statuses
    let updateData: Record<string, unknown> = { kyc_status: status };

    if (status === "approved") {
      updateData = {
        address: userId,
        kyc_status: "approved",
        kyc_verified_at: new Date().toISOString(),
        kyc_verification_id: id,
      };
    } else if (status === "declined") {
      updateData = {
        kyc_status: "rejected",
        kyc_rejection_reason: body.verification.reason || "Unknown reason",
      };
    }

    // Upsert the user record with KYC status
    await db.from("users").upsert(updateData, { onConflict: "address" });

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
