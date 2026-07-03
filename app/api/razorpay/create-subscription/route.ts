import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { razorpay } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.primaryEmailAddress.emailAddress;
    const { plan } = await req.json();

    if (plan !== "standard" && plan !== "pro") {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const planId = plan === "standard"
      ? process.env.RAZORPAY_STANDARD_PLAN_ID
      : process.env.RAZORPAY_PRO_PLAN_ID;

    if (!planId) {
      return NextResponse.json({ error: "Plan not configured" }, { status: 500 });
    }

    const subscription: { short_url?: string } = await razorpay.subscriptions.create({
      plan_id: planId,
      total_count: 12,
      customer_notify: true,
      notify_info: {
        notify_email: email,
      },
      notes: {
        userEmail: email,
        plan,
      },
    } as any);

    return NextResponse.json({ url: subscription.short_url });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
