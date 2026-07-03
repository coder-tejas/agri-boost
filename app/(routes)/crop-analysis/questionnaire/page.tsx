"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Wheat } from "lucide-react";
import { toast } from "sonner"; // or your toast library
import AppHeader from "@/app/_components/AppHeader";
import { useRouter } from "next/navigation";
import ProgressStepper from "./_components/ProgressStepper";
import StepProgress from "./_components/StepProgress";
import StepContent from "./_components/StepContent";
import NavigationButtons from "./_components/NavigationButton";
import { FormData } from "./_types/FormSchema";
import { useFormValidation } from "./_hooks/useFormValidation";
const TOTAL_STEPS = 4;

const QuestionnairePage = () => {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations("crop-analysis.questionnaire");
  const { errors, validateStep, validateForm, clearError } =
    useFormValidation();

  useEffect(() => {
    const cached = localStorage.getItem("ANALYSIS_RESULT");
    if (cached) {
      router.replace("/crop-analysis/result");
      return;
    }

    fetch("/api/saved-data")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0 && data[0]?.analysis) {
          localStorage.setItem("ANALYSIS_RESULT", JSON.stringify(data[0].analysis));
          router.replace("/crop-analysis/result");
          return;
        }
        setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader>
          <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-neutral-200 rounded-lg animate-pulse" />
                <div className="h-7 w-48 bg-neutral-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </AppHeader>
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="h-6 w-32 bg-neutral-200 rounded animate-pulse" />
            <div className="h-2 w-full bg-neutral-200 rounded animate-pulse" />
            <div className="h-96 w-full bg-neutral-200 rounded-xl animate-pulse" />
            <div className="flex gap-4">
              <div className="h-12 w-32 bg-neutral-200 rounded-lg animate-pulse" />
              <div className="h-12 w-32 bg-neutral-200 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({
    location: "",
    state: "",
    cropType: "",
    landSize: 0,
    irrigationMethod: "",
    fertilizerUse: "",
    pestIssues: "",
    soilType: "",
    previousYield: 0,
    targetYield: 0,
    budget: 0,
    additionalInfoField: "",
  });

  const progressValue = (currentStep / TOTAL_STEPS) * 100;

  const updateFormData = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    clearError(field);
  };

  const handleNext = () => {
    // Validate current step before proceeding
    if (validateStep(currentStep, formData)) {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep((prev) => prev + 1);
        console.log(currentStep);
      }
    } else {
      toast.error("Please Fill All Fields");
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (validateForm(formData)) {
      setIsSubmitting(true);

      try {
        const getData = localStorage.getItem("USER_OTHER_DATA");
        if (getData !== null) {
          localStorage.removeItem("USER_OTHER_DATA");
        }
        const userFormData: Partial<FormData> = formData;
        const userDataString = JSON.stringify(userFormData);
        localStorage.setItem("USER_OTHER_DATA", userDataString);
        toast.success("Form saved! Starting analysis...");
        router.push("/crop-analysis/result");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error(t("validation.pleaseCompleteAllFields"));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader>
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Wheat className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                {t("pageTitle")}
              </h1>
            </div>
          </div>
        </div>
      </AppHeader>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <ProgressStepper currentStep={2} />

          <StepProgress
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            progressValue={progressValue}
          />

          <div className="mb-6 sm:mb-8">
            <StepContent
              currentStep={currentStep}
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          </div>

          <NavigationButtons
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            onNext={handleNext}
            onPrev={handlePrev}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionnairePage;
