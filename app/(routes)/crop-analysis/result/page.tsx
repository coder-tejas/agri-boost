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
import {
  ArrowLeft,
  Download,
  Share2,
  TrendingUp,
  Droplets,
  Sprout,
  Shield,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import AppHeader from "@/app/_components/AppHeader";
import { useTranslations } from "next-intl";

const ResultsPage = () => {
  const t = useTranslations("crop-analysis.results");

  const soilAnalysis = {
    ph: 6.2,
    phStatus: "medium",
    nitrogen: "low",
    phosphorus: "adequate",
    potassium: "high",
    organicMatter: "medium",
  };

  const recommendations = {
    fertilizer: [
      {
        name: "Urea",
        amount: "150 kg/acre",
        timing: "preSowing",
        priority: "high",
      },
      {
        name: "DAP",
        amount: "100 kg/acre",
        timing: "atSowing",
        priority: "high",
      },
      {
        name: "Potash",
        amount: "50 kg/acre",
        timing: "flowering",
        priority: "medium",
      },
    ],
    crops: [
      { name: "Wheat", suitability: 95, expectedYield: "32-35 quintals/acre" },
      {
        name: "Mustard",
        suitability: 88,
        expectedYield: "18-20 quintals/acre",
      },
      { name: "Barley", suitability: 82, expectedYield: "28-30 quintals/acre" },
    ],
    irrigation: {
      method: "Drip Irrigation",
      frequency: "Every 5-7 days",
      amount: "25-30mm per irrigation",
    },
  };

  return (
    <div className="min-h-screen text-neutral-800">
      {/* Header */}
      <AppHeader>
        <header className="container mx-auto px-4 py-6 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/crop-analysis/questionnaire">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t("header.backButton")}
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-700" />
                </div>
                <h1 className="text-2xl font-bold">{t("header.title")}</h1>
              </div>
            </div>
          </div>
        </header>
      </AppHeader>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                  ✓
                </div>
                <span className="font-semibold">{t("progress.uploadComplete")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                  ✓
                </div>
                <span className="font-semibold">{t("progress.fillQuestionnaire")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold">
                  3
                </div>
                <span className="font-semibold text-green-600">
                  {t("progress.getResults")}
                </span>
              </div>
            </div>
            <Progress value={100} className="h-2 bg-gray-200" />
          </div>

          {/* Summary */}
          <Card className="mb-8 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 shadow rounded-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl text-green-700">
                    {t("summary.title")}
                  </CardTitle>
                  <CardDescription className="text-lg mt-2">
                    {t("summary.description")}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-700">85%</div>
                  <div className="text-sm text-gray-600">
                    {t("summary.yieldImprovement")}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Soil Health */}
            <Card className="bg-white border border-gray-200 shadow rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Sprout className="w-6 h-6 mr-3 text-green-700" />
                  {t("soilHealth.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100 flex flex-col items-center">
                    <div className="text-2xl font-bold text-green-700">
                      {soilAnalysis.ph}
                    </div>
                    <div className="text-sm text-gray-500">
                      {t("soilHealth.soilHealthScore")}
                    </div>
                    <Badge
                      variant="outline"
                      className="mt-1 bg-yellow-100 text-yellow-800 font-medium"
                    >
                      {t(`soilHealth.status.${soilAnalysis.phStatus}`)}
                    </Badge>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100 flex flex-col items-center">
                    <div className="text-2xl font-bold text-green-700">
                      {t(`soilHealth.status.${soilAnalysis.organicMatter}`)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {t("soilHealth.organicMatter")}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    {
                      label: t("soilHealth.nitrogen"),
                      value: soilAnalysis.nitrogen,
                      variant: "destructive" as const,
                    },
                    {
                      label: t("soilHealth.phosphorus"),
                      value: soilAnalysis.phosphorus,
                      variant: "secondary" as const,
                    },
                    {
                      label: t("soilHealth.potassium"),
                      value: soilAnalysis.potassium,
                      variant: "secondary" as const,
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between"
                    >
                      <span className="font-medium">{item.label}</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant={item.variant}>
                          {t(`soilHealth.status.${item.value}`)}
                        </Badge>
                        {item.variant === "destructive" ? (
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Crops */}
            <Card className="bg-white border border-gray-200 shadow rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Sprout className="w-6 h-6 mr-3 text-green-500" />
                  {t("crops.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recommendations.crops.map((crop, index) => (
                  <div
                    key={index}
                    className="mb-3 p-4 bg-green-50 border border-green-100 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-lg">{crop.name}</h4>
                      <Badge className="bg-green-600 text-white">
                        {crop.suitability}% {t("crops.match")}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 gap-2">
                      <span>
                        {t("crops.expectedYield")}: {crop.expectedYield}
                      </span>
                      <Progress value={crop.suitability} className="w-24 h-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Fertilizers */}
            <Card className="bg-white border border-gray-200 shadow rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Shield className="w-6 h-6 mr-3 text-green-700" />
                  {t("fertilizer.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full mb-4 text-sm">
                  <thead>
                    <tr className="bg-green-50 text-green-700">
                      <th className="p-2 text-left">{t("fertilizer.tableHeaders.fertilizer")}</th>
                      <th className="p-2 text-left">{t("fertilizer.tableHeaders.amount")}</th>
                      <th className="p-2 text-left">{t("fertilizer.tableHeaders.timing")}</th>
                      <th className="p-2 text-left">{t("fertilizer.tableHeaders.priority")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recommendations.fertilizer.map((fert, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{fert.name}</td>
                        <td className="p-2">{fert.amount}</td>
                        <td className="p-2">{t(`fertilizer.timing.${fert.timing}`)}</td>
                        <td className="p-2">
                          <Badge
                            variant={
                              fert.priority === "high"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {t(`fertilizer.priority.${fert.priority}`)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="p-4 border-l-4 border-green-600 bg-green-50 rounded-md mb-2">
                  <h5 className="font-semibold text-green-700 mb-2">
                    {t("fertilizer.proTip.title")}
                  </h5>
                  <p className="text-gray-600 text-sm">
                    {t("fertilizer.proTip.content")}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Irrigation */}
            <Card className="bg-white border border-gray-200 shadow rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Droplets className="w-6 h-6 mr-3 text-blue-500" />
                  {t("irrigation.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg mb-2">
                  <h4 className="font-semibold text-lg mb-3">
                    {t("irrigation.recommended")}: {recommendations.irrigation.method}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("irrigation.frequency")}:</span>
                      <span className="font-medium">
                        {recommendations.irrigation.frequency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {t("irrigation.amountPerIrrigation")}:
                      </span>
                      <span className="font-medium">
                        {recommendations.irrigation.amount}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-md">
                  <h5 className="font-semibold text-blue-700 mb-2">
                    {t("irrigation.waterConservation.title")}
                  </h5>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• {t("irrigation.waterConservation.benefit1")}</li>
                    <li>• {t("irrigation.waterConservation.benefit2")}</li>
                    <li>• {t("irrigation.waterConservation.benefit3")}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <div className="bg-green-50 p-8 rounded-xl border border-green-100">
              <h3 className="text-2xl font-bold text-green-700 mb-4">
                {t("cta.title")}
              </h3>
              <p className="text-green-900 mb-6 max-w-2xl mx-auto">
                {t("cta.description")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Download className="w-5 h-5 mr-2" />
                  {t("cta.downloadButton")}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6 border border-green-600 text-green-700"
                  asChild
                >
                  <Link href="/">{t("cta.analyzeButton")}</Link>
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