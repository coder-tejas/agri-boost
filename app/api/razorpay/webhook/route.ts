import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/configs/db";
import { subscriptions } from "@/configs/schema";
import { eq } from "drizzle-orm";

function verifyWebhookSignature(body: string, signature: string, secret: string): boolean {
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature || !process.env.RAZORPAY_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
    }

    if (!verifyWebhookSignature(body, signature, process.env.RAZORPAY_WEBHOOK_SECRET)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    const payload = event.payload;
    const subscriptionEntity = payload.subscription?.entity;

    if (!subscriptionEntity) {
      return NextResponse.json({ error: "No subscription entity" }, { status: 400 });
    }

    const razorpaySubId = subscriptionEntity.id;

    const existingSub = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.razorpaySubscriptionId, razorpaySubId));

    const email = subscriptionEntity.notes?.userEmail;

    switch (event.event) {
      case "subscription.activated": {
        const plan = subscriptionEntity.notes?.plan === "pro" ? "pro" : "standard";

        if (existingSub.length > 0) {
          await db
            .update(subscriptions)
            .set({
              razorpayCustomerId: subscriptionEntity.customer_id,
              plan,
              status: "active",
              currentPeriodEnd: subscriptionEntity.current_end
                ? new Date(subscriptionEntity.current_end * 1000).toISOString()
                : null,
            })
            .where(eq(subscriptions.razorpaySubscriptionId, razorpaySubId));
        } else if (email) {
          await db.insert(subscriptions).values({
            userEmail: email,
            razorpayCustomerId: subscriptionEntity.customer_id,
            razorpaySubscriptionId: razorpaySubId,
            plan,
            status: "active",
            currentPeriodEnd: subscriptionEntity.current_end
              ? new Date(subscriptionEntity.current_end * 1000).toISOString()
              : null,
          });
        }
        break;
      }

      case "subscription.charged": {
        if (existingSub.length > 0) {
          await db
            .update(subscriptions)
            .set({
              status: "active",
              currentPeriodEnd: subscriptionEntity.current_end
                ? new Date(subscriptionEntity.current_end * 1000).toISOString()
                : null,
            })
            .where(eq(subscriptions.razorpaySubscriptionId, razorpaySubId));
        }
        break;
      }

      case "subscription.cancelled":
      case "subscription.completed":
      case "subscription.expired": {
        if (existingSub.length > 0) {
          await db
            .update(subscriptions)
            .set({
              plan: "free",
              status: event.event === "subscription.cancelled" ? "cancelled" : "completed",
              razorpaySubscriptionId: null,
              currentPeriodEnd: null,
            })
            .where(eq(subscriptions.razorpaySubscriptionId, razorpaySubId));
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
