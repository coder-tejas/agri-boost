import { db } from "@/configs/db";
import { userSoilAnalysis } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm"
export async function GET() {
    const user = await currentUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    if (!userEmail) return new NextResponse("User has no email", { status: 400 });
    const result = await db.select().from(userSoilAnalysis).where(eq(userSoilAnalysis.userEmail, userEmail));
    return NextResponse.json(result);
}