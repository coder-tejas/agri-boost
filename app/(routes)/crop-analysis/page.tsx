"use client";

import { useTranslations } from "next-intl";
import React from "react";

function CropAnalysis() {
  // Specify the namespace from your JSON structure
  const t = useTranslations('crop-analysis');
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">
        {t('title')}
      </h1>
      <p className="text-gray-600">
        {t('description')}
      </p>
      
      {/* Example of nested translations */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">
          {t('form.heading')}
        </h2>
        <p>{t('form.instructions')}</p>
      </div>
    </div>
  );
}

export default CropAnalysis;