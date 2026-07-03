"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function ResultError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Analysis Failed
        </h2>
        <p className="text-gray-600 mb-6">
          {error.message || "The analysis could not be completed. Please try again."}
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/crop-analysis/upload">
              <Home className="w-4 h-4" />
              Start Over
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
