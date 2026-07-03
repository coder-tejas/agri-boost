import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { razorpay } from "@/lib/razorpay";
import { db } from "@/configs/db";
import { subscriptions } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function GET(_req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.primaryEmailAddress.emailAddress;
    const existingSub = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userEmail, email));

    if (!existingSub.length || !existingSub[0].razorpaySubscriptionId) {
      return NextResponse.json({ error: "No subscription found" }, { status: 404 });
    }

    const sub = await razorpay.subscriptions.fetch(existingSub[0].razorpaySubscriptionId);

    return NextResponse.json({
      id: sub.id,
      status: sub.status,
      planId: sub.plan_id,
      currentStart: sub.current_start,
      currentEnd: sub.current_end,
      totalCount: sub.total_count,
      paidCount: sub.paid_count,
      remainingCount: sub.remaining_count,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.primaryEmailAddress.emailAddress;
    const { action } = await req.json();

    const existingSub = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userEmail, email));

    if (!existingSub.length || !existingSub[0].razorpaySubscriptionId) {
      return NextResponse.json({ error: "No subscription found" }, { status: 404 });
    }

    if (action === "cancel") {
      await razorpay.subscriptions.cancel(existingSub[0].razorpaySubscriptionId);

      await db
        .update(subscriptions)
        .set({
          plan: "free",
          status: "cancelled",
          razorpaySubscriptionId: null,
          currentPeriodEnd: null,
        })
        .where(eq(subscriptions.userEmail, email));

      return NextResponse.json({ success: true, message: "Subscription cancelled" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
