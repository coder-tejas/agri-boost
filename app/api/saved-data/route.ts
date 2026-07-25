// /app/api/saved-data/route.ts
import { db } from "@/configs/db";
import { userSoilAnalysis } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import logger from "@/lib/logger";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const userEmail = user.primaryEmailAddress?.emailAddress;
    if (!userEmail) return new NextResponse("User has no email", { status: 400 });

    const result = await db
      .select()
      .from(userSoilAnalysis)
      .where(eq(userSoilAnalysis.userEmail, userEmail));

    return NextResponse.json(result);
  } catch (error: unknown) {
    logger.error({ error }, "API /saved-data error");
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    logger.info("Received DELETE request");
    const user = await currentUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });
    const userEmail = user.primaryEmailAddress?.emailAddress;
    if (!userEmail) return new NextResponse("User has no email", { status: 400 });
    await db.delete(userSoilAnalysis).where(eq(userSoilAnalysis.userEmail, userEmail));
    return NextResponse.json("Data Deleted Successfully", { status: 200 });
  } catch (error: unknown) {
    logger.error({ error }, "API /reset-data error");
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}