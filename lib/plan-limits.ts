import { eq, and, sql } from "drizzle-orm";
import { db } from "@/configs/db";
import { usageLogs } from "@/configs/schema";

export type Plan = "free" | "standard" | "pro";
export type Feature = "analysis" | "chat" | "expert_contact";

export const PLAN_LIMITS: Record<Plan, Record<Feature, number>> = {
  free: {
    analysis: 2,
    chat: 50,
    expert_contact: 0,
  },
  standard: {
    analysis: 10,
    chat: Infinity,
    expert_contact: 3,
  },
  pro: {
    analysis: Infinity,
    chat: Infinity,
    expert_contact: Infinity,
  },
};

export const PLAN_FEATURES: Record<Plan, { label: string; included: boolean }[]> = {
  free: [
    { label: "2 Crop Analyses per month", included: true },
    { label: "50 AI Chat Messages per month", included: true },
    { label: "Basic Community Access", included: true },
    { label: "Expert Contact", included: false },
    { label: "PDF Report Downloads", included: true },
    { label: "Historical Data Storage (30 days)", included: true },
  ],
  standard: [
    { label: "10 Crop Analyses per month", included: true },
    { label: "Unlimited AI Chat Messages", included: true },
    { label: "Full Community Access", included: true },
    { label: "3 Expert Contacts per month", included: true },
    { label: "Unlimited PDF Report Downloads", included: true },
    { label: "Historical Data Storage (1 year)", included: true },
  ],
  pro: [
    { label: "Unlimited Crop Analyses", included: true },
    { label: "Unlimited AI Chat Messages", included: true },
    { label: "Full Community Access", included: true },
    { label: "Unlimited Expert Contacts", included: true },
    { label: "Unlimited PDF Report Downloads", included: true },
    { label: "Unlimited Historical Data Storage", included: true },
  ],
};

export const PLAN_PRICES: Record<Plan, { amount: number; currency: string; interval: string } | null> = {
  free: null,
  standard: { amount: 299, currency: "inr", interval: "month" },
  pro: { amount: 799, currency: "inr", interval: "month" },
};

export const RAZORPAY_PLAN_IDS: Record<"standard" | "pro", string | undefined> = {
  standard: process.env.RAZORPAY_STANDARD_PLAN_ID,
  pro: process.env.RAZORPAY_PRO_PLAN_ID,
};

export function getRemaining(plan: Plan, feature: Feature, used: number): number {
  const limit = PLAN_LIMITS[plan][feature];
  if (limit === Infinity) return Infinity;
  return Math.max(0, limit - used);
}

export function isLimitReached(plan: Plan, feature: Feature, used: number): boolean {
  const limit = PLAN_LIMITS[plan][feature];
  if (limit === Infinity) return false;
  return used >= limit;
}

export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export async function checkAndIncrement(
  email: string,
  feature: Feature,
  plan: Plan
): Promise<{ allowed: boolean; remaining: number | "unlimited" }> {
  if (process.env.NODE_ENV === "development") {
    return { allowed: true, remaining: "unlimited" };
  }

  const month = getCurrentMonth();
  const limit = PLAN_LIMITS[plan][feature];
  if (limit === Infinity) {
    await db
      .insert(usageLogs)
      .values({ userEmail: email, feature, count: 1, month })
      .onConflictDoUpdate({
        target: [usageLogs.userEmail, usageLogs.feature, usageLogs.month],
        set: { count: sql`${usageLogs.count} + 1` },
      });
    return { allowed: true, remaining: "unlimited" };
  }

  const existing = await db
    .select()
    .from(usageLogs)
    .where(
      and(
        eq(usageLogs.userEmail, email),
        eq(usageLogs.feature, feature),
        eq(usageLogs.month, month)
      )
    )
    .limit(1);

  const currentCount = existing[0]?.count ?? 0;

  if (currentCount >= limit) {
    return { allowed: false, remaining: 0 };
  }

  if (existing.length > 0) {
    await db
      .update(usageLogs)
      .set({ count: sql`${usageLogs.count} + 1` })
      .where(
        and(
          eq(usageLogs.userEmail, email),
          eq(usageLogs.feature, feature),
          eq(usageLogs.month, month)
        )
      );
  } else {
    await db.insert(usageLogs).values({
      userEmail: email,
      feature,
      count: 1,
      month,
    });
  }

  return { allowed: true, remaining: limit - currentCount - 1 };
}
