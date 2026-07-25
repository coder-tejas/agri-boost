import { inngest } from "@/inngest/client";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { checkAndIncrement, type Plan } from "@/lib/plan-limits";
import { db } from "@/configs/db";
import { subscriptions } from "@/configs/schema";
import { eq } from "drizzle-orm";
import logger from "@/lib/logger";

export async function POST(req: NextRequest) {
  logger.info("Incoming POST /api/results");

  try {
    const body = await req.json();

    const soil_test_data = body.soil_test_data;
    const other_data = body.other_data;

    if (!soil_test_data || !other_data) {
      return NextResponse.json(
        { error: "Missing soil test or other data" },
        { status: 400 }
      );
    }

    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.primaryEmailAddress?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: "User has no email" }, { status: 400 });
    }

    const existingSub = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userEmail, email));
    const plan: Plan = (existingSub.length > 0 ? existingSub[0].plan : "free") as Plan;

    const { allowed, remaining } = await checkAndIncrement(email, "analysis", plan);
    if (!allowed) {
      return NextResponse.json(
        { error: "Monthly analysis limit reached", remaining },
        { status: 403 }
      );
    }

    logger.info("Sending event to Inngest");

    const result = await inngest.send({
      name: "ai/generate-crop-yield",
      data: {
        userEmail: email,
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
      logger.error({ result }, "Inngest did not return event ID");
      return NextResponse.json(
        { error: "Failed to start background job" },
        { status: 500 }
      );
    }

    logger.info({ eventId }, "Inngest job triggered successfully");

    return NextResponse.json({ eventId });

  } catch (error: unknown) {
    logger.error({ error }, "Unhandled error while triggering Inngest job");
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
