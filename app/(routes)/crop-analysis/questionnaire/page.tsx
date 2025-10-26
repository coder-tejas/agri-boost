"use client";
import { useState } from "react";
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
  const t = useTranslations("crop-analysis.questionnaire");
  const { errors, validateStep, validateForm, clearError } =
    useFormValidation();

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
    // Validate entire form before submission
    if (validateForm(formData)) {
      // Form is valid, proceed with submission
      console.log("Form submitted:", formData);

      const getData = localStorage.getItem("USER_OTHER_DATA");
      if (getData !== null) {
        localStorage.removeItem("USER_OTHER_DATA");
      }
      const userFormData: Partial<FormData> = formData;
      const userDataString = JSON.stringify(userFormData);
      localStorage.setItem("USER_OTHER_DATA", userDataString);
      // const getSoilData = localStorage.getItem("USER_SOIL_DATA");
      // const soil_data = getSoilData?.replace(/^data:image\/\w+;base64,/, "");
      router.push("/crop-analysis/result");
      // Navigate to results page or submit to API
      // const result = await axios.post("/api/results", {
      //   soil_test_data: soil_data,
      //   other_data: userDataString,
      // });
      // const jobid = result.data.jobId;
      // console.log("Got Gob Id : ", result.data.jobId);
      // if (!jobid) {
      //   throw new Error("NO job id received");
      // }
      // console.log("🔄 Job started with ID:", jobid);
      // try {
      //   const completedRun = await getRunOutput(jobid);
      //   console.log("Task Completed -> ", completedRun.output);
      // } catch (err) {
      //   console.error("Error in polling ");
      // }
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
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionnairePage;
