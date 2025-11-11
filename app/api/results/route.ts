import { inngest } from "@/inngest/client";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("Received Req For Result");
    const body = await req.json();
    console.log("body received = ",body);
    
    const soil_test_data = body.soil_test_data;
    const other_data = body.other_data;
    const user = await currentUser();
    console.log("current user = ",user);
    if (!soil_test_data || !other_data) {
      return NextResponse.json(
        { error: "Missing soil test or other data" },
        { status: 400 }
      );
    }
    const result = await inngest.send({
      name: "ai/generate-crop-yeild",
      data: {
        userEmail: user?.primaryEmailAddress?.emailAddress,
        userName : user?.firstName?.trim(),
        soil_test_file: soil_test_data,
        other_data: other_data,
      },
    });

    return NextResponse.json({ jobId: result.ids[0] });
  } catch (error) {
    console.error("Error in AI Result generation API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
