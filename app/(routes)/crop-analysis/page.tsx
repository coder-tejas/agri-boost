"use client";
import { useTranslations } from "next-intl";
import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function CropAnalysis() {
  // Specify the namespace from your JSON structure
  const router = useRouter();
      useEffect(() => {
        router.replace("/crop-analysis/upload");
      });
  return (
    <div className="p-6">
      
    </div>
  );
}

export default CropAnalysis;