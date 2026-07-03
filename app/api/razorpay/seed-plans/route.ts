import { NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";

export async function POST() {
  try {
    const standardPlan = await razorpay.plans.create({
      period: "monthly",
      interval: 1,
      item: {
        name: "Standard",
        amount: 29900,
        currency: "INR",
        description: "Perfect for small to medium farms",
      },
    });

    const proPlan = await razorpay.plans.create({
      period: "monthly",
      interval: 1,
      item: {
        name: "Pro",
        amount: 79900,
        currency: "INR",
        description: "For large-scale commercial farming operations",
      },
    });

    return NextResponse.json({
      standard: { id: standardPlan.id },
      pro: { id: proPlan.id },
      message:
        "Set these as RAZORPAY_STANDARD_PLAN_ID and RAZORPAY_PRO_PLAN_ID in .env",
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
