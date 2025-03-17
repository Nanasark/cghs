import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, firstName, lastName, phoneNumber, idNumber, gender, dateOfBirth, documentNumber } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Call Veriff API to create a verification session
    const veriffResponse = await fetch("https://stationapi.veriff.com/v1/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-AUTH-CLIENT": process.env.VERIFF_API_KEY!,
      },
      body: JSON.stringify({
        verification: {
          callback: `https://cghs-rose.vercell.app/api/veriff-webhook`,
          person: {
            firstName: firstName || "John",
            lastName: lastName || "Smith",
            idNumber: idNumber || "123456789",
            phoneNumber: phoneNumber || "8888888888",
            gender: gender || "M",
            dateOfBirth: dateOfBirth || "1990-01-01",
          },
          document: {
            number: documentNumber || "B01234567",
            country: "US",
            type: "PASSPORT",
            idCardType: "CC",
            firstIssue: "2022-01-01",
          },
          address: {
            fullAddress: "123, Main Street, Your County, Anytown 12345",
          },
          vendorData: userId,
          endUserId: userId, // UUID for the user
          consents: [
            {
              type: "ine",
              approved: true,
            },
          ],
        },
      }),
    });

    if (!veriffResponse.ok) {
      const errorData = await veriffResponse.json();
      console.error("Veriff API error:", errorData);
      return NextResponse.json({ error: errorData }, { status: veriffResponse.status });
    }

    const sessionData = await veriffResponse.json();

    return NextResponse.json({
      sessionId: sessionData.verification.id,
      sessionUrl: sessionData.verification.url,
    });
  } catch (error) {
    console.error("Error creating verification session:", error);
    return NextResponse.json({ error: "Failed to create verification session" }, { status: 500 });
  }
}
