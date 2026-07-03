import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/configs/db";
import { subscriptions, usageLogs } from "@/configs/schema";
import { eq, and } from "drizzle-orm";
import { type Plan, type Feature, PLAN_LIMITS, getRemaining } from "@/lib/plan-limits";

export async function GET(_req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.primaryEmailAddress.emailAddress;
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const existingSub = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userEmail, email));

    const plan: Plan = (existingSub.length > 0 ? existingSub[0].plan : "free") as Plan;
    const status = existingSub.length > 0 ? existingSub[0].status : "active";
    const currentPeriodEnd = existingSub.length > 0 ? existingSub[0].currentPeriodEnd : null;

    const usageRows = await db
      .select()
      .from(usageLogs)
      .where(and(eq(usageLogs.userEmail, email), eq(usageLogs.month, month)));

    const usage: Record<string, number> = {};
    for (const row of usageRows) {
      usage[row.feature] = row.count;
    }

    const usageWithRemaining: Record<string, { used: number; remaining: number | "unlimited"; limit: number }> = {};
    for (const feature of ["analysis", "chat", "expert_contact"] as Feature[]) {
      const used = usage[feature] || 0;
      const limit = PLAN_LIMITS[plan][feature];
      const remaining = getRemaining(plan, feature, used);
      usageWithRemaining[feature] = {
        used,
        remaining: limit === Infinity ? "unlimited" : remaining,
        limit,
      };
    }

    return NextResponse.json({
      plan,
      status,
      currentPeriodEnd,
      usage: usageWithRemaining,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
