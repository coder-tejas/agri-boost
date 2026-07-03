"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function PricingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Pricing Error
        </h2>
        <p className="text-gray-600 mb-6">
          {error.message || "Failed to load pricing page"}
        </p>
        <Button onClick={reset} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Reload
        </Button>
      </div>
    </div>
  );
}
