"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { Check, CreditCard, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AppHeader from "@/app/_components/AppHeader";

const PLANS = [
  {
    key: "free",
    price: "0",
    currency: "₹",
  },
  {
    key: "standard",
    price: "299",
    currency: "₹",
    popular: true,
  },
  {
    key: "pro",
    price: "799",
    currency: "₹",
  },
];

const FEATURES = [
  { key: "analyses", free: true, standard: true, pro: true },
  { key: "chatMessages", free: true, standard: true, pro: true },
  { key: "community", free: true, standard: true, pro: true },
  { key: "expertContact", free: false, standard: true, pro: true },
  { key: "pdfReports", free: true, standard: true, pro: true },
  { key: "dataStorage", free: true, standard: true, pro: true },
];

const FEATURE_VALUES: Record<string, Record<string, string>> = {
  analyses: { free: "2", standard: "10", pro: "unlimited" },
  chatMessages: { free: "50", standard: "unlimited", pro: "unlimited" },
  community: { free: "basic", standard: "full", pro: "full" },
  expertContact: { free: "none", standard: "3", pro: "unlimited" },
  pdfReports: { free: "limited", standard: "unlimited", pro: "unlimited" },
  dataStorage: { free: "30days", standard: "1year", pro: "unlimited" },
};

export default function PricingPage() {
  const t = useTranslations("pricing");
  const tSidebar = useTranslations("sidebar");
  const { isSignedIn } = useUser();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: string) => {
    if (!isSignedIn) return;
    setLoading(plan);
    try {
      toast.loading("Redirecting to payment...");
      const res = await fetch("/api/razorpay/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
      toast.dismiss();
    } catch {
      toast.dismiss();
      toast.error("Failed to create subscription. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    setLoading("manage");
    try {
      toast.loading("Cancelling subscription...");
      const res = await fetch("/api/razorpay/manage-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });
      const data = await res.json();
      if (data.success) {
        toast.dismiss();
        toast.success("Subscription cancelled successfully");
        window.location.reload();
      }
      toast.dismiss();
    } catch {
      toast.dismiss();
      toast.error("Failed to cancel subscription.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 min-h-screen">
      <AppHeader>
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            {tSidebar("navigation.pricing")}
          </h1>
        </div>
      </AppHeader>
      <section className="pt-8 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 px-4 py-2 rounded-full mb-6">
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                {t("badge")}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
              {t("title")}
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PLANS.map((plan) => (
              <div
                key={plan.key}
                className={`relative flex flex-col rounded-2xl border-2 p-8 ${
                  plan.popular
                    ? "border-primary-500 bg-primary-50/50 dark:bg-primary-950/20 shadow-xl"
                    : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    {t("mostPopular")}
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                    {t(`plans.${plan.key}.name`)}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-6">
                    {t(`plans.${plan.key}.description`)}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-neutral-900 dark:text-white">
                      {plan.currency}
                    </span>
                    <span className="text-5xl font-bold text-neutral-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-neutral-500 dark:text-neutral-400 ml-2">
                      /{t("month")}
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-4 mb-8">
                  {FEATURES.map((feature) => {
                    const included = feature[plan.key as keyof typeof feature] as boolean;
                    const value = FEATURE_VALUES[feature.key]?.[plan.key];
                    return (
                      <div key={feature.key} className="flex items-start gap-3">
                        {included ? (
                          <Check className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-neutral-300 dark:text-neutral-600 mt-0.5 shrink-0" />
                        )}
                        <div>
                          <span className={`text-sm ${included ? "text-neutral-800 dark:text-neutral-200" : "text-neutral-400 dark:text-neutral-500"}`}>
                            {t(`features.${feature.key}.label`)}
                          </span>
                          {included && value && (
                            <span className="block text-xs text-primary-600 dark:text-primary-400 font-medium mt-0.5">
                              {t(`features.${feature.key}.values.${value}`)}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {!isSignedIn ? (
                  <SignInButton mode="redirect">
                    <button className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                      plan.popular
                        ? "bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-700 hover:to-secondary-700 shadow-lg hover:shadow-xl"
                        : "bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white border-2 border-neutral-200 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-600"
                    }`}>
                      {t("cta.signUp")}
                    </button>
                  </SignInButton>
                ) : plan.key === "free" ? (
                  <button
                    disabled
                    className="w-full py-3 rounded-xl font-semibold text-sm bg-neutral-100 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500 cursor-not-allowed"
                  >
                    {t("cta.currentPlan")}
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubscribe(plan.key)}
                    disabled={loading === plan.key}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 ${
                      plan.popular
                        ? "bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-700 hover:to-secondary-700 shadow-lg hover:shadow-xl"
                        : "bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white border-2 border-neutral-200 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-600"
                    }`}
                  >
                    {loading === plan.key ? t("cta.processing") : t("cta.subscribe")}
                  </button>
                )}
              </div>
            ))}
          </div>

          {isSignedIn && (
            <div className="text-center mt-12">
              <button
                onClick={handleManageSubscription}
                disabled={loading === "manage"}
                className="text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium disabled:opacity-50"
              >
                {t("manageSubscription")}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
