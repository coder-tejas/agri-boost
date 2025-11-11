// /app/api/saved-data/route.ts
import { db } from "@/configs/db";
import { userSoilAnalysis } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

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
  } catch (error: any) {
    console.error("❌ API /saved-data error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
  export async function DELETE() {
  try{
      console.log("Received Req for DElete ");
      
      const user = await currentUser();
      if (!user) return new NextResponse("Unauthorized", { status: 401 });
      const userEmail = user.primaryEmailAddress?.emailAddress;
      if(!userEmail) return new NextResponse("User has no email",{status:400});
      await db.delete(userSoilAnalysis).where(eq(userSoilAnalysis.userEmail,userEmail));
      return NextResponse.json("Data Deleted Successfully",{status:200})
  } catch(error){
      console.error("❌ API /reset-data error:", error);
      return NextResponse.json(
        { error: error.message || "Internal Server Error" },
        { status: 500 }
      );
  }

  }