"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Download,
  TrendingUp,
  Droplets,
  Sprout,
  Shield,
  AlertTriangle,
  CheckCircle,
  Leaf,
  Sun,
  CloudRain,
  Beaker,
} from "lucide-react";
import Link from "next/link";
import AppHeader from "@/app/_components/AppHeader";
import { useTranslations } from "next-intl";
import { useState, useEffect, useRef } from "react";
import { getRunOutput } from "@/services/GlobalApi";
import axios from "axios";
import { useRouter } from "next/navigation";

// Shimmer loading component
const ShimmerCard = () => (
  <Card className="bg-white border border-gray-200 shadow rounded-xl overflow-hidden">
    <CardHeader className="p-4 sm:p-6">
      <Skeleton className="h-6 w-full" />
    </CardHeader>
    <CardContent className="p-4 sm:p-6 pt-0 space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-5/6" />
    </CardContent>
  </Card>
);

const ResultsPage = () => {
  const t = useTranslations("crop-analysis.results");
  const [isLoading, setIsLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState(null);
  const router = useRouter();
  const hasFetchedRef = useRef(false);

  async function downloadPDF() {
    try {
      const res = await fetch("/api/convert-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisData }),
      });

      if (!res.ok) throw new Error("Failed to download PDF");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Farm_Analysis_Report.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  }
async function delete_analysis_data() {
  try {
    const res = await axios.delete("/api/saved-data");
    if (res.status !== 200) {
      console.warn("⚠️ Backend failed to reset data");
      return;
    }
    localStorage.removeItem("ANALYSIS_RESULT");
    localStorage.removeItem("USER_SOIL_DATA");
    localStorage.removeItem("USER_OTHER_DATA");

    router.push("/crop-analysis/upload");
  } catch (err) {
    console.error("❌ Error resetting analysis data:", err.message || err);
  }
}

useEffect(() => {
  const fetchAnalysisData = async () => {
    if (hasFetchedRef.current) {
      console.log("[ResultsPage] Fetch already executed, skipping");
      return;
    }
    hasFetchedRef.current = true;

    console.log("[ResultsPage] Starting analysis data pipeline");
    setIsLoading(true);

    try {
      // 1. Cache
      const cached = localStorage.getItem("ANALYSIS_RESULT");
      if (cached) {
        console.log("[ResultsPage] Loaded analysis from local cache");
        setAnalysisData(JSON.parse(cached));
        return;
      }

      console.log("[ResultsPage] No cache found, checking server");

      // 2. Server saved result
      const savedRes = await fetch("/api/saved-data");
      const savedData = await savedRes.json();

      if (Array.isArray(savedData) && savedData.length > 0) {
        const analysis = savedData[0]?.analysis;
        if (analysis) {
          console.log("[ResultsPage] Loaded normalized analysis from server");
          localStorage.setItem("ANALYSIS_RESULT", JSON.stringify(analysis));
          setAnalysisData(analysis);
          return;
        }
      }

      console.log("[ResultsPage] No stored analysis found, triggering new run");

      // 3. Trigger new run
      const userData = localStorage.getItem("USER_OTHER_DATA");
      const soilData = localStorage.getItem("USER_SOIL_DATA");

      if (!userData || !soilData) {
        console.error("[ResultsPage] Missing input data", {
          hasUserData: !!userData,
          hasSoilData: !!soilData,
        });
        throw new Error("Missing required data");
      }

      const base64Soil = soilData.replace(/^data:image\/\w+;base64,/, "");

      console.log("[ResultsPage] Sending data to /api/results to start Inngest job");

      const result = await axios.post("/api/results", {
        soil_test_data: base64Soil,
        other_data: JSON.parse(userData),
      });

      const runId = result?.data?.eventId;
      if (!runId) {
        console.error("[ResultsPage] No runId returned from /api/results", result.data);
        throw new Error("No runId returned");
      }

      console.log("[ResultsPage] Inngest job started", { runId });

      const completedRun = await getRunOutput(runId);

      console.log("[ResultsPage] Inngest job completed", {
        status: completedRun?.status,
      });

      const analysis = completedRun?.output?.analysis;
      if (!analysis) {
        console.error("[ResultsPage] Completed run has no normalized analysis output", completedRun);
        throw new Error("Invalid analysis output");
      }

      console.log("[ResultsPage] Analysis successfully received and normalized");

      localStorage.setItem("ANALYSIS_RESULT", JSON.stringify(analysis));
      setAnalysisData(analysis);

    } catch (err) {
      console.error("[ResultsPage] Analysis pipeline failed", err);
    } finally {
      console.log("[ResultsPage] Analysis pipeline finished");
      setIsLoading(false);
    }
  };

  fetchAnalysisData();
}, []);





  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <AppHeader>
          <header className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center animate-pulse">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-700" />
                </div>
                <h1 className="text-lg sm:text-2xl font-bold">
                  Analyzing Your Farm Data...
                </h1>
              </div>
            </div>
          </header>
        </AppHeader>

        <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <ShimmerCard />
              <ShimmerCard />
              <ShimmerCard />
              <ShimmerCard />
              <ShimmerCard />
              <ShimmerCard />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
        <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          <div className="max-w-2xl mx-auto text-center">
            <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              No Analysis Data Available
            </h2>
            <p className="text-gray-600 mb-6">
              Please complete the soil analysis form first.
            </p>
            <Button asChild>
              <Link href="/crop-analysis/questionnaire">
                Go to Questionnaire
              </Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const {
    soil_summary = {},
    recommended_crops = [],
    fertilizer_plan = [],
    pesticide_plan = [],
    irrigation_strategy = {},
    soil_improvement_plan = [],
    climate_specific_tips = [],
    sustainability_practices = [],
    estimated_yield_increase_percent = "N/A",
    confidence_score = "N/A",
  } = analysisData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <AppHeader>
        <header className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 w-full">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-700" />
                </div>
                <h1 className="text-lg sm:text-2xl font-bold">
                  Analysis Results
                </h1>
              </div>
            </div>
          </div>
        </header>
      </AppHeader>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Progress */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-4 gap-2">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs sm:text-base font-semibold">
                  ✓
                </div>
                <span className="text-xs sm:text-base font-semibold">
                  Upload
                </span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs sm:text-base font-semibold">
                  ✓
                </div>
                <span className="text-xs sm:text-base font-semibold">Form</span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs sm:text-base font-semibold">
                  ✓
                </div>
                <span className="text-xs sm:text-base font-semibold text-green-600">
                  Results
                </span>
              </div>
            </div>
            <Progress value={100} className="h-2 bg-gray-200" />
          </div>

          {/* Summary Card */}
          <Card className="mb-6 sm:mb-8 bg-gradient-to-r from-green-50 to-emerald-100 border-2 border-green-200 shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-xl sm:text-3xl text-green-700 mb-2">
                    Farm Analysis Complete
                  </CardTitle>
                </div>
                <div className="flex gap-4 sm:gap-6">
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-green-700">
                      {estimated_yield_increase_percent}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Potential Yield Increase
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-green-700">
                      {confidence_score}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Confidence Score
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Soil Summary */}
            {soil_summary && Object.keys(soil_summary).length > 0 && (
              <Card className="bg-white border border-gray-200 shadow-md rounded-xl hover:shadow-xl transition-shadow">
                <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-green-50 to-white">
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <Sprout className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-green-700" />
                    Soil Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-4">
                  {Object.entries(soil_summary).map(([key, value]) => (
                    <div
                      key={key}
                      className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 rounded-r-lg"
                    >
                      <div className="font-semibold text-sm text-green-700 capitalize mb-1">
                        {key.replace(/_/g, " ")}
                      </div>
                      <div className="text-sm text-gray-700">
                        {String(value)}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Recommended Crops */}
            {recommended_crops && recommended_crops.length > 0 && (
              <Card className="bg-white border border-gray-200 shadow-md rounded-xl hover:shadow-xl transition-shadow">
                <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-emerald-50 to-white">
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <Leaf className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-emerald-600" />
                    Recommended Crops
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-3">
                  {recommended_crops.map((crop, index) => (
                    <div
                      key={`crop-${index}`}
                      className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-bold text-base sm:text-lg text-emerald-700 mb-2">
                        {crop?.crop || "Unknown Crop"}
                      </h4>
                      <p className="text-sm text-gray-700">
                        {crop?.reason || "No reason provided"}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Fertilizer Plan */}
            {fertilizer_plan && fertilizer_plan.length > 0 && (
              <Card className="bg-white border border-gray-200 shadow-md rounded-xl hover:shadow-xl transition-shadow lg:col-span-2">
                <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-amber-50 to-white">
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <Beaker className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-amber-600" />
                    Fertilizer Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fertilizer_plan.map((fert, index) => (
                      <div
                        key={`fert-${index}`}
                        className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-bold text-base text-amber-700">
                            {fert?.type || "Unknown Fertilizer"}
                          </h4>
                          <Badge className="bg-amber-600 text-white text-xs">
                            {fert?.quantity_per_acre || "N/A"}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-semibold text-amber-900">
                              Stage:
                            </span>
                            <span className="text-gray-700 ml-2">
                              {fert?.application_stage || "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="font-semibold text-amber-900">
                              Why:
                            </span>
                            <p className="text-gray-700 mt-1">
                              {fert?.rationale || "No rationale provided"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pesticide Plan */}
            {pesticide_plan && pesticide_plan.length > 0 && (
              <Card className="bg-white border border-gray-200 shadow-md rounded-xl hover:shadow-xl transition-shadow lg:col-span-2">
                <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-red-50 to-white">
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-red-600" />
                    Pest Management Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-4">
                  {pesticide_plan.map((pest, index) => (
                    <div
                      key={`pest-${index}`}
                      className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-bold text-base text-red-700">
                          {pest?.pest || "Unknown Pest"}
                        </h4>
                        <Badge
                          variant="outline"
                          className="bg-red-100 text-red-800 text-xs"
                        >
                          {pest?.recommended_pesticide?.split("/")[0]?.trim() ||
                            "N/A"}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-semibold text-red-900">
                            Treatment:
                          </span>
                          <p className="text-gray-700 mt-1">
                            {pest?.recommended_pesticide || "No recommendation"}
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold text-red-900">
                            Method:
                          </span>
                          <p className="text-gray-700 mt-1">
                            {pest?.application_method || "No method specified"}
                          </p>
                        </div>
                        <div className="bg-red-100 border-l-4 border-red-500 p-3 rounded">
                          <span className="font-semibold text-red-900 flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Safety Notes:
                          </span>
                          <p className="text-red-800 mt-1">
                            {pest?.safety_notes || "No safety notes provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Irrigation Strategy */}
            {irrigation_strategy &&
              Object.keys(irrigation_strategy).length > 0 && (
                <Card className="bg-white border border-gray-200 shadow-md rounded-xl hover:shadow-xl transition-shadow">
                  <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-white">
                    <CardTitle className="flex items-center text-lg sm:text-xl">
                      <Droplets className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-600" />
                      Irrigation Strategy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 space-y-4">
                    {Object.entries(irrigation_strategy).map(([key, value]) => (
                      <div
                        key={key}
                        className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
                      >
                        <div className="font-semibold text-sm text-blue-700 capitalize mb-2">
                          {key.replace(/_/g, " ")}
                        </div>
                        <div className="text-sm text-gray-700">
                          {String(value)}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

            {/* Soil Improvement Plan */}
            {soil_improvement_plan && soil_improvement_plan.length > 0 && (
              <Card className="bg-white border border-gray-200 shadow-md rounded-xl hover:shadow-xl transition-shadow">
                <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-purple-50 to-white">
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-purple-600" />
                    Soil Improvement Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-3">
                  {soil_improvement_plan.map((item, index) => (
                    <div
                      key={`soil-${index}`}
                      className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg"
                    >
                      <h4 className="font-bold text-base text-purple-700 mb-2">
                        {item?.method || "Unknown Method"}
                      </h4>
                      <p className="text-sm text-gray-700 mb-2">
                        {item?.benefit || "No benefit specified"}
                      </p>
                      <Badge
                        variant="outline"
                        className="bg-purple-100 text-purple-800 text-xs"
                      >
                        {item?.duration || "N/A"}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Climate Specific Tips */}
            {climate_specific_tips && climate_specific_tips.length > 0 && (
              <Card className="bg-white border border-gray-200 shadow-md rounded-xl hover:shadow-xl transition-shadow">
                <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-orange-50 to-white">
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <Sun className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-orange-600" />
                    Climate Specific Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-3">
                  {climate_specific_tips.map((tip, index) => (
                    <div
                      key={`climate-${index}`}
                      className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg"
                    >
                      <div className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-orange-600 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-sm text-orange-700 mb-1">
                            {tip?.tip || "No tip available"}
                          </p>
                          <p className="text-sm text-gray-700">
                            {tip?.reason || "No reason provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Sustainability Practices */}
            {sustainability_practices &&
              sustainability_practices.length > 0 && (
                <Card className="bg-white border border-gray-200 shadow-md rounded-xl hover:shadow-xl transition-shadow">
                  <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-teal-50 to-white">
                    <CardTitle className="flex items-center text-lg sm:text-xl">
                      <CloudRain className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-teal-600" />
                      Sustainability Practices
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 space-y-3">
                    {sustainability_practices.map((practice, index) => (
                      <div
                        key={`sustainability-${index}`}
                        className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-lg"
                      >
                        <h4 className="font-bold text-base text-teal-700 mb-2">
                          {practice?.practice || "Unknown Practice"}
                        </h4>
                        <p className="text-sm text-gray-700">
                          {practice?.impact || "No impact specified"}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
          </div>

          {/* CTA */}
          <div className="mt-8 sm:mt-12 text-center">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 sm:p-8 rounded-xl border-2 border-green-200 shadow-lg">
              <h3 className="text-xl sm:text-2xl font-bold text-green-700 mb-3 sm:mb-4">
                Ready to Implement These Recommendations?
              </h3>
              <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 max-w-2xl mx-auto">
                Download your complete farm analysis report and start improving
                your yields today.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button
                  size="lg"
                  className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto shadow-lg hover:shadow-xl transition-all"
                  onClick={downloadPDF}
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Download Full Report
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 border-2 border-green-600 text-green-700 hover:bg-green-50 w-full sm:w-auto"
                  onClick={delete_analysis_data}
                >
                  New Analysis
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;
