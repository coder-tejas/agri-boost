"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

type UsageInfo = {
  used: number;
  remaining: number | "unlimited";
  limit: number;
};

type SubscriptionInfo = {
  plan: string;
  status: string;
  currentPeriodEnd: string | null;
  usage: Record<string, UsageInfo>;
};

export function useUsage() {
  const { user, isSignedIn } = useUser();
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    const fetchUsage = async () => {
      try {
        const res = await fetch("/api/user/subscription");
        if (res.ok) {
          const data = await res.json();
          setSubscription(data);
        }
      } catch {
        console.error("Failed to fetch subscription");
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
  }, [isSignedIn]);

  const checkLimit = (feature: "analysis" | "chat" | "expert_contact"): { allowed: boolean; remaining: number | "unlimited"; used: number; limit: number } => {
    const usage = subscription?.usage?.[feature];
    if (!usage) {
      return { allowed: true, remaining: "unlimited", used: 0, limit: Infinity };
    }
    return {
      allowed: usage.remaining === "unlimited" || usage.remaining > 0,
      remaining: usage.remaining,
      used: usage.used,
      limit: usage.limit,
    };
  };

  return {
    subscription,
    loading,
    checkLimit,
    plan: subscription?.plan || "free",
  };
}
