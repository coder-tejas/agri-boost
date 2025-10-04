"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Download, Share2, TrendingUp, Droplets, Sprout, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import Link from "next/link";

const ResultsPage = () => {
  // Simulated AI recommendations data
  const soilAnalysis = {
    ph: 6.2,
    phStatus: "Slightly Acidic",
    nitrogen: "Low",
    phosphorus: "Adequate", 
    potassium: "High",
    organicMatter: "Medium"
  };

  const recommendations = {
    fertilizer: [
      { name: "Urea", amount: "150 kg/acre", timing: "Pre-sowing", priority: "High" },
      { name: "DAP", amount: "100 kg/acre", timing: "At sowing", priority: "High" },
      { name: "Potash", amount: "50 kg/acre", timing: "Flowering stage", priority: "Medium" }
    ],
    crops: [
      { name: "Wheat", suitability: 95, expectedYield: "32-35 quintals/acre" },
      { name: "Mustard", suitability: 88, expectedYield: "18-20 quintals/acre" },
      { name: "Barley", suitability: 82, expectedYield: "28-30 quintals/acre" }
    ],
    irrigation: {
      method: "Drip Irrigation",
      frequency: "Every 5-7 days",
      amount: "25-30mm per irrigation"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/questionnaire">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Form
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-crop-gold rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Your Results</h1>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Progress Complete */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-crop-green rounded-full flex items-center justify-center text-white font-semibold">
                  ✓
                </div>
                <span className="text-crop-green font-semibold">Upload Complete</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-crop-green rounded-full flex items-center justify-center text-white font-semibold">
                  ✓
                </div>
                <span className="text-crop-green font-semibold">Fill Questionnaire</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                  3
                </div>
                <span className="font-semibold text-primary">Get Results</span>
              </div>
            </div>
            <Progress value={100} className="h-2" />
          </div>

          {/* Summary Card */}
          <Card className="mb-8 bg-gradient-to-r from-primary/5 to-crop-green/5 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl text-primary">Analysis Complete!</CardTitle>
                  <CardDescription className="text-lg mt-2">
                    Here are your personalized crop recommendations based on your soil test and farm details
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-crop-green">85%</div>
                  <div className="text-sm text-muted-foreground">Yield Improvement Potential</div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Soil Health Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Sprout className="w-6 h-6 mr-3 text-earth-dark" />
                  Soil Health Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-accent rounded-lg">
                    <div className="text-2xl font-bold text-primary">{soilAnalysis.ph}</div>
                    <div className="text-sm text-muted-foreground">pH Level</div>
                    <Badge variant="secondary" className="mt-1">{soilAnalysis.phStatus}</Badge>
                  </div>
                  <div className="text-center p-4 bg-accent rounded-lg">
                    <div className="text-2xl font-bold text-crop-green">{soilAnalysis.organicMatter}</div>
                    <div className="text-sm text-muted-foreground">Organic Matter</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Nitrogen (N)</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant={soilAnalysis.nitrogen === "Low" ? "destructive" : "secondary"}>
                        {soilAnalysis.nitrogen}
                      </Badge>
                      {soilAnalysis.nitrogen === "Low" && <AlertTriangle className="w-4 h-4 text-destructive" />}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Phosphorus (P)</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{soilAnalysis.phosphorus}</Badge>
                      <CheckCircle className="w-4 h-4 text-crop-green" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Potassium (K)</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{soilAnalysis.potassium}</Badge>
                      <CheckCircle className="w-4 h-4 text-crop-green" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Crops */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Sprout className="w-6 h-6 mr-3 text-crop-green" />
                  Recommended Crops
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendations.crops.map((crop, index) => (
                  <div key={index} className="p-4 bg-accent rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-lg">{crop.name}</h4>
                      <Badge className="bg-crop-green text-white">
                        {crop.suitability}% Match
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Expected Yield: {crop.expectedYield}</span>
                      <Progress value={crop.suitability} className="w-24 h-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Fertilizer Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Shield className="w-6 h-6 mr-3 text-primary" />
                  Fertilizer Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendations.fertilizer.map((fert, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{fert.name}</h4>
                      <Badge variant={fert.priority === "High" ? "destructive" : "secondary"}>
                        {fert.priority} Priority
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <span>Amount: {fert.amount}</span>
                      <span>Timing: {fert.timing}</span>
                    </div>
                  </div>
                ))}
                
                <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h5 className="font-semibold text-primary mb-2">💡 Pro Tip</h5>
                  <p className="text-sm text-muted-foreground">
                    Apply fertilizers based on soil moisture and weather conditions. Split nitrogen application 
                    for better efficiency and reduced environmental impact.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Irrigation Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Droplets className="w-6 h-6 mr-3 text-blue-500" />
                  Irrigation Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-accent rounded-lg">
                  <h4 className="font-semibold text-lg mb-3">Recommended: {recommendations.irrigation.method}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frequency:</span>
                      <span className="font-medium">{recommendations.irrigation.frequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount per irrigation:</span>
                      <span className="font-medium">{recommendations.irrigation.amount}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="font-semibold text-blue-800 mb-2">💧 Water Conservation Benefits</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• 30-40% water savings compared to flood irrigation</li>
                    <li>• Better nutrient uptake efficiency</li>
                    <li>• Reduced weed growth and disease pressure</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="mt-12 text-center">
            <div className="bg-accent p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-accent-foreground mb-4">
                Ready to Implement These Recommendations?
              </h3>
              <p className="text-accent-foreground/80 mb-6 max-w-2xl mx-auto">
                Download your personalized report or start a new analysis for a different field
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6">
                  <Download className="w-5 h-5 mr-2" />
                  Download Full Report
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
                  <Link href="/">
                    Analyze Another Field
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;