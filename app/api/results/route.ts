import { inngest } from "@/inngest/client";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("[ResultsAPI] Incoming POST /api/results");

  try {
    const body = await req.json();
    console.log("[ResultsAPI] Request body received");

    const soil_test_data = body.soil_test_data;
    const other_data = body.other_data;

    if (!soil_test_data || !other_data) {
      console.error("[ResultsAPI] Missing required fields", {
        hasSoil: !!soil_test_data,
        hasOther: !!other_data,
      });

      return NextResponse.json(
        { error: "Missing soil test or other data" },
        { status: 400 }
      );
    }

    const user = await currentUser();

    if (!user) {
      console.error("[ResultsAPI] No authenticated user found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[ResultsAPI] Authenticated user", {
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress,
      name: user.firstName,
    });

    console.log("[ResultsAPI] Sending event to Inngest");

    const result = await inngest.send({
      name: "ai/generate-crop-yield",
      data: {
        userEmail: user.primaryEmailAddress?.emailAddress,
        userName: user.firstName?.trim(),
        soil_test_file: soil_test_data,
        other_data: other_data,
      },
    });
    //~ for testing uncomment below
    // const result = await inngest.send({
    //         name: "test/hello.worldlonger", // Ensure this matches your function trigger
    //         data: { email: "test2@example.com" },
    //     });
    const eventId = result.ids?.[0];

    if (!eventId) {
      console.error("[ResultsAPI] Inngest did not return event ID", result);
      return NextResponse.json(
        { error: "Failed to start background job" },
        { status: 500 }
      );
    }

    console.log("[ResultsAPI] Inngest job triggered successfully", {
      eventId,
    });

    return NextResponse.json({ eventId });

  } catch (error: any) {
    console.error("[ResultsAPI] Unhandled error while triggering Inngest job",error);
    console.error("[ResultsAPI] Error message:", error?.message);
    console.error("[ResultsAPI] Error stack:", error?.stack);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
